"use client";
import Image from "next/image";
import { SplitText } from "../ui/SplitText";
import { Button } from "../ui/button";
import { TenantData } from "@/types";

interface OrganizersSectionProps {
  data: TenantData;
}

export function OrganizersSection({ data }: OrganizersSectionProps) {
    const organizers = data.organizers || [];

    return (
        <section id="organizadores" className="relative w-full min-h-[80vh] flex flex-col justify-center overflow-hidden">
            {/* Parallax Background */}
            <div
                className="absolute inset-0 w-full h-full z-0"
                style={{
                    backgroundImage: `url(${data.heroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                }}
            >
                <div className="absolute inset-0 bg-black/80" />
            </div>

            <div className="container relative z-10 mx-auto px-4 py-20">
                <div className="w-full text-center">
                    <SplitText
                        text="ORGANIZADORES"
                        className="font-permanent text-4xl md:text-6xl font-bold mb-8 text-white text-center mb-12 py-4"
                        delay={50}
                        from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                        to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                        ease="bounce.out"
                        splitType="chars"
                        tag="h2"
                    />
                </div>
                <p className="text-center text-gray-200 text-lg mb-12 max-w-3xl mx-auto">
                    Este evento es posible gracias a la pasión de nuestros organizadores.
                    <br />
                    <br />
                    Unimos fuerzas para promover la salud, la fe y la comunidad en {data.location}. ¡Gracias por hacer realidad esta edición!
                </p>
                <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
                    {organizers.map((organizer, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <div className="w-48 h-48 rounded-2xl flex items-center justify-center mb-4 p-4 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg group-hover:scale-105">
                                <Image
                                    src={organizer.logo}
                                    alt={organizer.name}
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-contain filter drop-shadow-lg"
                                />
                            </div>
                            <span className="text-white font-permanent font-bold text-xl">
                                {organizer.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

