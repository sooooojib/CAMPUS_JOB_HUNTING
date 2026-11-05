# UniCareer Community — Security & Privacy Specification

## 1. Authentication & Session Security (Stage 4 Implemented)

1. **Password Hashing & Storage**:
   - High-cost scrypt cryptographic hashing via Better Auth.
   - Plaintext passwords are NEVER stored in the database.
   - Hashed secrets reside exclusively in the `accounts` table and are never returned in user payloads or client session queries.
2. **Session Integrity**:
   - HTTP-only, SameSite: `lax`, and `secure` (in production) cookies (`better-auth.session_token`).
   - 7-day default session lifetime with automatic 24-hour rolling updates and a 5-minute cookie cache.
   - Database-backed session invalidation on logout (`POST /api/auth/sign-out`) and account suspension.
3. **Cryptographic Token Lifecycle**:
   - Password reset tokens expire in 30 minutes (`resetPasswordTokenExpiresIn: 1800`) and are single-use.
   - Verification tokens are signed JWTs with expiration bounds.
   - In development, tokens are captured in an in-memory test store (`lib/email.ts`) and never exposed to unauthenticated public endpoints.
4. **Two-Layer Route Enforcement**:
   - **Layer 1 (Network Edge / Proxy)**: `proxy.ts` rejects unauthenticated requests to protected paths (`/dashboard`, `/opportunities`, `/community`, etc.) with a 307 redirect preserving the target `callbackUrl`.
   - **Layer 2 (Server Component Runtime)**: `app/(dashboard)/layout.tsx` validates session authenticity against PostgreSQL on the server and blocks `SUSPENDED` or `DEACTIVATED` accounts.

---

## 2. Profile Privacy & Sensitive Data Redaction (Stage 5 Implemented)

1. **Private Identifier Redaction**:
   - University Student IDs (`studentId`), personal phone numbers (`phone`), and verification evidence notes (`proofDetails`) are strictly classified as **Private Institutional Data**.
   - The server service `getPublicProfile(targetUserId, viewerUserId)` (`lib/services/profile.ts`) intercepts all member profile lookups:
     - If the viewer is NOT the profile owner and NOT a platform `ADMIN`, `studentId`, `phone`, and `proofDetails` are stripped completely (`undefined`).
     - Regular members browsing `/profile/[id]` cannot inspect another member's student ID or personal phone number under any condition.
2. **Contact Email Privacy Control**:
   - By default, member emails are withheld from public directory profiles (`showEmail: false`).
   - A member's email address is displayed to other authenticated community members only if the user explicitly enables `showEmail: true` in their profile settings.
   - Profile owners and platform administrators retain full visibility for account administration and verification audits.
3. **Verification Dossier Confidentiality**:
   - Academic transcripts, proof documents, and employer partnership agreements submitted during onboarding or resubmission are visible exclusively to the applicant and platform administrators.
   - Non-administrators attempting to query `/api/admin/verifications` receive an immediate `403 FORBIDDEN` response.

---

## 3. Server-Side Posting Clearance & Anti-Privilege Escalation

1. **Server-Enforced Opportunity Posting (`assertCanPostOpportunity`)**:
   - Unverified members (`PENDING`, `REJECTED`, `SUSPENDED`) are strictly prohibited from publishing opportunities.
   - The posting clearance check is executed on the server (`lib/permissions.ts`):
     - Platform administrators (`systemRole === 'ADMIN'`) always hold posting clearance.
     - Verified `EMPLOYER`, `FACULTY`, and `STAFF` hold posting clearance upon institutional approval.
     - Unverified accounts cannot bypass posting restrictions by modifying client payloads or DOM state.
2. **Separation of Platform Role vs. Membership Type**:
   - Institutional membership types (`STUDENT`, `ALUMNI`, `FACULTY`, `STAFF`, `EMPLOYER`, `EXTERNAL_CONNECTION`) are strictly separated from administrative roles (`systemRole: MEMBER | MODERATOR | ADMIN`).
   - Better Auth user input configurations declare `systemRole`, `accountStatus`, and `canPostOpportunities` with `input: false`, preventing client-side registration payloads from self-elevating privileges.

---

## 4. Resume & Private File Storage Security (Stage 8 Implemented)

1. **Private Local Vault Storage**:
   - Resume documents are stored on disk in `storage/resumes/` outside of the Next.js `public/` web root. Resumes can NEVER be reached by direct static HTTP URL access.
2. **Magic-Bytes Inspection Against MIME-Spoofing**:
   - The system inspects file magic bytes (signatures) on upload:
     - PDF: `%PDF-` (`0x25 0x50 0x44 0x46`)
     - DOCX / OpenXML: `PK\x03\x04` (`0x50 0x4B 0x03 0x04`)
     - DOC: `\xD0\xCF\x11\xE0`
   - Rejects spoofed text files, HTML scripts, executables, or disguised binaries even if given a `.pdf` extension.
   - Enforces a strict maximum file size of 5 MB (5,242,880 bytes).
3. **Cryptographic Storage Keys**:
   - Physical filenames on disk use non-guessable random tokens: `${userId}-${Date.now()}-${random16HexBytes}${extension}` with strict file permission `0o600`.
4. **Anti-IDOR Authorization Gate on Downloads (`assertCanAccessResume`)**:
   - Downloading a resume via `/api/resumes/[id]/download` requires authenticated verification:
     - Is the user the owner of the resume? -> ALLOW.
     - Is the user a platform `ADMIN`? -> ALLOW.
     - Is the user an authorized recruiter/manager of a company whose opportunity received an application with this resume? -> ALLOW.
     - Any other member (even other verified members) -> REJECT with `403 Forbidden`.

---

## 5. Applications & Recruitment Authorization Security (Stage 8 Implemented)

1. **Database-Level Duplicate Application Prevention**:
   - The PostgreSQL table `applications` enforces a composite unique constraint `@@unique([opportunityId, applicantId])`. Duplicate submissions cannot occur even under concurrent race conditions.
2. **Strict Community Poster Isolation**:
   - Verified community members who share leads (`sourceType: COMMUNITY_SHARED`) are strictly prevented from viewing or managing candidate applicant dossiers.
   - Only authorized company representatives (`CompanyMember` with `role: OWNER | ADMIN` or `canManageCompany: true | canPostOpportunities: true`) for official employer postings can access candidate applications.
3. **Recruiter Stage Transition Audit Trail**:
   - Recruiter status transitions (`UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`) create immutable records in `application_status_history` storing timestamp, `changedById`, and feedback notes.
4. **Candidate Withdrawal Safeguards**:
   - Candidates can withdraw their submitted applications at any point, with full audit trail preservation. Other members cannot withdraw another candidate's application.

---

## 6. Audit Trails & Governance History

1. **Immutable Request History**: Rejections and resubmissions create distinct records in `membership_requests`, ensuring complete historical traceability of credential reviews and rejection justifications.
2. **Reviewer Attribution**: Every approved or rejected verification logs the `reviewerId` and `reviewedAt` timestamp in PostgreSQL.

---

## 6. Corporate Authorization & Anti-IDOR Controls (Stage 6 Implemented)

1. **Company Management Boundary (`assertCanManageCompany`)**:
   - Updates to corporate profiles (`PUT /api/companies/[id]`) and member associations (`POST /api/companies/[id]/members`) strictly enforce server-side validation.
   - Only platform `ADMIN` or users holding `OWNER`, `ADMIN`, or `canManageCompany: true` for that specific company can modify company information.
   - Any attempt by ordinary members to edit unmanaged companies throws `FORBIDDEN_COMPANY_MODIFICATION (403)`.
2. **Official Employer Representation Boundary (`assertCanPostForCompany`)**:
   - An opportunity submitted with `sourceType = OFFICIAL_EMPLOYER` requires a verified `companyId` and asserts that the posting member has active company posting authorization (`canPostOpportunities: true`).
   - Ordinary members cannot claim an official employer affiliation without verified company membership.

---

## 8. Applications & Private Resume Vault Protections (Stage 8 Implemented)

1. **Private Storage Location**:
   - Resume binaries are stored on disk under `storage/resumes/` completely outside of `public/` web assets.
   - Public URLs to candidate resumes do NOT exist anywhere in the application.
2. **Binary Magic-Bytes Verification**:
   - `inspectFileMagicBytes` validates real binary file headers:
     - PDF: `%PDF-` (`0x25 0x50 0x44 0x46`)
     - DOCX: `PK\x03\x04` (`0x50 0x4B 0x03 0x04`)
   - Rejects file extension spoofing, binary exploits, or disguised executables.
   - Enforces 5MB file size limit.
3. **Anti-IDOR Download Authorization**:
   - Direct downloads via `GET /api/resumes/[id]/download` require `assertCanAccessResume`:
     - Resume owner can access.
     - Authorized employer whose company received an application with the resume can access.
     - Platform admin can access for moderation.
     - Unauthorized members are blocked with `403 Forbidden`.
4. **Duplicate Application Prevention**:
   - Database composite unique constraint `@@unique([opportunityId, applicantId])` blocks race conditions and duplicate applications at the database engine level.
5. **Community Poster Strict Isolation**:
   - Members who merely shared a listing (`COMMUNITY_SHARED`) are prevented from viewing candidate dossiers or downloading resumes via `assertCanManageApplicantsForOpportunity (403 Forbidden)`.

---

## 9. Community Feed, Discussions & Content Moderation (Stage 9 Implemented)

1. **Community Participation Gate (`assertCanParticipateInCommunity`)**:
   - Unauthenticated visitors cannot browse or post in the community feed.
   - Users with `accountStatus: SUSPENDED` or `DEACTIVATED` are blocked from creating posts, writing comments, toggling reactions, or submitting bookmarks (`403 FORBIDDEN_ACCOUNT_SUSPENDED`).
2. **Post & Comment Ownership Enforcement**:
   - Editing or deleting posts (`updateCommunityPost`, `deleteCommunityPost`) is strictly limited to the post author or platform `ADMIN`.
   - Editing or deleting comments (`updatePostComment`, `deletePostComment`) is strictly limited to the comment author or platform `ADMIN`.
3. **Atomic Reactions & Duplicate Prevention**:
   - Composite unique constraint `@@unique([postId, userId, type])` guarantees that duplicate reactions of the same type cannot be created.
   - Toggling reactions operates atomically, ensuring like and reaction counts remain strictly synchronized.
4. **Content Reporting & Moderation Queue**:
   - Members can report inappropriate posts or comments with categorized reasons (`SPAM`, `HARASSMENT`, `INAPPROPRIATE`, `MISINFORMATION`, `OTHER`).
   - Duplicate pending reports from the same user for the same content target are blocked (`409 DUPLICATE_REPORT`).
   - Auto-flagging threshold: When >= 3 pending reports are lodged against a post or comment, status is automatically updated to `FLAGGED` for administrative intervention.

---

## 10. Member Discovery, Network Connections & Referral Privacy (Stage 10 Implemented)

1. **Member Directory Privacy Guarantees (`searchMemberDirectory`)**:
   - Student IDs (`studentId`), personal phone numbers (`phone`), and verification evidence notes are **strictly withheld** from the directory output.
   - Member emails are masked (`undefined`) unless the member has explicitly set `showEmail: true` on their profile, or the viewer is a platform `ADMIN`.
   - Inactive, suspended, or deactivated accounts (`accountStatus !== "ACTIVE"`) are excluded from search results.
2. **Self-Connection & Self-Referral Prevention**:
   - Members are programmatically and logically prevented from sending connection requests or referral requests to themselves (`senderId !== receiverId`, `requesterId !== recipientId`).
3. **Connection Integrity & Duplicate Prevention**:
   - Database composite unique constraint `@@unique([senderId, receiverId])` prevents duplicate requests in the same direction.
   - Bidirectional validation prevents sending a request if an inverted pending request is already waiting for the member's acceptance.
4. **Referral Request Access Control (`assertCanAccessReferral`)**:
   - Referral requests contain personal contact details, resumes, and career intentions.
   - Access is restricted exclusively to:
     - The member who submitted the referral request (`requesterId === viewerUserId`).
     - The member to whom the request was directed (`recipientId === viewerUserId`).
     - Platform administrators (`systemRole === "ADMIN"`).
   - Any third-party access attempt is rejected with HTTP `403 Forbidden` (`Access denied. You do not have permission to view this referral request.`).
5. **Regulatory & Non-Guarantee Disclaimers**:
   - All referral creation flows and dashboards display prominent disclaimers clarifying that referrals facilitate trusted professional introductions within the university ecosystem and do NOT guarantee an interview, employment offer, or institutional endorsement.

---

## 11. Student Academic Data Privacy & Matching Integrity (Stage 11 Implemented)

1. **Student Tools Access Guard (`canAccessStudentTools`)**:
   - Academic CGPA calculation, semester transcript logs, and skill gap telemetry are strictly guarded. Non-student profiles are blocked at server routes and client wrappers.
2. **Academic Transcript Confidentiality**:
   - Individual term grades, CGPAs, and coursework notes are visible strictly to the student owner and platform administrators. They are never exposed in community feeds, member directory cards, or company applicant overviews.
3. **Transparent & Explainable Matching**:
   - Match percentages are purely algorithmic and explainable. No blackbox fabricated scores. High match scores explicitly carry non-guarantee disclaimers.

---

## 12. Notifications, Career Calendar & Cron Security (Stage 12 Implemented)

1. **Recipient Notification Isolation**:
   - All notification retrieval and mutation endpoints (`/api/notifications`, `/api/notifications/[id]`) strictly query `recipientId = session.user.id`.
   - Members cannot view, mark as read, or delete notifications belonging to another user. Unauthorized attempts are rejected with `403 FORBIDDEN`.
2. **Calendar Event Ownership & Isolation**:
   - Custom calendar reminders and notes are strictly isolated to the creating user (`userId = session.user.id`).
   - Mutations (`updateCalendarEvent`, `deleteCalendarEvent`) verify that the requesting user matches the record owner before applying changes.
3. **Scheduled Deadline Reminders & Cron Authorization**:
   - The cron worker route (`/api/cron/reminders`) requires either an explicit `Authorization: Bearer <CRON_SECRET>` matching the server configuration or an active platform `ADMIN` session.
   - Idempotency is enforced via the `DeadlineReminderLog` composite constraint `@@unique([userId, opportunityId, reminderType, channel])`, preventing duplicate alerts from being dispatched across repetitive cron invocations.
4. **Email Dispatch Privacy & Credential Safety**:
   - Outbound notification emails log structured events safely without leaking API keys, credentials, or session cookies.
   - Fallback error handlers catch provider timeouts and delivery errors gracefully without crashing parent business transactions.

---

## 13. Administrative Governance, Account Suspension & Audit Trail Security (Stage 13 Implemented)

1. **Server-Side Administrative Enforcement**:
   - Every administrative API endpoint (`/api/admin/*`) and administrative server component strictly verifies `isPlatformAdmin(user)`.
   - Access by unauthenticated sessions returns HTTP 401 Unauthorized; access by authenticated non-admin accounts returns HTTP 403 Forbidden.
   - Frontend UI hiding is never relied upon as a security boundary.
2. **Account Suspension Safeguard & Impact**:
   - Platform administrators cannot suspend their own account (`adminUserId === targetUserId` triggers an immediate forbidden exception).
   - Suspended accounts (`accountStatus: "SUSPENDED"`) are immediately blocked from creating opportunities, submitting applications, publishing community posts, writing comments, and participating in networking features.
   - Every suspension requires a mandatory stated justification ($\ge 5$ characters) that is recorded in the audit log and dispatched to the affected user.
3. **Mandatory Feedback on Opportunity Rejections**:
   - Opportunity rejections require a clear administrative explanation ($\ge 5$ characters) to prevent arbitrary censorship. The rejection reason is recorded in the database, logged in the audit trail, and sent to the posting author.
4. **Immutable Security Audit Log (`AdminAuditLog`)**:
   - All critical administrative actions (membership verification/rejection, account suspension/restoration, opportunity moderation/deletion, report resolution/dismissal, content removal, company verification/suspension) are written to the append-only `admin_audit_logs` table.
   - Each audit record cryptographically attributes the performing administrator (`adminId`), action type (`AdminAuditAction`), affected entity (`targetType`, `targetId`, `targetLabel`), stated reason, client IP address, and structured pre/post state metadata.
   - Audit logs are permanently retained and cannot be edited or deleted by normal administrative accounts.





