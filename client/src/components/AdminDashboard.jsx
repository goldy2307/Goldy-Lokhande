import { useEffect, useState } from "react";
import { LogOut, Save, UploadCloud, CheckCircle2, XCircle, Plus, Trash2, ChevronUp, ChevronDown, Link2, FileUp } from "lucide-react";
import { getContent, updateContent } from "../api/api.js";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Blank templates for each "add new item" action.
const BLANK = {
  skills: () => ({ group: "New group", items: [] }),
  journey: () => ({ org: "", role: "", period: "", location: "", points: [], image: "" }),
  projects: () => ({ title: "", tech: "", description: "", link: "", image: "" }),
  certifications: () => ({ title: "", issuer: "", date: "", image: "" }),
  achievements: () => "",
  platforms: () => ({ name: "", url: "", icon: "globe" }),
};

const ICON_OPTIONS = ["github", "linkedin", "naukri", "foundit", "globe"];

export default function AdminDashboard({ token, onLogout }) {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  useEffect(() => {
    getContent()
      .then(setContent)
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

  // --- Array helpers (skills, journey, projects, certifications, achievements, platforms) ---
  function addItem(key) {
    setContent((prev) => {
      const next = structuredClone(prev);
      next[key] = [...(next[key] || []), BLANK[key]()];
      return next;
    });
  }
  function removeItem(key, index) {
    setContent((prev) => {
      const next = structuredClone(prev);
      next[key] = next[key].filter((_, i) => i !== index);
      return next;
    });
  }
  function moveItem(key, index, dir) {
    setContent((prev) => {
      const next = structuredClone(prev);
      const arr = next[key];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return next;
    });
  }
  function updateItem(key, index, field, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      next[key][index][field] = value;
      return next;
    });
  }
  function updateItemRaw(key, index, value) {
    setContent((prev) => {
      const next = structuredClone(prev);
      next[key][index] = value;
      return next;
    });
  }
  async function itemImageUpload(key, index, file) {
    if (!file) return;
    const base64 = await fileToBase64(file);
    updateItem(key, index, "image", base64);
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

  async function saveSection(key, label) {
    setStatus({ type: "saving", msg: "" });
    try {
      const updated = await updateContent({ [key]: content[key] }, token);
      setContent(updated);
      setStatus({ type: "success", msg: `Saved "${label}".` });
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
  }

  if (!content) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-mid)", padding: 24, textAlign: "center" }}>
        {status.type === "error" ? status.msg : "Loading content…"}
      </div>
    );
  }

  return (
    <div className="admin-wrap" style={{ minHeight: "100vh", padding: "32px 0 100px" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="admin-header">
          <div>
            <h1 style={{ fontSize: 24 }}>Admin panel</h1>
            <p style={{ color: "var(--text-low)", fontSize: 13, marginTop: 4 }}>Edit content shown on the live site.</p>
          </div>
          <button className="btn btn-ghost" onClick={onLogout}>
            <LogOut size={15} /> Log out
          </button>
        </div>

        {status.type !== "idle" && (
          <div className={`toast ${status.type === "error" ? "toast-err" : "toast-ok"}`} style={{ marginBottom: 24, width: "fit-content", maxWidth: "100%" }}>
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
          <ImageField label="Avatar (hero photo)" value={content.hero.avatar} onUpload={(f) => handleImageUpload("hero.avatar", f)} onUrl={(v) => updateField("hero.avatar", v)} />
          <FileOrLinkField
            label="Resume / CV"
            value={content.hero.resumeUrl}
            accept=".pdf,.doc,.docx"
            onUpload={async (file) => {
              if (!file) return;
              const base64 = await fileToBase64(file);
              updateField("hero.resumeUrl", base64);
            }}
            onUrl={(v) => updateField("hero.resumeUrl", v)}
          />
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

        <button className="btn btn-primary admin-save-top" onClick={saveTopLevel} style={{ marginBottom: 48 }}>
          <Save size={16} /> Save hero, about & contact
        </button>

        {/* --- Skills --- */}
        <Panel title="Skills">
          {content.skills?.map((group, i) => (
            <ItemCard key={i} onRemove={() => removeItem("skills", i)} onUp={() => moveItem("skills", i, -1)} onDown={() => moveItem("skills", i, 1)} disableUp={i === 0} disableDown={i === content.skills.length - 1}>
              <Text label="Group name" value={group.group} onChange={(v) => updateItem("skills", i, "group", v)} />
              <Text
                label="Items (comma separated)"
                value={group.items?.join(", ") || ""}
                onChange={(v) => updateItem("skills", i, "items", v.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </ItemCard>
          ))}
          <AddButton label="Add skill group" onClick={() => addItem("skills")} />
          <SaveSectionButton onClick={() => saveSection("skills", "Skills")} />
        </Panel>

        {/* --- Journey --- */}
        <Panel title="Journey / Experience">
          {content.journey?.map((entry, i) => (
            <ItemCard key={i} onRemove={() => removeItem("journey", i)} onUp={() => moveItem("journey", i, -1)} onDown={() => moveItem("journey", i, 1)} disableUp={i === 0} disableDown={i === content.journey.length - 1}>
              <TwoCol>
                <Text label="Role" value={entry.role} onChange={(v) => updateItem("journey", i, "role", v)} />
                <Text label="Organization" value={entry.org} onChange={(v) => updateItem("journey", i, "org", v)} />
              </TwoCol>
              <TwoCol>
                <Text label="Period (e.g. Jan 2024 — Present)" value={entry.period} onChange={(v) => updateItem("journey", i, "period", v)} />
                <Text label="Location" value={entry.location} onChange={(v) => updateItem("journey", i, "location", v)} />
              </TwoCol>
              <TextArea
                label="Points (one per line)"
                rows={4}
                value={entry.points?.join("\n") || ""}
                onChange={(v) => updateItem("journey", i, "points", v.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
              <ImageField label="Logo / image (optional)" value={entry.image} onUpload={(f) => itemImageUpload("journey", i, f)} onUrl={(v) => updateItem("journey", i, "image", v)} />
            </ItemCard>
          ))}
          <AddButton label="Add journey entry" onClick={() => addItem("journey")} />
          <SaveSectionButton onClick={() => saveSection("journey", "Journey")} />
        </Panel>

        {/* --- Projects --- */}
        <Panel title="Projects">
          {content.projects?.map((p, i) => (
            <ItemCard key={i} onRemove={() => removeItem("projects", i)} onUp={() => moveItem("projects", i, -1)} onDown={() => moveItem("projects", i, 1)} disableUp={i === 0} disableDown={i === content.projects.length - 1}>
              <Text label="Title" value={p.title} onChange={(v) => updateItem("projects", i, "title", v)} />
              <Text label="Tech stack (e.g. React · Node · MongoDB)" value={p.tech} onChange={(v) => updateItem("projects", i, "tech", v)} />
              <TextArea label="Description" rows={3} value={p.description} onChange={(v) => updateItem("projects", i, "description", v)} />
              <Text label="Project link" value={p.link} onChange={(v) => updateItem("projects", i, "link", v)} />
              <ImageField label="Project image" value={p.image} onUpload={(f) => itemImageUpload("projects", i, f)} onUrl={(v) => updateItem("projects", i, "image", v)} />
            </ItemCard>
          ))}
          <AddButton label="Add project" onClick={() => addItem("projects")} />
          <SaveSectionButton onClick={() => saveSection("projects", "Projects")} />
        </Panel>

        {/* --- Certifications --- */}
        <Panel title="Certifications">
          {content.certifications?.map((c, i) => (
            <ItemCard key={i} onRemove={() => removeItem("certifications", i)} onUp={() => moveItem("certifications", i, -1)} onDown={() => moveItem("certifications", i, 1)} disableUp={i === 0} disableDown={i === content.certifications.length - 1}>
              <Text label="Title" value={c.title} onChange={(v) => updateItem("certifications", i, "title", v)} />
              <TwoCol>
                <Text label="Issuer" value={c.issuer} onChange={(v) => updateItem("certifications", i, "issuer", v)} />
                <Text label="Date" value={c.date} onChange={(v) => updateItem("certifications", i, "date", v)} />
              </TwoCol>
              <ImageField label="Certificate image / badge" value={c.image} onUpload={(f) => itemImageUpload("certifications", i, f)} onUrl={(v) => updateItem("certifications", i, "image", v)} />
            </ItemCard>
          ))}
          <AddButton label="Add certification" onClick={() => addItem("certifications")} />
          <SaveSectionButton onClick={() => saveSection("certifications", "Certifications")} />
        </Panel>

        {/* --- Achievements --- */}
        <Panel title="Achievements">
          {content.achievements?.map((a, i) => (
            <ItemCard key={i} onRemove={() => removeItem("achievements", i)} onUp={() => moveItem("achievements", i, -1)} onDown={() => moveItem("achievements", i, 1)} disableUp={i === 0} disableDown={i === content.achievements.length - 1}>
              <Text label={`Achievement ${i + 1}`} value={a} onChange={(v) => updateItemRaw("achievements", i, v)} />
            </ItemCard>
          ))}
          <AddButton label="Add achievement" onClick={() => addItem("achievements")} />
          <SaveSectionButton onClick={() => saveSection("achievements", "Achievements")} />
        </Panel>

        {/* --- Platforms --- */}
        <Panel title="Platforms (GitHub, LinkedIn, Naukri, foundit...)">
          {content.platforms?.map((p, i) => (
            <ItemCard key={i} onRemove={() => removeItem("platforms", i)} onUp={() => moveItem("platforms", i, -1)} onDown={() => moveItem("platforms", i, 1)} disableUp={i === 0} disableDown={i === content.platforms.length - 1}>
              <TwoCol>
                <Text label="Display name" value={p.name} onChange={(v) => updateItem("platforms", i, "name", v)} />
                <label style={fieldLabelStyle}>
                  Icon
                  <select className="field-input" value={p.icon || "globe"} onChange={(e) => updateItem("platforms", i, "icon", e.target.value)}>
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </label>
              </TwoCol>
              <Text label="URL" value={p.url} onChange={(v) => updateItem("platforms", i, "url", v)} />
            </ItemCard>
          ))}
          <AddButton label="Add platform" onClick={() => addItem("platforms")} />
          <SaveSectionButton onClick={() => saveSection("platforms", "Platforms")} />
        </Panel>
      </div>

      <style>{`
        .admin-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .admin-wrap { padding-top: 20px; }
          .admin-header { flex-direction: column; align-items: stretch; }
          .admin-header button { justify-content: center; }
          .admin-save-top { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}

const fieldLabelStyle = { display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" };

function Panel({ title, children }) {
  return (
    <section className="card admin-panel" style={{ padding: 26, marginBottom: 24 }}>
      <h2 style={{ fontSize: 17, marginBottom: 18 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
      <style>{`
        @media (max-width: 640px) {
          .admin-panel { padding: 18px; }
        }
      `}</style>
    </section>
  );
}

// Card wrapper for one repeatable item (project, cert, journey entry...)
// with remove + reorder controls in the top-right corner.
function ItemCard({ children, onRemove, onUp, onDown, disableUp, disableDown }) {
  return (
    <div className="item-card" style={{ border: "1px solid var(--line)", borderRadius: 12, padding: 18, position: "relative", display: "flex", flexDirection: "column", gap: 14, background: "var(--ink-950)" }}>
      <div className="item-card-controls" style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <IconBtn onClick={onUp} disabled={disableUp} title="Move up"><ChevronUp size={14} /></IconBtn>
        <IconBtn onClick={onDown} disabled={disableDown} title="Move down"><ChevronDown size={14} /></IconBtn>
        <IconBtn onClick={onRemove} title="Remove" danger><Trash2 size={14} /></IconBtn>
      </div>
      {children}
    </div>
  );
}

function IconBtn({ children, onClick, disabled, title, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 8,
        border: "1px solid var(--line-strong)",
        background: "transparent",
        color: disabled ? "var(--text-low)" : danger ? "#f87171" : "var(--text-mid)",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button type="button" className="btn btn-ghost" onClick={onClick} style={{ alignSelf: "flex-start" }}>
      <Plus size={15} /> {label}
    </button>
  );
}

function SaveSectionButton({ onClick }) {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick} style={{ alignSelf: "flex-start", marginTop: 4 }}>
      <Save size={15} /> Save section
    </button>
  );
}

// Two fields side by side on desktop, stacked on mobile.
function TwoCol({ children }) {
  return (
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {children}
      <style>{`
        @media (max-width: 520px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Text({ label, value, onChange }) {
  return (
    <label style={fieldLabelStyle}>
      {label}
      <input className="field-input" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label style={fieldLabelStyle}>
      {label}
      <textarea className="field-input" rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ImageField({ label, value, onUpload, onUrl }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>{label}</span>
      <div className="image-field-row" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {value && <img src={value} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)", flexShrink: 0 }} />}
        <label className="btn btn-ghost" style={{ cursor: "pointer", flexShrink: 0 }}>
          <UploadCloud size={15} /> Upload
          <input type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
        </label>
        <input className="field-input" placeholder="or paste image URL" style={{ flex: 1, minWidth: 180 }} value={value?.startsWith("data:") ? "" : value || ""} onChange={(e) => onUrl(e.target.value)} />
      </div>
    </div>
  );
}

// Resume/CV field — toggle between uploading a file (PDF/DOC, stored as
// base64) and pasting an external link (Google Drive, Dropbox, etc.).
function FileOrLinkField({ label, value, accept, onUpload, onUrl }) {
  const isUploaded = value?.startsWith("data:");
  const [mode, setMode] = useState(isUploaded ? "upload" : "link");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 12.5, color: "var(--text-low)", fontFamily: "var(--font-mono)" }}>{label}</span>

      <div style={{ display: "flex", gap: 8 }}>
        <ModeTab active={mode === "upload"} onClick={() => setMode("upload")} icon={<FileUp size={13} />} label="Upload file" />
        <ModeTab active={mode === "link"} onClick={() => setMode("link")} icon={<Link2 size={13} />} label="Paste link" />
      </div>

      {mode === "upload" ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
            <UploadCloud size={15} /> Choose file
            <input type="file" accept={accept} hidden onChange={(e) => onUpload(e.target.files?.[0])} />
          </label>
          {isUploaded && <span style={{ fontSize: 12.5, color: "var(--gold-soft)" }}>File attached ✓</span>}
        </div>
      ) : (
        <input
          className="field-input"
          placeholder="https://drive.google.com/... or any public link"
          value={isUploaded ? "" : value || ""}
          onChange={(e) => onUrl(e.target.value)}
        />
      )}
    </div>
  );
}

function ModeTab({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12.5,
        fontFamily: "var(--font-mono)",
        padding: "7px 12px",
        borderRadius: 999,
        border: `1px solid ${active ? "var(--amber)" : "var(--line-strong)"}`,
        background: active ? "var(--amber-dim)" : "transparent",
        color: active ? "var(--gold-soft)" : "var(--text-mid)",
      }}
    >
      {icon} {label}
    </button>
  );
}