import { useState, useEffect } from "react";
import { getContent, saveContent, resetContent, SiteContent } from "@/lib/content";
import { Shield, Save, RotateCcw, LogOut, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "IAFVO@AdminAccess";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(getContent());
  const [activeSection, setActiveSection] = useState<string>("general");

  useEffect(() => {
    const stored = sessionStorage.getItem("iafvo_admin");
    if (stored === "true") setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("iafvo_admin", "true");
      toast.success("Access granted");
    } else {
      toast.error("Access denied — invalid credentials");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("iafvo_admin");
    setAuthenticated(false);
  };

  const handleSave = () => {
    saveContent(content);
    toast.success("Content saved successfully");
  };

  const handleReset = () => {
    if (confirm("Reset all content to defaults? This cannot be undone.")) {
      resetContent();
      setContent(getContent());
      toast.success("Content reset to defaults");
    }
  };

  const updateField = (path: string, value: unknown) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-sm p-8">
          <div className="flex justify-center mb-6">
            <Shield className="w-12 h-12 text-radar" />
          </div>
          <h1 className="font-heading text-lg text-center text-foreground tracking-widest mb-2">ADMIN ACCESS</h1>
          <p className="text-center text-muted-foreground text-sm font-mono mb-8 tracking-wider">IAFVO COMMAND CENTER</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter access code..."
              className="w-full bg-input border border-radar rounded-sm px-4 py-3 text-foreground font-mono text-sm tracking-wider placeholder:text-muted-foreground focus:outline-none focus:border-radar-green/60"
            />
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-heading text-sm tracking-widest uppercase py-3 hover:bg-primary/90 transition-colors glow-green"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sections = [
    { key: "general", label: "General" },
    { key: "about", label: "About Us" },
    { key: "staff", label: "Staff" },
    { key: "fleet", label: "Fleet" },
    { key: "routes", label: "Routes" },
    { key: "hubs", label: "Hubs" },
    { key: "ranks", label: "Ranks" },
    { key: "apply", label: "Apply" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-radar px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-radar" />
          <span className="font-heading text-xs text-radar tracking-widest">IAFVO ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono tracking-wider transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-1 px-4 py-1.5 text-xs bg-primary text-primary-foreground font-mono tracking-wider rounded-sm hover:bg-primary/90 transition-colors glow-green">
            <Save className="w-3 h-3" /> Save
          </button>
          <button onClick={handleLogout} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <div className="w-56 border-r border-radar min-h-[calc(100vh-3.5rem)] bg-card/50 p-4 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full text-left px-3 py-2 text-sm font-body tracking-wide rounded-sm transition-colors flex items-center gap-2 ${
                  activeSection === s.key ? "bg-primary/20 text-radar" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeSection === s.key ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 max-w-4xl">
          {activeSection === "general" && <GeneralEditor content={content} updateField={updateField} />}
          {activeSection === "about" && <AboutEditor content={content} updateField={updateField} />}
          {activeSection === "staff" && <ArrayEditor content={content} setContent={setContent} section="staff" itemKey="members" fields={["name","rank","position","image","bio"]} />}
          {activeSection === "fleet" && <ArrayEditor content={content} setContent={setContent} section="fleet" itemKey="aircraft" fields={["name","type","role","image","specs"]} />}
          {activeSection === "routes" && <ArrayEditor content={content} setContent={setContent} section="routes" itemKey="routeList" fields={["from","to","distance","frequency"]} />}
          {activeSection === "hubs" && <ArrayEditor content={content} setContent={setContent} section="hubs" itemKey="hubList" fields={["name","code","location","type","description"]} />}
          {activeSection === "ranks" && <ArrayEditor content={content} setContent={setContent} section="ranks" itemKey="rankList" fields={["rank","category","description","insignia"]} />}
          {activeSection === "apply" && <ApplyEditor content={content} updateField={updateField} setContent={setContent} />}
        </div>
      </div>
    </div>
  );
};

// Editors
interface EditorProps {
  content: SiteContent;
  updateField: (path: string, value: unknown) => void;
}

const Field = ({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
  <div>
    <label className="block font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-1">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} className="w-full bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60 resize-y" />
    ) : (
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60" />
    )}
  </div>
);

const GeneralEditor = ({ content, updateField }: EditorProps) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6">GENERAL SETTINGS</h2>
    <Field label="Organization Name" value={content.general.orgName} onChange={v => updateField("general.orgName", v)} />
    <Field label="Short Name" value={content.general.shortName} onChange={v => updateField("general.shortName", v)} />
    <Field label="Tagline" value={content.general.tagline} onChange={v => updateField("general.tagline", v)} />
    <Field label="Logo Text" value={content.general.logoText} onChange={v => updateField("general.logoText", v)} />
    <Field label="Footer Text" value={content.general.footerText} onChange={v => updateField("general.footerText", v)} multiline />
  </div>
);

const AboutEditor = ({ content, updateField }: EditorProps) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6">ABOUT PAGE</h2>
    <Field label="Title" value={content.about.title} onChange={v => updateField("about.title", v)} />
    <Field label="Subtitle" value={content.about.subtitle} onChange={v => updateField("about.subtitle", v)} />
    <Field label="Description" value={content.about.description} onChange={v => updateField("about.description", v)} multiline />
    <Field label="Mission" value={content.about.mission} onChange={v => updateField("about.mission", v)} multiline />
    <Field label="Vision" value={content.about.vision} onChange={v => updateField("about.vision", v)} multiline />
    <Field label="History" value={content.about.history} onChange={v => updateField("about.history", v)} multiline />
  </div>
);

const ArrayEditor = ({ content, setContent, section, itemKey, fields }: { content: SiteContent; setContent: (c: SiteContent) => void; section: string; itemKey: string; fields: string[] }) => {
  const sectionData = content[section as keyof SiteContent] as Record<string, unknown>;
  const items = sectionData[itemKey] as Record<string, string>[];

  const addItem = () => {
    const newItem: Record<string, string> = {};
    fields.forEach(f => (newItem[f] = ""));
    const newItems = [...items, newItem];
    setContent({ ...content, [section]: { ...sectionData, [itemKey]: newItems } });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setContent({ ...content, [section]: { ...sectionData, [itemKey]: newItems } });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, [section]: { ...sectionData, [itemKey]: newItems } });
  };

  const sectionTitle = (sectionData as { title?: string }).title || section;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-sm tracking-widest text-foreground uppercase">{sectionTitle}</h2>
        <button onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono tracking-wider rounded-sm hover:bg-primary/90">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-radar tracking-widest">ITEM {i + 1}</span>
              <button onClick={() => removeItem(i)} className="text-destructive hover:text-destructive/80 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map(field => (
                <Field
                  key={field}
                  label={field}
                  value={item[field] || ""}
                  onChange={v => updateItem(i, field, v)}
                  multiline={field === "bio" || field === "description" || field === "specs"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyEditor = ({ content, updateField, setContent }: EditorProps & { setContent: (c: SiteContent) => void }) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6">APPLY PAGE</h2>
    <Field label="Title" value={content.apply.title} onChange={v => updateField("apply.title", v)} />
    <Field label="Subtitle" value={content.apply.subtitle} onChange={v => updateField("apply.subtitle", v)} />
    <Field label="Description" value={content.apply.description} onChange={v => updateField("apply.description", v)} multiline />
    <Field label="Discord Link" value={content.apply.discordLink} onChange={v => updateField("apply.discordLink", v)} />

    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Requirements</label>
        <button
          onClick={() => setContent({ ...content, apply: { ...content.apply, requirements: [...content.apply.requirements, ""] } })}
          className="text-xs text-radar font-mono"
        >
          + Add
        </button>
      </div>
      {content.apply.requirements.map((req, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={req}
            onChange={e => {
              const newReqs = [...content.apply.requirements];
              newReqs[i] = e.target.value;
              setContent({ ...content, apply: { ...content.apply, requirements: newReqs } });
            }}
            className="flex-1 bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60"
          />
          <button
            onClick={() => setContent({ ...content, apply: { ...content.apply, requirements: content.apply.requirements.filter((_, idx) => idx !== i) } })}
            className="text-destructive p-2"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>

    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Positions</label>
        <button
          onClick={() => setContent({ ...content, apply: { ...content.apply, positions: [...content.apply.positions, ""] } })}
          className="text-xs text-radar font-mono"
        >
          + Add
        </button>
      </div>
      {content.apply.positions.map((pos, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={pos}
            onChange={e => {
              const newPos = [...content.apply.positions];
              newPos[i] = e.target.value;
              setContent({ ...content, apply: { ...content.apply, positions: newPos } });
            }}
            className="flex-1 bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60"
          />
          <button
            onClick={() => setContent({ ...content, apply: { ...content.apply, positions: content.apply.positions.filter((_, idx) => idx !== i) } })}
            className="text-destructive p-2"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default Admin;
