"use client";

import { Menu, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { openPanel } from "@/lib/ui-store";
import { cn } from "@/lib/utils";
import { AtrangLogo } from "../branding/AtrangLogo";
import { MinecraftButton } from "../minecraft/MinecraftButton";
import { MusicToggle } from "../ui/MusicToggle";
import { SoundToggle } from "../ui/SoundToggle";

const linkClass = (active: boolean) =>
  cn(
    "font-pixel relative px-3 py-2 text-sm tracking-[0.12em] uppercase text-shadow-pixel transition-colors",
    "hover:text-splash focus-visible:text-splash",
    active
      ? "text-gold after:absolute after:inset-x-3 after:-bottom-0.5 after:h-1 after:bg-gold after:shadow-[0_2px_0_#000]"
      : "text-bone",
  );

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu when this page is hidden by a navigation.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-[rgb(12_12_16/0.82)] shadow-[inset_0_-2px_0_rgb(255_255_255/0.06)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Atrang home" className="shrink-0 p-1">
          <AtrangLogo size="sm" decorative />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(active)}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <button type="button" className={linkClass(false)} onClick={() => openPanel("about")}>
            About
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <MusicToggle />
          <SoundToggle />
          <MinecraftButton
            variant="slate"
            size="icon"
            breakEffect={false}
            onActivate={() => openPanel("settings")}
            aria-label="Open settings"
            className="hidden md:inline-flex"
          >
            <Settings className="size-5" strokeWidth={2.5} />
          </MinecraftButton>
          <MinecraftButton
            variant="slate"
            size="icon"
            breakEffect={false}
            onActivate={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden"
          >
            {open ? <X className="size-5" strokeWidth={3} /> : <Menu className="size-5" strokeWidth={3} />}
          </MinecraftButton>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t-2 border-black md:hidden"
          >
            <div className="grid gap-2 p-4">
              {NAV_ITEMS.map((item) => (
                <MinecraftButton
                  key={item.href}
                  href={item.href}
                  fullWidth
                  breakEffect={false}
                  variant={pathname === item.href ? "grass" : "stone"}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </MinecraftButton>
              ))}
              <div className="grid grid-cols-2 gap-2">
                <MinecraftButton
                  breakEffect={false}
                  onActivate={() => {
                    setOpen(false);
                    openPanel("about");
                  }}
                >
                  About
                </MinecraftButton>
                <MinecraftButton
                  breakEffect={false}
                  onActivate={() => {
                    setOpen(false);
                    openPanel("settings");
                  }}
                >
                  Settings
                </MinecraftButton>
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
