import Layout from "@/components/Layout";
import { PageHeader, MilitaryCard } from "@/components/PageElements";
import { getContent } from "@/lib/content";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const Hubs = () => {
  const content = getContent();

  return (
    <Layout>
      <PageHeader title={content.hubs.title} subtitle={content.hubs.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.hubs.hubList.map((hub, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <MilitaryCard>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-sm flex items-center justify-center border border-radar flex-shrink-0">
                      <MapPin className="w-5 h-5 text-radar" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading text-xs font-bold text-foreground tracking-wider">{hub.name}</h3>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-secondary text-radar tracking-widest">{hub.code}</span>
                      </div>
                      <p className="text-xs text-radar-amber font-body mt-1">{hub.location}</p>
                      <span className="inline-block mt-2 font-mono text-[10px] px-2 py-0.5 border border-radar text-radar tracking-widest uppercase">{hub.type}</span>
                      <p className="text-sm text-muted-foreground font-body mt-3">{hub.description}</p>
                    </div>
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
