import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Retro Gold Arcade",
  description: "Claim your daily gold in the retro arcade!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-bg text-white min-h-screen font-sans">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
