import Layout from "@/components/Layout";
import { PageHeader } from "@/components/PageElements";
import { useContent } from "@/lib/content";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Routes = () => {
  const { content } = useContent();
  return (
    <Layout>
      <PageHeader title={content.routes.title} subtitle={content.routes.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Table header — desktop only */}
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 border-b border-radar mb-2">
            {["Origin", "Destination", "Distance", "Aircraft", "Frequency"].map(h => (
              <span key={h} className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">{h}</span>
            ))}
          </div>

          <div className="space-y-2">
            {content.routes.routeList.map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                viewport={{ once: true }}
                className="bg-card border border-radar rounded-sm hover:border-radar-green/50 transition-colors"
              >
                {/* Mobile layout */}
                <div className="md:hidden p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-foreground">{route.from}</span>
                    <ArrowRight className="w-3 h-3 text-radar flex-shrink-0" />
                    <span className="font-mono text-sm text-foreground">{route.to}</span>
                  </div>
                  {route.type && (
                    <span className="inline-block font-mono text-[10px] px-2 py-0.5 border border-radar text-radar tracking-widest uppercase">{route.type}</span>
                  )}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="font-mono text-[10px] text-radar-amber block">DISTANCE</span>
                      <span className="text-sm text-muted-foreground font-body">{route.distance}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-radar-amber block">FREQUENCY</span>
                      <span className="text-sm text-radar font-mono">{route.frequency}</span>
                    </div>
                    {route.aircraft && (
                      <div className="col-span-2">
                        <span className="font-mono text-[10px] text-radar-amber block">AIRCRAFT</span>
                        <span className="text-sm text-foreground font-body">{route.aircraft}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-5 gap-4 items-center px-6 py-4">
                  <div>
                    <span className="font-mono text-sm text-foreground">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-radar flex-shrink-0" />
                    <span className="font-mono text-sm text-foreground">{route.to}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground font-body">{route.distance}</span>
                  </div>
                  <div>
                    <span className="text-sm text-foreground font-body">{route.aircraft || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-radar font-mono">{route.frequency}</span>
                    {route.type && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 border border-radar/40 text-radar/70 tracking-widest uppercase hidden lg:inline">{route.type}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground font-mono tracking-wider mt-6 text-center">
            All routes are operated within Infinite Flight on the Expert Server.
          </p>
        </div>
      </section>
    </Layout>
  );
};
export default Routes;
