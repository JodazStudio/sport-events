import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resumen",
  description: "Resumen general de tu actividad en ZonaCrono.",
};

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
