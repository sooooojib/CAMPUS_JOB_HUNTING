import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FormTemplate } from "@/components/templates/form-template";
import { SettingsProfileForm } from "@/components/settings/settings-profile-form";
import { AcademicRecordsCard } from "@/components/settings/academic-records-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Profile",
  description: "Manage your personal identity, academic records, and university profile.",
};

export default async function SettingsPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      academicRecords: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const membershipLabel = (user.membershipType || "MEMBER").replace("_", " ");

  return (
    <FormTemplate
      maxWidth="xl"
      title="Profile"
      subtitle={`Manage your personal identity (${membershipLabel}), academic CGPA records, and university profile.`}
      breadcrumbs={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/feed">Community</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <div className="space-y-10">
        {/* Dynamic Personal Profile Form */}
        <SettingsProfileForm
          user={{
            name: user.name,
            email: user.email,
            membershipType: user.membershipType,
            headline: user.profile?.headline,
            bio: user.profile?.bio,
            department: user.profile?.department,
            company: user.profile?.company,
            designation: user.profile?.designation,
            graduationYear: user.profile?.graduationYear,
            showEmail: user.profile?.showEmail,
            linkedinUrl: user.profile?.linkedinUrl,
            githubUrl: user.profile?.githubUrl,
          }}
        />

        {/* Academic & CGPA Information Section */}
        <AcademicRecordsCard
          initialRecords={user.academicRecords.map((r) => ({
            id: r.id,
            semester: r.semester,
            gpa: r.gpa,
            credits: r.credits,
            academicYear: r.academicYear,
            notes: r.notes,
            isVerified: r.isVerified,
          }))}
          initialCgpa={user.profile?.currentCgpa}
          membershipType={user.membershipType}
        />
      </div>
    </FormTemplate>
  );
}
