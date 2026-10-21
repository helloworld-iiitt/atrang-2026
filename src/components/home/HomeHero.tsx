import { FEST } from "@/lib/constants";
import { AtrangLogo } from "../branding/AtrangLogo";
import { SplashText } from "../branding/SplashText";
import { MusicToggle } from "../ui/MusicToggle";
import { SoundToggle } from "../ui/SoundToggle";
import { MainMenu } from "./MainMenu";

export function HomeHero() {
  return (
    <main id="main" className="relative flex min-h-dvh flex-1 flex-col overflow-x-clip">
      <div className="absolute top-4 right-4 z-10 flex gap-2 sm:top-6 sm:right-6">
        <MusicToggle />
        <SoundToggle />
      </div>

      <section
        aria-labelledby="home-title"
        className="flex flex-1 flex-col items-center justify-center gap-9 px-4 pt-16 pb-10 sm:gap-12"
      >
        <div className="relative flex flex-col items-center text-center">
          <div className="relative">
            <h1 id="home-title">
              <span className="sr-only">
                {FEST.name} {FEST.edition} — {FEST.tagline}
              </span>
              <AtrangLogo size="hero" decorative className="drop-shadow-[0_12px_24px_rgb(0_0_0/0.45)]" />
            </h1>
            <SplashText className="absolute right-[-2%] bottom-[-6%] text-xs sm:right-[-4%] sm:bottom-[-2%]" />
          </div>
          <p className="font-pixel mt-6 text-[clamp(0.68rem,2.5vw,1.25rem)] tracking-[0.1em] text-bone uppercase text-shadow-pixel sm:tracking-[0.22em]">
            {FEST.tagline}
          </p>
          <p className="font-pixel mt-3 inline-flex items-center gap-2 border-2 border-black bg-black/45 px-3 py-1 text-sm tracking-[0.3em] text-gold shadow-[inset_2px_2px_0_rgb(255_255_255/0.08)]">
            <span aria-hidden className="inline-block size-2 bg-gold" />
            {FEST.edition} EDITION
            <span aria-hidden className="inline-block size-2 bg-gold" />
          </p>
        </div>

        <MainMenu />
      </section>

      <footer className="font-pixel flex flex-col items-center justify-between gap-1 px-4 pb-4 text-xs tracking-wider text-bone/85 text-shadow-pixel sm:flex-row sm:px-6 sm:text-sm">
        <span>
          {FEST.name} {FEST.edition}
        </span>
        <span className="text-splash/90">{FEST.motto}</span>
        <span>© {FEST.college}</span>
      </footer>
    </main>
  );
}
