import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Experience } from "@/components/experience/Experience";
import { site } from "@/lib/site";

const archivo = localFont({
  src: "./fonts/Archivo-wdth.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  preload: true,
});
const geist = localFont({ src: "./fonts/Geist-Variable.woff2", variable: "--font-geist", weight: "100 900", display: "swap" });
const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, title: site.title, description: site.description, url: "/" },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090A0D",
  colorScheme: "dark",
};

/**
 * Runs before paint. Content is visible by default; these classes only opt INTO motion:
 *  - `motion`      prefers-reduced-motion is not set
 *  - `first-visit` first page view this session → preloader veil (CSS failsafe hides it after 4.5s)
 */
const bootScript = `(function(){try{var d=document.documentElement;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('motion');
if(!('WebGL2RenderingContext' in window))return;
d.classList.add('webgl');
if(!sessionStorage.getItem('k-visited')&&location.pathname==='/')d.classList.add('first-visit');
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="label fixed left-4 top-4 z-[70] -translate-y-24 rounded-pill bg-lime px-4 py-3 text-obsidian transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Experience />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="relative z-10 outline-none">
          {children}
        </main>
        <SiteFooter />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
