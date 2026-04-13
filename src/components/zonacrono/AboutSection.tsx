import { CheckCircle } from "lucide-react";

const points = [
  "Plataforma integral de inscripciones y pagos",
  "Publicación inmediata de resultados en tiempo real",
  "Promoción de tu evento para maximizar asistencia",
  "Software en la nube accesible desde cualquier dispositivo",
];

const AboutSection = () => {
  return (
    <section id="nosotros" className="relative py-24 blueprint-grid">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 border bg-card px-4 py-1.5">
            <span className="h-2 w-2 bg-primary" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Quiénes Somos
            </span>
          </div>

          <h2 className="font-satoshi text-4xl font-black leading-tight text-foreground md:text-5xl">
            TECNOLOGÍA Y PASIÓN
            <br />
            <span className="text-primary">POR EL DEPORTE</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Somos profesionales dedicados a la gestión y promoción de eventos deportivos.
            Combinamos software avanzado con un equipo experto para entregarte la mejor
            plataforma de inscripciones, difusión y resultados en tiempo real.
          </p>

          {/* Bullet points */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 border-l-4 border-primary bg-card p-4 transition-transform hover:translate-x-1"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm leading-relaxed text-foreground">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
