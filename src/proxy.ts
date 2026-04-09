import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next|_static|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Extract the subdomain/tenant part
  const currentHost = hostname
    .replace(":3000", "")
    .replace(".localhost", "");

  // If the host is just "localhost", "www", or empty, stay on the main site
  if (!currentHost || currentHost === "localhost" || currentHost === "www") {
    // Also prevent direct access to /sites (now moved to [event])
    if (url.pathname.startsWith("/sites")) {
      const newPath = url.pathname.replace("/sites/", "/");
      return NextResponse.redirect(new URL(newPath, req.url));
    }
    return NextResponse.next();
  }

  // Treat the subdomain as the event slug and redirect to the subpath
  // e.g., santarosa.localhost:3000/ -> localhost:3000/santarosa
  const eventSlug = currentHost;
  const path = url.pathname === "/" ? "" : url.pathname;
  
  // Create the new URL
  const redirectUrl = new URL(`/${eventSlug}${path}`, req.url);
  
  // If we are on a subdomain (e.g., event.domain.com), 
  // we want to redirect to domain.com/event
  // Strip the subdomain (eventSlug + dot) from the host
  const mainHost = hostname.replace(`${eventSlug}.`, "");
  redirectUrl.host = mainHost;

  console.log(`Redirecting subdomain ${hostname}${url.pathname} to ${redirectUrl.toString()}`);

  return NextResponse.redirect(redirectUrl);
}
