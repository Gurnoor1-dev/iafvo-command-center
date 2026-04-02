// Fleet.tsx
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.fleet.aircraft.map((ac, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <MilitaryCard>
                  <div className="flex items-center gap-3 mb-4">
                    {ac.image ? (
                      <img src={ac.image} alt={ac.name} className="w-16 h-12 object-cover rounded-sm border border-radar" />
                    ) : (
                      <div className="w-16 h-12 bg-secondary flex items-center justify-center rounded-sm border border-radar">
                        <Plane className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-heading text-xs font-bold text-foreground tracking-wider">{ac.name}</h3>
                      <span className="font-mono text-[10px] text-radar tracking-widest">{ac.type}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-radar-amber font-mono uppercase">Role:</span>
                      <span className="text-sm text-foreground font-body">{ac.role}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-body">{ac.specs}</p>
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
