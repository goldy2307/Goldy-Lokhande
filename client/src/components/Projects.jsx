import Reveal from "./Reveal.jsx";
import TiltCard from "./TiltCard.jsx";
import { ArrowUpRight } from "lucide-react";

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section" style={{ background: "var(--ink-900)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <Reveal className="eyebrow">04 — Work</Reveal>
        <Reveal delay={1} className="section-title" as="h2">
          Selected projects
        </Reveal>
        <Reveal delay={1} className="section-sub">
          Live products, freelance builds, and engineering-heavy side projects.
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
          {projects?.map((p, i) => (
            <Reveal key={p.title} delay={(i % 4) + 1}>
              <TiltCard className="card project-card" style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                <div
                  style={{
                    aspectRatio: "16 / 10",
                    background: p.image ? `url(${p.image}) center/cover no-repeat` : "linear-gradient(135deg, var(--ink-800), var(--ink-700))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {!p.image && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-low)" }}>
                      Loading....
                    </span>
                  )}
                </div>

                <div style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>{p.title}</h3>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`} className="project-link">
                        <ArrowUpRight size={18} />
                      </a>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold-soft)", marginBottom: 12 }}>{p.tech}</div>
                  <p style={{ color: "var(--text-mid)", fontSize: 14, lineHeight: 1.65 }}>{p.description}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .project-link { color: var(--text-low); transition: color 0.25s ease, transform 0.25s ease; }
        .project-link:hover { color: var(--amber); transform: translate(2px, -2px); }
      `}</style>
    </section>
  );
}