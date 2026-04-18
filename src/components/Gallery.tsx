"use client";

import { useState } from "react";
import { X } from "lucide-react";
import race1 from "@/assets/gallery/race-1.jpg";
import race2 from "@/assets/gallery/race-2.jpg";
import race3 from "@/assets/gallery/race-3.jpg";
import race4 from "@/assets/gallery/race-4.jpg";
import race5 from "@/assets/gallery/race-5.jpg";
import race6 from "@/assets/gallery/race-6.jpg";
import race7 from "@/assets/gallery/race-7.jpg";
import race8 from "@/assets/gallery/race-8.jpg";
import race9 from "@/assets/gallery/race-9.jpg";
import race10 from "@/assets/gallery/race-10.jpg";

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Create array of 100 images (reusing the 10 generated images)
  const galleryImages = Array.from({ length: 100 }, (_, index) => {
    const imageIndex = (index % 10) + 1;
    const images = [race1, race2, race3, race4, race5, race6, race7, race8, race9, race10];
    return {
      id: index + 1,
      src: images[imageIndex - 1],
      alt: `Carrera Santa Rosa foto ${index + 1}`,
    };
  });

  return (
    <section id="galeria" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            Galería de Fotos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revive los mejores momentos de nuestras carreras
          </p>
        </div>

        {/* Gallery Grid - 5 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${(index % 20) * 0.03}s` }}
              onClick={() => setSelectedImage(image.src.src)}
            >
              <img
                src={image.src.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="max-w-full max-h-full object-contain animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
};
