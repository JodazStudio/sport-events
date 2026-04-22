import { Trophy, Medal } from "lucide-react";
 
export function AwardsSection() {
  return (
    <div id="premiacion" className="h-[450px]">
      <h2 className="text-4xl md:text-5xl font-permanent font-bold text-white mb-8">
        PREMIACIÓN
      </h2>
      
      <div className="bg-white/10 rounded-lg p-8 space-y-8 h-full">
        <div className="flex items-start gap-4">
          <Trophy className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <h3 className="text-2xl font-permanent font-bold text-white mb-4">
              ¡Premios en Efectivo! 🏆
            </h3>
            <div className="space-y-4 flex-1">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-yellow-500 font-permanent font-bold text-xl mb-2">
                  Absolutos (Femenino y Masculino)
                </p>
                <p className="text-white text-lg">
                  $150
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-yellow-500 font-permanent font-bold text-xl mb-3">
                  Por Categoría
                </p>
                <ul className="space-y-2 text-white">
                  <li className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-yellow-500" />
                    <span><strong>1er lugar:</strong> $70</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-yellow-500" />
                    <span><strong>2do lugar:</strong> $50</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-yellow-500" />
                    <span><strong>3er lugar:</strong> $30</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-white text-lg mt-6 font-permanent">
              ¡Da lo mejor y lleva tu recompensa!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
