import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Zonacrono",
    default: "Zonacrono | Software y Promoción para Eventos Deportivos",
  },
  description: "Plataforma tecnológica y servicios de difusión para potenciar inscripciones, gestión de resultados en tiempo real y organización de eventos deportivos de clase mundial.",
  keywords: ["eventos deportivos", "inscripciones online", "gestión de resultados", "software deportivo", "Zonacrono", "organización deportiva"],
  authors: [{ name: "Zonacrono" }],
  creator: "Zonacrono",
  metadataBase: new URL('https://zonacrono.com'),
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://zonacrono.com",
    title: "Zonacrono | Software y Promoción para Eventos Deportivos",
    description: "Plataforma tecnológica y servicios de difusión para potenciar inscripciones, gestión de resultados en tiempo real y organización de eventos deportivos de clase mundial.",
    siteName: "Zonacrono",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zonacrono | Software y Promoción para Eventos Deportivos",
    description: "Plataforma tecnológica y servicios de difusión para potenciar inscripciones, gestión de resultados en tiempo real y organización de eventos deportivos de clase mundial.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { AuthInitializer } from "@/components/auth";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer>
          {children}
          <SonnerToaster position="top-right" richColors />
        </AuthInitializer>
      </body>
    </html>
  );
}
