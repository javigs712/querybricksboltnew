import { Building } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="text-center max-w-2xl mx-auto p-8">
      <Building className="h-12 w-12 text-domoblock-accent mx-auto mb-8" />
      <p className="text-gray-400 mb-12">
        Realiza consultas en lenguaje natural sobre los datos de inversores,
        proyectos e inversiones. Puedes especificar si quieres ver los resultados
        en forma de tabla o gráfico.
      </p>
    </div>
  );
}