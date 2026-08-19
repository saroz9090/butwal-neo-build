import { Building2, Mail, Phone, MapPin, MessageCircle, Facebook, Instagram, Linkedin, Youtube, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { DualPresenceMap } from "@/components/DualPresenceMap";
import { useNepalBusinessStatus } from "@/hooks/useNepalBusinessStatus";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  const businessStatus = useNepalBusinessStatus();
  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/butwalconstructionandbuilders", 
      label: "Facebook",
      color: "hover:text-blue-600"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/butwalconstructionandbuilders", 
      label: "Instagram",
      color: "hover:text-pink-600"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/butwal-construction-and-builders", 
      label: "LinkedIn",
      color: "hover:text-blue-500"
    },
    { 
      icon: Youtube, 
      href: "https://www.youtube.com/@ButwalConstructionandbuilders", 
      label: "YouTube",
      color: "hover:text-red-600"
    },
    { 
      icon: MessageCircle, 
      href: "https://wa.me/9779763653181", 
      label: "WhatsApp",
      color: "hover:text-green-600"
    },
  ];

  return (
    <footer className="glass border-t border-border mt-20 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        {/* Interactive Dual Hub Presence Banner */}
        <div className="mb-12">
          <DualPresenceMap compact={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="/butwalconstructionandbuilderslogo.png" 
                alt="Butwal Construction & Builders - Best Construction Company in Butwal & Dang" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              <strong>Butwal Construction & Builders</strong> & <strong>Dang Construction & Builders</strong> — Flagship turnkey civil engineering, 3D architectural design & building permit experts in Nepal.
            </p>
            <p className="text-xs text-muted-foreground/80 mb-4">
              Backed by Satyawati Devi Hardware and established engineering family networks.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 text-muted-foreground ${social.color} transition-colors duration-300 rounded-full hover:bg-accent`}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Tools */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Navigation</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/dang" className="block text-sm text-primary font-semibold hover:underline">
                ★ Dang Branch (Ghorahi & Tulsipur)
              </Link>
              <Link to="/services" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Core Services
              </Link>
              <Link to="/designs" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                3D House Designs Gallery
              </Link>
              <Link to="/projects" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Completed & Ongoing Projects
              </Link>
              <Link to="/estimate" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Construction Cost Estimator
              </Link>
              <Link to="/tools/tiles-calculator" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Tiles, Granite & Moulding Calculator
              </Link>
              <Link to="/tools/paint-calculator" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Paint Area & Cost Calculator
              </Link>
              <Link to="/group-companies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Group Companies & Network
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact & Regional Offices
              </Link>
            </div>
          </div>

          {/* Group Companies */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Group Ecosystem</h4>
            <div className="space-y-2">
              <Link to="/group-companies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                ★ Butwal Construction & Builders (HQ)
              </Link>
              <Link to="/dang" className="block text-sm text-primary font-medium hover:underline">
                ★ Dang Construction & Builders (Regional)
              </Link>
              <Link to="/group-companies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                • Satyawati Devi Hardware (10+ Yrs)
              </Link>
              <Link to="/group-companies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                • Navdurga Furniture & Plywood
              </Link>
              <Link to="/group-companies" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                • Malika Hardware and Suppliers
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Regional Locations</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground block">Butwal Head Office (HQ):</strong>
                  Butwal-11, Kalikanagar, Horizonchowk, Annapurna Path, Rupandehi, Nepal
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground block">Dang Regional Branch:</strong>
                  Ghorahi-15, Main Road, Dang (Serving Ghorahi, Tulsipur, Lamahi)
                </p>
              </div>

              <a 
                href="tel:+9779857076965"
                className="flex items-center space-x-2 hover:text-primary transition-colors group pt-2"
              >
                <Phone size={16} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground group-hover:text-primary">+977 9857076965 (Direct)</p>
              </a>
              <a 
                href="https://wa.me/9779763653181" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-primary transition-colors group"
              >
                <MessageCircle size={16} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground group-hover:text-primary">+977 9763653181 (WhatsApp)</p>
              </a>
              <a 
                href="tel:+9779869472803"
                className="flex items-center space-x-2 hover:text-primary transition-colors group"
              >
                <Phone 
                  size={16} 
                  className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" 
                />
                <p className="text-sm text-muted-foreground group-hover:text-primary">
                  +977 9869472803 (Hardware)
                </p>
              </a>

              <a 
                href="mailto:info@butwalconstruction.com.np"
                className="flex items-center space-x-2 hover:text-primary transition-colors group"
              >
                <Mail size={16} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground group-hover:text-primary">info@butwalconstruction.com.np</p>
              </a>
              
              {/* Business Hours */}
              <div className="mt-4 pt-4 border-t border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-semibold text-foreground">Business Hours</h5>
                  <Badge className={`text-[10px] font-bold px-2 py-0.5 ${
                    businessStatus.isOpen 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}>
                    {businessStatus.isOpen ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Open Now
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {businessStatus.statusText}
                      </span>
                    )}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>Sun - Fri: 9:00 AM - 6:00 PM</span>
                </p>
                <p className="text-xs text-muted-foreground">Saturday: On Appointment</p>
                <div className="text-[11px] text-primary/90 font-medium pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>Nepal Time: {businessStatus.currentTimeFormatted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Butwal Construction and Builders. All rights reserved.
            </p>
            
            {/* Additional Links */}
            <div className="flex items-center space-x-4">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;