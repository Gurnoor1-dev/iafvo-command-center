import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Added Framer Motion
import { getContent } from "@/lib/content";
import logo from "@/assets/logo.png";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/staff", label: "Our Staff" },
  { path: "/fleet", label: "Fleet" },
  { path: "/routes", label: "Routes" },
  { path: "/hubs", label: "Hubs" },
  { path: "/ranks", label: "Ranks" },
  { path: "/apply", label: "Apply" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const content = getContent();

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-radar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="IAFVO Logo" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-heading text-sm font-bold text-radar tracking-wider">{content.general.shortName}</span>
              <span className="hidden md:block text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
                Indian Air Force VO
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-body font-semibold tracking-wide uppercase transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-radar text-glow-green"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle with rotation animation */}
          <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground p-2 outline-none">
            <motion.div
              initial={false}
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Animated Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-b border-radar overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }} // Staggered entry
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 text-sm font-body font-semibold tracking-wide uppercase transition-colors ${
                      location.pathname === link.path
                        ? "text-radar border-l-2 border-radar-green bg-radar/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
