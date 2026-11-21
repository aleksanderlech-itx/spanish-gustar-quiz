import type { Metadata } from "next";
import SiteHeader from "../site-header";
import ActivitiesEditor from "./activities-editor";

export const metadata: Metadata = {
  title: "Your activities",
  description: "Choose which activities are on your board.",
  // A per-device settings screen: nothing here for search engines (decision 0008).
  robots: { index: false, follow: false },
  alternates: { canonical: "/activities" },
};

export default function ActivitiesPage() {
  return (
    <main className="app-shell activity-selection-page">
      <SiteHeader />
      <ActivitiesEditor />
    </main>
  );
}
