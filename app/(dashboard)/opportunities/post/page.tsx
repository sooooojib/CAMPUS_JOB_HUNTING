import { Suspense } from "react";
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
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Share Opportunity | UniCareer",
  description: "Share verified internships and career openings directly with Jagannath University students and alumni.",
};

interface PageProps {
  searchParams?: Promise<{ editId?: string }>;
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

  // Only members with posting clearance (verified Students, Alumni, Admin) can post opportunities
  if (!canPostOpportunity(user)) {
    redirect("/opportunities");
  }

  const userCanPost = true;
  let managedCompanies: Array<{ id: string; name: string; logo?: string | null; location?: string | null }> = [];
  try {
    const memberships = await getUserCompanies(user.id);
    managedCompanies = memberships.map((m) => ({
      id: m.company.id,
      name: m.company.name,
      logo: m.company.logo,
      location: m.company.location,
    }));
  } catch (err) {
    console.error("Could not fetch user companies:", err);
  }

  const sp = searchParams ? await searchParams : {};
  const editId = sp?.editId;
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
      title={editId ? "Edit Career Opportunity" : "Share a Career Opportunity"}
      subtitle={
        editId
          ? "Update the role details and resubmit for student access."
          : "Share verified internships and career openings directly with Jagannath University students and alumni."
      }
      breadcrumbs={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/feed">Feed</BreadcrumbLink>
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
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-12 text-sm text-muted-foreground gap-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p>Loading opportunity form...</p>
          </div>
        }
      >
        <OpportunityForm
          editId={editId}
          canPost={userCanPost}
          userMembershipType={user.membershipType}
          managedCompanies={managedCompanies}
          existingOpportunity={existingOpportunity}
        />
      </Suspense>
    </FormTemplate>
  );
}
