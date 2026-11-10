import os
import subprocess

def generate_uml_diagrams():
    os.makedirs("scripts/assets/diagrams", exist_ok=True)

    # 6. Real 3NF Relational ER Diagram
    dot_erd = """
    digraph G {
        rankdir=LR;
        dpi=300;
        bgcolor="transparent";
        node [fontname="Helvetica", fontsize=9, shape=record, style="filled", fillcolor="#FFFFFF", color="#06B6D4", penwidth=2];
        edge [fontname="Helvetica-Bold", fontsize=9, color="#0891B2", penwidth=2];

        users [label="{users (3NF Master Identity)|id: String [PK]\\lemail: String [UK]\\lmembershipType: STUDENT / ALUMNI / ADMIN\\lverificationStatus: PENDING / VERIFIED\\laccountStatus: ACTIVE / SUSPENDED\\lcreatedAt: Timestamp\\l}", fillcolor="#ECFEFF"];
        profiles [label="{profiles (3NF Profile & Academic)|id: String [PK]\\luserId: String [FK to users.id]\\lstudentId: String [UK]\\ldepartment: String\\lcumulativeCgpa: Float\\lbatchYear: Int\\l}", fillcolor="#EFF6FF"];
        academic_records [label="{academic_records (3NF Term Ledger)|id: String [PK]\\lprofileId: String [FK to profiles.id]\\ltermName: String\\ltermGpa: Float (0.00-4.00)\\ltermCredits: Float (0.5-30.0)\\l}", fillcolor="#EEF2FF"];
        opportunities [label="{opportunities (3NF Curated Postings)|id: String [PK]\\lposterId: String [FK to users.id]\\ltitle: String\\lsourceType: OFFICIAL / COMMUNITY\\lminCgpa: Float\\lstatus: PENDING / APPROVED / CLOSED\\ldeadline: Timestamp\\l}", fillcolor="#FFF7ED"];
        applications [label="{applications (3NF Candidate Pipeline)|id: String [PK]\\lopportunityId: String [FK]\\lapplicantId: String [FK]\\lunique(opportunityId, applicantId)\\lstatus: 7-Stage Enum\\lresumeUrl: String (Signed)\\l}", fillcolor="#ECFDF5"];
        referrals [label="{referral_requests (3NF Alumni Hub)|id: String [PK]\\lstudentId: String [FK to users.id]\\lalumniId: String [FK to users.id]\\ltargetCompany: String\\lstatus: PENDING / ACCEPTED / COMPLETED\\l}", fillcolor="#FDF2F8"];
        audit_logs [label="{admin_audit_logs (3NF Immutable Trail)|id: String [PK]\\ladminId: String [FK to users.id]\\lactionType: String\\ljustificationReason: String (Min 5 chars)\\lloggedAt: Timestamp\\l}", fillcolor="#FEF2F2"];

        users -> profiles [label="1 : 1", color="#2563EB"];
        profiles -> academic_records [label="1 : N", color="#6366F1"];
        users -> opportunities [label="1 : N (Poster)", color="#F97316"];
        opportunities -> applications [label="1 : N", color="#10B981"];
        users -> applications [label="1 : N (Applicant)", color="#10B981"];
        users -> referrals [label="1 : N (Student)", color="#DB2777"];
        users -> referrals [label="1 : N (Alumni)", color="#DB2777"];
        users -> audit_logs [label="1 : N (Admin)", color="#EF4444"];
    }
    """

    out_path = os.path.join("scripts/assets/diagrams", "uml_erd.png")
    p = subprocess.run(["dot", "-Tpng", "-Gdpi=300"], input=dot_erd.encode(), stdout=subprocess.PIPE, check=True)
    with open(out_path, "wb") as f:
        f.write(p.stdout)
    print(f"Generated Real High-Res UML Diagram: {out_path} ({len(p.stdout)} bytes)")

if __name__ == "__main__":
    generate_uml_diagrams()
