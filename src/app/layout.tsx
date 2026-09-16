import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://novel.example.com"),
  title: {
    default: "NOVEL — Beautiful Things for a Considered Home",
    template: "%s — NOVEL",
  },
  description:
    "NOVEL is a premium home and lifestyle brand — kitchen essentials, macramé, rugs, tableware and textiles for a considered home.",
  openGraph: {
    title: "NOVEL — Beautiful Things for a Considered Home",
    description:
      "Premium kitchen, macramé, rugs, tableware and textiles for a considered home.",
    siteName: "NOVEL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVEL — Beautiful Things for a Considered Home",
    description:
      "Premium kitchen, macramé, rugs, tableware and textiles for a considered home.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ivory text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
