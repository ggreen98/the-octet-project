"use client";

// Each entry: [left position, animation delay (s), animation duration (s)]
const DROPS: [string, number, number][] = [
  ["4%",  0.0, 4.2],
  ["11%", 2.1, 3.7],
  ["19%", 0.8, 4.5],
  ["27%", 3.3, 3.9],
  ["36%", 1.5, 4.1],
  ["44%", 0.3, 3.6],
  ["53%", 2.7, 4.3],
  ["61%", 1.1, 3.8],
  ["70%", 3.6, 4.0],
  ["78%", 0.6, 4.6],
  ["86%", 2.4, 3.5],
  ["93%", 1.8, 4.2],
];

export function NavDrip() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-visible"
      style={{ height: 0, zIndex: 1 }}
    >
      {DROPS.map(([left, delay, dur], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left,
            top: 0,
            width: 9,
            height: 12,
            marginLeft: -4,
            borderRadius: "50% 50% 46% 46% / 56% 56% 44% 44%",
            background:
              "linear-gradient(175deg, rgba(255,255,255,0.28) 0%, rgba(200,232,255,0.10) 100%)",
            boxShadow:
              "inset 0 1.5px 2px rgba(255,255,255,0.35), 0 1px 5px rgba(0,0,0,0.18)",
            animation: `nav-drip ${dur}s ${delay}s infinite`,
            transformOrigin: "50% 0%",
          }}
        />
      ))}
    </div>
  );
}
