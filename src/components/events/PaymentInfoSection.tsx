'use client';

import React, { useState } from "react";

type Category = "Carrera 10K" | "Caminata 5K";

const categoryForms: Record<Category, string | null> = {
    "Carrera 10K":
        "https://docs.google.com/forms/d/e/1FAIpQLSfiT2vL3iEm-GvfTPo3bSbRPcVeLz1sWzg40Xg-qzYr28d0hQ/viewform?embedded=true",
    "Caminata 5K": null, // No form for Caminata 5K
};

export function PaymentInfoSection() {
    const [category, setCategory] = useState<Category>("Carrera 10K");
    const [iframeWidth, setIframeWidth] = useState<number>(getIframeWidth());

    function getIframeWidth() {
        if (typeof window === "undefined") return 320;
        const w = window.innerWidth;
        if (w >= 1024) return 640;
        if (w >= 768) return 480;
        return Math.max(320, w - 32);
    }

    // Update iframe width on resize
    React.useEffect(() => {
        function handleResize() {
            setIframeWidth(getIframeWidth());
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cost and included items for each category
    const categoryDetails: Record<
        Category,
        { cost: number; includes: string[] }
    > = {
        "Carrera 10K": {
            cost: 1400,
            includes: ["Franela", "Medalla", "Dorsal", "Refrigerio"],
        },
        "Caminata 5K": {
            cost: 700,
            includes: ["Medalla", "Dorsal", "Refrigerio"],
        },
    };

    return (
        <section
            className=" py-12 px-8 rounded-lg mb-8 w-full flex flex-col gap-10"
            id="payment-info"
        >
            <h2 className="font-permanent text-5xl md:text-6xl font-bold mb-12 text-black text-center">
                ¡REALIZA TU INSCRIPCIÓN!
            </h2>
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:justify-evenly w-full">
                <div className="mb-4 w-full lg:max-w-lg mx-0 md:mx-0 text-xl height-full">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-4">
                            Rellena los campos y completa tu inscripción de la
                            carrera 10k SANTA ROSA DE LIMA 2025
                            <br />
                            para mayor información síguenos en Instagram{" "}
                            <a
                                href="https://www.instagram.com/santarosa10k/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-600 hover:underline"
                            >
                                @santarosa10k
                            </a>
                        </p>
                        <p className="text-red-600 font-medium mb-4">
                            ¡Recuerda enviar tu comprobante de pago al contacto!
                        </p>
                        <div className="mb-4 text-gray-700">
                            ¡Para notificar el pago debe agregar la referencia y
                            enviar el comprobante al Whatsapp!:
                            <br />
                            <br />
                            <span className="font-semibold">WHATSAPP</span>
                            <br />
                            Pedro Giuseppi
                            <br />
                            <span className="font-semibold">
                                {"📱 +58 4248878453"}
                            </span>
                        </div>
                        <div className="mb-4 text-gray-700">
                            <span className="font-bold">PAGOMOVIL</span>
                            <br />
                            JOSÉ LUGO
                            <br />
                            0105
                            <br />
                            9452385
                            <br />
                            0424 847 49 94
                        </div>
                        <div className="mb-2 text-gray-700">
                            <span className="font-bold">
                                TRANSFERENCIA BANCARIA
                            </span>
                            <br />
                            Jose Lugo
                            <br />
                            Número de cuenta: 01050089381089061315
                            <br />
                            Documento de identidad: 9452385
                        </div>
                    </div>
                    <label
                        htmlFor="category"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        ¿Bajo cual modalidad deseas participar?
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value as Category)
                        }
                        className="w-full p-2 border rounded focus:outline-none focus:ring"
                    >
                        <option>Carrera 10K</option>
                        <option>Caminata 5K</option>
                    </select>

                    {/* Cost and includes info */}
                    <div className="mt-4 mb-2 text-lg text-gray-800">
                        Costo de la{" "}
                        {category === "Carrera 10K" ? "carrera" : "caminata"}:{" "}
                        <span className="font-bold">
                            {categoryDetails[category].cost}bs
                        </span>
                    </div>
                    <div className="mb-4 text-gray-700">
                        Incluye:
                        <ul className="list-disc list-inside mt-1">
                            {categoryDetails[category].includes.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div style={{ width: iframeWidth, height: 2000 }}>
                    {categoryForms[category] ? (
                        <iframe
                            src={categoryForms[category] as string}
                            width={iframeWidth}
                            height="2000"
                            title="Formulario de pago"
                        >
                            Loading…
                        </iframe>
                    ) : null}
                    {category === "Caminata 5K" && (
                        <div className="mb-2 text-md text-yellow-700 bg-yellow-100 rounded px-3 py-2">
                            ¡Atención!, hemos cerrado el ciclo de inscripciones
                            para la caminata 5K.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

