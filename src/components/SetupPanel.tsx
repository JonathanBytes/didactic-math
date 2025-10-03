import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type NumberMode = "random" | "predefined";

interface GameConfig {
  mode: NumberMode;
  number1?: number;
  number2?: number;
}

interface SetupPanelProps {
  onStartGame?: (config: GameConfig) => void;
}

const SetupPanel = ({ onStartGame }: SetupPanelProps) => {
  const [mode, setMode] = useState<NumberMode>("random");
  const [number1, setNumber1] = useState<string>("");
  const [number2, setNumber2] = useState<string>("");

  const handleStartGame = () => {
    const config: GameConfig = {
      mode,
      ...(mode === "predefined" && {
        number1: parseInt(number1) || 0,
        number2: parseInt(number2) || 0,
      }),
    };

    onStartGame?.(config);
  };

  const isPredefinedValid = mode === "random" || (number1 !== "" && number2 !== "");

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Configuración del Juego</CardTitle>
          <CardDescription>
            Elige cómo quieres comenzar tu partida
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Modo de números</Label>
            <RadioGroup value={mode} onValueChange={(value) => setMode(value as NumberMode)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random" className="cursor-pointer font-normal">
                  Números aleatorios
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="predefined" id="predefined" />
                <Label htmlFor="predefined" className="cursor-pointer font-normal">
                  Números predefinidos
                </Label>
              </div>
            </RadioGroup>
          </div>

          {mode === "predefined" && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label htmlFor="number1">Primer número</Label>
                <Input
                  id="number1"
                  type="number"
                  placeholder="Ingresa el primer número"
                  value={number1}
                  onChange={(e) => setNumber1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number2">Segundo número</Label>
                <Input
                  id="number2"
                  type="number"
                  placeholder="Ingresa el segundo número"
                  value={number2}
                  onChange={(e) => setNumber2(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleStartGame}
            disabled={!isPredefinedValid}
          >
            Comenzar Juego
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupPanel;
