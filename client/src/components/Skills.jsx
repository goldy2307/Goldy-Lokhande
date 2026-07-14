import Reveal from "./Reveal.jsx";

export default function Skills({ skills }) {
  return (
    <section id="skills" className="section" style={{ background: "var(--ink-900)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <Reveal className="eyebrow">02 — Stack</Reveal>
        <Reveal delay={1} className="section-title" as="h2">
          Tools I reach for
        </Reveal>
        <Reveal delay={1} className="section-sub">
          Across the products I've shipped, this is the stack that comes up again and again — frontend to database to deploy.
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {skills?.map((group, i) => (
            <Reveal key={group.group} delay={(i % 4) + 1} className="card skill-card" style={{ padding: 26 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold-soft)", letterSpacing: "0.05em", marginBottom: 16, textTransform: "uppercase" }}>
                {group.group}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {group.items.map((item) => (
                  <span key={item} className="skill-chip">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .skill-card:hover { transform: translateY(-4px); }
        .skill-chip {
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--line-strong);
          color: var(--text-mid);
          transition: border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
        }
        .skill-chip:hover {
          border-color: var(--amber);
          color: var(--text-hi);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}