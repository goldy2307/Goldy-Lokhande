import { useEffect, useState } from "react";
import { LogOut, Save, UploadCloud, CheckCircle2, XCircle } from "lucide-react";
import { getContent, updateContent } from "../api/api.js";

// Sections edited as raw-but-friendly JSON. Keeps the admin panel small
// while still covering every array-shaped section (skills, journey,
// projects, certifications, achievements, platforms).
const JSON_SECTIONS = [
  { key: "skills", label: "Skills" },
  { key: "journey", label: "Journey / Experience" },
  { key: "projects", label: "Projects" },
  { key: "certifications", label: "Certifications" },
  { key: "achievements", label: "Achievements" },
  { key: "platforms", label: "Platforms (GitHub, LinkedIn, Naukri, foundit...)" },
];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminDashboard({ token, onLogout }) {
  const [content, setContent] = useState(null);
  const [jsonDrafts, setJsonDrafts] = useState({});
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  useEffect(() => {
    getContent()
      .then((data) => {
        setContent(data);
        const drafts = {};
        JSON_SECTIONS.forEach((s) => (drafts[s.key] = JSON.stringify(data[s.key] || [], null, 2)));
        setJsonDrafts(drafts);
      })
      .catch((err) => setStatus({ type: "error", msg: err.message }));
  }, []);

  function updateField(path, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleImageUpload(path, file) {
    if (!file) return;
    const base64 = await fileToBase64(file);
    updateField(path, base64);
  }

  async function saveTopLevel() {
    setStatus({ type: "saving", msg: "" });
    try {
      const payload = {
        hero: content.hero,
        about: content.about,
        contactEmail: content.contactEmail,
        contactPhone: content.contactPhone,
      };
      const updated = await updateContent(payload, token);
      setContent(updated);
      setStatus({ type: "success", msg: "Saved hero, about & contact info." });
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
  }

  async function saveJsonSection(key) {
    setStatus({ type: "saving", msg: "" });
    try {
      const parsed = JSON.parse(jsonDrafts[key]);
      const updated = await updateContent({ [key]: parsed }, token);
      setContent(updated);
      setStatus({ type: "success", msg: `Saved "${key}".` });
    } catch (err) {
      setStatus({ type: "error", msg: err instanceof SyntaxError ? `Invalid JSON in "${key}"` : err.message });
    }
  }

  if (!content) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-mid)" }}>
        {status.type === "error" ? status.msg : "Loading content…"}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "40px 0 100px" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26 }}>Admin panel</h1>
            <p style={{ color: "var(--text-low)", fontSize: 13, marginTop: 4 }}>Edit content shown on the live site.</p>
          </div>
          <button className="btn btn-ghost" onClick={onLogout}>
            <LogOut size={15} /> Log out
          </button>
        </div>

        {status.type !== "idle" && (
          <div className={`toast ${status.type === "error" ? "toast-err" : "toast-ok"}`} style={{ marginBottom: 24, width: "fit-content" }}>
            {status.type === "error" ? <XCircle size={16} /> : status.type === "saving" ? null : <CheckCircle2 size={16} />}
            {status.type === "saving" ? "Saving…" : status.msg}
          </div>
        )}

        {/* --- Hero --- */}
        <Panel title="Hero">
          <Text label="Name" value={content.hero.name} onChange={(v) => updateField("hero.name", v)} />
          <Text
            label="Roles (comma separated, typed animation)"
            value={content.hero.roles?.join(", ") || ""}
            onChange={(v) => updateField("hero.roles", v.split(",").map((s) => s.trim()).filter(Boolean))}
          />
          <TextArea label="Tagline" value={content.hero.tagline} onChange={(v) => updateField("hero.tagline", v)} />
          <Text label="Resume URL" value={content.hero.resumeUrl} onChange={(v) => updateField("hero.resumeUrl", v)} />
          <ImageField label="Avatar (hero photo)" value={content.hero.avatar} onUpload={(f) => handleImageUpload("hero.avatar", f)} onUrl={(v) => updateField("hero.avatar", v)} />
        </Panel>

        {/* --- About --- */}
        <Panel title="About">
          <TextArea label="Bio" rows={6} value={content.about.bio} onChange={(v) => updateField("about.bio", v)} />
          <Text label="Location" value={content.about.location} onChange={(v) => updateField("about.location", v)} />
          <ImageField label="Personal photo" value={content.about.photo} onUpload={(f) => handleImageUpload("about.photo", f)} onUrl={(v) => updateField("about.photo", v)} />
        </Panel>

        {/* --- Contact --- */}
        <Panel title="Contact">
          <Text label="Contact email" value={content.contactEmail} onChange={(v) => updateField("contactEmail", v)} />
          <Text label="Contact phone" value={content.contactPhone} onChange={(v) => updateField("contactPhone", v)} />
        </Panel>

        <button className="btn btn-primary" onClick={saveTopLevel} style={{ marginBottom: 48 }}>
          <Save size={16} /> Save hero, about & contact
        </button>

        {/* --- JSON-editable sections --- */}
        {JSON_SECTIONS.map((s) => (
          <Panel key={s.key} title={s.label}>
            <p style={{ fontSize: 12, color: "var(--text-low)", marginBottom: 10 }}>
              Edit as JSON. Image fields inside entries accept an image URL or a base64 string.
            </p>
            <textarea
              className="field-input"
              rows={10}
              style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}
              value={jsonDrafts[s.key]}
              onChange={(e) => setJsonDrafts((d) => ({ ...d, [s.key]: e.target.value }))}
            />
            <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => saveJsonSection(s.key)}>
              <Save size={15} /> Save {s.label}
            </button>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="card" style={{ padding: 26, marginBottom: 24 }}>
      <h2 style={{ fontSize: 17, marginBottom: 18 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </section>
  );
}

function Text({ label, value, onChange }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>
      {label}
      <input className="field-input" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>
      {label}
      <textarea className="field-input" rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ImageField({ label, value, onUpload, onUrl }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>{label}</span>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {value && <img src={value} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)" }} />}
        <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
          <UploadCloud size={15} /> Upload
          <input type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
        </label>
        <input className="field-input" placeholder="or paste image URL" style={{ flex: 1, minWidth: 180 }} value={value?.startsWith("data:") ? "" : value || ""} onChange={(e) => onUrl(e.target.value)} />
      </div>
    </div>
  );
}
