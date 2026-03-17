import Link from "next/link";

export function Term({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/dictionary#${id}`}
      style={{
        color: "#4499ff",
        borderBottom: "1px dotted rgba(68,153,255,0.5)",
        textDecoration: "none",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </Link>
  );
}
