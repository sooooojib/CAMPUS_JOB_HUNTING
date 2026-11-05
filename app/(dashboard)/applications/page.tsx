import { MyApplicationsView } from "@/components/applications/my-applications-view";

export const metadata = {
  title: "My Applications",
  description: "Track your university career and internship applications, statuses, and resume submissions.",
};

export default function ApplicationsPage() {
  return <MyApplicationsView />;
}
