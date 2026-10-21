import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { MinecraftButton } from "@/components/minecraft/MinecraftButton";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PageTransition>
      <main
        id="main"
        className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <h1 className="font-pixel text-[clamp(2rem,7vw,4.5rem)] leading-tight font-bold text-bone text-shadow-pixel-lg">
          You fell out of the world!
        </h1>
        <p className="font-pixel text-xl text-bone text-shadow-pixel">
          Score: <span className="text-splash">404</span>
        </p>
        <p className="max-w-md text-bone/90 text-shadow-pixel">
          This page doesn&apos;t exist — or a creeper got to it first. Respawn and try another path.
        </p>
        <div className="mt-4 grid w-full max-w-sm gap-3">
          <MinecraftButton href="/" variant="grass" size="lg" fullWidth>
            Respawn
          </MinecraftButton>
          <MinecraftButton href="/events" fullWidth>
            Explore events
          </MinecraftButton>
        </div>
      </main>
    </PageTransition>
  );
}
