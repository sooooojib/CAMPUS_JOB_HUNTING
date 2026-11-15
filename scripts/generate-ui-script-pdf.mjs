import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rootDir = process.cwd();
const imgDir = path.join(rootDir, "presentation/deck_src/img");
const outHtmlPath = path.join(rootDir, "presentation/UniCareer_UI_Presentation_Script.html");
const outPdfPath = path.join(rootDir, "presentation/UniCareer_UI_Presentation_Script.pdf");

function getBase64Img(filename) {
  const filePath = path.join(imgDir, filename);
  if (!fs.existsSync(filePath)) return "";
  const ext = path.extname(filename).replace(".", "");
  const mime = ext === "png" ? "image/png" : "image/jpeg";
  const b64 = fs.readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${b64}`;
}

const images = {
  signup: getBase64Img("signup.jpg"),
  email: getBase64Img("email.jpg"),
  adminPending: getBase64Img("admin_pending.jpg"),
  login: getBase64Img("login.jpg"),
  feed: getBase64Img("feed.jpg"),
  postWrite: getBase64Img("post_write.jpg"),
  postComments: getBase64Img("post_comments.jpg"),
  jobForm: getBase64Img("job_form.jpg"),
  jobLive: getBase64Img("job_live.jpg"),
  findJobs: getBase64Img("find_jobs.jpg"),
  applyDialog: getBase64Img("apply_dialog.jpg"),
  calendar: getBase64Img("calendar.jpg"),
  referralPost: getBase64Img("referral_post.jpg"),
  referralMail: getBase64Img("referral_mail.jpg"),
  adminOverview: getBase64Img("admin_overview.jpg"),
  adminReports: getBase64Img("admin_reports.jpg"),
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>UniCareer Community — Defense Presentation Master Script: Chapter 5 (App UI)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 18mm 16mm 20mm 16mm;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.55;
    font-size: 13px;
    margin: 0;
    padding: 0;
  }

  /* Headings */
  h1, h2, h3, h4, h5 {
    color: #0f172a;
    font-weight: 700;
    line-height: 1.25;
    margin-top: 0;
  }

  h1 { font-size: 26px; margin-bottom: 8px; }
  h2 { font-size: 18px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
  h3 { font-size: 15px; margin-bottom: 8px; color: #1e3a8a; }
  h4 { font-size: 13px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; }

  p { margin: 0 0 10px 0; }

  .page-break {
    page-break-before: always;
    break-before: page;
  }

  .no-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Cover Page */
  .cover {
    min-height: 880px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 20px 20px 20px;
    border: 3px double #cbd5e1;
    border-radius: 12px;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  }

  .cover-header {
    text-align: center;
  }

  .university-badge {
    display: inline-block;
    background: #1e3a8a;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding: 6px 16px;
    border-radius: 9999px;
    margin-bottom: 20px;
  }

  .cover-title {
    font-size: 32px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
  }

  .cover-subtitle {
    font-size: 17px;
    color: #2563eb;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .cover-desc {
    font-size: 14px;
    color: #475569;
    max-width: 650px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .cover-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 40px 0;
  }

  .cover-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    text-align: center;
  }

  .cover-card-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 4px;
  }

  .cover-card-value {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }

  .cover-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #64748b;
  }

  /* Slide Content Section */
  .slide-container {
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #cbd5e1;
  }

  .slide-meta-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f1f5f9;
    padding: 6px 12px;
    border-radius: 6px;
    margin-bottom: 12px;
    font-size: 11px;
    font-weight: 600;
  }

  .slide-tag {
    background: #1e3a8a;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .route-badge {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    color: #0369a1;
    background: #e0f2fe;
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* Screenshots Figure Grid */
  .shots-grid {
    display: flex;
    gap: 10px;
    margin: 12px 0 16px 0;
  }

  .shot-item {
    flex: 1;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
    background: #f8fafc;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .shot-header {
    background: #e2e8f0;
    padding: 4px 8px;
    font-size: 10px;
    font-weight: 600;
    color: #334155;
    border-bottom: 1px solid #cbd5e1;
    display: flex;
    justify-content: space-between;
  }

  .shot-img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Script Callout Box */
  .script-box {
    background: #f8fafc;
    border-left: 4px solid #2563eb;
    border-radius: 0 8px 8px 0;
    padding: 14px 16px;
    margin: 12px 0;
    font-style: normal;
    color: #1e293b;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }

  .script-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    color: #2563eb;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .script-text {
    font-size: 13px;
    line-height: 1.6;
    color: #0f172a;
  }

  /* Bottom Bar Grid */
  .bottom-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 10px 0;
  }

  .bar-box {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 11.5px;
  }

  .bar-input {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  }

  .bar-output {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e40af;
  }

  .bar-label {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10px;
    display: block;
    margin-bottom: 2px;
  }

  /* Micro Details Box */
  .details-box {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 10px 14px;
    margin-top: 10px;
    font-size: 11.5px;
  }

  .details-box h5 {
    color: #92400e;
    font-size: 11px;
    margin: 0 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .details-list {
    margin: 0;
    padding-left: 18px;
    color: #78350f;
  }

  .details-list li {
    margin-bottom: 4px;
  }

  /* Q&A Table */
  .qa-table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 12px;
  }

  .qa-table th {
    background: #1e3a8a;
    color: #ffffff;
    text-align: left;
    padding: 8px 12px;
    font-weight: 700;
  }

  .qa-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }

  .qa-table tr:nth-child(even) td {
    background: #f8fafc;
  }

  .qa-q {
    font-weight: 700;
    color: #0f172a;
    width: 32%;
  }

  .qa-a {
    color: #334155;
    line-height: 1.5;
  }

  .footer-stamp {
    text-align: center;
    font-size: 10px;
    color: #94a3b8;
    margin-top: 30px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="cover-header">
    <div class="university-badge">Jagannath University · Dept of Computer Science & Engineering</div>
    <div class="cover-title">UniCareer Community</div>
    <div class="cover-subtitle">Defense Presentation Master Script — Chapter 5: App UI in Action</div>
    <div class="cover-desc">
      An exhaustive, word-for-word spoken defense presentation script and screen-by-screen architectural walkthrough guide. Covers live interface journeys, verification gates, referral mechanisms, and committee defense defense strategies.
    </div>
  </div>

  <div class="cover-cards-grid">
    <div class="cover-card">
      <div class="cover-card-title">Chapter Scope</div>
      <div class="cover-card-value">05 · App UI in Action</div>
    </div>
    <div class="cover-card">
      <div class="cover-card-title">Presentation Deck</div>
      <div class="cover-card-value">05_App_UI.pptx (16 Screens)</div>
    </div>
    <div class="cover-card">
      <div class="cover-card-title">Defense Target</div>
      <div class="cover-card-value">Undergraduate Thesis Defense</div>
    </div>
  </div>

  <div class="cover-footer">
    <div><strong>Platform:</strong> Next.js 16 (React 19) · PostgreSQL · Prisma ORM</div>
    <div><strong>Security:</strong> Better Auth · 2-Stage Verification Gate</div>
    <div><strong>Date:</strong> Academic Year 2026</div>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 1: EXECUTIVE GUIDELINES -->
<h2>Section 1: Defense Speaking Strategy & Delivery Guidelines</h2>
<div class="no-break">
  <p>To deliver an outstanding, authoritative thesis defense presentation for Chapter 5, adhere strictly to these executive presentation principles:</p>

  <div class="bottom-bar">
    <div class="bar-box bar-input">
      <span class="bar-label">Tone & Demeanor</span>
      <strong>Engineered Trust & Authority:</strong> Speak clearly and at a measured pace. Avoid casual phrases like <em>"we just put a button here"</em>. Instead, use architectural language: <em>"We implemented a server-side permission guard"</em>, <em>"This triggers a cryptographic verification email"</em>, <em>"State transition enforced by Prisma ORM."</em>
    </div>
    <div class="bar-box bar-output">
      <span class="bar-label">Core Defense Anchor</span>
      <strong>Zero Fake ATS / High-Trust Network:</strong> Reiterate frequently that UniCareer is not a generic public job board or an employer applicant tracker. It is a private, university-connected referral network designed to link scholars with alumni mentors.
    </div>
  </div>

  <div class="details-box">
    <h5>Three Mandatory Presentation Anchor Rules</h5>
    <ul class="details-list">
      <li><strong>Point Directly at the Screen:</strong> When mentioning badges (e.g. <code>STUDENT · Verified</code>), routes (e.g. <code>/opportunities/post</code>), or modal buttons, physically gesture to the slide screenshot.</li>
      <li><strong>Connect UI to the Database:</strong> Always mention the underlying table powering the view (e.g. <em>"This modal writes directly to our <code>referral_requests</code> relational table"</em>).</li>
      <li><strong>Highlight Security Pre-conditions:</strong> Emphasize what unauthorized or unverified users CANNOT do on each screen (e.g. unverified visitors cannot browse full descriptions or send pitches).</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 2: SLIDE-BY-SLIDE SCRIPTS -->
<h2>Section 2: Complete Slide-by-Slide Defense Script</h2>

<!-- SLIDE 1: WELCOME & GATEWAY -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 1 / 8 · Introduction Gateway</span>
    <span class="slide-tag">Chapter Title Slide</span>
  </div>
  <h3>Welcome to Chapter 5 — The App in Action</h3>
  
  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "Honorable committee members, welcome to Chapter 5: <strong>The App in Action</strong>.<br><br>
      Up to this point in our defense, we have established the theoretical foundations of UniCareer Community: our functional requirements, UML state machines, and our 30-table relational schema. Now, we demonstrate how those architectural models come to life in a responsive, accessible, pixel-perfect user interface.<br><br>
      Rather than displaying static graphic mockups, Chapter 5 follows complete, real-world user flows: from an unverified student creating an account, to alumni sharing job leads, to direct referral requests and platform governance. Every screen you see here is backed by live database state and server-side authorization guards."
    </div>
  </div>
</div>

<!-- SLIDE 2: JOINING & TWO-STAGE GATE -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 2 / 8 · User Onboarding</span>
    <span class="slide-tag">Joining Flow</span>
    <span class="route-badge">/register → Gmail → /community (Admin)</span>
  </div>
  <h3>Create Your Account — The Two-Stage Verification Gate</h3>

  <div class="shots-grid">
    <div class="shot-item">
      <div class="shot-header"><span>Step 1: Sign-Up Form</span><span class="route-badge">/register</span></div>
      <img src="${images.signup}" class="shot-img" alt="Sign-Up Form">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Step 2: Verification Email</span><span class="route-badge">Gmail Inbox</span></div>
      <img src="${images.email}" class="shot-img" alt="Verification Email">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Step 3: Admin Review Queue</span><span class="route-badge">/community</span></div>
      <img src="${images.adminPending}" class="shot-img" alt="Admin Pending Queue">
    </div>
  </div>

  <div class="bottom-bar">
    <div class="bar-box bar-input"><span class="bar-label">You Do</span>Fill the registration form, then click the cryptographic email link.</div>
    <div class="bar-box bar-output"><span class="bar-label">You Get</span>A confirmed email and an applicant dossier dispatched to the Administrator Verification Queue.</div>
  </div>

  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "Let us begin with our first major user journey: <strong>Account Registration and our Two-Stage Verification Gate</strong>.<br><br>
      On the left screenshot, on our <code>/register</code> screen titled 'Let’s Start Learning', the applicant selects their active persona: <strong>Current Student</strong> or <strong>Alumnus / Alumna</strong>. They provide their legal name, institutional university email address, university student ID number, academic department, and a strong password.<br><br>
      Here is our first critical architectural rule: <strong>submitting this form does not log the user in</strong>. The system locks their student ID and department into the database and immediately routes them to <code>/verify-email</code>.<br><br>
      In the center screenshot, you see the actual transactional email dispatched through our SMTP mailer with the subject <em>'Verify your UniCareer Community account'</em>. When the applicant clicks 'Confirm Email', Better Auth verifies the cryptographic token. But notice: <strong><code>autoSignInAfterVerification</code> is strictly set to false</strong>. The user is still blocked from logging in.<br><br>
      Instead, the email verification hook promotes the user's <code>emailVerified</code> flag to true and dispatches their dossier to the <strong>Administrator Verification Queue</strong>, as shown in the right screenshot. In the Admin’s view at <code>/community</code>, the applicant appears with an amber <code>PENDING</code> badge alongside one-click administrative actions: <strong>Verify</strong>, <strong>Suspend</strong>, or <strong>Inspect Profile</strong>.<br><br>
      This ensures zero unverified outsiders can ever infiltrate the campus network."
    </div>
  </div>

  <div class="details-box">
    <h5>Architectural Micro-Details to Point Out</h5>
    <ul class="details-list">
      <li><strong>Password Encryption:</strong> Passwords are hashed with <code>scrypt</code> through Better Auth and stored in the isolated <code>accounts</code> table to prevent accidental JSON leaks.</li>
      <li><strong>Tamper-Resistant Identity:</strong> Student ID and department are locked at registration; students cannot edit their identity to spoof another academic department.</li>
      <li><strong>HTTP Guard:</strong> Unapproved logins receive an explicit <code>HTTP 403 Forbidden</code> with error code <code>EMAIL_NOT_VERIFIED</code> or redirect parameter <code>?error=pending_admin_approval</code>.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- SLIDE 3: LOGIN & DASHBOARD GATEWAY -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 3 / 8 · Authentication Gateway</span>
    <span class="slide-tag">Dashboard Flow</span>
    <span class="route-badge">/login → /feed</span>
  </div>
  <h3>Log In to Your Dashboard — Gateway to the Community</h3>

  <div class="shots-grid">
    <div class="shot-item" style="max-width: 45%;">
      <div class="shot-header"><span>Step 1: Sign-In Gateway</span><span class="route-badge">/login</span></div>
      <img src="${images.login}" class="shot-img" alt="Login Page">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Step 2: Home Feed</span><span class="route-badge">/feed</span></div>
      <img src="${images.feed}" class="shot-img" alt="Dashboard Feed">
    </div>
  </div>

  <div class="bottom-bar">
    <div class="bar-box bar-input"><span class="bar-label">You Do</span>Sign in with your verified credentials after receiving the official administrative approval email.</div>
    <div class="bar-box bar-output"><span class="bar-label">You Get</span>Your personalized campus home feed: vetted jobs, student discussions, and member leads.</div>
  </div>

  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "Once an administrator officially validates the applicant's credentials, an automated approval email is dispatched, and the user can proceed to the <code>/login</code> screen on the left.<br><br>
      If an unapproved user attempts to sign in prior to administrative clearance, the login interface traps the attempt, displays an amber <strong>'Awaiting Administrator Approval'</strong> warning banner, and prevents session creation.<br><br>
      Upon authenticated sign-in with verified credentials, the server establishes a secure cryptographic session token in the <code>sessions</code> table and routes the user directly to the home dashboard at <code>/feed</code>, visible on the right.<br><br>
      The navigation bar transitions from the public marketing state into the authenticated platform header: displaying the user's initials avatar, institutional verification badge, notifications counter, and quick-action launcher buttons to <strong>Browse Opportunities</strong>, <strong>Member Network</strong>, and <strong>Post Opportunity</strong>."
    </div>
  </div>
</div>

<!-- SLIDE 4: COMMUNITY FEED -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 4 / 8 · Student-Alumni Synergy</span>
    <span class="slide-tag">Community Flow</span>
    <span class="route-badge">/feed (Composer & Threads)</span>
  </div>
  <h3>Share in the Community Feed — Discussions, Q&A & Reactions</h3>

  <div class="shots-grid">
    <div class="shot-item" style="max-width: 48%;">
      <div class="shot-header"><span>Step 1: Post Composer</span><span class="route-badge">/feed</span></div>
      <img src="${images.postWrite}" class="shot-img" alt="Post Composer">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Step 2: Threaded Interaction</span><span class="route-badge">/feed</span></div>
      <img src="${images.postComments}" class="shot-img" alt="Threaded Comments">
    </div>
  </div>

  <div class="bottom-bar">
    <div class="bar-box bar-input"><span class="bar-label">You Do</span>Compose a technical question, career discussion, referral request, or achievement.</div>
    <div class="bar-box bar-output"><span class="bar-label">You Get</span>Real-time likes, threaded nested replies from alumni, and private bookmarking.</div>
  </div>

  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "Now let us examine the heart of our campus interaction: <strong>The Community Feed</strong>.<br><br>
      On the left is our post composer. A member can provide an optional headline, select their specific post taxonomy — <strong>Discussion & Questions</strong>, <strong>Referral Request</strong>, or <strong>Achievement</strong> — and compose their message. The client and server enforce strict content validation: messages must be between 10 and 5,000 characters with live character counter feedback.<br><br>
      On the right is the resulting published post. Notice the high information density:<br>
      First, the author's verified role badge — in this case, <code>STUDENT · Verified</code> — alongside their department and timestamp.<br>
      Second, the interactive <strong>Like</strong> reaction button with live counter updates.<br>
      Third, the <strong>Bookmark</strong> action, allowing students to save career advice to their private collections.<br>
      And most importantly, <strong>Threaded Nested Replies</strong>. Here you can see an alumnus answering a student's technical question, and the student replying directly beneath it.<br><br>
      Furthermore, every post and comment includes a moderation trigger in its three-dot context menu, enabling members to report inappropriate content or recruitment spam."
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- SLIDE 5: JOB SOURCING -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 5 / 8 · Curated Opportunity Sourcing</span>
    <span class="slide-tag">Jobs Flow</span>
    <span class="route-badge">/opportunities/post → /opportunities/my</span>
  </div>
  <h3>Share a Job — Verified Career Opportunities</h3>

  <div class="shots-grid">
    <div class="shot-item" style="max-width: 48%;">
      <div class="shot-header"><span>Step 1: Opportunity Post Form</span><span class="route-badge">/opportunities/post</span></div>
      <img src="${images.jobForm}" class="shot-img" alt="Share Job Form">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Step 2: Author Management Console</span><span class="route-badge">/opportunities/my</span></div>
      <img src="${images.jobLive}" class="shot-img" alt="Live Job Management">
    </div>
  </div>

  <div class="bottom-bar">
    <div class="bar-box bar-input"><span class="bar-label">You Do</span>Submit role details, academic criteria, application deadline, and official company portal URL.</div>
    <div class="bar-box bar-output"><span class="bar-label">You Get</span>A live community opportunity lead that you can manage, close, or remove.</div>
  </div>

  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "In UniCareer Community, job postings are not scraped from random search engines. They are shared directly by verified alumni mentors and authorized members.<br><br>
      On the left is the <strong>Share a Career Opportunity</strong> form at <code>/opportunities/post</code>. It features a two-tab interface: 'Edit Opening' and 'Live Card Preview'.<br><br>
      The form captures four distinct data groups:<br>
      1. Target Company name and verified company affiliation.<br>
      2. Role Title, Employment Type (<code>INTERNSHIP</code>, <code>FULL_TIME</code>, <code>CONTRACT</code>), Workplace Setting (<code>REMOTE</code>, <code>HYBRID</code>, <code>ON_SITE</code>), and Location.<br>
      3. Academic criteria: Minimum CGPA thresholds, target departments, and required tech skills.<br>
      4. The application gateway: The mandatory official external destination URL (such as the company's official career portal) and an optional alumni inquiry email.<br><br>
      Once submitted, the post transitions immediately to the author's management dashboard on the right at <code>/opportunities/my</code>.<br><br>
      Here, the author can monitor how many students have saved or viewed their listing, inspect full details, or click <strong>Close Opportunity</strong> when the hiring quota is met. The server enforces strict ownership: only the original poster or a platform admin can close or remove a listing."
    </div>
  </div>
</div>

<!-- SLIDE 6: CANDIDATE JOURNEY & CALENDAR -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 6 / 8 · Opportunity Gateway & Life-Cycle</span>
    <span class="slide-tag">Tracking Flow</span>
    <span class="route-badge">/opportunities → External Dialog → /calendar</span>
  </div>
  <h3>Find, Apply, and Track — From Discovery to Calendar Sync</h3>

  <div class="shots-grid">
    <div class="shot-item">
      <div class="shot-header"><span>Step 1: Filter & Browse</span><span class="route-badge">/opportunities</span></div>
      <img src="${images.findJobs}" class="shot-img" alt="Find Jobs">
    </div>
    <div class="shot-item" style="max-width: 32%;">
      <div class="shot-header"><span>Step 2: External Application</span><span class="route-badge">/opportunities/[id]</span></div>
      <img src="${images.applyDialog}" class="shot-img" alt="Apply Modal">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Step 3: Synced Deadline</span><span class="route-badge">/calendar</span></div>
      <img src="${images.calendar}" class="shot-img" alt="Calendar Deadline">
    </div>
  </div>

  <div class="bottom-bar">
    <div class="bar-box bar-input"><span class="bar-label">You Do</span>Search verified opportunities, click through to the corporate portal, and track in 'My Applications'.</div>
    <div class="bar-box bar-output"><span class="bar-label">You Get</span>The exact application deadline automatically synced and color-coded on your interactive calendar.</div>
  </div>

  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "Here we see the complete student discovery and application journey.<br><br>
      On the left, on <code>/opportunities</code>, students can filter verified opportunities by <strong>Role Type</strong>, <strong>Workplace Setting</strong>, <strong>Department</strong>, and <strong>Minimum CGPA</strong>. Each card highlights key metadata at a glance: salary or stipend, location, required tech stack badges, and application cutoff dates.<br><br>
      When a student clicks 'View Details', they arrive at the opportunity gateway in the center screenshot. Notice the <strong>Opportunity Gate</strong> box:<br>
      First, it displays the verified cutoff date.<br>
      Second, it features our prominent <strong>'Mail Me / Contact for Referral'</strong> inquiry button if the poster supplied a contact email.<br>
      And third, when clicking 'Apply on Company Site', our modal appears: it provides the outbound link to the official company hiring portal (such as bKash or Brain Station 23 Careers), while offering a checkbox to <strong>'Save this in My Applications'</strong> with private candidate interview notes.<br><br>
      Now, observe the third screen on the right: <code>/calendar</code>. The moment the student tracks that application, the database automatically synchronizes the job's deadline onto their calendar — circled here on <strong>December 24th</strong>.<br><br>
      The calendar color-codes events across Applications, Interviews, Saved Deadlines, and Reminders. Our automated background reminder engine alerts the student 72 hours before any tracked opportunity expires."
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- SLIDE 7: REFERRALS -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 7 / 8 · High-Trust Networking</span>
    <span class="slide-tag">Referral Flow</span>
    <span class="route-badge">/feed → /profile/[id] (Modal)</span>
  </div>
  <h3>Ask an Alumnus for a Referral — Dual-Mode 'Mail Me' System</h3>

  <div class="shots-grid">
    <div class="shot-item">
      <div class="shot-header"><span>Channel 1: Feed Referral Request</span><span class="route-badge">/feed</span></div>
      <img src="${images.referralPost}" class="shot-img" alt="Feed Referral Post">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Channel 2: Direct Mail Me Modal</span><span class="route-badge">/profile/[id]</span></div>
      <img src="${images.referralMail}" class="shot-img" alt="Referral Modal">
    </div>
  </div>

  <div class="bottom-bar">
    <div class="bar-box bar-input"><span class="bar-label">You Do</span>Submit a referral pitch publicly in the feed or privately via the alumnus's profile modal.</div>
    <div class="bar-box bar-output"><span class="bar-label">You Get</span>A 1-click formatted email template, direct contact capability, and an in-app tracked audit record.</div>
  </div>

  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "This brings us to one of our most praised features: <strong>The High-Trust Alumni Referral System</strong>.<br><br>
      Students can request referrals in two distinct ways:<br><br>
      First, via the public feed on the left: a student publishes a post tagged as <strong>'Referral Request'</strong> detailing their interest in backend engineering at Chaldal. A verified alumnus working at Chaldal replies directly in the comments offering mentorship.<br><br>
      Second, via direct profile contact on the right: when viewing an alumnus's profile, clicking <strong>'Contact for Referral'</strong> opens our specialized dual-mode modal.<br><br>
      Notice the two tabs:<br>
      1. <strong>Mode 1 — Direct Email ('Mail Me')</strong>: Designed for busy alumni who prefer handling correspondence in Gmail or Outlook. The student inputs their target role and qualifications pitch. The system automatically constructs a professional email with pre-filled subject and body. The student can click <strong>'Open in Email App'</strong> to launch their mail client via <code>mailto:</code>, or click <strong>'Copy Template'</strong> for webmail.<br>
      2. <strong>Status Tracking</strong>: By keeping the checkbox ticked, the request is simultaneously logged in the database so the student can track when they reached out.<br>
      3. <strong>Mode 2 — In-App Dossier</strong>: If the alumnus prefers privacy, the modal submits an internal referral request stored in our <code>referral_requests</code> table, notifying the alumnus on their <code>/referrals</code> dashboard.<br><br>
      This strikes the perfect balance between alumni privacy, convenience, and student accountability."
    </div>
  </div>
</div>

<!-- SLIDE 8: ADMIN GOVERNANCE -->
<div class="slide-container no-break">
  <div class="slide-meta-bar">
    <span>Slide 8 / 8 · Platform Safety & Governance</span>
    <span class="slide-tag">Admin Flow</span>
    <span class="route-badge">/admin · Overview & Content Reports</span>
  </div>
  <h3>Admin: Keep It Safe — Operational Command & Moderation</h3>

  <div class="shots-grid">
    <div class="shot-item">
      <div class="shot-header"><span>Console 1: Operations Overview</span><span class="route-badge">/admin · Overview</span></div>
      <img src="${images.adminOverview}" class="shot-img" alt="Admin Overview">
    </div>
    <div class="shot-item">
      <div class="shot-header"><span>Console 2: Content Reports</span><span class="route-badge">/admin · Content Reports</span></div>
      <img src="${images.adminReports}" class="shot-img" alt="Content Reports">
    </div>
  </div>

  <div class="bottom-bar">
    <div class="bar-box bar-input"><span class="bar-label">You Do</span>Monitor platform metrics, verify member dossiers, and inspect flagged community content.</div>
    <div class="bar-box bar-output"><span class="bar-label">You Get</span>A compliant, spam-free university network where every administrative action is logged in audit trails.</div>
  </div>

  <div class="script-box">
    <div class="script-label">📢 Spoken Script (Word-for-Word)</div>
    <div class="script-text">
      "Finally, we present <strong>Platform Governance & Administrative Moderation</strong>.<br><br>
      On the left is the <strong>Admin Command Center</strong> at <code>/admin</code>. At a glance, administrators receive critical operational telemetry:<br>
      - A notification alert for pending verification dossiers requiring human review.<br>
      - A live count of total verified members, active listings, submitted applications, and feed posts.<br>
      - Navigation tabs covering Verification Requests, Member Directory, Content Reports, Corporate Profiles, and Platform Analytics.<br><br>
      On the right is the <strong>Content Reports Moderation Console</strong>.<br>
      When community members report a post or comment for harassment, spam, or false recruitment details, the item enters this queue.<br><br>
      Administrators have three distinct enforcement actions:<br>
      1. <strong>Dismiss</strong>: If the report is invalid, marking it resolved.<br>
      2. <strong>Remove</strong>: Soft-deletes or hides the offending post from public feeds.<br>
      3. <strong>Suspend Member</strong>: Immediately revokes the offender's access across the platform.<br><br>
      Every administrative action triggers an immutable entry in our <code>audit_logs</code> table, recording the administrator's ID, the affected entity, the timestamp, and the exact justification. Furthermore, server-side permissions enforce that administrators cannot suspend their own accounts.<br><br>
      This ensures UniCareer Community remains a safe, prestigious, and compliant institutional asset for the university."
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 3: COMMITTEE Q&A SHEET -->
<h2>Section 3: Anticipated Committee Defense Q&A Sheet</h2>
<div class="no-break">
  <p>Prepare for these specific technical inquiries frequently asked by academic software engineering defense panels:</p>

  <table class="qa-table">
    <thead>
      <tr>
        <th>Committee Question</th>
        <th>Recommended Technical Answer</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="qa-q">1. "Why do you use external application links instead of building a resume upload & review ATS?"</td>
        <td class="qa-a">
          <strong>Institutional Reality & Privacy:</strong> Employers hire exclusively through their official corporate applicant portals (such as bKash, Brain Station 23, or Vercel). Building a fake internal ATS would force students to upload sensitive CVs into an unmonitored portal that employers never check. By redirecting to official hiring URLs while offering private application tracking with calendar deadlines, we protect candidate data privacy while maintaining complete personal accountability.
        </td>
      </tr>
      <tr>
        <td class="qa-q">2. "What prevents an unauthorized student from accessing alumni contact emails?"</td>
        <td class="qa-a">
          <strong>Multi-Layer Privacy Shield:</strong> On the database level, <code>Profile.showEmail</code> defaults to <code>false</code>. In our service layer (<code>lib/services/profile.ts</code>), the user's email address is stripped from the returned JSON payload unless the viewer is the account owner, a platform administrator, or the user explicitly set <code>showEmail: true</code>. Furthermore, our referral modal falls back gracefully to the In-App Dossier queue when an email is private.
        </td>
      </tr>
      <tr>
        <td class="qa-q">3. "How does the system prevent student spam in referral requests?"</td>
        <td class="qa-a">
          <strong>Database & Validation Constraints:</strong> We enforce:
          1. A strict 20-character minimum and 2,000-character maximum for pitch messages.
          2. Rate limiting on the API route (<code>POST /api/referrals</code>).
          3. One active pending referral request per student per opportunity.
          4. Complete blocking of self-referrals (requesterId cannot equal recipientId).
        </td>
      </tr>
      <tr>
        <td class="qa-q">4. "How is data consistency maintained when an opportunity is deleted or closed?"</td>
        <td class="qa-a">
          <strong>Relational Integrity & Cascade Rules:</strong> In <code>prisma/schema.prisma</code>, bookmarks, applications, and comments use <code>onDelete: Cascade</code>, ensuring clean garbage collection without orphaned rows. Furthermore, in referral requests and posts, the foreign key uses <code>onDelete: SetNull</code>, ensuring that private conversation dossiers between students and alumni remain preserved even if the linked job posting is closed or removed.
        </td>
      </tr>
    </tbody>
  </table>

  <div class="footer-stamp">
    UniCareer Community Defense Presentation Master Script · Department of Computer Science & Engineering · Jagannath University
  </div>
</div>

</body>
</html>`;

fs.writeFileSync(outHtmlPath, htmlContent, "utf8");
console.log(`✅ Generated standalone presentation script HTML at: ${outHtmlPath}`);

console.log("🖨️ Printing high-fidelity PDF with Google Chrome Headless...");
const chromeCmd = `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --print-to-pdf="${outPdfPath}" --no-pdf-header-footer "${outHtmlPath}"`;
execSync(chromeCmd, { stdio: "inherit" });

if (fs.existsSync(outPdfPath)) {
  const stats = fs.statSync(outPdfPath);
  console.log(`🎉 Successfully created PDF: ${outPdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
} else {
  console.error("❌ PDF generation failed.");
}
