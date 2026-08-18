import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Share2, Eye, TrendingUp, ZoomIn, Building2, Filter, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWebsiteContent, HouseDesign } from "@/contexts/WebsiteContentContext";
import LazyImage from "@/components/LazyImage";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCard 
} from "@/components/AnimatedSection";

export const HouseDesignsGallery = () => {
  const { designs: baseDesigns } = useWebsiteContent();
  const [searchTerm, setSearchTerm] = useState("");
  const [storeyFilter, setStoreyFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [selectedDesign, setSelectedDesign] = useState<HouseDesign | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const UPDATE_INTERVAL = 2 * 60 * 1000;
  const MAX_TRENDING_DESIGNS = 2;

  const getSeededRandom = (seed: string, timeSlot: number): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    const combinedSeed = (hash + timeSlot) % 1000;
    return (Math.sin(combinedSeed) * 10000) % 1;
  };

  const calculateCurrentViews = (design: HouseDesign): number => {
    const baseViews = design.baseViews || 150;
    const growthRate = design.growthRate || 1.2;
    const timeSlot = Math.floor(currentTime / UPDATE_INTERVAL);
    const randomFactor = Math.abs(getSeededRandom(design.id, timeSlot));
    const baseTime = 1770000000000;
    const hoursElapsed = Math.max(0, (currentTime - baseTime) / (3600 * 1000));
    return Math.floor(baseViews + (hoursElapsed * growthRate) + (randomFactor * 25));
  };

  const designs = useMemo(() => {
    return baseDesigns.map(design => ({
      ...design,
      currentViews: calculateCurrentViews(design)
    }));
  }, [baseDesigns, currentTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const trendingDesigns = useMemo(() => {
    const sorted = [...designs].sort((a, b) => (b.currentViews || 0) - (a.currentViews || 0));
    return sorted.slice(0, MAX_TRENDING_DESIGNS);
  }, [designs]);

  const isTrending = (designId: string) => {
    return trendingDesigns.some(design => design.id === designId);
  };

  const filteredDesigns = useMemo(() => {
    return designs.filter(design => {
      // Search
      const matchesSearch = 
        design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        design.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));

      // Storey
      let matchesStorey = true;
      if (storeyFilter !== "all") {
        const textToMatch = `${design.title} ${design.description} ${design.tags.join(" ")}`.toLowerCase();
        if (storeyFilter === "1") matchesStorey = textToMatch.includes("1 storey") || textToMatch.includes("single storey") || textToMatch.includes("1.5");
        if (storeyFilter === "2") matchesStorey = textToMatch.includes("2 storey") || textToMatch.includes("double storey");
        if (storeyFilter === "2.5") matchesStorey = textToMatch.includes("2.5 storey") || textToMatch.includes("2.5");
        if (storeyFilter === "3") matchesStorey = textToMatch.includes("3 storey") || textToMatch.includes("triple");
      }

      // Style
      let matchesStyle = true;
      if (styleFilter !== "all") {
        matchesStyle = design.style.toLowerCase().includes(styleFilter.toLowerCase()) ||
                       design.tags.some(t => t.toLowerCase().includes(styleFilter.toLowerCase()));
      }

      return matchesSearch && matchesStorey && matchesStyle;
    });
  }, [searchTerm, storeyFilter, styleFilter, designs]);

  const shareOnWhatsApp = (design: HouseDesign, imageIndex: number = 0) => {
    const currentImageUrl = design.images[imageIndex];
    const fullImageUrl = `${window.location.origin}${currentImageUrl}`;
    
    const message = `${design.title}\n\n${design.description}\n\nKey Features:\n${design.features.map(feature => `- ${feature}`).join('\n')}\n\nInterested in this design? Contact Butwal Construction & Builders (Dang & Butwal Branch) for consultation!\n\nLink: ${fullImageUrl}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const consultForDesign = (design: HouseDesign) => {
    const message = `Namaste! I am interested in building the "${design.title}" (${design.style}) design. Please share floor plans and estimation for Dang / Butwal.`;
    window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(message)}`, '_blank');
  };

  const nextImage = () => {
    if (selectedDesign) {
      setCurrentImageIndex((prev) => 
        prev === selectedDesign.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedDesign) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedDesign.images.length - 1 : prev - 1
      );
    }
  };

  const openDesign = (design: HouseDesign) => {
    setSelectedDesign(design);
    setCurrentImageIndex(0);
    setIsZoomed(false);
  };

  const formatViews = (views?: number): string => {
    if (!views) return "0";
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Architectural Elevations & Floor Plans</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight font-heading mb-4">
            3D House Designs <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore contemporary Box-Type, Modern Minimalist, and Classical Nepali house designs customized for land plots in Dang (Ghorahi, Tulsipur, Lamahi) and Butwal, Rupandehi.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-10 p-4 rounded-2xl glass border border-border/60 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by style, keywords, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>

            {/* Storey Selection Tabs */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {[
                { id: "all", label: "All Storeys" },
                { id: "1", label: "1 Storey" },
                { id: "2", label: "2 Storey" },
                { id: "2.5", label: "2.5 Storey" },
                { id: "3", label: "3 Storey" }
              ].map((st) => (
                <Button
                  key={st.id}
                  size="sm"
                  variant={storeyFilter === st.id ? "default" : "outline"}
                  onClick={() => setStoreyFilter(st.id)}
                  className={`text-xs ${storeyFilter === st.id ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"}`}
                >
                  {st.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Style Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-medium mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Architectural Styles:
            </span>
            {["all", "Modern", "Box", "Contemporary", "Classical", "Villa"].map((style) => (
              <Badge
                key={style}
                variant={styleFilter === style ? "default" : "outline"}
                className={`cursor-pointer capitalize ${styleFilter === style ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"}`}
                onClick={() => setStyleFilter(style)}
              >
                {style === "all" ? "All Styles" : style}
              </Badge>
            ))}
            {(searchTerm || storeyFilter !== "all" || styleFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStoreyFilter("all");
                  setStyleFilter("all");
                }}
                className="text-xs text-primary font-semibold hover:underline ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Designs Grid */}
        {filteredDesigns.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl p-8">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-bold text-foreground">No house designs found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try selecting different storey filters or clear your search term.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design) => (
              <StaggerItem key={design.id}>
                <AnimatedCard>
                  <Card 
                    className="glass-ios-card hover-lift cursor-pointer overflow-hidden relative flex flex-col justify-between border-border/60 group h-full"
                    onClick={() => openDesign(design)}
                  >
                    <div>
                      {/* Popular Badge */}
                      {isTrending(design.id) && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                            <TrendingUp className="h-3 w-3" />
                            POPULAR CHOICE
                          </span>
                        </div>
                      )}
                      
                      <div className="aspect-video relative overflow-hidden bg-muted/20">
                        <LazyImage 
                          src={design.images[0]} 
                          alt={design.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-mono flex items-center gap-1">
                            <Eye className="h-3 w-3 text-primary" />
                            {formatViews(design.currentViews)}
                          </span>
                        </div>
                        <Badge className="absolute bottom-2 left-2 bg-primary/95 text-primary-foreground font-semibold text-xs border-none">
                          {design.style}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">{design.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{design.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {design.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[11px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    {/* Card Action */}
                    <div className="p-5 pt-0 border-t border-border/40 mt-2 flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm hover:scale-[1.02] transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          consultForDesign(design);
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Want This Design? Get Consultation
                      </Button>
                    </div>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Custom Design Callout Banner */}
        <AnimatedSection direction="zoom" className="mt-16">
          <div className="p-8 sm:p-12 rounded-3xl glass border border-primary/30 text-center relative overflow-hidden bg-gradient-to-br from-card via-primary/5 to-purple-500/10 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
              Need a Custom Architectural Design for Your Land?
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-6">
              Our Senior Architects in Dang and Butwal will visit your plot, analyze orientation and Vastu, and develop photorealistic 3D drawings tailored to your exact plot dimensions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold hover:scale-105 transition-all">
                <Link to="/contact">Book Architectural Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 hover:scale-105 transition-all">
                <Link to="/estimate">Calculate Construction Cost</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Design Detail Modal */}
        <Dialog open={!!selectedDesign} onOpenChange={() => setSelectedDesign(null)}>
          <DialogContent className={`glass max-w-4xl max-h-[90vh] overflow-y-auto ${isZoomed ? 'max-w-6xl' : ''}`}>
            {selectedDesign && (
              <div className="space-y-6">
                <DialogHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <Badge className="bg-primary text-primary-foreground">{selectedDesign.style}</Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      <span>{formatViews(selectedDesign.currentViews)} views</span>
                    </div>
                  </div>
                  <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                    {selectedDesign.title}
                  </DialogTitle>
                </DialogHeader>

                {/* Image Gallery Viewer */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-border/50">
                  <LazyImage 
                    src={selectedDesign.images[currentImageIndex]} 
                    alt={selectedDesign.title}
                    className="w-full h-full object-contain"
                  />
                  {selectedDesign.images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-mono">
                        {currentImageIndex + 1} / {selectedDesign.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Description & Features */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">Overview</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedDesign.description}</p>
                  </div>

                  {selectedDesign.features && selectedDesign.features.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Key Specifications</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedDesign.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-card/60 border border-border/40">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md"
                    onClick={() => consultForDesign(selectedDesign)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Request Custom Floor Plan for this Design
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => shareOnWhatsApp(selectedDesign, currentImageIndex)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HouseDesignsGallery;
