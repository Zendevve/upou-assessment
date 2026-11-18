import React from 'react';

interface ThirdLawDiagramProps {
  type: 'walking' | 'jumping' | 'wall';
}

export const ThirdLawDiagram: React.FC<ThirdLawDiagramProps> = ({ type }) => {
  if (type === 'walking') {
    return (
      <svg
        viewBox="0 0 420 155"
        className="w-full h-auto rounded border border-[#E2E8F0] bg-[#F8FAFC]"
        role="img"
        aria-label="Action-reaction diagram for walking: foot pushes backward on the ground and the ground pushes forward on the foot"
      >
        <line x1="20" y1="114" x2="400" y2="114" stroke="#64748B" strokeWidth="3" />
        {/* Shoe */}
        <path d="M155 94 L210 94 L224 110 L150 110 Z" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
        <text x="148" y="78" textAnchor="middle" fontSize="12" fontWeight="600" fill="#172033">
          Foot / Shoe
        </text>
        {/* Force 1: Foot on ground (backward/left) */}
        <line x1="165" y1="124" x2="78" y2="124" stroke="#B91C1C" strokeWidth="3" />
        <polygon points="70,124 82,118 82,130" fill="#B91C1C" />
        <text x="122" y="142" textAnchor="middle" fontSize="11" fontWeight="600" fill="#B91C1C">
          Foot pushes ground backward
        </text>
        {/* Force 2: Ground on foot (forward/right) */}
        <line x1="215" y1="100" x2="322" y2="100" stroke="#2563EB" strokeWidth="3" />
        <polygon points="330,100 318,94 318,106" fill="#2563EB" />
        <text x="305" y="82" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1D4ED8">
          Ground pushes foot forward
        </text>
      </svg>
    );
  }

  if (type === 'jumping') {
    return (
      <svg
        viewBox="0 0 420 155"
        className="w-full h-auto rounded border border-[#E2E8F0] bg-[#F8FAFC]"
        role="img"
        aria-label="Action-reaction diagram for jumping: feet push downward on the floor and the floor pushes upward on the person"
      >
        <line x1="30" y1="112" x2="390" y2="112" stroke="#64748B" strokeWidth="3" />
        {/* Person */}
        <rect x="190" y="56" width="40" height="52" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
        <circle cx="210" cy="40" r="10" fill="#2563EB" />
        {/* Upward force on person */}
        <line x1="252" y1="90" x2="252" y2="36" stroke="#2563EB" strokeWidth="3" />
        <polygon points="252,28 246,40 258,40" fill="#2563EB" />
        <text x="266" y="55" fontSize="11" fontWeight="600" fill="#1D4ED8">
          Floor pushes student upward
        </text>
        {/* Downward force on floor */}
        <line x1="168" y1="100" x2="168" y2="142" stroke="#B91C1C" strokeWidth="3" />
        <polygon points="168,149 162,137 174,137" fill="#B91C1C" />
        <text x="156" y="135" textAnchor="end" fontSize="11" fontWeight="600" fill="#B91C1C">
          Feet push floor downward
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 420 140"
      className="w-full h-auto rounded border border-[#E2E8F0] bg-[#F8FAFC]"
      role="img"
      aria-label="Action-reaction diagram for pushing a wall: hands push forward on the wall and the wall pushes backward on the hands"
    >
      <line x1="20" y1="120" x2="360" y2="120" stroke="#94A3B8" strokeWidth="2" />
      {/* Wall */}
      <rect x="315" y="24" width="32" height="96" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
      <text x="331" y="18" textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">
        Wall
      </text>
      {/* Person on skates */}
      <rect x="200" y="52" width="44" height="58" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
      <circle cx="222" cy="36" r="10" fill="#2563EB" />
      <circle cx="208" cy="115" r="5" fill="#1E293B" />
      <circle cx="236" cy="115" r="5" fill="#1E293B" />
      {/* Arms touching wall */}
      <line x1="244" y1="68" x2="315" y2="68" stroke="#172033" strokeWidth="3.5" />
      {/* Force on wall (right) */}
      <line x1="318" y1="60" x2="386" y2="60" stroke="#2563EB" strokeWidth="3" />
      <polygon points="394,60 382,54 382,66" fill="#2563EB" />
      <text x="356" y="48" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#1D4ED8">
        Hands on wall
      </text>
      {/* Force on hands (left) */}
      <line x1="196" y1="74" x2="112" y2="74" stroke="#B91C1C" strokeWidth="3" />
      <polygon points="104,74 116,68 116,80" fill="#B91C1C" />
      <text x="148" y="62" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#B91C1C">
        Wall on hands
      </text>
    </svg>
  );
};
