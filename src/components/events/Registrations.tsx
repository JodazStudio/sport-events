'use client';

import React from "react";

export function Registrations() {
    return (
        <section
            className="py-12 px-8 rounded-lg mb-8 w-full flex flex-col gap-10"
            id="inscripciones"
        >
            <h2 className="font-permanent text-5xl md:text-6xl font-bold mb-12 text-black text-center">
                ¡NUESTRA CARRERA HA FINALIZADO!
            </h2>
            <div className="flex flex-col items-center text-center gap-6">
                <p className="text-gray-700 text-xl mb-4">
                    Gracias por tu interés en la Carrera y Caminata Santa Rosa de Lima 2025.
                    El evento ya ha concluido exitosamente.
                </p>
                <p className="text-gray-700 mb-4">
                    ¡Esperamos verte en futuras ediciones!
                </p>
                <div className="text-gray-700">
                    Para más información, síguenos en Instagram{" "}
                    <a
                        href="https://www.instagram.com/santarosa10k/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        @santarosa10k
                    </a>
                </div>
            </div>
        </section>
    );
}

