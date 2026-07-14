// Pure-CSS 3D decorative scene: a slowly rotating wireframe cube plus two
// orbiting rings, in gold on black. No canvas/WebGL — cheap, and respects
// prefers-reduced-motion (frozen via the global rule in index.css).
export default function ThreeDBackground({ size = 220, style = {} }) {
  const half = size / 2;

  return (
    <div className="scene3d gl-3d" style={{ width: size, height: size, ...style }} aria-hidden>
      <div className="gl-cube" style={{ width: size, height: size }}>
        <div className="gl-face gl-front" style={{ transform: `translateZ(${half}px)`, width: size, height: size }} />
        <div className="gl-face gl-back" style={{ transform: `translateZ(-${half}px) rotateY(180deg)`, width: size, height: size }} />
        <div className="gl-face gl-right" style={{ transform: `rotateY(90deg) translateZ(${half}px)`, width: size, height: size }} />
        <div className="gl-face gl-left" style={{ transform: `rotateY(-90deg) translateZ(${half}px)`, width: size, height: size }} />
        <div className="gl-face gl-top" style={{ transform: `rotateX(90deg) translateZ(${half}px)`, width: size, height: size }} />
        <div className="gl-face gl-bottom" style={{ transform: `rotateX(-90deg) translateZ(${half}px)`, width: size, height: size }} />
      </div>

      <div className="gl-ring gl-ring-a" style={{ width: size * 1.5, height: size * 1.5 }} />
      <div className="gl-ring gl-ring-b" style={{ width: size * 1.2, height: size * 1.2 }} />

      <style>{`
        .gl-3d {
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gl-cube {
          position: relative;
          transform-style: preserve-3d;
          animation: gl-spin 16s linear infinite;
        }
        .gl-face {
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid rgba(217, 178, 76, 0.55);
          background: linear-gradient(135deg, rgba(217, 178, 76, 0.06), rgba(240, 223, 160, 0.02));
          box-shadow: inset 0 0 30px rgba(217, 178, 76, 0.08);
        }
        .gl-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(245, 245, 245, 0.14);
          transform-style: preserve-3d;
        }
        .gl-ring-a {
          animation: gl-orbit-a 12s linear infinite;
          border-color: rgba(217, 178, 76, 0.35);
        }
        .gl-ring-b {
          animation: gl-orbit-b 18s linear infinite reverse;
        }
        @keyframes gl-spin {
          from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          to   { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes gl-orbit-a {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to   { transform: rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes gl-orbit-b {
          from { transform: rotateX(60deg) rotateY(20deg) rotateZ(0deg); }
          to   { transform: rotateX(60deg) rotateY(20deg) rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
}