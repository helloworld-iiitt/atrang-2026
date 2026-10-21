import { HomeHero } from "@/components/home/HomeHero";
import { PageTransition } from "@/components/layout/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <HomeHero />
    </PageTransition>
  );
}
