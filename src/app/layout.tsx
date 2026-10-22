import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AboutModal } from "@/components/home/AboutModal";
import { AppProviders } from "@/components/layout/AppProviders";
import { BlockParticleBurst } from "@/components/minecraft/BlockParticleBurst";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SettingsModal } from "@/components/ui/SettingsModal";
import { WorldBackground } from "@/components/world/WorldBackground";
import { FEST, SITE_URL } from "@/lib/constants";
import "./globals.css";

// Fonts are bundled (SIL Open Font License) so builds need no access to Google Fonts.
const pixel = localFont({
  src: "./fonts/PixelifySans-Variable.woff2",
  weight: "400 700",
  variable: "--font-pixelify",
  display: "swap",
});
const sans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist",
  display: "swap",
});

const TITLE = `${FEST.name} ${FEST.edition} · ${FEST.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${FEST.name} ${FEST.edition}` },
  description: FEST.description,
  openGraph: {
    title: TITLE,
    description: FEST.description,
    type: "website",
    siteName: `${FEST.name} ${FEST.edition}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1222",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pixel.variable} ${sans.variable}`}>
      <body className="antialiased">
        <AppProviders>
          <a
            href="#main"
            className="font-pixel fixed top-3 left-3 z-[110] -translate-y-24 border-2 border-black bg-gold px-4 py-2 text-ink focus:translate-y-0"
          >
            Skip to content
          </a>
          <WorldBackground />
          <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
          <AboutModal />
          <SettingsModal />
          <BlockParticleBurst />
          <LoadingScreen />
          <div aria-hidden className="crack-preload" />
        </AppProviders>
      </body>
    </html>
  );
}
