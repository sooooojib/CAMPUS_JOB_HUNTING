const T = require("./theme_config");
const { HEX, W, H, M, CW, header, badge, pill } = T;
const SEC = "Chapter 5 — The App in Action";

// Empty screenshot frame (kept blank on purpose; paste a real screenshot over it)
function shot(pres, s, x, y, w, h, label, route, fs = 15) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: HEX.lt1 }, line: { color: HEX.accent2, width: 1.25, dashType: "dash" }, objectName: `Screenshot placeholder: ${label}` });
  s.addShape(pres.shapes.RECTANGLE, { x: x + 0.02, y: y + 0.02, w: w - 0.04, h: 0.28, fill: { color: HEX.accent3 }, line: { color: HEX.accent3, width: 0 }, objectName: "Browser bar" });
  [0, 1, 2].forEach((i) => s.addShape(pres.shapes.OVAL, { x: x + 0.13 + i * 0.16, y: y + 0.1, w: 0.1, h: 0.1, fill: { color: HEX.lt1 }, line: { color: HEX.accent6, width: 0.5 }, objectName: "Browser dot" }));
  s.addText(route, { x: x + 0.65, y: y + 0.02, w: w - 0.75, h: 0.28, fontSize: 10, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
  s.addText([{ text: "Paste screenshot", options: { bold: true, breakLine: true } }, { text: label, options: {} }], { x: x + 0.1, y: y + 0.3, w: w - 0.2, h: h - 0.3, fontSize: fs, color: HEX.dk2, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

function bottomBar(pres, s, by, enter, get) {
  const gap = 0.3, w = (CW - gap) / 2, bh = 0.6;
  [["You do", enter, HEX.accent3, HEX.accent2], ["You get", get, HEX.accent4, HEX.accent1]].forEach(([k, t, fill, col], i) => {
    const x = M + i * (w + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: by, w, h: bh, rectRadius: 0.1, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: `${k} bar` });
    s.addText([{ text: `${k}:  `, options: { bold: true, color: col } }, { text: t, options: { color: HEX.dk1 } }], { x: x + 0.25, y: by, w: w - 0.5, h: bh, fontSize: 17, margin: 0, valign: "middle", isTextBox: true });
  });
}

const MORPH = [];
function drawImgSlide(pres, s, title, accent, shots, bar, note, phase, zoom) {
  if (zoom !== -1 || s._isNew) { header(s, title, accent);
    if (phase) s.addText(phase, { x: W - M - 3.2, y: 0.62, w: 3.2, h: 0.35, fontSize: 13, bold: true, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true }); }
  const n = shots.length, gap = 0.55, y = 1.95;
  const pos = []; let band;
  if (shots[0][4]) {
    // Column-fit layout: each image fits its own column (width share = it[4]); for very different shapes
    const maxH = 3.15, tot = shots.reduce((t, it) => t + it[4], 0), avail = CW - gap * (n - 1);
    let x = M;
    shots.forEach((it) => {
      const cw = avail * it[4] / tot;
      let w = cw, h = w / it[3]; if (h > maxH) { h = maxH; w = h * it[3]; }
      pos.push([x + (cw - w) / 2, y + (maxH - h) / 2, w, h, x + cw]);
      x += cw + gap;
    });
    band = maxH;
  } else {
    const sum = shots.reduce((t, it) => t + it[3], 0);
    const h = Math.min(n === 2 ? 3.3 : 2.85, (CW - gap * (n - 1)) / sum);
    let x = M + (CW - (h * sum + gap * (n - 1))) / 2;
    shots.forEach((it) => { const w = h * it[3]; pos.push([x, y, w, h, x + w]); x += w + gap; });
    band = h;
  }
  shots.forEach((it, i) => {
    const [px, py] = pos[i];
    if (i === 0) badge(pres, s, "INPUT", px, py - 0.45, 1.75);
    else if (i === n - 1) badge(pres, s, "OUTPUT", px, py - 0.45, 1.75);
    else pill(pres, s, "Then", px, py - 0.45, 1.0, HEX.lt1, HEX.dk2, 12);
    if (i < n - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: pos[i][4] + (gap - 0.36) / 2, y: y + band / 2 - 0.18, w: 0.36, h: 0.36, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: "Flow arrow" });
  });
  bottomBar(pres, s, y + band + 0.3, bar[0], bar[1]);
  // Smooth zoom: one overlay that exists on every slide (invisible on the row slide) and always sits
  // below all screenshots, so Morph only fades its transparency; no separate frame shapes.
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: HEX.lt2, transparency: zoom >= 0 ? 6 : 100 }, line: { type: "none" }, objectName: "!!dim" });
  const put = (i, x0, y0, w0, h0, fade = 0) => {
    s.addImage({ path: shots[i][2], x: x0, y: y0, w: w0, h: h0, transparency: fade, altText: `Screenshot: ${shots[i][0]}`, objectName: `!!shot${i + 1}`,
      shadow: { type: "outer", color: "1E3A5F", opacity: 0.18, blur: 8, offset: 2, angle: 90 } });
  };
  shots.forEach((it, i) => { if (i !== zoom) put(i, pos[i][0], pos[i][1], pos[i][2], pos[i][3], zoom >= 0 ? 85 : 0); });
  if (zoom >= 0) {
    const maxW = W - 1.0, maxH = H - 0.7, ar = shots[zoom][3];
    let zw = maxW, zh = zw / ar; if (zh > maxH) { zh = maxH; zw = zh * ar; }
    put(zoom, (W - zw) / 2, (H - zh) / 2, zw, zh);
    s.addNotes(`Zoomed view: ${shots[zoom][0]}. Click to continue.\n\n` + note);
  } else s.addNotes(note);
}

// shots: [[label, route], ...] (2 or 3). Tags: first = What you enter, last = What you get, middle = "Then"
function screenSlide(pres, title, accent, shots, bar, note, phase, opts = {}) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  header(s, title, accent);
  if (phase) s.addText(phase, { x: W - M - 3.2, y: 0.62, w: 3.2, h: 0.35, fontSize: 13, bold: true, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true });
  const hasImg = shots.some((it) => it[2]);
  if (hasImg && opts.zoom === false) {
    // Plain screenshots, no zoom: each image fits its own column (widths = it[4] share), centred vertically
    const n = shots.length, gap = 0.6, y = 1.95, maxH = 3.15;
    const tot = shots.reduce((t, it) => t + it[4], 0), avail = CW - gap * (n - 1);
    let x = M;
    shots.forEach((it, i) => {
      const cw = avail * it[4] / tot;
      let w = cw, h = w / it[3]; if (h > maxH) { h = maxH; w = h * it[3]; }
      const ix = x + (cw - w) / 2, iy = y + (maxH - h) / 2;
      if (i === 0) badge(pres, s, "INPUT", ix, iy - 0.45, 1.75);
      else if (i === n - 1) badge(pres, s, "OUTPUT", ix, iy - 0.45, 1.75);
      else pill(pres, s, "Then", ix, iy - 0.45, 1.0, HEX.lt1, HEX.dk2, 12);
      s.addImage({ path: it[2], x: ix, y: iy, w, h, altText: `Screenshot: ${it[0]}` });
      s.addShape(pres.shapes.RECTANGLE, { x: ix, y: iy, w, h, fill: { type: "none" }, line: { color: HEX.accent6, width: 1 }, objectName: "Screenshot border" });
      if (i < n - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + cw + (gap - 0.36) / 2, y: y + maxH / 2 - 0.18, w: 0.36, h: 0.36, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: "Flow arrow" });
      x += cw + gap;
    });
    bottomBar(pres, s, y + maxH + 0.3, bar[0], bar[1]);
    s.addNotes(note);
    return;
  }
  if (hasImg) {
    // Base slide (small row), then one zoom slide per screenshot, then straight on to the next slide.
    // Morph matches objects named "!!..." so each screenshot grows/shrinks smoothly.
    drawImgSlide(pres, s, title, accent, shots, bar, note, phase, -1);
    shots.forEach((it, z) => {
      const zs = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
      drawImgSlide(pres, zs, title, accent, shots, bar, note, phase, z);
      MORPH.push(zs._slideNum);
    });
    return;
  }
  const n = shots.length, gap = n === 4 ? 0.45 : n === 3 ? 0.55 : 0.7, w = (CW - gap * (n - 1)) / n, h = n === 4 ? w * 1.05 : n === 3 ? w * 0.78 : w * 10 / 16, y = 1.95;
  shots.forEach((it, i) => {
    const x = M + i * (w + gap);
    if (i === 0) badge(pres, s, "INPUT", x, 1.5, 1.75);
    else if (i === n - 1) badge(pres, s, "OUTPUT", x, 1.5, 1.75);
    else pill(pres, s, "Then", x, 1.5, 1.0, HEX.lt1, HEX.dk2, 12);
    shot(pres, s, x, y, w, h, it[0], it[1], n === 4 ? 13 : n === 3 ? 14 : 15);
    if (i < n - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + w + (gap - 0.36) / 2, y: y + h / 2 - 0.18, w: 0.36, h: 0.36, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: "Flow arrow" });
  });
  bottomBar(pres, s, Math.max(y + h + 0.35, 5.0), bar[0], bar[1]);
  s.addNotes(note);
}

module.exports = function ch5(pres) {
  pres._morph = MORPH;
  pres.addSection({ title: SEC });
  const J = "Joining", C = "Community", B = "Jobs", R = "Referrals", A = "Admin";

  // ---------- Joining ----------
  screenSlide(pres, "Create your ", "account",
    [["Sign-up form", "/register", "img/signup.jpg", 0.742], ["Verification email", "Gmail inbox", "img/email.jpg", 1.481], ["Pending in admin's Member Network", "/community", "img/admin_pending.jpg", 1.84]],
    ["fill the form, then click the email link", "a request waiting for admin approval"],
    "Screens: (1) /register — 'Let's Start Learning': choose Current Student or Alumnus / Alumna, enter name, university email, University/Student ID, department and a strong password, then 'Create Account'. The app then opens /verify-email ('Verify Your Email', with 'Resend Verification Link'). (2) The real email sent through Gmail SMTP: subject 'Verify your UniCareer Community account', heading 'Confirm your university email address'. Clicking the link confirms the email and shows 'What happens next' with 'Return to Sign In'; the user is NOT logged in (autoSignInAfterVerification: false). (3) At sign-up, /api/auth/register-details saves the locked ID and department. Only when the email link is clicked does Better Auth's afterEmailVerification hook create the PENDING membership request. The admin then sees the new member as 'Pending' in Member Network ('Member Directory & Campus Network', Admin Management Mode, Verification Status filter = PENDING) with Verify, Suspend, Delete and Profile buttons. The same request also appears in Admin Command → Verification Requests. Note: the password fields in screenshot 1 are blurred on purpose.", J);

  screenSlide(pres, "Log in to your ", "dashboard",
    [["Login page", "/login", "img/login.jpg", 1.08], ["Dashboard: community feed", "/feed", "img/feed.jpg", 1.835]],
    ["log in after the approval email", "your home feed: jobs, people, posts"],
    "Screens: (1) /login — 'Let's Start Connecting': Email and Your Password fields, 'Remember me', and 'Check Status & Resend Verification Link'. Login works only after the admin approves: before the email is confirmed it is refused (EMAIL_NOT_VERIFIED, HTTP 403); after confirming but before approval the page shows 'Awaiting Administrator Approval' and every member page redirects back to /login?error=pending_admin_approval. (2) After login the app goes to /feed (the /dashboard route also redirects there) — 'Community Feed & Discussions' with shortcuts to Browse Opportunities, Member Network and Post Opportunity.", J);


  // ---------- Community ----------
  screenSlide(pres, "Share in the ", "community feed",
    [["Write a post", "/feed", "img/post_write.jpg", 3.226, 6.3], ["Post with likes and comments", "/feed", "img/post_comments.jpg", 1.642, 5.0]],
    ["a discussion, referral or achievement", "likes, comments and replies"],
    "Screens: (1) The post box on /feed — optional 'Headline or Question', the message, 'Select Post Type': Discussion & Questions, Referral or Achievement; 10 to 5,000 characters ('68/5000 characters (min. 10)'); 'Cancel' or 'Post to Community'. (2) The published post with the author's role badge (STUDENT, Verified), department and date, the post type tag, 'Like' with a counter, comments, and the save (bookmark) button. Comments allow up to 2,000 characters ('Post Comment') and replies are threaded under the comment (here an alumnus answers and the student replies). The menu (three dots) lets members report a post or comment. Feed tabs: All Feed, Discussions & Q&A, Referrals, Achievements, Saved Posts.", C);



  // ---------- Jobs ----------
  screenSlide(pres, "Share a ", "job",
    [["Share a Career Opportunity form", "/opportunities/post", "img/job_form.jpg", 0.847, 3.0], ["Your live job post", "/opportunities/my", "img/job_live.jpg", 5.291, 8.3]],
    ["the job, deadline and company link", "a live post you can close or remove"],
    "Screens: (1) /opportunities/post — 'Share a Career Opportunity' with tabs 'Edit Opening' and 'Live Card Preview'. Role & Company Details: company, job title, employment type, workplace setting, location, optional salary, application deadline, role description. Candidate Preferences & Skills: open to all departments, optional minimum CGPA, target academic standing, key skills. Application Link & Contact: the official job application URL (required) and an optional alumni referral/inquiry email. Buttons: 'Save as Draft' and 'Submit Opportunity'. (2) /opportunities/my — the post shows LIVE right away, with type, company, location, workplace, salary, created date, deadline and how many students bookmarked it; actions 'View Details', 'Close Opportunity' and 'Remove'. Only verified students and alumni can post (canPostOpportunity); admins can close misleading posts.", B);


  screenSlide(pres, "Find, apply and ", "track",
    [["Find a job", "/opportunities", "img/find_jobs.jpg", 1.637, 4.2], ["Apply on the company site", "/opportunities/[id]", "img/apply_dialog.jpg", 0.778, 2.6], ["Deadline on your calendar", "/calendar", "img/calendar.jpg", 1.717, 4.2]],
    ["search, apply, then save it", "the deadline on your calendar"],
    "Screens: (1) /opportunities — 'Career Opportunities & Placements' with tabs 'All Opportunities' and 'Bookmarked Positions', a search box (role, skill, company or location) and filters Role Type, Workplace, Department / Major and CGPA Requirement. Each card shows type, 'Open to All Majors' or a department, company, location, salary, skills, 'Apply by' date, a bookmark button and 'View Details'. (2) 'External Opportunity — Apply at bKash Limited': 'Continue to bKash Limited Careers' opens the company's own site; tick 'Save this in My Applications', add optional notes, then 'Save to My Applications'. One record per job (unique opportunityId + applicantId); at most 30 per hour. (3) /calendar — the saved job's deadline appears on 24 December (circled). Legend: Applications, Interviews, Saved Deadlines, Reminders; 'Add Reminder'. The reminder job also alerts you when a saved or applied job closes within 72 hours.", B);


  // ---------- Referrals ----------


  // ---------- Admin ----------
  screenSlide(pres, "Admin: keep it ", "safe",
    [["Admin Center overview", "/admin · Overview", "img/admin_overview.jpg", 2.07], ["Content reports", "/admin · Content Reports", "img/admin_reports.jpg", 2.786]],
    ["check the numbers, act on reports", "a safe site, every step logged"],
    "Screens: (1) Admin Command → 'Governance & Moderation Center', Overview tab. Alert cards: '8 Verification Requests' (Review Requests) and '1 Content Report' (Moderate). Live counts from the database: Total Members 292 (283 verified, 97%), Active Listings 253 (353 posted in total), Job Applications 105, Community Feed 27 posts, 0 suspended accounts. Other tabs: Verification Requests, Members Directory, Content Reports, Companies, Analytics. (2) Content Reports tab — filters Pending Moderation, Resolved, Dismissed, All. Each report shows what was reported (post or comment), the reason (e.g. INAPPROPRIATE), a snippet, author, reporter and status, with actions Dismiss, Remove and Suspend. A post with 3 or more reports is flagged automatically. Every admin action is written to the audit log; admins can't suspend themselves.", A);

};
