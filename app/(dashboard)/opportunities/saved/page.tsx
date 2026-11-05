import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { OpportunitiesBrowser } from "@/components/opportunities/opportunities-browser";

export const metadata = {
  title: "Saved Opportunities",
  description: "View and manage your bookmarked career opportunities and internships.",
};

export default async function SavedOpportunitiesPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect("/login?callbackUrl=/opportunities/saved");
  }

  return <OpportunitiesBrowser />;
}

