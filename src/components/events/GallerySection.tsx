"use client";
import { AnimatedContent } from "@/components/ui";


import { useState } from "react";
import { X, ImageIcon } from "lucide-react";
import type { GalleryImage } from "./types";

interface GallerySectionProps {
  images?: GalleryImage[];
}

export const GallerySection = ({ images }: GallerySectionProps) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <section id="galeria" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedContent>
          <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
            Galería
          </h2>
        </AnimatedContent>
        {images && images.length > 0 ? (
          <>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto">
              {images.map((img, idx) => (
                <AnimatedContent 
                  key={img.id} 
                  delay={0.1 + (idx % 8) * 0.05} 
                  distance={30} 
                  scale={0.95}
                  className="mb-4 break-inside-avoid"
                >
                  <div
                    className="cursor-pointer group"
                    onClick={() => setLightboxIdx(idx)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full cursor-pointer rounded-none border-2 border-border group-hover:border-ember transition-all group-hover:opacity-90"
                      loading="lazy"
                    />
                  </div>
                </AnimatedContent>
              ))}
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
              <div
                className="fixed inset-0 z-[100] bg-charcoal/95 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
                onClick={() => setLightboxIdx(null)}
              >
                <button
                  onClick={() => setLightboxIdx(null)}
                  className="absolute top-6 right-6 text-foreground hover:text-ember transition-colors bg-black/50 p-2 rounded-full cursor-pointer"
                >
                  <X className="w-8 h-8" />
                </button>
                <img
                  src={images[lightboxIdx].url}
                  alt={images[lightboxIdx].alt}
                  className="max-w-full max-h-[90vh] object-contain rounded-none border-4 border-charcoal-lighter shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-satoshi font-medium uppercase tracking-widest text-sm">
              Las fotos del evento serán publicadas aquí.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

