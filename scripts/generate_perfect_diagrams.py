import os
import math
from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/System/Library/Fonts/Helvetica.ttc"

def get_font(size, bold=False):
    try:
        # On macOS Helvetica.ttc has multiple fonts; index 1 is often Bold, 0 is Regular
        return ImageFont.truetype(FONT_PATH, size, index=1 if bold else 0)
    except Exception:
        return ImageFont.load_default()

def draw_multiline_centered(draw, xy, text, fill, font, line_spacing=6):
    cx, cy = xy
    lines = text.split("\n")
    line_heights = [font.getbbox(l)[3] - font.getbbox(l)[1] if l else 20 for l in lines]
    total_h = sum(line_heights) + line_spacing * (len(lines) - 1)
    cur_y = cy - total_h // 2
    for l, lh in zip(lines, line_heights):
        bbox = font.getbbox(l)
        lw = bbox[2] - bbox[0] if l else 0
        draw.text((cx - lw // 2, cur_y), l, fill=fill, font=font)
        cur_y += lh + line_spacing

def draw_rounded_card(draw, xy, fill, outline, width=3, radius=20):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def draw_arrow(draw, start, end, color, width=4, arrow_size=16, dashed=False):
    x0, y0 = start
    x1, y1 = end
    
    if dashed:
        # Draw dashed line
        dist = math.hypot(x1 - x0, y1 - y0)
        dash_len = 14
        dashes = int(dist // dash_len)
        dx = (x1 - x0) / dist if dist > 0 else 0
        dy = (y1 - y0) / dist if dist > 0 else 0
        for i in range(0, dashes, 2):
            s_x = x0 + dx * i * dash_len
            s_y = y0 + dy * i * dash_len
            e_x = x0 + dx * min((i + 1) * dash_len, dist)
            e_y = y0 + dy * min((i + 1) * dash_len, dist)
            draw.line([(s_x, s_y), (e_x, e_y)], fill=color, width=width)
    else:
        draw.line([start, end], fill=color, width=width)

    # Arrow head at end
    angle = math.atan2(y1 - y0, x1 - x0)
    p1 = (x1 - arrow_size * math.cos(angle - math.pi / 6), y1 - arrow_size * math.sin(angle - math.pi / 6))
    p2 = (x1 - arrow_size * math.cos(angle + math.pi / 6), y1 - arrow_size * math.sin(angle + math.pi / 6))
    draw.polygon([end, p1, p2], fill=color)

# =========================================================================
# 1. GORGEOUS SEQUENCE DIAGRAM (Replaces squished Graphviz diagram)
# =========================================================================
def make_sequence_diagram():
    w, h = 2400, 1600
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(52, bold=True)
    f_sub = get_font(28, bold=False)
    f_role = get_font(34, bold=True)
    f_badge = get_font(24, bold=True)
    f_step = get_font(26, bold=True)
    f_note = get_font(22, bold=False)

    # Title header banner
    draw.text((80, 50), "UML 2.5 Sequence Diagram: 1-Click Job Application Lifecycle", fill=(17, 14, 56), font=f_title)
    draw.text((80, 115), "Chronological message trace: User interaction to database commit & alumni alert (<150ms)", fill=(100, 116, 139), font=f_sub)

    # 4 Participants with vertical lifelines
    participants = [
        {"name": "STUDENT (Browser UI)", "sub": "Candidate Dashboard", "x": 300, "bg": (239, 246, 255), "border": (37, 99, 235), "text": (30, 58, 138)},
        {"name": "NEXT.JS 16 API", "sub": "Server Action & Auth", "x": 860, "bg": (245, 243, 255), "border": (124, 58, 237), "text": (79, 70, 229)},
        {"name": "POSTGRESQL (3NF)", "sub": "Neon Cloud Database", "x": 1460, "bg": (236, 253, 245), "border": (16, 185, 129), "text": (6, 78, 59)},
        {"name": "ALUMNI / REVIEWER", "sub": "Referral & Hiring Lead", "x": 2060, "bg": (255, 247, 237), "border": (249, 115, 22), "text": (154, 52, 18)},
    ]

    card_w, card_h = 320, 100
    top_y = 190
    bottom_y = 1460

    # Draw vertical dashed lifelines
    for p in participants:
        px = p["x"]
        draw_arrow(draw, (px, top_y + card_h), (px, bottom_y), (203, 213, 225), width=3, arrow_size=0, dashed=True)
        # Top card
        draw_rounded_card(draw, [px - card_w // 2, top_y, px + card_w // 2, top_y + card_h], p["bg"], p["border"], width=3, radius=18)
        draw.text((px, top_y + 24), p["name"], fill=p["text"], font=f_role, anchor="mt")
        draw.text((px, top_y + 64), p["sub"], fill=(100, 116, 139), font=f_note, anchor="mt")
        # Bottom card
        draw_rounded_card(draw, [px - card_w // 2, bottom_y, px + card_w // 2, bottom_y + card_h], p["bg"], p["border"], width=3, radius=18)
        draw.text((px, bottom_y + 24), p["name"], fill=p["text"], font=f_role, anchor="mt")
        draw.text((px, bottom_y + 64), p["sub"], fill=(100, 116, 139), font=f_note, anchor="mt")

    # Sequence Messages
    steps = [
        {"y": 360, "from": 0, "to": 1, "badge": "Step 1", "badge_color": (37, 99, 235),
         "title": "POST /api/applications", "desc": "Submits authenticated candidate dossier & signed resume PDF", "color": (37, 99, 235), "dashed": False},
        
        {"y": 500, "from": 1, "to": 2, "badge": "Step 2", "badge_color": (124, 58, 237),
         "title": "SELECT count(*) WHERE opp_id & applicant_id", "desc": "Checks composite index @@unique to prevent duplicate submissions", "color": (124, 58, 237), "dashed": False},

        {"y": 640, "from": 2, "to": 1, "badge": "Step 3", "badge_color": (16, 185, 129),
         "title": "Return 0 (Clean Record)", "desc": "Verification passed: Student has not previously applied for this position", "color": (16, 185, 129), "dashed": True},

        {"y": 780, "from": 1, "to": 2, "badge": "Step 4", "badge_color": (16, 185, 129),
         "title": "$transaction: INSERT INTO applications", "desc": "Atomic commit: Inserts dossier & increments opportunity applicant count", "color": (16, 185, 129), "dashed": False},

        {"y": 920, "from": 2, "to": 1, "badge": "Step 5", "badge_color": (16, 185, 129),
         "title": "Transaction Committed (42ms)", "desc": "Returns persisted application entity with status 'SUBMITTED'", "color": (16, 185, 129), "dashed": True},

        {"y": 1060, "from": 1, "to": 0, "badge": "Step 6", "badge_color": (37, 99, 235),
         "title": "HTTP 201 Created (<150ms Total)", "desc": "Instant celebration modal: Shows application tracker & stage badge", "color": (37, 99, 235), "dashed": True},

        {"y": 1200, "from": 1, "to": 3, "badge": "Step 7", "badge_color": (249, 115, 22),
         "title": "Async Event: Send Applicant Alert", "desc": "Non-blocking dispatch pings alumni/reviewer without slowing down UI", "color": (249, 115, 22), "dashed": True},

        {"y": 1340, "from": 3, "to": 1, "badge": "Step 8", "badge_color": (249, 115, 22),
         "title": "Alumni Opens Candidate Review Dashboard", "desc": "Alumni reviews verified student CGPA & clicks 'Shortlist for Interview'", "color": (249, 115, 22), "dashed": False},
    ]

    for s in steps:
        sy = s["y"]
        x_from = participants[s["from"]]["x"]
        x_to = participants[s["to"]]["x"]
        is_left_to_right = x_to > x_from

        # Activation bar on participants
        draw.rectangle([x_from - 8, sy - 15, x_from + 8, sy + 45], fill=(203, 213, 225), outline=(100, 116, 139), width=2)
        draw.rectangle([x_to - 8, sy - 15, x_to + 8, sy + 45], fill=(203, 213, 225), outline=(100, 116, 139), width=2)

        # Message Arrow
        draw_arrow(draw, (x_from, sy + 15), (x_to, sy + 15), s["color"], width=4, arrow_size=18, dashed=s["dashed"])

        # Label Banner
        mid_x = (x_from + x_to) // 2
        text_w = 480
        text_h = 62
        b_box = [mid_x - text_w // 2, sy - 42, mid_x + text_w // 2, sy + 8]
        draw_rounded_card(draw, b_box, (255, 255, 255, 245), s["color"], width=2, radius=12)

        # Step pill
        pill_w = 100
        draw.rounded_rectangle([mid_x - text_w // 2 + 8, sy - 36, mid_x - text_w // 2 + pill_w, sy - 4], radius=8, fill=s["badge_color"])
        draw.text((mid_x - text_w // 2 + pill_w // 2 + 4, sy - 22), s["badge"], fill=(255, 255, 255), font=f_badge, anchor="mm")

        # Step title & desc
        draw.text((mid_x - text_w // 2 + pill_w + 14, sy - 28), s["title"], fill=(15, 23, 42), font=f_step, anchor="ls")
        draw.text((mid_x - text_w // 2 + pill_w + 14, sy - 6), s["desc"], fill=(100, 116, 139), font=f_note, anchor="ls")

    return img

# =========================================================================
# 2. GORGEOUS SWIMLANE ACTIVITY DIAGRAM
# =========================================================================
def make_swimlane_diagram():
    w, h = 2400, 1600
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(52, bold=True)
    f_sub = get_font(28, bold=False)
    f_header = get_font(34, bold=True)
    f_card_t = get_font(28, bold=True)
    f_card_d = get_font(22, bold=False)
    f_step_num = get_font(22, bold=True)

    draw.text((80, 50), "UML 2.5 Activity Diagram: 4-Swimlane Application Journey", fill=(17, 14, 56), font=f_title)
    draw.text((80, 115), "Cross-functional execution flow: From student discovery to alumni shortlisting & interview", fill=(100, 116, 139), font=f_sub)

    lanes = [
        {"title": "STUDENT SWIMLANE", "role": "Career Candidate", "bg": (239, 246, 255, 140), "border": (37, 99, 235), "head_bg": (37, 99, 235), "x0": 80, "x1": 630},
        {"title": "UNICAREER ENGINE", "role": "Next.js Web Services", "bg": (245, 243, 255, 140), "border": (124, 58, 237), "head_bg": (124, 58, 237), "x0": 650, "x1": 1200},
        {"title": "DATABASE (3NF)", "role": "Neon PostgreSQL", "bg": (236, 253, 245, 140), "border": (16, 185, 129), "head_bg": (16, 185, 129), "x0": 1220, "x1": 1770},
        {"title": "ALUMNI / REVIEWER", "role": "Hiring & Referrals", "bg": (255, 247, 237, 140), "border": (249, 115, 22), "head_bg": (249, 115, 22), "x0": 1790, "x1": 2340},
    ]

    lane_top = 180
    lane_bot = 1530

    for l in lanes:
        # Lane container
        draw.rounded_rectangle([l["x0"], lane_top, l["x1"], lane_bot], radius=24, fill=l["bg"], outline=l["border"], width=3)
        # Header banner
        draw.rounded_rectangle([l["x0"], lane_top, l["x1"], lane_top + 95], radius=24, fill=l["head_bg"])
        draw.rectangle([l["x0"], lane_top + 70, l["x1"], lane_top + 95], fill=l["head_bg"])
        draw.text(((l["x0"] + l["x1"]) // 2, lane_top + 28), l["title"], fill=(255, 255, 255), font=f_header, anchor="mt")
        draw.text(((l["x0"] + l["x1"]) // 2, lane_top + 65), l["role"], fill=(255, 255, 255, 200), font=f_step_num, anchor="mt")

    def draw_action_card(cx, cy, step, title, desc, bg, border, tc):
        cw, ch = 480, 110
        x0, y0 = cx - cw // 2, cy - ch // 2
        x1, y1 = cx + cw // 2, cy + ch // 2
        draw_rounded_card(draw, [x0, y0, x1, y1], bg, border, width=3, radius=18)
        # Step tag
        draw.rounded_rectangle([x0 + 16, y0 + 16, x0 + 105, y0 + 50], radius=8, fill=border)
        draw.text((x0 + 60, y0 + 33), step, fill=(255, 255, 255), font=f_step_num, anchor="mm")
        # Text
        draw.text((x0 + 120, y0 + 20), title, fill=tc, font=f_card_t)
        draw.text((x0 + 20, y0 + 64), desc, fill=(71, 85, 105), font=f_card_d)
        return (cx, cy)

    # Activity nodes
    c1 = draw_action_card(355, 340, "Step 1", "Select Opportunity", "Filters by CGPA requirement & opens job details", (255, 255, 255), (37, 99, 235), (30, 58, 138))
    c2 = draw_action_card(355, 520, "Step 2", "Attach Resume & Notes", "Picks pre-uploaded PDF or enters cover note", (255, 255, 255), (37, 99, 235), (30, 58, 138))
    c3 = draw_action_card(925, 520, "Step 3", "Validate Eligibility", "Zod schema & session token verification", (255, 255, 255), (124, 58, 237), (79, 70, 229))
    c4 = draw_action_card(1495, 520, "Step 4", "Check Duplicate Index", "SELECT @@unique([opp_id, applicant_id])", (255, 255, 255), (16, 185, 129), (6, 78, 59))
    c5 = draw_action_card(1495, 740, "Step 5", "Atomic $transaction", "Inserts application row & increments counters", (255, 255, 255), (16, 185, 129), (6, 78, 59))
    c6 = draw_action_card(925, 740, "Step 6", "Dispatch Notifications", "Triggers async email alert for alumni reviewer", (255, 255, 255), (124, 58, 237), (79, 70, 229))
    c7 = draw_action_card(355, 960, "Step 7", "Celebration Modal", "Green checkmark & live application tracker", (209, 250, 229), (16, 185, 129), (6, 78, 59))
    c8 = draw_action_card(2065, 960, "Step 8", "Reviewer Notification", "Alumni receives email alert with candidate link", (255, 255, 255), (249, 115, 22), (154, 52, 18))
    c9 = draw_action_card(2065, 1180, "Step 9", "Review Dossier & CV", "Opens private resume PDF with signed URL", (255, 255, 255), (249, 115, 22), (154, 52, 18))
    c10 = draw_action_card(2065, 1380, "Step 10", "Advance to Interview! 🎉", "Updates candidate pipeline stage with interview notes", (236, 253, 245), (16, 185, 129), (6, 78, 59))

    # Connecting arrows
    draw_arrow(draw, (355, 395), (355, 465), (37, 99, 235), width=4)
    draw_arrow(draw, (595, 520), (685, 520), (37, 99, 235), width=4)
    draw_arrow(draw, (1165, 520), (1255, 520), (124, 58, 237), width=4)
    draw_arrow(draw, (1495, 575), (1495, 685), (16, 185, 129), width=4)
    draw_arrow(draw, (1255, 740), (1165, 740), (16, 185, 129), width=4)
    
    # Branch to Student UI and Alumni
    draw_arrow(draw, (925, 795), (355, 905), (37, 99, 235), width=4)
    draw_arrow(draw, (1165, 740), (2065, 905), (249, 115, 22), width=4, dashed=True)

    draw_arrow(draw, (2065, 1015), (2065, 1125), (249, 115, 22), width=4)
    draw_arrow(draw, (2065, 1235), (2065, 1325), (16, 185, 129), width=4)

    return img

# =========================================================================
# 3. GORGEOUS USE CASE DIAGRAM (Student, Alumni, Admin)
# =========================================================================
def make_use_case_diagram():
    w, h = 2400, 1600
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(52, bold=True)
    f_sub = get_font(28, bold=False)
    f_actor = get_font(34, bold=True)
    f_actor_s = get_font(22, bold=False)
    f_uc_t = get_font(26, bold=True)
    f_uc_d = get_font(20, bold=False)

    draw.text((80, 50), "UML 2.5 Use Case Diagram: 3 Verified Member Roles", fill=(17, 14, 56), font=f_title)
    draw.text((80, 115), "Role-based boundary: Student career tools, Alumni networking & referrals, Admin governance", fill=(100, 116, 139), font=f_sub)

    # System boundary box
    draw.rounded_rectangle([700, 190, 2320, 1530], radius=30, fill=(255, 255, 255), outline=(124, 58, 237), width=4)
    draw.text((740, 220), "UNICAREER COMMUNITY PLATFORM BOUNDARY", fill=(124, 58, 237), font=get_font(28, bold=True))

    # 3 Actors on the left
    actors = [
        {"name": "🎓 STUDENT", "sub": "Career Seeker\n(Verified)", "y": 420, "color": (37, 99, 235), "bg": (239, 246, 255)},
        {"name": "💼 ALUMNI", "sub": "Mentor & Referrer\n(Verified)", "y": 860, "color": (249, 115, 22), "bg": (255, 247, 237)},
        {"name": "🛡️ ADMIN", "sub": "Placement Office\n(Governance)", "y": 1300, "color": (244, 63, 94), "bg": (253, 242, 248)},
    ]

    for a in actors:
        ay = a["y"]
        draw_rounded_card(draw, [80, ay - 110, 480, ay + 110], a["bg"], a["color"], width=3, radius=24)
        draw.text((280, ay - 60), a["name"], fill=a["color"], font=f_actor, anchor="mt")
        draw_multiline_centered(draw, (280, ay + 35), a["sub"], (100, 116, 139), f_actor_s)

    # Use Case Ellipses/Cards inside boundary
    def draw_use_case(x, y, title, desc, border_color, fill_color=(255, 255, 255)):
        cw, ch = 480, 110
        draw_rounded_card(draw, [x, y, x + cw, y + ch], fill_color, border_color, width=3, radius=20)
        draw.text((x + cw // 2, y + 25), title, fill=(15, 23, 42), font=f_uc_t, anchor="mt")
        draw.text((x + cw // 2, y + 65), desc, fill=(100, 116, 139), font=f_uc_d, anchor="mt")
        return (x, y + ch // 2)

    # Student UCs
    u1 = draw_use_case(750, 300, "1. Calculate True CGPA", "Input term grades & credits for auto CGPA", (37, 99, 235))
    u2 = draw_use_case(1280, 300, "2. Browse Verified Jobs", "Filter by major, role type & min CGPA", (37, 99, 235))
    u3 = draw_use_case(1810, 300, "3. 1-Click Apply with CV", "Submit signed PDF with duplicate protection", (37, 99, 235))
    u4 = draw_use_case(750, 470, "4. Request Alumni Referral", "Pitch alumni mentors for direct referrals", (37, 99, 235))
    u5 = draw_use_case(1280, 470, "5. Track Application Stages", "Real-time updates from review to offer", (37, 99, 235))
    u6 = draw_use_case(1810, 470, "6. Career Calendar Deadlines", "Track interview schedules & job deadlines", (37, 99, 235))

    # Alumni UCs
    u7 = draw_use_case(750, 750, "7. Share Verified Job Lead", "Post opportunities for campus juniors", (249, 115, 22))
    u8 = draw_use_case(1280, 750, "8. Review Referral Requests", "Accept student pitch & sponsor referral", (249, 115, 22))
    u9 = draw_use_case(1810, 750, "9. Manage Job Applicants", "Advance candidates to interview rounds", (249, 115, 22))
    u10 = draw_use_case(1020, 920, "10. Post in Community Feed", "Share career advice & industry insights", (249, 115, 22))

    # Admin UCs
    u11 = draw_use_case(750, 1180, "11. Verify Student Records", "Match student ID against university records", (244, 63, 94))
    u12 = draw_use_case(1280, 1180, "12. Approve Job Postings", "Review and publish company postings", (244, 63, 94))
    u13 = draw_use_case(1810, 1180, "13. Moderate Community Feed", "Review flagged posts & suspend violators", (244, 63, 94))
    u14 = draw_use_case(1280, 1350, "14. Immutable Audit Trail", "Log mandatory accountability justification", (244, 63, 94))

    # Connect Student
    for u in [u1, u2, u3, u4, u5, u6]:
        draw_arrow(draw, (480, 420), u, (37, 99, 235), width=3)

    # Connect Alumni
    for u in [u7, u8, u9, u10]:
        draw_arrow(draw, (480, 860), u, (249, 115, 22), width=3)

    # Connect Admin
    for u in [u11, u12, u13, u14]:
        draw_arrow(draw, (480, 1300), u, (244, 63, 94), width=3)

    return img

# =========================================================================
# 4. GORGEOUS CLASS DIAGRAM (Core Domain Entities)
# =========================================================================
def make_class_diagram():
    w, h = 2400, 1600
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(52, bold=True)
    f_sub = get_font(28, bold=False)
    f_cname = get_font(32, bold=True)
    f_field = get_font(22, bold=False)
    f_conn = get_font(22, bold=True)

    draw.text((80, 50), "UML 2.5 Class Diagram: Core Domain Architecture", fill=(17, 14, 56), font=f_title)
    draw.text((80, 115), "Clean domain entities, encapsulation & strict relational foreign keys (Prisma ORM)", fill=(100, 116, 139), font=f_sub)

    classes = [
        {"name": "User Account (Master)", "color": (37, 99, 235), "head_bg": (37, 99, 235), "x": 100, "y": 200, "w": 680, "h": 580,
         "fields": [
             "+ id: String [PK UUID]",
             "+ email: String [Unique Univ / Work]",
             "+ membershipType: STUDENT | ALUMNI | ADMIN",
             "+ verificationStatus: PENDING | VERIFIED",
             "+ accountStatus: ACTIVE | SUSPENDED",
             "+ createdAt: DateTime",
             "--- Domain Methods ---",
             "+ authenticateSession()",
             "+ verifyUniversityCredentials()",
             "+ suspendViolator(reason)",
         ]},
        {"name": "Student Profile & CGPA", "color": (124, 58, 237), "head_bg": (124, 58, 237), "x": 860, "y": 200, "w": 680, "h": 580,
         "fields": [
             "+ id: String [PK]",
             "+ userId: String [FK -> User]",
             "+ studentId: String [Unique Univ ID]",
             "+ department: String [e.g. CSE / SWE]",
             "+ cumulativeCgpa: Float (0.00 - 4.00)",
             "+ isCgpaVerified: Boolean",
             "--- Domain Methods ---",
             "+ calculateCreditWeightedCgpa()",
             "+ checkJobEligibility(minCgpa)",
             "+ exportAcademicReport()",
         ]},
        {"name": "Academic Term Record", "color": (6, 182, 212), "head_bg": (6, 182, 212), "x": 1620, "y": 200, "w": 680, "h": 580,
         "fields": [
             "+ id: String [PK]",
             "+ profileId: String [FK -> Profile]",
             "+ termName: String [e.g. Fall 2025]",
             "+ gpa: Float (0.00 - 4.00)",
             "+ credits: Float (0.5 - 30.0)",
             "+ academicYear: String [e.g. 3rd Year]",
             "--- Domain Methods ---",
             "+ computeQualityPoints()",
             "+ validateGradeBoundary()",
         ]},
        {"name": "Opportunity (Job/Internship)", "color": (249, 115, 22), "head_bg": (249, 115, 22), "x": 100, "y": 880, "w": 680, "h": 580,
         "fields": [
             "+ id: String [PK]",
             "+ posterId: String [FK -> User]",
             "+ title: String [e.g. Software Intern]",
             "+ companyName: String",
             "+ sourceType: OFFICIAL | COMMUNITY",
             "+ minCgpa: Float [Nullable]",
             "+ deadline: DateTime",
             "--- Domain Methods ---",
             "+ isDeadlinePassed(): Boolean",
             "+ incrementApplicantCount()",
         ]},
        {"name": "Application Dossier", "color": (16, 185, 129), "head_bg": (16, 185, 129), "x": 860, "y": 880, "w": 680, "h": 580,
         "fields": [
             "+ id: String [PK]",
             "+ opportunityId: String [FK -> Opportunity]",
             "+ applicantId: String [FK -> User]",
             "+ @@unique([opportunityId, applicantId])",
             "+ status: 7-Stage Pipeline Enum",
             "+ resumeUrl: String [Signed PDF]",
             "--- Domain Methods ---",
             "+ advanceStage(newStatus, note)",
             "+ withdrawApplication()",
         ]},
        {"name": "Alumni Referral Request", "color": (244, 63, 94), "head_bg": (244, 63, 94), "x": 1620, "y": 880, "w": 680, "h": 580,
         "fields": [
             "+ id: String [PK]",
             "+ studentId: String [FK -> User]",
             "+ alumniId: String [FK -> User]",
             "+ targetCompany: String",
             "+ studentPitch: String (Min 20 chars)",
             "+ status: PENDING | ACCEPTED | REFERRED",
             "--- Domain Methods ---",
             "+ acceptAndSponsorReferral()",
             "+ logReferralAudit()",
         ]},
    ]

    for c in classes:
        # Box container
        draw_rounded_card(draw, [c["x"], c["y"], c["x"] + c["w"], c["y"] + c["h"]], (255, 255, 255), c["color"], width=3, radius=20)
        # Header banner
        draw.rounded_rectangle([c["x"], c["y"], c["x"] + c["w"], c["y"] + 70], radius=20, fill=c["head_bg"])
        draw.rectangle([c["x"], c["y"] + 50, c["x"] + c["w"], c["y"] + 70], fill=c["head_bg"])
        draw.text((c["x"] + c["w"] // 2, c["y"] + 20), c["name"], fill=(255, 255, 255), font=f_cname, anchor="mt")

        # Fields & methods
        fy = c["y"] + 90
        for f in c["fields"]:
            if f.startswith("---"):
                draw.line([(c["x"] + 20, fy + 12), (c["x"] + c["w"] - 20, fy + 12)], fill=(226, 232, 240), width=2)
                draw.text((c["x"] + 30, fy + 16), f.replace("-", "").strip(), fill=c["color"], font=get_font(20, bold=True))
                fy += 44
            else:
                draw.text((c["x"] + 30, fy), f, fill=(30, 41, 59), font=f_field)
                fy += 38

    # Connectors
    draw_arrow(draw, (780, 490), (860, 490), (37, 99, 235), width=4)
    draw.text((820, 455), "1 : 1", fill=(37, 99, 235), font=f_conn, anchor="mm")

    draw_arrow(draw, (1540, 490), (1620, 490), (124, 58, 237), width=4)
    draw.text((1580, 455), "1 : N", fill=(124, 58, 237), font=f_conn, anchor="mm")

    draw_arrow(draw, (440, 780), (440, 880), (249, 115, 22), width=4)
    draw.text((475, 830), "1 : N", fill=(249, 115, 22), font=f_conn, anchor="mm")

    draw_arrow(draw, (780, 1170), (860, 1170), (16, 185, 129), width=4)
    draw.text((820, 1135), "1 : N", fill=(16, 185, 129), font=f_conn, anchor="mm")

    draw_arrow(draw, (1540, 1170), (1620, 1170), (244, 63, 94), width=4)
    draw.text((1580, 1135), "1 : N", fill=(244, 63, 94), font=f_conn, anchor="mm")

    return img

# =========================================================================
# 5. GORGEOUS RELATIONAL ERD (3NF Data Architecture)
# =========================================================================
def make_erd_diagram():
    w, h = 2400, 1600
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(52, bold=True)
    f_sub = get_font(28, bold=False)
    f_tname = get_font(30, bold=True)
    f_col = get_font(22, bold=False)
    f_pk = get_font(18, bold=True)

    draw.text((80, 50), "3NF Relational Database Entity-Relationship Diagram (ERD)", fill=(17, 14, 56), font=f_title)
    draw.text((80, 115), "PostgreSQL Database (Neon Lakebase) — Strict 3NF normalization, composite keys & foreign constraints", fill=(100, 116, 139), font=f_sub)

    tables = [
        {"name": "users (Identity Core)", "color": (37, 99, 235), "x": 80, "y": 200, "w": 650, "h": 560,
         "cols": [
             ("PK", "id", "TEXT (cuid)", "Unique user identity"),
             ("UK", "email", "TEXT", "University / corporate email"),
             ("", "membershipType", "ENUM", "STUDENT, ALUMNI, ADMIN"),
             ("", "verificationStatus", "ENUM", "PENDING, VERIFIED"),
             ("", "accountStatus", "ENUM", "ACTIVE, SUSPENDED"),
             ("", "createdAt", "TIMESTAMP", "Account creation date"),
         ]},
        {"name": "profiles (Academic)", "color": (124, 58, 237), "x": 875, "y": 200, "w": 650, "h": 560,
         "cols": [
             ("PK", "id", "TEXT (cuid)", "Profile primary key"),
             ("FK", "userId", "TEXT", "users.id (Cascade delete)"),
             ("UK", "studentId", "TEXT", "Registrar Student ID"),
             ("", "department", "TEXT", "Academic department"),
             ("", "cumulativeCgpa", "DECIMAL(3,2)", "Weighted overall CGPA"),
             ("", "isCgpaVerified", "BOOLEAN", "Registrar verification flag"),
         ]},
        {"name": "academic_records (Ledger)", "color": (6, 182, 212), "x": 1670, "y": 200, "w": 650, "h": 560,
         "cols": [
             ("PK", "id", "TEXT (cuid)", "Record primary key"),
             ("FK", "profileId", "TEXT", "profiles.id (Cascade delete)"),
             ("", "semester", "TEXT", "e.g. Spring 2025"),
             ("", "gpa", "DECIMAL(3,2)", "Term GPA (0.00-4.00)"),
             ("", "credits", "DECIMAL(3,1)", "Credit hours (0.5-30.0)"),
             ("", "academicYear", "TEXT", "e.g. 3rd Year"),
         ]},
        {"name": "opportunities (Postings)", "color": (249, 115, 22), "x": 80, "y": 880, "w": 650, "h": 580,
         "cols": [
             ("PK", "id", "TEXT (cuid)", "Posting primary key"),
             ("FK", "posterId", "TEXT", "users.id (Author)"),
             ("", "title", "TEXT", "Opportunity title"),
             ("", "companyName", "TEXT", "Hiring organization"),
             ("", "sourceType", "ENUM", "OFFICIAL, COMMUNITY"),
             ("", "minCgpa", "DECIMAL(3,2)", "CGPA cutoff threshold"),
             ("", "deadline", "TIMESTAMP", "Application cutoff date"),
         ]},
        {"name": "applications (Pipeline)", "color": (16, 185, 129), "x": 875, "y": 880, "w": 650, "h": 580,
         "cols": [
             ("PK", "id", "TEXT (cuid)", "Application primary key"),
             ("FK", "opportunityId", "TEXT", "opportunities.id"),
             ("FK", "applicantId", "TEXT", "users.id"),
             ("UK", "opp_app_unique", "COMPOSITE", "@@unique([opp_id, app_id])"),
             ("", "status", "ENUM", "7-stage workflow status"),
             ("", "resumeUrl", "TEXT", "Signed PDF document link"),
             ("", "submittedAt", "TIMESTAMP", "Exact application time"),
         ]},
        {"name": "referral_requests (Alumni)", "color": (244, 63, 94), "x": 1670, "y": 880, "w": 650, "h": 580,
         "cols": [
             ("PK", "id", "TEXT (cuid)", "Referral primary key"),
             ("FK", "studentId", "TEXT", "users.id (Student applicant)"),
             ("FK", "alumniId", "TEXT", "users.id (Alumni sponsor)"),
             ("", "targetCompany", "TEXT", "Requested company"),
             ("", "status", "ENUM", "PENDING, ACCEPTED, REFERRED"),
             ("", "createdAt", "TIMESTAMP", "Referral request time"),
         ]},
    ]

    for t in tables:
        draw_rounded_card(draw, [t["x"], t["y"], t["x"] + t["w"], t["y"] + t["h"]], (255, 255, 255), t["color"], width=3, radius=20)
        # Banner
        draw.rounded_rectangle([t["x"], t["y"], t["x"] + t["w"], t["y"] + 70], radius=20, fill=t["color"])
        draw.rectangle([t["x"], t["y"] + 50, t["x"] + t["w"], t["y"] + 70], fill=t["color"])
        draw.text((t["x"] + t["w"] // 2, t["y"] + 20), t["name"], fill=(255, 255, 255), font=f_tname, anchor="mt")

        cy = t["y"] + 95
        for tag, col_name, col_type, col_desc in t["cols"]:
            # Tag badge
            if tag:
                draw.rounded_rectangle([t["x"] + 20, cy - 2, t["x"] + 65, cy + 24], radius=6, fill=t["color"])
                draw.text((t["x"] + 42, cy + 11), tag, fill=(255, 255, 255), font=f_pk, anchor="mm")
            
            draw.text((t["x"] + 80, cy), col_name, fill=(15, 23, 42), font=get_font(22, bold=True))
            draw.text((t["x"] + 290, cy + 2), col_type, fill=t["color"], font=f_col)
            draw.text((t["x"] + 80, cy + 30), col_desc, fill=(100, 116, 139), font=get_font(18, bold=False))
            cy += 70

    # Draw connection lines
    draw_arrow(draw, (730, 480), (875, 480), (37, 99, 235), width=4)
    draw_arrow(draw, (1525, 480), (1670, 480), (124, 58, 237), width=4)
    draw_arrow(draw, (405, 760), (405, 880), (249, 115, 22), width=4)
    draw_arrow(draw, (730, 1170), (875, 1170), (16, 185, 129), width=4)
    draw_arrow(draw, (1525, 1170), (1670, 1170), (244, 63, 94), width=4)

    return img

# =========================================================================
# 6. GORGEOUS INGRESS SYSTEM WORKFLOW
# =========================================================================
def make_system_workflow_diagram():
    w, h = 2400, 1600
    img = Image.new("RGBA", (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)

    f_title = get_font(52, bold=True)
    f_sub = get_font(28, bold=False)
    f_role = get_font(34, bold=True)
    f_note = get_font(22, bold=False)
    f_flow = get_font(24, bold=True)

    draw.text((80, 50), "UniCareer Community: Ingress Architecture & System Workflow", fill=(17, 14, 56), font=f_title)
    draw.text((80, 115), "Three-tier architecture: 3 Verified User Personas -> Next.js 16 Edge -> Neon PostgreSQL", fill=(100, 116, 139), font=f_sub)

    # 3 User Cards on left
    users = [
        {"name": "🎓 STUDENT", "desc": "• Explores curated jobs\n• Calculates true CGPA\n• Applies with 1-click CV", "y": 300, "bg": (239, 246, 255), "b": (37, 99, 235)},
        {"name": "💼 ALUMNI", "desc": "• Sponsoring referrals\n• Sharing real job leads\n• Mentoring juniors", "y": 750, "bg": (255, 247, 237), "b": (249, 115, 22)},
        {"name": "🛡️ ADMIN", "desc": "• Verifies student IDs\n• Approves job postings\n• Keeps community safe", "y": 1200, "bg": (253, 242, 248), "b": (244, 63, 94)},
    ]

    for u in users:
        draw_rounded_card(draw, [80, u["y"] - 140, 560, u["y"] + 140], u["bg"], u["b"], width=3, radius=24)
        draw.text((320, u["y"] - 90), u["name"], fill=u["b"], font=f_role, anchor="mt")
        draw.text((120, u["y"] - 30), u["desc"], fill=(71, 85, 105), font=get_font(24, bold=False))

    # Gateway Middle Column
    draw_rounded_card(draw, [760, 240, 1440, 1460], (255, 255, 255), (124, 58, 237), width=4, radius=30)
    draw.rounded_rectangle([760, 240, 1440, 340], radius=30, fill=(124, 58, 237))
    draw.rectangle([760, 310, 1440, 340], fill=(124, 58, 237))
    draw.text((1100, 265), "⚡ NEXT.JS 16 WEB ENGINE", fill=(255, 255, 255), font=get_font(34, bold=True), anchor="mt")
    draw.text((1100, 305), "App Router • Server Actions • Zod Validation", fill=(255, 255, 255, 210), font=f_note, anchor="mt")

    # Inside Next.js
    components = [
        ("🔐 Authentication & Whitelist Gate", "Decrypts session cookie, matches registrar whitelist database", 420),
        ("📊 True CGPA Calculation Engine", "Credit-weighted summation: Sum(GPA * Credits) / Sum(Credits)", 660),
        ("💼 Opportunity Matching & Eligibility", "Filters opportunities strictly against student CGPA & major", 900),
        ("🤝 Alumni Referral Routing System", "Direct pitch routing to verified alumni working at target companies", 1140),
    ]
    for c_title, c_desc, cy in components:
        draw_rounded_card(draw, [810, cy - 70, 1390, cy + 70], (248, 250, 252), (124, 58, 237), width=2, radius=16)
        draw.text((840, cy - 40), c_title, fill=(79, 70, 229), font=get_font(26, bold=True))
        draw.text((840, cy + 5), c_desc, fill=(100, 116, 139), font=f_note)

    # Database Column on right
    draw_rounded_card(draw, [1640, 300, 2320, 1400], (236, 253, 245), (16, 185, 129), width=4, radius=30)
    draw.rounded_rectangle([1640, 300, 2320, 400], radius=30, fill=(16, 185, 129))
    draw.rectangle([1640, 370, 2320, 400], fill=(16, 185, 129))
    draw.text((1980, 325), "🗄️ NEON POSTGRESQL (3NF)", fill=(255, 255, 255), font=get_font(34, bold=True), anchor="mt")
    draw.text((1980, 365), "Serverless Database • Connection Pooling", fill=(255, 255, 255, 210), font=f_note, anchor="mt")

    db_highlights = [
        ("⚡ Pre-Warmed Connection Pool", "Maintains sub-15ms query execution under simultaneous request spikes", 520),
        ("🔒 Atomic $transaction Commits", "Prevents race conditions; rolls back whole batch if any constraint fails", 780),
        ("🛡️ Composite Unique Keys", "@@unique([opportunityId, applicantId]) prevents duplicate submissions", 1040),
    ]
    for d_title, d_desc, dy in db_highlights:
        draw_rounded_card(draw, [1690, dy - 70, 2270, dy + 70], (255, 255, 255), (16, 185, 129), width=2, radius=16)
        draw.text((1720, dy - 40), d_title, fill=(6, 78, 59), font=get_font(26, bold=True))
        draw.text((1720, dy + 5), d_desc, fill=(71, 85, 105), font=f_note)

    # Connections
    draw_arrow(draw, (560, 300), (760, 420), (37, 99, 235), width=4)
    draw_arrow(draw, (560, 750), (760, 750), (249, 115, 22), width=4)
    draw_arrow(draw, (560, 1200), (760, 1140), (244, 63, 94), width=4)

    draw_arrow(draw, (1440, 520), (1640, 520), (16, 185, 129), width=4)
    draw_arrow(draw, (1440, 900), (1640, 780), (16, 185, 129), width=4)
    draw_arrow(draw, (1440, 1140), (1640, 1040), (16, 185, 129), width=4)

    return img

def main():
    out_dir = "scripts/assets/diagrams"
    os.makedirs(out_dir, exist_ok=True)

    print("Generating Pristine High-Resolution Diagrams...")

    seq_img = make_sequence_diagram()
    seq_img.save(os.path.join(out_dir, "uml_sequence.png"), "PNG")
    print("✓ Saved uml_sequence.png (2400x1600)")

    swim_img = make_swimlane_diagram()
    swim_img.save(os.path.join(out_dir, "uml_swimlane.png"), "PNG")
    print("✓ Saved uml_swimlane.png (2400x1600)")

    uc_img = make_use_case_diagram()
    uc_img.save(os.path.join(out_dir, "uml_use_case.png"), "PNG")
    print("✓ Saved uml_use_case.png (2400x1600)")

    class_img = make_class_diagram()
    class_img.save(os.path.join(out_dir, "uml_class.png"), "PNG")
    print("✓ Saved uml_class.png (2400x1600)")

    erd_img = make_erd_diagram()
    erd_img.save(os.path.join(out_dir, "uml_erd.png"), "PNG")
    print("✓ Saved uml_erd.png (2400x1600)")

    wf_img = make_system_workflow_diagram()
    wf_img.save(os.path.join(out_dir, "uml_workflow.png"), "PNG")
    print("✓ Saved uml_workflow.png (2400x1600)")

    print("\nALL 6 DIAGRAMS SUCCESSFULLY GENERATED WITH PERFECT RENDERING!")

if __name__ == "__main__":
    main()
