import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { TenantData } from "@/types/tenant";
import EventHubTemplate from "@/components/event-hub/EventHubTemplate";

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

  return <EventHubTemplate tenant={data} />;
}
