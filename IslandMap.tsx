import React from 'react';
import { LocationId, LocationInfo } from '../types/game';
import { LOCATIONS } from '../data/locations';
import { Lock, Check, Sparkles } from 'lucide-react';

interface IslandMapProps {
  currentLocationId: LocationId;
  solvedLocations: LocationId[];
  onSelectLocation: (id: LocationId) => void;
}

// Coordinate mapping onto a 1000 x 620 SVG canvas
const NODE_COORDINATES: Record<LocationId, { x: number; y: number }> = {
  beach: { x: 170, y: 490 },
  jungle: { x: 270, y: 280 },
  cave: { x: 490, y: 155 },
  waterfall: { x: 740, y: 260 },
  temple: { x: 560, y: 420 },
  chamber: { x: 830, y: 505 },
};

// Paths between consecutive locations
const PATH_SEGMENTS: Array<{ from: LocationId; to: LocationId; d: string }> = [
  {
    from: 'beach',
    to: 'jungle',
    d: 'M 170 490 C 190 390, 220 330, 270 280',
  },
  {
    from: 'jungle',
    to: 'cave',
    d: 'M 270 280 C 330 220, 410 170, 490 155',
  },
  {
    from: 'cave',
    to: 'waterfall',
    d: 'M 490 155 C 570 160, 660 200, 740 260',
  },
  {
    from: 'waterfall',
    to: 'temple',
    d: 'M 740 260 C 700 340, 640 380, 560 420',
  },
  {
    from: 'temple',
    to: 'chamber',
    d: 'M 560 420 C 630 460, 740 470, 830 505',
  },
];

export const IslandMap: React.FC<IslandMapProps> = ({
  currentLocationId,
  solvedLocations,
  onSelectLocation,
}) => {
  const explorerPos = NODE_COORDINATES[currentLocationId] || NODE_COORDINATES.beach;

  const getLocationStatus = (loc: LocationInfo) => {
    if (solvedLocations.includes(loc.id)) return 'completed';
    if (loc.id === currentLocationId) return 'current';
    // Check if previous location in sequence was solved
    const prevLoc = LOCATIONS[loc.order - 2];
    if (prevLoc && solvedLocations.includes(prevLoc.id)) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-900/60 bg-[#0284c7]">
      {/* Map Header Overlay Banner */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-amber-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-lg text-amber-100">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold tracking-wide uppercase">
          Isla de C: Mystery Map
        </span>
      </div>

      {/* SVG Interactive Island Map */}
      <svg
        viewBox="0 0 1000 620"
        className="w-full h-auto select-none"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="jungleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="45%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="70%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Filters */}
          <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ocean Background */}
        <rect width="1000" height="620" fill="url(#oceanGrad)" />

        {/* Ocean Waves Decor */}
        <g opacity="0.35" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M 60 90 Q 75 80, 90 90 Q 105 100, 120 90" />
          <path d="M 120 180 Q 135 170, 150 180 Q 165 190, 180 180" />
          <path d="M 40 400 Q 55 390, 70 400 Q 85 410, 100 400" />
          <path d="M 880 100 Q 895 90, 910 100 Q 925 110, 940 100" />
          <path d="M 850 240 Q 865 230, 880 240 Q 895 250, 910 240" />
          <path d="M 90 570 Q 105 560, 120 570 Q 135 580, 150 570" />
          <path d="M 500 590 Q 515 580, 530 590 Q 545 600, 560 590" />
        </g>

        {/* Little Sailboat and Dolphin in Bay */}
        <g transform="translate(80, 310) scale(0.7)" opacity="0.8">
          <path d="M 0 20 L 35 20 L 28 30 L 7 30 Z" fill="#78350f" />
          <path d="M 17 20 L 17 0 L 32 17 Z" fill="#f8fafc" />
          <path d="M 15 20 L 15 4 L 4 17 Z" fill="#fbbf24" />
        </g>
        <g transform="translate(860, 370) scale(0.6)" opacity="0.6">
          <path
            d="M 10 30 Q 30 5, 50 25 Q 40 22, 35 30 Z"
            fill="#0369a1"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />
        </g>

        {/* Compass Rose */}
        <g transform="translate(920, 65) scale(0.75)" opacity="0.85">
          <circle cx="0" cy="0" r="32" fill="#78350f" stroke="#fef08a" strokeWidth="2" />
          <circle cx="0" cy="0" r="28" fill="#451a03" />
          <polygon points="0,-24 5,-6 0,0 -5,-6" fill="#ef4444" />
          <polygon points="0,24 5,6 0,0 -5,6" fill="#fef08a" />
          <polygon points="24,0 6,5 0,0 6,-5" fill="#fef08a" />
          <polygon points="-24,0 -6,5 0,0 -6,-5" fill="#fef08a" />
          <text x="0" y="-12" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">N</text>
        </g>

        {/* Island Coastal Beach (Sandy rim) */}
        <path
          d="M 110 510 
             C 70 420, 120 280, 200 210
             C 270 150, 400 90, 510 85
             C 640 80, 780 130, 850 210
             C 930 300, 920 440, 880 520
             C 830 600, 680 590, 550 560
             C 420 530, 280 620, 180 580
             Z"
          fill="url(#sandGrad)"
          stroke="#ca8a04"
          strokeWidth="6"
          filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))"
        />

        {/* Island Interior: Jungle & Forests */}
        <path
          d="M 140 480 
             C 120 400, 160 280, 240 220
             C 310 170, 420 120, 520 120
             C 630 120, 750 160, 800 230
             C 870 320, 860 430, 820 490
             C 770 560, 650 540, 530 515
             C 400 490, 270 560, 190 530
             Z"
          fill="url(#jungleGrad)"
          stroke="#166534"
          strokeWidth="3"
        />

        {/* Mountain Ridge & Volcanic Peak in the North */}
        <path
          d="M 380 230
             L 470 110
             L 530 140
             L 600 120
             L 660 210
             C 580 240, 460 250, 380 230 Z"
          fill="url(#mountainGrad)"
          stroke="#1e293b"
          strokeWidth="2"
        />
        {/* Mountain Shading & Snow Caps */}
        <polygon points="470,110 455,140 485,140" fill="#f8fafc" opacity="0.9" />
        <polygon points="600,120 588,145 612,145" fill="#f8fafc" opacity="0.9" />

        {/* Waterfall Stream flowing from mountain to river */}
        <path
          d="M 640 170 
             Q 700 210, 735 250
             Q 760 300, 710 350
             Q 660 400, 680 460
             C 710 520, 790 550, 840 560"
          fill="none"
          stroke="url(#waterfallGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 640 170 
             Q 700 210, 735 250
             Q 760 300, 710 350
             Q 660 400, 680 460
             C 710 520, 790 550, 840 560"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeDasharray="8 6"
          strokeLinecap="round"
          className="animate-path-dash"
          opacity="0.8"
        />

        {/* Scenic Forest Trees & Foliage Sprinkles */}
        {/* Beach Palm Trees */}
        <g transform="translate(130, 440) scale(0.65)">
          <path d="M 20 60 Q 25 30, 30 10" stroke="#78350f" strokeWidth="6" fill="none" />
          <path d="M 30 10 Q 5 15, -5 25" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M 30 10 Q 15 -10, 10 -20" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M 30 10 Q 45 -10, 55 -15" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M 30 10 Q 55 15, 65 25" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g transform="translate(190, 520) scale(0.55)">
          <path d="M 20 60 Q 15 30, 20 10" stroke="#78350f" strokeWidth="6" fill="none" />
          <path d="M 20 10 Q -5 15, -15 20" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M 20 10 Q 5 -10, 5 -20" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M 20 10 Q 35 -10, 45 -15" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
          <path d="M 20 10 Q 45 15, 55 20" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Jungle Forest Trees */}
        <g transform="translate(230, 340) scale(0.6)">
          <circle cx="20" cy="20" r="18" fill="#14532d" />
          <circle cx="35" cy="15" r="16" fill="#15803d" />
          <circle cx="28" cy="30" r="15" fill="#166534" />
        </g>
        <g transform="translate(340, 270) scale(0.6)">
          <circle cx="20" cy="20" r="18" fill="#14532d" />
          <circle cx="35" cy="15" r="16" fill="#15803d" />
          <circle cx="28" cy="30" r="15" fill="#166534" />
        </g>
        <g transform="translate(430, 360) scale(0.7)">
          <circle cx="20" cy="20" r="20" fill="#14532d" />
          <circle cx="38" cy="16" r="18" fill="#15803d" />
          <circle cx="30" cy="32" r="17" fill="#166534" />
        </g>

        {/* Ancient Temple Ruins Stone Pillars in SVG */}
        <g transform="translate(530, 440) scale(0.7)" opacity="0.85">
          <rect x="0" y="20" width="60" height="8" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <rect x="5" y="0" width="50" height="6" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <rect x="8" y="6" width="8" height="14" fill="#94a3b8" />
          <rect x="26" y="6" width="8" height="14" fill="#94a3b8" />
          <rect x="44" y="6" width="8" height="14" fill="#94a3b8" />
          <polygon points="5,0 30,-15 55,0" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
        </g>

        {/* Treasure Vault Gold Piles in SVG */}
        <g transform="translate(805, 525) scale(0.75)">
          <circle cx="10" cy="15" r="7" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="20" cy="12" r="7" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="15" cy="8" r="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="28" cy="15" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          <rect x="12" y="10" width="16" height="12" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          <rect x="11" y="8" width="18" height="4" rx="1" fill="#f59e0b" />
        </g>

        {/* Dotted Paths connecting the 6 locations */}
        {PATH_SEGMENTS.map((seg, idx) => {
          const fromLoc = LOCATIONS.find((l) => l.id === seg.from);
          const toLoc = LOCATIONS.find((l) => l.id === seg.to);
          const isFromSolved = fromLoc && solvedLocations.includes(fromLoc.id);
          const isToActive = toLoc && toLoc.id === currentLocationId;
          const isFullActive = isFromSolved && isToActive;

          return (
            <g key={idx}>
              {/* Background Shadow line */}
              <path
                d={seg.d}
                fill="none"
                stroke="#0f172a"
                strokeWidth="5"
                opacity="0.3"
              />
              {/* Foreground Dotted Path */}
              <path
                d={seg.d}
                fill="none"
                stroke={
                  isFromSolved
                    ? '#10b981'
                    : isFullActive
                    ? '#f59e0b'
                    : '#94a3b8'
                }
                strokeWidth={isFullActive ? 4.5 : 3.5}
                strokeDasharray="8 8"
                strokeLinecap="round"
                className={isFullActive ? 'animate-path-dash' : ''}
                style={{
                  filter: isFullActive ? 'drop-shadow(0 0 6px rgba(245,158,11,0.8))' : 'none',
                }}
              />
            </g>
          );
        })}

        {/* 6 Location Nodes */}
        {LOCATIONS.map((loc) => {
          const coords = NODE_COORDINATES[loc.id];
          const status = getLocationStatus(loc);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';

          return (
            <g
              key={loc.id}
              transform={`translate(${coords.x}, ${coords.y})`}
              className={`cursor-pointer transition-transform duration-300 ${
                isLocked ? 'cursor-not-allowed' : 'hover:scale-110 active:scale-95'
              }`}
              onClick={() => {
                if (!isLocked) onSelectLocation(loc.id);
              }}
            >
              {/* Glow filter aura for active location */}
              {isCurrent && (
                <circle
                  cx="0"
                  cy="0"
                  r="36"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  className="animate-pulse-glow"
                  opacity="0.9"
                />
              )}

              {/* Node Outer Circle */}
              <circle
                cx="0"
                cy="0"
                r="24"
                fill={
                  isCompleted
                    ? '#059669'
                    : isCurrent
                    ? '#d97706'
                    : '#475569'
                }
                stroke={
                  isCompleted
                    ? '#34d399'
                    : isCurrent
                    ? '#fde68a'
                    : '#1e293b'
                }
                strokeWidth="3.5"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
              />

              {/* Node Inner Icon / Status */}
              {isCompleted ? (
                <g transform="translate(-10, -10)">
                  <Check className="w-5 h-5 text-white stroke-[3]" />
                </g>
              ) : isLocked ? (
                <g transform="translate(-8, -8)" opacity="0.8">
                  <Lock className="w-4 h-4 text-slate-300" />
                </g>
              ) : (
                /* Current Location Marker */
                <text
                  x="0"
                  y="6"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="16"
                  fontWeight="bold"
                >
                  {loc.order}
                </text>
              )}

              {/* Location Name Label Pill */}
              <g transform="translate(0, 36)">
                <rect
                  x="-65"
                  y="-12"
                  width="130"
                  height="22"
                  rx="6"
                  fill={
                    isCurrent
                      ? '#78350f'
                      : isCompleted
                      ? '#064e3b'
                      : '#0f172a'
                  }
                  stroke={
                    isCurrent
                      ? '#f59e0b'
                      : isCompleted
                      ? '#10b981'
                      : '#334155'
                  }
                  strokeWidth="1.5"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="0.3"
                >
                  {loc.name.split(' ')[0]} {loc.name.split(' ')[1] || ''}
                </text>
              </g>
            </g>
          );
        })}

        {/* Animated Explorer Character Avatar */}
        <g
          transform={`translate(${explorerPos.x}, ${explorerPos.y - 42})`}
          className="transition-all duration-700 ease-out pointer-events-none"
        >
          {/* Subtle Float Animation wrapper */}
          <g className="animate-float">
            {/* Explorer Aura */}
            <circle cx="0" cy="0" r="18" fill="#f59e0b" opacity="0.3" filter="url(#glowGold)" />
            {/* Explorer Hat */}
            <ellipse cx="0" cy="-12" rx="14" ry="4" fill="#a16207" stroke="#78350f" strokeWidth="1" />
            <path d="M -8 -13 Q 0 -22 8 -13 Z" fill="#ca8a04" stroke="#78350f" strokeWidth="1" />
            {/* Hat Band */}
            <line x1="-8" y1="-13" x2="8" y2="-13" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Face */}
            <circle cx="0" cy="-6" r="7" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.8" />
            <circle cx="-2.5" cy="-7" r="1" fill="#451a03" />
            <circle cx="2.5" cy="-7" r="1" fill="#451a03" />
            <path d="M -2 -4 Q 0 -2 2 -4" fill="none" stroke="#ea580c" strokeWidth="0.8" />
            {/* Backpack / Torso */}
            <rect x="-6" y="0" width="12" height="12" rx="2" fill="#78350f" />
            <rect x="-8" y="1" width="3" height="9" rx="1" fill="#a16207" />
            <rect x="5" y="1" width="3" height="9" rx="1" fill="#a16207" />
            {/* Explorer Jacket */}
            <rect x="-4" y="0" width="8" height="11" rx="1" fill="#15803d" />
            {/* Belt & Buckle */}
            <rect x="-5" y="8" width="10" height="2" fill="#451a03" />
            <rect x="-1.5" y="7.5" width="3" height="3" fill="#facc15" />
            {/* Explorer Pointer/Flag */}
            <g transform="translate(10, -10)">
              <line x1="0" y1="0" x2="0" y2="18" stroke="#f8fafc" strokeWidth="1.5" />
              <polygon points="0,0 8,4 0,8" fill="#ef4444" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
