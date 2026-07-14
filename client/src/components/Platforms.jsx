import Reveal from "./Reveal.jsx";
import { Github, Linkedin, Briefcase, Globe, ArrowUpRight } from "lucide-react";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  naukri: Briefcase,
  foundit: Briefcase,
};

export default function Platforms({ platforms }) {
  return (
    <section id="platforms" className="section" style={{ background: "var(--ink-900)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <Reveal className="eyebrow">06 — Elsewhere</Reveal>
        <Reveal delay={1} className="section-title" as="h2">
          Find me on
        </Reveal>
        <Reveal delay={1} className="section-sub">
          Code, resume and profile — all in one place.
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          {platforms?.map((p, i) => {
            const Icon = ICONS[p.icon] || Globe;
            return (
              <Reveal key={p.name} delay={(i % 4) + 1}>
                <a href={p.url} target="_blank" rel="noreferrer" className="card platform-card" style={{ padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--ink-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={17} color="var(--amber)" />
                    </div>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>{p.name}</span>
                  </div>
                  <ArrowUpRight size={16} color="var(--text-low)" className="platform-arrow" />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>

      <style>{`
        .platform-card { transition: transform 0.25s ease, border-color 0.25s ease; }
        .platform-card:hover { transform: translateY(-4px); border-color: var(--amber); }
        .platform-card:hover .platform-arrow { color: var(--amber); transform: translate(2px,-2px); }
      `}</style>
    </section>
  );
}
