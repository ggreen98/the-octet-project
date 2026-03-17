"use client";

import dynamic from "next/dynamic";

const EthaneMolecule = dynamic(
  () => import("@/components/molecules/EthaneMolecule").then((m) => m.EthaneMolecule),
  { ssr: false, loading: () => null }
);

export function EthaneCanvas() {
  return <EthaneMolecule />;
}
