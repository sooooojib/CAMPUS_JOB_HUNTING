import { Plus, Search, ShieldCheck } from "lucide-react";
import { ListingTemplate } from "@/components/templates/listing-template";
import { ReferralCard } from "@/components/community/referral-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata = {
  title: "Alumni Referrals",
  description: "Connect with verified university alumni for job referrals at leading technology and enterprise organizations.",
};

const SAMPLE_REFERRALS = [
  {
    id: "ref-1",
    candidateName: "Sarah Chen (Alumna Sponsor)",
    targetCompany: "Stripe",
    targetRole: "Backend & Systems Software Engineer",
    pitch: "Sponsoring up to 3 candidates with strong systems programming background or Go experience for Stripe Dublin & Seattle teams.",
    department: "Computer Science",
    graduationYear: 2022,
    status: "OPEN" as const,
  },
  {
    id: "ref-2",
    candidateName: "Alex Rivera (Alumnus Sponsor)",
    targetCompany: "Microsoft",
    targetRole: "Azure Infrastructure & Kubernetes Roles",
    pitch: "Happy to connect and review portfolios for senior students interested in Azure cloud compute and distributed infrastructure.",
    department: "Computer Engineering",
    graduationYear: 2018,
    status: "OPEN" as const,
  },
];

export default function ReferralsPage() {
  return (
    <ListingTemplate
      title="Alumni Referral Hub"
      subtitle="Exclusive internal referrals sponsored by university alumni at leading companies."
      primaryAction={
        <Button className="gap-2">
          <Plus className="size-4" />
          <span>Offer a Referral (Alumni)</span>
        </Button>
      }
      searchFilterBar={
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by company or role keyword..."
              className="pl-9 bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="ALL">
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Companies</SelectItem>
                <SelectItem value="STRIPE">Stripe</SelectItem>
                <SelectItem value="MICROSOFT">Microsoft</SelectItem>
                <SelectItem value="GOOGLE">Google Cloud</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="OPEN">
              <SelectTrigger className="w-[140px] bg-card">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open Slots</SelectItem>
                <SelectItem value="ALL">All Referrals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      activeFiltersBar={
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="secondary" className="gap-1 text-xs">
            <ShieldCheck className="size-3 text-amber-500" />
            <span>Verified Alumni Sponsorship Only</span>
          </Badge>
          <span className="text-xs text-muted-foreground">42 active opportunities</span>
        </div>
      }
    >
      <div className="space-y-4">
        {SAMPLE_REFERRALS.map((referral) => (
          <ReferralCard key={referral.id} {...referral} />
        ))}
      </div>
    </ListingTemplate>
  );
}
