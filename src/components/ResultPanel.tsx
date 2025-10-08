import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

type ValueType = "unidades" | "decenas" | "centenas" | "miles";

interface ResultPanelProps {
  number1: number;
  number2: number;
  zone1Values: Array<{ type: ValueType }>;
  zone2Values: Array<{ type: ValueType }>;
  onPlayAgain: () => void;
}

const ResultPanel = ({ 
  number1, 
  number2, 
  zone1Values, 
  zone2Values,
  onPlayAgain 
}: ResultPanelProps) => {
  const [showResult, setShowResult] = useState(false);

  const countByType = (values: Array<{ type: ValueType }>, type: ValueType) => 
    values.filter(v => v.type === type).length;

  // Contar todas las fichas por tipo (sumando ambas zonas)
  const totalUnidades = countByType(zone1Values, "unidades") + countByType(zone2Values, "unidades");
  const totalDecenas = countByType(zone1Values, "decenas") + countByType(zone2Values, "decenas");
  const totalCentenas = countByType(zone1Values, "centenas") + countByType(zone2Values, "centenas");
  const totalMiles = countByType(zone1Values, "miles") + countByType(zone2Values, "miles");

  // Calcular el resultado real
  const realResult = number1 + number2;

  // Colores para cada tipo
  const colors = {
    unidades: "#10b981",
    decenas: "#3b82f6",
    centenas: "#f59e0b",
    miles: "#ef4444"
  };

  // Componente para mostrar fichas de un tipo
  const TileGroup = ({ 
    type, 
    count, 
    label 
  }: { 
    type: ValueType; 
    count: number; 
    label: string;
  }) => {
    if (count === 0) return null;

    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <div className="flex flex-wrap gap-2 justify-center max-w-xs">
          {Array.from({ length: count }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-md"
              style={{ backgroundColor: colors[type] }}
            >
              {label.charAt(0)}
            </motion.div>
          ))}
        </div>
        <span className="text-lg font-bold" style={{ color: colors[type] }}>
          {count} {label.toLowerCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8 overflow-auto" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          ¡Felicidades! 🎉
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Has completado la descomposición de ambos números
        </p>
      </header>

      {/* Números originales */}
      <Card className="p-6 mb-8 bg-white">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Números descompuestos
        </h2>
        <div className="flex justify-center gap-8 items-center">
          <div className="text-center">
            <span className="text-xs text-gray-500">Zona 1</span>
            <div className="text-5xl font-bold text-purple-600">{number1}</div>
          </div>
          <div className="text-4xl text-gray-400">+</div>
          <div className="text-center">
            <span className="text-xs text-gray-500">Zona 2</span>
            <div className="text-5xl font-bold text-pink-600">{number2}</div>
          </div>
        </div>
      </Card>

      {/* Visualización de todas las fichas */}
      <Card className="p-8 mb-8 bg-white flex-1">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Todas las fichas juntas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TileGroup type="miles" count={totalMiles} label="Miles" />
          <TileGroup type="centenas" count={totalCentenas} label="Centenas" />
          <TileGroup type="decenas" count={totalDecenas} label="Decenas" />
          <TileGroup type="unidades" count={totalUnidades} label="Unidades" />
        </div>
      </Card>

      {/* Resultado final */}
      <Card className="p-6 mb-8 bg-white">
        {!showResult ? (
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              ¿Cuál crees que es el resultado de la suma?
            </p>
            <Button 
              onClick={() => setShowResult(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Revelar Resultado
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="text-center"
          >
            <p className="text-lg text-gray-600 mb-2">El resultado es:</p>
            <div className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {realResult}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {number1} + {number2} = {realResult}
            </p>
          </motion.div>
        )}
      </Card>

      {/* Botón para jugar de nuevo */}
      <div className="text-center">
        <Button 
          onClick={onPlayAgain}
          size="lg"
          variant="outline"
        >
          Jugar de Nuevo
        </Button>
      </div>
    </div>
  );
};

export default ResultPanel;
