import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Info, Briefcase, Wrench, BookOpen, Calculator, Mail, ChevronDown, Facebook, Instagram, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check login status on component mount and when location changes
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const name = localStorage.getItem("userName") || "";
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, [location]);

  const mainNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Estimate", path: "/estimate", icon: Calculator },
    { name: "Designs", path: "/designs", icon: Wrench },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const toolsItems = [
    { name: "Permit Assistant", path: "/tools/permits", description: "Nepal building permits & legal help" },
    { name: "Financial Calculators", path: "/tools/calculators", description: "EMI, ROI & rental yield tools" },
    { name: "Vastu Guide", path: "/tools/vastu", description: "Complete Vastu Shastra guidance" },
    { name: "Buy or Build?", path: "/tools/buy-or-build", description: "Decision helper tool" },
    { name: "Green Build Calculator", path: "/tools/green-calculator", description: "Calculate eco savings" },
    { name: "Floor Plan", path: "/floor-planner", description: "2D floor planning tool" },
  ];

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
      icon: MessageCircle, 
      href: "https://wa.me/yournumber", 
      label: "WhatsApp",
      color: "hover:text-green-600"
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogin = () => {
    navigate("/login");
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
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <img 
                src="/butwalconstructionandbuilderslogo.png" 
                alt="Butwal Construction & Builders" 
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Main Navigation Items */}
              {mainNavItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`${
                      isActive(item.path)
                        ? "bg-primary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    } transition-all duration-300`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              {/* Tools Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground bg-transparent">
                      Tools
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        {toolsItems.map((item) => (
                          <Link key={item.path} to={item.path}>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">{item.name}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Social Media Links */}
              <div className="flex items-center space-x-2 ml-4 border-l border-border pl-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 text-muted-foreground ${social.color} transition-colors duration-300 rounded-full hover:bg-accent`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>

              {/* Login/User Menu */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2 ml-4 border-l border-border pl-4">
                  <Button 
                    onClick={handleDashboard}
                    variant="ghost" 
                    className="text-muted-foreground hover:text-foreground transition-all duration-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {userName || "Dashboard"}
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleLogin}
                  variant="outline" 
                  className="ml-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden glass border-t border-border animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Main Navigation Items for Mobile */}
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive(item.path)
                        ? "bg-primary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}

              {/* Tools Section for Mobile */}
              <div className="pl-4 space-y-2 border-l-2 border-primary/30">
                <div className="text-xs font-semibold text-primary mb-2">Tools</div>
                {toolsItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        isActive(item.path)
                          ? "bg-primary text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Social Media Links for Mobile */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border mt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 text-muted-foreground ${social.color} transition-colors duration-300 rounded-full hover:bg-accent`}
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>

              {/* Login/Logout Button for Mobile */}
              {isLoggedIn ? (
                <div className="space-y-2 border-t border-border pt-4">
                  <Button 
                    onClick={() => {
                      handleDashboard();
                      setIsOpen(false);
                    }}
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {userName || "Dashboard"}
                  </Button>
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
                  className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
        <div className="flex items-center justify-around px-2 py-3">
          {mainNavItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex-1">
              <div
                className={`flex flex-col items-center space-y-1 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                } transition-colors duration-300`}
              >
                <item.icon size={20} />
                <span className="text-xs">{item.name}</span>
              </div>
            </Link>
          ))}
          
          {/* Login/User in Mobile Bottom Nav */}
          {isLoggedIn ? (
            <button 
              onClick={handleDashboard}
              className="flex-1 flex flex-col items-center space-y-1 text-primary transition-colors duration-300"
            >
              <User size={20} />
              <span className="text-xs">Account</span>
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex-1 flex flex-col items-center space-y-1 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <User size={20} />
              <span className="text-xs">Login</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;