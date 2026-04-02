import Layout from "@/components/Layout";
import { PageHeader, MilitaryCard } from "@/components/PageElements";
import { useContent } from "@/lib/content";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink } from "lucide-react";

const Apply = () => {
  const { content } = useContent();
  return (
    <Layout>
      <PageHeader title={content.apply.title} subtitle={content.apply.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <MilitaryCard><p className="text-lg text-foreground font-body leading-relaxed">{content.apply.description}</p></MilitaryCard>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <MilitaryCard>
                <h3 className="font-heading text-sm tracking-widest text-radar-amber mb-4 uppercase">Requirements</h3>
                <ul className="space-y-3">
                  {content.apply.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-radar flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-body">{req}</span>
                    </li>
                  ))}
                </ul>
              </MilitaryCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <MilitaryCard>
                <h3 className="font-heading text-sm tracking-widest text-radar-amber mb-4 uppercase">Available Positions</h3>
                <ul className="space-y-3">
                  {content.apply.positions.map((pos, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-radar rounded-full" />
                      <span className="text-sm text-foreground font-body">{pos}</span>
                    </li>
                  ))}
                </ul>
              </MilitaryCard>
            </motion.div>
          </div>
          <motion.div className="mt-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <a href={content.apply.discordLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-heading text-sm tracking-widest uppercase hover:bg-primary/90 glow-green transition-all">
              <ExternalLink className="w-4 h-4" />
              Apply via Discord
            </a>
            <p className="text-xs text-muted-foreground font-mono mt-4 tracking-wider">Applications are processed through our official Discord server</p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};
export default Apply;
