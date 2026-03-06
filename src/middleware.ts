import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next|_static|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // For local development, we often see "tenant.localhost:3000"
  // or just "localhost:3000"
  
  const currentHost = hostname
    .replace(":3000", "")
    .replace(".localhost", "");

  // If the host is just "localhost", "www", or empty, stay on the main landing page
  if (!currentHost || currentHost === "localhost" || currentHost === "www") {
    return NextResponse.next();
  }

  // Treat the first part of the hostname as the tenant ID
  const tenantId = currentHost;

  // Build the rewrite URL path carefully
  // If pathname is '/', we just want '/sites/tenant'
  // If pathname is '/about', we want '/sites/tenant/about'
  const path = url.pathname === "/" ? "" : url.pathname;
  const rewritePath = `/sites/${tenantId}${path}`;

  console.log(`Rewriting ${hostname}${url.pathname} to ${rewritePath}`);

  return NextResponse.rewrite(new URL(rewritePath, req.url));
}
