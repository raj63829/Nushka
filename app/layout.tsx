import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// ✅ Import Geist fonts only once, from "geist/font/*"
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: "rajshah2002/nushka",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
