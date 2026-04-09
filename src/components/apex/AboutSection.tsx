import { CheckCircle } from "lucide-react";

const points = [
  "Tecnología RFID con chips desechables y reutilizables",
  "Resultados en tiempo real publicados al instante",
  "Equipo técnico certificado en eventos internacionales",
  "Cobertura completa desde inscripción hasta resultados",
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
            Somos una empresa dedicada al cronometraje profesional de eventos deportivos.
            Combinamos la última tecnología con un equipo apasionado por el deporte para
            entregar resultados precisos, confiables y en tiempo real.
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
