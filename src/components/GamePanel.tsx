import { useEffect, useState } from "react";

type NumberMode = "random" | "predefined";

interface GameConfig {
  mode: NumberMode;
  number1?: number;
  number2?: number;
}

interface GamePanelProps {
  config: GameConfig;
}

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

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Matemática Didáctica</h1>
        <div className="space-y-4">
          <p className="text-lg">Modo: <span className="font-semibold">{config.mode === "random" ? "Aleatorio" : "Predefinido"}</span></p>
          <p className="text-2xl">Número 1: <span className="font-bold text-blue-600">{num1}</span></p>
          <p className="text-2xl">Número 2: <span className="font-bold text-blue-600">{num2}</span></p>
        </div>
        <p className="mt-8 text-gray-500">Aquí irá el juego...</p>
      </div>
    </div>
  );
};

export default GamePanel;