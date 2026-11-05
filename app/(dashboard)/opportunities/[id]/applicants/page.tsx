import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { assertCanManageApplicantsForOpportunity } from "@/lib/services/application";
import { EmployerApplicantManager } from "@/components/applications/employer-applicant-manager";

export const metadata = {
  title: "Applicant Management",
  description: "Manage candidate dossiers and recruitment pipeline stages.",
};

export default async function OpportunityApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session?.user) {
    redirect(`/login?callbackUrl=/opportunities/${id}/applicants`);
  }

  let opportunityData;
  try {
    opportunityData = await assertCanManageApplicantsForOpportunity(
      id,
      session.user.id,
      (session.user as any).systemRole
    );
  } catch {
    // If user is not authorized to manage applicants for this opportunity
    redirect(`/opportunities/${id}?error=unauthorized_applicant_management`);
  }

  const { opportunity, company } = opportunityData;

  return (
    <div className="space-y-6">
      <EmployerApplicantManager
        opportunityId={opportunity.id}
        opportunityTitle={opportunity.title}
        companyName={company?.name || opportunity.companyName}
      />
    </div>
  );
}

