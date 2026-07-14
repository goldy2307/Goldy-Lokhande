export default function Footer({ name }) {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 0" }}>
      <div
        className="container"
        style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--text-low)" }}
      >
        <span>© {new Date().getFullYear()} {name}</span>
        
      </div>
    </footer>
  );
}
