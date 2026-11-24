import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { HintSuggestion, Vehicle } from '../types/game';
import { EXIT_ROW, GRID_SIZE, getValidSlideBounds } from '../utils/solver';
import { VehicleSprite } from './VehicleSprite';

interface GameBoardProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  hint: HintSuggestion | null;
  isExitingWin: boolean;
  onSelectVehicle: (id: string) => void;
  onMoveVehicle: (vehicleId: string, newRow: number, newCol: number) => void;
}

interface DragState {
  vehicleId: string;
  orientation: 'H' | 'V';
  startClientX: number;
  startClientY: number;
  origRow: number;
  origCol: number;
  minPos: number;
  maxPos: number;
  deltaPx: number;
  cellPx: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  vehicles,
  selectedVehicleId,
  hint,
  isExitingWin,
  onSelectVehicle,
  onMoveVehicle,
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    vehicle: Vehicle
  ) => {
    if (isExitingWin) return;
    e.preventDefault();
    e.stopPropagation();

    onSelectVehicle(vehicle.id);

    const gridEl = gridRef.current;
    if (!gridEl) return;

    const rect = gridEl.getBoundingClientRect();
    const cellPx = rect.width / GRID_SIZE;
    const [minPos, maxPos] = getValidSlideBounds(vehicles, vehicle.id);

    e.currentTarget.setPointerCapture(e.pointerId);

    setDrag({
      vehicleId: vehicle.id,
      orientation: vehicle.orientation,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origRow: vehicle.row,
      origCol: vehicle.col,
      minPos,
      maxPos,
      deltaPx: 0,
      cellPx,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const rawDelta =
      drag.orientation === 'H'
        ? e.clientX - drag.startClientX
        : e.clientY - drag.startClientY;

    const origPos = drag.orientation === 'H' ? drag.origCol : drag.origRow;
    const minPx = (drag.minPos - origPos) * drag.cellPx;
    const maxPx = (drag.maxPos - origPos) * drag.cellPx;
    const clampedPx = Math.max(minPx, Math.min(maxPx, rawDelta));

    setDrag((prev) => (prev ? { ...prev, deltaPx: clampedPx } : null));
  };

  const finishDrag = () => {
    if (!drag) return;
    const origPos = drag.orientation === 'H' ? drag.origCol : drag.origRow;
    const stepDelta = Math.round(drag.deltaPx / drag.cellPx);
    const targetPos = Math.max(
      drag.minPos,
      Math.min(drag.maxPos, origPos + stepDelta)
    );

    const vId = drag.vehicleId;
    const isH = drag.orientation === 'H';
    const nextRow = isH ? drag.origRow : targetPos;
    const nextCol = isH ? targetPos : drag.origCol;

    setDrag(null);

    if (nextRow !== drag.origRow || nextCol !== drag.origCol) {
      onMoveVehicle(vId, nextRow, nextCol);
    }
  };

  useEffect(() => {
    const cancel = () => setDrag(null);
    window.addEventListener('blur', cancel);
    return () => window.removeEventListener('blur', cancel);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full">
      {/* Outer Toy Parking Frame */}
      <div className="relative bg-slate-100 border-2 border-slate-200 rounded-3xl p-3 sm:p-4 shadow-sm w-full max-w-[460px] aspect-square">
        {/* Exit Gate Cutout on the Right Wall at Row 2 */}
        <div
          className="absolute -right-2 sm:-right-3 z-20 flex items-center justify-center pointer-events-none"
          style={{
            top: `calc(${(EXIT_ROW / GRID_SIZE) * 100}% + 10px)`,
            height: `calc(${(1 / GRID_SIZE) * 100}% - 20px)`,
          }}
        >
          <div className="flex items-center gap-1 bg-emerald-500 text-white font-display font-bold text-xs px-2.5 py-1.5 rounded-r-xl shadow-md border-2 border-white">
            <span>SAÍDA</span>
            <ArrowRight className="w-3.5 h-3.5 animate-exit-arrow" />
          </div>
        </div>

        {/* 6x6 Interactive Grid Container */}
        <div
          ref={gridRef}
          className="relative w-full h-full bg-slate-200/70 rounded-2xl p-1 overflow-visible"
        >
          {/* Background Parking Slots */}
          <div className="grid grid-cols-6 grid-rows-6 w-full h-full gap-1.5">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const r = Math.floor(idx / GRID_SIZE);
              const c = idx % GRID_SIZE;
              const isExitLane = r === EXIT_ROW;

              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-colors ${
                    isExitLane
                      ? 'bg-red-50/70 border-red-200/70'
                      : 'bg-white border-slate-200/80'
                  } flex items-center justify-center`}
                >
                  {isExitLane && c === GRID_SIZE - 1 && (
                    <span className="text-red-300 text-sm font-bold select-none" aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Vehicle Layer */}
          <div className="absolute inset-1 pointer-events-none">
            {vehicles.map((vehicle) => {
              const isDragging = drag?.vehicleId === vehicle.id;
              const isSelected = selectedVehicleId === vehicle.id;
              const isHinted = hint?.vehicleId === vehicle.id;

              const leftPct = (vehicle.col / GRID_SIZE) * 100;
              const topPct = (vehicle.row / GRID_SIZE) * 100;
              const widthPct =
                vehicle.orientation === 'H'
                  ? (vehicle.length / GRID_SIZE) * 100
                  : (1 / GRID_SIZE) * 100;
              const heightPct =
                vehicle.orientation === 'V'
                  ? (vehicle.length / GRID_SIZE) * 100
                  : (1 / GRID_SIZE) * 100;

              let translateX = isDragging && drag.orientation === 'H' ? `${drag.deltaPx}px` : '0px';
              const translateY = isDragging && drag.orientation === 'V' ? `${drag.deltaPx}px` : '0px';

              if (isExitingWin && vehicle.isHero) {
                translateX = '140%';
              }

              return (
                <div
                  key={vehicle.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${vehicle.isHero ? 'Carro Vermelho Principal' : 'Veículo ' + vehicle.id} na linha ${vehicle.row + 1}, coluna ${vehicle.col + 1}, orientação ${vehicle.orientation === 'H' ? 'horizontal' : 'vertical'}`}
                  onPointerDown={(e) => handlePointerDown(e, vehicle)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={finishDrag}
                  onPointerCancel={finishDrag}
                  onClick={() => onSelectVehicle(vehicle.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectVehicle(vehicle.id);
                    }
                  }}
                  className={`pointer-events-auto absolute p-1 cursor-grab active:cursor-grabbing touch-none focus-visible:outline-none ${
                    isDragging ? 'z-30' : isSelected ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                    transform: `translate3d(${translateX}, ${translateY}, 0)`,
                    transition: isDragging
                      ? 'none'
                      : isExitingWin && vehicle.isHero
                      ? 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1), left 160ms cubic-bezier(0.16, 1, 0.3, 1), top 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <VehicleSprite
                    vehicle={vehicle}
                    isSelected={isSelected}
                    isHinted={isHinted}
                    hintDirection={isHinted ? hint?.direction : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
