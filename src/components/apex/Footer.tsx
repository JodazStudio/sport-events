import { Timer } from "lucide-react";

const footerLinks = {
  servicios: [
    "Cronometraje Digital",
    "Inscripciones",
    "Resultados Online",
    "Cronometraje Manual",
    "Logística",
    "Certificación",
  ],
  contacto: [
    { label: "+58 0412 131 5110", href: "tel:+5804121315110" },
    { label: "jesus@jodaz.xyz", href: "mailto:jesus@jodaz.xyz" },
    { label: "Carúpano, Venezuela", href: "#" },
  ],
  legal: [
    "Aviso de Privacidad",
    "Términos y Condiciones",
    "Política de Cookies",
  ],
};

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" strokeWidth={2.5} />
              <span className="font-satoshi text-lg font-black uppercase tracking-tight text-foreground">
                Apex<span className="text-primary">Racing</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-medium">
              Cronometraje profesional de eventos deportivos con tecnología de última
              generación.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-satoshi text-sm font-black uppercase tracking-widest text-foreground">
              Servicios
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link}>
                  <a
                    href="#servicios"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-satoshi text-sm font-black uppercase tracking-widest text-foreground">
              Contacto
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.contacto.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-satoshi text-sm font-black uppercase tracking-widest text-foreground">
              Legal
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary font-medium"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <span className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Apex Racing Live. Todos los derechos reservados.
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Hecho con precisión 🏁
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
