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
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Main 404 Content */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="text-primary" size={48} />
          </div>
          <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4 animate-bounce">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Quick Actions Card */}
          <Card className="glass p-8 hover-lift">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Home className="text-primary" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.href = "/"}
                className="w-full bg-primary hover:bg-primary/90 text-foreground h-12 text-lg glow"
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

          {/* Popular Pages Card */}
          <Card className="glass p-8 hover-lift">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Search className="text-accent" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Popular Pages</h3>
            </div>
            <div className="space-y-3">
              <a 
                href="/estimate" 
                className="block p-3 rounded-lg bg-accent/5 hover:bg-accent/10 text-foreground hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="font-semibold">Cost Estimate</div>
                <div className="text-sm text-muted-foreground">Calculate construction costs</div>
              </a>
              <a 
                href="/projects" 
                className="block p-3 rounded-lg bg-accent/5 hover:bg-accent/10 text-foreground hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="font-semibold">Our Projects</div>
                <div className="text-sm text-muted-foreground">View completed work</div>
              </a>
              <a 
                href="/contact" 
                className="block p-3 rounded-lg bg-accent/5 hover:bg-accent/10 text-foreground hover:text-primary transition-all duration-300 border border-transparent hover:border-primary/20"
              >
                <div className="font-semibold">Contact Us</div>
                <div className="text-sm text-muted-foreground">Get in touch</div>
              </a>
            </div>
          </Card>
        </div>

        {/* Error Details */}
        <Card className="glass p-6 mb-8">
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
              className="min-w-[200px] border-primary/30 hover:border-primary"
            >
              View Sitemap
            </Button>
            <Button 
              onClick={() => window.location.href = "/contact"}
              className="min-w-[200px] bg-primary hover:bg-primary/90 text-foreground glow"
            >
              Contact Support
            </Button>
          </div>
        </Card>

        {/* Search Suggestion */}
        <Card className="glass p-6 mt-8">
          <p className="text-sm text-muted-foreground text-center">
            <strong className="text-foreground">Tip:</strong> Use the navigation menu or search function to find what you need. 
            If you believe this is an error, please let us know.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;