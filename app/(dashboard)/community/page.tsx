import Link from "next/link";
import { MessageSquare, ArrowRight, UserCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ListingTemplate } from "@/components/templates/listing-template";
import { MemberDirectoryView } from "@/components/community/member-directory-view";

export const metadata = {
  title: "Member Directory & Campus Network",
  description:
    "Explore the verified university ecosystem across students, alumni, faculty, staff, and enterprise hiring partners.",
};

export default function CommunityPage() {
  return (
    <ListingTemplate
      title="Member Directory & Campus Network"
      subtitle="Discover and connect with verified members across the university ecosystem."
      primaryAction={
        <div className="flex items-center gap-2">
          <Link
            href="/feed"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            <MessageSquare className="size-3.5 mr-1.5" />
            <span>Community Feed</span>
            <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </div>
      }
    >
      <MemberDirectoryView />
    </ListingTemplate>
  );
}
