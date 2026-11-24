import React from 'react';
import { Vehicle, VehicleColorKey } from '../types/game';

interface ColorPalette {
  body: string;
  roof: string;
  border: string;
  accent: string;
  shadow: string;
}

export const VEHICLE_PALETTES: Record<VehicleColorKey, ColorPalette> = {
  red: {
    body: '#EF4444',
    roof: '#FCA5A5',
    border: '#B91C1C',
    accent: '#FEF08A',
    shadow: 'rgba(220, 38, 38, 0.30)',
  },
  sun: {
    body: '#FACC15',
    roof: '#FEF08A',
    border: '#CA8A04',
    accent: '#713F12',
    shadow: 'rgba(202, 138, 4, 0.25)',
  },
  sky: {
    body: '#38BDF8',
    roof: '#BAE6FD',
    border: '#0284C7',
    accent: '#E0F2FE',
    shadow: 'rgba(2, 132, 199, 0.24)',
  },
  mint: {
    body: '#34D399',
    roof: '#A7F3D0',
    border: '#059669',
    accent: '#ECFDF5',
    shadow: 'rgba(5, 150, 105, 0.24)',
  },
  orange: {
    body: '#FB923C',
    roof: '#FED7AA',
    border: '#C2410C',
    accent: '#FFF7ED',
    shadow: 'rgba(194, 65, 12, 0.24)',
  },
  grape: {
    body: '#A78BFA',
    roof: '#DDD6FE',
    border: '#6D28D9',
    accent: '#F5F3FF',
    shadow: 'rgba(109, 40, 217, 0.24)',
  },
  pink: {
    body: '#F472B6',
    roof: '#FBCFE8',
    border: '#BE185D',
    accent: '#FDF2F8',
    shadow: 'rgba(190, 24, 93, 0.24)',
  },
  teal: {
    body: '#2DD4BF',
    roof: '#99F6E4',
    border: '#0F766E',
    accent: '#F0FDFA',
    shadow: 'rgba(15, 118, 110, 0.24)',
  },
  lime: {
    body: '#A3E635',
    roof: '#D9F99D',
    border: '#4D7C0F',
    accent: '#F7FEE7',
    shadow: 'rgba(77, 124, 15, 0.24)',
  },
  cobalt: {
    body: '#60A5FA',
    roof: '#BFDBFE',
    border: '#1D4ED8',
    accent: '#EFF6FF',
    shadow: 'rgba(29, 78, 216, 0.24)',
  },
  coral: {
    body: '#FB7185',
    roof: '#FECDD3',
    border: '#BE123C',
    accent: '#FFF1F2',
    shadow: 'rgba(190, 18, 60, 0.24)',
  },
  indigo: {
    body: '#818CF8',
    roof: '#C7D2FE',
    border: '#4338CA',
    accent: '#EEF2FF',
    shadow: 'rgba(67, 56, 202, 0.24)',
  },
};

interface VehicleSpriteProps {
  vehicle: Vehicle;
  isSelected: boolean;
  isHinted: boolean;
  hintDirection?: 'left' | 'right' | 'up' | 'down';
}

export const VehicleSprite: React.FC<VehicleSpriteProps> = ({
  vehicle,
  isSelected,
  isHinted,
  hintDirection,
}) => {
  const palette = VEHICLE_PALETTES[vehicle.color];
  const isH = vehicle.orientation === 'H';
  const isLong = vehicle.length === 3;

  // Render an expressive top-down SVG toy vehicle oriented along its axis
  const viewW = isH ? (isLong ? 180 : 120) : 60;
  const viewH = isH ? 60 : isLong ? 180 : 120;

  return (
    <div
      className={`relative w-full h-full select-none transition-shadow duration-150 rounded-2xl ${
        isSelected
          ? 'ring-4 ring-slate-900/80 ring-offset-2 ring-offset-white'
          : isHinted
          ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white'
          : ''
      }`}
      style={{
        filter: `drop-shadow(0 5px 8px ${palette.shadow})`,
      }}
    >
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        {isH ? (
          <g>
            {/* Tires */}
            <rect x={14} y={2} width={18} height={6} rx={3} fill="#1E293B" />
            <rect x={14} y={52} width={18} height={6} rx={3} fill="#1E293B" />
            <rect x={viewW - 32} y={2} width={18} height={6} rx={3} fill="#1E293B" />
            <rect x={viewW - 32} y={52} width={18} height={6} rx={3} fill="#1E293B" />
            {isLong && (
              <>
                <rect x={viewW / 2 - 9} y={2} width={18} height={6} rx={3} fill="#1E293B" />
                <rect x={viewW / 2 - 9} y={52} width={18} height={6} rx={3} fill="#1E293B" />
              </>
            )}

            {/* Chassis */}
            <rect
              x={4}
              y={6}
              width={viewW - 8}
              height={48}
              rx={14}
              fill={palette.body}
              stroke={palette.border}
              strokeWidth={3}
            />

            {/* Hero racing stripe & star */}
            {vehicle.isHero && (
              <>
                <rect x={8} y={26} width={viewW - 18} height={8} rx={4} fill="#FFFFFF" opacity={0.92} />
                <circle cx={viewW - 18} cy={30} r={4} fill="#FEF08A" />
              </>
            )}

            {/* Cabin / Roof */}
            {isLong ? (
              <>
                {/* Bus / Truck Cargo Roof */}
                <rect
                  x={16}
                  y={12}
                  width={viewW - 56}
                  height={36}
                  rx={8}
                  fill={palette.roof}
                  stroke={palette.border}
                  strokeWidth={2}
                />
                {/* Windshield front right */}
                <path
                  d={`M ${viewW - 36} 13 L ${viewW - 22} 16 L ${viewW - 22} 44 L ${viewW - 36} 47 Z`}
                  fill="#0F172A"
                  opacity={0.78}
                />
                {/* Roof vents */}
                <rect x={30} y={21} width={20} height={18} rx={4} fill={palette.body} opacity={0.35} />
                <rect x={68} y={21} width={20} height={18} rx={4} fill={palette.body} opacity={0.35} />
              </>
            ) : (
              <>
                {/* Car / Van Windshield & Rear Glass */}
                <rect
                  x={28}
                  y={13}
                  width={54}
                  height={34}
                  rx={10}
                  fill="#0F172A"
                  opacity={0.82}
                />
                {/* Roof top */}
                <rect
                  x={35}
                  y={16}
                  width={34}
                  height={28}
                  rx={8}
                  fill={vehicle.isHero ? '#FFFFFF' : palette.roof}
                  stroke={palette.border}
                  strokeWidth={1.5}
                />
                {vehicle.isHero && (
                  <path
                    d="M 52 21 L 54.4 26 L 60 26.6 L 55.8 30.4 L 56.9 35.8 L 52 33 L 47.1 35.8 L 48.2 30.4 L 44 26.6 L 49.6 26 Z"
                    fill="#EF4444"
                  />
                )}
              </>
            )}

            {/* Headlights (facing right for H vehicles) */}
            <rect x={viewW - 9} y={13} width={5} height={10} rx={2.5} fill="#FEF08A" stroke="#CA8A04" strokeWidth={1} />
            <rect x={viewW - 9} y={37} width={5} height={10} rx={2.5} fill="#FEF08A" stroke="#CA8A04" strokeWidth={1} />
            {/* Taillights */}
            <rect x={4} y={14} width={4} height={8} rx={2} fill="#FEE2E2" opacity={0.85} />
            <rect x={4} y={38} width={4} height={8} rx={2} fill="#FEE2E2" opacity={0.85} />
          </g>
        ) : (
          <g>
            {/* Vertical Tires */}
            <rect x={2} y={14} width={6} height={18} rx={3} fill="#1E293B" />
            <rect x={52} y={14} width={6} height={18} rx={3} fill="#1E293B" />
            <rect x={2} y={viewH - 32} width={6} height={18} rx={3} fill="#1E293B" />
            <rect x={52} y={viewH - 32} width={6} height={18} rx={3} fill="#1E293B" />
            {isLong && (
              <>
                <rect x={2} y={viewH / 2 - 9} width={6} height={18} rx={3} fill="#1E293B" />
                <rect x={52} y={viewH / 2 - 9} width={6} height={18} rx={3} fill="#1E293B" />
              </>
            )}

            {/* Vertical Chassis */}
            <rect
              x={6}
              y={4}
              width={48}
              height={viewH - 8}
              rx={14}
              fill={palette.body}
              stroke={palette.border}
              strokeWidth={3}
            />

            {isLong ? (
              <>
                <rect
                  x={12}
                  y={36}
                  width={36}
                  height={viewH - 54}
                  rx={8}
                  fill={palette.roof}
                  stroke={palette.border}
                  strokeWidth={2}
                />
                {/* Top windshield */}
                <path
                  d="M 13 34 L 16 20 L 44 20 L 47 34 Z"
                  fill="#0F172A"
                  opacity={0.78}
                />
                <rect x={21} y={54} width={18} height={22} rx={4} fill={palette.body} opacity={0.35} />
                <rect x={21} y={92} width={18} height={22} rx={4} fill={palette.body} opacity={0.35} />
              </>
            ) : (
              <>
                <rect
                  x={13}
                  y={28}
                  width={34}
                  height={56}
                  rx={10}
                  fill="#0F172A"
                  opacity={0.82}
                />
                <rect
                  x={16}
                  y={38}
                  width={28}
                  height={34}
                  rx={8}
                  fill={palette.roof}
                  stroke={palette.border}
                  strokeWidth={1.5}
                />
              </>
            )}

            {/* Headlights (facing up) */}
            <rect x={13} y={4} width={10} height={5} rx={2.5} fill="#FEF08A" stroke="#CA8A04" strokeWidth={1} />
            <rect x={37} y={4} width={10} height={5} rx={2.5} fill="#FEF08A" stroke="#CA8A04" strokeWidth={1} />
            {/* Taillights */}
            <rect x={14} y={viewH - 8} width={8} height={4} rx={2} fill="#FEE2E2" opacity={0.85} />
            <rect x={38} y={viewH - 8} width={8} height={4} rx={2} fill="#FEE2E2" opacity={0.85} />
          </g>
        )}
      </svg>

      {/* Hint directional overlay */}
      {isHinted && hintDirection && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 shadow-md flex items-center justify-center font-bold text-lg border-2 border-white">
            {hintDirection === 'right' && '→'}
            {hintDirection === 'left' && '←'}
            {hintDirection === 'up' && '↑'}
            {hintDirection === 'down' && '↓'}
          </div>
        </div>
      )}
    </div>
  );
};
