import { Metadata } from "next";
import EventsPageContent from "./EventsPageContent";

export const metadata: Metadata = {
  title: "Eventos | Zonacrono",
  description: "Explora todos los eventos deportivos gestionados por Zonacrono. Carreras, triatlones, ciclismo y más.",
};

export default function EventsPage() {
  return <EventsPageContent />;
}
