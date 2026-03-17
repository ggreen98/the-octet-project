"use client";

import dynamic from "next/dynamic";

const AtomViewer = dynamic(
  () => import("./AtomViewer").then((m) => ({ default: m.AtomViewer })),
  { ssr: false, loading: () => null }
);

export function AtomViewerCanvas({ z }: { z: number }) {
  return <AtomViewer z={z} />;
}
