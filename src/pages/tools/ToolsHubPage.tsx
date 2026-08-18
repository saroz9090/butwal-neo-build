import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Wrench, 
  Calculator, 
  Compass, 
  Clock, 
  FileCheck, 
  Leaf, 
  Layout, 
  Box, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  Layers
} from "lucide-react";

export interface ToolApp {
  id: string;
  title: string;
  category: "Planner" | "Calculators" | "Legal & Permitting" | "Design & 3D" | "Eco & Green";
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeColor: string;
  features: string[];
  recommendedFor: string;
}

const toolApps: ToolApp[] = [
  {
    id: "floor-planner",
    title: "2D Floor Planner App",
    category: "Planner",
    description: "Design custom 2D floor plans with drag-and-drop rooms, furniture, doors, and real-time square footage calculation.",
    path: "/floor-planner",
    icon: Layout,
    badge: "Interactive App",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    features: ["Drag & Drop Rooms", "Custom Wall Dimensions", "Furniture Layout", "Printable Blueprint"],
    recommendedFor: "Homeowners planning new house layouts"
  },
  {
    id: "calculators",
    title: "Construction & Financial Calculators",
    category: "Calculators",
    description: "Calculate total construction cost per sq. ft, monthly home loan EMI, return on investment (ROI), and rental yield.",
    path: "/tools/calculators",
    icon: Calculator,
    badge: "Smart Tool",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    features: ["Cost per Sq. Ft Estimator", "Bank EMI Calculator", "Rental Yield Analysis", "Nepal Material Rates"],
    recommendedFor: "Budgeting and financial feasibility"
  },
  {
    id: "vastu",
    title: "Vastu Shastra Guide",
    category: "Planner",
    description: "Interactive Vastu compass to evaluate room placements, main door orientation, kitchen, and bedroom compliance.",
    path: "/tools/vastu",
    icon: Compass,
    badge: "Popular",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    features: ["Room Placement Guide", "Directional Compass", "Vastu Dosha Remedies", "Custom Floor Analysis"],
    recommendedFor: "Vastu-compliant home planning"
  },
  {
    id: "permits",
    title: "Nepal Permit Assistant",
    category: "Legal & Permitting",
    description: "Step-by-step guidance for Nepal municipal building permits, Naksa Pass, ward approvals, and legal checklists.",
    path: "/tools/permits",
    icon: FileCheck,
    badge: "Legal Guide",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    features: ["Naksa Pass Document Checklist", "Ward Office Approval Steps", "Municipal By-laws Guide", "Required Fee Estimator"],
    recommendedFor: "Navigating Nepal government construction approvals"
  },
  {
    id: "timeline",
    title: "Construction Timeline Estimator",
    category: "Planner",
    description: "Generate a realistic stage-by-stage timeline for foundation, brickwork, roofing, electrical, plumbing, and finishing.",
    path: "/tools/timeline",
    icon: Clock,
    badge: "Project Tool",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    features: ["Residential vs Commercial Schedules", "Milestone Progress Tracker", "Rainy Season Adjustments", "Phase Completion Dates"],
    recommendedFor: "Project scheduling & contractor management"
  },
  {
    id: "designs-gallery",
    title: "House Designs Gallery",
    category: "Design & 3D",
    description: "Explore professional house designs, modern architecture, floor plans, and filter by style, bedrooms, and budgets.",
    path: "/designs",
    icon: Layers,
    badge: "Gallery",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    features: ["Modern & Traditional Styles", "High-res Elevation Photos", "Room & Floor Filtering", "Detailed Specifications"],
    recommendedFor: "Finding inspiration for your dream house"
  },
  {
    id: "green-calculator",
    title: "Green Build Eco Calculator",
    category: "Eco & Green",
    description: "Calculate energy efficiency savings, solar power requirements, rainwater harvesting capacity, and eco material benefits.",
    path: "/tools/green-calculator",
    icon: Leaf,
    badge: "Eco Friendly",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    features: ["Solar PV Capacity Estimator", "Rainwater Tank Sizing", "AAC Block vs Red Brick Savings", "Utility Bill Reductions"],
    recommendedFor: "Building sustainable & energy-efficient homes"
  },
  {
    id: "buy-or-build",
    title: "Buy vs Build Assistant",
    category: "Calculators",
    description: "Compare the financial, time, and customization trade-offs between buying a ready-made house versus constructing new.",
    path: "/tools/buy-or-build",
    icon: DollarSign,
    badge: "Decision Helper",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    features: ["Side-by-Side Cost Comparison", "Customization Value Metric", "Depreciation Analysis", "Interactive Quiz"],
    recommendedFor: "First-time buyers making building decisions"
  },
  {
    id: "under-construction",
    title: "3D Structural Visualizer App",
    category: "Design & 3D",
    description: "Interactive 3D preview of RCC structural framing, pillar casting, beam reinforcements, and brick masonry stages.",
    path: "/under-construction",
    icon: Box,
    badge: "3D Interactive",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    features: ["3D Structural Mesh View", "RCC Frame Construction Stages", "Camera Orbit Controls", "Material Details"],
    recommendedFor: "Visualizing structural integrity & stages"
  },
  {
    id: "estimate",
    title: "Instant Cost Estimate Generator",
    category: "Calculators",
    description: "Answer a few questions regarding plot size, floors, and finishing quality to receive an instant itemized estimate.",
    path: "/estimate",
    icon: Calculator,
    badge: "Instant Quote",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    features: ["Itemized Budget Breakdown", "Standard / Premium Finishes", "Print / Download Summary", "Direct Contractor Review"],
    recommendedFor: "Getting instant detailed price quotes"
  }
];

export default function ToolsHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Planner", "Calculators", "Legal & Permitting", "Design & 3D", "Eco & Green"];

  const filteredTools = toolApps.filter((tool) => {
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-background pt-32 pb-20 text-foreground">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Page Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-3 px-4 py-1.5 text-sm bg-primary/20 text-primary border-primary/30 font-medium">
            <Wrench className="w-4 h-4 mr-1.5 inline text-primary" />
            Interactive Construction Suite
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
            Construction <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Tools & Apps Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            All our powerful calculators, floor planners, 3D visualizers, Vastu guides, and legal permit assistants in one place.
            Click on any app below to launch it instantly.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass border-white/10 shadow-lg rounded-2xl p-4 md:p-6 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-primary text-primary-foreground font-semibold" : "border-border text-muted-foreground hover:text-foreground"}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card/60 border-border"
            />
          </div>
        </div>

        {/* Apps & Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id} 
                className="glass border-white/10 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className={`text-xs font-semibold ${tool.badgeColor}`}>
                        {tool.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-muted-foreground/80">
                      Category: {tool.category}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>

                    <div>
                      <span className="text-xs font-bold text-foreground block mb-2">Key Capabilities:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {tool.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                            <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-border/50 mt-4 bg-card/30 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground italic truncate max-w-[180px]">
                    {tool.recommendedFor}
                  </span>
                  <Link to={tool.path}>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md">
                      Launch App
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 glass border-white/10 shadow-lg rounded-2xl">
            <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-lg font-bold">No matching tools found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Try adjusting your search query or category filter.</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
              Reset Filters
            </Button>
          </div>
        )}

        {/* Support Section */}
        <div className="mt-16 glass border-white/10 shadow-lg rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Need Expert Architectural or Engineering Assistance?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team of engineers at Butwal Construction and Builders can review your floor plans, municipal permits, and structural estimates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Consult with Our Engineers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/group-companies">
              <Button size="lg" variant="outline" className="border-border">
                Explore Sister Companies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
