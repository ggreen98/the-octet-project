"use client";

import dynamic from "next/dynamic";

const HeliumAtom = dynamic(
  () => import("./HeliumAtom").then((m) => ({ default: m.HeliumAtom })),
  { ssr: false, loading: () => null }
);

export function HeliumCanvas() {
  return <HeliumAtom />;
}
