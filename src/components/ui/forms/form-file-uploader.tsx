"use client";

import * as React from "react";
import { FieldPath, FieldValues } from "react-hook-form";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui";
import { Upload, X, CheckCircle, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib";
import { BaseFieldProps } from "./types";
import { toast } from "sonner";

interface FormFileUploaderProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> 
  extends BaseFieldProps<TFieldValues, TName> {
  accept?: string;
  maxSize?: number; // in MB
  bucket?: string;
  onUploadSuccess?: (url: string) => void;
}

export function FormFileUploader<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  containerClassName,
  accept = "image/*",
  maxSize = 5,
  bucket = "receipts",
  onUploadSuccess,
}: FormFileUploaderProps<TFieldValues, TName>) {
  const [isUploading, setIsUploading] = React.useState(false);

  const onUpload = async (file: File, onChange: (url: string) => void) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`El archivo es muy pesado (máx ${maxSize}MB)`);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Error al subir el archivo");
      }

      const data = await res.json();
      onChange(data.url);
      if (onUploadSuccess) {
        onUploadSuccess(data.url);
      }
      toast.success("Imagen subida con éxito");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel className="font-mono text-[10px] uppercase tracking-widest font-bold">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div 
              className={cn(
                "relative border-2 border-dashed border-black dark:border-white transition-all p-4 text-center cursor-pointer group bg-muted/10 min-h-[120px] flex flex-col items-center justify-center gap-2",
                field.value ? "border-solid bg-primary/5" : "hover:bg-muted/20"
              )}
            >
              <input
                type="file"
                accept={accept}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file, field.onChange);
                }}
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-[10px] uppercase font-mono font-bold">Subiendo...</span>
                </div>
              ) : field.value ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="relative group/image w-full aspect-video md:aspect-auto md:h-32 border-2 border-black overflow-hidden bg-black">
                    <img 
                      src={field.value} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover opacity-80 group-hover/image:opacity-40 transition-opacity" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary">
                    <CheckCircle className="h-3 w-3" />
                    <span className="text-[9px] uppercase font-mono font-bold truncate max-w-[200px]">Imagen Lista</span>
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 z-20 p-1 bg-black text-white hover:bg-primary transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      field.onChange("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-black dark:bg-white text-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    Click o arrastra para subir
                  </span>
                  <span className="text-[8px] text-muted-foreground font-mono italic">
                    Máx {maxSize}MB • JPG, PNG, WebP
                  </span>
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription className="italic text-xs">{description}</FormDescription>}
          <FormMessage className="text-[10px] font-bold uppercase" />
        </FormItem>
      )}
    />
  );
}
