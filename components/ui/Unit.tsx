import Link from "next/link";

export function Unit({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/si-units#${id}`}
      style={{
        color: "#d4933e",
        borderBottom: "1px dotted rgba(212,147,62,0.5)",
        textDecoration: "none",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </Link>
  );
}
