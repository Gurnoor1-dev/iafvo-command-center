import Layout from "@/components/Layout";
import { PageHeader, MilitaryCard } from "@/components/PageElements";
import { getContent } from "@/lib/content";
import { motion } from "framer-motion";
import { User } from "lucide-react";

const Staff = () => {
  const content = getContent();

  return (
    <Layout>
      <PageHeader title={content.staff.title} subtitle={content.staff.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.staff.members.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <MilitaryCard>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0 border border-radar">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-sm" />
                      ) : (
                        <User className="w-7 h-7 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading text-xs font-bold text-foreground tracking-wider">{member.name}</h3>
                      <p className="font-mono text-[10px] text-radar tracking-widest mt-1">{member.rank}</p>
                      <p className="text-xs text-radar-amber font-body mt-1">{member.position}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-body mt-4">{member.bio}</p>
                </MilitaryCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Staff;
