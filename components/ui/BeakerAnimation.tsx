// viewBox 0 0 280 460
// Beaker rim at y=152-160, interior clip from y=160 down to y=386
// Pipette tip at y=122 at rest; descends +90px so tip lands at y=212 (inside beaker, above liquid)
// Drops: cy=122 absolute; translateY(90) → y=212 (tip); translateY(158) → y=280 (liquid surface)

const ANIM_CSS = `
  /* ── Pipette ─────────────────────────────────────── */
  .ba-pipette {
    animation: ba-pipette-move 12s cubic-bezier(0.45,0,0.25,1) infinite;
  }
  @keyframes ba-pipette-move {
    0%,  8%   { transform: translateY(0px); }
    18%, 70%  { transform: translateY(90px); }
    82%, 100% { transform: translateY(0px); }
  }

  /* ── Drops ───────────────────────────────────────── */
  .ba-drop { fill: #4db87a; opacity: 0; }
  .ba-drop-1 { animation: ba-drop-fall 12s ease-in infinite; }
  .ba-drop-2 { animation: ba-drop-fall 12s ease-in infinite; animation-delay: 0.45s; }
  .ba-drop-3 { animation: ba-drop-fall 12s ease-in infinite; animation-delay: 0.9s; }

  @keyframes ba-drop-fall {
    0%,  22% { opacity: 0; transform: translateY(90px); }
    23%      { opacity: 1; transform: translateY(90px); }
    32%      { opacity: 0; transform: translateY(158px); }
    100%     { opacity: 0; transform: translateY(158px); }
  }

  /* ── Liquid rise ─────────────────────────────────── */
  .ba-liquid {
    animation: ba-liquid-rise 12s ease-in-out infinite;
  }
  @keyframes ba-liquid-rise {
    0%,  26% { transform: translateY(0px); }
    55%      { transform: translateY(-25px); }
    68%      { transform: translateY(-60px); }
    75%      { transform: translateY(-118px); }
    81%      { transform: translateY(0px); }
    100%     { transform: translateY(0px); }
  }

  /* ── Color bloom (radial spread from drop point) ─── */
  .ba-bloom {
    opacity: 0;
    animation: ba-bloom-spread 12s ease-in-out infinite;
  }
  @keyframes ba-bloom-spread {
    0%,  27% { opacity: 0; transform: scale(0); }
    33%      { opacity: 0.9; transform: scale(5); }
    52%      { opacity: 0.85; transform: scale(55); }
    70%      { opacity: 0.8; transform: scale(80); }
    80%      { opacity: 0; transform: scale(80); }
    82%      { opacity: 0; transform: scale(0); }
    100%     { opacity: 0; transform: scale(0); }
  }

  /* ── Bubbles ─────────────────────────────────────── */
  .ba-bub {
    opacity: 0;
    animation: ba-bub-rise 12s ease-in infinite;
  }
  /* Delays place each bubble at ~38–50% of the main loop (reaction phase) */
  .ba-bub-1 { animation-delay: 4.56s; }
  .ba-bub-2 { animation-delay: 5.06s; }
  .ba-bub-3 { animation-delay: 4.80s; }
  .ba-bub-4 { animation-delay: 5.36s; }
  .ba-bub-5 { animation-delay: 5.66s; }
  .ba-bub-6 { animation-delay: 5.96s; }

  @keyframes ba-bub-rise {
    0%   { opacity: 0; transform: translateY(0px) scale(1); }
    6%   { opacity: 0.65; transform: translateY(-12px) scale(0.92); }
    22%  { opacity: 0.4; transform: translateY(-70px) scale(0.65); }
    30%  { opacity: 0; transform: translateY(-115px) scale(0.35); }
    100% { opacity: 0; transform: translateY(-115px) scale(0.35); }
  }

  /* ── Eruption ────────────────────────────────────── */
  .ba-erupt {
    opacity: 0;
    animation: ba-erupt-anim 12s ease-out infinite;
  }
  @keyframes ba-erupt-anim {
    0%,  73% { opacity: 0; transform: translateY(0px) scaleY(0.15); }
    77%      { opacity: 1; transform: translateY(-16px) scaleY(1); }
    83%      { opacity: 0; transform: translateY(-54px) scaleY(1.45); }
    100%     { opacity: 0; }
  }
`;

export function BeakerAnimation() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <style>{ANIM_CSS}</style>
      <svg
        viewBox="0 0 280 460"
        style={{ width: "min(300px, 72%)", height: "auto" }}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* Clip path = beaker interior */}
          <clipPath id="ba-clip">
            <path d="M 76 160 L 84 386 Q 84 393 91 393 L 189 393 Q 196 393 196 386 L 204 160 Z" />
          </clipPath>
        </defs>

        {/* ── Liquid + bloom (clipped to beaker) ── */}
        <g clipPath="url(#ba-clip)">
          <rect
            className="ba-liquid"
            x="70" y="280" width="140" height="116"
            fill="#0d3320"
          />
          {/* Bloom: scales from drop-landing point, color stays clipped to liquid volume */}
          <circle
            className="ba-bloom"
            cx="140" cy="290" r="1"
            fill="#9a4000"
            style={{ transformOrigin: "140px 290px" }}
          />
        </g>

        {/* ── Bubbles (clipped) ── */}
        <g clipPath="url(#ba-clip)">
          <circle className="ba-bub ba-bub-1" cx="102" cy="375" r="4.5" fill="none" stroke="#72b872" strokeWidth="1" />
          <circle className="ba-bub ba-bub-2" cx="140" cy="368" r="3"   fill="none" stroke="#72b872" strokeWidth="1" />
          <circle className="ba-bub ba-bub-3" cx="170" cy="372" r="5.5" fill="none" stroke="#f5a623" strokeWidth="1" />
          <circle className="ba-bub ba-bub-4" cx="118" cy="362" r="3.5" fill="none" stroke="#f5a623" strokeWidth="1" />
          <circle className="ba-bub ba-bub-5" cx="158" cy="380" r="4"   fill="none" stroke="#72b872" strokeWidth="1" />
          <circle className="ba-bub ba-bub-6" cx="130" cy="355" r="3"   fill="none" stroke="#f5a623" strokeWidth="1" />
        </g>

        {/* ── Eruption blob (above rim, shoots upward) ── */}
        <g className="ba-erupt" style={{ transformOrigin: "140px 158px" }}>
          <ellipse cx="140" cy="150" rx="36" ry="17" fill="#d05500" opacity="0.78" />
          <circle  cx="108" cy="142" r="10"           fill="#f5a623" opacity="0.68" />
          <circle  cx="172" cy="140" r="12"           fill="#f5a623" opacity="0.68" />
          <circle  cx="91"  cy="125" r="7"            fill="#d05500" opacity="0.52" />
          <circle  cx="189" cy="123" r="8"            fill="#d05500" opacity="0.52" />
          <circle  cx="140" cy="112" r="9"            fill="#f5a623" opacity="0.56" />
          <circle  cx="122" cy="104" r="5"            fill="#e06000" opacity="0.4"  />
          <circle  cx="158" cy="102" r="6"            fill="#e06000" opacity="0.4"  />
        </g>

        {/* ── Beaker outline (drawn above liquid so walls are crisp) ── */}
        {/* Body */}
        <path
          d="M 68 160 L 78 388 Q 78 397 87 397 L 193 397 Q 202 397 202 388 L 212 160"
          stroke="var(--oc-green)" strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Rim bottom edge */}
        <line x1="60"  y1="160" x2="220" y2="160" stroke="var(--oc-green)"     strokeWidth="2"   strokeLinecap="round" />
        {/* Rim top edge */}
        <line x1="64"  y1="152" x2="216" y2="152" stroke="var(--oc-green)"     strokeWidth="1.5" strokeLinecap="round" />
        {/* Spout (left) */}
        <path d="M 64 152 L 51 139" stroke="var(--oc-green)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 51 139 L 60 160" stroke="var(--oc-green)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Measurement marks (right side) */}
        <line x1="202" y1="222" x2="194" y2="222" stroke="var(--oc-green-dim)" strokeWidth="1" opacity="0.5" />
        <line x1="204" y1="258" x2="196" y2="258" stroke="var(--oc-green-dim)" strokeWidth="1" opacity="0.5" />
        <line x1="205" y1="294" x2="197" y2="294" stroke="var(--oc-green-dim)" strokeWidth="1" opacity="0.5" />
        <line x1="206" y1="330" x2="198" y2="330" stroke="var(--oc-green-dim)" strokeWidth="1" opacity="0.5" />
        <line x1="207" y1="366" x2="199" y2="366" stroke="var(--oc-green-dim)" strokeWidth="1" opacity="0.5" />

        {/* ── Pipette (whole group translates down) ── */}
        <g className="ba-pipette">
          {/* Barrel */}
          <rect x="133" y="8" width="14" height="95" rx="2.5"
            stroke="var(--oc-text-dim)" strokeWidth="1.2" fill="rgba(10,38,20,0.45)"
          />
          {/* Bulb */}
          <ellipse cx="140" cy="20" rx="19" ry="13"
            stroke="var(--oc-text-dim)" strokeWidth="1.2" fill="rgba(10,38,20,0.45)"
          />
          {/* Liquid level inside barrel */}
          <rect x="135" y="48" width="10" height="48" rx="1" fill="#1a5c32" opacity="0.55" />
          {/* Taper to tip */}
          <path d="M 133 103 L 138 122 L 142 122 L 147 103"
            stroke="var(--oc-text-dim)" strokeWidth="1.2" fill="rgba(10,38,20,0.45)"
          />
        </g>

        {/* ── Drops (absolute coords — fall independently of pipette group) ── */}
        <circle className="ba-drop ba-drop-1" cx="140" cy="122" r="3.5" />
        <circle className="ba-drop ba-drop-2" cx="140" cy="122" r="3.0" />
        <circle className="ba-drop ba-drop-3" cx="140" cy="122" r="2.5" />

        {/* ── Label ── */}
        <text
          x="140" y="436"
          textAnchor="middle"
          fill="var(--oc-green-dim)"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="4"
          opacity="0.5"
        >
          TITRATION
        </text>
      </svg>
    </div>
  );
}
