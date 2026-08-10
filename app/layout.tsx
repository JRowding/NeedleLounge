import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000"),
  title: "The Needle Lounge | Piercing & Tattoo in Shrewsbury",
  description: "The Needle Lounge and Fletcher Tattoos — considered piercing, curated jewellery and original tattoo work in the heart of Shrewsbury.",
  openGraph: {
    title: "The Needle Lounge | Piercing + Tattoo",
    description: "Two crafts. One independent Shrewsbury studio.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "The Needle Lounge — piercing and tattoo in Shrewsbury" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
