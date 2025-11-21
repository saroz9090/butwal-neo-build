import { Building2, Mail, Phone, MapPin, MessageCircle, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/butwalconstructionandbuilders", 
      label: "Facebook",
      color: "hover:text-blue-600"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/yourprofile", 
      label: "Instagram",
      color: "hover:text-pink-600"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/yourcompany", 
      label: "LinkedIn",
      color: "hover:text-blue-500"
    },
    { 
      icon: Youtube, 
      href: "https://youtube.com/@yourchannel", 
      label: "YouTube",
      color: "hover:text-red-600"
    },
    { 
      icon: MessageCircle, 
      href: "https://wa.me/9779845323733", 
      label: "WhatsApp",
      color: "hover:text-green-600"
    },
  ];

  return (
    <footer className="glass border-t border-border mt-20 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="/butwalconstructionandbuilderslogo.png" 
                alt="Butwal Construction & Builders" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A sister company of Satyawati Devi Hardware, delivering excellence in construction.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-3 mt-6">
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

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/projects" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link to="/services" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/estimate" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Get Estimate
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Services</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Residential Construction</p>
              <p className="text-sm text-muted-foreground">Commercial Buildings</p>
              <p className="text-sm text-muted-foreground">Renovation & Remodeling</p>
              <p className="text-sm text-muted-foreground">Project Management</p>
              <p className="text-sm text-muted-foreground">Architectural Design</p>
              <p className="text-sm text-muted-foreground">Construction Consulting</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">Butwal, Nepal</p>
              </div>
              <a 
                href="https://wa.me/9779845323733" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-primary transition-colors group"
              >
                <MessageCircle size={16} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground group-hover:text-primary">+977 984-5323733</p>
              </a>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">+977 984-5323733</p>
              </div>
              <a 
                href="mailto:info@butwalconstruction.com.np"
                className="flex items-center space-x-2 hover:text-primary transition-colors group"
              >
                <Mail size={16} className="text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground group-hover:text-primary">info@butwalconstruction.com.np</p>
              </a>
              
              {/* Business Hours */}
              <div className="mt-4 pt-4 border-t border-border">
                <h5 className="text-sm font-semibold text-foreground mb-2">Business Hours</h5>
                <p className="text-xs text-muted-foreground">Sun - Fri: 9:00 AM - 6:00 PM</p>
                <p className="text-xs text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
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