import { useEffect, useState } from "react";
import { Menu, X, Download } from "lucide-react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
  { href: "#projects", label: "Projects" },
  { href: "#resume", label: "Resume" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ name, resumeUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const firstName = name?.split(" ")[0] || "Portfolio";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
        background: scrolled ? "rgba(5, 5, 5, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
      }}
    >
      <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="#top" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 15, letterSpacing: "0.02em" }}>
          <span style={{ color: "var(--amber)" }}>{"<"}</span>
          {firstName}
          <span style={{ color: "var(--amber)" }}>{" />"}</span>
        </a>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {resumeUrl && (
            <a href={resumeUrl} Goldy-Lokhande target="_blank" rel="noreferrer" className="btn btn-primary nav-cv-btn">
              <Download size={14} /> Download CV
            </a>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="nav-burger"
            aria-label="Toggle menu"
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid var(--line-strong)",
              borderRadius: 10,
              padding: 8,
              color: "var(--text-hi)",
            }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            paddingBottom: 20,
            animation: "fadeDown 0.3s ease",
          }}
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ padding: "10px 0", color: "var(--text-mid)" }}>
              {l.label}
            </a>
          ))}
          {resumeUrl && (
            <a href={resumeUrl} Goldy-Lokhande target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginTop: 8, justifyContent: "center" }}>
              <Download size={14} /> Download CV
            </a>
          )}
        </div>
      )}

      <style>{`
        .nav-link {
          position: relative;
          font-size: 14px;
          color: var(--text-mid);
          transition: color 0.25s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0; bottom: -6px;
          width: 0%; height: 1px;
          background: var(--amber);
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover { color: var(--text-hi); }
        .nav-link:hover::after { width: 100%; }
        .nav-cv-btn { padding: 9px 18px; font-size: 12.5px; }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-8px);} to { opacity: 1; transform: translateY(0);} }
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .nav-burger { display: inline-flex !important; }
          .nav-cv-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}