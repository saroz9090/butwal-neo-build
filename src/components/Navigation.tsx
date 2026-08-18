import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  Home, 
  Layers, 
  Briefcase, 
  Building2, 
  Wrench, 
  Mail, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  User, 
  Bell, 
  Calculator, 
  Layout, 
  Compass, 
  FileCheck, 
  BookOpen, 
  Info, 
  Phone,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoginModal from "@/components/LoginModal";
import { useWebsiteContent } from "@/contexts/WebsiteContentContext";

const Navigation = () => {
  const { settings } = useWebsiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      // Intelligent scroll detection for mobile bottom bar
      if (currentScrollY < 60) {
        setShowBottomNav(true);
      } else if (currentScrollY > lastScrollY.current + 8 && currentScrollY > 80) {
        // Scrolling down -> hide the floating bottom nav bar so it's not stuck on screen
        setShowBottomNav(false);
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> reveal bottom nav bar smoothly
        setShowBottomNav(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login status on component mount and when location changes
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const name = localStorage.getItem("userName") || "";
    setIsLoggedIn(loggedIn);
    setUserName(name);
    setIsOpen(false); // Close mobile menu upon navigation
  }, [location.pathname]);

  // Exact requested navigation items: Home, About, Projects, Apps, Estimate, Contact
  const primaryNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Apps", path: "/apps", icon: Wrench },
    { name: "Estimate", path: "/estimate", icon: Calculator },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const quickAppsList = [
    { name: "Cost Estimator & BOQ", path: "/estimate", icon: Calculator, desc: "Instant price quotes in NPR" },
    { name: "2D Floor Planner", path: "/floor-planner", icon: Layout, desc: "Drag & drop floor planner" },
    { name: "Nepal Permit Assistant", path: "/tools/permits", icon: FileCheck, desc: "Naksa Pass approval steps" },
    { name: "Vastu Shastra Guide", path: "/tools/vastu", icon: Compass, desc: "Room orientation & compliance" },
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/butwalconstructionandbuilders", 
      label: "Facebook",
      color: "hover:text-blue-500"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/butwalconstructionandbuilders", 
      label: "Instagram",
      color: "hover:text-pink-500"
    },
    { 
      icon: MessageCircle, 
      href: "https://wa.me/9779763653181", 
      label: "WhatsApp",
      color: "hover:text-green-500"
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  const handleDashboard = () => {
    window.location.href = "https://employee.butwalconstruction.com.np";
  };

  return (
    <>
      {/* Fixed Top Header Container holding Announcement Bar & Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-ios backdrop-blur-2xl shadow-2xl border-b border-white/15"
            : "bg-background/80 backdrop-blur-xl border-b border-white/10"
        }`}
      >
        {/* Top Announcement Bar */}
        {settings.announcementEnabled && settings.announcementText && (
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-white/10">
            <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0 text-amber-300" />
            <span className="truncate max-w-2xl font-semibold">{settings.announcementText}</span>
            {settings.announcementLink && (
              <Link to={settings.announcementLink} className="underline font-bold text-white hover:text-amber-200 shrink-0 ml-1 transition-colors">
                Explore →
              </Link>
            )}
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <img 
                src="/butwalconstructionandbuilderslogo.png" 
                alt="Butwal Construction & Builders - Best Construction Company in Butwal & Dang" 
                className="h-8 sm:h-10 md:h-11 w-auto object-contain drop-shadow-md"
              />
            </Link>

            {/* Desktop Menu - Streamlined Apple iOS Capsule Styling */}
            <div className="hidden xl:flex items-center space-x-1 xl:space-x-2">
              <div className="flex items-center space-x-1 glass-ios-pill px-2 py-1.5 rounded-full border-white/15">
                {primaryNavItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 ease-out ${
                          active
                            ? "bg-primary text-white font-bold shadow-lg shadow-primary/30 scale-[1.03]"
                            : "text-muted-foreground hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 mr-1.5 ${active ? "text-white" : "text-muted-foreground"}`} />
                        {item.name}
                        {item.badge && !active && (
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/40">
                            {item.badge}
                          </span>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Primary Action CTA */}
              <Link to="/contact" className="ml-2 hidden xl:block">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs xl:text-sm px-4 py-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.03] active:scale-[0.96] transition-all duration-200"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  Free Consultation
                </Button>
              </Link>

              {/* Social Media Links */}
              <div className="hidden xl:flex items-center space-x-1 ml-2 border-l border-border/70 pl-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 text-muted-foreground ${social.color} transition-all duration-200 rounded-full hover:bg-card hover:scale-110`}
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>

              {/* Login/User Menu */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2 ml-2 border-l border-border/70 pl-3">
                  <Button 
                    onClick={handleDashboard}
                    variant="ghost" 
                    size="sm"
                    className="text-xs text-white hover:bg-card rounded-full transition-all duration-200"
                  >
                    <User className="h-3.5 w-3.5 mr-1 text-primary" />
                    {userName || "Dashboard"}
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    size="sm"
                    className="text-xs rounded-full border-primary/50 text-white hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleLogin}
                  variant="outline" 
                  size="sm"
                  className="ml-2 text-xs rounded-full border-border/80 text-white hover:border-primary hover:text-white hover:bg-card transition-all duration-200"
                >
                  <User className="h-3.5 w-3.5 mr-1 text-primary" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile / Tablet Menu Toggle */}
            <div className="xl:hidden flex items-center gap-2">
              <Link to="/contact" className="hidden sm:block">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Consult
                </Button>
              </Link>
              <button
                className="text-white p-2 rounded-xl bg-card border border-border/60 hover:bg-accent transition-all duration-200 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={22} className="text-primary" /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile / Tablet Dropdown Menu - Organized with Clear Sections */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="xl:hidden glass-ios backdrop-blur-3xl border-t border-white/15 shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto pb-8"
            >
              <div className="container mx-auto px-4 py-4 space-y-5">
                
                {/* Primary Pages */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2">
                    Main Menu
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {primaryNavItems.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-xs sm:text-sm font-medium rounded-2xl h-11 transition-all ${
                              active
                                ? "bg-primary text-white font-bold shadow-lg shadow-primary/25"
                                : "text-foreground glass-ios border border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <item.icon className={`mr-2 h-4 w-4 ${active ? "text-white" : "text-primary"}`} />
                            <span className="truncate">{item.name}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Apps Hub Section */}
                <div className="p-4 rounded-3xl glass-ios border border-white/15 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5" />
                      Interactive Tools & Apps
                    </span>
                    <Link 
                      to="/tools" 
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] text-primary hover:underline font-bold"
                    >
                      View All Apps →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickAppsList.map((app) => (
                      <Link
                        key={app.path}
                        to={app.path}
                        onClick={() => setIsOpen(false)}
                        className="p-2.5 rounded-2xl glass-ios border border-white/10 hover:border-primary/50 transition-all flex items-center gap-2.5 group active:scale-[0.98]"
                      >
                        <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <app.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{app.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{app.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Regional Branches */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="p-3 rounded-2xl bg-card/80 border border-border/70 text-left hover:border-primary/60 transition-all"
                  >
                    <Badge className="text-[10px] bg-primary/20 text-rose-300 border border-primary/40 font-bold mb-1">Corporate HQ</Badge>
                    <div className="text-xs font-bold text-foreground">Butwal Head Office</div>
                    <div className="text-[10px] text-muted-foreground">Butwal-11, Kalikanagar</div>
                  </Link>
                  <Link
                    to="/dang"
                    onClick={() => setIsOpen(false)}
                    className="p-3 rounded-2xl bg-card/80 border border-border/70 text-left hover:border-primary/60 transition-all"
                  >
                    <Badge className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold mb-1">Regional Branch</Badge>
                    <div className="text-xs font-bold text-foreground">Dang Branch</div>
                    <div className="text-[10px] text-muted-foreground">Ghorahi-15, Main Road</div>
                  </Link>
                </div>

                {/* Quick Links / Company Info */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
                  <Link to="/about" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-white px-2 py-1">
                    About Us
                  </Link>
                  <Link to="/blog" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-white px-2 py-1">
                    Blog & Articles
                  </Link>
                  <Link to="/group-companies" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-white px-2 py-1">
                    Group Companies
                  </Link>
                  <Link to="/privacy" onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-white px-2 py-1">
                    Privacy Policy
                  </Link>
                </div>

                {/* Social Media Links for Mobile */}
                <div className="flex items-center justify-center space-x-4 pt-3 border-t border-border">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 text-muted-foreground ${social.color} transition-all duration-200 rounded-full bg-card hover:scale-110`}
                      aria-label={social.label}
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>

                {/* Login / User Portal for Mobile */}
                {isLoggedIn ? (
                  <div className="space-y-2 border-t border-border pt-4">
                    <Button 
                      onClick={() => {
                        handleDashboard();
                        setIsOpen(false);
                      }}
                      variant="ghost" 
                      className="w-full justify-start text-white bg-card rounded-xl"
                    >
                      <User className="h-4 w-4 mr-2 text-primary" />
                      {userName || "Dashboard"}
                    </Button>
                    <Button 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      variant="outline" 
                      className="w-full border-primary/50 text-white hover:bg-primary hover:text-white rounded-xl transition-all"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      handleLogin();
                      setIsOpen(false);
                    }}
                    variant="outline" 
                    className="w-full border-border/80 text-white hover:border-primary hover:bg-card rounded-xl transition-all"
                  >
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Client & Staff Portal Login
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* iPhone-style Floating Mobile Bottom Navigation Bar with auto-hide on scroll down */}
      <AnimatePresence>
        {showBottomNav && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden fixed bottom-4 left-4 right-4 z-40 glass-ios rounded-[24px] border border-white/15 shadow-2xl backdrop-blur-3xl px-3 py-2 pointer-events-auto"
          >
            <div className="flex items-center justify-around">
              {primaryNavItems.slice(0, 5).map((item) => {
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path} className="flex-1">
                    <motion.div
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className={`flex flex-col items-center py-1 rounded-xl transition-colors duration-200 ${
                        active
                          ? "text-primary font-bold"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      <item.icon size={18} className={active ? "text-primary stroke-[2.5]" : ""} />
                      <span className="text-[10px] font-semibold leading-tight mt-0.5">{item.name}</span>
                      {active && (
                        <motion.div 
                          layoutId="activeDotMobile"
                          className="w-1 h-1 bg-primary rounded-full mt-0.5"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
              
              {/* Direct WhatsApp Call in Bottom Nav */}
              <a 
                href="https://wa.me/9779763653181" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1"
              >
                <motion.div 
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center py-1 text-[#25D366] hover:text-green-400 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span className="text-[10px] font-semibold leading-tight mt-0.5">WhatsApp</span>
                </motion.div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Portal Selection Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Navigation;
