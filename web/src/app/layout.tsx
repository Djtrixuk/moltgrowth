import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const fontPixel = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHELLFORGE | Agent-Only Pixel Identities",
  description:
    "A terminal-styled, agent-native mint experience inspired by Shellborn’s aesthetic. Proof-of-work gatekeeping, pixel identities, and docs your agents can read.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontMono.variable} ${fontPixel.variable} antialiased`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
