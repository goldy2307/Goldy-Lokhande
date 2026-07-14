import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Send, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Reveal from "./Reveal.jsx";
import { sendContactMessage } from "../api/api.js";

const initialForm = { name: "", email: "", subject: "", message: "", honeypot: "" };

export default function Contact({ contactEmail, contactPhone }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await sendContactMessage(form);
      setStatus("success");
      setForm(initialForm);
      setTimeout(() => setStatus("idle"), 4500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong.");
      setTimeout(() => setStatus("idle"), 4500);
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56 }}>
        <div>
          <Reveal className="eyebrow">07 — Contact</Reveal>
          <Reveal delay={1} className="section-title" as="h2">
            Let's build something
          </Reveal>
          <Reveal delay={1} className="section-sub">
            Open to Full Stack, Java Backend and SDE roles. Reach out directly, or use the form.
          </Reveal>

          <Reveal delay={2} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="contact-line">
                <Mail size={17} color="var(--amber)" /> {contactEmail}
              </a>
            )}
            {contactPhone && (
              <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="contact-line">
                <Phone size={17} color="var(--amber)" /> {contactPhone}
              </a>
            )}
          </Reveal>
        </div>

        <Reveal delay={1}>
          <form onSubmit={handleSubmit} className="card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* honeypot - hidden from real users, bots tend to fill every field */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.honeypot}
              onChange={(e) => update("honeypot", e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Name" value={form.name} onChange={(v) => update("name", v)} required />
              <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
            </div>
            <Field label="Subject" value={form.subject} onChange={(v) => update("subject", v)} />
            <Field label="Message" as="textarea" rows={5} value={form.message} onChange={(v) => update("message", v)} required />

            <button type="submit" disabled={status === "sending"} className="btn btn-primary" style={{ justifyContent: "center", marginTop: 8 }}>
              {status === "sending" ? (
                <>
                  <Loader2 size={16} className="spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send message
                </>
              )}
            </button>

            <AnimatePresence>
              {status === "success" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="toast toast-ok">
                  <CheckCircle2 size={16} /> Message sent — I'll get back to you soon.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="toast toast-err">
                  <XCircle size={16} /> {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>

      <style>{`
        .contact-line { display: flex; align-items: center; gap: 10px; font-size: 15px; color: var(--text-mid); transition: color 0.25s ease, transform 0.25s ease; width: fit-content; }
        .contact-line:hover { color: var(--text-hi); transform: translateX(4px); }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .toast { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 10px 14px; border-radius: 10px; }
        .toast-ok { background: var(--gold-soft-dim); color: var(--gold-soft); }
        .toast-err { background: rgba(239,68,68,0.12); color: #f87171; }
        @media (max-width: 900px) {
          #contact .container { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          #contact form > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", as = "input", rows, required }) {
  const Tag = as;
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>
      {label}
      <Tag
        type={as === "input" ? type : undefined}
        rows={rows}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      />
    </label>
  );
}