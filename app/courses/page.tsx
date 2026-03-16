import Link from "next/link";

export const metadata = {
  title: "Courses — The Octet Project",
  description: "Browse all chemistry courses. From atomic structure to organic reactions.",
};

const courses = [
  {
    id: "01",
    slug: "chemistry-1",
    title: "CHEMISTRY I: GENERAL CHEMISTRY",
    description: "Start from the ground up. Atoms, electrons, bonding, and the periodic table.",
    lessons: 8,
    progress: 100,
    status: "COMPLETE",
  },
  {
    id: "02",
    slug: "chemistry-2",
    title: "CHEMICAL BONDING",
    description: "Explore ionic, covalent, and metallic bonds. Understand why molecules form.",
    lessons: 10,
    progress: 72,
    status: "ACTIVE",
  },
  {
    id: "03",
    slug: "molecular-geometry",
    title: "MOLECULAR GEOMETRY",
    description: "VSEPR theory, bond angles, and the 3D shapes that determine chemical behavior.",
    lessons: 7,
    progress: 35,
    status: "ACTIVE",
  },
  {
    id: "04",
    slug: "thermodynamics",
    title: "THERMODYNAMICS",
    description: "Energy, entropy, and the laws governing every chemical reaction.",
    lessons: 12,
    progress: 0,
    status: "LOCKED",
  },
  {
    id: "05",
    slug: "organic-chemistry",
    title: "ORGANIC CHEMISTRY",
    description: "Carbon-based molecules, functional groups, and the chemistry of life.",
    lessons: 15,
    progress: 0,
    status: "LOCKED",
  },
  {
    id: "06",
    slug: "reaction-kinetics",
    title: "REACTION KINETICS",
    description: "Reaction rates, activation energy, and what controls how fast chemistry happens.",
    lessons: 9,
    progress: 0,
    status: "LOCKED",
  },
];

const statusColor = {
  COMPLETE: "#00ff41",
  ACTIVE: "#ffb300",
  LOCKED: "rgba(180, 215, 255, 0.18)",
};

const titleColor = {
  COMPLETE: "rgba(180, 215, 255, 0.75)",
  ACTIVE: "#7bbfff",
  LOCKED: "rgba(180, 215, 255, 0.25)",
};

export default function CoursesPage() {
  return (
    <main
      className="scanlines font-terminal min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#010d0a", color: "#c8e8ff" }}
    >
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
        style={{
          background: "rgba(1, 13, 10, 0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0, 255, 65, 0.1)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading" style={{ color: "#00ff41" }}>⬡</span>
          <span className="font-heading text-sm hidden sm:block" style={{ color: "#c8e8ff", letterSpacing: "0.2em" }}>
            THE OCTET PROJECT
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest">
          {[["COURSES", "/courses"], ["MOLECULES", "/molecules"], ["ABOUT", "/about"]].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200"
              style={{ color: label === "COURSES" ? "#00ff41" : "rgba(180, 215, 255, 0.45)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/signup"
          className="font-heading text-xs px-4 py-2 transition-all duration-200"
          style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.15em" }}
        >
          START FREE ▶
        </Link>
      </nav>

      {/* ── PAGE CONTENT ────────────────────────────────── */}
      <div className="pt-14 px-6 md:px-16 lg:px-24 py-16">

        {/* Header */}
        <div className="mb-14 animate-fade-up" style={{ animationFillMode: "both" }}>
          <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(0, 255, 65, 0.45)" }}>
            // AVAILABLE COURSES
          </p>
          <h1
            className="font-heading text-3xl md:text-5xl mb-4"
            style={{ color: "#c8e8ff", letterSpacing: "-0.02em" }}
          >
            THE CURRICULUM
          </h1>
          <p className="text-sm max-w-xl" style={{ color: "rgba(200, 255, 212, 0.5)" }}>
            Each course is broken into focused lessons. Work through them in order or jump to what you need.
          </p>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course, i) => {
            const isLocked = course.status === "LOCKED";
            const card = (
              <div
                className={`crt-card p-6 flex flex-col gap-4 animate-fade-up anim-d${Math.min(i + 1, 6)} ${!isLocked ? "transition-all duration-200 hover:bg-[rgba(68,153,255,0.04)]" : ""}`}
                style={{
                  animationFillMode: "both",
                  opacity: isLocked ? 0.45 : 1,
                  cursor: isLocked ? "not-allowed" : "pointer",
                  minHeight: "220px",
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <span className="font-heading text-xs" style={{ color: "rgba(0, 255, 65, 0.3)" }}>
                    {course.id}
                  </span>
                  <span
                    className="text-xs tracking-widest"
                    style={{ color: statusColor[course.status as keyof typeof statusColor], fontSize: "0.58rem", letterSpacing: "0.15em" }}
                  >
                    [{course.status}]
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="font-heading text-xs tracking-wider leading-relaxed"
                  style={{ color: titleColor[course.status as keyof typeof titleColor], letterSpacing: "0.08em" }}
                >
                  {course.title}
                </h2>

                {/* Description */}
                <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(180, 215, 255, 0.5)" }}>
                  {course.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)" }}>
                  <span className="text-xs" style={{ color: "rgba(0, 255, 65, 0.3)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                    {course.lessons} LESSONS
                  </span>

                  {!isLocked && (
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-px" style={{ background: "rgba(0,255,65,0.12)" }}>
                        <div
                          className="h-full"
                          style={{ width: `${course.progress}%`, background: course.progress === 100 ? "#00ff41" : "rgba(0,255,65,0.45)" }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "rgba(0,255,65,0.35)", fontSize: "0.6rem" }}>
                        {course.progress}%
                      </span>
                    </div>
                  )}

                  {isLocked && (
                    <span className="text-xs" style={{ color: "rgba(180, 215, 255, 0.18)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                      LOCKED
                    </span>
                  )}
                </div>
              </div>
            );

            return isLocked ? (
              <div key={course.id}>{card}</div>
            ) : (
              <Link key={course.id} href={course.slug === "chemistry-1" ? "/courses/chemistry-1/lessons/atoms" : `/courses/${course.slug}`} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
