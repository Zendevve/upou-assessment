import React from 'react';

interface BusInertiaDiagramProps {
  phase: 'cruising' | 'braking';
}

export const BusInertiaDiagram: React.FC<BusInertiaDiagramProps> = ({ phase }) => {
  const isBraking = phase === 'braking';

  return (
    <figure className="rounded-md border border-[#E2E8F0] bg-white p-4">
      <svg
        viewBox="0 0 540 190"
        className="w-full h-auto rounded bg-[#F8FAFC] border border-[#E2E8F0]"
        role="img"
        aria-labelledby="bus-svg-title bus-svg-desc"
      >
        <title id="bus-svg-title">
          {isBraking
            ? 'Bus suddenly braking while standing passenger leans forward'
            : 'Bus and standing passenger moving together at constant velocity'}
        </title>
        <desc id="bus-svg-desc">
          {isBraking
            ? 'Braking friction pushes backward on the bus tires to slow the bus down, while the standing passenger continues leaning forward because of inertia.'
            : 'Both the bus and the standing passenger move forward together at constant velocity.'}
        </desc>

        {/* Road */}
        <line x1="20" y1="154" x2="520" y2="154" stroke="#94A3B8" strokeWidth="2.5" />

        {/* Bus body */}
        <rect x="115" y="44" width="290" height="92" rx="8" fill="#FFFFFF" stroke="#334155" strokeWidth="2.5" />
        {/* Windows */}
        <rect x="132" y="58" width="58" height="36" rx="3" fill="#EFF6FF" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="202" y="58" width="84" height="36" rx="3" fill="#EFF6FF" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="298" y="58" width="90" height="36" rx="3" fill="#EFF6FF" stroke="#CBD5E1" strokeWidth="1.5" />

        {/* Wheels */}
        <circle cx="172" cy="142" r="14" fill="#1E293B" />
        <circle cx="172" cy="142" r="5" fill="#94A3B8" />
        <circle cx="348" cy="142" r="14" fill="#1E293B" />
        <circle cx="348" cy="142" r="5" fill="#94A3B8" />

        {/* Standing passenger inside center window */}
        <g transform={isBraking ? 'translate(10, 0)' : 'translate(0, 0)'}>
          {/* Legs */}
          <line x1="238" y1="134" x2="240" y2="105" stroke="#172033" strokeWidth="3" strokeLinecap="round" />
          <line x1="246" y1="134" x2="244" y2="105" stroke="#172033" strokeWidth="3" strokeLinecap="round" />
          {/* Torso tilted forward when braking */}
          <line
            x1="242"
            y1="105"
            x2={isBraking ? '256' : '242'}
            y2="78"
            stroke="#172033"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Head */}
          <circle cx={isBraking ? '258' : '242'} cy="68" r="7" fill="#2563EB" />
        </g>

        {/* Velocity & Force Arrows */}
        {!isBraking ? (
          <>
            <line x1="420" y1="88" x2="494" y2="88" stroke="#2563EB" strokeWidth="3" />
            <polygon points="502,88 490,81 490,95" fill="#2563EB" />
            <text x="460" y="76" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1D4ED8">
              Constant v
            </text>
            <text x="270" y="26" textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
              Bus and passenger move together at the same forward velocity
            </text>
          </>
        ) : (
          <>
            {/* Braking force on bus */}
            <line x1="115" y1="126" x2="42" y2="126" stroke="#B91C1C" strokeWidth="3" />
            <polygon points="34,126 46,119 46,133" fill="#B91C1C" />
            <text x="72" y="114" textAnchor="middle" fontSize="11" fontWeight="600" fill="#B91C1C">
              Braking force
            </text>

            {/* Passenger's inertia tendency */}
            <line x1="274" y1="68" x2="334" y2="68" stroke="#B45309" strokeWidth="2.5" strokeDasharray="4 3" />
            <polygon points="342,68 331,62 331,74" fill="#B45309" />
            <text x="348" y="54" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400E">
              Body continues forward (inertia)
            </text>

            <text x="270" y="26" textAnchor="middle" fontSize="12" fontWeight="600" fill="#92400E">
              Brakes slow the bus, while the passenger’s body tends to keep moving forward
            </text>
          </>
        )}
      </svg>
    </figure>
  );
};
