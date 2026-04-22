"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle2, XCircle, RefreshCw, Loader2, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export function TelegramSettings() {
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const generateCode = async () => {
    if (!session) return;
    try {
      setGenerating(true);
      const response = await fetch('/api/telegram/generate-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await response.json();
      if (data.code) {
        setVerificationCode(data.code);
        toast.success("Código generado con éxito");
      } else {
        toast.error("Error al generar código");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const isLinked = !!profile?.telegram_chat_id;

  return (
    <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card overflow-hidden">
      <CardHeader className="bg-primary/10 border-b-2 border-black dark:border-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black dark:bg-white text-white dark:text-black">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-satoshi font-black italic uppercase text-xl">Notificaciones de Telegram</CardTitle>
            <CardDescription className="font-mono text-[10px] uppercase tracking-wider">
              Recibe alertas instantáneas de inscripciones y pagos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {isLinked ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border-2 border-green-500 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <p className="font-black uppercase italic text-sm">Cuenta Vinculada</p>
                <p className="font-mono text-[10px] uppercase">Tu Telegram está conectado correctamente.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="rounded-none border-2 border-black dark:border-white font-black uppercase italic text-xs h-10 px-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                onClick={() => fetchProfile()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar Estado
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-amber-500/10 border-2 border-amber-500 text-amber-700 dark:text-amber-400">
              <XCircle className="w-6 h-6" />
              <div>
                <p className="font-black uppercase italic text-sm">No Vinculado</p>
                <p className="font-mono text-[10px] uppercase">No estás recibiendo alertas en Telegram.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black uppercase italic text-sm tracking-tight">Pasos para vincular:</h4>
              <ol className="space-y-3 font-mono text-xs uppercase list-decimal list-inside text-muted-foreground">
                <li>Haz clic en el botón de abajo para generar tu código único.</li>
                <li>Abre nuestro Bot en Telegram: <a href="https://t.me/zonacrono_bot" target="_blank" className="text-primary font-black underline inline-flex items-center">@zonacrono_bot <ExternalLink className="ml-1 w-3 h-3" /></a></li>
                <li>Envía el comando: <code className="bg-muted px-2 py-1 border border-black/10 font-black text-black dark:text-white">/verificar TU_CODIGO</code></li>
              </ol>
            </div>

            {verificationCode ? (
              <div className="p-6 border-2 border-dashed border-black/20 dark:border-white/20 bg-muted/30 flex flex-col items-center gap-3">
                <p className="font-mono text-[10px] uppercase text-muted-foreground">Tu código de verificación es:</p>
                <p className="text-4xl font-black tracking-[10px] text-primary">{verificationCode}</p>
                <p className="font-mono text-[10px] uppercase text-amber-600">Expira en 15 minutos</p>
              </div>
            ) : (
              <Button 
                onClick={generateCode}
                disabled={generating}
                className="w-full rounded-none border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-black uppercase italic tracking-widest py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {generating ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                Generar Código de Vinculación
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
