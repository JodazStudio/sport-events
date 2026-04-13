import {
  ClipboardList,
  BarChart3,
  Megaphone,
} from "lucide-react";

const services = [
  {
    icon: ClipboardList,
    title: "Plataforma de Inscripción",
    description:
      "Portal online completo para registro de participantes, categorías y métodos de pago integrados.",
  },
  {
    icon: BarChart3,
    title: "Gestión de Resultados",
    description:
      "Centralización y publicación de resultados en tiempo real accesibles desde cualquier dispositivo.",
  },
  {
    icon: Megaphone,
    title: "Difusión y Promoción",
    description:
      "Estrategias de marketing y promoción para destacar tu evento y llegar a más atletas.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 border px-4 py-1.5">
            <span className="h-2 w-2 bg-primary" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Servicios
            </span>
          </div>
          <h2 className="font-satoshi text-4xl font-black text-foreground md:text-5xl">
            SOLUCIONES{" "}
            <span className="text-primary">INTEGRALES</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Todo lo que necesitas para potenciar y organizar tu evento de clase mundial.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative border-l-4 border-l-primary bg-card p-8 transition-colors hover:bg-muted"
            >
              <service.icon
                className="mb-4 h-8 w-8 text-primary transition-transform group-hover:scale-110"
                strokeWidth={1.5}
              />
              <h3 className="font-satoshi text-lg font-black uppercase tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
