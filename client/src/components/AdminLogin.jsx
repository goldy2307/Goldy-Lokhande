import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { login } from "../api/api.js";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await login(email, password);
      localStorage.setItem("portfolio_admin_token", token);
      onLogin(token);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ink-950)" }}>
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="card"
        style={{ width: "min(380px, 90vw)", padding: 34, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--amber-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={16} color="var(--amber)" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Admin sign in</div>
            <div style={{ fontSize: 12.5, color: "var(--text-low)" }}>Edit portfolio content</div>
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
        </label>

        {error && <div style={{ color: "#f87171", fontSize: 13 }}>{error}</div>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: "center", marginTop: 6 }}>
          <LogIn size={16} /> {loading ? "Signing in..." : "Sign in"}
        </button>

        <a href="/" style={{ textAlign: "center", fontSize: 12.5, color: "var(--text-low)" }}>
          ← back to site
        </a>
      </motion.form>
    </div>
  );
}
