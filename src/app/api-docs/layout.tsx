import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Documentación técnica de la API de ZonaCrono.",
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
