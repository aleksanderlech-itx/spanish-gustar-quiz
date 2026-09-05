import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import { cookies, headers } from "next/headers";
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
const CLARITY_PROJECT_ID = "yc2q3b2d9e";

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

// Reads the theme cookie set by app/use-theme.ts so the server can render the
// right attribute up front. localStorage is still the primary source (it's
// read first below) but on a browser that blocks or clears it, this script
// would otherwise have no way to recover the choice and would fall back to
// "light" on every reload — this keeps whatever the server already rendered
// from the cookie instead of clobbering it.
const THEME_PRE_PAINT_SCRIPT = `(function () {
  var html = document.documentElement;
  var serverTheme = html.getAttribute("data-theme");
  var fallback = serverTheme === "light" || serverTheme === "dark"
    ? serverTheme
    : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  var theme = fallback;
  try {
    var stored = localStorage.getItem("spanish-quiz-theme");
    if (stored === "light" || stored === "dark") theme = stored;
  } catch (error) {
    // localStorage unavailable; keep the server-rendered (cookie-derived) theme.
  }
  html.setAttribute("data-theme", theme);
  try {
    document.cookie = "spanish-quiz-theme=" + theme + "; path=/; max-age=31536000; SameSite=Lax";
  } catch (error) {
    // Cookie writes can be blocked too; the DOM attribute above still applies for this load.
  }
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host") ?? "";
  const isProduction = isProductionHost(host);
  const themeCookie = (await cookies()).get("spanish-quiz-theme")?.value;
  const initialTheme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html lang="en" data-theme={initialTheme} suppressHydrationWarning>
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
            <Script id="ms-clarity-init" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
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
