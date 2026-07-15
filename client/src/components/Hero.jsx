import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";
import ThreeDBackground from "./ThreeDBackground.jsx";

function useTypedRoles(roles) {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!roles?.length) return;
    const current = roles[roleIndex % roles.length];
    const speed = deleting ? 35 : 65;

    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setRoleIndex((i) => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles]);

  return text;
}

export default function Hero({ hero }) {
  const typed = useTypedRoles(hero?.roles);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="top" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* Ambient glow — gold + white, no blue */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: `-20%`,
          right: "-10%",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--amber-dim), transparent 70%)",
          transform: `translateY(${offset * 0.15}px)`,
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--white-dim), transparent 70%)",
          transform: `translateY(${offset * -0.1}px)`,
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 48, alignItems: "center", paddingTop: 96 }}>
        <div>
          

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            style={{ fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 20 }}
          >
            {hero?.name || "Goldy Lokhande"}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(15px, 2vw, 19px)",
              color: "var(--gold-soft)",
              marginBottom: 24,
              minHeight: 28,
            }}
          >
            <span style={{ color: "var(--text-low)" }}>{"$ whoami >> "}</span>
            {typed}
            <span className="caret">|</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ color: "var(--text-mid)", fontSize: 17, lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}
          >
            {hero?.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <a href="#contact" className="btn btn-primary">
              <Mail size={16} /> Get in touch
            </a>
            {hero?.resumeUrl ? (
              <a href={hero.resumeUrl} download={`${(hero?.name || "Resume").replace(/\s+/g, "_")}_Resume.pdf`} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Download size={16} /> Download CV
              </a>
            ) : (
              <a href="#projects" className="btn btn-ghost">
                View work
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: "relative", justifySelf: "center" }}
        >
          {/* Rotating 3D gold wireframe behind the avatar */}
          <ThreeDBackground
            size={300}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
              opacity: 0.8,
            }}
          />

          <div
            style={{
              width: "min(320px, 70vw)",
              aspectRatio: "1 / 1",
              borderRadius: "28px",
              border: "1px solid var(--line-strong)",
              background: hero?.avatar
                ? `url(${hero.avatar}) center/cover no-repeat`
                : "linear-gradient(160deg, var(--ink-800), var(--ink-900))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              zIndex: 1,
              boxShadow: "0 30px 80px -30px rgba(217, 178, 76, 0.3)",
            }}
          >
            {!hero?.avatar && (
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-low)", fontSize: 13, textAlign: "center", padding: 20 }}>
                Loading .....
              </span>
            )}
          </div>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: "28px",
              border: "1px solid var(--amber)",
              opacity: 0.35,
              transform: "translate(14px, 14px)",
              zIndex: 0,
            }}
          />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          color: "var(--text-low)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontFamily: "var(--font-mono)",
        }}
      >
      </motion.a>

      <style>{`
        .caret { color: var(--gold-soft); animation: blink 1s step-start infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        @media (max-width: 900px) {
          #top .container { grid-template-columns: 1fr !important; }
          #top .container > div:first-child > * { margin-left: auto; margin-right: auto; }
        }
      `}</style>
    </section>
  );
}