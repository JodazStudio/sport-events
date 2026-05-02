import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Eventos",
  description: "Administra todos tus eventos deportivos.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
