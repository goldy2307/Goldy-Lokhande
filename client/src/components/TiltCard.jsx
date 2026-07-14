import { useRef } from "react";

// Lightweight 3D tilt on mousemove — no library needed. Respects
// prefers-reduced-motion via a CSS check.
export default function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);

  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function handleMove(e) {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
  }

  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)", willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
