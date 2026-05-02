import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control de Pagos",
  description: "Verifica y aprueba los pagos de las inscripciones.",
};

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
