import Layout from "@/components/Layout";
import RadarBackground from "@/components/RadarBackground";
import { useContent } from "@/lib/content";
import { Plane, Users, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const iconMap = [Shield, Plane, Users, MapPin];

const Home = () => {
  const { content } = useContent();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <RadarBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-center mb-6">
              <img src={logo} alt="IAFVO Logo" className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_15px_hsl(var(--radar-green)/0.5)]" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-radar-amber" />
              <span className="font-mono text-xs tracking-[0.4em] text-radar-amber uppercase">Established for Excellence</span>
              <div className="w-12 h-px bg-radar-amber" />
            </div>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 tracking-wider">
              {content.general.shortName}
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground mb-2 tracking-wide">{content.general.orgName}</p>
            <p className="font-mono text-sm text-radar animate-flicker tracking-widest mb-10">{content.general.tagline}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-heading text-sm tracking-widest uppercase hover:bg-primary/90 transition-all glow-green">
                Enlist Now
              </Link>
              <Link to="/about" className="inline-flex items-center justify-center px-8 py-3 border border-radar text-foreground font-heading text-sm tracking-widest uppercase hover:bg-secondary transition-all">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards — detailed */}
      <section className="py-20 border-t border-radar">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.home.cards.map((card, i) => {
              const Icon = iconMap[i % iconMap.length];
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-radar p-6 relative group hover:border-radar-green/50 transition-colors flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-radar-green/40" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-radar-green/40" />
                  <Icon className="w-8 h-8 text-radar mb-4 flex-shrink-0" />
                  <h3 className="font-heading text-sm font-bold text-foreground tracking-wider mb-3">{card.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed flex-1">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VO Operations Section */}
      <section className="py-16 border-t border-radar">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-radar p-8 relative"
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-radar-green/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-radar-green/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-radar-green/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-radar-green/40" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-radar-amber" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-radar-amber uppercase">Mission Briefing</span>
            </div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-4 tracking-wide">
              {content.home.operationsTitle}
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed text-base">
              {content.home.operationsDescription}
            </p>
            <div className="mt-6 pt-6 border-t border-radar flex flex-col sm:flex-row gap-4">
              <Link to="/routes" className="inline-flex items-center gap-2 text-sm text-radar font-mono tracking-wider hover:text-radar/80 transition-colors">
                → View Our Sorties
              </Link>
              <Link to="/fleet" className="inline-flex items-center gap-2 text-sm text-radar font-mono tracking-wider hover:text-radar/80 transition-colors">
                → Browse Our Fleet
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary/30 border-y border-radar">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: `${content.fleet.aircraft.length}+`, label: "Aircraft Types" },
              { value: `${content.staff.members.length}+`, label: "Staff Members" },
              { value: `${content.routes.routeList.length}+`, label: "Active Sorties" },
              { value: `${content.hubs.hubList.length}`, label: "Air Bases" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-heading text-3xl md:text-4xl font-bold text-radar text-glow-green">{stat.value}</div>
                <div className="font-mono text-xs tracking-widest text-muted-foreground mt-1 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Serve?</h2>
          <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
            Join the Indian Air Force Virtual Organisation and experience the thrill of virtual military aviation with a community that values excellence.
          </p>
          <Link to="/apply" className="inline-flex items-center px-10 py-4 bg-primary text-primary-foreground font-heading text-sm tracking-widest uppercase hover:bg-primary/90 glow-green transition-all">
            Begin Your Journey
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
