"use client";

import dynamic from "next/dynamic";

type Highlighted = "proton" | "neutron" | "electron" | null;

const CarbonAtom = dynamic(
  () => import("@/components/molecules/CarbonAtom").then((m) => m.CarbonAtom),
  { ssr: false, loading: () => null }
);

export function CarbonCanvas({ highlighted }: { highlighted?: Highlighted }) {
  return <CarbonAtom highlighted={highlighted} />;
}
