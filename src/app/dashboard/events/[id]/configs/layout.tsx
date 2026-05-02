import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración del Evento",
  description: "Ajustes detallados del evento deportivo.",
};

export default function EventConfigsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
