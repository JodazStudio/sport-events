"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { FormInput, FormTextarea, FormSelect } from "@/components/ui/forms";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Input } from "../../ui";

interface GeneralTabProps {
  managers: any[];
  onSlugify: (text: string) => string;
}

export function GeneralTab({ managers, onSlugify }: GeneralTabProps) {
  const { control, setValue } = useFormContext();
  return (
    <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
      <CardHeader className="bg-muted/30 border-b-2 border-black dark:border-white">
        <CardTitle className="font-satoshi font-black italic uppercase text-xl">Información General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <FormSelect
          control={control}
          name="manager_id"
          label="Organizador / Dueño"
          placeholder="Seleccionar organizador"
          options={managers.map((m: any) => ({ value: m.id, label: m.name, email: m.email }))}
        />

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Nombre del Evento</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-none border-2 border-black h-11 italic font-bold"
                  onChange={(e) => {
                    field.onChange(e);
                    const slug = onSlugify(e.target.value);
                    setValue('slug', slug, { shouldValidate: true });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormInput
          control={control}
          name="slug"
          label="Slug URL"
          inputClassName="font-mono text-sm"
        />

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            control={control}
            name="event_date"
            label="Fecha"
            type="date"
          />
          <FormInput
            control={control}
            name="event_time"
            label="Hora"
            type="time"
          />
        </div>

        <FormTextarea
          control={control}
          name="description"
          label="Descripción"
        />
      </CardContent>
    </Card>
  );
}
