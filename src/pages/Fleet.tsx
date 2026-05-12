import Layout from "@/components/Layout";
import { PageHeader, MilitaryCard } from "@/components/PageElements";
import { useContent } from "@/lib/content";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const Fleet = () => {
  const { content } = useContent();
  return (
    <Layout>
      <PageHeader title={content.fleet.title} subtitle={content.fleet.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* 1 col mobile, 2 col desktop — less crowding, larger cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.fleet.aircraft.map((ac, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <MilitaryCard className="h-full flex flex-col p-0 overflow-hidden">
                  {/* Image on top */}
                  <div className="w-full h-48 bg-secondary flex items-center justify-center border-b border-radar overflow-hidden flex-shrink-0">
                    {ac.image
                      ? (
                        <img
                          src={ac.image}
                          alt={ac.name}
                          className="w-full h-full object-contain p-2"
                        />
                      )
                      : (
                        <div className="flex flex-col items-center gap-2">
                          <Plane className="w-12 h-12 text-muted-foreground/40" />
                          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">No Image</span>
                        </div>
                      )
                    }
                  </div>
                  {/* Details below */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-heading text-sm font-bold text-foreground tracking-wider">{ac.name}</h3>
                        <span className="font-mono text-[10px] text-radar tracking-widest">{ac.type}</span>
                      </div>
                      {ac.isGeneric && (
                        <span className="font-mono text-[10px] px-2 py-0.5 border border-radar-amber text-radar-amber tracking-widest uppercase flex-shrink-0">Generic</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-radar-amber font-mono uppercase">Role:</span>
                      <span className="text-sm text-foreground font-body">{ac.role}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{ac.specs}</p>
                    {/* Specs grid */}
                    {(ac.maxSpeed || ac.range || ac.crew) && (
                      <div className="mt-auto pt-4 border-t border-radar grid grid-cols-3 gap-3">
                        {ac.maxSpeed && (
                          <div>
                            <p className="font-mono text-[10px] text-radar-amber tracking-widest uppercase mb-1">Max Speed</p>
                            <p className="text-xs text-foreground font-body">{ac.maxSpeed}</p>
                          </div>
                        )}
                        {ac.range && (
                          <div>
                            <p className="font-mono text-[10px] text-radar-amber tracking-widest uppercase mb-1">Range</p>
                            <p className="text-xs text-foreground font-body">{ac.range}</p>
                          </div>
                        )}
                        {ac.crew && (
                          <div>
                            <p className="font-mono text-[10px] text-radar-amber tracking-widest uppercase mb-1">Crew</p>
                            <p className="text-xs text-foreground font-body">{ac.crew}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </MilitaryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Fleet;
