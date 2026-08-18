import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  DollarSign, 
  User, 
  Maximize2, 
  CheckCircle2, 
  Share2, 
  MessageCircle, 
  ShieldCheck, 
  Phone, 
  Clock, 
  Layers, 
  Hammer,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWebsiteContent, INITIAL_PROJECTS } from "@/contexts/WebsiteContentContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LazyImage from "@/components/LazyImage";
import { useToast } from "@/components/ui/use-toast";
import project1_img1 from "@/assets/project-1.jpg";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects: dynamicProjects, loading } = useWebsiteContent();
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rawProjects = dynamicProjects.length > 0 ? dynamicProjects : INITIAL_PROJECTS;
  const project = rawProjects.find((p) => p.id === id || p.code?.toLowerCase() === id?.toLowerCase());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 bg-background">
        <Navigation />
        <div className="text-center py-20 max-w-md">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h2 className="text-3xl font-extrabold mb-3 text-foreground">Project Not Found</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            The project you are looking for might have been moved or does not exist in our catalog.
          </p>
          <Button onClick={() => navigate("/projects")} className="bg-primary text-primary-foreground font-bold shadow-lg">
            <ArrowLeft className="mr-2" size={16} /> Back to All Projects
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const defaultImg = project.image || project1_img1;
  const images = project.images && project.images.length > 0 ? project.images : [defaultImg];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Project link copied to clipboard.",
    });
  };

  // Other related projects
  const relatedProjects = rawProjects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.location.includes(project.location.split(",")[0])))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 pb-20 px-4 md:px-6">
        <article className="max-w-6xl mx-auto space-y-10">
          {/* Breadcrumb & Navigation Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-border/40">
            <Button
              variant="ghost"
              onClick={() => navigate("/projects")}
              className="gap-2 text-muted-foreground hover:text-foreground text-sm pl-0"
            >
              <ArrowLeft size={16} /> Back to Projects Portfolio
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2 text-xs border-border/60"
              >
                <Share2 size={14} /> Share Project
              </Button>
              <Button
                size="sm"
                asChild
                className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                <a
                  href={`https://wa.me/9779857076965?text=Namaste!%20I%20am%20interested%20in%20learning%20more%20about%20your%20project:%20${encodeURIComponent(project.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={14} /> Inquire via WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Project Title Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {project.code && (
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-primary/10 text-primary border border-primary/30">
                  {project.code}
                </span>
              )}
              <Badge variant="outline" className="border-primary/50 text-primary font-semibold text-xs py-0.5">
                {project.category}
              </Badge>
              <Badge className={project.status === "Completed" ? "bg-emerald-500 text-slate-950 font-bold" : "bg-primary text-primary-foreground font-bold"}>
                {project.status}
              </Badge>
              {project.progress !== undefined && (
                <span className="text-xs text-muted-foreground font-semibold">
                  • {project.progress}% Complete
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5 text-foreground font-medium">
                <MapPin size={16} className="text-primary" />
                {project.location}
              </span>
              {project.client && (
                <span className="flex items-center gap-1.5">
                  <User size={16} className="text-primary" />
                  Client: {project.client}
                </span>
              )}
              {project.area && (
                <span className="flex items-center gap-1.5">
                  <Maximize2 size={16} className="text-primary" />
                  Built-up Area: {project.area}
                </span>
              )}
              {project.cost && (
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <DollarSign size={16} className="text-emerald-400" />
                  Estimated Budget: {project.cost}
                </span>
              )}
            </div>
          </div>

          {/* Hero Image & Full Gallery View */}
          <div className="space-y-4">
            <div className="relative aspect-video md:aspect-[21/9] w-full rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl">
              <LazyImage
                src={images[activeImageIndex] || defaultImg}
                alt={`${project.title} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white pointer-events-none">
                <span className="text-xs md:text-sm font-semibold bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                  Photo {activeImageIndex + 1} of {images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 sm:w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? "border-primary scale-105 shadow-md" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Overview & Key Specifications Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Full Detailed Description & Engineering Features */}
            <div className="lg:col-span-8 space-y-8">
              <Card className="glass border-white/10 shadow-xl p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-primary" />
                    Project Overview & Engineering Scope
                  </h2>
                  <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed text-base space-y-4">
                    <p className="text-base md:text-lg leading-relaxed">
                      {project.description}
                    </p>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      Executed according to the Nepal National Building Code (NBC 105:2020) and municipal guidelines for Butwal Sub-Metropolitan and Dang Valley regions. Structural framing uses ductile detailing with certified Fe 500D TMT reinforcement, M25 grade concrete mix, and specialized anti-termite plinth treatments.
                    </p>
                  </div>
                </div>

                {/* Progress Bar if Ongoing */}
                {project.status === "Ongoing" && project.progress !== undefined && (
                  <div className="p-5 rounded-2xl bg-primary/10 border border-primary/25 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-foreground">Construction Execution Progress</span>
                      <span className="text-primary font-bold">{project.progress}% Completed</span>
                    </div>
                    <Progress value={project.progress} className="h-3 bg-white/10" />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Active site operations supervised by our licensed resident civil engineer.
                    </p>
                  </div>
                )}

                {/* Key Technical Highlights */}
                <div className="pt-4 border-t border-border/40">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Key Architectural & Engineering Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs md:text-sm text-foreground/90">
                    {[
                      "NBC 105:2020 Earthquake Resistant Frame",
                      "Fe 500D High-Ductility TMT Rebar",
                      "M20/M25 Design Concrete Mix with Admixtures",
                      "DPC Plinth Waterproofing & Anti-Capillary Barrier",
                      "Concealed CPVC/PVC Plumbing & Modular Wiring",
                      "Vastu Shastra Optimized Floor Layout",
                      "Double-Glazed UPVC Windows for Thermal Comfort",
                      "Full Municipal Map Approval & Clearance (Naksha Pass)"
                    ].map((spec, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-black/20 border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Free Consultation CTA Card */}
              <Card className="glass border-primary/30 shadow-2xl p-6 md:p-8 bg-gradient-to-r from-primary/10 via-background to-amber-500/10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-foreground">
                      Planning a Similar Construction Project?
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Get a complimentary site visit, 2D/3D preliminary floor map, and itemized NPR cost estimate.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 shrink-0">
                    <Button asChild className="bg-primary text-primary-foreground font-bold shadow-lg">
                      <Link to="/estimate">Calculate Cost Estimate →</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-border">
                      <Link to="/contact">Book Consultation</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right 4 Cols: Project Metadata Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="glass border-white/10 shadow-xl p-6 space-y-6 sticky top-28">
                <h3 className="text-lg font-bold text-foreground pb-3 border-b border-border/40">
                  Project Details
                </h3>

                <div className="space-y-4 text-sm">
                  {project.code && (
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Layers size={14} className="text-primary" /> Project Code
                      </span>
                      <span className="font-mono font-bold text-foreground text-xs">{project.code}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <Building2 size={14} className="text-primary" /> Category
                    </span>
                    <span className="font-semibold text-foreground text-xs">{project.category}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <MapPin size={14} className="text-primary" /> Location
                    </span>
                    <span className="font-semibold text-foreground text-xs text-right max-w-[160px] truncate">{project.location}</span>
                  </div>

                  {project.client && (
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <User size={14} className="text-primary" /> Client
                      </span>
                      <span className="font-semibold text-foreground text-xs">{project.client}</span>
                    </div>
                  )}

                  {project.area && (
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Maximize2 size={14} className="text-primary" /> Plinth / Area
                      </span>
                      <span className="font-semibold text-foreground text-xs">{project.area}</span>
                    </div>
                  )}

                  {project.cost && (
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <DollarSign size={14} className="text-primary" /> Project Cost
                      </span>
                      <span className="font-bold text-emerald-400 text-xs">{project.cost}</span>
                    </div>
                  )}

                  {project.startDate && (
                    <div className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Calendar size={14} className="text-primary" /> Commencement
                      </span>
                      <span className="font-semibold text-foreground text-xs">{project.startDate}</span>
                    </div>
                  )}

                  {project.completionDate && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Clock size={14} className="text-primary" /> Handover
                      </span>
                      <span className="font-semibold text-foreground text-xs">{project.completionDate}</span>
                    </div>
                  )}
                </div>

                {/* Direct Contact Button */}
                <div className="pt-2">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md">
                    <a href="tel:+9779857076965" className="flex items-center justify-center gap-2">
                      <Phone size={15} /> Call Senior Engineer
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="pt-12 border-t border-border/50 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">More Projects</h2>
                  <p className="text-xs text-muted-foreground">Explore more ongoing and completed construction sites in Nepal.</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                  <Link to="/projects">View All <ChevronRight size={14} /></Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((relProj) => (
                  <Card
                    key={relProj.id}
                    className="glass overflow-hidden hover-lift group cursor-pointer border-border/60"
                    onClick={() => navigate(`/projects/${relProj.id}`)}
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <LazyImage
                        src={relProj.image || defaultImg}
                        alt={relProj.title}
                        className="transition-transform duration-500 group-hover:scale-105 w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground text-[10px] shadow-sm">
                          {relProj.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-xs text-primary font-medium">{relProj.category}</div>
                      <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {relProj.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <MapPin size={12} className="mr-1 text-primary" /> {relProj.location}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
