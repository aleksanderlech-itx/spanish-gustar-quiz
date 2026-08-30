import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProductionHost } from "./app/is-production-host";
import { SITE_CONFIG } from "./app/site-config";
import { QUIZ_SLUGS } from "./app/quiz-config";

const SITEMAP_PATHS = ["/", "/how-to-use", ...Object.values(QUIZ_SLUGS).map((slug) => `/${slug}`)];

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const production = isProductionHost(host);

  if (request.nextUrl.pathname === "/robots.txt") {
    const body = production
      ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_CONFIG.url}/sitemap.xml\n`
      : "User-agent: *\nDisallow: /\n";
    return new NextResponse(body, { headers: { "Content-Type": "text/plain" } });
  }

  if (request.nextUrl.pathname === "/sitemap.xml") {
    // Only the production host is meant to be indexed at all (see robots.txt above),
    // so a non-production sitemap would just advertise URLs Google is told to skip.
    if (!production) return new NextResponse("Not found", { status: 404 });
    const urls = SITEMAP_PATHS.map((path) => `  <url><loc>${SITE_CONFIG.url}${path}</loc></url>`).join("\n");
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    return new NextResponse(body, { headers: { "Content-Type": "application/xml" } });
  }

  const response = NextResponse.next();
  if (!production) {
    // Belt-and-suspenders alongside robots.txt: this also stops pages already
    // crawled via a shared link from staying indexed, which Disallow alone can't do.
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}

export const config = {
  matcher: "/:path*",
};
