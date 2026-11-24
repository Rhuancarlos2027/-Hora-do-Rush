import React from 'react';

interface OrganicDripSpot {
  id: string;
  left: string;
  width: number;
  height: number;
  fill: string;
  highlight: string;
  path: string;
  highlights: { x: number; y: number; w: number; h: number }[];
  droplets: { cx: number; cy: number; r: number }[];
  desktopOnly?: boolean;
}

const TOP_PAINT_SPOTS: OrganicDripSpot[] = [
  {
    id: 'paint-red',
    left: '1.5%',
    width: 140,
    height: 170,
    fill: '#EF4444',
    highlight: '#FCA5A5',
    path: 'M 0 0 L 140 0 L 140 16 C 128 16, 124 30, 124 44 L 124 72 C 124 82, 108 82, 108 72 L 108 38 C 108 24, 92 24, 92 38 L 92 118 C 92 132, 70 132, 70 118 L 70 42 C 70 26, 52 26, 52 42 L 52 88 C 52 100, 34 100, 34 88 L 34 32 C 34 20, 14 20, 14 34 L 14 60 C 14 70, 0 70, 0 58 Z',
    highlights: [
      { x: 75, y: 42, w: 5, h: 70 },
      { x: 38, y: 36, w: 4, h: 46 },
      { x: 112, y: 36, w: 4, h: 32 },
    ],
    droplets: [
      { cx: 81, cy: 148, r: 7 },
      { cx: 43, cy: 115, r: 4.5 },
    ],
  },
  {
    id: 'paint-sky',
    left: '14%',
    width: 118,
    height: 120,
    fill: '#38BDF8',
    highlight: '#BAE6FD',
    path: 'M 0 0 L 118 0 L 118 14 C 106 14, 102 26, 102 40 L 102 64 C 102 74, 86 74, 86 64 L 86 30 C 86 18, 68 18, 68 32 L 68 92 C 68 104, 48 104, 48 92 L 48 34 C 48 20, 30 20, 30 34 L 30 56 C 30 66, 14 66, 14 56 L 14 24 C 14 14, 4 14, 0 14 Z',
    highlights: [
      { x: 53, y: 34, w: 4.5, h: 52 },
      { x: 90, y: 32, w: 3.5, h: 28 },
    ],
    droplets: [{ cx: 58, cy: 114, r: 5 }],
    desktopOnly: true,
  },
  {
    id: 'paint-sun',
    left: '28%',
    width: 110,
    height: 82,
    fill: '#FACC15',
    highlight: '#FEF08A',
    path: 'M 0 0 L 110 0 L 110 12 C 98 12, 94 22, 94 34 L 94 48 C 94 58, 78 58, 78 48 L 78 26 C 78 16, 62 16, 62 28 L 62 62 C 62 72, 44 72, 44 62 L 44 26 C 44 16, 28 16, 28 28 L 28 42 C 28 52, 12 52, 12 42 L 12 18 C 12 12, 4 12, 0 12 Z',
    highlights: [
      { x: 48, y: 26, w: 4, h: 32 },
      { x: 82, y: 26, w: 3.5, h: 18 },
    ],
    droplets: [],
  },
  {
    id: 'paint-mint',
    left: '44%',
    width: 112,
    height: 78,
    fill: '#34D399',
    highlight: '#A7F3D0',
    path: 'M 0 0 L 112 0 L 112 12 C 100 12, 96 24, 96 36 L 96 52 C 96 62, 80 62, 80 52 L 80 24 C 80 14, 62 14, 62 26 L 62 44 C 62 54, 46 54, 46 44 L 46 28 C 46 16, 28 16, 28 30 L 28 58 C 28 68, 12 68, 12 58 L 12 20 C 12 12, 4 12, 0 12 Z',
    highlights: [
      { x: 16, y: 26, w: 3.5, h: 28 },
      { x: 84, y: 26, w: 3.5, h: 22 },
    ],
    droplets: [],
    desktopOnly: true,
  },
  {
    id: 'paint-pink',
    left: '60%',
    width: 112,
    height: 86,
    fill: '#F472B6',
    highlight: '#FBCFE8',
    path: 'M 0 0 L 112 0 L 112 12 C 98 12, 94 24, 94 38 L 94 56 C 94 66, 78 66, 78 56 L 78 26 C 78 16, 60 16, 60 28 L 60 66 C 60 76, 42 76, 42 66 L 42 26 C 42 16, 24 16, 24 28 L 24 44 C 24 54, 10 54, 10 44 L 10 18 C 10 12, 4 12, 0 12 Z',
    highlights: [
      { x: 46, y: 28, w: 4, h: 34 },
      { x: 82, y: 28, w: 3.5, h: 24 },
    ],
    droplets: [],
  },
  {
    id: 'paint-orange',
    left: '74%',
    width: 122,
    height: 132,
    fill: '#FB923C',
    highlight: '#FED7AA',
    path: 'M 0 0 L 122 0 L 122 14 C 110 14, 106 28, 106 42 L 106 72 C 106 82, 88 82, 88 72 L 88 34 C 88 20, 70 20, 70 34 L 70 100 C 70 112, 50 112, 50 100 L 50 32 C 50 18, 32 18, 32 32 L 32 62 C 32 72, 14 72, 14 62 L 14 24 C 14 14, 4 14, 0 14 Z',
    highlights: [
      { x: 55, y: 36, w: 4.5, h: 58 },
      { x: 92, y: 36, w: 3.5, h: 32 },
    ],
    droplets: [{ cx: 60, cy: 124, r: 5.5 }],
    desktopOnly: true,
  },
  {
    id: 'paint-grape',
    left: '87.5%',
    width: 140,
    height: 175,
    fill: '#A78BFA',
    highlight: '#DDD6FE',
    path: 'M 0 0 L 140 0 L 140 62 C 140 74, 124 74, 124 62 L 124 34 C 124 20, 106 20, 106 34 L 106 104 C 106 116, 88 116, 88 104 L 88 38 C 88 22, 68 22, 68 38 L 68 128 C 68 142, 46 142, 46 128 L 46 36 C 46 22, 28 22, 28 36 L 28 76 C 28 86, 12 86, 12 76 L 12 24 C 12 14, 4 14, 0 14 Z',
    highlights: [
      { x: 51, y: 40, w: 5, h: 80 },
      { x: 92, y: 40, w: 4, h: 58 },
    ],
    droplets: [
      { cx: 57, cy: 158, r: 7 },
      { cx: 97, cy: 130, r: 4.5 },
    ],
  },
];

export const PaintDripBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white"
    >
      {/* Top Separate Paint Drips below TopBar */}
      <div className="absolute top-16 inset-x-0 h-48">
        {TOP_PAINT_SPOTS.map((spot) => (
          <svg
            key={spot.id}
            viewBox={`0 0 ${spot.width} ${spot.height}`}
            style={{
              left: spot.left,
              width: `${spot.width}px`,
              height: `${spot.height}px`,
            }}
            className={`absolute top-0 ${
              spot.desktopOnly ? 'hidden md:block' : 'block'
            } max-w-[26vw] sm:max-w-none`}
          >
            <path d={spot.path} fill={spot.fill} />
            {spot.highlights.map((h, i) => (
              <rect
                key={i}
                x={h.x}
                y={h.y}
                width={h.w}
                height={h.h}
                rx={h.w / 2}
                fill={spot.highlight}
                opacity={0.75}
              />
            ))}
            {spot.droplets.map((d, i) => (
              <g key={i}>
                <circle cx={d.cx} cy={d.cy} r={d.r} fill={spot.fill} />
                <circle
                  cx={d.cx - d.r * 0.3}
                  cy={d.cy - d.r * 0.3}
                  r={d.r * 0.28}
                  fill={spot.highlight}
                  opacity={0.85}
                />
              </g>
            ))}
          </svg>
        ))}
      </div>

      {/* Left-Edge Separate Teal & Lime Drips (desktop side margin framing) */}
      <svg
        viewBox="0 0 90 220"
        className="hidden xl:block absolute top-1/2 -translate-y-1/2 left-0 w-16 h-auto opacity-90"
      >
        <path
          d="M 0 18 C 22 18, 22 36, 36 36 L 54 36 C 64 36, 64 52, 54 52 L 24 52 C 14 52, 14 70, 26 70 L 68 70 C 78 70, 78 88, 68 88 L 28 88 C 16 88, 16 106, 28 106 L 44 106 C 54 106, 54 122, 44 122 L 0 122 Z"
          fill="#2DD4BF"
        />
        <circle cx={82} cy={79} r={5} fill="#2DD4BF" />
        <path
          d="M 0 144 L 34 144 C 44 144, 44 160, 34 160 L 18 160 C 10 160, 10 176, 20 176 L 48 176 C 58 176, 58 192, 48 192 L 0 192 Z"
          fill="#A3E635"
        />
      </svg>

      {/* Right-Edge Separate Cobalt & Coral Drips (desktop side margin framing) */}
      <svg
        viewBox="0 0 90 220"
        className="hidden xl:block absolute top-1/2 -translate-y-1/2 right-0 w-16 h-auto opacity-90"
      >
        <path
          d="M 90 20 L 42 20 C 32 20, 32 36, 42 36 L 64 36 C 74 36, 74 54, 62 54 L 22 54 C 12 54, 12 72, 22 72 L 58 72 C 70 72, 70 90, 58 90 L 44 90 C 34 90, 34 106, 44 106 L 90 106 Z"
          fill="#60A5FA"
        />
        <circle cx={8} cy={63} r={5} fill="#60A5FA" />
        <path
          d="M 90 138 L 52 138 C 42 138, 42 154, 52 154 L 70 154 C 78 154, 78 170, 68 170 L 38 170 C 28 170, 28 186, 38 186 L 90 186 Z"
          fill="#FB7185"
        />
      </svg>

      {/* Bottom Corner Separate Paint Pools & Splatters */}
      <svg
        viewBox="0 0 220 160"
        className="absolute bottom-0 left-0 w-40 sm:w-52 h-auto opacity-90"
      >
        <path
          d="M -8 165 L -8 104 C 14 96, 32 110, 42 124 C 52 138, 72 122, 88 134 C 102 146, 120 144, 134 165 Z"
          fill="#60A5FA"
        />
        <circle cx={42} cy={88} r={8.5} fill="#60A5FA" />
        <circle cx={39} cy={85} r={2.5} fill="#BFDBFE" opacity={0.85} />
        <circle cx={148} cy={136} r={10} fill="#FACC15" />
        <circle cx={145} cy={133} r={3} fill="#FEF08A" opacity={0.85} />
        <circle cx={170} cy={148} r={5} fill="#FACC15" />
      </svg>

      <svg
        viewBox="0 0 220 160"
        className="absolute bottom-0 right-0 w-40 sm:w-52 h-auto opacity-90"
      >
        <path
          d="M 228 165 L 228 102 C 204 94, 186 112, 174 126 C 162 140, 142 126, 126 140 C 110 152, 92 148, 80 165 Z"
          fill="#34D399"
        />
        <circle cx={176} cy={86} r={8.5} fill="#34D399" />
        <circle cx={173} cy={83} r={2.5} fill="#A7F3D0" opacity={0.85} />
        <circle cx={68} cy={134} r={10} fill="#EF4444" />
        <circle cx={65} cy={131} r={3} fill="#FCA5A5" opacity={0.85} />
        <circle cx={46} cy={148} r={5} fill="#EF4444" />
      </svg>
    </div>
  );
};
