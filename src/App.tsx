import SetupPanel from "./components/SetupPanel"
import GamePanel from "./components/GamePanel"
import ConversionPanel from "./components/ConversionPanel"
import ResultPanel from "./components/ResultPanel"
import { useState } from "react"
import { Toaster } from "react-hot-toast"

type NumberMode = "random" | "predefined";
type ValueType = "unidades" | "decenas" | "centenas" | "miles";

interface GameConfig {
  mode: NumberMode;
  number1?: number;
  number2?: number;
}

interface GameResult {
  number1: number;
  number2: number;
  zone1Values: Array<{ type: ValueType }>;
  zone2Values: Array<{ type: ValueType }>;
}

function App() {
  const [currentPanel, setCurrentPanel] = useState<'setup' | 'game' | 'conversion' | 'result'>('setup');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleStartGame = (config: GameConfig) => {
    setGameConfig(config);
    setCurrentPanel('game');
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
    
    // Combinar todos los valores de ambas zonas
    const allValues = [...result.zone1Values, ...result.zone2Values];
    
    // Contar por tipo
    const countByType = (type: ValueType) => 
      allValues.filter((v) => v.type === type).length;
    
    // Verificar si necesita conversión (cualquier tipo excepto miles tiene 10+ fichas)
    const needsConversion = 
      countByType("unidades") > 9 || 
      countByType("decenas") > 9 || 
      countByType("centenas") > 9;
    
    setCurrentPanel(needsConversion ? 'conversion' : 'result');
  };

  const handleConversionComplete = (finalValues: Array<{ type: ValueType }>) => {
    // Actualizar el resultado con los valores convertidos
    if (gameResult) {
      setGameResult({
        ...gameResult,
        zone1Values: finalValues.slice(0, Math.ceil(finalValues.length / 2)),
        zone2Values: finalValues.slice(Math.ceil(finalValues.length / 2)),
      });
    }
    setCurrentPanel('result');
  };

  const handlePlayAgain = () => {
    setGameConfig(null);
    setGameResult(null);
    setCurrentPanel('setup');
  };

  if (currentPanel === 'setup') {
    return (
      <>
        <SetupPanel onStartGame={handleStartGame} />
        <Toaster position="top-center" />
      </>
    )
  }

  if (currentPanel === 'game' && gameConfig) {
    return (
      <>
        <GamePanel config={gameConfig} onGameComplete={handleGameComplete} />
        <Toaster position="top-center" />
      </>
    )
  }

  if (currentPanel === 'conversion' && gameResult) {
    // Combinar todos los valores para el panel de conversión
    const allValues = [...gameResult.zone1Values, ...gameResult.zone2Values];
    
    return (
      <>
        <ConversionPanel 
          allValues={allValues}
          onConversionComplete={handleConversionComplete}
        />
        <Toaster position="top-center" />
      </>
    )
  }

  if (currentPanel === 'result' && gameResult) {
    return (
      <>
        <ResultPanel 
          number1={gameResult.number1}
          number2={gameResult.number2}
          zone1Values={gameResult.zone1Values}
          zone2Values={gameResult.zone2Values}
          onPlayAgain={handlePlayAgain}
        />
        <Toaster position="top-center" />
      </>
    )
  }

  return (
    <>
      <h1>Matemática didáctica</h1>
      <Toaster position="top-center" />
    </>
  )
}

export default App
