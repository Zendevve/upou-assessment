import React from 'react';

export const ForceComparisonDiagrams: React.FC = () => {
  return (
    <div className="my-6 grid gap-4 md:grid-cols-2">
      {/* Example A: Balanced Forces */}
      <figure className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <figcaption className="text-sm font-semibold text-[#172033]">
          Example A: Balanced Forces (F_net = 0 N)
        </figcaption>
        <svg
          viewBox="0 0 360 150"
          className="mt-3 w-full h-auto bg-white rounded border border-[#E2E8F0]"
          role="img"
          aria-labelledby="bal-title bal-desc"
        >
          <title id="bal-title">Box with balanced horizontal forces</title>
          <desc id="bal-desc">
            A 10 newton force pulls left and an equal 10 newton force pulls right on the same box, resulting in a net force of 0 newtons.
          </desc>
          {/* Floor line */}
          <line x1="20" y1="112" x2="340" y2="112" stroke="#CBD5E1" strokeWidth="2" />
          {/* Box */}
          <rect x="145" y="56" width="70" height="56" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
          <text x="180" y="89" textAnchor="middle" fontSize="13" fontWeight="600" fill="#172033">
            Box
          </text>

          {/* Left Force Arrow (10 N) */}
          <line x1="145" y1="84" x2="68" y2="84" stroke="#B91C1C" strokeWidth="3" />
          <polygon points="62,84 74,77 74,91" fill="#B91C1C" />
          <text x="103" y="72" textAnchor="middle" fontSize="12" fontWeight="600" fill="#B91C1C">
            10 N left
          </text>

          {/* Right Force Arrow (10 N) */}
          <line x1="215" y1="84" x2="292" y2="84" stroke="#2563EB" strokeWidth="3" />
          <polygon points="298,84 286,77 286,91" fill="#2563EB" />
          <text x="257" y="72" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1D4ED8">
            10 N right
          </text>

          {/* Summary label */}
          <text x="180" y="136" textAnchor="middle" fontSize="12" fontWeight="600" fill="#15803D">
            Net force = 0 N · Velocity stays constant
          </text>
        </svg>
        <p className="mt-2.5 text-xs text-[#475569]">
          Equal magnitudes in opposite directions cancel: <span className="font-mono">+10 N + (-10 N) = 0 N</span>.
        </p>
      </figure>

      {/* Example B: Unbalanced Forces */}
      <figure className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <figcaption className="text-sm font-semibold text-[#172033]">
          Example B: Unbalanced Forces (F_net = 10 N right)
        </figcaption>
        <svg
          viewBox="0 0 360 150"
          className="mt-3 w-full h-auto bg-white rounded border border-[#E2E8F0]"
          role="img"
          aria-labelledby="unbal-title unbal-desc"
        >
          <title id="unbal-title">Box with unbalanced horizontal forces</title>
          <desc id="unbal-desc">
            A 5 newton force pulls left and a larger 15 newton force pulls right on the same box, resulting in a net force of 10 newtons to the right.
          </desc>
          {/* Floor line */}
          <line x1="20" y1="112" x2="340" y2="112" stroke="#CBD5E1" strokeWidth="2" />
          {/* Box */}
          <rect x="135" y="56" width="70" height="56" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
          <text x="170" y="89" textAnchor="middle" fontSize="13" fontWeight="600" fill="#172033">
            Box
          </text>

          {/* Left Force Arrow (5 N - shorter) */}
          <line x1="135" y1="84" x2="88" y2="84" stroke="#B91C1C" strokeWidth="3" />
          <polygon points="82,84 94,77 94,91" fill="#B91C1C" />
          <text x="108" y="72" textAnchor="middle" fontSize="12" fontWeight="600" fill="#B91C1C">
            5 N left
          </text>

          {/* Right Force Arrow (15 N - longer) */}
          <line x1="205" y1="84" x2="316" y2="84" stroke="#2563EB" strokeWidth="3" />
          <polygon points="324,84 311,77 311,91" fill="#2563EB" />
          <text x="264" y="72" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1D4ED8">
            15 N right
          </text>

          {/* Net force indicator */}
          <text x="180" y="136" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1D4ED8">
            Net force = 10 N right · Accelerates right
          </text>
        </svg>
        <p className="mt-2.5 text-xs text-[#475569]">
          The rightward force is larger: <span className="font-mono">+15 N + (-5 N) = +10 N</span> (10 N right).
        </p>
      </figure>
    </div>
  );
};

export const SynthesisForceDiagram: React.FC = () => (
  <figure className="my-6 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5">
    <figcaption className="text-sm font-semibold text-[#172033]">
      Integrated Scenario Diagram: 5 kg Box Pushed Across a Horizontal Floor
    </figcaption>
    <svg
      viewBox="0 0 560 220"
      className="mt-3 w-full max-w-[560px] h-auto bg-white rounded border border-[#E2E8F0]"
      role="img"
      aria-labelledby="synth-title synth-desc"
    >
      <title id="synth-title">Forces acting on a 5 kg box pushed across a horizontal floor</title>
      <desc id="synth-desc">
        A 5 kilogram box rests on a horizontal floor. Horizontally, an applied push of 15 newtons acts to the right while friction of 5 newtons acts to the left. Vertically, upward normal force and downward gravity balance each other.
      </desc>
      {/* Floor */}
      <line x1="40" y1="154" x2="520" y2="154" stroke="#94A3B8" strokeWidth="2.5" />

      {/* Box */}
      <rect x="220" y="92" width="120" height="62" rx="4" fill="#EFF6FF" stroke="#1E40AF" strokeWidth="2" />
      <text x="280" y="128" textAnchor="middle" fontSize="14" fontWeight="700" fill="#172033">
        5 kg Box
      </text>

      {/* Vertical contextual balanced forces (dashed muted) */}
      <line x1="280" y1="92" x2="280" y2="42" stroke="#64748B" strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="280,35 274,46 286,46" fill="#64748B" />
      <text x="292" y="54" fontSize="11" fontWeight="500" fill="#475569">
        Normal force (up)
      </text>

      <line x1="280" y1="154" x2="280" y2="198" stroke="#64748B" strokeWidth="2" strokeDasharray="4 3" />
      <polygon points="280,205 274,194 286,194" fill="#64748B" />
      <text x="292" y="192" fontSize="11" fontWeight="500" fill="#475569">
        Gravity (down) — balanced vertically
      </text>

      {/* Horizontal Friction (5 N left) */}
      <line x1="220" y1="123" x2="128" y2="123" stroke="#B91C1C" strokeWidth="3.5" />
      <polygon points="120,123 133,115 133,131" fill="#B91C1C" />
      <text x="165" y="110" textAnchor="middle" fontSize="12" fontWeight="600" fill="#B91C1C">
        Friction: 5 N left
      </text>

      {/* Horizontal Applied Push (15 N right) */}
      <line x1="340" y1="123" x2="478" y2="123" stroke="#2563EB" strokeWidth="3.5" />
      <polygon points="486,123 473,115 473,131" fill="#2563EB" />
      <text x="415" y="110" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1D4ED8">
        Applied push: 15 N right
      </text>
    </svg>
    <p className="mt-2.5 text-xs text-[#475569]">
      Vertical forces (normal force and gravity) balance on the flat floor, so we analyze the unbalanced horizontal forces: 15 N right and 5 N left.
    </p>
  </figure>
);
