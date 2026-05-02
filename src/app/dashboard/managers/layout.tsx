import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Managers",
  description: "Administra las cuentas de los organizadores.",
};

export default function ManagersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
