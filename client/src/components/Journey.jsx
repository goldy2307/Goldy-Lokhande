import Reveal from "./Reveal.jsx";

// Deterministic short "commit hash" per entry, purely decorative —
// reinforces the developer-log framing of the timeline.
function hashFor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h.toString(16).slice(0, 7);
}

export default function Journey({ journey }) {
  return (
    <section id="journey" className="section">
      <div className="container">
        <Reveal className="eyebrow">03 — Journey</Reveal>
        <Reveal delay={1} className="section-title" as="h2">
          Commit history
        </Reveal>
        <Reveal delay={1} className="section-sub">
          Roles and internships, logged in the order they happened.
        </Reveal>

        <div style={{ position: "relative" }}>
          <div className="journey-rail" aria-hidden />
          {journey?.map((entry, i) => (
            <Reveal key={entry.org + entry.period} delay={(i % 4) + 1} className="journey-entry">
              <div className="journey-dot" />
              <div className="card" style={{ padding: 26, marginLeft: 32 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600 }}>{entry.role}</div>
                    <div style={{ color: "var(--gold-soft)", fontSize: 14, marginTop: 2 }}>{entry.org}</div>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-low)" }}>
                    <div>{entry.period}</div>
                    <div>{entry.location}</div>
                  </div>
                </div>

                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--amber)", marginBottom: 14 }}>
                  commit {hashFor(entry.org + entry.period)}
                </div>

                <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                  {entry.points?.map((p) => (
                    <li key={p} style={{ color: "var(--text-mid)", fontSize: 14.5, lineHeight: 1.65 }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .journey-rail {
          position: absolute;
          left: 5px;
          top: 6px;
          bottom: 6px;
          width: 1px;
          background: linear-gradient(180deg, var(--amber), var(--line) 90%);
        }
        .journey-entry { position: relative; margin-bottom: 24px; }
        .journey-dot {
          position: absolute;
          left: 0; top: 30px;
          width: 11px; height: 11px;
          border-radius: 50%;
          background: var(--ink-950);
          border: 2px solid var(--amber);
        }
        @media (max-width: 700px) {
          .journey-rail { left: 4px; }
        }
      `}</style>
    </section>
  );
}