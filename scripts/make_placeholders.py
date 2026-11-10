import os
from PIL import Image, ImageDraw, ImageFont

def generate_placeholder_images():
    os.makedirs("scripts/assets", exist_ok=True)

    placeholders = [
        ("placeholder_system_workflow.png", "SYSTEM WORKFLOW & ARCHITECTURE", "#1E1B4B", "#7C3AED", "#06B6D4"),
        ("placeholder_registration.png", "REGISTRATION & DOMAIN VERIFICATION", "#111827", "#3B82F6", "#10B981"),
        ("placeholder_academic_tools.png", "ACADEMIC CGPA CALCULATOR & DIAL", "#1E1B4B", "#8B5CF6", "#F59E0B"),
        ("placeholder_opportunities.png", "TWO-TIER OPPORTUNITIES DIRECTORY", "#0F172A", "#2563EB", "#06B6D4"),
        ("placeholder_application_dossier.png", "CANDIDATE APPLICATION DOSSIER & PDF", "#18182E", "#EC4899", "#8B5CF6"),
        ("placeholder_application_tracker.png", "APPLICATION TRACKER & KANBAN PIPELINE", "#090D16", "#10B981", "#3B82F6"),
        ("placeholder_referral_hub.png", "ALUMNI REFERRAL SPONSORSHIP HUB", "#1C1917", "#F97316", "#FBBF24"),
        ("placeholder_community_feed.png", "COMMUNITY FEED & THREADED DISCUSSIONS", "#1E1B4B", "#6366F1", "#EC4899"),
        ("placeholder_career_calendar.png", "CAREER CALENDAR & DEADLINE REMINDERS", "#0B1329", "#06B6D4", "#10B981"),
        ("placeholder_admin_governance.png", "ADMIN VERIFICATION QUEUE & AUDIT LOGS", "#1E1B4B", "#EF4444", "#F59E0B"),
    ]

    for filename, title, bg_color, accent1, accent2 in placeholders:
        w, h = 1280, 720
        img = Image.new("RGB", (w, h), color=bg_color)
        draw = ImageDraw.Draw(img)

        # Draw grid
        for x in range(0, w, 40):
            draw.line([(x, 0), (x, h)], fill="#1E293B", width=1)
        for y in range(0, h, 40):
            draw.line([(0, y), (w, y)], fill="#1E293B", width=1)

        # Outer rounded frame
        draw.rounded_rectangle([(30, 30), (w - 30, h - 30)], radius=24, outline=accent1, width=3)

        # Card header ribbon
        draw.rounded_rectangle([(60, 50), (w - 60, 110)], radius=12, fill=accent1)
        # Mock window control dots
        draw.ellipse([(80, 73), (94, 87)], fill="#EF4444")
        draw.ellipse([(104, 73), (118, 87)], fill="#F59E0B")
        draw.ellipse([(128, 73), (142, 87)], fill="#10B981")

        # Center camera/photo frame box
        cx1, cy1, cx2, cy2 = 240, 170, w - 240, h - 140
        draw.rounded_rectangle([(cx1, cy1), (cx2, cy2)], radius=20, outline=accent2, width=2, fill="#0F172A")

        # Camera Icon representation
        cam_x, cam_y = w // 2, 280
        draw.rounded_rectangle([(cam_x - 60, cam_y - 40), (cam_x + 60, cam_y + 40)], radius=14, outline=accent2, width=3, fill="#1E293B")
        draw.rounded_rectangle([(cam_x - 25, cam_y - 55), (cam_x + 25, cam_y - 40)], radius=6, outline=accent2, width=2, fill=accent1)
        draw.ellipse([(cam_x - 25, cam_y - 25), (cam_x + 25, cam_y + 25)], outline=accent2, width=3, fill="#0F172A")
        draw.ellipse([(cam_x + 35, cam_y - 28), (cam_x + 45, cam_y - 18)], fill=accent1)

        # Text labels using default font or drawn text
        # Since standard fonts might not be available, draw clear indicator banners
        badge_y = cy1 + 190
        draw.rounded_rectangle([(cx1 + 80, badge_y), (cx2 - 80, badge_y + 48)], radius=10, fill=accent1)

        # Sub-badge
        draw.rounded_rectangle([(cx1 + 140, badge_y + 65), (cx2 - 140, badge_y + 105)], radius=8, outline=accent2, width=2, fill="#1E1B4B")

        filepath = os.path.join("scripts/assets", filename)
        img.save(filepath, "PNG")
        print(f"Generated placeholder image: {filepath}")

if __name__ == "__main__":
    generate_placeholder_images()

