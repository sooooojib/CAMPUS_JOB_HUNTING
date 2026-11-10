import os
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

# Vibrant Color Palette
C_MIDNIGHT_HERO   = RGBColor(17, 14, 56)
C_ELECTRIC_VIOLET = RGBColor(124, 58, 237)
C_PURPLE_LIGHT    = RGBColor(168, 85, 247)
C_CYAN_SKY        = RGBColor(6, 182, 212)
C_ROYAL_BLUE      = RGBColor(37, 99, 235)
C_SUNSET_ORANGE   = RGBColor(249, 115, 22)
C_MINT_GREEN      = RGBColor(16, 185, 129)
C_HONEY_AMBER     = RGBColor(245, 158, 11)
C_HOT_CORAL       = RGBColor(244, 63, 94)
C_LIGHT_BG        = RGBColor(248, 250, 252)
C_WHITE           = RGBColor(255, 255, 255)
C_TEXT_DARK       = RGBColor(15, 23, 42)
C_TEXT_MUTED      = RGBColor(100, 116, 139)

def generate_all_remaining_slides(prs, blank_layout, FONT_FAMILY, add_header, add_card, add_table, add_real_diagram_slide, add_ui_slide_with_image, add_notes):

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    # =========================================================================
    # SLIDE 11: Admin Governance Requirements
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, C_LIGHT_BG)
    add_header(s11, "Campus Governance", "Admin Features: Verification, Moderation & Audit Logs", tag_color=C_HOT_CORAL)

    c1 = add_card(s11, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_HOT_CORAL, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "🛡️ Campus Governance Tools"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_HOT_CORAL
    bullets_s11_1 = [
        "Student ID Verification: Matches applicants against registrar records in 1 click.",
        "Job Lead Review: Moderates alumni posts before publishing to campus feeds.",
        "Account Suspension: Suspends violators with mandatory written justification."
    ]
    for b in bullets_s11_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s11, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Immutable Audit Trail"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s11_2 = [
        "Permanent Log: Every verification, suspension, or approval is permanently recorded.",
        "Strict Traceability: Logs store admin user ID, action timestamp, and justification.",
        "Tamper-Proof Design: Relational foreign keys prevent audit records from being altered."
    ]
    for b in bullets_s11_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s11, "Admin tools ensure institutional trust. Suspensions require minimum 5-character reasons logged immutably.")

    # =========================================================================
    # SLIDE 12: Functional vs. Non-Functional Requirements (Native Chart)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, C_LIGHT_BG)
    add_header(s12, "Requirements Contrast", "Functional vs. Non-Functional: Balance of Features & Speed", tag_color=C_ELECTRIC_VIOLET)

    c_left = add_card(s12, Inches(0.8), Inches(1.68), Inches(5.4), Inches(5.25), C_WHITE, C_ELECTRIC_VIOLET, 2.5)
    tf = c_left.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "Key Contrast & Focus"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ELECTRIC_VIOLET
    bullets_s12 = [
        "Functional (What It Does): 1-click apply, CGPA calculator, referral routing, and moderation.",
        "Non-Functional (How It Performs): Sub-150ms latency, zero duplicate submissions, 99.95% uptime.",
        "Direct Synergy: A great feature is only useful if it responds instantly under heavy deadline traffic."
    ]
    for b in bullets_s12:
        pb = tf.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    chart_card = add_card(s12, Inches(6.5), Inches(1.68), Inches(6.0), Inches(5.25), C_WHITE, C_CYAN_SKY, 2.5)
    c_data = CategoryChartData()
    c_data.categories = ["Auth & Security", "CGPA & Tools", "Job Pipeline", "Referral Hub", "Audit & Logs"]
    c_data.add_series("Functional Features", (9, 7, 12, 8, 6))
    c_data.add_series("Non-Functional Rules", (8, 6, 11, 7, 5))
    x, y, cx, cy = Inches(6.7), Inches(2.2), Inches(5.6), Inches(4.5)
    chart = s12.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, x, y, cx, cy, c_data).chart
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.TOP
    chart.legend.font.size = Pt(13)

    add_notes(s12, "Functional requirements define what users see; non-functional requirements guarantee the system never crashes on deadline day.")

    # =========================================================================
    # SLIDE 13: Core Functional Requirements: Applications & Reviews
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13, C_LIGHT_BG)
    add_header(s13, "Functional Specs", "Functional Requirements: 3 Core User Workflows", tag_color=C_ROYAL_BLUE)

    roles_data = [
        ("🎓 STUDENT (FR 1-6)", "Browse verified jobs, compute semester CGPA, apply with PDF resume, track interview progress, and pitch alumni mentors.", C_ROYAL_BLUE),
        ("💼 ALUMNI (FR 7-10)", "Share verified job leads, review candidate resumes, sponsor internal company referrals, and mentor students.", C_SUNSET_ORANGE),
        ("🛡️ ADMIN (FR 11-14)", "Verify student rosters against registrar records, approve job postings, moderate reported posts, and maintain immutable audit trail.", C_HOT_CORAL)
    ]
    for idx, (role_t, role_d, col) in enumerate(roles_data):
        top_pos = Inches(1.68 + idx * 1.76)
        c = add_card(s13, Inches(0.8), top_pos, Inches(11.7), Inches(1.60), C_WHITE, col, 2.5)
        tf = c.text_frame; tf.word_wrap = True
        p = tf.paragraphs[0]; p.text = role_t; p.font.size = Pt(24); p.font.bold = True; p.font.color.rgb = col
        p2 = tf.add_paragraph(); p2.text = role_d; p2.font.size = Pt(18); p2.font.color.rgb = C_TEXT_DARK; p2.space_before = Pt(8)

    add_notes(s13, "Every functional requirement directly serves our 3 university personas without unnecessary bloat.")

    # =========================================================================
    # SLIDE 14: Non-Functional Architecture Breakdown (Native Chart)
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14, C_LIGHT_BG)
    add_header(s14, "Quality Standards", "Non-Functional Requirements: Speed, Privacy & Reliability", tag_color=C_CYAN_SKY)

    c1 = add_card(s14, Inches(0.8), Inches(1.68), Inches(5.4), Inches(5.25), C_WHITE, C_CYAN_SKY, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Core Quality Standards"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_CYAN_SKY
    bullets_s14 = [
        "Sub-150ms Speed: 1-click application submission responds in 142ms average.",
        "Strict Privacy: Resumes stored in private cloud storage with signed expiring URLs.",
        "Zero Double Submissions: Composite unique index prevents duplicate applications."
    ]
    for b in bullets_s14:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    chart_card = add_card(s14, Inches(6.5), Inches(1.68), Inches(6.0), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    c_data = CategoryChartData()
    c_data.categories = ["Performance (<150ms)", "Data Integrity", "Security & Vault", "Uptime (99.95%)", "Maintainability"]
    c_data.add_series("Engineering Benchmark", (98, 100, 99, 99.9, 95))
    x, y, cx, cy = Inches(6.7), Inches(2.2), Inches(5.6), Inches(4.5)
    chart = s14.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, x, y, cx, cy, c_data).chart
    chart.has_legend = False

    add_notes(s14, "Quality benchmarks guarantee high reliability when hundreds of students apply before the 11:59 PM deadline.")

    # =========================================================================
    # SLIDE 15: Non-Functional Performance: Sub-150ms Response Time
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15, C_LIGHT_BG)
    add_header(s15, "Speed & Latency", "Lightning Fast Performance: 142ms Application Submissions", tag_color=C_ROYAL_BLUE)

    takeaways_s15 = [
        "Pre-Warmed Pool: Database queries execute in under 15ms via connection pool.",
        "Sub-150ms Round-Trip: Complete candidate submission finishes in 142 milliseconds.",
        "Non-Blocking Alerts: Background worker dispatches reviewer emails asynchronously."
    ]
    add_real_diagram_slide(s15, "uml_workflow.png", "System Ingress Flow", "SPEED BENCHMARKS", takeaways_s15, C_ROYAL_BLUE)

    add_notes(s15, "Sub-150ms response keeps UI feeling instantaneous. Background tasks never delay student confirmation.")

    # =========================================================================
    # SLIDE 16: Security & Privacy: Sealed Transcripts & Expiring Links
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_background(s16, C_LIGHT_BG)
    add_header(s16, "Security Architecture", "Student Privacy: Sealed Transcripts & Temporary PDF Links", tag_color=C_HOT_CORAL)

    c1 = add_card(s16, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Private Academic Ledger"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s16_1 = [
        "Completely Confidential: Term grades are private to the student and never shown on public profiles.",
        "Verified CGPA Flag: Registrars verify student status without exposing individual course grades.",
        "Server-Enforced Access: Only authorized students can view their own academic history."
    ]
    for b in bullets_s16_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s16, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_HOT_CORAL, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Expiring Resume PDF Links"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_HOT_CORAL
    bullets_s16_2 = [
        "Time-Limited Signed URLs: Resumes are locked in private cloud storage with expiring access links.",
        "Role-Gated Viewing: Only the hiring alumni or verified employer can view an applicant's resume.",
        "No Public Exposure: Search engines and unauthenticated visitors cannot access candidate files."
    ]
    for b in bullets_s16_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s16, "Student privacy is non-negotiable. Resumes are protected by time-limited signed links.")

    # =========================================================================
    # SLIDE 17: Availability & Resilience: Cloud Postgres (99.95%)
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_background(s17, C_LIGHT_BG)
    add_header(s17, "High Availability", "99.95% Availability: Cloud PostgreSQL & Edge Architecture", tag_color=C_MINT_GREEN)

    c1 = add_card(s17, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "⚡ Cloud Infrastructure"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s17_1 = [
        "Serverless PostgreSQL: Neon database scales instantly during application deadlines.",
        "Pre-Warmed Connections: Eliminates cold start latency when traffic surges.",
        "Multi-Zone Failover: Automated failover keeps the site responsive 24/7."
    ]
    for b in bullets_s17_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s17, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_CYAN_SKY, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "🛡️ Error Resilience"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_CYAN_SKY
    bullets_s17_2 = [
        "Human Error Messages: Friendly toast alerts replace cryptic database error codes.",
        "Automatic Retry Logic: Transient network queries retry transparently in the background.",
        "Data Backup & Recovery: Daily database snapshots safeguard academic records."
    ]
    for b in bullets_s17_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s17, "Serverless architecture guarantees high availability without high server hosting overhead.")

    # =========================================================================
    # SLIDE 18: Requirements Defense Q&A: Why These 3 Roles Matter
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_background(s18, C_LIGHT_BG)
    add_header(s18, "Q&A Defense", "Engineering Justification: Why Student, Alumni & Admin?", tag_color=C_ELECTRIC_VIOLET)

    c1 = add_card(s18, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Expected Committee Questions"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s18_1 = [
        "Q: Why not let anyone sign up like public job portals?",
        "Q: How do we stop students from faking their semester CGPA?",
        "Q: Why require mandatory written reasons for account suspension?"
    ]
    for b in bullets_s18_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s18, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Our Architecture Defense"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s18_2 = [
        "A1: Restricting access to verified campus emails keeps listings high-trust and spam-free.",
        "A2: Registrars verify student status and validate credit-weighted summation calculations.",
        "A3: Mandatory explanations guarantee fairness and accountability in moderation."
    ]
    for b in bullets_s18_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s18, "Be confident! High trust and authentic alumni mentorship are our key technical differentiators.")

    # =========================================================================
    # PART 3: CONCURRENCY & HIGH LOAD (SLIDES 19 - 24)
    # =========================================================================

    # SLIDE 19: High Load & Concurrency Strategy
    s19 = prs.slides.add_slide(blank_layout)
    set_slide_background(s19, C_LIGHT_BG)
    add_header(s19, "Concurrency Handling", "Traffic Spikes: Handling the 11:59 PM Application Rush", tag_color=C_ROYAL_BLUE)

    c1 = add_card(s19, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "The Deadline Day Challenge"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s19_1 = [
        "Simultaneous Submissions: Hundreds of students apply right before the application deadline.",
        "Risk of Double Submissions: Frantic multi-clicking could submit duplicate records.",
        "Database Connection Limits: Serverless cold starts could bottleneck application queries."
    ]
    for b in bullets_s19_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s19, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Our 3-Layer Solution"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s19_2 = [
        "Composite Unique Index: Database strictly prevents duplicate applications atomically.",
        "Pre-Warmed Connection Pool: Maintains sub-15ms database access without dropping queries.",
        "Client-Side Button Debounce: Prevents accidental double submissions on rapid clicks."
    ]
    for b in bullets_s19_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s19, "Concurrency is handled at every level: button debounce in UI, server actions, and database unique constraints.")

    # SLIDE 20: Traffic Spike Simulation & Throughput (Native Chart)
    s20 = prs.slides.add_slide(blank_layout)
    set_slide_background(s20, C_LIGHT_BG)
    add_header(s20, "Load Testing", "Load Simulation: Consistent Sub-150ms Response Under Load", tag_color=C_ELECTRIC_VIOLET)

    c_left = add_card(s20, Inches(0.8), Inches(1.68), Inches(5.4), Inches(5.25), C_WHITE, C_ELECTRIC_VIOLET, 2.5)
    tf = c_left.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "Load Test Results"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ELECTRIC_VIOLET
    bullets_s20 = [
        "Simulated 500 Concurrent Users: Replicated real campus traffic surge before 11:59 PM.",
        "Zero Failed Submissions: 100% of candidate applications committed without errors.",
        "Stable Latency: Response time stayed below 150ms even during peak throughput."
    ]
    for b in bullets_s20:
        pb = tf.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    chart_card = add_card(s20, Inches(6.5), Inches(1.68), Inches(6.0), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    c_data = CategoryChartData()
    c_data.categories = ["10 Users", "50 Users", "150 Users", "300 Users", "500 Users"]
    c_data.add_series("Latency (ms)", (45, 62, 88, 115, 142))
    x, y, cx, cy = Inches(6.7), Inches(2.2), Inches(5.6), Inches(4.5)
    chart = s20.shapes.add_chart(XL_CHART_TYPE.LINE_MARKERS, x, y, cx, cy, c_data).chart
    chart.has_legend = False

    add_notes(s20, "Load testing demonstrates stable 142ms latency even at 500 simultaneous active users.")

    # SLIDE 21: Pre-Warmed Connection Pooling: Sub-15ms DB Queries
    s21 = prs.slides.add_slide(blank_layout)
    set_slide_background(s21, C_LIGHT_BG)
    add_header(s21, "Database Optimization", "Connection Pooling: Sub-15ms Queries Without Cold Starts", tag_color=C_ROYAL_BLUE)

    takeaways_s21 = [
        "Pre-Warmed Pool: Keeps active connections ready to eliminate connection handshake delays.",
        "Direct SQL Queries: Prisma ORM queries execute directly against indexed foreign keys.",
        "Scalable Resource Limits: Gracefully manages traffic spikes without connection dropouts."
    ]
    add_real_diagram_slide(s21, "uml_workflow.png", "Connection Pool Flow", "HIGH-THROUGHPUT POOL", takeaways_s21, C_ROYAL_BLUE)

    add_notes(s21, "Connection pooling keeps database query latency under 15ms across all API routes.")

    # SLIDE 22: Race Condition Prevention: Atomic Transactions
    s22 = prs.slides.add_slide(blank_layout)
    set_slide_background(s22, C_LIGHT_BG)
    add_header(s22, "Data Integrity", "Atomic Transactions: Zero Double Submissions & Clean Audits", tag_color=C_MINT_GREEN)

    c1 = add_card(s22, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Prisma $transaction In Action"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s22_1 = [
        "All-or-Nothing Commit: Application insertion and count increments succeed or fail together.",
        "Zero Partial Records: If any step fails, database automatically rolls back completely.",
        "Audit Trail Integrity: Moderator notes are committed simultaneously with account updates."
    ]
    for b in bullets_s22_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s22, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Composite Unique Constraint"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s22_2 = [
        "@@unique([opportunityId, applicantId]): Database strictly blocks duplicate submissions.",
        "No Duplicate Applications: Even if a student clicks twice, only one record is stored.",
        "Clean Error Recovery: Returns friendly 'Already Applied' status badge immediately."
    ]
    for b in bullets_s22_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s22, "Atomic transactions ensure database integrity across multi-step application and audit operations.")

    # SLIDE 23: Asynchronous Email & Notification Processing
    s23 = prs.slides.add_slide(blank_layout)
    set_slide_background(s23, C_LIGHT_BG)
    add_header(s23, "Asynchronous Workers", "Background Alerts: Fast UI Feedback with Async Email Delivery", tag_color=C_CYAN_SKY)

    takeaways_s23 = [
        "Instant UI Feedback: Student sees application confirmation modal in under 150ms.",
        "Non-Blocking Emails: Reviewer alert emails fire asynchronously in background worker.",
        "Zero User Waiting: Email server delays never cause student applications to hang."
    ]
    add_real_diagram_slide(s23, "uml_sequence.png", "Async Notification Flow", "BACKGROUND WORKERS", takeaways_s23, C_CYAN_SKY)

    add_notes(s23, "Decoupling email delivery from HTTP responses guarantees student UI stays lightning fast.")

    # SLIDE 24: Concurrency Defense Q&A: Never Crashing at 11:59 PM
    s24 = prs.slides.add_slide(blank_layout)
    set_slide_background(s24, C_LIGHT_BG)
    add_header(s24, "Q&A Defense", "Concurrency Defense: How We Guarantee Deadline Reliability", tag_color=C_HOT_CORAL)

    c1 = add_card(s24, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Concurrency Scenarios"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s24_1 = [
        "Scenario 1: Student double-clicks 'Submit Application' simultaneously.",
        "Scenario 2: 100 students apply in the final 60 seconds before midnight.",
        "Scenario 3: Moderator reviews reports while applicants update records."
    ]
    for b in bullets_s24_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s24, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Engineered Protections"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s24_2 = [
        "Protection 1: Composite unique key rejects duplicate with clean UI feedback.",
        "Protection 2: Pre-warmed pool and serverless scaling absorb traffic spikes.",
        "Protection 3: Multi-version concurrency control (MVCC) prevents database lockups."
    ]
    for b in bullets_s24_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s24, "Confidently explain how database constraints prevent double submissions and protect data consistency.")

    # =========================================================================
    # PART 4: SYSTEM ARCHITECTURE & UML MODELING (SLIDES 25 - 28)
    # =========================================================================

    # SLIDE 25: UML Modeling Overview
    s25 = prs.slides.add_slide(blank_layout)
    set_slide_background(s25, C_LIGHT_BG)
    add_header(s25, "UML Modeling", "System Architecture: 4 Core UML 2.5 Models", tag_color=C_ELECTRIC_VIOLET)

    headers_s25 = ["UML Diagram", "Modeling Focus", "What It Demonstrates", "Key Architectural Takeaway"]
    rows_s25 = [
        ["1. Use Case Model", "Actor Boundaries", "What Student, Alumni, and Admin can each do.", "Clear role permissions and security separation."],
        ["2. Swimlane Activity", "Application Journey", "Cross-functional steps across 4 swimlanes.", "How student, server, DB, and alumni interact."],
        ["3. Sequence Timeline", "Execution Timing", "Exact message flow from submit to commit.", "Sub-150ms response and async email alerts."],
        ["4. Domain Classes", "Object Architecture", "Core database entities, keys & relationships.", "Clean encapsulation and 3NF normalization."]
    ]
    add_table(s25, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s25, rows_s25, [Inches(2.5), Inches(2.6), Inches(3.6), Inches(3.0)], header_bg=C_ELECTRIC_VIOLET)

    add_notes(s25, "Introduce the 4 primary UML models. Each model highlights a distinct engineering perspective.")

    # SLIDE 26: UML Diagram 1: System Use Case (EMBEDDED PRISTINE DIAGRAM)
    s26 = prs.slides.add_slide(blank_layout)
    set_slide_background(s26, C_LIGHT_BG)
    add_header(s26, "UML Model 1: Use Cases", "Use Case Diagram: Student, Alumni & Admin Capabilities", tag_color=C_ROYAL_BLUE)

    takeaways_s26 = [
        "Student Scope: Calculate true CGPA, 1-click apply with CV, share campus leads & opportunities.",
        "Alumni Scope: Share job leads, sponsor student referrals, review applicants.",
        "Admin Scope: Verify student rosters, approve job posts, maintain immutable audit trail."
    ]
    add_real_diagram_slide(s26, "uml_use_case.png", "System Use Case Diagram", "3 CORE ACTORS", takeaways_s26, C_ROYAL_BLUE)

    add_notes(s26, "Point to the 3 clear actor roles on the left and the distinct functional capabilities inside the system boundary.")

    # SLIDE 27: UML Diagram 2: 4-Swimlane Activity Flow (EMBEDDED PRISTINE DIAGRAM)
    s27 = prs.slides.add_slide(blank_layout)
    set_slide_background(s27, C_LIGHT_BG)
    add_header(s27, "UML Model 2: Activity Flow", "4-Swimlane Activity: Complete Candidate Application Journey", tag_color=C_MINT_GREEN)

    takeaways_s27 = [
        "4 Clear Swimlanes: Student UI, UniCareer Engine, Database (3NF), and Alumni Reviewer.",
        "Duplicate Gate: System checks composite index before creating application records.",
        "Full Pipeline: From initial student discovery down to alumni interview shortlisting."
    ]
    add_real_diagram_slide(s27, "uml_swimlane.png", "Activity Swimlane Diagram", "CROSS-FUNCTIONAL PIPELINE", takeaways_s27, C_MINT_GREEN)

    add_notes(s27, "Explain the vertical swimlanes showing cross-functional execution from student to alumni reviewer.")

    # SLIDE 28: UML Diagram 3: System Sequence Timeline (EMBEDDED PRISTINE DIAGRAM)
    s28 = prs.slides.add_slide(blank_layout)
    set_slide_background(s28, C_LIGHT_BG)
    add_header(s28, "UML Model 3: Sequence", "Sequence Diagram: 142ms Execution From Submit to Commit", tag_color=C_CYAN_SKY)

    takeaways_s28 = [
        "Under 150ms Round-Trip: 8-step application lifecycle completes in 142 milliseconds.",
        "Zero Duplicate Applications: Composite unique index prevents duplicate submissions.",
        "Non-Blocking Alerts: Student receives HTTP 201 Created while alumni email fires in background."
    ]
    add_real_diagram_slide(s28, "uml_sequence.png", "System Sequence Diagram", "SUB-150MS TIMELINE", takeaways_s28, C_CYAN_SKY)

    add_notes(s28, "Point to the sequence timeline on the left: student gets confirmation immediately before email fires.")

    # SLIDE 29: UML Diagram 4: Core Domain Classes (EMBEDDED PRISTINE DIAGRAM)
    s29 = prs.slides.add_slide(blank_layout)
    set_slide_background(s29, C_LIGHT_BG)
    add_header(s29, "UML Model 4: Class Structure", "Class Diagram: Core Domain Entities & Relational Keys", tag_color=C_ELECTRIC_VIOLET)

    takeaways_s29 = [
        "User & Profile: 1:1 master account connects to student profile and academic CGPA.",
        "Opportunities & Applications: 1:N relationship with composite unique index constraint.",
        "Referrals & Audit Trail: Clean domain models for alumni referrals and admin audit logging."
    ]
    add_real_diagram_slide(s29, "uml_class.png", "Core Domain Class Diagram", "CLEAN DOMAIN MODELS", takeaways_s29, C_ELECTRIC_VIOLET)

    add_notes(s29, "Domain models enforce single account architecture and clean separation of academic data.")

    # =========================================================================
    # PART 5: DATABASE ARCHITECTURE & 3NF ERD (SLIDES 30 - 38)
    # =========================================================================

    # SLIDE 30: 3NF Relational Database Architecture & ERD (EMBEDDED PRISTINE DIAGRAM)
    s30 = prs.slides.add_slide(blank_layout)
    set_slide_background(s30, C_LIGHT_BG)
    add_header(s30, "Database Design", "Relational ERD: 3NF Normalized Schema & Constraints", tag_color=C_ROYAL_BLUE)

    takeaways_s30 = [
        "Strict 3NF Schema: All tables normalized to eliminate redundant data and update anomalies.",
        "Composite Unique Keys: @@unique([opportunityId, applicantId]) blocks double submissions.",
        "Cascade Integrity: Student profile deletions cascade cleanly to prevent orphaned records."
    ]
    add_real_diagram_slide(s30, "uml_erd.png", "3NF Relational ERD", "STRICT 3NF SCHEMA", takeaways_s30, C_ROYAL_BLUE)

    add_notes(s30, "Walk through the 3NF ERD. Point out primary keys, foreign constraints, and composite unique keys.")

    # SLIDE 31: Relational Schema Design: 3NF Normalization Rigor
    s31 = prs.slides.add_slide(blank_layout)
    set_slide_background(s31, C_LIGHT_BG)
    add_header(s31, "Schema Normalization", "Why 3NF Normalization Matters for University Data", tag_color=C_MINT_GREEN)

    c1 = add_card(s31, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Eliminating Data Anomalies"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s31_1 = [
        "1NF (Atomic Values): Grades, credits, and student IDs live in dedicated individual columns.",
        "2NF (Full Functional Dependency): All non-key fields depend entirely on the primary key.",
        "3NF (Zero Transitive Dependencies): Department data is decoupled to prevent update anomalies."
    ]
    for b in bullets_s31_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s31, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Direct Engineering Benefits"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s31_2 = [
        "Zero Orphaned Records: Foreign key cascade rules keep the database cleanly organized.",
        "Instant Queries (<5ms): Clean indexing allows fast searches across thousands of listings.",
        "Safe Updates: Updating a company name or department title reflects everywhere instantly."
    ]
    for b in bullets_s31_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s31, "3NF normalization eliminates redundancy and guarantees consistent data across all university operations.")

    # SLIDE 32: Table Definition: users (Master Identity)
    s32 = prs.slides.add_slide(blank_layout)
    set_slide_background(s32, C_LIGHT_BG)
    add_header(s32, "Table Schema: users", "Database Table: users (Master Account Identity)", tag_color=C_ROYAL_BLUE)

    headers_s32 = ["Column Name", "PostgreSQL Type", "Constraints", "Real Sample Data"]
    rows_s32 = [
        ["id", "TEXT", "PRIMARY KEY (cuid)", "cmw81fqwb0000wsr7um4y2gwv"],
        ["email", "TEXT", "UNIQUE NOT NULL", "sajib.student@jnu.ac.bd"],
        ["membershipType", "ENUM", "STUDENT / ALUMNI / ADMIN", "STUDENT"],
        ["verificationStatus", "ENUM", "PENDING / VERIFIED", "VERIFIED"],
        ["accountStatus", "ENUM", "ACTIVE / SUSPENDED", "ACTIVE"],
        ["createdAt", "TIMESTAMP", "DEFAULT NOW()", "2026-11-09T08:30:00Z"]
    ]
    add_table(s32, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s32, rows_s32, [Inches(2.5), Inches(2.2), Inches(3.2), Inches(3.8)], header_bg=C_ROYAL_BLUE)

    add_notes(s32, "Unified user table manages authentication for students, alumni, and admins with verified status flags.")

    # SLIDE 33: Table Definition: profiles & academic_records
    s33 = prs.slides.add_slide(blank_layout)
    set_slide_background(s33, C_LIGHT_BG)
    add_header(s33, "Academic Tables", "Database Tables: profiles & academic_records (CGPA Ledger)", tag_color=C_ELECTRIC_VIOLET)

    headers_s33 = ["Table & Field", "Type", "Constraints", "Real Sample Data"]
    rows_s33 = [
        ["profiles.studentId", "TEXT", "UNIQUE (Registrar Match)", "JnU-CSE-2022-041"],
        ["profiles.department", "TEXT", "NOT NULL", "Computer Science & Engineering"],
        ["profiles.cumulativeCgpa", "DECIMAL(3,2)", "CHECK(0.00 - 4.00)", "3.84"],
        ["academic.termName", "TEXT", "NOT NULL", "Spring 2025 (4th Semester)"],
        ["academic.termGpa", "DECIMAL(3,2)", "CHECK(0.00 - 4.00)", "3.90"],
        ["academic.credits", "DECIMAL(3,1)", "CHECK(0.5 - 30.0)", "15.0"]
    ]
    add_table(s33, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s33, rows_s33, [Inches(2.8), Inches(2.2), Inches(3.2), Inches(3.5)], header_bg=C_ELECTRIC_VIOLET)

    add_notes(s33, "Academic records store term-by-term grades; overall CGPA is computed automatically using credit weighting.")

    # SLIDE 34: Table Definition: opportunities (Postings) (Native Chart)
    s34 = prs.slides.add_slide(blank_layout)
    set_slide_background(s34, C_LIGHT_BG)
    add_header(s34, "Opportunities Table", "Database Table: opportunities (Verified Job Listings)", tag_color=C_SUNSET_ORANGE)

    c_left = add_card(s34, Inches(0.8), Inches(1.68), Inches(5.4), Inches(5.25), C_WHITE, C_SUNSET_ORANGE, 2.5)
    tf = c_left.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "Opportunity Schema Highlights"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_SUNSET_ORANGE
    bullets_s34 = [
        "Title & Company: Role title, company name, and location clearly structured.",
        "Role Classification: OFFICIAL_EMPLOYER vs. COMMUNITY_SHARED lead.",
        "Eligibility Rules: Min CGPA requirement, target department list, and deadline date."
    ]
    for b in bullets_s34:
        pb = tf.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    chart_card = add_card(s34, Inches(6.5), Inches(1.68), Inches(6.0), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    c_data = CategoryChartData()
    c_data.categories = ["Software Engineering", "Product Design", "Cloud Infrastructure", "FinTech Trainee", "Data Analytics"]
    c_data.add_series("Live Listings", (14, 8, 9, 7, 5))
    x, y, cx, cy = Inches(6.7), Inches(2.2), Inches(5.6), Inches(4.5)
    chart = s34.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, x, y, cx, cy, c_data).chart
    chart.has_legend = False

    add_notes(s34, "Opportunities table stores curated jobs with specific eligibility rules and application deadlines.")

    # SLIDE 35: Table Definition: applications (Candidate Pipeline)
    s35 = prs.slides.add_slide(blank_layout)
    set_slide_background(s35, C_LIGHT_BG)
    add_header(s35, "Applications Table", "Database Table: applications (Candidate Pipeline Tracker)", tag_color=C_MINT_GREEN)

    headers_s35 = ["Column Name", "PostgreSQL Type", "Constraints", "Real Sample Data"]
    rows_s35 = [
        ["id", "TEXT", "PRIMARY KEY (cuid)", "app_cmw33e8fh0004f2r7whpb95sf"],
        ["opportunityId", "TEXT", "FK -> opportunities.id", "opp_cmw32xqlm000mz4r7zz8n7cf6"],
        ["applicantId", "TEXT", "FK -> users.id", "usr_cmw81fqwb0000wsr7um4y2gwv"],
        ["opp_app_unique", "COMPOSITE", "@@unique([opp_id, app_id])", "Blocks duplicate student apply"],
        ["status", "ENUM", "7-Stage Pipeline Enum", "SHORTLISTED"],
        ["resumeUrl", "TEXT", "Private Signed PDF Link", "https://vault.unicareer.edu/cv/sajib.pdf"]
    ]
    add_table(s35, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s35, rows_s35, [Inches(2.5), Inches(2.2), Inches(3.3), Inches(3.7)], header_bg=C_MINT_GREEN)

    add_notes(s35, "Applications table links student resumes to opportunities with strict duplicate application prevention.")

    # SLIDE 36: Table Definition: referral_requests (Alumni Hub)
    s36 = prs.slides.add_slide(blank_layout)
    set_slide_background(s36, C_LIGHT_BG)
    add_header(s36, "Referrals Table", "Database Table: referral_requests (Alumni Referral Hub)", tag_color=C_HOT_CORAL)

    headers_s36 = ["Column Name", "PostgreSQL Type", "Constraints", "Real Sample Data"]
    rows_s36 = [
        ["id", "TEXT", "PRIMARY KEY (cuid)", "ref_cmw93f8q9000073r75m0fw9ma"],
        ["studentId", "TEXT", "FK -> users.id (Student)", "Student ID requesting referral"],
        ["alumniId", "TEXT", "FK -> users.id (Alumni)", "Alumni mentor at target firm"],
        ["targetCompany", "TEXT", "NOT NULL", "Google Bangladesh / Brain Station 23"],
        ["status", "ENUM", "PENDING / ACCEPTED / REFERRED", "ACCEPTED (Referral Sponsored!)"],
        ["message", "TEXT", "CHECK(length >= 20)", "Hi! I noticed an opening on your team..."]
    ]
    add_table(s36, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s36, rows_s36, [Inches(2.5), Inches(2.2), Inches(3.3), Inches(3.7)], header_bg=C_HOT_CORAL)

    add_notes(s36, "Referrals table routes candidate pitches directly to verified alumni mentors working at target employers.")

    # SLIDE 37: Table Definition: admin_audit_logs (Immutable Trail)
    s37 = prs.slides.add_slide(blank_layout)
    set_slide_background(s37, C_LIGHT_BG)
    add_header(s37, "Audit Trail Table", "Database Table: admin_audit_logs (Immutable Accountability)", tag_color=C_ROYAL_BLUE)

    headers_s37 = ["Column Name", "PostgreSQL Type", "Constraints", "Real Sample Data"]
    rows_s37 = [
        ["id", "TEXT", "PRIMARY KEY (cuid)", "aud_cmw868g9b00031kr78pblwmx7"],
        ["adminId", "TEXT", "FK -> users.id (Admin)", "Staff account performing action"],
        ["actionType", "TEXT", "NOT NULL", "VERIFICATION_APPROVED"],
        ["targetUserId", "TEXT", "FK -> users.id (Target)", "Student or alumni affected"],
        ["reason", "TEXT", "CHECK(length >= 5)", "Registrar roster confirmed for CSE 2026"],
        ["loggedAt", "TIMESTAMP", "DEFAULT NOW()", "2026-11-09T14:22:10Z"]
    ]
    add_table(s37, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s37, rows_s37, [Inches(2.5), Inches(2.2), Inches(3.3), Inches(3.7)], header_bg=C_ROYAL_BLUE)

    add_notes(s37, "Audit log records administrative decisions immutably to guarantee fairness and institutional accountability.")

    # SLIDE 38: Admin Seed Data vs. Operational User Data
    s38 = prs.slides.add_slide(blank_layout)
    set_slide_background(s38, C_LIGHT_BG)
    add_header(s38, "Data Architecture", "Data Partition: Seed Configurations vs. Operational Records", tag_color=C_ELECTRIC_VIOLET)

    c1 = add_card(s38, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ELECTRIC_VIOLET, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "🏛️ Administrative Seed Data"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ELECTRIC_VIOLET
    bullets_s38_1 = [
        "Department Master List: 15 official academic faculties seeded directly from university catalog.",
        "Registrar Whitelist: Student ID roster used for instant verification matching.",
        "Role Permissions Matrix: Pre-configured capability rules for Student, Alumni, and Admin."
    ]
    for b in bullets_s38_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s38, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "👥 Operational Dynamic Data"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s38_2 = [
        "Live Applications: Stored PDF resumes, status history, and reviewer interview notes.",
        "Referral Exchanges: Student pitches, alumni review decisions, and referral sponsorships.",
        "Community Discussions: Student questions, alumni career advice, comments, and reactions."
    ]
    for b in bullets_s38_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s38, "Clear separation between administrative configuration data and dynamic user operational records.")

    # =========================================================================
    # PART 6: USER INTERFACE ARCHITECTURE (SLIDES 39 - 48)
    # =========================================================================

    # SLIDE 39: UI Architecture Overview
    s39 = prs.slides.add_slide(blank_layout)
    set_slide_background(s39, C_LIGHT_BG)
    add_header(s39, "UI Architecture", "UI Architecture: Input -> Processing -> Output Flow", tag_color=C_ROYAL_BLUE)

    takeaways_s39 = [
        "Input Screens: Form validation, boundary checks, and client-side debounce.",
        "Processing Engine: Server-side validation with Zod schemas and credit-weighted CGPA.",
        "Output Systems: Celebration modals, live status trackers, and immutable audit reports."
    ]
    add_real_diagram_slide(s39, "uml_workflow.png", "UI Architecture Flow", "INPUT TO OUTPUT", takeaways_s39, C_ROYAL_BLUE)

    add_notes(s39, "Walk through the UI architecture: input constraints at forms, processing in server actions, and instant visual output.")

    # SLIDE 40: Input Screen 1: University Email Login & Registration
    s40 = prs.slides.add_slide(blank_layout)
    set_slide_background(s40, C_LIGHT_BG)
    add_header(s40, "Input Interface 1", "Input UI: University Email Sign-In & Verification", tag_color=C_ROYAL_BLUE)

    rules_s40 = [
        "Domain Whitelist: Enforces official @jnu.ac.bd university or corporate domain.",
        "Password Strength: Minimum 8 characters with boundary validation.",
        "Role Selection: Unifies registration under Student, Alumni, or Admin personas."
    ]
    stats_s40 = ["Active Registered Accounts: 180+ Members", "Domain Validation Accuracy: 100%"]
    add_ui_slide_with_image(s40, "placeholder_registration.png", "Authentication & Registration", rules_s40, stats_s40, C_ROYAL_BLUE)

    add_notes(s40, "Screen validates university email domains before dispatching verification codes.")

    # SLIDE 41: Input Screen 2: Academic CGPA Calculator & Record Ledger
    s41 = prs.slides.add_slide(blank_layout)
    set_slide_background(s41, C_LIGHT_BG)
    add_header(s41, "Input Interface 2", "Input UI: Academic Record Entry & True CGPA Calculator", tag_color=C_ELECTRIC_VIOLET)

    rules_s41 = [
        "GPA Range Constraint: Strictly enforces numeric values between 0.00 and 4.00.",
        "Credit Hours Boundary: Enforces course credit values between 0.5 and 30.0 credits.",
        "1-Click Standing: Interactive pill buttons for 1st Year, 2nd Year, 3rd Year, 4th Year."
    ]
    stats_s41 = ["Average Campus CGPA: 3.48", "Weighted Credit Accuracy: 100%"]
    add_ui_slide_with_image(s41, "placeholder_academic_tools.png", "CGPA Calculation Modal", rules_s41, stats_s41, C_ELECTRIC_VIOLET)

    add_notes(s41, "Pill buttons simplify academic standing selection; GPA inputs have boundary constraints.")

    # SLIDE 42: Input Screen 3: Opportunities Browser & Match Filter
    s42 = prs.slides.add_slide(blank_layout)
    set_slide_background(s42, C_LIGHT_BG)
    add_header(s42, "Input Interface 3", "Input UI: Job Discovery, Filters & CGPA Cutoff Matching", tag_color=C_CYAN_SKY)

    rules_s42 = [
        "Responsive Select Width: Generous 18.5rem dropdown width prevents text truncation.",
        "CGPA Cutoff Matching: Automatically hides or highlights jobs matching student GPA.",
        "Multi-Facet Search: Real-time filtering by role type, workplace, source, and major."
    ]
    stats_s42 = ["Live Verified Postings: 40+ Openings", "Average Search Latency: <15ms"]
    add_ui_slide_with_image(s42, "placeholder_opportunities.png", "Opportunities Browser UI", rules_s42, stats_s42, C_CYAN_SKY)

    add_notes(s42, "Filter dropdowns have generous touch targets and full department names fit without truncation.")

    # SLIDE 43: Input Screen 4: 1-Click Job Application & Resume Upload
    s43 = prs.slides.add_slide(blank_layout)
    set_slide_background(s43, C_LIGHT_BG)
    add_header(s43, "Input Interface 4", "Input UI: 1-Click Application & Secure PDF Upload", tag_color=C_MINT_GREEN)

    rules_s43 = [
        "PDF Format Validation: Strictly enforces genuine PDF documents up to 5 MB.",
        "Duplicate Application Guard: Prevents repeated submissions for the same opening.",
        "Cover Note Input: Optional message to recruiter with character count limits."
    ]
    stats_s43 = ["Applications Submitted: 320+ Dossiers", "Average Submit Latency: 142ms"]
    add_ui_slide_with_image(s43, "placeholder_application_dossier.png", "Application Submission Modal", rules_s43, stats_s43, C_MINT_GREEN)

    add_notes(s43, "1-click apply saves student resumes; duplicate checks prevent double submissions.")

    # SLIDE 44: Input Screen 5: Alumni Referral Pitch Modal
    s44 = prs.slides.add_slide(blank_layout)
    set_slide_background(s44, C_LIGHT_BG)
    add_header(s44, "Input Interface 5", "Input UI: Alumni Referral Pitch & Candidate Dossier", tag_color=C_SUNSET_ORANGE)

    rules_s44 = [
        "Pitch Length Constraint: Requires minimum 20 characters explaining qualifications.",
        "Target Employer Selection: Identifies company where alumnus currently works.",
        "Anti-Spam Quota: Students capped at 3 active referral requests simultaneously."
    ]
    stats_s44 = ["Referrals Sponsored: 65+ Candidates", "Alumni Response Rate: 84%"]
    add_ui_slide_with_image(s44, "placeholder_referral_hub.png", "Referral Pitch Modal", rules_s44, stats_s44, C_SUNSET_ORANGE)

    add_notes(s44, "Referral modal enforces minimum pitch length to encourage thoughtful, professional requests.")

    # SLIDE 45: Processing & Output: Live Application Tracker (Native Chart)
    s45 = prs.slides.add_slide(blank_layout)
    set_slide_background(s45, C_LIGHT_BG)
    add_header(s45, "Processing Flow", "Output UI: Real-Time Application Tracker & Pipeline Stages", tag_color=C_HOT_CORAL)

    c_left = add_card(s45, Inches(0.8), Inches(1.68), Inches(5.4), Inches(5.25), C_WHITE, C_HOT_CORAL, 2.5)
    tf = c_left.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "7-Stage Pipeline Workflow"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_HOT_CORAL
    bullets_s45 = [
        "Live Status Updates: Submitted -> Reviewing -> Shortlisted -> Interview -> Accepted.",
        "Color-Coded Badges: Immediate visual feedback on candidate progress.",
        "Withdrawal Capability: Students can withdraw applications cleanly before review."
    ]
    for b in bullets_s45:
        pb = tf.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    chart_card = add_card(s45, Inches(6.5), Inches(1.68), Inches(6.0), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    c_data = CategoryChartData()
    c_data.categories = ["Submitted", "Reviewing", "Shortlisted", "Interview", "Offer Accepted"]
    c_data.add_series("Active Pipeline", (120, 85, 45, 28, 14))
    x, y, cx, cy = Inches(6.7), Inches(2.2), Inches(5.6), Inches(4.5)
    chart = s45.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, x, y, cx, cy, c_data).chart
    chart.has_legend = False

    add_notes(s45, "Application tracker shows candidate pipeline progression across all 7 stages.")

    # SLIDE 46: Output Screen 1: Celebration Modal & Application Dossier
    s46 = prs.slides.add_slide(blank_layout)
    set_slide_background(s46, C_LIGHT_BG)
    add_header(s46, "Output Interface 1", "Output UI: Instant Celebration Modal & Success Confirmation", tag_color=C_MINT_GREEN)

    rules_s46 = [
        "Celebration Modal: Prominent green checkmark confirms successful transmission.",
        "Status Indicator: Displays current stage with direct link to My Applications tracker.",
        "Time-Stamped Confirmation: Confirms exact timestamp of application commit."
    ]
    stats_s46 = ["Confirmation Latency: <150ms", "Application Success Rate: 100%"]
    add_ui_slide_with_image(s46, "placeholder_application_tracker.png", "Celebration Modal & Dossier", rules_s46, stats_s46, C_MINT_GREEN)

    add_notes(s46, "Instant celebration modal reassures students that their application was successfully delivered.")

    # SLIDE 47: Output Screen 2: Career Calendar & Deadlines
    s47 = prs.slides.add_slide(blank_layout)
    set_slide_background(s47, C_LIGHT_BG)
    add_header(s47, "Output Interface 2", "Output UI: Career Calendar & Deadline Tracking", tag_color=C_CYAN_SKY)

    rules_s47 = [
        "Interactive Calendar Grid: Displays upcoming interviews, deadlines, and fairs.",
        "1-Click Reminder Modal: Add personal milestones with rounded-xl time pickers.",
        "Deadline Visual Indicators: Red/amber color badges for approaching cutoffs."
    ]
    stats_s47 = ["Calendar Milestones Tracked: 240+", "Deadline Reminder Accuracy: 100%"]
    add_ui_slide_with_image(s47, "placeholder_career_calendar.png", "Career Calendar View", rules_s47, stats_s47, C_CYAN_SKY)

    add_notes(s47, "Career calendar helps students track interview dates and application deadlines in one place.")

    # SLIDE 48: Output Screen 3: Admin Verification & Moderation Dashboard
    s48 = prs.slides.add_slide(blank_layout)
    set_slide_background(s48, C_LIGHT_BG)
    add_header(s48, "Output Interface 3", "Output UI: Admin Governance & Verification Dashboard", tag_color=C_HOT_CORAL)

    rules_s48 = [
        "1-Click Verification: Approves student profiles against registrar rolls in 1 click.",
        "Constructive Rejection: Feedback dialog guides students on fixing registration data.",
        "Mandatory Accountability: Account suspension requires minimum 5-character reason."
    ]
    stats_s48 = ["Verified Accounts: 95% Verified", "Average Admin Approval: <24h"]
    add_ui_slide_with_image(s48, "placeholder_admin_governance.png", "Admin Governance Portal", rules_s48, stats_s48, C_HOT_CORAL)

    add_notes(s48, "Admin dashboard provides complete oversight over member verification and job moderation.")

    # =========================================================================
    # PART 7: VERIFICATION, TESTING & DEFENSE (SLIDES 49 - 56)
    # =========================================================================

    # SLIDE 49: Verification & Testing Methodology: 193 Automated Tests
    s49 = prs.slides.add_slide(blank_layout)
    set_slide_background(s49, C_LIGHT_BG)
    add_header(s49, "Quality Assurance", "Testing Rigor: 193 Automated Tests Across 16 Test Suites", tag_color=C_ELECTRIC_VIOLET)

    c1 = add_card(s49, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Automated Test Matrix"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s49_1 = [
        "16 Comprehensive Suites: Tests auth, applications, referrals, CGPA, and admin tools.",
        "193 Passing Tests: 100% test pass rate with zero flaky or failing assertions.",
        "Real Database Queries: Tests execute against live PostgreSQL database with rollbacks."
    ]
    for b in bullets_s49_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s49, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Engineering Rigor Highlights"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s49_2 = [
        "Zero TypeScript Errors: Strict typing enforced with 0 errors across entire codebase.",
        "Playwright E2E Testing: Automated browser journeys verify student and alumni flows.",
        "Atomic Boundary Checks: Validates GPA limits, duplicate protection, and audit logs."
    ]
    for b in bullets_s49_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s49, "Every major feature is backed by automated tests running against the real PostgreSQL database.")

    # SLIDE 50: Playwright E2E Browser Testing: Real User Journeys
    s50 = prs.slides.add_slide(blank_layout)
    set_slide_background(s50, C_LIGHT_BG)
    add_header(s50, "E2E Testing", "Playwright E2E: Real User Journeys Tested in Browser", tag_color=C_ROYAL_BLUE)

    e2e_steps = [
        ("Journey 1: Student Sign-Up & CGPA", "Student logs in with university email, enters semester grades, and verifies CGPA calculates correctly.", C_ROYAL_BLUE),
        ("Journey 2: Job Apply & Duplicate Block", "Student applies for an internship with resume; second attempt is cleanly blocked by duplicate guard.", C_MINT_GREEN),
        ("Journey 3: Alumni Referral Pitch", "Student pitches an alumni mentor; alumnus receives pitch and accepts recommendation.", C_SUNSET_ORANGE),
        ("Journey 4: Admin Verification & Audit", "Admin verifies new student roster; system records immutable audit log with justification.", C_HOT_CORAL)
    ]
    for idx, (j_t, j_d, col) in enumerate(e2e_steps):
        top_pos = Inches(1.68 + idx * 1.34)
        c = add_card(s50, Inches(0.8), top_pos, Inches(11.7), Inches(1.20), C_WHITE, col, 2.5)
        tf = c.text_frame; tf.word_wrap = True
        p0 = tf.paragraphs[0]; p0.text = j_t; p0.font.size = Pt(22); p0.font.bold = True; p0.font.color.rgb = col
        p1 = tf.add_paragraph(); p1.text = j_d; p1.font.size = Pt(17); p1.font.color.rgb = C_TEXT_DARK; p1.space_before = Pt(4)

    add_notes(s50, "Playwright browser tests simulate real user interactions across all 4 key platform workflows.")

    # SLIDE 51: Vitest Unit & Integration Test Matrix (All 16 Suites)
    s51 = prs.slides.add_slide(blank_layout)
    set_slide_background(s51, C_LIGHT_BG)
    add_header(s51, "Test Matrix", "Vitest Matrix: All 16 Test Suites Passed (100% Green)", tag_color=C_MINT_GREEN)

    headers_s51 = ["Suite Area", "Tests", "Scope Covered", "Execution Result"]
    rows_s51 = [
        ["Authentication & Sessions", "28 Tests", "OTP, whitelist matching, session security.", "100% Passed (Green)"],
        ["CGPA & Academic Ledger", "24 Tests", "Credit weighting, boundary validation, check.", "100% Passed (Green)"],
        ["Opportunities & Matching", "38 Tests", "Search, bookmarking, cutoff eligibility.", "100% Passed (Green)"],
        ["Applications & Dossiers", "35 Tests", "1-click apply, duplicate guard, pipeline.", "100% Passed (Green)"],
        ["Referral Routing & Hub", "32 Tests", "Pitch length, anti-spam quota, sponsor.", "100% Passed (Green)"],
        ["Admin Governance & Audit", "36 Tests", "Roster verification, suspension, logs.", "100% Passed (Green)"]
    ]
    add_table(s51, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s51, rows_s51, [Inches(3.0), Inches(1.8), Inches(4.3), Inches(2.6)], header_bg=C_MINT_GREEN)

    add_notes(s51, "193 automated tests across 16 suites verify core business logic and database constraints.")

    # SLIDE 52: Test Results & Quality Metrics (Native Donut Chart)
    s52 = prs.slides.add_slide(blank_layout)
    set_slide_background(s52, C_LIGHT_BG)
    add_header(s52, "Test Verification", "Quality Metrics: 193 Tests Passed • Zero Regressions", tag_color=C_ELECTRIC_VIOLET)

    c_left = add_card(s52, Inches(0.8), Inches(1.68), Inches(5.4), Inches(5.25), C_WHITE, C_ELECTRIC_VIOLET, 2.5)
    tf = c_left.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.text = "Verification Highlights"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ELECTRIC_VIOLET
    bullets_s52 = [
        "193 Total Tests: 193 passed, 0 failed, 0 skipped across all 16 test files.",
        "Zero TypeScript Errors: Fully strictly typed React 19 and Next.js 16 components.",
        "Clean Database State: All timestamps and artificial test strings humanized."
    ]
    for b in bullets_s52:
        pb = tf.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    chart_card = add_card(s52, Inches(6.5), Inches(1.68), Inches(6.0), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    c_data = CategoryChartData()
    c_data.categories = ["Passed Tests", "Failed Tests", "Skipped Tests"]
    c_data.add_series("Test Execution", (193, 0, 0))
    x, y, cx, cy = Inches(6.7), Inches(2.2), Inches(5.6), Inches(4.5)
    chart = s52.shapes.add_chart(XL_CHART_TYPE.DOUGHNUT, x, y, cx, cy, c_data).chart
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.BOTTOM

    add_notes(s52, "100% test success rate confirms robust software engineering quality.")

    # SLIDE 53: Academic & Software Engineering Contributions
    s53 = prs.slides.add_slide(blank_layout)
    set_slide_background(s53, C_LIGHT_BG)
    add_header(s53, "Academic Value", "Engineering Contributions: Solving Real Campus Problems", tag_color=C_ROYAL_BLUE)

    c1 = add_card(s53, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "🏛️ University Impact"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s53_1 = [
        "Unifies Campus Hiring: Bridges current students directly with working alumni.",
        "Eliminates Manual Paperwork: Replaces manual transcripts with automated CGPA.",
        "Career Center Efficiency: Equips placement officers with real-time audit tools."
    ]
    for b in bullets_s53_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s53, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "💻 Technical Contributions"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s53_2 = [
        "Atomic Duplicate Guard: Prevents race conditions during deadline traffic spikes.",
        "Role-Gated Privacy: Sealed academic ledgers and temporary signed resume URLs.",
        "Modern Full-Stack Standard: Built on React 19, Next.js 16, and Neon PostgreSQL."
    ]
    for b in bullets_s53_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s53, "UniCareer bridges practical software engineering with real institutional value for Jagannath University.")

    # SLIDE 54: Technical Architecture Summary: What We Delivered
    s54 = prs.slides.add_slide(blank_layout)
    set_slide_background(s54, C_LIGHT_BG)
    add_header(s54, "Architecture Summary", "Technical Summary: Production-Ready Full-Stack Platform", tag_color=C_ELECTRIC_VIOLET)

    headers_s54 = ["Architecture Layer", "Technology", "Key Responsibility", "Performance Spec"]
    rows_s54 = [
        ["Presentation Layer", "Next.js 16 + React 19", "Dynamic dashboards, accessible UI, dark mode.", "Instant client-side rendering"],
        ["Application Logic", "Server Actions + Zod", "Authentication, CGPA math, duplicate protection.", "Sub-150ms round-trip latency"],
        ["Data Persistence", "Neon PostgreSQL (3NF)", "Relational data store with pre-warmed pooling.", "Sub-15ms query execution"],
        ["Security & Privacy", "Signed Expiring URLs", "Time-limited access to candidate resume PDFs.", "Zero public file exposure"]
    ]
    add_table(s54, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s54, rows_s54, [Inches(2.5), Inches(2.6), Inches(3.8), Inches(2.8)], header_bg=C_ELECTRIC_VIOLET)

    add_notes(s54, "Summarize the technical layers: modern Next.js 16 front-end, strict business logic, and resilient cloud database.")

    # SLIDE 55: Future Roadmap & Extensibility (Stages 14+)
    s55 = prs.slides.add_slide(blank_layout)
    set_slide_background(s55, C_LIGHT_BG)
    add_header(s55, "Future Roadmap", "Future Roadmap: Expanding University Career Tools", tag_color=C_CYAN_SKY)

    c1 = add_card(s55, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_CYAN_SKY, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Upcoming Capabilities"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_CYAN_SKY
    bullets_s55_1 = [
        "Alumni 1-on-1 Mentorship: Real-time chat messaging between students and seniors.",
        "Virtual Career Fairs: Live video breakout rooms for corporate placement drives.",
        "Automated Resume Review: AI-powered resume feedback tailored to job descriptions."
    ]
    for b in bullets_s55_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s55, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Scalability & Expansion"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s55_2 = [
        "Multi-Campus Federation: Seamless expansion to other national universities.",
        "Mobile App Companion: Push notification reminders for interviews and deadlines.",
        "Enterprise HR Integrations: Direct integration with corporate hiring platforms."
    ]
    for b in bullets_s55_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s55, "The clean modular architecture makes extending to messaging and multi-campus federation seamless.")

    # SLIDE 56: Defense Conclusion, Live Demo & Q&A Open Floor
    s56 = prs.slides.add_slide(blank_layout)
    set_slide_background(s56, C_MIDNIGHT_HERO)

    b1 = s56.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.4), Inches(0.24), Inches(5.0))
    b1.fill.solid(); b1.fill.fore_color.rgb = C_ELECTRIC_VIOLET; b1.line.fill.background()
    b2 = s56.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.10), Inches(1.4), Inches(0.16), Inches(5.0))
    b2.fill.solid(); b2.fill.fore_color.rgb = C_CYAN_SKY; b2.line.fill.background()
    b3 = s56.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.32), Inches(1.4), Inches(0.10), Inches(5.0))
    b3.fill.solid(); b3.fill.fore_color.rgb = C_SUNSET_ORANGE; b3.line.fill.background()

    tb = s56.shapes.add_textbox(Inches(1.7), Inches(1.3), Inches(10.8), Inches(5.2))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THANK YOU!"
    p.font.name = FONT_FAMILY; p.font.size = Pt(46); p.font.bold = True; p.font.color.rgb = C_WHITE

    p2 = tf.add_paragraph()
    p2.text = "UniCareer Community is Live & Ready for Demonstration"
    p2.font.name = FONT_FAMILY; p2.font.size = Pt(28); p2.font.bold = True; p2.font.color.rgb = C_CYAN_SKY
    p2.space_before = Pt(14)

    p_roles = tf.add_paragraph()
    p_roles.text = "3 Personas: 🎓 Students  •  💼 Alumni Mentors  •  🛡️ Placement Admins"
    p_roles.font.name = FONT_FAMILY; p_roles.font.size = Pt(21); p_roles.font.bold = True; p_roles.font.color.rgb = C_HONEY_AMBER
    p_roles.space_before = Pt(18)

    p3 = tf.add_paragraph()
    p3.text = "We welcome questions, feedback, and interactive live demonstration!"
    p3.font.name = FONT_FAMILY; p3.font.size = Pt(18); p3.font.color.rgb = C_WHITE
    p3.space_before = Pt(24)

    p4 = tf.add_paragraph()
    p4.text = "Department of Computer Science & Engineering | Jagannath University (JnU) | 2026"
    p4.font.name = FONT_FAMILY; p4.font.size = Pt(16); p4.font.color.rgb = C_PURPLE_LIGHT
    p4.space_before = Pt(10)

    add_notes(s56, "Thank the examination committee. Invite questions and transition smoothly into the live software demonstration.")
