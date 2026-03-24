import Layout from "@/components/Layout";
import { PageHeader } from "@/components/PageElements";
import { getContent } from "@/lib/content";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Routes = () => {
  const content = getContent();

  return (
    <Layout>
      <PageHeader title={content.routes.title} subtitle={content.routes.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 border-b border-radar mb-2">
            <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Origin</span>
            <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Destination</span>
            <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Distance</span>
            <span className="font-mono text-[10px] tracking-widest text-radar-amber uppercase">Frequency</span>
          </div>

          <div className="space-y-2">
            {content.routes.routeList.map((route, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                viewport={{ once: true }}
                className="bg-card border border-radar rounded-sm p-4 md:p-6 hover:border-radar-green/50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center">
                  <div>
                    <span className="md:hidden font-mono text-[10px] text-radar-amber block mb-1">ORIGIN</span>
                    <span className="font-mono text-sm text-foreground">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-radar hidden md:block" />
                    <div>
                      <span className="md:hidden font-mono text-[10px] text-radar-amber block mb-1">DESTINATION</span>
                      <span className="font-mono text-sm text-foreground">{route.to}</span>
                    </div>
                  </div>
                  <div>
                    <span className="md:hidden font-mono text-[10px] text-radar-amber block mb-1">DISTANCE</span>
                    <span className="text-sm text-muted-foreground font-body">{route.distance}</span>
                  </div>
                  <div>
                    <span className="md:hidden font-mono text-[10px] text-radar-amber block mb-1">FREQUENCY</span>
                    <span className="text-sm text-radar font-mono">{route.frequency}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Routes;
