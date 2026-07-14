import { motion } from "framer-motion";
import { FileDown, FileText } from "lucide-react";
import Reveal from "./Reveal.jsx";

export default function Resume({ resumeUrl, name }) {
  return (
    <section id="resume" className="section" style={{ background: "var(--ink-900)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <Reveal className="eyebrow">Resume</Reveal>
        <Reveal delay={1} className="section-title" as="h2">
          Get the full picture
        </Reveal>
        <Reveal delay={1} className="section-sub">
          Every role, project and certification above, laid out as a single PDF you can keep, forward or print.
        </Reveal>

        <Reveal delay={2}>
          <div className="card resume-card">
            <div className="resume-card-left">
              <motion.div
                whileHover={{ rotate: -3, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
                className="resume-doc"
              >
                <FileText size={30} color="var(--amber)" />
              </motion.div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{name || "Goldy Lokhande"} — Resume</div>
                <div style={{ fontSize: 13, color: "var(--text-low)", marginTop: 4 }}>Download CV - Last Updated - 14 Jul, 2026</div>
              </div>
            </div>

            {resumeUrl ? (
              <a href={resumeUrl} download target="_blank" rel="noreferrer" className="btn btn-primary">
                <FileDown size={16} /> Download CV
              </a>
            ) : (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--text-low)" }}>
              
              </span>
            )}
          </div>
        </Reveal>
      </div>

      <style>{`
        .resume-card {
          padding: 30px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .resume-card-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .resume-doc {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: var(--amber-dim);
          border: 1px solid var(--line-strong);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}