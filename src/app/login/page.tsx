"use client";

import { useState } from "react";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { Timer, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, Logo, PasswordInput } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { toast } from "sonner";
import { translateAuthError } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state: any) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await login(email, password);

    if (error) {
      toast.error("Error al iniciar sesión", {
        description: translateAuthError(error),
      });
      setLoading(false);
    } else {
      toast.success("¡Bienvenido!", {
        description: "Has iniciado sesión correctamente.",
      });
      router.push("/dashboard/overview");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 lg:p-8 blueprint-grid">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="mb-4 group">
            <Logo 
              width={240} 
              height={55} 
              className="h-[50px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="font-satoshi text-2xl font-black uppercase tracking-tight text-foreground italic">
            Bienvenido de <span className="text-primary">Nuevo</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Ingresa tus credenciales para acceder al panel de gestión.
          </p>
        </div>

        {/* Login Form */}
        <div className="relative group">
          {/* Decorative Borders */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-card border-2 border-border p-8 shadow-2xl space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-1">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@zonacrono.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 focus-visible:ring-primary/20 bg-background rounded-none font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between pl-1">
                  <Label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Contraseña
                  </Label>
                  <Link 
                    href="/forgot-password" 
                    className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-2 focus-visible:ring-primary/20 bg-background rounded-none font-medium"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary text-primary-foreground font-satoshi font-bold uppercase tracking-widest hover:bg-primary/90 transition-all rounded-none gap-2 text-sm italic"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Acceso restringido • Zonacrono v1.0 • 2026
        </p>
      </div>
    </div>
  );
}
