import { notFound } from "next/navigation";
import { Metadata } from "next";
import fs from "fs";
import path from "path";

interface TenantData {
  id: string;
  name: string;
  title: string;
  description: string;
  heroImage: string;
  logo: string;
  primaryColor: string;
  registrationLink: string;
  eventDate: string;
  location: string;
  metadata: {
    keywords: string[];
    ogImage: string;
  };
}

function getTenantData(tenantId: string): TenantData | null {
  console.log(`Searching for tenant data for ID: "${tenantId}"`);
  try {
    const filePath = path.join(process.cwd(), "src/data/tenants", `${tenantId}.json`);
    console.log(`Resolved file path: ${filePath}`);
    if (!fs.existsSync(filePath)) {
      console.error(`Tenant file not found at: ${filePath}`);
      return null;
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading tenant data:", error);
    return null;
  }
}

export async function generateMetadata(props: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const params = await props.params;
  const data = getTenantData(params.tenant);
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

export default async function TenantPage(props: { params: Promise<{ tenant: string }> }) {
  const params = await props.params;
  console.log(`Rendering page for tenant: ${params.tenant}`);
  const data = getTenantData(params.tenant);

  if (!data) {
    console.error(`No data found for tenant: ${params.tenant}`);
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ "--primary": data.primaryColor } as any}>
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.heroImage})` }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <img src={data.logo} alt={data.name} className="h-24 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {data.title}
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed text-white">
            {data.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={data.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--primary)] hover:brightness-110 text-white px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Register Now
            </a>
            <div className="flex items-center justify-center gap-2 text-sm bg-black/30 backdrop-blur-md px-6 py-4 rounded-full border border-white/10">
              <span className="font-semibold">{data.eventDate}</span>
              <span className="opacity-50">|</span>
              <span>{data.location}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-black">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-[var(--primary)]">When</h3>
              <p className="text-gray-600">{data.eventDate}</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-[var(--primary)]">Where</h3>
              <p className="text-gray-600">{data.location}</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-xl mb-4 text-[var(--primary)]">Participation</h3>
              <p className="text-gray-600">Register now to secure your spot and participate in the biggest sport event of the season.</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src={data.logo} alt={data.name} className="h-12 mx-auto mb-6 opacity-80" />
          <p className="text-gray-400">&copy; {new Date().getFullYear()} {data.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
