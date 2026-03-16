import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Octet Project — Chemistry Decoded",
  description:
    "Learn chemistry through interactive 3D molecular visualization and guided lessons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${shareTechMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
