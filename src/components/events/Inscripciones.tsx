import { Button, Card, CardContent } from "@/components/ui";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";

export const Inscripciones = () => {
  return (
    <section id="inscripciones" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Inscripciones
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Asegura tu plaza en la II Carrera Popular Santa Rosa de Lima
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Registration Info Card */}
          <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Fecha de Apertura</h3>
              </div>
              <p className="text-3xl font-black text-primary mb-4">31 de Mayo 2025</p>
              <p className="text-muted-foreground mb-6">
                Las inscripciones se abrirán el 31 de mayo a las 00:00h. ¡No te quedes sin tu dorsal!
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Inscripción online disponible 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Confirmación inmediata por email</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Plazas limitadas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Card */}
          <Card className="border-2 border-secondary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-card to-secondary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Precio</h3>
              </div>
              <div className="mb-4">
                <span className="text-5xl font-black text-secondary">10€</span>
              </div>
              <p className="text-muted-foreground mb-6">
                Precio único que incluye chip de cronometraje, seguro deportivo y camiseta conmemorativa.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Chip de cronometraje incluido</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Camiseta técnica oficial</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span>Seguro de accidentes deportivos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-card rounded-3xl p-12 max-w-3xl mx-auto border border-primary/10">
          <Clock className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Inscripciones Online
          </h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Apúntate cómodamente desde casa. El proceso es rápido y sencillo.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-cta hover:opacity-90 transition-opacity text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Inscríbete Ahora
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Apertura: 31 de mayo de 2025
          </p>
        </div>
      </div>
    </section>
  );
};
