"use client";

import dynamic from "next/dynamic";

const BismuthCrystal = dynamic(
  () => import("./BismuthCrystal").then((m) => ({ default: m.BismuthCrystal })),
  { ssr: false, loading: () => null }
);

export function BismuthCanvas() {
  return <BismuthCrystal />;
}
