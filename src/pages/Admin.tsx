import { useState, useEffect, useCallback } from "react";
import { SiteContent, defaultContent, fetchContent, saveContent } from "@/lib/content";
import {
  Shield, Save, LogOut, Plus, Trash2, ChevronDown, ChevronRight,
  Upload, Download, RefreshCw, AlertTriangle, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "IAFVO@AdminAccess";

// ─── Field primitives ─────────────────────────────────────────────────────────

const Field = ({ label, value, onChange, multiline = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) => (
  <div className="mb-4">
    <label className="block font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-1">{label}</label>
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={4} placeholder={placeholder}
          className="w-full bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60 resize-y" />
      : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-input border border-radar rounded-sm px-3 py-2 text-foreground font-body text-sm focus:outline-none focus:border-radar-green/60" />
    }
  </div>
);

const CheckField = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="mb-4 flex items-center gap-3">
    <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)}
      className="w-4 h-4 accent-green-500" />
    <label className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">{label}</label>
  </div>
);

const ImageField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="mb-4">
      <label className="block font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="preview" className="w-14 h-14 object-contain border border-radar bg-black/40 rounded-sm flex-shrink-0" />}
        <label className="flex-1 border border-dashed border-radar hover:bg-radar/5 transition-colors p-3 rounded-sm cursor-pointer flex items-center justify-center gap-2">
          <Upload className="w-3 h-3 text-radar" />
          <span className="text-[10px] text-muted-foreground uppercase font-mono">{value ? "Replace" : "Upload Image"}</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
        </label>
        {value && <button onClick={() => onChange("")} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>}
      </div>
    </div>
  );
};

// ─── Section editors ──────────────────────────────────────────────────────────

const GeneralEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const u = (k: string, v: string) => set({ ...c, general: { ...c.general, [k]: v } });
  return (
    <div>
      <Field label="Organization Full Name" value={c.general.orgName} onChange={v => u("orgName", v)} />
      <Field label="Short Name / Abbreviation" value={c.general.shortName} onChange={v => u("shortName", v)} />
      <Field label="Tagline" value={c.general.tagline} onChange={v => u("tagline", v)} />
      <Field label="IFC Community Link" value={c.general.ifcLink} onChange={v => u("ifcLink", v)} placeholder="https://community.infiniteflight.com/..." />
      <Field label="Footer Text (copyright)" value={c.general.footerText} onChange={v => u("footerText", v)} multiline />
      <Field label="Logo Text (fallback)" value={c.general.logoText} onChange={v => u("logoText", v)} />
    </div>
  );
};

const HomeEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const cards = c.home.cards;
  const updCard = (i: number, k: string, v: string) => set({ ...c, home: { ...c.home, cards: cards.map((card, idx) => idx === i ? { ...card, [k]: v } : card) } });
  const addCard = () => set({ ...c, home: { ...c.home, cards: [...cards, { title: "", description: "" }] } });
  const delCard = (i: number) => set({ ...c, home: { ...c.home, cards: cards.filter((_, idx) => idx !== i) } });
  return (
    <div>
      <Field label="Operations Section Title" value={c.home.operationsTitle} onChange={v => set({ ...c, home: { ...c.home, operationsTitle: v } })} />
      <Field label="Operations Description" value={c.home.operationsDescription} onChange={v => set({ ...c, home: { ...c.home, operationsDescription: v } })} multiline />
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Feature Cards ({cards.length})</span>
          <button onClick={addCard} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm"><Plus className="w-3 h-3" /> Add Card</button>
        </div>
        <div className="space-y-4">
          {cards.map((card, i) => (
            <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
              <button onClick={() => delCard(i)} className="absolute top-3 right-3 text-destructive"><Trash2 className="w-4 h-4" /></button>
              <Field label={`Card ${i + 1} Title`} value={card.title} onChange={v => updCard(i, "title", v)} />
              <Field label={`Card ${i + 1} Description`} value={card.description} onChange={v => updCard(i, "description", v)} multiline />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const u = (k: string, v: string) => set({ ...c, about: { ...c.about, [k]: v } });
  return (
    <div>
      <Field label="Page Title" value={c.about.title} onChange={v => u("title", v)} />
      <Field label="Subtitle" value={c.about.subtitle} onChange={v => u("subtitle", v)} />
      <Field label="Main Description" value={c.about.description} onChange={v => u("description", v)} multiline />
      <div className="border border-radar rounded-sm p-4 mb-4 bg-card/50">
        <p className="font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-3">Message from CEO</p>
        <Field label="CEO Message Text" value={c.about.ceoMessage} onChange={v => u("ceoMessage", v)} multiline />
        <Field label="CEO Name / Title (shown below message)" value={c.about.ceoName} onChange={v => u("ceoName", v)} placeholder="Air Chief Marshal — Chief of Air Staff, IAFVO" />
      </div>
      <Field label="Mission Statement" value={c.about.mission} onChange={v => u("mission", v)} multiline />
      <Field label="Vision Statement" value={c.about.vision} onChange={v => u("vision", v)} multiline />
      <Field label="History" value={c.about.history} onChange={v => u("history", v)} multiline />
    </div>
  );
};

const StaffEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const items = c.staff.members;
  const upd = (i: number, k: string, v: string) => set({ ...c, staff: { ...c.staff, members: items.map((m, idx) => idx === i ? { ...m, [k]: v } : m) } });
  const add = () => set({ ...c, staff: { ...c.staff, members: [...items, { name: "", rank: "", position: "", image: "", bio: "", ifcProfile: "" }] } });
  const del = (i: number) => set({ ...c, staff: { ...c.staff, members: items.filter((_, idx) => idx !== i) } });
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.staff.title} onChange={v => set({ ...c, staff: { ...c.staff, title: v } })} />
        <Field label="Section Subtitle" value={c.staff.subtitle} onChange={v => set({ ...c, staff: { ...c.staff, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{items.length} member(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm"><Plus className="w-3 h-3" /> Add Member</button>
      </div>
      <div className="space-y-4">
        {items.map((m, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => del(i)} className="absolute top-3 right-3 text-destructive"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Full Name" value={m.name} onChange={v => upd(i, "name", v)} />
              <Field label="Rank" value={m.rank} onChange={v => upd(i, "rank", v)} />
              <Field label="Position / Role" value={m.position} onChange={v => upd(i, "position", v)} />
              <Field label="IFC Profile URL" value={m.ifcProfile || ""} onChange={v => upd(i, "ifcProfile", v)} placeholder="https://community.infiniteflight.com/u/username" />
              <ImageField label="Profile Photo (or IFC avatar screenshot)" value={m.image} onChange={v => upd(i, "image", v)} />
              <div className="md:col-span-2"><Field label="Bio" value={m.bio} onChange={v => upd(i, "bio", v)} multiline /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FleetEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const items = c.fleet.aircraft;
  const upd = (i: number, k: string, v: string | boolean) => set({ ...c, fleet: { ...c.fleet, aircraft: items.map((a, idx) => idx === i ? { ...a, [k]: v } : a) } });
  const add = () => set({ ...c, fleet: { ...c.fleet, aircraft: [...items, { name: "", type: "", role: "", image: "", specs: "", maxSpeed: "", range: "", crew: "", isGeneric: false }] } });
  const del = (i: number) => set({ ...c, fleet: { ...c.fleet, aircraft: items.filter((_, idx) => idx !== i) } });
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.fleet.title} onChange={v => set({ ...c, fleet: { ...c.fleet, title: v } })} />
        <Field label="Section Subtitle" value={c.fleet.subtitle} onChange={v => set({ ...c, fleet: { ...c.fleet, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{items.length} aircraft</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm"><Plus className="w-3 h-3" /> Add Aircraft</button>
      </div>
      <div className="space-y-4">
        {items.map((a, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => del(i)} className="absolute top-3 right-3 text-destructive"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Aircraft Name" value={a.name} onChange={v => upd(i, "name", v)} />
              <Field label="Type (e.g. Fighter, Transport)" value={a.type} onChange={v => upd(i, "type", v)} />
              <Field label="Role" value={a.role} onChange={v => upd(i, "role", v)} />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Max Speed" value={a.maxSpeed || ""} onChange={v => upd(i, "maxSpeed", v)} placeholder="Mach 2.0" />
                <Field label="Range" value={a.range || ""} onChange={v => upd(i, "range", v)} placeholder="3,000 km" />
                <Field label="Crew" value={a.crew || ""} onChange={v => upd(i, "crew", v)} placeholder="2" />
              </div>
              <ImageField label="Aircraft Photo (Infinite Flight screenshot)" value={a.image} onChange={v => upd(i, "image", v)} />
              <CheckField label="No livery in game — mark as Generic" value={a.isGeneric || false} onChange={v => upd(i, "isGeneric", v)} />
              <div className="md:col-span-2"><Field label="Specs / Description" value={a.specs} onChange={v => upd(i, "specs", v)} multiline /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoutesEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const items = c.routes.routeList;
  const upd = (i: number, k: string, v: string) => set({ ...c, routes: { ...c.routes, routeList: items.map((r, idx) => idx === i ? { ...r, [k]: v } : r) } });
  const add = () => set({ ...c, routes: { ...c.routes, routeList: [...items, { from: "", to: "", distance: "", frequency: "", aircraft: "", type: "" }] } });
  const del = (i: number) => set({ ...c, routes: { ...c.routes, routeList: items.filter((_, idx) => idx !== i) } });
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.routes.title} onChange={v => set({ ...c, routes: { ...c.routes, title: v } })} />
        <Field label="Section Subtitle" value={c.routes.subtitle} onChange={v => set({ ...c, routes: { ...c.routes, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{items.length} route(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm"><Plus className="w-3 h-3" /> Add Route</button>
      </div>
      <div className="space-y-3">
        {items.map((r, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => del(i)} className="absolute top-3 right-3 text-destructive"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="From (ICAO + name)" value={r.from} onChange={v => upd(i, "from", v)} placeholder="VIDP (Hindon)" />
              <Field label="To (ICAO + name)" value={r.to} onChange={v => upd(i, "to", v)} placeholder="VABB (Mumbai)" />
              <Field label="Distance" value={r.distance} onChange={v => upd(i, "distance", v)} placeholder="1,148 km" />
              <Field label="Frequency" value={r.frequency} onChange={v => upd(i, "frequency", v)} placeholder="Daily" />
              <Field label="Compatible Aircraft" value={r.aircraft || ""} onChange={v => upd(i, "aircraft", v)} placeholder="C-17 Globemaster III" />
              <Field label="Sortie Type" value={r.type || ""} onChange={v => upd(i, "type", v)} placeholder="Strategic Airlift" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HubsEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const items = c.hubs.hubList;
  const upd = (i: number, k: string, v: string) => set({ ...c, hubs: { ...c.hubs, hubList: items.map((h, idx) => idx === i ? { ...h, [k]: v } : h) } });
  const add = () => set({ ...c, hubs: { ...c.hubs, hubList: [...items, { name: "", code: "", location: "", type: "", description: "", image: "", runways: "", elevation: "" }] } });
  const del = (i: number) => set({ ...c, hubs: { ...c.hubs, hubList: items.filter((_, idx) => idx !== i) } });
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.hubs.title} onChange={v => set({ ...c, hubs: { ...c.hubs, title: v } })} />
        <Field label="Section Subtitle" value={c.hubs.subtitle} onChange={v => set({ ...c, hubs: { ...c.hubs, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{items.length} hub(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm"><Plus className="w-3 h-3" /> Add Hub</button>
      </div>
      <div className="space-y-4">
        {items.map((h, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => del(i)} className="absolute top-3 right-3 text-destructive"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Base Name" value={h.name} onChange={v => upd(i, "name", v)} />
              <Field label="ICAO Code" value={h.code} onChange={v => upd(i, "code", v)} />
              <Field label="Location" value={h.location} onChange={v => upd(i, "location", v)} />
              <Field label="Hub Type (e.g. Primary Hub)" value={h.type} onChange={v => upd(i, "type", v)} />
              <Field label="Runways (e.g. 2 — 09/27, 10/28)" value={h.runways || ""} onChange={v => upd(i, "runways", v)} />
              <Field label="Elevation (e.g. 717 ft)" value={h.elevation || ""} onChange={v => upd(i, "elevation", v)} />
              <ImageField label="Hub Photo (Infinite Flight or real)" value={h.image || ""} onChange={v => upd(i, "image", v)} />
              <div className="md:col-span-2"><Field label="Description" value={h.description} onChange={v => upd(i, "description", v)} multiline /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RanksEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const items = c.ranks.rankList;
  const upd = (i: number, k: string, v: string) => set({ ...c, ranks: { ...c.ranks, rankList: items.map((r, idx) => idx === i ? { ...r, [k]: v } : r) } });
  const add = () => set({ ...c, ranks: { ...c.ranks, rankList: [...items, { rank: "", category: "", description: "", insignia: "", requirements: "", perks: "", flightHours: "" }] } });
  const del = (i: number) => set({ ...c, ranks: { ...c.ranks, rankList: items.filter((_, idx) => idx !== i) } });
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field label="Section Title" value={c.ranks.title} onChange={v => set({ ...c, ranks: { ...c.ranks, title: v } })} />
        <Field label="Section Subtitle" value={c.ranks.subtitle} onChange={v => set({ ...c, ranks: { ...c.ranks, subtitle: v } })} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-xs text-muted-foreground">{items.length} rank(s)</span>
        <button onClick={add} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm"><Plus className="w-3 h-3" /> Add Rank</button>
      </div>
      <div className="space-y-4">
        {items.map((r, i) => (
          <div key={i} className="bg-card border border-radar rounded-sm p-4 relative">
            <button onClick={() => del(i)} className="absolute top-3 right-3 text-destructive"><Trash2 className="w-4 h-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Field label="Rank Name" value={r.rank} onChange={v => upd(i, "rank", v)} />
              <Field label="Category (e.g. Air Officers)" value={r.category} onChange={v => upd(i, "category", v)} />
              <Field label="Flight Hours Required (e.g. 100+)" value={r.flightHours || ""} onChange={v => upd(i, "flightHours", v)} placeholder="100+" />
              <ImageField label="Insignia / Badge Image" value={r.insignia} onChange={v => upd(i, "insignia", v)} />
              <div className="md:col-span-2"><Field label="Description" value={r.description} onChange={v => upd(i, "description", v)} multiline /></div>
              <div className="md:col-span-2"><Field label="Requirements (how to achieve this rank)" value={r.requirements || ""} onChange={v => upd(i, "requirements", v)} multiline placeholder="e.g. 100+ flight hours, 4 months active service..." /></div>
              <div className="md:col-span-2"><Field label="Perks / Privileges at this rank" value={r.perks || ""} onChange={v => upd(i, "perks", v)} multiline placeholder="e.g. Flight scheduling authority, event hosting rights..." /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyEditor = ({ c, set }: { c: SiteContent; set: (c: SiteContent) => void }) => {
  const u = (k: string, v: string) => set({ ...c, apply: { ...c.apply, [k]: v } });
  const updReq = (i: number, v: string) => set({ ...c, apply: { ...c.apply, requirements: c.apply.requirements.map((r, idx) => idx === i ? v : r) } });
  const updPos = (i: number, v: string) => set({ ...c, apply: { ...c.apply, positions: c.apply.positions.map((p, idx) => idx === i ? v : p) } });
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Page Title" value={c.apply.title} onChange={v => u("title", v)} />
        <Field label="Subtitle" value={c.apply.subtitle} onChange={v => u("subtitle", v)} />
      </div>
      <Field label="Description" value={c.apply.description} onChange={v => u("description", v)} multiline />
      <div className="bg-card/50 border border-radar rounded-sm p-4 mb-4">
        <p className="font-mono text-[10px] tracking-widest text-radar-amber uppercase mb-3">Application Links</p>
        <Field label="IFC Link (primary — used for Apply button)" value={c.apply.ifcLink || ""} onChange={v => u("ifcLink", v)} placeholder="https://community.infiniteflight.com/t/..." />
        <Field label="Discord Link (optional — shown as secondary)" value={c.apply.discordLink || ""} onChange={v => u("discordLink", v)} placeholder="Leave blank to hide" />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Requirements</span>
          <button onClick={() => set({ ...c, apply: { ...c.apply, requirements: [...c.apply.requirements, ""] } })}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary font-mono rounded-sm"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="space-y-2">
          {c.apply.requirements.map((req, i) => (
            <div key={i} className="flex gap-2">
              <input value={req} onChange={e => updReq(i, e.target.value)} placeholder={`Requirement ${i + 1}`}
                className="flex-1 bg-input border border-radar rounded-sm px-3 py-2 text-foreground text-sm focus:outline-none focus:border-radar-green/60" />
              <button onClick={() => set({ ...c, apply: { ...c.apply, requirements: c.apply.requirements.filter((_, idx) => idx !== i) } })}
                className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Positions</span>
          <button onClick={() => set({ ...c, apply: { ...c.apply, positions: [...c.apply.positions, ""] } })}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary font-mono rounded-sm"><Plus className="w-3 h-3" /> Add</button>
        </div>
        <div className="space-y-2">
          {c.apply.positions.map((pos, i) => (
            <div key={i} className="flex gap-2">
              <input value={pos} onChange={e => updPos(i, e.target.value)} placeholder={`Position ${i + 1}`}
                className="flex-1 bg-input border border-radar rounded-sm px-3 py-2 text-foreground text-sm focus:outline-none focus:border-radar-green/60" />
              <button onClick={() => set({ ...c, apply: { ...c.apply, positions: c.apply.positions.filter((_, idx) => idx !== i) } })}
                className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin ───────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "general", label: "General" },
  { key: "home", label: "Home Page" },
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
  const [showPw, setShowPw] = useState(false);
  const [localContent, setLocalContent] = useState<SiteContent>(defaultContent);
  const [activeSection, setActiveSection] = useState("general");
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("iafvo_admin") === "true") setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    setFetching(true);
    fetchContent().then(c => {
      setLocalContent(c);
      setFetching(false);
    });
  }, [authenticated]);

  const handleChange = useCallback((c: SiteContent) => {
    setLocalContent(c);
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
      await saveContent(localContent);
      setUnsaved(false);
      toast.success("✅ Pushed live — all visitors see the update instantly!");
    } catch (err: unknown) {
      toast.error(`Save failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setFetching(true);
    const c = await fetchContent();
    setLocalContent(c);
    setUnsaved(false);
    setFetching(false);
    toast.success("Reloaded from Supabase");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(localContent, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "iafvo_backup.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { setLocalContent(JSON.parse(reader.result as string)); setUnsaved(true); toast.success("Imported — push to live when ready"); }
      catch { toast.error("Invalid JSON"); }
    };
    reader.readAsText(file);
  };

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-10" />
        <div className="absolute inset-0 scanline" />
        <div className="relative w-full max-w-sm mx-4">
          <div className="bg-card border border-radar rounded-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <Shield className="w-12 h-12 text-radar mb-4 animate-pulse-green" />
              <h1 className="font-heading text-lg text-foreground tracking-widest">ADMIN ACCESS</h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest mt-1">IAFVO CONTROL PANEL</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter access code..."
                  className="w-full bg-input border border-radar rounded-sm px-4 py-3 pr-10 text-foreground font-mono text-sm focus:outline-none focus:border-radar-green/60" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-radar mx-auto mb-4 animate-spin" />
          <p className="font-mono text-sm text-radar animate-pulse tracking-widest">LOADING FROM SUPABASE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-radar px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Shield className="w-5 h-5 text-radar" />
          <span className="font-heading text-xs text-radar tracking-widest uppercase hidden sm:block">IAFVO Control Panel</span>
          {unsaved && <span className="flex items-center gap-1 font-mono text-[10px] text-radar-amber"><AlertTriangle className="w-3 h-3" /> Unsaved</span>}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button onClick={handleRefresh} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
          <button onClick={handleExport} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono">
            <Download className="w-3 h-3" /> Export
          </button>
          <label className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-radar rounded-sm font-mono cursor-pointer">
            <Upload className="w-3 h-3" /> Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1 px-4 py-1.5 text-xs bg-primary text-primary-foreground font-mono rounded-sm hover:bg-primary/90 glow-green disabled:opacity-60">
            {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {saving ? "Saving..." : "Push to Live"}
          </button>
          <button onClick={handleLogout} className="p-1.5 text-muted-foreground hover:text-foreground"><LogOut className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className="w-52 border-r border-radar min-h-[calc(100vh-3.5rem)] bg-card/50 p-3 sticky top-14 self-start flex-shrink-0">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase px-2 mb-3">Sections</p>
          <nav className="space-y-0.5">
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)}
                className={`w-full text-left px-3 py-2.5 text-sm font-body rounded-sm flex items-center gap-2 transition-colors ${
                  activeSection === s.key ? "bg-radar/10 text-radar border-l-2 border-radar" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                }`}>
                {activeSection === s.key ? <ChevronDown className="w-3 h-3 flex-shrink-0" /> : <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                {s.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-4 border-t border-radar space-y-2">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase px-2">Live Stats</p>
            {[
              { label: "Staff", val: localContent.staff.members.length },
              { label: "Aircraft", val: localContent.fleet.aircraft.length },
              { label: "Routes", val: localContent.routes.routeList.length },
              { label: "Hubs", val: localContent.hubs.hubList.length },
              { label: "Ranks", val: localContent.ranks.rankList.length },
            ].map(s => (
              <div key={s.label} className="flex justify-between px-2">
                <span className="font-mono text-[10px] text-muted-foreground">{s.label}</span>
                <span className="font-mono text-[10px] text-radar">{s.val}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Editor */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl overflow-auto">
          <h2 className="font-heading text-sm tracking-widest text-foreground uppercase border-b border-radar pb-3 mb-6">
            Editing: {SECTIONS.find(s => s.key === activeSection)?.label}
          </h2>
          {activeSection === "general" && <GeneralEditor c={localContent} set={handleChange} />}
          {activeSection === "home"    && <HomeEditor    c={localContent} set={handleChange} />}
          {activeSection === "about"   && <AboutEditor   c={localContent} set={handleChange} />}
          {activeSection === "staff"   && <StaffEditor   c={localContent} set={handleChange} />}
          {activeSection === "fleet"   && <FleetEditor   c={localContent} set={handleChange} />}
          {activeSection === "routes"  && <RoutesEditor  c={localContent} set={handleChange} />}
          {activeSection === "hubs"    && <HubsEditor    c={localContent} set={handleChange} />}
          {activeSection === "ranks"   && <RanksEditor   c={localContent} set={handleChange} />}
          {activeSection === "apply"   && <ApplyEditor   c={localContent} set={handleChange} />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
