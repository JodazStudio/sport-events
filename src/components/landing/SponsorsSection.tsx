"use client";
import Image from "next/image";
import { SplitText } from "../ui/SplitText";
import { LogoLoop } from "./LogoLoop";
import { TenantData, TenantSponsor } from "@/types";

interface SponsorsSectionProps {
  data: TenantData;
}

export function SponsorsSection({ data }: SponsorsSectionProps) {
    const sponsors = data.sponsors || [];
    const institutionalSponsors = sponsors.filter(s => s.type === "institutional");
    const officialSponsors = sponsors.filter(s => s.type === "official");
    
    // Split official sponsors into two groups for the loops
    const half = Math.ceil(officialSponsors.length / 2);
    const officialSponsors1 = officialSponsors.slice(0, half);
    const officialSponsors2 = officialSponsors.slice(half);

    return (
        <>
            {/* Institutional Sponsors */}
            {institutionalSponsors.length > 0 && (
              <section className="py-20 bg-white w-full">
                  <div className="container mx-auto px-4">
                      <div className="w-full text-center">
                          <SplitText
                              text="PATROCINANTES INSTITUCIONALES"
                              className="font-permanent text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-black text-center mb-12 py-4"
                              delay={50}
                              from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                              to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                              ease="bounce.out"
                              splitType="chars"
                              tag="h2"
                          />
                      </div>
                      <p className="text-center text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                          Gracias a nuestros aliados institucionales por creer en el deporte y la comunidad. Su apoyo hace posible esta gran celebración en {data.location}. 🙌
                      </p>
                      <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
                          {institutionalSponsors.map((sponsor, index) => (
                              <div key={index} className="flex flex-col items-center">
                                  <div className="w-48 h-48 rounded-2xl flex items-center justify-center">
                                      <Image
                                          src={sponsor.logo}
                                          alt={sponsor.name}
                                          width={160}
                                          height={160}
                                          className="w-40 h-40 object-contain"
                                      />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </section>
            )}

            {/* Official Sponsors */}
            {officialSponsors.length > 0 && (
              <section className="py-20 bg-white w-full overflow-hidden">
                  <div className="container mx-auto px-4">
                      <div className="w-full text-center">
                          <SplitText
                              text="PATROCINANTES OFICIALES"
                              className="font-permanent text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-black text-center mb-12 py-4"
                              delay={50}
                              from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                              to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                              ease="bounce.out"
                              splitType="chars"
                              tag="h2"
                          />
                      </div>
                      <p className="text-center text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                          Nuestros patrocinadores oficiales impulsan cada paso de esta carrera. ¡Con su respaldo, llegamos más lejos! 🌟
                      </p>
                      <div className="w-full relative overflow-hidden space-y-8">
                          {/* First Loop - Left Direction */}
                          <LogoLoop
                              logos={officialSponsors1 as any[]}
                              speed={50}
                              direction="left"
                              gap={60}
                              logoHeight={140}
                              renderItem={(sponsor: any, index: any) => (
                                  <div key={index} className="flex flex-col items-center mx-4">
                                      <div className="w-[140px] h-[140px] rounded-lg flex items-center justify-center">
                                          <Image
                                              src={sponsor.logo}
                                              alt={sponsor.name}
                                              width={140}
                                              height={140}
                                              className="w-[140px] h-[140px] object-contain"
                                          />
                                      </div>
                                  </div>
                              )}
                          />
                          
                          {/* Second Loop - Right Direction */}
                          {officialSponsors2.length > 0 && (
                            <LogoLoop
                                logos={officialSponsors2 as any[]}
                                speed={50}
                                direction="right"
                                gap={60}
                                logoHeight={140}
                                renderItem={(sponsor: any, index: any) => (
                                    <div key={index} className="flex flex-col items-center mx-4">
                                        <div className="w-[140px] h-[140px] rounded-lg flex items-center justify-center">
                                            <Image
                                                src={sponsor.logo}
                                                alt={sponsor.name}
                                                width={140}
                                                height={140}
                                                className="w-[140px] h-[140px] object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                          )}
                      </div>
                  </div>
              </section>
            )}
        </>
    );
}

