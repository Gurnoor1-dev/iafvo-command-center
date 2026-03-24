import { ReactNode } from "react";

export const PageHeader = ({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) => (
  <div className="relative py-20 border-b border-radar overflow-hidden">
    <div className="absolute inset-0 grid-overlay opacity-20" />
    <div className="absolute inset-0 scanline" />
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-px bg-radar-amber" />
        <span className="font-mono text-xs tracking-[0.3em] text-radar-amber uppercase">{subtitle}</span>
      </div>
      <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-wide">
        {title}
      </h1>
      {children}
    </div>
  </div>
);

export const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8">
    {subtitle && (
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-px bg-radar-amber" />
        <span className="font-mono text-[10px] tracking-[0.3em] text-radar-amber uppercase">{subtitle}</span>
      </div>
    )}
    <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">{title}</h2>
  </div>
);

export const MilitaryCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-card border border-radar rounded-sm p-6 relative overflow-hidden group hover:border-radar-green/50 transition-colors duration-300 ${className}`}>
    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-radar-green/40" />
    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-radar-green/40" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-radar-green/40" />
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-radar-green/40" />
    {children}
  </div>
);
