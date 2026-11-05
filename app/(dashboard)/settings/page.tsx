import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FormTemplate } from "@/components/templates/form-template";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NotificationPreferencesCard } from "@/components/settings/notification-preferences-card";
import { SessionSecurityCard } from "@/components/settings/session-security-card";
import { SettingsProfileForm } from "@/components/settings/settings-profile-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Account & Privacy Settings",
  description: "Manage your profile details, privacy preferences, and notification options.",
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
    include: { profile: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <FormTemplate
      maxWidth="xl"
      title="Account & Privacy Settings"
      subtitle={`Manage your personal identity (${user.membershipType.replace("_", " ")}), notification channels, and active security session.`}
      breadcrumbs={
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <div className="space-y-8">
        {/* Dynamic Profile & Role Settings Form */}
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

        {/* Appearance Settings */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            4. Appearance &amp; Interface
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
            <div>
              <h4 className="text-sm font-bold text-foreground">Theme Preference</h4>
              <p className="text-xs text-muted-foreground">
                Toggle between Light, Dark, or System synchronization.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            5. Notification Channels &amp; Preferences
          </h3>
          <p className="text-xs text-muted-foreground">
            Configure how and when you receive in-app alerts and email notifications across the platform.
          </p>
          <NotificationPreferencesCard />
        </section>

        {/* Active Session & Security */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            6. Active Session &amp; Device Security
          </h3>
          <p className="text-xs text-muted-foreground">
            Terminate your active credentials across this browser and clear all session tokens.
          </p>
          <SessionSecurityCard />
        </section>
      </div>
    </FormTemplate>
  );
}
