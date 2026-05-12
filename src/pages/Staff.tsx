import Layout from "@/components/Layout";
import { PageHeader, MilitaryCard } from "@/components/PageElements";
import { useContent } from "@/lib/content";
import { motion } from "framer-motion";
import { User, ExternalLink } from "lucide-react";

const Staff = () => {
  const { content } = useContent();
  return (
    <Layout>
      <PageHeader title={content.staff.title} subtitle={content.staff.subtitle} />
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Fixed grid: 1 col mobile, 2 col tablet, 2 col desktop to avoid misalignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.staff.members.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <MilitaryCard className="h-full">
                  <div className="flex items-start gap-4">
                    {/* Avatar — shows image or styled placeholder (not bare icon) */}
                    <div className="w-16 h-16 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0 border border-radar overflow-hidden">
                      {member.image
                        ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-secondary to-muted">
                            <User className="w-7 h-7 text-radar/60" />
                          </div>
                        )
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Name — clickable IFC link if available */}
                      {member.ifcProfile
                        ? (
                          <a
                            href={member.ifcProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-heading text-xs font-bold text-foreground tracking-wider hover:text-radar transition-colors group"
                          >
                            {member.name}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )
                        : <h3 className="font-heading text-xs font-bold text-foreground tracking-wider">{member.name}</h3>
                      }
                      <p className="font-mono text-[10px] text-radar tracking-widest mt-1">{member.rank}</p>
                      <p className="text-xs text-radar-amber font-body mt-1">{member.position}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-body mt-4 leading-relaxed">{member.bio}</p>
                  {member.ifcProfile && (
                    <div className="mt-4 pt-3 border-t border-radar">
                      <a
                        href={member.ifcProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-radar font-mono tracking-wider hover:text-radar/80 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View IFC Profile
                      </a>
                    </div>
                  )}
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
