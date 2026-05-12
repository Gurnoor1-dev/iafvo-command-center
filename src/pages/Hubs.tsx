import Layout from "@/components/Layout";
import { PageHeader, MilitaryCard } from "@/components/PageElements";
import { useContent } from "@/lib/content";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const Hubs = () => {
  const { content } = useContent();
  return (
    <Layout>
      <PageHeader title={content.hubs.title} subtitle={content.hubs.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* 1 col mobile, 2 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.hubs.hubList.map((hub, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <MilitaryCard className="h-full flex flex-col p-0 overflow-hidden">
                  {/* Hub image */}
                  <div className="w-full h-44 bg-secondary flex items-center justify-center border-b border-radar overflow-hidden flex-shrink-0">
                    {hub.image
                      ? <img src={hub.image} alt={hub.name} className="w-full h-full object-cover" />
                      : (
                        <div className="flex flex-col items-center gap-2">
                          <MapPin className="w-10 h-10 text-muted-foreground/30" />
                          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">No Image</span>
                        </div>
                      )
                    }
                  </div>
                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading text-xs font-bold text-foreground tracking-wider">{hub.name}</h3>
                          <span className="font-mono text-[10px] px-2 py-0.5 bg-secondary text-radar tracking-widest">{hub.code}</span>
                        </div>
                        <p className="text-xs text-radar-amber font-body mt-1">{hub.location}</p>
                      </div>
                      <span className="flex-shrink-0 font-mono text-[10px] px-2 py-0.5 border border-radar text-radar tracking-widest uppercase">{hub.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{hub.description}</p>
                    {/* Technical info */}
                    {(hub.runways || hub.elevation) && (
                      <div className="mt-auto pt-4 border-t border-radar grid grid-cols-2 gap-3">
                        {hub.runways && (
                          <div>
                            <p className="font-mono text-[10px] text-radar-amber tracking-widest uppercase mb-1">Runways</p>
                            <p className="text-xs text-foreground font-body">{hub.runways}</p>
                          </div>
                        )}
                        {hub.elevation && (
                          <div>
                            <p className="font-mono text-[10px] text-radar-amber tracking-widest uppercase mb-1">Elevation</p>
                            <p className="text-xs text-foreground font-body">{hub.elevation}</p>
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
export default Hubs;
