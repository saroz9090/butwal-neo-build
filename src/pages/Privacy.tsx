import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-primary" size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            404 - Page <span className="text-primary">Not Found</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="glass p-8 hover-lift">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Home className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => window.location.href = "/"}
                className="w-full bg-primary hover:bg-primary/90 text-foreground h-12 text-lg"
              >
                <Home className="mr-2" size={20} />
                Return to Homepage
              </Button>
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full h-12 text-lg border-primary/30 hover:border-primary"
              >
                <ArrowLeft className="mr-2" size={20} />
                Go Back
              </Button>
            </div>
          </Card>

          {/* Popular Pages */}
          <Card className="glass p-8 hover-lift">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Search className="text-accent" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Popular Pages</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/estimate" 
                className="p-4 rounded-lg bg-accent/5 hover:bg-accent/10 text-foreground hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="font-semibold">Cost Estimate</div>
                <div className="text-sm text-muted-foreground">Calculate construction costs</div>
              </a>
              <a 
                href="/projects" 
                className="p-4 rounded-lg bg-accent/5 hover:bg-accent/10 text-foreground hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="font-semibold">Our Projects</div>
                <div className="text-sm text-muted-foreground">View completed work</div>
              </a>
              <a 
                href="/contact" 
                className="p-4 rounded-lg bg-accent/5 hover:bg-accent/10 text-foreground hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="font-semibold">Contact Us</div>
                <div className="text-sm text-muted-foreground">Get in touch</div>
              </a>
              <a 
                href="/tools/calculators" 
                className="p-4 rounded-lg bg-accent/5 hover:bg-accent/10 text-foreground hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="font-semibold">Calculators</div>
                <div className="text-sm text-muted-foreground">Construction tools</div>
              </a>
            </div>
          </Card>

          {/* Error Details */}
          <Card className="glass p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Attempted to access:
              </p>
              <code className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg font-mono text-sm break-all">
                {location.pathname}
              </code>
            </div>
          </Card>

          {/* Help Section */}
          <Card className="glass p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Check our sitemap or contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = "/sitemap"}
                variant="outline"
                className="border-primary/30 hover:border-primary"
              >
                View Sitemap
              </Button>
              <Button 
                onClick={() => window.location.href = "/contact"}
                className="bg-primary hover:bg-primary/90 text-foreground"
              >
                Contact Support
              </Button>
            </div>
          </Card>

          {/* Final Note */}
          <Card className="glass p-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Note:</strong> If you believe this is an error, 
              please contact our support team. We're here to help you find what you need.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotFound;