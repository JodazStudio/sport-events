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
    template: "ZonaCrono | %s",
    default: "ZonaCrono | Software y Promoción para Eventos Deportivos",
  },
  description: "Plataforma tecnológica y servicios de difusión para potenciar inscripciones, gestión de resultados en tiempo real y organización de eventos deportivos de clase mundial.",
  keywords: ["eventos deportivos", "inscripciones online", "gestión de resultados", "software deportivo", "Zonacrono", "organización deportiva"],
  authors: [{ name: "Zonacrono" }],
  creator: "Zonacrono",
  metadataBase: new URL('https://zonacrono.com'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://zonacrono.com",
    title: "Zonacrono | Software y Promoción para Eventos Deportivos",
    description: "Plataforma tecnológica y servicios de difusión para potenciar inscripciones, gestión de resultados en tiempo real y organización de eventos deportivos de clase mundial.",
    siteName: "Zonacrono",
    images: [
      {
        url: "/zonacrono_light.png",
        width: 1200,
        height: 630,
        alt: "Zonacrono Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zonacrono | Software y Promoción para Eventos Deportivos",
    description: "Plataforma tecnológica y servicios de difusión para potenciar inscripciones, gestión de resultados en tiempo real y organización de eventos deportivos de clase mundial.",
    images: ["/zonacrono_light.png"],
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
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/providers/QueryProvider";
import { GoogleAnalytics } from '@next/third-parties/google';
import { env } from "@/lib/env";
import { ChunkErrorListener } from "@/components/common/ChunkErrorListener";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthInitializer>
              {children}
              <SonnerToaster position="top-right" richColors />
            </AuthInitializer>
          </QueryProvider>
        </ThemeProvider>
        {env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
        )}
        <ChunkErrorListener />
      </body>
    </html>
  );
}
