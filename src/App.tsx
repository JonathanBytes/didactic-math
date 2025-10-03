import SetupPanel from "./components/SetupPanel"
import GamePanel from "./components/GamePanel"
import { useState } from "react"

type NumberMode = "random" | "predefined";

interface GameConfig {
  mode: NumberMode;
  number1?: number;
  number2?: number;
}

function App() {
  const [currentPanel, setCurrentPanel] = useState<'game' | 'setup'>('setup');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  const handleStartGame = (config: GameConfig) => {
    setGameConfig(config);
    setCurrentPanel('game');
  };

  if (currentPanel === 'setup') {
    return (
      <SetupPanel onStartGame={handleStartGame} />
    )
  }

  if (currentPanel === 'game' && gameConfig) {
    return (
      <GamePanel config={gameConfig} />
    )
  }

  return (
    <>
      <h1>Matemática didáctica</h1>
    </>
  )
}

export default App
