"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { FormInput, FormTextarea, FormSwitch } from "@/components/ui/forms";

export function MediaTab() {
  const { control } = useFormContext();
  return (
    <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
      <CardHeader className="bg-muted/30 border-b-2 border-black dark:border-white">
        <CardTitle className="font-satoshi font-black italic uppercase text-xl">Media y Ruta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <FormInput
          control={control}
          name="banner_url"
          label="URL del Banner"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            control={control}
            name="route_image_url"
            label="URL Mapa de Ruta"
          />
          <FormInput
            control={control}
            name="strava_url"
            label="Link de Strava"
          />
        </div>

        <div className="pt-4 border-t-2 border-black/5 space-y-6">
          <h3 className="font-black italic uppercase text-lg text-primary">Redes Sociales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              control={control}
              name="social_media.instagram"
              label="Instagram URL"
              placeholder="https://instagram.com/..."
            />
            
            <FormInput
              control={control}
              name="social_media.facebook"
              label="Facebook URL"
              placeholder="https://facebook.com/..."
            />

            <FormInput
              control={control}
              name="social_media.twitter"
              label="X (Twitter) URL"
              placeholder="https://x.com/..."
            />

            <FormInput
              control={control}
              name="social_media.threads"
              label="Threads URL"
              placeholder="https://threads.net/..."
            />

            <FormInput
              control={control}
              name="social_media.tiktok"
              label="TikTok URL"
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </div>

        <FormSwitch
          control={control}
          name="has_inventory"
          label="Gestionar Inventario (Tallas)"
          description="Solicitar talla durante el registro."
        />

        <FormTextarea
          control={control}
          name="rules_text"
          label="Reglamento"
          className="min-h-[150px]"
        />
      </CardContent>
    </Card>
  );
}
