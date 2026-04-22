export function CategoriesSection() {
    return (
        <div id="categorias" className="h-[450px]">
            <h2 className="text-4xl md:text-5xl font-permanent font-bold text-white mb-8">
                CATEGORÍAS
            </h2>
            <div className="bg-white/10 rounded-lg p-8 h-full flex flex-col">
                <p className="text-white text-lg mb-6">
                    ¡Hay un lugar para todos! Participa en:
                </p>
                <ul className="text-xl space-y-4 text-white flex-1">
                    <li className="flex items-center gap-3">
                        <span className="text-yellow-500 font-permanent font-bold">Juvenil</span>
                        <span>(16-19)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-yellow-500 font-permanent font-bold">Libre</span>
                        <span>(20-29)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-yellow-500 font-permanent font-bold">Submáster</span>
                        <span>(30-39)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-yellow-500 font-permanent font-bold">Máster A</span>
                        <span>(40-49)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-yellow-500 font-permanent font-bold">Máster B</span>
                        <span>(50-59)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-yellow-500 font-permanent font-bold">Máster C</span>
                        <span>(60+)</span>
                    </li>
                </ul>
                <p className="text-white text-lg mt-8 font-permanent">
                    ¡Corre por tu categoría y brilla!
                </p>
            </div>
        </div>
    );
}

