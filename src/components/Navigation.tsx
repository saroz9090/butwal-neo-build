import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Info, Briefcase, Wrench, BookOpen, Calculator, Mail, ChevronDown } from "lucide-react";
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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "About", path: "/about", icon: Info },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "Blog", path: "/blog", icon: BookOpen },
    { name: "Estimate", path: "/estimate", icon: Calculator },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const toolsItems = [
    { name: "Permit Assistant", path: "/tools/permits", description: "Nepal building permits & legal help" },
    { name: "Calculators", path: "/tools/calculators", description: "EMI, ROI, Vastu tools" },
  ];

  const isActive = (path: string) => location.pathname === path;

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
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-foreground font-bold text-xl">BC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Butwal Construction</h1>
                <p className="text-xs text-muted-foreground">& Builders</p>
              </div>
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
        </div>
      </div>
    </>
  );
};

export default Navigation;