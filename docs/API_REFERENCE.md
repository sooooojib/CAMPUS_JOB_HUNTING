# UniCareer Community — API & Server Actions Reference

## 1. Authentication & Session

- `POST /api/auth/[...nextauth]` or Better Auth handler
  - Handles credentials sign-in, session refresh, email verification hooks.
- `GET /api/auth/session`
  - Returns sanitized current session payload (`id`, `email`, `name`, `membershipType`, `verificationStatus`, `systemRole`).

---

## 2. Opportunities API & Actions

### `createOpportunity(input: CreateOpportunitySchema)`
- **Access**: Verified Members
- **Input**: Title, company, location, isRemote, type, classification, description, requirements, minCgpa, applyType, externalUrl, deadline.
- **Behavior**: Creates record with status `PENDING`. Dispatches notification to admin moderation queue.
- **Output**: `{ success: boolean, opportunityId: string }`

### `getOpportunities(filters: OpportunityFilterSchema)`
- **Access**: Verified Members
- **Parameters**: `query`, `type`, `classification`, `location`, `isRemote`, `minCgpa`, `page`, `limit`.
- **Behavior**: Returns paginated list of approved and active opportunities.

### `moderateOpportunity(id: string, action: 'APPROVE' | 'REJECT', reason?: string)`
- **Access**: `ADMIN`, `MODERATOR`
- **Behavior**: Updates status, writes to `AuditLog`, notifies author.

---

## 3. Applications API & Actions

### `submitApplication(opportunityId: string, data: SubmitApplicationSchema)`
- **Access**: Verified Members (Students/Alumni)
- **Validation**: Enforces non-duplicate application per opportunity; checks deadline.
- **Input**: `resumeFile` (uploaded to private bucket) or `savedResumeId`, `coverLetter`.
- **Output**: `{ success: boolean, applicationId: string }`

### `withdrawApplication(applicationId: string)`
- **Access**: Applicant owner
- **Behavior**: Marks application `WITHDRAWN`.

### `updateApplicantStatus(applicationId: string, status: ApplicationStatus)`
- **Access**: Authorized employer of the target opportunity, or Admin.
- **Behavior**: Transitions applicant lifecycle state; records timestamp.

---

## 4. Community API & Actions

### `createPost(input: CreatePostSchema)`
- **Access**: Verified Members
- **Input**: `content`, `category`, optional `opportunityId`, `title`.

### `createComment(postId: string, content: string, parentId?: string)`
- **Access**: Verified Members
- **Behavior**: Adds top-level comment or nested reply; notifies post author.

### `toggleReaction(postId: string, type: ReactionType)`
- **Access**: Verified Members
- **Behavior**: Adds or removes user reaction atomically.

---

## 5. Career Tools API (Student Only)

### `checkCgpaEligibility(studentCgpa: number, opportunityId: string)`
- **Access**: Verified `STUDENT`
- **Output**: `{ isEligible: boolean, difference: number, minRequired: number }`

### `analyzeSkillGaps(studentSkills: string[], opportunityId: string)`
- **Access**: Verified `STUDENT`
- **Output**: `{ matchedSkills: string[], missingSkills: string[], matchPercentage: number }`

