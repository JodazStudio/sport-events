import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { TenantData } from "@/types/tenant";

// Ported Components
import { Navigation } from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { RaceInfo } from "@/components/RaceInfo";
import SponsorsSection from "@/components/SponsorsSection";
import EventDetailsSection from "@/components/EventDetailsSection";
import OrganizersSection from "@/components/OrganizersSection";
import MediaGallery from "@/components/MediaGallery";
import Footer from "@/components/Footer";

function getTenantData(tenantId: string): TenantData | null {
  try {
    const filePath = path.join(process.cwd(), "src/data/tenants", `${tenantId}.json`);
    if (!fs.existsSync(filePath)) return null;
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading tenant data:", error);
    return null;
  }
}

export async function generateMetadata(props: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const params = await props.params;
  const data = getTenantData(params.event);
  if (!data) return { title: "Not Found" };

  return {
    title: data.title,
    description: data.description,
    keywords: data.metadata.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.metadata.ogImage],
    },
  };
}

export default async function EventPage(props: { params: Promise<{ event: string }> }) {
  const params = await props.params;
  const data = getTenantData(params.event);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Navigation data={data} />
      
      <main className="flex-grow flex flex-col w-full">
        <HeroSection data={data} />
        
        <div className="flex flex-col w-full">
          <RaceInfo data={data} />
          <SponsorsSection data={data} />
          <EventDetailsSection data={data} />
          <OrganizersSection data={data} />
          <MediaGallery data={data} previewMode={true} />
        </div>
      </main>

      <Footer data={data} />
    </div>
  );
}
