import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next|_static|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Extract the host without port
  const currentHost = hostname.replace(":3000", "");

  // Define known root domains (including Vercel's default)
  const isVercel = currentHost.endsWith("vercel.app");
  const isLocalhost = currentHost.endsWith("localhost");
  
  // Root domain part count (e.g., zonacrono.com = 2, zonacrono.vercel.app = 3)
  const parts = currentHost.split(".");
  const rootPartCount = isVercel ? 3 : (isLocalhost ? 1 : 2);
  
  // If the host is just the root domain, www, or doesn't have enough parts to be a subdomain
  if (
    !currentHost || 
    parts.length <= rootPartCount || 
    parts[0] === "www"
  ) {
    // Also prevent direct access to /sites (now moved to [event])
    if (url.pathname.startsWith("/sites")) {
      const newPath = url.pathname.replace("/sites/", "/");
      return NextResponse.redirect(new URL(newPath, req.url));
    }
    return NextResponse.next();
  }

  // Treat the first part of the subdomain as the event slug
  // e.g., santarosa.localhost:3000 -> santarosa
  // e.g., santarosa.zonacrono.com -> santarosa
  const eventSlug = parts[0];
  const path = url.pathname === "/" ? "" : url.pathname;
  
  // Create the new URL on the main domain
  const redirectUrl = new URL(`/${eventSlug}${path}`, req.url);
  
  // Strip the subdomain from the host to get the main host
  // e.g., santarosa.zonacrono.com -> zonacrono.com
  const mainHost = currentHost.replace(`${eventSlug}.`, "");
  redirectUrl.host = mainHost;

  console.log(`Redirecting subdomain ${hostname}${url.pathname} to ${redirectUrl.toString()}`);

  return NextResponse.redirect(redirectUrl);
}
