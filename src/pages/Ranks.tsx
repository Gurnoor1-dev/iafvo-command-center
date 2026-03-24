import Layout from "@/components/Layout";
import { PageHeader } from "@/components/PageElements";
import { getContent } from "@/lib/content";
import { motion } from "framer-motion";

const Ranks = () => {
  const content = getContent();

  const categories = [...new Set(content.ranks.rankList.map(r => r.category))];

  return (
    <Layout>
      <PageHeader title={content.ranks.title} subtitle={content.ranks.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {categories.map(cat => (
            <div key={cat} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-radar-amber" />
                <h2 className="font-heading text-sm tracking-widest text-radar-amber uppercase">{cat}</h2>
                <div className="flex-1 h-px bg-radar-green/10" />
              </div>

              <div className="space-y-3">
                {content.ranks.rankList
                  .filter(r => r.category === cat)
                  .map((rank, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      viewport={{ once: true }}
                      className="bg-card border border-radar rounded-sm p-4 hover:border-radar-green/50 transition-colors flex items-center gap-4"
                    >
                      <div className="w-16 text-center flex-shrink-0">
                        <span className="font-mono text-lg text-radar text-glow-green">{rank.insignia}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xs font-bold text-foreground tracking-wider">{rank.rank}</h3>
                        <p className="text-sm text-muted-foreground font-body mt-1">{rank.description}</p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Ranks;
