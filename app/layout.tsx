import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import "./issue-5-design.css";
import "./quiz-layout-fix.css";
import "./editorial-polish.css";
import "./activity-chrome.css";
import QuizSelector from "./quiz-selector";
import { SiteFooter } from "./site-footer";
import { SITE_CONFIG } from "./site-config";
import { isProductionHost } from "./is-production-host";

const GA_MEASUREMENT_ID = "G-88HEZL7EKT";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Spanish Quizzes — Gustar, Ser vs Estar and Past-Tense Practice",
    template: "%s | Spanish Quizzes",
  },
  description: SITE_CONFIG.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_CONFIG.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ["/og-image.png"],
  },
  other: {
    "codex-preview": "development",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ede3" },
    { media: "(prefers-color-scheme: dark)", color: "#1f6f6b" },
  ],
};

const THEME_PRE_PAINT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("spanish-quiz-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host") ?? "";
  const isProduction = isProductionHost(host);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${karla.variable} antialiased`}>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: THEME_PRE_PAINT_SCRIPT }} />
        {isProduction && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
        <QuizSelector />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
