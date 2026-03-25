import { useState, useEffect } from "react";
import { getContent, saveContent, resetContent, SiteContent } from "@/lib/content";
import { Shield, Save, RotateCcw, LogOut, Plus, Trash2, ChevronDown, ChevronRight, Upload, X } from "lucide-react";
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

  // Image Upload Helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB Limit for Base64 storage safety
        toast.error("Image too large. Please use a file under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-sm p-8 text-center">
          <Shield className="w-12 h-12 text-radar mx-auto mb-6" />
          <h1 className="font-heading text-lg text-foreground tracking-widest mb-2">ADMIN ACCESS</h1>
          <p className="text-muted-foreground text-sm font-mono mb-8 tracking-wider">IAFVO COMMAND CENTER</p>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter access code..."
              className="w-full bg-input border border-radar rounded-sm px-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:border-radar-green/60"
            />
            <button type="submit" className="w-full bg-primary text-primary-foreground font-heading text-sm tracking-widest uppercase py-3 hover:bg-primary/90 transition-colors glow-green">
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-radar px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-radar" />
          <span className="font-heading text-xs text-radar tracking-widest uppercase">IAFVO Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-1 px-4 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90 glow-green">
            <Save className="w-3 h-3" /> Save
          </button>
          <button onClick={handleLogout} className="p-1.5 text-muted-foreground hover:text-foreground"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="pt-14 flex">
        <div className="w-56 border-r border-radar min-h-[calc(100vh-3.5rem)] bg-card/50 p-4 sticky top-14">
          <nav className="space-y-1">
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full text-left px-3 py-2 text-sm font-body rounded-sm flex items-center gap-2 transition-colors ${
                  activeSection === s.key ? "bg-radar/10 text-radar" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeSection === s.key ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-8 max-w-5xl">
          {activeSection === "general" && <GeneralEditor content={content} updateField={updateField} />}
          {activeSection === "about" && <AboutEditor content={content} updateField={updateField} />}
          {activeSection === "staff" && <ArrayEditor content={content} setContent={setContent} section="staff" itemKey="members" fields={["name","rank","position","image","bio"]} handleImageUpload={handleImageUpload} />}
          {activeSection === "fleet" && <ArrayEditor content={content} setContent={setContent} section="fleet" itemKey="aircraft" fields={["name","type","role","image","specs"]} handleImageUpload={handleImageUpload} />}
          {activeSection === "routes" && <ArrayEditor content={content} setContent={setContent} section="routes" itemKey="routeList" fields={["from","to","distance","frequency"]} handleImageUpload={handleImageUpload} />}
          {activeSection === "hubs" && <ArrayEditor content={content} setContent={setContent} section="hubs" itemKey="hubList" fields={["name","code","location","type","description"]} handleImageUpload={handleImageUpload} />}
          {activeSection === "ranks" && <ArrayEditor content={content} setContent={setContent} section="ranks" itemKey="rankList" fields={["rank","category","description","insignia"]} handleImageUpload={handleImageUpload} />}
          {activeSection === "apply" && <ApplyEditor content={content} updateField={updateField} setContent={setContent} />}
        </div>
      </div>
    </div>
  );
};

// --- Reusable Components ---

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

const ArrayEditor = ({ content, setContent, section, itemKey, fields, handleImageUpload }: any) => {
  const sectionData = content[section];
  const items = sectionData[itemKey] || [];

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setContent({ ...content, [section]: { ...sectionData, [itemKey]: newItems } });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-sm tracking-widest text-foreground uppercase">{section} Editor</h2>
        <button onClick={() => setContent({...content, [section]: {...sectionData, [itemKey]: [...items, {}]}})} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm"><Plus className="w-3 h-3" /> Add Item</button>
      </div>
      <div className="space-y-6">
        {items.map((item: any, i: number) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => setContent({...content, [section]: {...sectionData, [itemKey]: items.filter((_:any, idx:number) => idx !== i)}})} className="absolute top-4 right-4 text-destructive"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field: string) => (
                <div key={field}>
                  {(field === "insignia" || field === "image") ? (
                    <div>
                      <label className="block font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-1">{field}</label>
                      <div className="flex items-center gap-3">
                        {item[field] && <img src={item[field]} className="w-12 h-12 object-contain border border-radar bg-black/40" alt="Preview" />}
                        <label className="flex-1 border border-dashed border-radar hover:bg-radar/5 transition-colors p-2 rounded-sm cursor-pointer flex items-center justify-center gap-2">
                          <Upload className="w-3 h-3 text-radar" />
                          <span className="text-[10px] text-muted-foreground uppercase font-mono">Upload Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (b: string) => updateItem(i, field, b))} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <Field label={field} value={item[field] || ""} onChange={v => updateItem(i, field, v)} multiline={field === "bio" || field === "description" || field === "specs"} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Static Editors (Truncated for space, same as your original logic)
const GeneralEditor = ({ content, updateField }: any) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6 uppercase">General Settings</h2>
    <Field label="Org Name" value={content.general.orgName} onChange={v => updateField("general.orgName", v)} />
    <Field label="Short Name" value={content.general.shortName} onChange={v => updateField("general.shortName", v)} />
    <Field label="Tagline" value={content.general.tagline} onChange={v => updateField("general.tagline", v)} />
  </div>
);

const AboutEditor = ({ content, updateField }: any) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6 uppercase">About Us</h2>
    <Field label="Title" value={content.about.title} onChange={v => updateField("about.title", v)} />
    <Field label="Description" value={content.about.description} onChange={v => updateField("about.description", v)} multiline />
  </div>
);

const ApplyEditor = ({ content, updateField, setContent }: any) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6 uppercase">Applications</h2>
    <Field label="Discord Link" value={content.apply.discordLink} onChange={v => updateField("apply.discordLink", v)} />
  </div>
);

export default Admin;
