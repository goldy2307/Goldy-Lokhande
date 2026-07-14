import useReveal from "../hooks/useReveal.js";

// <Reveal delay={2}>...</Reveal> — fades + slides content up as it scrolls
// into the viewport. delay is an optional 1-4 step (see .reveal-delay-N).
export default function Reveal({ as: Tag = "div", delay, className = "", children, ...rest }) {
  const [ref, inView] = useReveal();
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  return (
    <Tag ref={ref} className={`reveal ${inView ? "in" : ""} ${delayClass} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
