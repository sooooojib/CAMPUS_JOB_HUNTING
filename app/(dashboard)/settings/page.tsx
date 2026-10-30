import { Save } from "lucide-react";
import { FormTemplate } from "@/components/templates/form-template";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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

export default function SettingsPage() {
  return (
    <FormTemplate
      maxWidth="xl"
      title="Account &amp; Privacy Settings"
      subtitle="Customize your platform profile, private vault security, and notification preferences."
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
      footerActions={
        <Button className="gap-2">
          <Save className="size-4" />
          <span>Save Changes</span>
        </Button>
      }
    >
      <form className="space-y-8">
        {/* Profile Information */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            1. Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Sarah Miller" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Verified Institutional Email</Label>
              <Input id="email" defaultValue="sarah.miller@university.edu" disabled />
              <p className="text-[11px] text-muted-foreground">
                Managed via university registrar identity federation.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="headline">Professional Headline</Label>
            <Input
              id="headline"
              defaultValue="Undergraduate in Computer Science & Engineering • Cloud Systems Focus"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">About Me</Label>
            <Textarea
              id="bio"
              rows={4}
              defaultValue="Third-year Computer Science student passionate about distributed architectures and cloud systems."
            />
          </div>
        </section>

        {/* Privacy & Resume Vault Permissions */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            2. Privacy &amp; Vault Permissions
          </h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-2.5">
              <Checkbox id="searchable" defaultChecked className="mt-0.5" />
              <div>
                <Label htmlFor="searchable" className="text-sm font-semibold cursor-pointer">
                  Visible in Verified Member Directory
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allows enrolled students, alumni, and verified faculty to find your profile in campus networking.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Checkbox id="referralsOpen" defaultChecked className="mt-0.5" />
              <div>
                <Label htmlFor="referralsOpen" className="text-sm font-semibold cursor-pointer">
                  Accept Direct Inquiries &amp; Referral Discussions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Displays the &quot;Open to Discussion&quot; badge on your profile.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Checkbox id="privateVault" defaultChecked disabled className="mt-0.5" />
              <div>
                <Label htmlFor="privateVault" className="text-sm font-semibold">
                  Enforce Time-Limited Signed URLs for Resumes (Permanent Rule)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mandatory platform security standard. Resumes are never accessible via persistent public links.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance & Preferences */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
            3. Appearance &amp; Notifications
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
      </form>
    </FormTemplate>
  );
}
