import SetupPanel from "./components/SetupPanel"
import GamePanel from "./components/GamePanel"
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
  const [currentPanel, setCurrentPanel] = useState<'setup' | 'game' | 'result'>('setup');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleStartGame = (config: GameConfig) => {
    setGameConfig(config);
    setCurrentPanel('game');
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
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
