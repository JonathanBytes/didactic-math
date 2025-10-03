import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type NumberMode = "random" | "predefined";

interface GameConfig {
  mode: NumberMode;
  number1?: number;
  number2?: number;
}

interface GamePanelProps {
  config: GameConfig;
}

// Componente para las figuras que representan unidades, decenas, centenas y miles
const ValueFigure = ({ label, color }: { label: string; color: string }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-white shadow-lg"
        style={{ backgroundColor: color }}
      >
        {label.charAt(0)}
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
};

// Componente para los rectángulos de destino
const DropZone = ({ color, label, className}: { color: string; label: string, className?: string }) => {
  return (
    <Card
      className={`flex items-center justify-center border-2 border-dashed transition-all hover:border-solid ${className}`}
      style={{ borderColor: color, backgroundColor: `${color}15` }}
    >
      <span className="text-lg font-semibold" style={{ color }}>
        {label}
      </span>
    </Card>
  );
};

const GamePanel = ({ config }: GamePanelProps) => {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);

  useEffect(() => {
    // Generar o asignar números según la configuración
    if (config.mode === "random") {
      // Generar números aleatorios (por ejemplo, entre 1 y 100)
      setNum1(Math.floor(Math.random() * 100) + 1);
      setNum2(Math.floor(Math.random() * 100) + 1);
    } else if (config.mode === "predefined") {
      // Usar números predefinidos
      setNum1(config.number1 || 0);
      setNum2(config.number2 || 0);
    }
  }, [config]);

  console.log("GamePanel config:", config);
  console.log("GamePanel num1:", num1);
  console.log("GamePanel num2:", num2);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Matemática Didáctica
        </h1>
      </header>

      {/* Main Game Area - Two Columns */}
      <div className="flex-1 grid grid-cols-[1fr_2fr] gap-4 p-4">
        {/* Columna Izquierda - Número a descomponer */}
        <div className="flex items-center justify-center">
          <Card className="p-8 w-full max-w-md">
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Número a descomponer
              </h2>
              <div className="text-8xl font-bold text-blue-600">
                {num1}
              </div>
              <p className="text-sm text-gray-500">
                Arrastra las figuras a los rectángulos correspondientes
              </p>
            </div>
          </Card>
        </div>

        {/* Columna Derecha - Área de trabajo */}
        <div className="flex flex-col gap-6 p-4">
          {/* Figuras de valores (Unidades, Decenas, Centenas, Miles) */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Valores
            </h3>
            <div className="flex justify-around gap-4">
              <ValueFigure label="Unidades" color="#10b981" />
              <ValueFigure label="Decenas" color="#3b82f6" />
              <ValueFigure label="Centenas" color="#f59e0b" />
              <ValueFigure label="Miles" color="#ef4444" />
            </div>
          </div>

          {/* Rectángulos de destino (dos colores diferentes) */}
          <div className="flex-1 flex justify-center items-end gap-4">
            <DropZone color="#8b5cf6" label="Zona 1" className="w-full h-full" />
            <DropZone color="#ec4899" label="Zona 2" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;