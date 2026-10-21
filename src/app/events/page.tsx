import type { Metadata } from "next";
import { EventsExperience } from "@/components/events/EventsExperience";
import { PageTransition } from "@/components/layout/PageTransition";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ACTIVE_CATEGORIES } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events",
  description: `Explore the world of Atrang 2026–27 — ${ACTIVE_CATEGORIES.join(", ").toLowerCase()} events at IIIT Tiruchirappalli.`,
};

export default function EventsPage() {
  return (
    <>
      <SiteHeader />
      <PageTransition>
        <main id="main" className="flex flex-1 flex-col">
          <EventsExperience />
        </main>
      </PageTransition>
      <SiteFooter />
    </>
  );
}
