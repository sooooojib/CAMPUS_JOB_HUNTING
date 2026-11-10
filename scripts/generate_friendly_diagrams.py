import os
import subprocess

def generate_friendly_diagrams():
    os.makedirs("scripts/assets/diagrams", exist_ok=True)

    # 1. Fun & Human System Workflow Diagram
    dot_system_workflow = """
    digraph G {
        rankdir=TB;
        dpi=300;
        bgcolor="transparent";
        splines=true;
        nodesep=0.7;
        ranksep=0.8;
        node [fontname="Helvetica-Bold", fontsize=12, shape=box, style="filled,rounded", penwidth=2.5];
        edge [fontname="Helvetica-Bold", fontsize=11, penwidth=2.5, color="#6366F1", fontcolor="#1E1B4B"];

        subgraph cluster_users {
            label="THE 3 PEOPLE WHO USE UNICAREER";
            fontname="Helvetica-Bold"; fontsize=14; fontcolor="#4338CA"; color="#7C3AED"; style="dashed,rounded"; penwidth=2.5;
            Student [label="🎓 STUDENT\\n• Explores curated jobs\\n• Tracks semester CGPA\\n• Applies with 1-click CV", fillcolor="#EFF6FF", color="#2563EB", fontcolor="#1E3A8A"];
            Alumni [label="💼 ALUMNI\\n• Sponsoring referrals\\n• Sharing job leads\\n• Mentoring juniors", fillcolor="#FFF7ED", color="#F97316", fontcolor="#9A3412"];
            Admin [label="🛡️ ADMIN\\n• Verifies student IDs\\n• Approves real job posts\\n• Keeps community safe", fillcolor="#FDF2F8", color="#EC4899", fontcolor="#831843"];
        }

        subgraph cluster_gateway {
            label="STEP 1: SAFE & FAST DOORWAY";
            fontname="Helvetica-Bold"; fontsize=13; fontcolor="#0E7490"; color="#06B6D4"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2;
            Gateway [label="🌐 Cloudflare & Vercel Gateway\\n• Keeps hackers and bots out\\n• Instant page loads everywhere\\n• Safe university email login", fillcolor="#ECFEFF", color="#06B6D4", fontcolor="#155E75"];
        }

        subgraph cluster_app {
            label="STEP 2: SMART FEATURES & LOGIC";
            fontname="Helvetica-Bold"; fontsize=13; fontcolor="#4338CA"; color="#6366F1"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2;
            AppServer [label="⚡ Next.js 16 Web Engine\\n• Calculates true credit-weighted CGPA\\n• Checks if you qualify before applying\\n• Instant job deadline reminders", fillcolor="#EEF2FF", color="#6366F1", fontcolor="#312E81"];
        }

        subgraph cluster_db {
            label="STEP 3: SUPER-FAST CLOUD DATABASE";
            fontname="Helvetica-Bold"; fontsize=13; fontcolor="#065F46"; color="#10B981"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2;
            Database [label="🗄️ Neon Serverless PostgreSQL (3NF)\\n• Pre-warmed connection pool (never crashes on deadline day!)\\n• Zero duplicate applications allowed\\n• Student transcripts & CVs locked in private vault", fillcolor="#ECFDF5", color="#10B981", fontcolor="#064E3B"];
        }

        Student -> Gateway [label=" Log in ", color="#2563EB"];
        Alumni -> Gateway [label=" Log in ", color="#F97316"];
        Admin -> Gateway [label=" Log in ", color="#EC4899"];

        Gateway -> AppServer [label=" Safe Request ", color="#06B6D4"];
        AppServer -> Database [label=" Lightning Query (<5ms) ", color="#10B981"];
    }
    """

    # 2. Fun & Human Use Case Diagram (Student, Alumni, Admin)
    dot_use_case = """
    digraph G {
        rankdir=LR;
        dpi=300;
        bgcolor="transparent";
        splines=true;
        nodesep=0.5;
        ranksep=0.8;
        node [fontname="Helvetica-Bold", fontsize=11];
        edge [fontname="Helvetica-Bold", fontsize=10, color="#6366F1", fontcolor="#4338CA", penwidth=2];

        // 3 Actors
        node [shape=box, style="filled,rounded", penwidth=2.5];
        Student [label="🎓 STUDENT\\n(Career Seeker)", fillcolor="#EFF6FF", color="#2563EB", fontcolor="#1E3A8A", fontsize=13];
        Alumni [label="💼 ALUMNI\\n(Mentor & Referral)", fillcolor="#FFF7ED", color="#F97316", fontcolor="#9A3412", fontsize=13];
        Admin [label="🛡️ UNIVERSITY ADMIN\\n(Placement Office)", fillcolor="#FDF2F8", color="#EC4899", fontcolor="#831843", fontsize=13];

        subgraph cluster_platform {
            label="WHAT EACH PERSON CAN DO IN UNICAREER";
            fontname="Helvetica-Bold"; fontsize=14; fontcolor="#1E1B4B"; color="#7C3AED"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2.5;

            node [shape=ellipse, style="filled", fillcolor="#FFFFFF", color="#8B5CF6", fontcolor="#312E81", fontsize=11, penwidth=2];
            UC_Auth [label="1. Log in with University Email", fillcolor="#EEF2FF", color="#6366F1"];
            UC_Whitelist [label="2. Check Registrar Student ID", fillcolor="#FEF3C7", color="#F59E0B"];
            UC_CGPA [label="3. Enter Grades & Get True CGPA", fillcolor="#EFF6FF", color="#3B82F6"];
            UC_Jobs [label="4. Browse Verified Jobs & Internships", fillcolor="#ECFDF5", color="#10B981"];
            UC_Filter [label="5. Filter Jobs by My CGPA", fillcolor="#F0FDF4", color="#059669"];
            UC_Apply [label="6. Apply in 1-Click with Resume", fillcolor="#EFF6FF", color="#2563EB"];
            UC_ReferralReq [label="7. Ask Alumni for Job Referral", fillcolor="#FFF7ED", color="#F97316"];
            UC_Sponsor [label="8. Alumni: Approve & Sponsor Referral", fillcolor="#FFF7ED", color="#EA580C"];
            UC_Post [label="9. Alumni: Share Job Lead with Juniors", fillcolor="#FFF7ED", color="#F97316"];
            UC_Calendar [label="10. Track Deadlines on Career Calendar", fillcolor="#ECFEFF", color="#06B6D4"];
            UC_Verify [label="11. Admin: Verify Member Accounts", fillcolor="#FDF2F8", color="#EC4899"];
            UC_Moderate [label="12. Admin: Approve Real Job Leads", fillcolor="#FDF2F8", color="#DB2777"];
            UC_Audit [label="13. Admin: Check Fair-Play Audit Logs", fillcolor="#FEF2F2", color="#EF4444"];
        }

        // Student flows
        Student -> UC_Auth;
        Student -> UC_CGPA;
        Student -> UC_Jobs;
        Student -> UC_Apply;
        Student -> UC_ReferralReq;
        Student -> UC_Calendar;

        // Alumni flows
        Alumni -> UC_Auth;
        Alumni -> UC_Jobs;
        Alumni -> UC_Sponsor;
        Alumni -> UC_Post;

        // Admin flows
        Admin -> UC_Auth;
        Admin -> UC_Verify;
        Admin -> UC_Moderate;
        Admin -> UC_Audit;

        // Relationships
        UC_Auth -> UC_Whitelist [label=" checks whitelist ", style="dashed", color="#F59E0B"];
        UC_Jobs -> UC_Filter [label=" matches CGPA ", style="dashed", color="#10B981"];
        UC_ReferralReq -> UC_Sponsor [label=" sends request to ", style="dotted", color="#F97316", penwidth=2.5];
        UC_Post -> UC_Moderate [label=" admin checks lead ", style="dashed", color="#EC4899"];
    }
    """

    # 3. Fun & Human Swimlane Diagram (Application Journey)
    dot_swimlane = """
    digraph G {
        rankdir=TB;
        dpi=300;
        bgcolor="transparent";
        splines=true;
        nodesep=0.5;
        ranksep=0.7;
        node [fontname="Helvetica-Bold", fontsize=11, penwidth=2.5];
        edge [fontname="Helvetica-Bold", fontsize=10, color="#4F46E5", fontcolor="#1E1B4B", penwidth=2.5];

        subgraph cluster_student {
            label="🎓 STUDENT SWIMLANE";
            fontname="Helvetica-Bold"; fontsize=13; fontcolor="#1E3A8A"; color="#2563EB"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2.5;
            node [shape=box, style="filled,rounded", fillcolor="#EFF6FF", color="#2563EB", fontcolor="#1E3A8A"];
            S1 [label="1. Student picks an internship\\nand clicks 'Apply Now'"];
            S2 [label="2. Attaches PDF Resume\\nand writes a short note"];
            S3 [label="3. Clicks 'Submit Application'!"];
            S4 [label="7. Sees instant celebration modal!\\n'Application Submitted Successfully!'", fillcolor="#D1FAE5", color="#10B981", fontcolor="#065F46"];
        }

        subgraph cluster_server {
            label="⚡ UNICAREER ENGINE";
            fontname="Helvetica-Bold"; fontsize=13; fontcolor="#4338CA"; color="#6366F1"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2.5;
            node [shape=box, style="filled,rounded", fillcolor="#EEF2FF", color="#6366F1", fontcolor="#312E81"];
            E1 [label="4. Checks student login\\n& verifies resume is a valid PDF"];
            E2 [label="Did student already apply?", shape=diamond, fillcolor="#FEF3C7", color="#F59E0B", fontcolor="#92400E"];
            E3 [label="6. Sends friendly email ping\\nto company / alumni reviewer", fillcolor="#FFF7ED", color="#F97316", fontcolor="#9A3412"];
        }

        subgraph cluster_db {
            label="🗄️ SAFE CLOUD DATABASE";
            fontname="Helvetica-Bold"; fontsize=13; fontcolor="#065F46"; color="#10B981"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2.5;
            node [shape=box, style="filled,rounded", fillcolor="#ECFDF5", color="#10B981", fontcolor="#064E3B"];
            D1 [label="5. Saves application record in 0.05s\\nUpdates applicant count!"];
        }

        subgraph cluster_alumni {
            label="💼 ALUMNI / REVIEWER";
            fontname="Helvetica-Bold"; fontsize=13; fontcolor="#9A3412"; color="#F97316"; style="filled,rounded"; fillcolor="#F8FAFC"; penwidth=2.5;
            node [shape=box, style="filled,rounded", fillcolor="#FFF7ED", color="#F97316", fontcolor="#9A3412"];
            R1 [label="8. Receives email alert\\n'New student applied!'"];
            R2 [label="9. Reviews student's true CGPA\\nand opens private resume"];
            R3 [label="10. Clicks 'Move to Interview'!\\nCandidate gets notified instantly! 🎉", fillcolor="#ECFDF5", color="#10B981", fontcolor="#065F46"];
        }

        S1 -> S2;
        S2 -> S3;
        S3 -> E1 [color="#2563EB", label=" Sends "];
        E1 -> E2;
        E2 -> D1 [color="#10B981", label=" No duplicate! "];
        D1 -> E3;
        D1 -> S4 [color="#10B981", label=" Saved! "];
        E3 -> R1 [color="#F97316", style="dashed", label=" Async email "];
        R1 -> R2;
        R2 -> R3;
    }
    """

    # 4. Fun & Human Sequence Diagram (Life of an Application)
    dot_sequence = """
    digraph G {
        rankdir=LR;
        dpi=300;
        bgcolor="transparent";
        splines=true;
        nodesep=0.7;
        ranksep=0.8;
        node [fontname="Helvetica-Bold", fontsize=11, shape=box, style="filled,rounded", penwidth=2.5];
        edge [fontname="Helvetica-Bold", fontsize=10, penwidth=2.5];

        Student [label="🎓 Student\\nBrowser UI", fillcolor="#EFF6FF", color="#2563EB", fontcolor="#1E3A8A"];
        NextServer [label="⚡ Next.js\\nWeb Engine", fillcolor="#EEF2FF", color="#6366F1", fontcolor="#312E81"];
        Database [label="🗄️ Neon Cloud\\nPostgreSQL", fillcolor="#ECFDF5", color="#10B981", fontcolor="#064E3B"];
        EmailService [label="📨 Notification\\nWorker", fillcolor="#FFF7ED", color="#F97316", fontcolor="#9A3412"];
        Alumni [label="💼 Alumni\\nMentor", fillcolor="#FDF2F8", color="#EC4899", fontcolor="#831843"];

        Student -> NextServer [label=" 1. Clicks Apply with Resume ", color="#2563EB"];
        NextServer -> Database [label=" 2. Checks for duplicates ", color="#6366F1"];
        Database -> NextServer [label=" 3. All clear! No dupes ", color="#10B981"];
        NextServer -> Database [label=" 4. Saves candidate record ", color="#10B981"];
        Database -> NextServer [label=" 5. Confirmed saved in 42ms ", color="#10B981"];
        NextServer -> Student [label=" 6. 'Success!' (<150ms total) ", color="#2563EB"];
        NextServer -> EmailService [label=" 7. Background ping ", style="dashed", color="#F97316"];
        EmailService -> Alumni [label=" 8. 'New student applied!' ", style="dashed", color="#EC4899"];
    }
    """

    # 5. Fun & Human Class Diagram (Clean Data Architecture)
    dot_class_diagram = """
    digraph G {
        rankdir=TB;
        dpi=300;
        bgcolor="transparent";
        node [fontname="Helvetica-Bold", fontsize=10, shape=box, style="filled,rounded", penwidth=2.5];
        edge [fontname="Helvetica-Bold", fontsize=10, color="#6366F1", penwidth=2.5];

        User [label="👤 USER ACCOUNT (Master Login)\\n• id: Unique User Code\\n• email: University / Corporate Email\\n• role: STUDENT, ALUMNI, or ADMIN\\n• verified: YES or PENDING\\n• actions: login(), verifyStudent()", fillcolor="#EFF6FF", color="#2563EB", fontcolor="#1E3A8A"];

        Profile [label="🎓 STUDENT / ALUMNI PROFILE\\n• studentId: Registrar Student ID\\n• department: e.g. Computer Science\\n• cumulativeCgpa: True Credit-Weighted CGPA\\n• skills: Python, React, SQL, Cloud\\n• actions: calculateCGPA(), checkJobMatch()", fillcolor="#EEF2FF", color="#4F46E5", fontcolor="#312E81"];

        Opportunity [label="💼 JOB & INTERNSHIP POSTING\\n• title: e.g. Software Engineering Intern\\n• company: Hiring Company Name\\n• type: OFFICIAL_EMPLOYER or COMMUNITY_SHARED\\n• minCgpa: e.g. 3.25\\n• deadline: Application Cut-off Date\\n• actions: approvePosting(), isStudentEligible()", fillcolor="#FFF7ED", color="#F97316", fontcolor="#9A3412"];

        Application [label="📄 APPLICATION DOSSIER\\n• resumeUrl: Private Expiring PDF Link\\n• status: Submitted -> Review -> Interview -> Selected\\n• appliedAt: Exact Timestamp\\n• actions: updateStage(), withdrawApplication()", fillcolor="#ECFDF5", color="#10B981", fontcolor="#064E3B"];

        Referral [label="🤝 ALUMNI REFERRAL REQUEST\\n• targetCompany: e.g. Google, Meta, FinTech\\n• studentPitch: Candidate's Intro Message\\n• status: Pending -> Accepted -> Referred!\\n• actions: acceptReferral(), sendToCompany()", fillcolor="#FDF2F8", color="#EC4899", fontcolor="#831843"];

        AuditLog [label="🛡️ FAIR-PLAY AUDIT RECORD\\n• adminId: Staff Member Responsible\\n• action: Verification Approved or Member Suspended\\n• reason: Mandatory Explanation (Min 5 chars)\\n• actions: recordImmutableAudit()", fillcolor="#FEF2F2", color="#EF4444", fontcolor="#991B1B"];

        User -> Profile [label=" 1 Account has 1 Profile ", color="#2563EB"];
        User -> Opportunity [label=" Alumni / Employer posts ", color="#F97316"];
        Opportunity -> Application [label=" Has many applicants ", color="#10B981"];
        User -> Application [label=" Student submits ", color="#10B981"];
        User -> Referral [label=" Student asks Alumni ", color="#EC4899"];
        User -> AuditLog [label=" Admin actions logged ", color="#EF4444"];
    }
    """

    # 6. Fun & Human Relational ERD
    dot_erd = """
    digraph G {
        rankdir=LR;
        dpi=300;
        bgcolor="transparent";
        splines=true;
        nodesep=0.6;
        ranksep=0.8;
        node [fontname="Helvetica-Bold", fontsize=10, shape=box, style="filled,rounded", penwidth=2.5];
        edge [fontname="Helvetica-Bold", fontsize=10, color="#0891B2", penwidth=2.5];

        users [label="👤 users Table\\n• id [Primary Key]\\n• email [Unique]\\n• membershipType: STUDENT / ALUMNI / ADMIN\\n• verificationStatus: PENDING / VERIFIED\\n• accountStatus: ACTIVE / SUSPENDED", fillcolor="#ECFEFF", color="#06B6D4", fontcolor="#155E75"];

        profiles [label="🎓 profiles Table\\n• id [Primary Key]\\n• userId [Links to users]\\n• studentId [Registrar ID]\\n• department: Computer Science\\n• cumulativeCgpa: Real Weighted Score", fillcolor="#EFF6FF", color="#2563EB", fontcolor="#1E3A8A"];

        academic_records [label="📊 academic_records Table\\n• id [Primary Key]\\n• profileId [Links to profile]\\n• termName: e.g. Fall 2024\\n• termGpa: 0.00 to 4.00\\n• termCredits: Course Credit Hours", fillcolor="#EEF2FF", color="#6366F1", fontcolor="#312E81"];

        opportunities [label="💼 opportunities Table\\n• id [Primary Key]\\n• posterId [Links to users]\\n• title: Job Role Name\\n• sourceType: Official vs Community\\n• minCgpa: Minimum Required GPA\\n• deadline: Cut-off Timestamp", fillcolor="#FFF7ED", color="#F97316", fontcolor="#9A3412"];

        applications [label="📄 applications Table\\n• id [Primary Key]\\n• opportunityId [Links to job]\\n• applicantId [Links to student]\\n• unique(jobId, studentId) -> No dupes!\\n• status: 7-Stage Pipeline\\n• resumeUrl: Private PDF Vault", fillcolor="#ECFDF5", color="#10B981", fontcolor="#064E3B"];

        referrals [label="🤝 referral_requests Table\\n• id [Primary Key]\\n• studentId [Student]\\n• alumniId [Alumni Mentor]\\n• targetCompany: Target Firm\\n• status: Pending / Accepted / Completed", fillcolor="#FDF2F8", color="#EC4899", fontcolor="#831843"];

        audit_logs [label="🛡️ admin_audit_logs Table\\n• id [Primary Key]\\n• adminId [Responsible Staff]\\n• actionType: Verification / Suspension\\n• justificationReason: Required Text\\n• loggedAt: Timestamp (Permanent!)", fillcolor="#FEF2F2", color="#EF4444", fontcolor="#991B1B"];

        users -> profiles [label=" 1 to 1 ", color="#2563EB"];
        profiles -> academic_records [label=" 1 to many semesters ", color="#6366F1"];
        users -> opportunities [label=" Posts ", color="#F97316"];
        opportunities -> applications [label=" Receives ", color="#10B981"];
        users -> applications [label=" Applies ", color="#10B981"];
        users -> referrals [label=" Requests referral ", color="#EC4899"];
        users -> audit_logs [label=" Admin accountability ", color="#EF4444"];
    }
    """

    diagrams = [
        ("uml_workflow.png", dot_system_workflow),
        ("uml_use_case.png", dot_use_case),
        ("uml_swimlane.png", dot_swimlane),
        ("uml_sequence.png", dot_sequence),
        ("uml_class.png", dot_class_diagram),
        ("uml_erd.png", dot_erd),
    ]

    for fname, dot_str in diagrams:
        out_path = os.path.join("scripts/assets/diagrams", fname)
        p = subprocess.run(["dot", "-Tpng", "-Gdpi=300"], input=dot_str.encode(), stdout=subprocess.PIPE, check=True)
        with open(out_path, "wb") as f:
            f.write(p.stdout)
        print(f"Generated Friendly High-Res Diagram: {out_path} ({len(p.stdout)} bytes)")

if __name__ == "__main__":
    generate_friendly_diagrams()

