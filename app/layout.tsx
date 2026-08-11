import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Geist_Mono } from "next/font/google";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spanish Gustar Quiz",
  description: "Practise Spanish verbs that work like gustar with present-tense sentences from basic to advanced.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${atkinson.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
