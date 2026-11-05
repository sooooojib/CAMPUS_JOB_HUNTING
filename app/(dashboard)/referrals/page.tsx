import Link from "next/link";
import { Users, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ListingTemplate } from "@/components/templates/listing-template";
import { ReferralsHubView } from "@/components/referrals/referrals-hub-view";

export const metadata = {
  title: "Alumni & Member Referrals Hub",
  description:
    "Connect with verified university alumni and industry partners for trusted career referrals and internal job recommendations.",
};

export default function ReferralsPage() {
  return (
    <ListingTemplate
      title="Alumni & Member Referral Hub"
      subtitle="Exclusive internal referrals sponsored by university alumni and vetted industry partners."
      primaryAction={
        <Link
          href="/community"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          <Users className="size-3.5 mr-1.5" />
          <span>Find Members to Request a Referral</span>
          <ExternalLink className="size-3.5 ml-1" />
        </Link>
      }
    >
      <ReferralsHubView />
    </ListingTemplate>
  );
}
