import Reveal from "./Reveal.jsx";
import { Award, BadgeCheck } from "lucide-react";

export default function Certifications({ certifications, achievements }) {
  return (
    <section id="certifications" className="section">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 56 }}>
        <div>
          <Reveal className="eyebrow">05 — Certifications</Reveal>
          <Reveal delay={1} className="section-title" as="h2">
            Certifications
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
            {certifications?.map((c, i) => (
              <Reveal key={c.title} delay={(i % 4) + 1} className="card cert-row" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                {c.image ? (
                  <img src={c.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: "1px solid var(--line)" }} />
                ) : (
                  <BadgeCheck size={18} color="var(--amber)" style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{c.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-low)", marginTop: 2 }}>{c.issuer}</div>
                </div>
                {c.date && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-low)", flexShrink: 0 }}>{c.date}</div>}
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal className="eyebrow">Achievements</Reveal>
          <Reveal delay={1} className="section-title" as="h2" style={{ fontSize: 28 }}>
            Highlights
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
            {achievements?.map((a, i) => (
              <Reveal key={a} delay={(i % 4) + 1} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Award size={16} color="var(--gold-soft)" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ color: "var(--text-mid)", fontSize: 14.5, lineHeight: 1.6 }}>{a}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cert-row:hover { transform: translateX(4px); }
        @media (max-width: 900px) {
          #certifications .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}