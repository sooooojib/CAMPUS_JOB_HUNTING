import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { MyOpportunitiesView } from "@/components/opportunities/my-opportunities-view";

export const metadata = {
  title: "My Opportunities",
  description: "Manage your posted career openings, drafts, and review statuses.",
};

export default async function MyOpportunitiesPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect("/login?callbackUrl=/opportunities/my");
  }

  return <MyOpportunitiesView />;
}
