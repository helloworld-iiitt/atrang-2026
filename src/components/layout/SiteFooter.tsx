import Link from "next/link";
import { FEST, NAV_ITEMS } from "@/lib/constants";
import { AtrangLogo } from "../branding/AtrangLogo";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t-2 border-black bg-[rgb(10_10_14/0.9)] shadow-[inset_0_2px_0_rgb(255_255_255/0.06)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-3">
          <AtrangLogo size="sm" decorative />
          <p className="font-pixel text-sm tracking-wider text-bone uppercase">
            {FEST.name} {FEST.edition} · {FEST.college}
          </p>
        </div>
        <div className="grid content-start gap-3 md:justify-items-end">
          <nav aria-label="Footer" className="flex gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-pixel text-sm tracking-wider text-bone uppercase hover:text-splash"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs leading-relaxed text-mist/80 md:text-right">
            A Minecraft-inspired fan design. Not affiliated with Mojang Studios or Microsoft.
            <br />
            Web-Dev Club © {FEST.edition.slice(0, 4)} {FEST.college}
          </p>
        </div>
      </div>
    </footer>
  );
}
