import { getContent } from "@/lib/content";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const content = getContent();

  return (
    <footer className="border-t border-radar bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-radar" />
              <span className="font-heading text-sm font-bold text-radar tracking-wider">{content.general.shortName}</span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {content.general.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-xs tracking-widest text-radar-amber mb-4 uppercase">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {["/about", "/staff", "/fleet", "/routes", "/hubs", "/ranks", "/apply"].map(path => (
                <Link
                  key={path}
                  to={path}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body capitalize"
                >
                  {path.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xs tracking-widest text-radar-amber mb-4 uppercase">Connect</h4>
            <p className="text-sm text-muted-foreground font-body">
              Join our community and become part of the Indian Air Force Virtual Organisation family.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-radar">
          <p className="text-xs text-muted-foreground text-center font-mono">
            {content.general.footerText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
