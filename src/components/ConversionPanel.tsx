import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

type ValueType = "unidades" | "decenas" | "centenas" | "miles";

interface ConversionPanelProps {
  allValues: Array<{ type: ValueType }>;
  onConversionComplete: (finalValues: Array<{ type: ValueType }>) => void;
}

// Componente base del generador (estático)
const GeneratorBase = ({
  label,
  color,
  count
}: {
  label: string;
  color: string;
  count: number;
}) => {
  return (
    <div className="flex flex-col items-center gap-1 opacity-50">
      <div
        className="rounded-lg flex items-center justify-center font-bold text-white shadow-lg text-xs sm:text-sm"
        style={{ 
          backgroundColor: color,
          width: 'clamp(2.5rem, 8vw, 3.5rem)',
          height: 'clamp(2.5rem, 8vw, 3.5rem)'
        }}
      >
        {label.charAt(0)}
      </div>
      <span className="text-[8px] sm:text-[10px] font-medium text-gray-600 leading-tight whitespace-nowrap">{label}</span>
      <span className="text-xs sm:text-sm font-bold leading-tight" style={{ color }}>
        {count}
      </span>
    </div>
  );
};

// Componente para la ficha arrastrable
const DraggableTile = ({
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
  onDrop: (id: string, type: ValueType) => void;
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
    const conversionZone = document.getElementById("conversion-zone");
    
    if (!conversionZone || !figureRef.current) return;

    const figureRect = figureRef.current.getBoundingClientRect();
    const zoneRect = conversionZone.getBoundingClientRect();

    const figureCenterX = figureRect.left + figureRect.width / 2;
    const figureCenterY = figureRect.top + figureRect.height / 2;

    if (
      figureCenterX >= zoneRect.left &&
      figureCenterX <= zoneRect.right &&
      figureCenterY >= zoneRect.top &&
      figureCenterY <= zoneRect.bottom
    ) {
      onDrop(id, type);
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
      <div className="flex flex-col items-center gap-1 pointer-events-none">
        <div
          className="rounded-lg flex items-center justify-center font-bold text-white shadow-lg text-xs sm:text-sm"
          style={{ 
            backgroundColor: color,
            width: 'clamp(2.5rem, 8vw, 3.5rem)',
            height: 'clamp(2.5rem, 8vw, 3.5rem)'
          }}
        >
          {label.charAt(0)}
        </div>
        <span className="text-[8px] sm:text-[10px] font-medium text-gray-600 leading-tight whitespace-nowrap">{label}</span>
      </div>
    </motion.div>
  );
};



const ConversionPanel = ({ allValues, onConversionComplete }: ConversionPanelProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Referencias para los generadores
  const generatorUnidadesRef = useRef<HTMLDivElement | null>(null);
  const generatorDecenasRef = useRef<HTMLDivElement | null>(null);
  const generatorCentenasRef = useRef<HTMLDivElement | null>(null);
  const generatorMilesRef = useRef<HTMLDivElement | null>(null);

  // Contar fichas por tipo
  const countByType = (type: ValueType) =>
    allValues.filter((v) => v.type === type).length;

  const [counts, setCounts] = useState({
    unidades: countByType("unidades"),
    decenas: countByType("decenas"),
    centenas: countByType("centenas"),
    miles: countByType("miles"),
  });
  
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
  
  // Fichas acumuladas en la zona de conversión, agrupadas por tipo
  const [conversionZoneValues, setConversionZoneValues] = useState<Array<{ type: ValueType }>>([]);

  // Verificar si necesita conversión
  const needsConversion = useCallback(() => {
    return (
      counts.unidades > 9 || counts.decenas > 9 || counts.centenas > 9
    );
  }, [counts]);

  // Manejar cuando se suelta una ficha en la zona de conversión
  const handleTileDrop = (_id: string, type: ValueType) => {
    // Verificar si aún quedan fichas de este tipo
    if (counts[type] <= 0) {
      toast.error('No quedan más fichas de este tipo', { duration: 2000 });
      return;
    }
    
    // Agregar la ficha a la zona de conversión
    setConversionZoneValues(prev => [...prev, { type }]);
    
    // Reducir el contador
    setCounts(prev => ({
      ...prev,
      [type]: prev[type] - 1
    }));
    
    // Generar una nueva ficha sobre el generador si aún quedan
    if (counts[type] > 1) {
      const newTileId = `${type}-${Date.now()}`;
      setActiveTiles(prev => ({
        ...prev,
        [type]: newTileId
      }));
    }
  };

  // Lanzar confeti cuando se complete
  const launchConfetti = useCallback(() => {
    const duration = 2000;
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
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  // Verificar si hay 10 fichas del mismo tipo en la zona de conversión
  useEffect(() => {
    const countInZone = (type: ValueType) => 
      conversionZoneValues.filter((v) => v.type === type).length;
    
    // Verificar cada tipo (excepto miles)
    const types: Array<"unidades" | "decenas" | "centenas"> = ["unidades", "decenas", "centenas"];
    
    for (const type of types) {
      const count = countInZone(type);
      if (count >= 10) {
        // Realizar conversión automática
        const sets = Math.floor(count / 10);
        const remaining = count % 10;
        
        const nextTypeMap = {
          unidades: "decenas",
          decenas: "centenas",
          centenas: "miles",
        } as const;
        
        const nextType = nextTypeMap[type];
        
        // Remover las 10 fichas de la zona de conversión
        const newZoneValues = conversionZoneValues.filter((v) => v.type !== type);
        // Agregar las fichas restantes
        for (let i = 0; i < remaining; i++) {
          newZoneValues.push({ type });
        }
        setConversionZoneValues(newZoneValues);
        
        // Actualizar contadores agregando al siguiente tipo
        setCounts((prev) => ({
          ...prev,
          [nextType]: prev[nextType] + sets,
        }));
        
        // Generar nueva ficha del siguiente tipo si es necesario
        const newTileId = `${nextType}-${Date.now()}`;
        setActiveTiles(prev => ({
          ...prev,
          [nextType]: newTileId
        }));
        
        toast.success(`¡Convertido! ${sets} ${type} → ${sets} ${nextType}`, {
          duration: 2000,
        });
        
        // Solo procesar una conversión a la vez
        break;
      }
    }
  }, [conversionZoneValues]);

  // Verificar si se completó la conversión (todos los contadores < 10 excepto miles)
  useEffect(() => {
    if (!needsConversion() && conversionZoneValues.length === 0) {
      // Generar array final de valores
      const finalValues: Array<{ type: ValueType }> = [
        ...Array(counts.unidades).fill({ type: "unidades" }),
        ...Array(counts.decenas).fill({ type: "decenas" }),
        ...Array(counts.centenas).fill({ type: "centenas" }),
        ...Array(counts.miles).fill({ type: "miles" }),
      ];

      launchConfetti();
      
      setTimeout(() => {
        onConversionComplete(finalValues);
      }, 1000);
    }
  }, [counts, conversionZoneValues.length, needsConversion, onConversionComplete, launchConfetti]);

  const colors = {
    unidades: "#10b981",
    decenas: "#3b82f6",
    centenas: "#f59e0b",
    miles: "#ef4444",
  };

  const labels = {
    unidades: "Unidades",
    decenas: "Decenas",
    centenas: "Centenas",
    miles: "Miles",
  };
  
  // Contar fichas en la zona de conversión por tipo
  const countInConversionZone = (type: ValueType) => 
    conversionZoneValues.filter((v) => v.type === type).length;

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 relative"
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      {/* Contenido principal sin scroll */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden" style={{ padding: 'clamp(0.25rem, 1vmin, 1rem)' }}>
        {/* Fila superior: Header + Generadores (en móvil vertical, en desktop horizontal) */}
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          {/* Header compacto */}
          <Card className="p-1.5 sm:p-2 gap-0.5 sm:flex-1 flex flex-col justify-center">
            <h1 className="text-sm sm:text-lg font-bold text-center text-gray-800 leading-tight">
              Panel de Conversión
            </h1>
            <p className="text-[10px] sm:text-xs text-center text-gray-600 leading-tight">
              Arrastra 10 fichas a la zona amarilla
            </p>
          </Card>

          {/* Generadores de fichas - más compactos */}
          <div className="bg-white rounded-lg p-2 sm:p-3 shadow-md flex-shrink-0 flex flex-col min-h-fit">
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-2 text-center flex-shrink-0">
              Fichas disponibles
            </h3>
            <div className="flex justify-center gap-0.5 sm:gap-1 items-end flex-shrink-0">
              <div ref={generatorMilesRef} className="relative">
                <GeneratorBase label={labels.miles} color={colors.miles} count={counts.miles} />
                {counts.miles > 0 && (
                  <DraggableTile
                    key={activeTiles.miles}
                    id={activeTiles.miles}
                    label={labels.miles}
                    color={colors.miles}
                    type="miles"
                    containerRef={containerRef}
                    generatorRef={generatorMilesRef}
                    onDrop={handleTileDrop}
                  />
                )}
              </div>
              <div ref={generatorCentenasRef} className="relative">
                <GeneratorBase label={labels.centenas} color={colors.centenas} count={counts.centenas} />
                {counts.centenas > 0 && (
                  <DraggableTile
                    key={activeTiles.centenas}
                    id={activeTiles.centenas}
                    label={labels.centenas}
                    color={colors.centenas}
                    type="centenas"
                    containerRef={containerRef}
                    generatorRef={generatorCentenasRef}
                    onDrop={handleTileDrop}
                  />
                )}
              </div>
              <div ref={generatorDecenasRef} className="relative">
                <GeneratorBase label={labels.decenas} color={colors.decenas} count={counts.decenas} />
                {counts.decenas > 0 && (
                  <DraggableTile
                    key={activeTiles.decenas}
                    id={activeTiles.decenas}
                    label={labels.decenas}
                    color={colors.decenas}
                    type="decenas"
                    containerRef={containerRef}
                    generatorRef={generatorDecenasRef}
                    onDrop={handleTileDrop}
                  />
                )}
              </div>
              <div ref={generatorUnidadesRef} className="relative">
                <GeneratorBase label={labels.unidades} color={colors.unidades} count={counts.unidades} />
                {counts.unidades > 0 && (
                  <DraggableTile
                    key={activeTiles.unidades}
                    id={activeTiles.unidades}
                    label={labels.unidades}
                    color={colors.unidades}
                    type="unidades"
                    containerRef={containerRef}
                    generatorRef={generatorUnidadesRef}
                    onDrop={handleTileDrop}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zona de conversión única - ocupa el espacio restante */}
        <Card 
          id="conversion-zone"
          className="flex-1 border-2 border-dashed border-yellow-400 bg-yellow-50 flex flex-col overflow-auto min-h-0"
          style={{ padding: 'clamp(0.25rem, 1vmin, 1rem)' }}
        >
          <h3 className="text-xs sm:text-base font-semibold text-center text-yellow-700 mb-1 flex-shrink-0">
            Zona de Conversión
          </h3>
          <div className="text-center flex-shrink-0">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">
              Arrastra aquí 10 fichas del mismo tipo
            </p>
            {conversionZoneValues.length > 0 && (
              <div className="mt-0.5 space-y-0.5">
                {countInConversionZone("miles") > 0 && (
                  <div className="text-[10px] sm:text-xs font-semibold" style={{ color: colors.miles }}>
                    Miles: {countInConversionZone("miles")}
                  </div>
                )}
                {countInConversionZone("centenas") > 0 && (
                  <div className="text-[10px] sm:text-xs font-semibold" style={{ color: colors.centenas }}>
                    Centenas: {countInConversionZone("centenas")}
                    {countInConversionZone("centenas") >= 10 && " ✓"}
                  </div>
                )}
                {countInConversionZone("decenas") > 0 && (
                  <div className="text-[10px] sm:text-xs font-semibold" style={{ color: colors.decenas }}>
                    Decenas: {countInConversionZone("decenas")}
                    {countInConversionZone("decenas") >= 10 && " ✓"}
                  </div>
                )}
                {countInConversionZone("unidades") > 0 && (
                  <div className="text-[10px] sm:text-xs font-semibold" style={{ color: colors.unidades }}>
                    Unidades: {countInConversionZone("unidades")}
                    {countInConversionZone("unidades") >= 10 && " ✓"}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConversionPanel;
