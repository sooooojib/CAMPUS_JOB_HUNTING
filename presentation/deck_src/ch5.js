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
  const sum = shots.reduce((t, it) => t + it[3], 0);
  const h = Math.min(n === 2 ? 3.3 : 2.85, (CW - gap * (n - 1)) / sum);
  let x = M + (CW - (h * sum + gap * (n - 1))) / 2;
  const pos = [];
  shots.forEach((it, i) => {
    const w = h * it[3];
    if (i === 0) badge(pres, s, "INPUT", x, 1.5, 1.75);
    else if (i === n - 1) badge(pres, s, "OUTPUT", x, 1.5, 1.75);
    else pill(pres, s, "Then", x, 1.5, 1.0, HEX.lt1, HEX.dk2, 12);
    pos.push([x, w]);
    if (i < n - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + w + (gap - 0.36) / 2, y: y + h / 2 - 0.18, w: 0.36, h: 0.36, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: "Flow arrow" });
    x += w + gap;
  });
  bottomBar(pres, s, y + h + 0.3, bar[0], bar[1]);
  const put = (i, x0, y0, w0, h0) => {
    s.addImage({ path: shots[i][2], x: x0, y: y0, w: w0, h: h0, altText: `Screenshot: ${shots[i][0]}`, objectName: `!!shot${i + 1}` });
    s.addShape(pres.shapes.RECTANGLE, { x: x0, y: y0, w: w0, h: h0, fill: { type: "none" }, line: { color: HEX.accent6, width: 1 }, objectName: `!!frame${i + 1}` });
  };
  shots.forEach((it, i) => { if (i !== zoom) put(i, pos[i][0], y, pos[i][1], h); });
  if (zoom >= 0) {
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: HEX.lt2, transparency: 12 }, line: { type: "none" }, objectName: "!!dim" });
    const maxW = W - 1.0, maxH = H - 0.7, ar = shots[zoom][3];
    let zw = maxW, zh = zw / ar; if (zh > maxH) { zh = maxH; zw = zh * ar; }
    put(zoom, (W - zw) / 2, (H - zh) / 2, zw, zh);
    s.addNotes(`Zoomed view: ${shots[zoom][0]}. Click to continue.\n\n` + note);
  } else s.addNotes(note);
}

// shots: [[label, route], ...] (2 or 3). Tags: first = What you enter, last = What you get, middle = "Then"
function screenSlide(pres, title, accent, shots, bar, note, phase) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
  header(s, title, accent);
  if (phase) s.addText(phase, { x: W - M - 3.2, y: 0.62, w: 3.2, h: 0.35, fontSize: 13, bold: true, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true });
  const hasImg = shots.some((it) => it[2]);
  if (hasImg) {
    // Base slide (small row), then one zoom slide per screenshot, then back to the row.
    // Morph matches objects named "!!..." so each screenshot grows/shrinks smoothly.
    drawImgSlide(pres, s, title, accent, shots, bar, note, phase, -1);
    shots.forEach((it, z) => {
      const zs = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
      drawImgSlide(pres, zs, title, accent, shots, bar, note, phase, z);
      MORPH.push(zs._slideNum);
    });
    const back = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    back._isNew = true;
    drawImgSlide(pres, back, title, accent, shots, bar, note, phase, -1);
    MORPH.push(back._slideNum);
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
    "Screens: (1) /register — 'Let's Start Learning': choose Current Student or Alumnus / Alumna, enter name, university email, University/Student ID, department and a strong password, then 'Create Account'. The app then opens /verify-email ('Verify Your Email', with 'Resend Verification Link'). (2) The real email sent through Gmail SMTP: subject 'Verify your UniCareer Community account', heading 'Confirm your university email address'. Clicking the link confirms the email. (3) At sign-up, /api/auth/register-details saves the locked ID and department and creates a PENDING membership request. The admin sees the new member as 'Pending' in Member Network ('Member Directory & Campus Network', Admin Management Mode, Verification Status filter = PENDING) with Verify, Suspend, Delete and Profile buttons. The same request also appears in Admin Command → Verification Requests. Note: the password fields in screenshot 1 are blurred on purpose.", J);

  screenSlide(pres, "Log in to your ", "dashboard",
    [["Login page", "/login", "img/login.jpg", 1.08], ["Dashboard: community feed", "/feed", "img/feed.jpg", 1.835]],
    ["your university email and password", "your home feed: jobs, people, posts"],
    "Screens: (1) /login — 'Let's Start Connecting': Email and Your Password fields, 'Remember me', and 'Check Status & Resend Verification Link'. Logging in before confirming the email is refused (EMAIL_NOT_VERIFIED, HTTP 403). (2) After login the app goes to /feed (the /dashboard route also redirects there) — 'Community Feed & Discussions' with shortcuts to Browse Opportunities, Member Network and Post Opportunity.", J);


  screenSlide(pres, "Academic ", "verification",
    [["Credentials form", "/onboarding"], ["Submitted for review", "/onboarding"], ["Admin's review queue", "/admin · Verification Requests"]],
    ["fill in degree, year and proof", "an admin approves or rejects"],
    "Screens: (1) /onboarding — 'Establish Your University Credentials' (department and ID pre-filled and locked, degree program, academic standing, graduation year, proof). (2) 'Credentials Submitted for Review' with the 'Institutional Verification Under Review' badge. (3) Admin → 'Verification Requests' tab with Approve / Reject buttons; rejection needs a reason.", J);


  // ---------- Community ----------
  screenSlide(pres, "Share in the ", "community feed",
    [["Write a post", "/feed"], ["Feed with tabs", "/feed"]],
    ["a discussion, referral or achievement", "your post in the feed"],
    "Screens: (1) The post box — types 'Discussion & Questions', 'Referral', 'Achievement'; optional headline; 10–5,000 characters; 'Post to Community'. (2) The feed with its tabs: All Feed, Discussions & Q&A, Referrals, Achievements, Saved Posts, plus the search box 'Search community discussions, advice, or career topics…'.", C);



  // ---------- Jobs ----------
  screenSlide(pres, "Share a ", "job",
    [["Job form with live preview", "/opportunities/post"], ["My postings", "/opportunities/my"]],
    ["the job and its company link", "a live post you can edit or close"],
    "Screens: (1) /opportunities/post — title, company, type, workplace, location, salary, deadline, official application link, with the 'Live Card Preview'. (2) /opportunities/my — your postings with status tabs and 'Edit Opening' / close. Posts go live right away; admins can close misleading ones.", B);


  screenSlide(pres, "Apply and ", "track",
    [["Apply on the company site", "/opportunities/[id]"], ["My applications", "/applications"]],
    ["apply, then save it to your list", "every application in one place"],
    "Screens: (1) The 'External Opportunity' dialog with 'Apply on Official Website' and 'Save to My Applications'. (2) /applications — 'All Applications' with dates, deadlines and a Remove option. One record per job; at most 30 per hour.", B);


  // ---------- Referrals ----------
  screenSlide(pres, "Ask for a ", "referral",
    [["Request form on a profile", "/profile/[id] · Request Referral"], ["Alumnus's incoming requests", "/referrals"]],
    ["target company, role and a short note", "accepted or declined, with a reply"],
    "Screens: (1) On an alumnus's profile, 'Request Referral' opens a form: Target Company, Role Title, message, optional resume or portfolio link. (2) /referrals as the alumnus — 'Incoming Requests' with 'Accept Request' / 'Decline', and later 'Mark as Completed in HR Portal'. The student sees the status (Awaiting Review, Accepted, Declined) in the Sent tab. You can't ask yourself.", R);

  // ---------- Admin ----------
  screenSlide(pres, "Admin: keep it ", "safe",
    [["Members directory", "/admin · Members Directory"], ["Suspend or restore", "/admin · Members Directory"]],
    ["verify a CGPA, suspend or restore", "a safer platform, with every step logged"],
    "Screens: (1) Admin → 'Members Directory' with filters (Verified, Pending, CG Verified, CG Pending) and actions 'Verify CG', 'Suspend', 'Restore'. (2) The suspend confirmation with a required reason. Admins can't suspend themselves; every action is written to the audit log.", A);

};
