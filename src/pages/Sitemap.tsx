import { Card } from "@/components/ui/card";
import { Map, Home, Building2, Calculator, FileText, Users, Phone, Mail, Hammer, Ruler, Leaf, Calendar, MessageCircle, Shield, BookOpen } from "lucide-react";

const Sitemap = () => {
  const siteSections = [
    {
      title: "Main Pages",
      icon: Home,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      pages: [
        { name: "Home", path: "/", description: "Welcome to Butwal Construction & Builders" },
        { name: "About & Services", path: "/about", description: "Learn about our company and services" },
        { name: "Projects", path: "/projects", description: "View our completed construction projects" },
        { name: "Testimonials", path: "/testimonials", description: "Client reviews and success stories" },
        { name: "Partnerships", path: "/partnerships", description: "Our trusted partners and suppliers" },
        { name: "Contact", path: "/contact", description: "Get in touch with our team" },
      ]
    },
    {
      title: "Construction Tools",
      icon: Calculator,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      pages: [
        { name: "Cost Estimate", path: "/estimate", description: "Calculate your construction costs" },
        { name: "Permit Assistant", path: "/tools/permits", description: "Guide for construction permits" },
        { name: "Construction Calculators", path: "/tools/calculators", description: "Various construction calculators" },
        { name: "Vastu Guide", path: "/tools/vastu", description: "Traditional architectural guidance" },
        { name: "Buy or Build Advisor", path: "/tools/buy-or-build", description: "Help deciding between buying and building" },
        { name: "Construction Timeline", path: "/tools/timeline", description: "Project scheduling and planning" },
        { name: "Green Build Calculator", path: "/tools/green-calculator", description: "Sustainable construction assessment" },
        { name: "Floor Planner", path: "/floor-planner", description: "Design and plan your floor layout" },
      ]
    },
    {
      title: "Design & Planning",
      icon: Ruler,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      pages: [
        { name: "House Designs Gallery", path: "/designs", description: "Browse our design portfolio" },
        { name: "3D Visualization", path: "/estimate", description: "Interactive 3D project previews" },
        { name: "Under Construction", path: "/under-construction", description: "Projects currently in progress" },
      ]
    },
    {
      title: "Resources",
      icon: FileText,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      pages: [
        { name: "Blog", path: "/blog", description: "Construction tips and insights" },
        { name: "Construction Guides", path: "/blog", description: "Educational content and tutorials" },
        { name: "Material Specifications", path: "/tools/calculators", description: "Building material information" },
        { name: "Cost Databases", path: "/estimate", description: "Updated construction cost data" },
      ]
    },
    {
      title: "User Account",
      icon: Users,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      pages: [
        { name: "Login", path: "/login", description: "Access your account" },
        { name: "Customer Dashboard", path: "/customer/dashboard", description: "Manage your projects" },
        { name: "Staff Dashboard", path: "/staff/dashboard", description: "Internal management portal" },
        { name: "Project Tracking", path: "/customer/dashboard", description: "Monitor construction progress" },
      ]
    },
    {
      title: "Legal & Support",
      icon: Shield,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      pages: [
        { name: "Privacy Policy", path: "/privacy", description: "How we protect your data" },
        { name: "Terms & Conditions", path: "/terms", description: "Service terms and agreements" },
        { name: "Customer Support", path: "/contact", description: "Get help and support" },
        { name: "FAQ", path: "/contact", description: "Frequently asked questions" },
      ]
    },
    {
      title: "Connect With Us",
      icon: MessageCircle,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      pages: [
        { name: "WhatsApp Chat", path: "https://wa.me/9779845323733", description: "Instant messaging support", external: true },
        { name: "Email Support", path: "mailto:info@butwalconstruction.com", description: "Email our team", external: true },
        { name: "Phone Support", path: "tel:+9779845323733", description: "Call us directly", external: true },
        { name: "Live Chat", path: "/contact", description: "Real-time chat assistance" },
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Map className="text-primary" size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Site <span className="text-primary">Map</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore all pages and features of our construction platform
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-primary mb-1">{siteSections.reduce((acc, section) => acc + section.pages.length, 0)}</div>
            <div className="text-xs text-muted-foreground">Total Pages</div>
          </Card>
          <Card className="glass p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-green-500 mb-1">8</div>
            <div className="text-xs text-muted-foreground">Construction Tools</div>
          </Card>
          <Card className="glass p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-blue-500 mb-1">6</div>
            <div className="text-xs text-muted-foreground">Main Sections</div>
          </Card>
          <Card className="glass p-4 text-center hover-lift">
            <div className="text-2xl font-bold text-purple-500 mb-1">24/7</div>
            <div className="text-xs text-muted-foreground">Support Available</div>
          </Card>
        </div>

        <div className="space-y-8">
          {siteSections.map((section, index) => (
            <Card key={section.title} className="glass p-8 hover-lift animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 ${section.bgColor} rounded-xl flex items-center justify-center`}>
                  <section.icon className={section.color} size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {section.pages.length} pages in this section
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.pages.map((page, pageIndex) => (
                  <a
                    key={page.name}
                    href={page.path}
                    target={page.external ? "_blank" : "_self"}
                    rel={page.external ? "noopener noreferrer" : ""}
                    className="group"
                  >
                    <Card className="p-4 hover-lift border-2 border-transparent hover:border-primary/20 transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 ${section.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                          <section.icon className={`${section.color} text-xs`} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {page.name}
                            </h3>
                            {page.external && (
                              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">External</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {page.description}
                          </p>
                          <div className="text-xs text-primary mt-2 font-mono truncate">
                            {page.path.replace('https://', '').replace('mailto:', '').replace('tel:', '')}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Site Structure Overview */}
        <Card className="glass p-8 mt-8 hover-lift">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Website Structure Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Home className="text-blue-500" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Main Navigation</h3>
              <p className="text-sm text-muted-foreground">Core company information and services</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calculator className="text-green-500" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Interactive Tools</h3>
              <p className="text-sm text-muted-foreground">Construction calculators and planners</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Ruler className="text-purple-500" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Design Resources</h3>
              <p className="text-sm text-muted-foreground">Visualization and design inspiration</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="text-cyan-500" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">User Portal</h3>
              <p className="text-sm text-muted-foreground">Account management and tracking</p>
            </div>
          </div>
        </Card>

        {/* Search Tips */}
        <Card className="glass p-8 mt-8 hover-lift">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Quick Navigation Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Hammer className="text-primary" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Need Cost Estimates?</h4>
                  <p className="text-sm text-muted-foreground">Use our Cost Estimate tool for accurate calculations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="text-green-500" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Planning Permits?</h4>
                  <p className="text-sm text-muted-foreground">Check Permit Assistant for guidance</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-purple-500" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Project Timeline?</h4>
                  <p className="text-sm text-muted-foreground">Use Construction Timeline planner</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-orange-500" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Need Help?</h4>
                  <p className="text-sm text-muted-foreground">Contact us via WhatsApp or email</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Final Note */}
        <Card className="glass p-6 mt-8">
          <p className="text-sm text-muted-foreground text-center">
            <strong className="text-foreground">Note:</strong> This sitemap is regularly updated as we add new features and content. 
            Can't find what you're looking for? Use our search function or contact our support team.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Sitemap;