import Layout from "@/components/Layout";
import { PageHeader, MilitaryCard } from "@/components/PageElements";
import { useContent } from "@/lib/content";
import { motion } from "framer-motion";

const About = () => {
  const { content } = useContent();
  return (
    <Layout>
      <PageHeader title={content.about.title} subtitle={content.about.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Main Description */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <MilitaryCard>
              <p className="text-lg text-foreground font-body leading-relaxed">{content.about.description}</p>
            </MilitaryCard>
          </motion.div>

          {/* CEO Message */}
          {content.about.ceoMessage && (
            <motion.div className="mt-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <MilitaryCard>
                <h3 className="font-heading text-sm tracking-widest text-radar-amber mb-4 uppercase">Message from the CEO</h3>
                <div className="border-l-2 border-radar pl-4 mb-4">
                  <p className="text-muted-foreground font-body leading-relaxed italic">"{content.about.ceoMessage}"</p>
                </div>
                <p className="text-xs text-radar font-mono tracking-wider">— {content.about.ceoName}</p>
              </MilitaryCard>
            </motion.div>
          )}

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <MilitaryCard>
                <h3 className="font-heading text-sm tracking-widest text-radar-amber mb-3 uppercase">Our Mission</h3>
                <p className="text-muted-foreground font-body leading-relaxed">{content.about.mission}</p>
              </MilitaryCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <MilitaryCard>
                <h3 className="font-heading text-sm tracking-widest text-radar-amber mb-3 uppercase">Our Vision</h3>
                <p className="text-muted-foreground font-body leading-relaxed">{content.about.vision}</p>
              </MilitaryCard>
            </motion.div>
          </div>

          {/* History */}
          <motion.div className="mt-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <MilitaryCard>
              <h3 className="font-heading text-sm tracking-widest text-radar-amber mb-3 uppercase">Our History</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{content.about.history}</p>
            </MilitaryCard>
          </motion.div>

        </div>
      </section>
    </Layout>
  );
};
export default About;
