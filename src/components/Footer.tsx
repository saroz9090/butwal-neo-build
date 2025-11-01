import { Building2, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="glass border-t border-border mt-20 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="text-primary" size={24} />
              <div>
                <h3 className="font-bold text-foreground">Butwal Construction</h3>
                <p className="text-xs text-muted-foreground">& Builders</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A sister company of Satyawati Devi Hardware, delivering excellence in construction.
            </p>
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
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">info@butwalconstruction.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Butwal Construction and Builders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
