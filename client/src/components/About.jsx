import Reveal from "./Reveal.jsx";
import { MapPin } from "lucide-react";

export default function About({ about }) {
  return (
    <section id="about" className="section">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 56, alignItems: "start" }}>
        <Reveal>
          <div
            style={{
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
              background: about?.photo
                ? `url(${about.photo}) center/cover no-repeat`
                : "linear-gradient(160deg, var(--ink-800), var(--ink-900))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "sticky",
              top: 100,
            }}
          >
            {!about?.photo && (
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-low)", fontSize: 13, textAlign: "center", padding: 20 }}>
                Loading...
              </span>
            )}
          </div>
        </Reveal>

        <div>
          <Reveal className="eyebrow">01 — About</Reveal>
          <Reveal delay={1} className="section-title" as="h2">
            Building things that ship, not just demos.
          </Reveal>

          <Reveal delay={2}>
            <p style={{ color: "var(--text-mid)", fontSize: 17, lineHeight: 1.8, marginBottom: 32 }}>{about?.bio}</p>
          </Reveal>

          {about?.location && (
            <Reveal delay={2} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-low)", fontFamily: "var(--font-mono)", fontSize: 13, marginBottom: 40 }}>
              <MapPin size={14} /> {about.location}
            </Reveal>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {about?.stats?.map((s, i) => (
              <Reveal key={s.label} delay={((i % 4) + 1)} className="card stat-card" style={{ padding: "22px 20px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "var(--amber)" }}>{s.value}</div>
                <div style={{ color: "var(--text-mid)", fontSize: 13, marginTop: 6 }}>{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .stat-card:hover { transform: translateY(-4px); }
        @media (max-width: 900px) {
          #about .container { grid-template-columns: 1fr !important; }
          #about .container > div:first-child > div { position: static !important; max-width: 320px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
