import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

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
  values,
  isActive = true
}: { 
  color: string; 
  label: string;
  className?: string;
  id: string;
  values: Array<{ type: ValueType }>;
  isActive?: boolean;
}) => {
  const countByType = (type: ValueType) => values.filter(v => v.type === type).length;
  
  // Estilos cuando está desactivada
  const inactiveColor = '#9ca3af'; // gray-400
  const displayColor = isActive ? color : inactiveColor;
  const opacity = isActive ? 1 : 0.5;
  
  return (
    <Card
      id={id}
      className={`flex flex-col items-center justify-center border-2 border-dashed transition-all ${isActive ? 'hover:border-solid' : 'cursor-not-allowed'} ${className}`}
      style={{ 
        borderColor: displayColor, 
        backgroundColor: `${displayColor}15`,
        opacity
      }}
    >
      <span className="text-lg font-semibold mb-2" style={{ color: displayColor }}>
        {label}
      </span>
      {/* Siempre mostrar el contenedor de contadores para evitar layout shift */}
      <div className="space-y-1 text-center min-h-[100px] flex flex-col justify-center">
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
        {values.length === 0 && (
          <div className="text-sm text-gray-400 italic">
            Arrastra aquí
          </div>
        )}
      </div>
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
    <div className="flex flex-col items-center gap-1 sm:gap-2 opacity-50">
      <div
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center font-bold text-white shadow-lg text-sm sm:text-base"
        style={{ backgroundColor: color }}
      >
        {label.charAt(0)}
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-gray-600">{label}</span>
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
  onDrop,
  generatorRef
}: {
  id: string;
  label: string;
  color: string;
  type: ValueType;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDrop: (id: string, type: ValueType, zone: 1 | 2) => void;
  generatorRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [zIndex, setZIndex] = useState(100);
  const figureRef = useRef<HTMLDivElement>(null);
  const [initialPos, setInitialPos] = useState<{ x: number; y: number } | null>(null);

  // Calcular posición inicial basada en el generador
  useEffect(() => {
    if (generatorRef.current) {
      const rect = generatorRef.current.getBoundingClientRect();
      setInitialPos({ x: rect.left, y: rect.top });
    }
  }, [generatorRef]);

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
      dragElastic={0.05}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
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
        position: 'fixed',
        top: initialPos?.y ?? 0,
        left: initialPos?.x ?? 0,
        pointerEvents: 'auto',
        visibility: initialPos ? 'visible' : 'hidden'
      }}
      className="drag-tile cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex flex-col items-center gap-1 sm:gap-2 pointer-events-none">
        <div
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center font-bold text-white shadow-lg text-sm sm:text-base"
          style={{ backgroundColor: color }}
        >
          {label.charAt(0)}
        </div>
        <span className="text-[10px] sm:text-xs font-medium text-gray-600">{label}</span>
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

  // Función para lanzar confeti
  const launchConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);

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
        // Juego completado - lanzar confeti y llamar a onGameComplete
        launchConfetti();
        setTimeout(() => {
          onGameComplete({
            number1: originalNumber1,
            number2: originalNumber2,
            zone1Values,
            zone2Values
          });
        }, 500); // Pequeño delay para que se vea el confeti antes de cambiar de pantalla
      }
    }
  }, [zone1Values, zone2Values, isShowingFirstNumber, currentNumber, nextNumber, isInitialized, onGameComplete, originalNumber1, originalNumber2, launchConfetti]);

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
      className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 relative"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      {/* Main Game Area - Two Columns */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_2fr] p-2 sm:p-0 overflow-hidden">
        {/* Columna Izquierda - Número a descomponer */}
        <div className="flex items-center justify-center p-2">
          <Card className="p-4 sm:p-8 w-full">
            <div className="text-center">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2">
                Número a descomponer
              </h2>
              <div className="text-4xl sm:text-6xl font-bold text-blue-600 my-2">
                {currentNumber}
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Arrastra las fichas a la zona {isShowingFirstNumber ? "1 (morada)" : "2 (rosa)"}
              </p>
            </div>
          </Card>
        </div>

        {/* Columna Derecha - Área de trabajo */}
        <div className="flex flex-col gap-2 sm:gap-6 p-2 sm:p-4 overflow-auto h-full">
          {/* Figuras de valores (Unidades, Decenas, Centenas, Miles) - Generadores estáticos */}
          <div className="bg-white rounded-lg p-1 sm:p-2 shadow-md flex-shrink-0">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 text-center">
              Valores disponibles (Arrastra las fichas)
            </h3>
            <div className="flex justify-center gap-1 sm:gap-2">
              <div ref={generatorMilesRef} className="relative">
                <GeneratorBase label="Miles" color="#ef4444" />
                <GeneratorTile
                  key={activeTiles.miles}
                  id={activeTiles.miles}
                  label="Miles"
                  color="#ef4444"
                  type="miles"
                  containerRef={containerRef}
                  generatorRef={generatorMilesRef}
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
                  generatorRef={generatorCentenasRef}
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
                  generatorRef={generatorDecenasRef}
                  onDrop={handleTileDrop}
                />
              </div>
              <div ref={generatorUnidadesRef} className="relative">
                <GeneratorBase label="Unidades" color="#10b981" />
                <GeneratorTile
                  key={activeTiles.unidades}
                  id={activeTiles.unidades}
                  label="Unidades"
                  color="#10b981"
                  type="unidades"
                  containerRef={containerRef}
                  generatorRef={generatorUnidadesRef}
                  onDrop={handleTileDrop}
                />
              </div>
            </div>
          </div>

          {/* Rectángulos de destino (dos colores diferentes) */}
          <div className="flex-1 flex flex-col sm:flex-row justify-center items-stretch gap-2 sm:gap-4 min-h-0">
            <DropZone 
              id="drop-zone-1"
              color="#8b5cf6" 
              label="Zona 1" 
              className="w-full flex-1 min-h-[120px]" 
              values={zone1Values}
              isActive={isShowingFirstNumber}
            />
            <DropZone 
              id="drop-zone-2"
              color="#ec4899" 
              label="Zona 2" 
              className="w-full flex-1 min-h-[120px]" 
              values={zone2Values}
              isActive={!isShowingFirstNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;