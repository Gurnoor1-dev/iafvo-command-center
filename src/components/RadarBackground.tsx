const RadarBackground = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Scanlines */}
      <div className="absolute inset-0 scanline" />
      
      {/* Radar circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10">
        <div className="absolute inset-0 rounded-full border border-radar-green/30" />
        <div className="absolute inset-[15%] rounded-full border border-radar-green/20" />
        <div className="absolute inset-[30%] rounded-full border border-radar-green/15" />
        <div className="absolute inset-[45%] rounded-full border border-radar-green/10" />
        {/* Cross lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-radar-green/20" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-radar-green/20" />
        {/* Sweep */}
        <div className="absolute inset-0 animate-radar-sweep origin-center">
          <div className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-radar-green/60 to-transparent" />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-radar-green/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-radar-green/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-radar-green/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-radar-green/30" />
    </div>
  );
};

export default RadarBackground;
