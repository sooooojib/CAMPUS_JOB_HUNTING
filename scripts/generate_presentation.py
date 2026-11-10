import os
import sys
import subprocess

# Ensure current script dir and project root are in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")))

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION

# Import the pristine diagram generator
try:
    import generate_perfect_diagrams as gpd
except ImportError:
    import scripts.generate_perfect_diagrams as gpd

def build_presentation():
    # 1. Regenerate pristine 2400x1600 diagrams
    print("Generating pristine 2400x1600 diagrams with perfect typography...")
    gpd.main()

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    FONT_FAMILY = "Calibri"

    # =========================================================================
    # VIBRANT, FUN, HUMAN-FRIENDLY COLOR SYSTEM
    # =========================================================================
    C_MIDNIGHT_HERO   = RGBColor(17, 14, 56)    # #110E38 (Warm Midnight)
    C_ELECTRIC_VIOLET = RGBColor(124, 58, 237)  # #7C3AED (Signature Violet)
    C_PURPLE_LIGHT    = RGBColor(168, 85, 247)  # #A855F7 (Soft Violet)
    C_CYAN_SKY        = RGBColor(6, 182, 212)   # #06B6D4 (Bright Cyan Sky)
    C_ROYAL_BLUE      = RGBColor(37, 99, 235)   # #2563EB (Student Royal Blue)
    C_SUNSET_ORANGE   = RGBColor(249, 115, 22)  # #F97316 (Alumni Sunset Orange)
    C_MINT_GREEN      = RGBColor(16, 185, 129)  # #10B981 (Fresh Mint Green)
    C_HONEY_AMBER     = RGBColor(245, 158, 11)  # #F59E0B (Sunny Honey)
    C_HOT_CORAL       = RGBColor(244, 63, 94)   # #F43F5E (Energetic Coral)
    C_LIGHT_BG        = RGBColor(248, 250, 252) # #F8FAFC (Paper Slate)
    C_CARD_BG         = RGBColor(255, 255, 255) # #FFFFFF (Pure White)
    C_BORDER_SUBTLE   = RGBColor(226, 232, 240) # #E2E8F0
    C_WHITE           = RGBColor(255, 255, 255)
    C_TEXT_DARK       = RGBColor(15, 23, 42)    # #0F172A (Crisp Dark Text)
    C_TEXT_MUTED      = RGBColor(100, 116, 139) # #64748B

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, section_tag, title_text, dark=False, tag_color=C_ELECTRIC_VIOLET):
        # 40% Bigger Pill Tag: Pt(15) instead of Pt(11.5)
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.30), Inches(4.4), Inches(0.44))
        pill.fill.solid()
        pill.fill.fore_color.rgb = tag_color
        pill.line.fill.background()
        tf = pill.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = section_tag.upper()
        p.font.name = FONT_FAMILY
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER

        # 40% Bigger Title: Pt(36) instead of Pt(26)
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.80), Inches(11.7), Inches(0.85))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.name = FONT_FAMILY
        p_t.font.size = Pt(36)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE if dark else C_TEXT_DARK

    def add_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    def add_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_BORDER_SUBTLE, border_width=2.5):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width)
        return card

    def add_table(slide, left, top, width, height, headers, rows, col_widths=None, header_bg=C_ELECTRIC_VIOLET):
        num_rows = len(rows) + 1
        num_cols = len(headers)
        table_shape = slide.shapes.add_table(num_rows, num_cols, left, top, width, height)
        table = table_shape.table

        if col_widths and len(col_widths) == num_cols:
            for idx, w in enumerate(col_widths):
                table.columns[idx].width = w

        for col_idx, h in enumerate(headers):
            cell = table.cell(0, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = header_bg
            tf = cell.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.text = str(h)
            p.font.name = FONT_FAMILY
            p.font.size = Pt(16.5)  # 40% bigger header
            p.font.bold = True
            p.font.color.rgb = C_WHITE
            p.alignment = PP_ALIGN.LEFT

        for row_idx, row_data in enumerate(rows):
            bg = C_WHITE if row_idx % 2 == 0 else RGBColor(245, 243, 255)
            for col_idx, val in enumerate(row_data):
                cell = table.cell(row_idx + 1, col_idx)
                cell.fill.solid()
                cell.fill.fore_color.rgb = bg
                tf = cell.text_frame
                tf.word_wrap = True
                p = tf.paragraphs[0]
                p.text = str(val)
                p.font.name = FONT_FAMILY
                p.font.size = Pt(15.0)  # 40% bigger cells
                p.font.color.rgb = C_TEXT_DARK
                p.alignment = PP_ALIGN.LEFT

        return table_shape

    def add_real_diagram_slide(slide, image_filename, title, subtitle_badge, key_takeaways, accent_color=C_ELECTRIC_VIOLET):
        img_path = os.path.join("scripts/assets/diagrams", image_filename)
        # 3:2 Aspect ratio matching 2400x1600 image perfectly
        left_d = Inches(0.8)
        top_d = Inches(1.68)
        width_d = Inches(7.875)
        height_d = Inches(5.25)

        if os.path.exists(img_path):
            slide.shapes.add_picture(img_path, left_d, top_d, width_d, height_d)
        else:
            c = add_card(slide, left_d, top_d, width_d, height_d, C_WHITE, accent_color)
            c.text_frame.paragraphs[0].text = f"[DIAGRAM: {title}]"

        # Right takeaway card with 40% bigger fonts & exactly 3 punchy points
        right_card = add_card(slide, Inches(8.9), top_d, Inches(3.6), height_d, C_WHITE, accent_color, 2.5)
        tf_r = right_card.text_frame
        tf_r.word_wrap = True

        p0 = tf_r.paragraphs[0]
        p0.text = "Key Takeaways"
        p0.font.name = FONT_FAMILY
        p0.font.size = Pt(25)  # 40% bigger
        p0.font.bold = True
        p0.font.color.rgb = accent_color

        p_sub = tf_r.add_paragraph()
        p_sub.text = subtitle_badge.upper()
        p_sub.font.name = FONT_FAMILY
        p_sub.font.size = Pt(15)  # 40% bigger
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_CYAN_SKY
        p_sub.space_before = Pt(4)

        for item in key_takeaways[:3]:  # Exactly 3 punchy takeaways!
            pr = tf_r.add_paragraph()
            pr.text = "• " + item
            pr.font.name = FONT_FAMILY
            pr.font.size = Pt(18)  # 40% bigger bullets!
            pr.font.color.rgb = C_TEXT_DARK
            pr.space_before = Pt(18)

    def add_ui_slide_with_image(slide, image_filename, screen_name, input_rules, stats_box, tag_color=C_ELECTRIC_VIOLET):
        image_path = os.path.join("scripts/assets", image_filename)
        left_img = Inches(0.8)
        top_img = Inches(1.68)
        width_img = Inches(7.2)
        height_img = Inches(5.25)

        if os.path.exists(image_path):
            slide.shapes.add_picture(image_path, left_img, top_img, width_img, height_img)
        else:
            c = add_card(slide, left_img, top_img, width_img, height_img, C_WHITE, tag_color)
            c.text_frame.paragraphs[0].text = f"[UI SCREENSHOT: {screen_name}]"

        right_card = add_card(slide, Inches(8.2), top_img, Inches(4.3), height_img, C_WHITE, tag_color, 2.5)
        tf_r = right_card.text_frame
        tf_r.word_wrap = True

        pr = tf_r.paragraphs[0]
        pr.text = "Screen Controls & Rules"
        pr.font.name = FONT_FAMILY
        pr.font.size = Pt(25)  # 40% bigger header
        pr.font.bold = True
        pr.font.color.rgb = tag_color

        for rule in input_rules[:3]:  # Max 3 punchy rules
            pr_b = tf_r.add_paragraph()
            pr_b.text = "• " + rule
            pr_b.font.name = FONT_FAMILY
            pr_b.font.size = Pt(18)  # 40% bigger
            pr_b.font.color.rgb = C_TEXT_DARK
            pr_b.space_before = Pt(14)

        p_stat_title = tf_r.add_paragraph()
        p_stat_title.text = "Live Website Stats"
        p_stat_title.font.name = FONT_FAMILY
        p_stat_title.font.size = Pt(20)  # 40% bigger
        p_stat_title.font.bold = True
        p_stat_title.font.color.rgb = C_SUNSET_ORANGE
        p_stat_title.space_before = Pt(18)

        for stat in stats_box[:2]:
            p_s = tf_r.add_paragraph()
            p_s.text = "▪ " + stat
            p_s.font.name = FONT_FAMILY
            p_s.font.size = Pt(16.5)  # 40% bigger
            p_s.font.color.rgb = C_TEXT_DARK
            p_s.space_before = Pt(6)

    print("Building 56 human-friendly, colorful, big-font presentation slides...")

    # =========================================================================
    # PART 1: EXECUTIVE NARRATIVE & WORKFLOW (SLIDES 1 - 7)
    # =========================================================================

    # SLIDE 1: Title Slide
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, C_MIDNIGHT_HERO)

    b1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.4), Inches(0.24), Inches(5.0))
    b1.fill.solid(); b1.fill.fore_color.rgb = C_ELECTRIC_VIOLET; b1.line.fill.background()
    b2 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.10), Inches(1.4), Inches(0.16), Inches(5.0))
    b2.fill.solid(); b2.fill.fore_color.rgb = C_CYAN_SKY; b2.line.fill.background()
    b3 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.32), Inches(1.4), Inches(0.10), Inches(5.0))
    b3.fill.solid(); b3.fill.fore_color.rgb = C_SUNSET_ORANGE; b3.line.fill.background()

    tb = s1.shapes.add_textbox(Inches(1.7), Inches(1.3), Inches(10.8), Inches(5.2))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "UNICAREER COMMUNITY"
    p.font.name = FONT_FAMILY; p.font.size = Pt(46); p.font.bold = True; p.font.color.rgb = C_WHITE

    p2 = tf.add_paragraph()
    p2.text = "A Trusted Career & Referral Network for Our University"
    p2.font.name = FONT_FAMILY; p2.font.size = Pt(28); p2.font.bold = True; p2.font.color.rgb = C_CYAN_SKY
    p2.space_before = Pt(14)

    p_roles = tf.add_paragraph()
    p_roles.text = "Built for 3 Real People: 🎓 Students  •  💼 Alumni Mentors  •  🛡️ Admins"
    p_roles.font.name = FONT_FAMILY; p_roles.font.size = Pt(21); p_roles.font.bold = True; p_roles.font.color.rgb = C_HONEY_AMBER
    p_roles.space_before = Pt(20)

    p3 = tf.add_paragraph()
    p3.text = "Final Year Software Engineering Project Defense Presentation"
    p3.font.name = FONT_FAMILY; p3.font.size = Pt(18); p3.font.color.rgb = C_WHITE
    p3.space_before = Pt(24)

    p4 = tf.add_paragraph()
    p4.text = "Jagannath University (JnU) | Next.js 16 • Neon PostgreSQL • 2026"
    p4.font.name = FONT_FAMILY; p4.font.size = Pt(16); p4.font.color.rgb = C_PURPLE_LIGHT
    p4.space_before = Pt(10)

    add_notes(s1, "KEY PRESENTER NOTES:\nWelcome everyone! UniCareer Community connects our university students directly with verified alumni at top companies, with official institutional backing to keep everything safe, fast, and transparent.\n\nQ&A DEFENSE STRATEGY:\nEmphasize the closed campus trust circle: not another spammy public job board, but a private verified community.")

    # SLIDE 2: Project Vision & Strategic Problem Domain
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, C_LIGHT_BG)
    add_header(s2, "The Big Idea", "Why Campus Hiring Was Broken — And How We Fixed It", tag_color=C_ELECTRIC_VIOLET)

    c1 = add_card(s2, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_HOT_CORAL, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "The Struggle for Students Today"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_HOT_CORAL
    bullets1 = [
        "Spam & Fake Jobs: Public job sites bombard students with suspicious ads and collect personal CVs.",
        "Lost in the Crowd: Resumes get buried under thousands of generic applicants without alumni reach.",
        "Messy CGPA Calculations: Students rely on ad-filled web calculators that miscalculate weighted credits."
    ]
    for b in bullets1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s2, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "How UniCareer Changes the Game"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets2 = [
        "100% University Verified: Only real students, verified alumni, and approved employers can access.",
        "Direct Alumni Referrals: Seniors at Google, Brain Station, and banks sponsor junior referrals directly.",
        "Automated CGPA & 1-Click Apply: Automatically computes true CGPA and submits stored PDF resumes."
    ]
    for b in bullets2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s2, "KEY PRESENTER NOTES:\nTalk about the pain points students face daily. UniCareer taps into the university's greatest asset: its verified alumni network.\n\nQ&A DEFENSE STRATEGY:\nUniCareer is private and trusted; alumni actively mentor and refer their own university juniors.")

    # SLIDE 3: Target Personas: Student, Alumni, Admin
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, C_LIGHT_BG)
    add_header(s3, "Who It's For", "The 3 Core People Who Make UniCareer Work", tag_color=C_ROYAL_BLUE)

    headers_s3 = ["Role & Persona", "What They Need Most", "Key Platform Features", "How We Verify Them"]
    rows_s3 = [
        ["🎓 STUDENT\n(Undergrad/Grad)", "Find internships, calculate GPA, share job leads, get referred.", "Browse & post verified jobs, apply in 1 click, calculate weighted CGPA, request alumni referrals.", "University Email OTP + Registrar Student ID Whitelist Match."],
        ["💼 ALUMNI MENTOR\n(Industry Graduates)", "Help juniors, share open roles at their company, mentor students.", "Sponsor corporate referrals, share verified job leads, mentor juniors, connect with peers.", "Graduation Batch Check + Corporate Work Email."],
        ["🛡️ UNIVERSITY ADMIN\n(Career Office Staff)", "Keep the community safe, prevent spam, verify genuine students.", "Verify student rosters, moderate pending jobs, suspend bad actors with written reasons, check audit logs.", "Administrative Role Credentials & Audit Log."]
    ]
    add_table(s3, Inches(0.8), Inches(1.68), Inches(11.7), Inches(5.25), headers_s3, rows_s3, [Inches(2.2), Inches(3.2), Inches(3.8), Inches(2.5)], header_bg=C_ROYAL_BLUE)

    add_notes(s3, "KEY PRESENTER NOTES:\nAll three personas share a single unified account system. When a student graduates, their profile seamlessly transitions to alumni.\n\nQ&A DEFENSE STRATEGY:\nEmphasize the unified database model: no split logins or fragile synchronization.")

    # SLIDE 4: Current User Stories: Student Career Path & Alumni Referral Loop
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, C_LIGHT_BG)
    add_header(s4, "Real Experiences", "Student & Alumni Journeys: Finding Jobs & Giving Back", tag_color=C_ELECTRIC_VIOLET)

    c1 = add_card(s4, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "🎓 Student Journey: Sajib's Story"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s4_1 = [
        "Calculates True CGPA: Logs semester grades to instantly see true credit-weighted CGPA (3.84).",
        "Discovers Eligible Jobs: System highlights positions where he meets the minimum CGPA cutoff.",
        "1-Click Application: Submits his verified PDF resume and tracks stages live: Review -> Interview!"
    ]
    for b in bullets_s4_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s4, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_SUNSET_ORANGE, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "💼 Alumni Journey: Tanvir's Story"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_SUNSET_ORANGE
    bullets_s4_2 = [
        "Receives Referral Pitch: Receives a polite pitch from a verified junior at his alma mater.",
        "Inspects Verified Dossier: Reviews student's verified CGPA and resume with a single tap.",
        "Sponsors Candidate: Clicks 'Sponsor Referral' to submit the student into his company's portal."
    ]
    for b in bullets_s4_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s4, "KEY PRESENTER NOTES:\nThese user stories ground our engineering in real experiences. Sajib gets immediate feedback; Tanvir gets pre-vetted junior candidates from his own university.")

    # SLIDE 5: Current User Stories: Admin Governance & Institutional Trust
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, C_LIGHT_BG)
    add_header(s5, "Real Experiences", "Admin Journey: Keeping the Campus Safe & Fair", tag_color=C_HOT_CORAL)

    c1 = add_card(s5, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_CYAN_SKY, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "🛡️ Admin Role: Dr. Rahman's Mission"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_CYAN_SKY
    bullets_s5_1 = [
        "Verifies Academic Records: Approves student profiles against registrar department rosters in 1 click.",
        "Curates Job Leads: Reviews submitted opportunities to ensure genuine compensation and deadlines.",
        "Guards Campus Trust: Suspends policy violators with mandatory written justification."
    ]
    for b in bullets_s5_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s5, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_HOT_CORAL, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Institutional Governance Rules"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_HOT_CORAL
    bullets_s5_2 = [
        "Mandatory Accountability: Every suspension or rejection requires a logged explanation (min 5 chars).",
        "Immutable Audit Trail: All admin actions are permanently recorded with timestamps and admin IDs.",
        "Fair Appeals & Restoration: Suspended members can review reasons and appeal for reinstatement."
    ]
    for b in bullets_s5_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s5, "KEY PRESENTER NOTES:\nAdmin controls prevent abuse. No unilateral suspensions without recorded justification; every action is logged immutably.")

    # SLIDE 6: System Ingress & Architecture (EMBEDDED PRISTINE WORKFLOW DIAGRAM)
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, C_LIGHT_BG)
    add_header(s6, "System Flow", "Ingress Architecture: Safe, Fast, Three-Tier Design", tag_color=C_ROYAL_BLUE)

    takeaways_s6 = [
        "Three-Tier Separation: Strict division between presentation UI, server logic, and cloud database.",
        "Edge Authentication: Fast session decryption and registrar whitelist validation at the gateway.",
        "Sub-15ms Data Queries: Pre-warmed connection pool executes database queries in under 15ms."
    ]
    add_real_diagram_slide(s6, "uml_workflow.png", "System Ingress Workflow", "THREE-TIER PIPELINE", takeaways_s6, C_ROYAL_BLUE)

    add_notes(s6, "KEY PRESENTER NOTES:\nPoint to the diagram on the left! Notice how clean the pipeline is: from the 3 user personas, through Next.js server actions, down to our Neon PostgreSQL database.")

    # SLIDE 7: High-Level System Workflow Walkthrough
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, C_LIGHT_BG)
    add_header(s7, "Step-by-Step Flow", "How Information Travels Through UniCareer in 4 Easy Steps", tag_color=C_MINT_GREEN)

    steps_s7 = [
        ("Step 1: Welcome Gate", "Student, Alumni, or Admin signs in using their official university email with fast OTP login.", C_ROYAL_BLUE),
        ("Step 2: Profile & CGPA", "Student enters term grades; Next.js computes true credit-weighted CGPA and unlocks matching jobs.", C_ELECTRIC_VIOLET),
        ("Step 3: Direct Apply / Referral", "Student applies with stored PDF resume or pitches an alumni mentor for a corporate referral.", C_SUNSET_ORANGE),
        ("Step 4: Real-Time Tracker", "Reviewers inspect candidate profiles; students track interview stages live on their dashboard.", C_MINT_GREEN)
    ]
    for idx, (title, desc, color) in enumerate(steps_s7):
        top_pos = Inches(1.68 + idx * 1.34)
        c = add_card(s7, Inches(0.8), top_pos, Inches(11.7), Inches(1.20), C_WHITE, color, 2.5)
        tf = c.text_frame; tf.word_wrap = True
        p0 = tf.paragraphs[0]; p0.text = title; p0.font.size = Pt(22); p0.font.bold = True; p0.font.color.rgb = color
        p1 = tf.add_paragraph(); p1.text = desc; p1.font.size = Pt(17); p1.font.color.rgb = C_TEXT_DARK; p1.space_before = Pt(4)

    add_notes(s7, "KEY PRESENTER NOTES:\nWalk the committee through the 4 simple steps. Show how every step builds trust, eliminates manual paperwork, and delivers instant feedback.")

    # =========================================================================
    # PART 2: REQUIREMENTS ENGINEERING (SLIDES 8 - 18)
    # =========================================================================

    # SLIDE 8: Requirements Engineering Overview
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, C_LIGHT_BG)
    add_header(s8, "Requirements Engineering", "Requirements Engineering: Built Specifically for Campus Needs", tag_color=C_ELECTRIC_VIOLET)

    c1 = add_card(s8, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "How We Gathered Requirements"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s8_1 = [
        "Student Council Interviews: Surveyed undergraduates across CSE, EEE, and Business majors.",
        "Alumni Network Feedback: Spoke with graduates at top tech firms who wanted an easy referral tool.",
        "Registrar & Career Office: Partnered with university placement officers to understand verification."
    ]
    for b in bullets_s8_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s8, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_MINT_GREEN, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Our 3 Core Engineering Pillars"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_MINT_GREEN
    bullets_s8_2 = [
        "Unbreakable Trust: Only authentic campus members with verified credentials can participate.",
        "Speed & Simplicity: 1-click applications and instant CGPA calculation in under 150 milliseconds.",
        "Complete Accountability: Transparent audit logs for all moderation and referral actions."
    ]
    for b in bullets_s8_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s8, "KEY PRESENTER NOTES:\nRequirements were driven by direct feedback from university students and alumni mentors, ensuring high real-world adoption.")

    # SLIDE 9: Student Tooling Requirements: True CGPA & 1-Click Apply
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, C_LIGHT_BG)
    add_header(s9, "Student Tools", "Student Features: Smart CGPA Calculator & 1-Click Apply", tag_color=C_ROYAL_BLUE)

    c1 = add_card(s9, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_ROYAL_BLUE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Credit-Weighted CGPA Calculator"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_ROYAL_BLUE
    bullets_s9_1 = [
        "Term Grade Ledger: Students enter term GPA and credits; system computes overall weighted CGPA.",
        "Automatic Eligibility Check: Instantly flags whether student meets a job's minimum CGPA cutoff.",
        "Private Records: Academic details remain strictly confidential and visible only to the student."
    ]
    for b in bullets_s9_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s9, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_CYAN_SKY, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "1-Click PDF Resume Applications"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_CYAN_SKY
    bullets_s9_2 = [
        "Stored Resume PDF: Upload once, apply to multiple verified openings in a single click.",
        "Duplicate Prevention: Composite unique index strictly stops accidental double submissions.",
        "Live Application Tracker: Shows current status from Submitted to Under Review to Interview."
    ]
    for b in bullets_s9_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s9, "KEY PRESENTER NOTES:\nHighlight the automated CGPA formula: credit-weighted calculation eliminates math errors and saves students time.")

    # SLIDE 10: Alumni & Employer Requirements: Postings & Referrals
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, C_LIGHT_BG)
    add_header(s10, "Alumni & Recruiter Tools", "Alumni Features: Sponsoring Referrals & Sharing Job Leads", tag_color=C_SUNSET_ORANGE)

    c1 = add_card(s10, Inches(0.8), Inches(1.68), Inches(5.6), Inches(5.25), C_WHITE, C_SUNSET_ORANGE, 2.5)
    tf1 = c1.text_frame; tf1.word_wrap = True
    p = tf1.paragraphs[0]; p.text = "Alumni Referral Sponsorship"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_SUNSET_ORANGE
    bullets_s10_1 = [
        "Direct Pitch Inbox: Alumni receive structured referral pitches with verified student resumes.",
        "1-Click Sponsorship: Click 'Sponsor Referral' to submit candidates to internal corporate portals.",
        "Anti-Spam Cap: Students are capped at 3 active referral requests so alumni are never spammed."
    ]
    for b in bullets_s10_1:
        pb = tf1.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    c2 = add_card(s10, Inches(6.8), Inches(1.68), Inches(5.7), Inches(5.25), C_WHITE, C_HONEY_AMBER, 2.5)
    tf2 = c2.text_frame; tf2.word_wrap = True
    p = tf2.paragraphs[0]; p.text = "Posting Real Job Opportunities"; p.font.size = Pt(25); p.font.bold = True; p.font.color.rgb = C_HONEY_AMBER
    bullets_s10_2 = [
        "Curated Listings: Official employer posts and alumni community leads clearly badged.",
        "Targeted Filters: Postings specify eligible departments, CGPA cutoffs, and deadlines.",
        "Applicant Manager: Review candidate dossiers and update interview stages live."
    ]
    for b in bullets_s10_2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b; pb.font.size = Pt(18); pb.font.color.rgb = C_TEXT_DARK; pb.space_before = Pt(18)

    add_notes(s10, "KEY PRESENTER NOTES:\nAlumni love being able to easily find verified talent from their home department without sift through unverified applicants.")

    # Continue generating slides 11 to 56 with identical clean 40% enlarged font rules
    # We will invoke our modular generator helper to compile the entire deck cleanly!
    try:
        import build_huge_presentation_slides as bhps
    except ImportError:
        import scripts.build_huge_presentation_slides as bhps
    bhps.generate_all_remaining_slides(prs, blank_layout, FONT_FAMILY, add_header, add_card, add_table, add_real_diagram_slide, add_ui_slide_with_image, add_notes)

    out_file = "UniCareer_Community_SWE_Defense_Presentation.pptx"
    prs.save(out_file)
    print(f"\nSUCCESS! Beautiful, human-friendly presentation compiled: {out_file}")
    print(f"Total Slides: {len(prs.slides)} slides (Budget: <= 60)")

if __name__ == "__main__":
    build_presentation()
