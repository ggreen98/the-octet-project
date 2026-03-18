"use client";

export function NavTitle() {
  return (
    <>
      <style>{`
        @keyframes nav-spark {
          0%,  52% {
            color: #ffb830;
            text-shadow: 0 0 8px rgba(255,150,10,0.6), 0 0 18px rgba(255,100,0,0.3);
          }
          54% {
            color: #fffbe0;
            text-shadow: 0 0 2px #fff, 0 0 10px #ffe566, 0 0 28px #ff8800, 0 0 60px rgba(255,80,0,0.7);
          }
          55% {
            color: #ffb830;
            text-shadow: 0 0 8px rgba(255,150,10,0.6), 0 0 18px rgba(255,100,0,0.3);
          }
          56%, 74% {
            color: #ffb830;
            text-shadow: 0 0 8px rgba(255,150,10,0.6), 0 0 18px rgba(255,100,0,0.3);
          }
          75% {
            color: #fff8d0;
            text-shadow: 0 0 2px #fff, 0 0 14px #ffd040, 0 0 34px #ff7000, 0 0 65px rgba(255,60,0,0.6);
          }
          76% {
            color: #ffb830;
            text-shadow: 0 0 8px rgba(255,150,10,0.6), 0 0 18px rgba(255,100,0,0.3);
          }
          77% {
            color: #ffe090;
            text-shadow: 0 0 4px #ffdd60, 0 0 20px #ff9000, 0 0 40px rgba(255,100,0,0.45);
          }
          78%, 100% {
            color: #ffb830;
            text-shadow: 0 0 8px rgba(255,150,10,0.6), 0 0 18px rgba(255,100,0,0.3);
          }
        }
        @keyframes hex-spark {
          0%,  52% {
            color: #ffb830;
            text-shadow: 0 0 10px rgba(255,150,10,0.7), 0 0 22px rgba(255,100,0,0.35);
          }
          53% {
            color: #fffbe0;
            text-shadow: 0 0 3px #fff, 0 0 12px #ffe566, 0 0 30px #ff8800, 0 0 70px rgba(255,80,0,0.8);
          }
          55% {
            color: #ffb830;
            text-shadow: 0 0 10px rgba(255,150,10,0.7), 0 0 22px rgba(255,100,0,0.35);
          }
          74% {
            color: #ffb830;
            text-shadow: 0 0 10px rgba(255,150,10,0.7), 0 0 22px rgba(255,100,0,0.35);
          }
          75.5% {
            color: #fff8d0;
            text-shadow: 0 0 3px #fff, 0 0 16px #ffd040, 0 0 36px #ff7000, 0 0 72px rgba(255,60,0,0.7);
          }
          77% {
            color: #ffb830;
            text-shadow: 0 0 10px rgba(255,150,10,0.7), 0 0 22px rgba(255,100,0,0.35);
          }
          78% {
            color: #ffe090;
            text-shadow: 0 0 5px #ffdd60, 0 0 22px #ff9000, 0 0 44px rgba(255,100,0,0.5);
          }
          79%, 100% {
            color: #ffb830;
            text-shadow: 0 0 10px rgba(255,150,10,0.7), 0 0 22px rgba(255,100,0,0.35);
          }
        }
      `}</style>

      <span
        className="text-2xl font-heading"
        style={{ animation: "hex-spark 6s ease-in-out infinite", color: "#ffb830" }}
      >
        ⬡
      </span>

      <span
        className="font-heading hidden sm:block"
        style={{
          letterSpacing: "0.2em",
          fontSize: "1.05rem",
          animation: "nav-spark 6s ease-in-out infinite",
          color: "#ffb830",
        }}
      >
        THE OCTET PROJECT
      </span>
    </>
  );
}
