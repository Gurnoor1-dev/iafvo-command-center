import { useContent } from "@/lib/content";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import vaLogo from "@/assets/vacompany-logo-ClskqmvL.svg";

const Footer = () => {
  const { content } = useContent();
  return (
    <footer className="border-t border-radar bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="IAFVO Logo" className="w-8 h-8 object-contain" />
              <span className="font-heading text-sm font-bold text-radar tracking-wider">
                {content.general.shortName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {content.general.tagline}
            </p>
          </div>
          <div>
            <h4 className="font-heading text-xs tracking-widest text-radar-amber mb-4 uppercase">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {["/about", "/staff", "/fleet", "/routes", "/hubs", "/ranks", "/apply"].map((path) => (
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
          <div>
            <h4 className="font-heading text-xs tracking-widest text-radar-amber mb-4 uppercase">
              Connect
            </h4>
            <p className="text-sm text-muted-foreground font-body mb-3">
              Join our community on the Infinite Flight Community forum to apply or get in touch.
            </p>
            <div className="flex flex-col items-start gap-4">
              {content.general.ifcLink && (
                <a
                  href={content.general.ifcLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-radar hover:text-radar/80 font-mono tracking-wider transition-colors"
                >
                  → Visit us on IFC
                </a>
              )}
              <div className="w-full flex justify-center md:justify-start pt-2">
                <img 
                  src={vaLogo} 
                  alt="VA Company Logo" 
                  className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-radar space-y-2">
          <p className="text-xs text-muted-foreground text-center font-mono">
            {content.general.footerText}
          </p>
          <p className="text-xs text-muted-foreground text-center font-mono">
            This VA/VO is not affiliated with Infinite Flight and is under the IFVARB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
