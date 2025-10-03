import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import toast from "react-hot-toast";

type NumberMode = "random" | "predefined";

interface GameConfig {
  mode: NumberMode;
  number1?: number;
  number2?: number;
}

interface GamePanelProps {
  config: GameConfig;
  onGameComplete: (data: {
    number1: number;
    number2: number;
    zone1Values: Array<{ type: ValueType }>;
    zone2Values: Array<{ type: ValueType }>;
  }) => void;
}

type ValueType = "unidades" | "decenas" | "centenas" | "miles";

// Componente para los rectángulos de destino
const DropZone = ({ 
  color, 
  label, 
  className, 
  id,
  values 
}: { 
  color: string; 
  label: string;
  className?: string;
  id: string;
  values: Array<{ type: ValueType }>;
}) => {
  const countByType = (type: ValueType) => values.filter(v => v.type === type).length;
  
  return (
    <Card
      id={id}
      className={`flex flex-col items-center justify-center border-2 border-dashed transition-all hover:border-solid ${className}`}
      style={{ borderColor: color, backgroundColor: `${color}15` }}
    >
      <span className="text-lg font-semibold mb-2" style={{ color }}>
        {label}
      </span>
      {values.length > 0 && (
        <div className="space-y-1 text-center">
          {countByType("miles") > 0 && (
            <div className="text-sm text-gray-600">
              Miles: {countByType("miles")}
            </div>
          )}
          {countByType("centenas") > 0 && (
            <div className="text-sm text-gray-600">
              Centenas: {countByType("centenas")}
            </div>
          )}
          {countByType("decenas") > 0 && (
            <div className="text-sm text-gray-600">
              Decenas: {countByType("decenas")}
            </div>
          )}
          {countByType("unidades") > 0 && (
            <div className="text-sm text-gray-600">
              Unidades: {countByType("unidades")}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// Componente estático del generador (nunca se mueve)
const GeneratorBase = ({
  label,
  color
}: {
  label: string;
  color: string;
}) => {
  return (
    <div className="flex flex-col items-center gap-2 opacity-50">
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

// Componente para la ficha que se puede arrastrar sobre el generador
const GeneratorTile = ({
  id,
  label,
  color,
  type,
  containerRef,
  onDrop
}: {
  id: string;
  label: string;
  color: string;
  type: ValueType;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (id: string, type: ValueType, zone: 1 | 2) => void;
}) => {
  const [zIndex, setZIndex] = useState(100);
  const figureRef = useRef<HTMLDivElement>(null);

  const updateZIndex = () => {
    const els = document.querySelectorAll(".drag-tile");
    let maxZIndex = 99;

    els.forEach((el) => {
      const z = parseInt(window.getComputedStyle(el).getPropertyValue("z-index"));
      if (!isNaN(z) && z > maxZIndex) {
        maxZIndex = z;
      }
    });

    setZIndex(maxZIndex + 1);
  };

  const handleDragEnd = () => {
    const zone1 = document.getElementById("drop-zone-1");
    const zone2 = document.getElementById("drop-zone-2");
    
    if (!zone1 || !zone2 || !figureRef.current) return;

    const figureRect = figureRef.current.getBoundingClientRect();
    const zone1Rect = zone1.getBoundingClientRect();
    const zone2Rect = zone2.getBoundingClientRect();

    const figureCenterX = figureRect.left + figureRect.width / 2;
    const figureCenterY = figureRect.top + figureRect.height / 2;

    if (
      figureCenterX >= zone1Rect.left &&
      figureCenterX <= zone1Rect.right &&
      figureCenterY >= zone1Rect.top &&
      figureCenterY <= zone1Rect.bottom
    ) {
      onDrop(id, type, 1);
      return;
    }

    if (
      figureCenterX >= zone2Rect.left &&
      figureCenterX <= zone2Rect.right &&
      figureCenterY >= zone2Rect.top &&
      figureCenterY <= zone2Rect.bottom
    ) {
      onDrop(id, type, 2);
      return;
    }
  };

  return (
    <motion.div
      ref={figureRef}
      onMouseDown={updateZIndex}
      onDragEnd={handleDragEnd}
      drag
      dragConstraints={containerRef}
      dragElastic={0.65}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.3
      }}
      style={{ 
        zIndex,
        position: 'absolute',
        top: 0,
        left: 0
      }}
      className="drag-tile cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-white shadow-lg"
          style={{ backgroundColor: color }}
        >
          {label.charAt(0)}
        </div>
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
    </motion.div>
  );
};

const GamePanel = ({ config, onGameComplete }: GamePanelProps) => {
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [nextNumber, setNextNumber] = useState<number>(0);
  const [originalNumber1, setOriginalNumber1] = useState<number>(0);
  const [originalNumber2, setOriginalNumber2] = useState<number>(0);
  const [isShowingFirstNumber, setIsShowingFirstNumber] = useState<boolean>(true);
  const [zone1Values, setZone1Values] = useState<Array<{ type: ValueType }>>([]);
  const [zone2Values, setZone2Values] = useState<Array<{ type: ValueType }>>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Fichas activas sobre los generadores
  const [activeTiles, setActiveTiles] = useState<{
    unidades: string;
    decenas: string;
    centenas: string;
    miles: string;
  }>({
    unidades: 'unidades-0',
    decenas: 'decenas-0',
    centenas: 'centenas-0',
    miles: 'miles-0'
  });
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const generatorUnidadesRef = useRef<HTMLDivElement | null>(null);
  const generatorDecenasRef = useRef<HTMLDivElement | null>(null);
  const generatorCentenasRef = useRef<HTMLDivElement | null>(null);
  const generatorMilesRef = useRef<HTMLDivElement | null>(null);

  // Función para descomponer un número en sus valores posicionales
  const decomposeNumber = (num: number) => {
    const unidades = num % 10;
    const decenas = Math.floor((num % 100) / 10) * 10;
    const centenas = Math.floor((num % 1000) / 100) * 100;
    const miles = Math.floor(num / 1000) * 1000;
    
    return { unidades, decenas, centenas, miles };
  };

  useEffect(() => {
    // Generar o asignar números según la configuración
    if (config.mode === "random") {
      const n1 = Math.floor(Math.random() * 9999) + 1;
      const n2 = Math.floor(Math.random() * 9999) + 1;
      setCurrentNumber(n1);
      setNextNumber(n2);
      setOriginalNumber1(n1);
      setOriginalNumber2(n2);
      setIsInitialized(true);
    } else if (config.mode === "predefined") {
      const n1 = config.number1 || 0;
      const n2 = config.number2 || 0;
      setCurrentNumber(n1);
      setNextNumber(n2);
      setOriginalNumber1(n1);
      setOriginalNumber2(n2);
      setIsInitialized(true);
    }
  }, [config]);

  const handleTileDrop = (_id: string, type: ValueType, zone: 1 | 2) => {
    // Determinar la zona objetivo correcta según el número actual
    const targetZone = isShowingFirstNumber ? 1 : 2;
    
    // Si se intenta soltar en la zona incorrecta, mostrar toast
    if (zone !== targetZone) {
      toast.error(`Zona incorrecta\nDebes colocar las fichas en la Zona ${targetZone}`, {
        duration: 3000,
      });
      return;
    }

    // Obtener los valores actuales de la zona objetivo
    const targetZoneValues = zone === 1 ? zone1Values : zone2Values;
    
    // Descomponer el número actual para obtener cantidades requeridas
    const decomposed = decomposeNumber(currentNumber);
    const requiredCounts = {
      unidades: decomposed.unidades,
      decenas: Math.floor(decomposed.decenas / 10),
      centenas: Math.floor(decomposed.centenas / 100),
      miles: Math.floor(decomposed.miles / 1000)
    };

    // Contar cuántas fichas de este tipo ya están en la zona
    const currentCount = getCountForType(targetZoneValues, type);
    
    // Verificar si ya se alcanzó el límite
    if (currentCount >= requiredCounts[type]) {
      const typeNames = {
        unidades: "unidades",
        decenas: "decenas",
        centenas: "centenas",
        miles: "miles"
      };
      
      toast(`Límite alcanzado\nSolo necesitas ${requiredCounts[type]} ${typeNames[type]} para el número ${currentNumber}`, {
        icon: '⚠️',
        duration: 3000,
      });
      return;
    }

    // Si pasa todas las validaciones, agregar la ficha
    const newValue = { type };
    
    if (zone === 1) {
      setZone1Values(prev => [...prev, newValue]);
    } else {
      setZone2Values(prev => [...prev, newValue]);
    }

    // Generar una nueva ficha sobre el generador
    const newTileId = `${type}-${Date.now()}`;
    setActiveTiles(prev => ({
      ...prev,
      [type]: newTileId
    }));
  };

  const getCountForType = (values: Array<{ type: ValueType }>, type: ValueType): number => {
    return values.filter(v => v.type === type).length;
  };

  const checkCompletion = useCallback(() => {
    // No verificar si no está inicializado o si el número es 0
    if (!isInitialized || currentNumber === 0) return;

    const targetZone = isShowingFirstNumber ? 1 : 2;
    const targetZoneValues = targetZone === 1 ? zone1Values : zone2Values;

    // Descomponer el número actual
    const decomposed = decomposeNumber(currentNumber);
    
    // Verificar si todas las cantidades son correctas
    const unidadesRequired = decomposed.unidades;
    const decenasRequired = Math.floor(decomposed.decenas / 10);
    const centenasRequired = Math.floor(decomposed.centenas / 100);
    const milesRequired = Math.floor(decomposed.miles / 1000);

    const unidadesPlaced = getCountForType(targetZoneValues, "unidades");
    const decenasPlaced = getCountForType(targetZoneValues, "decenas");
    const centenasPlaced = getCountForType(targetZoneValues, "centenas");
    const milesPlaced = getCountForType(targetZoneValues, "miles");

    // Solo validar si se ha colocado al menos una ficha
    if (targetZoneValues.length > 0 &&
        unidadesPlaced === unidadesRequired &&
        decenasPlaced === decenasRequired &&
        centenasPlaced === centenasRequired &&
        milesPlaced === milesRequired) {
      // ¡Correcto! Pasar al siguiente número
      if (isShowingFirstNumber) {
        setCurrentNumber(nextNumber);
        setIsShowingFirstNumber(false);
      } else {
        // Juego completado - llamar a onGameComplete con todos los datos
        onGameComplete({
          number1: originalNumber1,
          number2: originalNumber2,
          zone1Values,
          zone2Values
        });
      }
    }
  }, [zone1Values, zone2Values, isShowingFirstNumber, currentNumber, nextNumber, isInitialized, onGameComplete, originalNumber1, originalNumber2]);

  useEffect(() => {
    checkCompletion();
  }, [checkCompletion]);

  console.log("GamePanel config:", config);
  console.log("Current number:", currentNumber);
  console.log("Next number:", nextNumber);
  console.log("Zone 1 values:", zone1Values);
  console.log("Zone 2 values:", zone2Values);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden"
    >
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Matemática Didáctica
        </h1>
        <p className="text-sm text-center text-gray-600 mt-1">
          {isShowingFirstNumber ? "Primer número" : "Segundo número"}
        </p>
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
                {currentNumber}
              </div>
              <p className="text-sm text-gray-500">
                Arrastra las figuras a la zona {isShowingFirstNumber ? "1 (morada)" : "2 (rosa)"}
              </p>
            </div>
          </Card>
        </div>

        {/* Columna Derecha - Área de trabajo */}
        <div className="flex flex-col gap-6 p-4">
          {/* Figuras de valores (Unidades, Decenas, Centenas, Miles) - Generadores estáticos */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Valores disponibles (Arrastra las fichas)
            </h3>
            <div className="flex justify-around gap-4">
              <div ref={generatorUnidadesRef} className="relative">
                <GeneratorBase label="Unidades" color="#10b981" />
                <GeneratorTile
                  key={activeTiles.unidades}
                  id={activeTiles.unidades}
                  label="Unidades"
                  color="#10b981"
                  type="unidades"
                  containerRef={containerRef}
                  onDrop={handleTileDrop}
                />
              </div>
              <div ref={generatorDecenasRef} className="relative">
                <GeneratorBase label="Decenas" color="#3b82f6" />
                <GeneratorTile
                  key={activeTiles.decenas}
                  id={activeTiles.decenas}
                  label="Decenas"
                  color="#3b82f6"
                  type="decenas"
                  containerRef={containerRef}
                  onDrop={handleTileDrop}
                />
              </div>
              <div ref={generatorCentenasRef} className="relative">
                <GeneratorBase label="Centenas" color="#f59e0b" />
                <GeneratorTile
                  key={activeTiles.centenas}
                  id={activeTiles.centenas}
                  label="Centenas"
                  color="#f59e0b"
                  type="centenas"
                  containerRef={containerRef}
                  onDrop={handleTileDrop}
                />
              </div>
              <div ref={generatorMilesRef} className="relative">
                <GeneratorBase label="Miles" color="#ef4444" />
                <GeneratorTile
                  key={activeTiles.miles}
                  id={activeTiles.miles}
                  label="Miles"
                  color="#ef4444"
                  type="miles"
                  containerRef={containerRef}
                  onDrop={handleTileDrop}
                />
              </div>
            </div>
          </div>

          {/* Rectángulos de destino (dos colores diferentes) */}
          <div className="flex-1 flex justify-center items-end gap-4">
            <DropZone 
              id="drop-zone-1"
              color="#8b5cf6" 
              label="Zona 1" 
              className="w-full h-full" 
              values={zone1Values}
            />
            <DropZone 
              id="drop-zone-2"
              color="#ec4899" 
              label="Zona 2" 
              className="w-full h-full" 
              values={zone2Values}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;