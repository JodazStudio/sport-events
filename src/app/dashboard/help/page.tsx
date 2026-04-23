import { Metadata } from "next";
import { HelpView } from "@/components/dashboard/help-view";

export const metadata: Metadata = {
  title: "Ayuda | Zonacrono",
  description: "Centro de ayuda y documentación técnica de Zonacrono.",
};

export default function HelpPage() {
  return <HelpView />;
}
