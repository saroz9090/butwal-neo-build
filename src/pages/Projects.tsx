import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  Search, 
  Building2, 
  Filter, 
  ArrowRight, 
  Calculator, 
  Layout, 
  Eye, 
  Star, 
  Sparkles 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWebsiteContent, INITIAL_PROJECTS, WebsiteProject } from "@/contexts/WebsiteContentContext";
import LazyImage from "@/components/LazyImage";
import { motion } from "motion/react";
import project1_img1 from "@/assets/project-1.jpg";
import { 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCard 
} from "@/components/AnimatedSection";

interface ProjectDisplayItem {
  id: string;
  code?: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  longDescription: string;
  images: string[];
  status: string;
  progress?: number;
  cost?: string;
  client?: string;
  area?: string;
}

export const Projects = () => {
  const navigate = useNavigate();
  const { projects: dynamicProjects } = useWebsiteContent();
  const [selectedProject, setSelectedProject] = useState<ProjectDisplayItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const rawProjects = dynamicProjects.length > 0 ? dynamicProjects : INITIAL_PROJECTS;

  // Map dynamic projects to UI format
  const allProjects = useMemo(() => {
    return rawProjects.map((dp) => {
      const defaultImg = dp.image || project1_img1;
      const allImgs = dp.images && dp.images.length > 0 ? dp.images : [defaultImg];
      const imgList = allImgs.includes(defaultImg) ? allImgs : [defaultImg, ...allImgs];

      return {
        id: dp.id,
        code: dp.code,
        title: dp.title,
        category: dp.category,
        location: dp.location,
        year: dp.startDate ? dp.startDate.split("-")[0] : "2025/2026",
        description: dp.description,
        longDescription: `${dp.description}${dp.client ? ` • Client: ${dp.client}` : ''}${dp.area ? ` • Area: ${dp.area}` : ''}${dp.cost ? ` • Estimated Value: ${dp.cost}` : ''}`,
        images: imgList,
        status: dp.status,
        progress: dp.progress,
        cost: dp.cost,
        client: dp.client,
        area: dp.area
      };
    });
  }, [rawProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Search
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase()));

      // Location
      let matchesLocation = true;
      if (locationFilter === "dang") {
        matchesLocation = p.location.toLowerCase().includes("dang") || 
                          p.location.toLowerCase().includes("ghorahi") || 
                          p.location.toLowerCase().includes("tulsipur") || 
                          p.location.toLowerCase().includes("lamahi");
      } else if (locationFilter === "butwal") {
        matchesLocation = p.location.toLowerCase().includes("butwal") || 
                          p.location.toLowerCase().includes("rupandehi") || 
                          p.location.toLowerCase().includes("tilottama") || 
                          p.location.toLowerCase().includes("manigram") ||
                          p.location.toLowerCase().includes("bhairahawa");
      }

      // Category
      let matchesCategory = true;
      if (categoryFilter !== "all") {
        matchesCategory = p.category.toLowerCase().includes(categoryFilter.toLowerCase());
      }

      // Status
      let matchesStatus = true;
      if (statusFilter !== "all") {
        const itemStatus = (p.status || "").toLowerCase().trim();
        const targetStatus = statusFilter.toLowerCase().trim();
        matchesStatus = itemStatus.includes(targetStatus);
      }

      return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
    });
  }, [allProjects, searchTerm, locationFilter, categoryFilter, statusFilter]);

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-4">
            <ShieldCheck size={16} />
            <span>Turnkey Engineering Portfolio • Butwal & Dang</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-foreground font-heading leading-tight">
            Our Completed & Ongoing <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400 font-black">Projects</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Showcasing residential villas, modern commercial complexes, and municipal infrastructure across Butwal, Rupandehi, and Dang Valley.
          </p>
        </motion.div>

        {/* Filter Controls Bar */}
        <div className="mb-10 p-4 rounded-2xl glass border border-border/60 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, location, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>

            {/* Location Selector Tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                size="sm"
                variant={locationFilter === "all" ? "default" : "outline"}
                onClick={() => setLocationFilter("all")}
                className={locationFilter === "all" ? "bg-primary text-primary-foreground font-bold" : "text-xs text-muted-foreground"}
              >
                All Locations
              </Button>
              <Button
                size="sm"
                variant={locationFilter === "butwal" ? "default" : "outline"}
                onClick={() => setLocationFilter("butwal")}
                className={locationFilter === "butwal" ? "bg-primary text-primary-foreground font-bold" : "text-xs text-muted-foreground"}
              >
                <MapPin className="w-3.5 h-3.5 mr-1" />
                Butwal & Rupandehi
              </Button>
              <Button
                size="sm"
                variant={locationFilter === "dang" ? "default" : "outline"}
                onClick={() => setLocationFilter("dang")}
                className={locationFilter === "dang" ? "bg-primary text-primary-foreground font-bold" : "text-xs text-muted-foreground"}
              >
                <MapPin className="w-3.5 h-3.5 mr-1" />
                Dang Valley (Ghorahi/Tulsipur)
              </Button>
            </div>
          </div>

          {/* Secondary Category and Status Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-medium mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Filters:
            </span>
            {["all", "Residential", "Commercial"].map((cat) => (
              <Badge
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                className={`cursor-pointer capitalize ${categoryFilter === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat === "all" ? "All Categories" : cat}
              </Badge>
            ))}
            <span className="text-border mx-1">|</span>
            {["all", "Ongoing", "Completed"].map((st) => (
              <Badge
                key={st}
                variant={statusFilter === st ? "secondary" : "outline"}
                className={`cursor-pointer capitalize ${statusFilter === st ? "bg-accent text-foreground font-bold" : "text-muted-foreground"}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === "all" ? "All Statuses" : st}
              </Badge>
            ))}
            {(searchTerm || locationFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("all");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="text-xs text-primary font-semibold hover:underline ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl p-8">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-bold text-foreground">No projects match the selected criteria</h3>
            <p className="text-sm text-muted-foreground mt-1">Try clearing some filters or searching for another term.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id}>
                <AnimatedCard>
                  <Card
                    className="glass-ios-card overflow-hidden hover-lift group cursor-pointer h-full flex flex-col justify-between border-border/60"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden">
                        <LazyImage
                          src={project.images[0]}
                          alt={project.title}
                          className="transition-transform duration-700 group-hover:scale-110 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          {project.code && (
                            <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-black/60 text-white backdrop-blur-md border border-white/20">
                              {project.code}
                            </span>
                          )}
                          <Badge className="bg-primary text-primary-foreground font-semibold shadow-md">{project.status}</Badge>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline" className="border-primary/50 text-primary font-medium">
                            {project.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">{project.year}</span>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 flex items-center">
                          <MapPin size={14} className="mr-1 text-primary shrink-0" /> {project.location}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-border/40 mt-2 pt-4">
                      <span className="text-xs sm:text-sm font-semibold text-primary inline-flex items-center hover:underline">
                        View Gallery & Specs →
                      </span>
                      {project.cost && (
                        <span className="text-xs font-medium text-muted-foreground">
                          {project.cost}
                        </span>
                      )}
                    </div>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Related Portals & Interactive Tools Navigation */}
        <div className="mt-20 pt-12 border-t border-border/50">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-2">Explore Related Hubs</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Designs, Virtual Walkthroughs & Estimations
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Jump directly to our architectural catalog, interactive tools, and client reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass p-5 rounded-2xl border-border/60 hover-lift flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Building2 size={20} />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">House Designs Gallery</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Browse 100+ 3D front elevations, modern floor plans, and room specifications.
                </p>
              </div>
              <div className="pt-4 mt-2">
                <Button asChild size="sm" variant="outline" className="w-full text-xs sm:text-sm border-border/80 bg-card/80 text-foreground hover:bg-primary hover:text-white hover:border-primary font-bold rounded-xl shadow-sm transition-all">
                  <Link to="/designs">Browse Designs →</Link>
                </Button>
              </div>
            </Card>

            <Card className="glass p-5 rounded-2xl border-border/60 hover-lift flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Eye size={20} />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">3D Structural Visualizer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Interactive 3D walkthroughs of foundation rebar, pillar beams, and active sites.
                </p>
              </div>
              <div className="pt-4 mt-2">
                <Button asChild size="sm" variant="outline" className="w-full text-xs sm:text-sm border-border/80 bg-card/80 text-foreground hover:bg-primary hover:text-white hover:border-primary font-bold rounded-xl shadow-sm transition-all">
                  <Link to="/under-construction">Open 3D Visualizer →</Link>
                </Button>
              </div>
            </Card>

            <Card className="glass p-5 rounded-2xl border-border/60 hover-lift flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Calculator size={20} />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">Instant Cost Estimator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Calculate construction cost, cement, steel, and total budget in NPR instantly.
                </p>
              </div>
              <div className="pt-4 mt-2">
                <Button asChild size="sm" variant="outline" className="w-full text-xs sm:text-sm border-border/80 bg-card/80 text-foreground hover:bg-primary hover:text-white hover:border-primary font-bold rounded-xl shadow-sm transition-all">
                  <Link to="/estimate">Estimate Budget →</Link>
                </Button>
              </div>
            </Card>

            <Card className="glass p-5 rounded-2xl border-border/60 hover-lift flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Star size={20} />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">Client Testimonials</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Read genuine verified feedback from our homeowners across Butwal and Dang.
                </p>
              </div>
              <div className="pt-4 mt-2">
                <Button asChild size="sm" variant="outline" className="w-full text-xs sm:text-sm border-border/80 bg-card/80 text-foreground hover:bg-primary hover:text-white hover:border-primary font-bold rounded-xl shadow-sm transition-all">
                  <Link to="/testimonials">Read Reviews →</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl glass max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground">{selectedProject.status}</Badge>
                {selectedProject.code && (
                  <span className="text-xs font-mono font-bold text-muted-foreground bg-accent px-2 py-0.5 rounded">
                    Code: {selectedProject.code}
                  </span>
                )}
                <Badge variant="outline" className="border-primary/40 text-primary">{selectedProject.category}</Badge>
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                {selectedProject.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={15} className="text-primary" /> {selectedProject.location}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-4">
              {/* Carousel */}
              <Carousel className="w-full">
                <CarouselContent>
                  {selectedProject.images.map((img: string, i: number) => (
                    <CarouselItem key={i}>
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-border/50 bg-black/20">
                        <LazyImage 
                          src={img} 
                          alt={`${selectedProject.title} view ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {selectedProject.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-3" />
                    <CarouselNext className="right-3" />
                  </>
                )}
              </Carousel>

              {/* Project Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-card/60 border border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground block">Client:</span>
                  <span className="font-semibold text-foreground">{selectedProject.client || "Confidential Homeowner"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Location:</span>
                  <span className="font-semibold text-foreground">{selectedProject.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Built-up Area:</span>
                  <span className="font-semibold text-foreground">{selectedProject.area || "2,400 sq.ft"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Project Value:</span>
                  <span className="font-semibold text-foreground">{selectedProject.cost || "Contact for BOQ"}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Project Overview</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              {/* Inquiry Action */}
              <div className="p-4 rounded-xl glass border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="text-sm font-bold text-foreground">Interested in a similar construction?</h5>
                  <p className="text-xs text-muted-foreground">Contact our engineering desk for custom drawings and quote.</p>
                </div>
                <Button
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold shrink-0"
                  onClick={() => {
                    const text = encodeURIComponent(`Hello Butwal & Dang Construction! I am interested in building a structure similar to "${selectedProject.title}" (Code: ${selectedProject.code || 'N/A'}) in ${selectedProject.location}.`);
                    window.open(`https://wa.me/9779763653181?text=${text}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Inquire on WhatsApp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Projects;
