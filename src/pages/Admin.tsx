import { useState, useEffect } from "react";
import { SiteContent } from "@/lib/content";
import { supabase } from "@/lib/supabase"; // Ensure this path is correct
import { Shield, Save, RotateCcw, LogOut, Plus, Trash2, ChevronDown, ChevronRight, Upload, Download } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "IAFVO@AdminAccess";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeSection, setActiveSection] = useState<string>("general");
  const [loading, setLoading] = useState(true);

  // 1. Initial Auth Check & Data Fetch
  useEffect(() => {
    const stored = sessionStorage.getItem("iafvo_admin");
    if (stored === "true") setAuthenticated(true);

    const fetchGlobalContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_data')
          .select('content')
          .eq('id', 1) // Assuming your row ID is 1
          .single();

        if (error) throw error;
        if (data) setContent(data.content);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load content from Supabase");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalContent();
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

  // 2. Save to Supabase (Global Update)
  const handleSave = async () => {
    if (!content) return;
    const toastId = toast.loading("Syncing with Supabase...");
    try {
      const { error } = await supabase
        .from('site_data')
        .update({ content: content })
        .eq('id', 1);

      if (error) throw error;
      toast.success("Global update successful!", { id: toastId });
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Cloud sync failed", { id: toastId });
    }
  };

  // 3. Export Local JSON (For backup/migration)
  const handleExport = () => {
    if (!content) return;
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "iafvo_backup.json";
    link.click();
    toast.success("Backup downloaded locally");
  };

  const updateField = (path: string, value: unknown) => {
    setContent(prev => {
      if (!prev) return prev;
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { // 800KB limit for Base64 safety
        toast.error("Image too large. Keep it under 800KB.");
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

  if (loading || !content) return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-radar animate-pulse">CONNECTING TO DATABASE...</div>;

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
          <span className="font-heading text-xs text-radar tracking-widest uppercase">IAFVO Cloud Control</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono transition-colors">
            <Download className="w-3 h-3" /> Export
          </button>
          <button onClick={handleSave} className="flex items-center gap-1 px-4 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90 glow-green">
            <Save className="w-3 h-3" /> Push to Live
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

// --- Helper Components ---

const Field = ({ label, value, onChange, multiline = false }: any) => (
  <div className="mb-4">
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
            <button onClick={() => setContent({...content, [section]: {...sectionData, [itemKey]: items.filter((_:any, idx:number) => idx !== i)}})} className="absolute top-4 right-4 text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
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
                    <Field label={field} value={item[field] || ""} onChange={(v: string) => updateItem(i, field, v)} multiline={field === "bio" || field === "description" || field === "specs"} />
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

const GeneralEditor = ({ content, updateField }: any) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6 uppercase border-b border-radar pb-2">General Settings</h2>
    <Field label="Organization Name" value={content.general.orgName} onChange={(v: string) => updateField("general.orgName", v)} />
    <Field label="Short Name" value={content.general.shortName} onChange={(v: string) => updateField("general.shortName", v)} />
    <Field label="Tagline" value={content.general.tagline} onChange={(v: string) => updateField("general.tagline", v)} />
  </div>
);

const AboutEditor = ({ content, updateField }: any) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6 uppercase border-b border-radar pb-2">About Us</h2>
    <Field label="Title" value={content.about.title} onChange={(v: string) => updateField("about.title", v)} />
    <Field label="Subtitle" value={content.about.subtitle} onChange={(v: string) => updateField("about.subtitle", v)} />
    <Field label="Mission Statement" value={content.about.mission} onChange={(v: string) => updateField("about.mission", v)} multiline />
  </div>
);

const ApplyEditor = ({ content, updateField }: any) => (
  <div className="space-y-4">
    <h2 className="font-heading text-sm tracking-widest text-foreground mb-6 uppercase border-b border-radar pb-2">Recruitment</h2>
    <Field label="Discord Join Link" value={content.apply.discordLink} onChange={(v: string) => updateField("apply.discordLink", v)} />
    <Field label="Requirements Summary" value={content.apply.description} onChange={(v: string) => updateField("apply.description", v)} multiline />
  </div>
);

export default Admin;
