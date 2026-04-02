import { useState, useEffect, useCallback } from "react";
import { SiteContent, defaultContent, fetchContent, saveContent } from "@/lib/content";
import {
  Shield, Save, LogOut, Plus, Trash2, ChevronDown, ChevronRight,
  Upload, Download, RefreshCw, AlertTriangle, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "IAFVO@AdminAccess";

// ─── Tiny primitives ────────────────────────────────────────────────────────

const Field = ({
  label, value, onChange, multiline = false, type = "text", placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; type?: string; placeholder?: string;
}) => (
  <div className="mb-4">
    <label className="block font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-1">{label}</label>
    {multiline ? (
      <textarea
        value={value} onChange={e => onChange(e.target.value)} rows={4} placeholder={placeholder}
        className="w-full bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60 resize-y"
      />
    ) : (
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60"
      />
    )}
  </div>
);

const ImageField = ({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { toast.error("Image must be under 1 MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label className="block font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="preview" className="w-14 h-14 object-contain border border-radar bg-black/40 rounded-sm flex-shrink-0" />
        )}
        <label className="flex-1 border border-dashed border-radar hover:bg-radar/5 transition-colors p-3 rounded-sm cursor-pointer flex items-center justify-center gap-2">
          <Upload className="w-3 h-3 text-radar" />
          <span className="text-[10px] text-muted-foreground uppercase font-mono">{value ? "Replace Image" : "Upload Image"}</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
        </label>
        {value && (
          <button onClick={() => onChange("")} className="text-destructive hover:scale-110 transition-transform p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Section Editors ─────────────────────────────────────────────────────────

const GeneralEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const u = (key: string, v: string) => set({ ...c, general: { ...c.general, [key]: v } });
  return (
    <div className="space-y-1">
      <Field label="Organization Full Name" value={c.general.orgName} onChange={v => u("orgName", v)} />
      <Field label="Short Name / Abbreviation" value={c.general.shortName} onChange={v => u("shortName", v)} />
      <Field label="Tagline" value={c.general.tagline} onChange={v => u("tagline", v)} />
      <Field label="Footer Text" value={c.general.footerText} onChange={v => u("footerText", v)} multiline />
      <Field label="Logo Text (fallback)" value={c.general.logoText} onChange={v => u("logoText", v)} />
    </div>
  );
};

const AboutEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const u = (key: string, v: string) => set({ ...c, about: { ...c.about, [key]: v } });
  return (
    <div className="space-y-1">
      <Field label="Page Title" value={c.about.title} onChange={v => u("title", v)} />
      <Field label="Subtitle" value={c.about.subtitle} onChange={v => u("subtitle", v)} />
      <Field label="Main Description" value={c.about.description} onChange={v => u("description", v)} multiline />
      <Field label="Mission Statement" value={c.about.mission} onChange={v => u("mission", v)} multiline />
      <Field label="Vision Statement" value={c.about.vision} onChange={v => u("vision", v)} multiline />
      <Field label="History" value={c.about.history} onChange={v => u("history", v)} multiline />
    </div>
  );
};

const StaffEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const members = c.staff.members;
  const update = (i: number, key: string, v: string) => {
    const arr = members.map((m, idx) => idx === i ? { ...m, [key]: v } : m);
    set({ ...c, staff: { ...c.staff, members: arr } });
  };
  const add = () => set({ ...c, staff: { ...c.staff, members: [...members, { name: "", rank: "", position: "", image: "", bio: "" }] } });
  const remove = (i: number) => set({ ...c, staff: { ...c.staff, members: members.filter((_, idx) => idx !== i) } });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.staff.title} onChange={v => set({ ...c, staff: { ...c.staff, title: v } })} />
        <Field label="Section Subtitle" value={c.staff.subtitle} onChange={v => set({ ...c, staff: { ...c.staff, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{members.length} member(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90">
          <Plus className="w-3 h-3" /> Add Member
        </button>
      </div>
      <div className="space-y-4">
        {members.map((m, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Full Name" value={m.name} onChange={v => update(i, "name", v)} />
              <Field label="Rank" value={m.rank} onChange={v => update(i, "rank", v)} />
              <Field label="Position / Role" value={m.position} onChange={v => update(i, "position", v)} />
              <ImageField label="Photo" value={m.image} onChange={v => update(i, "image", v)} />
              <div className="md:col-span-2">
                <Field label="Bio" value={m.bio} onChange={v => update(i, "bio", v)} multiline />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FleetEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const aircraft = c.fleet.aircraft;
  const update = (i: number, key: string, v: string) => {
    const arr = aircraft.map((a, idx) => idx === i ? { ...a, [key]: v } : a);
    set({ ...c, fleet: { ...c.fleet, aircraft: arr } });
  };
  const add = () => set({ ...c, fleet: { ...c.fleet, aircraft: [...aircraft, { name: "", type: "", role: "", image: "", specs: "" }] } });
  const remove = (i: number) => set({ ...c, fleet: { ...c.fleet, aircraft: aircraft.filter((_, idx) => idx !== i) } });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.fleet.title} onChange={v => set({ ...c, fleet: { ...c.fleet, title: v } })} />
        <Field label="Section Subtitle" value={c.fleet.subtitle} onChange={v => set({ ...c, fleet: { ...c.fleet, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{aircraft.length} aircraft</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90">
          <Plus className="w-3 h-3" /> Add Aircraft
        </button>
      </div>
      <div className="space-y-4">
        {aircraft.map((a, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Aircraft Name" value={a.name} onChange={v => update(i, "name", v)} />
              <Field label="Type (Fighter / Transport…)" value={a.type} onChange={v => update(i, "type", v)} />
              <Field label="Role" value={a.role} onChange={v => update(i, "role", v)} />
              <ImageField label="Photo" value={a.image} onChange={v => update(i, "image", v)} />
              <div className="md:col-span-2">
                <Field label="Specs / Description" value={a.specs} onChange={v => update(i, "specs", v)} multiline />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoutesEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const routes = c.routes.routeList;
  const update = (i: number, key: string, v: string) => {
    const arr = routes.map((r, idx) => idx === i ? { ...r, [key]: v } : r);
    set({ ...c, routes: { ...c.routes, routeList: arr } });
  };
  const add = () => set({ ...c, routes: { ...c.routes, routeList: [...routes, { from: "", to: "", distance: "", frequency: "" }] } });
  const remove = (i: number) => set({ ...c, routes: { ...c.routes, routeList: routes.filter((_, idx) => idx !== i) } });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.routes.title} onChange={v => set({ ...c, routes: { ...c.routes, title: v } })} />
        <Field label="Section Subtitle" value={c.routes.subtitle} onChange={v => set({ ...c, routes: { ...c.routes, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{routes.length} route(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90">
          <Plus className="w-3 h-3" /> Add Route
        </button>
      </div>
      <div className="space-y-3">
        {routes.map((r, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="From (ICAO)" value={r.from} onChange={v => update(i, "from", v)} placeholder="VIDP (Delhi)" />
              <Field label="To (ICAO)" value={r.to} onChange={v => update(i, "to", v)} placeholder="VABB (Mumbai)" />
              <Field label="Distance" value={r.distance} onChange={v => update(i, "distance", v)} placeholder="1,148 km" />
              <Field label="Frequency" value={r.frequency} onChange={v => update(i, "frequency", v)} placeholder="Daily" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HubsEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const hubs = c.hubs.hubList;
  const update = (i: number, key: string, v: string) => {
    const arr = hubs.map((h, idx) => idx === i ? { ...h, [key]: v } : h);
    set({ ...c, hubs: { ...c.hubs, hubList: arr } });
  };
  const add = () => set({ ...c, hubs: { ...c.hubs, hubList: [...hubs, { name: "", code: "", location: "", type: "", description: "" }] } });
  const remove = (i: number) => set({ ...c, hubs: { ...c.hubs, hubList: hubs.filter((_, idx) => idx !== i) } });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.hubs.title} onChange={v => set({ ...c, hubs: { ...c.hubs, title: v } })} />
        <Field label="Section Subtitle" value={c.hubs.subtitle} onChange={v => set({ ...c, hubs: { ...c.hubs, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{hubs.length} hub(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90">
          <Plus className="w-3 h-3" /> Add Hub
        </button>
      </div>
      <div className="space-y-4">
        {hubs.map((h, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Base Name" value={h.name} onChange={v => update(i, "name", v)} />
              <Field label="ICAO Code" value={h.code} onChange={v => update(i, "code", v)} />
              <Field label="Location" value={h.location} onChange={v => update(i, "location", v)} />
              <Field label="Hub Type" value={h.type} onChange={v => update(i, "type", v)} placeholder="Primary Hub / Regional Hub" />
              <div className="md:col-span-2">
                <Field label="Description" value={h.description} onChange={v => update(i, "description", v)} multiline />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RanksEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const ranks = c.ranks.rankList;
  const update = (i: number, key: string, v: string) => {
    const arr = ranks.map((r, idx) => idx === i ? { ...r, [key]: v } : r);
    set({ ...c, ranks: { ...c.ranks, rankList: arr } });
  };
  const add = () => set({ ...c, ranks: { ...c.ranks, rankList: [...ranks, { rank: "", category: "", description: "", insignia: "" }] } });
  const remove = (i: number) => set({ ...c, ranks: { ...c.ranks, rankList: ranks.filter((_, idx) => idx !== i) } });

  const categories = [...new Set(ranks.map(r => r.category))].filter(Boolean);

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.ranks.title} onChange={v => set({ ...c, ranks: { ...c.ranks, title: v } })} />
        <Field label="Section Subtitle" value={c.ranks.subtitle} onChange={v => set({ ...c, ranks: { ...c.ranks, subtitle: v } })} />
      </div>
      <div className="mb-3 p-3 bg-secondary/30 border border-radar rounded-sm">
        <span className="font-mono text-[10px] text-radar-amber">CATEGORIES DETECTED: </span>
        <span className="font-mono text-[10px] text-foreground">{categories.join(" · ") || "none yet"}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{ranks.length} rank(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90">
          <Plus className="w-3 h-3" /> Add Rank
        </button>
      </div>
      <div className="space-y-4">
        {ranks.map((r, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Rank Name" value={r.rank} onChange={v => update(i, "rank", v)} />
              <Field label="Category (e.g. Air Officers)" value={r.category} onChange={v => update(i, "category", v)} />
              <Field label="Description" value={r.description} onChange={v => update(i, "description", v)} multiline />
              <ImageField label="Insignia Image" value={r.insignia} onChange={v => update(i, "insignia", v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const addReq = () => set({ ...c, apply: { ...c.apply, requirements: [...c.apply.requirements, ""] } });
  const updateReq = (i: number, v: string) => {
    const arr = c.apply.requirements.map((r, idx) => idx === i ? v : r);
    set({ ...c, apply: { ...c.apply, requirements: arr } });
  };
  const removeReq = (i: number) => set({ ...c, apply: { ...c.apply, requirements: c.apply.requirements.filter((_, idx) => idx !== i) } });

  const addPos = () => set({ ...c, apply: { ...c.apply, positions: [...c.apply.positions, ""] } });
  const updatePos = (i: number, v: string) => {
    const arr = c.apply.positions.map((p, idx) => idx === i ? v : p);
    set({ ...c, apply: { ...c.apply, positions: arr } });
  };
  const removePos = (i: number) => set({ ...c, apply: { ...c.apply, positions: c.apply.positions.filter((_, idx) => idx !== i) } });

  const u = (key: string, v: string) => set({ ...c, apply: { ...c.apply, [key]: v } });

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Page Title" value={c.apply.title} onChange={v => u("title", v)} />
        <Field label="Subtitle" value={c.apply.subtitle} onChange={v => u("subtitle", v)} />
      </div>
      <Field label="Description Paragraph" value={c.apply.description} onChange={v => u("description", v)} multiline />
      <Field label="Discord Invite Link" value={c.apply.discordLink} onChange={v => u("discordLink", v)} placeholder="https://discord.gg/..." />

      {/* Requirements */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Requirements List</span>
          <button onClick={addReq} className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-foreground font-mono rounded-sm hover:bg-secondary/80">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {c.apply.requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={req} onChange={e => updateReq(i, e.target.value)}
                className="flex-1 bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60"
                placeholder={`Requirement ${i + 1}`}
              />
              <button onClick={() => removeReq(i)} className="text-destructive hover:scale-110 transition-transform p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Positions */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Available Positions</span>
          <button onClick={addPos} className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-foreground font-mono rounded-sm hover:bg-secondary/80">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {c.apply.positions.map((pos, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={pos} onChange={e => updatePos(i, e.target.value)}
                className="flex-1 bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60"
                placeholder={`Position ${i + 1}`}
              />
              <button onClick={() => removePos(i)} className="text-destructive hover:scale-110 transition-transform p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Component ────────────────────────────────────────────────────

const SECTIONS = [
  { key: "general", label: "General" },
  { key: "about", label: "About Us" },
  { key: "staff", label: "Staff" },
  { key: "fleet", label: "Fleet" },
  { key: "routes", label: "Routes" },
  { key: "hubs", label: "Hubs" },
  { key: "ranks", label: "Ranks" },
  { key: "apply", label: "Apply / Recruit" },
];

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [activeSection, setActiveSection] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  // Auth check
  useEffect(() => {
    if (sessionStorage.getItem("iafvo_admin") === "true") setAuthenticated(true);
  }, []);

  // Fetch from Supabase on load
  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetchContent().then(c => { setContent(c); setLoading(false); });
  }, [authenticated]);

  const handleContentChange = useCallback((c: SiteContent) => {
    setContent(c);
    setUnsaved(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("iafvo_admin", "true");
      toast.success("Access granted. Welcome, Commander.");
    } else {
      toast.error("Access denied — invalid credentials");
    }
  };

  const handleLogout = () => {
    if (unsaved && !confirm("You have unsaved changes. Log out anyway?")) return;
    sessionStorage.removeItem("iafvo_admin");
    setAuthenticated(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent(content);
      setUnsaved(false);
      toast.success("✅ Changes pushed live — all users will see updates in real-time!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    const c = await fetchContent();
    setContent(c);
    setUnsaved(false);
    setLoading(false);
    toast.success("Reloaded latest data from Supabase");
  };

  const handleReset = () => {
    if (!confirm("Reset ALL content to factory defaults? This cannot be undone until you push it live.")) return;
    setContent(defaultContent);
    setUnsaved(true);
    toast.warning("Content reset to defaults — click 'Push to Live' to save.");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "iafvo_backup.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup JSON downloaded");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        setContent(parsed);
        setUnsaved(true);
        toast.success("JSON imported — review and push to live when ready");
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // ─── Login screen ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-10" />
        <div className="absolute inset-0 scanline" />
        <div className="relative w-full max-w-sm mx-4">
          <div className="bg-card border border-radar rounded-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <Shield className="w-12 h-12 text-radar mb-4 animate-pulse-green" />
              <h1 className="font-heading text-lg text-foreground tracking-widest text-center">ADMIN ACCESS</h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest mt-1">IAFVO CONTROL PANEL</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter access code..."
                  className="w-full bg-input border border-radar rounded-sm px-4 py-3 pr-10 text-foreground font-mono text-sm focus:outline-none focus:border-radar-green/60"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground font-heading text-sm tracking-widest uppercase py-3 hover:bg-primary/90 transition-colors glow-green rounded-sm">
                Authenticate
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-radar mx-auto mb-4 animate-spin" />
          <p className="font-mono text-sm text-radar animate-pulse tracking-widest">CONNECTING TO SUPABASE...</p>
        </div>
      </div>
    );
  }

  // ─── Main Admin UI ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-radar px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Shield className="w-5 h-5 text-radar" />
          <span className="font-heading text-xs text-radar tracking-widest uppercase hidden sm:block">IAFVO Control Panel</span>
          {unsaved && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-radar-amber">
              <AlertTriangle className="w-3 h-3" /> Unsaved
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button onClick={handleRefresh} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono transition-colors">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
          <button onClick={handleExport} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono transition-colors">
            <Download className="w-3 h-3" /> Export
          </button>
          <label className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono transition-colors cursor-pointer">
            <Upload className="w-3 h-3" /> Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleReset} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-destructive hover:text-destructive/80 border border-destructive/30 rounded-sm font-mono transition-colors">
            Reset
          </button>
          <button
            onClick={handleSave} disabled={saving}
            className="flex items-center gap-1 px-4 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90 glow-green disabled:opacity-60 transition-colors"
          >
            {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {saving ? "Saving..." : "Push to Live"}
          </button>
          <button onClick={handleLogout} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-radar min-h-[calc(100vh-3.5rem)] bg-card/50 p-3 sticky top-14 self-start flex-shrink-0">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase px-2 mb-3">Sections</p>
          <nav className="space-y-0.5">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full text-left px-3 py-2.5 text-sm font-body rounded-sm flex items-center gap-2 transition-colors ${
                  activeSection === s.key
                    ? "bg-radar/10 text-radar border-l-2 border-radar"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                }`}
              >
                {activeSection === s.key ? <ChevronDown className="w-3 h-3 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                {s.label}
              </button>
            ))}
          </nav>

          {/* Quick stats */}
          <div className="mt-6 pt-4 border-t border-radar space-y-2">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase px-2">Quick Stats</p>
            {[
              { label: "Staff", val: content.staff.members.length },
              { label: "Aircraft", val: content.fleet.aircraft.length },
              { label: "Routes", val: content.routes.routeList.length },
              { label: "Hubs", val: content.hubs.hubList.length },
              { label: "Ranks", val: content.ranks.rankList.length },
            ].map(s => (
              <div key={s.label} className="flex justify-between px-2">
                <span className="font-mono text-[10px] text-muted-foreground">{s.label}</span>
                <span className="font-mono text-[10px] text-radar">{s.val}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl overflow-auto">
          <h2 className="font-heading text-sm tracking-widest text-foreground uppercase border-b border-radar pb-3 mb-6">
            Editing: {SECTIONS.find(s => s.key === activeSection)?.label}
          </h2>

          {activeSection === "general" && <GeneralEditor c={content} set={handleContentChange} />}
          {activeSection === "about"   && <AboutEditor   c={content} set={handleContentChange} />}
          {activeSection === "staff"   && <StaffEditor   c={content} set={handleContentChange} />}
          {activeSection === "fleet"   && <FleetEditor   c={content} set={handleContentChange} />}
          {activeSection === "routes"  && <RoutesEditor  c={content} set={handleContentChange} />}
          {activeSection === "hubs"    && <HubsEditor    c={content} set={handleContentChange} />}
          {activeSection === "ranks"   && <RanksEditor   c={content} set={handleContentChange} />}
          {activeSection === "apply"   && <ApplyEditor   c={content} set={handleContentChange} />}

          {/* Floating save button for mobile */}
          <div className="fixed bottom-6 right-6 lg:hidden">
            <button
              onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 px-5 py-3 text-sm bg-primary text-primary-foreground font-mono rounded-full shadow-xl glow-green transition-all ${unsaved ? "opacity-100" : "opacity-50"}`}
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Push Live"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
