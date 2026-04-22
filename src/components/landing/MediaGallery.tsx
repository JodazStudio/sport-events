'use client';
 
import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SplitText } from "../ui/SplitText";
import { TenantData } from '@/types';
 
export function MediaGallery({ data, previewMode = false }: MediaGalleryProps) {
  const images = (data.metadata as any).gallery || [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
 
  const displayImages = previewMode ? images.slice(0, 6) : images;
 
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };
 
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };
 
  if (images.length === 0) return null;
 
  return (
    <section id="galeria" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <SplitText
            text="GALERÍA"
            className="text-4xl md:text-5xl font-permanent font-bold text-black mb-4 py-4"
            delay={50}
            from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            ease="bounce.out"
            splitType="chars"
            tag="h2"
          />
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            ¡Revive los mejores momentos! 📸
          </p>
        </div>
 
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayImages.map((img: string, index: number) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
              onClick={() => {
                setSelectedImage(img);
                setCurrentIndex(index);
              }}
            >
              <Image
                src={img}
                alt={`Gallery image ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
 
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-4 right-4 text-white p-2"><X size={32} /></button>
            <button onClick={handlePrev} className="absolute left-4 text-white p-2"><ChevronLeft size={48} /></button>
            <img src={selectedImage} alt="Full view" className="max-w-full max-h-full object-contain" />
            <button onClick={handleNext} className="absolute right-4 text-white p-2"><ChevronRight size={48} /></button>
          </div>
        )}
      </div>
    </section>
  );
}
 
interface MediaGalleryProps {
  data: TenantData;
  previewMode?: boolean;
}
