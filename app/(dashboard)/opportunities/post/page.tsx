import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canPostOpportunity } from "@/lib/permissions";
import { getUserCompanies } from "@/lib/services/company";
import { getOpportunityById } from "@/lib/services/opportunity";
import { FormTemplate } from "@/components/templates/form-template";
import { OpportunityForm } from "@/components/opportunities/opportunity-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Publish Career Opportunity",
  description: "Submit a verified internship, full-time job, or research position to the university community.",
};

interface PageProps {
  searchParams: Promise<{ editId?: string }>;
}

export default async function PostOpportunityPage({ searchParams }: PageProps) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect("/login?callbackUrl=/opportunities/post");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const userCanPost = canPostOpportunity(user);
  const memberships = await getUserCompanies(user.id);
  const managedCompanies = memberships.map((m) => m.company);

  const { editId } = await searchParams;
  let existingOpportunity = null;

  if (editId) {
    try {
      existingOpportunity = await getOpportunityById(editId, user.id);
    } catch (e) {
      console.error("Could not load opportunity for editing:", e);
    }
  }

  return (
    <FormTemplate
      maxWidth="xl"
      title={editId ? "Edit Career Opportunity" : "Publish Career Opportunity"}
      subtitle={
        editId
          ? "Update details and resubmit for institutional verification."
          : "All submissions undergo institutional review by University Career Services before appearing in public member feeds."
      }
      breadcrumbs={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/opportunities">Opportunities</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {editId ? "Edit Opening" : "Publish Opening"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <OpportunityForm
        canPost={userCanPost}
        userMembershipType={user.membershipType}
        managedCompanies={managedCompanies}
        existingOpportunity={existingOpportunity}
      />
    </FormTemplate>
  );
}
