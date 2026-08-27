import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProductionHost } from "./app/is-production-host";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const production = isProductionHost(host);

  if (request.nextUrl.pathname === "/robots.txt") {
    const body = production ? "User-agent: *\nAllow: /\n" : "User-agent: *\nDisallow: /\n";
    return new NextResponse(body, { headers: { "Content-Type": "text/plain" } });
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
