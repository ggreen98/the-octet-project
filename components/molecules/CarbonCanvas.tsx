"use client";

import dynamic from "next/dynamic";

const CarbonAtom = dynamic(
  () => import("@/components/molecules/CarbonAtom").then((m) => m.CarbonAtom),
  { ssr: false, loading: () => null }
);

export function CarbonCanvas() {
  return <CarbonAtom />;
}
