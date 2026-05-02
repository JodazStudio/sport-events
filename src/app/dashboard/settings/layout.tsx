import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Gestiona tus preferencias de ZonaCrono.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
