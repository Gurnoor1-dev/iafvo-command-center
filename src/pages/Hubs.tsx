import Layout from "@/components/Layout";
import { PageHeader } from "@/components/PageElements";
import { useContent } from "@/lib/content";
import { motion } from "framer-motion";

const Ranks = () => {
  const { content } = useContent();
  const categories = [...new Set(content.ranks.rankList.map(r => r.category))];
  return (
    <Layout>
      <PageHeader title={content.ranks.title} subtitle={content.ranks.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {categories.map(cat => (
            <div key={cat} className="mb-20">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-heading text-xl md:text-2xl tracking-tighter text-radar uppercase italic">{cat}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-radar to-transparent opacity-30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.ranks.rankList.filter(r => r.category === cat).map((rank, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                    className="group bg-card/40 border border-radar/40 rounded-sm overflow-hidden hover:border-radar transition-all duration-300">
                    <div className="h-40 bg-black/40 flex items-center justify-center relative border-b border-radar/20 overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(0,255,102,0.05)_50%,transparent_51%)] bg-[length:100%_4px] animate-pulse" />
                      {rank.insignia
                        ? <img src={rank.insignia} alt={rank.rank} className="h-24 w-24 object-contain drop-shadow-[0_0_15px_rgba(0,255,102,0.4)] group-hover:scale-110 transition-transform duration-500" />
                        : <div className="w-16 h-16 border border-radar/20 rounded-full flex items-center justify-center text-radar/20 font-mono text-[10px]">NO SIG</div>
                      }
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-heading text-xs font-bold text-foreground tracking-[0.2em] uppercase">{rank.rank}</h3>
                        <div className="h-1.5 w-1.5 rounded-full bg-radar-green shadow-[0_0_5px_var(--radar-green)]" />
                      </div>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">{rank.description}</p>
                    </div>
                    <div className="h-1 w-0 bg-radar group-hover:w-full transition-all duration-500" />
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
