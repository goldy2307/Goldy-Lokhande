import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 18, 100);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setExiting(true), 250);
          setTimeout(() => onDone?.(), 900);
        }
        return next;
      });
    }, 140);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "var(--ink-950)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-mid)", fontSize: 13, letterSpacing: "0.08em" }}
          >
            Loading
          </motion.div>
          <div style={{ width: 220, height: 2, background: "var(--line)", borderRadius: 2, overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
              style={{ height: "100%", background: "var(--amber)" }}
            />
          </div>
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--amber)", fontSize: 12 }}>
            {Math.floor(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
