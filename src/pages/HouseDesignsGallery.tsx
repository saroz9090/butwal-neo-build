import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Share2, Eye, TrendingUp, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HouseDesign {
  id: string;
  title: string;
  style: string;
  description: string;
  images: string[];
  tags: string[];
  features: string[];
  baseViews: number;
  growthRate: number;
  currentViews?: number;
}

const HouseDesignsGallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<HouseDesign | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const UPDATE_INTERVAL = 2 * 60 * 1000; // Update every 2 minutes
  const MAX_TRENDING_DESIGNS = 2;

  // Generate seeded random number based on design ID and time
  const getSeededRandom = (seed: string, timeSlot: number): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    const combinedSeed = (hash + timeSlot) % 1000;
    return (Math.sin(combinedSeed) * 10000) % 1;
  };

  // Base designs data with fixed properties
  const baseDesigns: HouseDesign[] = [
    {
      id: "1",
      title: "Neoclassical Villa",
      style: "Neoclassical",
      description: "Elegant neoclassical villa with symmetrical design, grand columns, and classical details. Perfect for modern luxury living.",
      images: [
        "/designs/neo1.jpg",
        "/designs/neo2.jpg", 
        "/designs/neo3.jpg",
        "/designs/neo4.jpg"
      ],
      tags: ["neoclassical", "villa", "luxury", "classical", "columns"],
      features: ["Grand Entrance", "Symmetrical Design", "Classical Columns", "Luxury Finishes"],
      baseViews: 150,
      growthRate: 0.0002 // Much smaller growth rate
    },
    {
      id: "2",
      title: "Modern Minimalist House",
      style: "Modern",
      description: "Clean lines and minimalist design with focus on functionality and natural light.",
      images: Array(4).fill("/placeholder.svg"),
      tags: ["modern", "minimalist", "contemporary", "clean"],
      features: ["Open Floor Plan", "Large Windows", "Minimalist Design"],
      baseViews: 120,
      growthRate: 0.0001
    },
    {
      id: "3",
      title: "Traditional Nepali House",
      style: "Traditional",
      description: "Authentic Nepali architecture with wooden carvings and traditional elements.",
      images: Array(6).fill("/placeholder.svg"),
      tags: ["traditional", "nepali", "wooden", "cultural"],
      features: ["Wooden Carvings", "Traditional Roof", "Cultural Elements"],
      baseViews: 80,
      growthRate: 0.0003
    },
    {
      id: "4",
      title: "Contemporary Bungalow", 
      style: "Contemporary",
      description: "Modern bungalow design with spacious interiors and elegant exteriors.",
      images: Array(5).fill("/placeholder.svg"),
      tags: ["contemporary", "bungalow", "modern", "spacious"],
      features: ["Spacious Interiors", "Modern Kitchen", "Elegant Exteriors"],
      baseViews: 95,
      growthRate: 0.00015
    },
    {
      id: "5",
      title: "Luxury Mountain Retreat",
      style: "Modern",
      description: "Stunning mountain retreat with panoramic views and luxury amenities.",
      images: Array(6).fill("/placeholder.svg"),
      tags: ["luxury", "mountain", "retreat", "panoramic"],
      features: ["Panoramic Views", "Luxury Amenities", "Mountain Design"],
      baseViews: 200,
      growthRate: 0.00025
    },
    {
      id: "6",
      title: "Compact Urban Home",
      style: "Contemporary",
      description: "Smart space utilization for urban living with modern comforts.",
      images: Array(3).fill("/placeholder.svg"),
      tags: ["compact", "urban", "smart", "efficient"],
      features: ["Space Efficient", "Modern Design", "Urban Living"],
      baseViews: 60,
      growthRate: 0.00008
    }
  ];

  // Calculate current views based on time and growth rate - FIXED
  const calculateCurrentViews = (design: HouseDesign): number => {
    const hoursSinceStart = (currentTime - 1700000000000) / (1000 * 60 * 60); // Time since a fixed date
    const timeSlots = Math.floor(hoursSinceStart * 2); // 2 updates per hour
    
    const randomFactor = 0.8 + getSeededRandom(design.id, timeSlots) * 0.4;
    
    // Linear growth instead of exponential to prevent infinity
    const additionalViews = Math.floor(design.baseViews * design.growthRate * timeSlots);
    const views = design.baseViews + additionalViews;
    
    // Apply random factor and ensure minimum views
    const finalViews = Math.floor(views * randomFactor);
    return Math.max(design.baseViews, finalViews);
  };

  // Get designs with current views
  const designs = useMemo(() => {
    return baseDesigns.map(design => ({
      ...design,
      currentViews: calculateCurrentViews(design)
    }));
  }, [currentTime]);

  // Update time periodically to simulate view growth
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Get top 2 trending designs
  const trendingDesigns = useMemo(() => {
    const sorted = [...designs].sort((a, b) => b.currentViews - a.currentViews);
    return sorted.slice(0, MAX_TRENDING_DESIGNS);
  }, [designs]);

  const isTrending = (designId: string) => {
    return trendingDesigns.some(design => design.id === designId);
  };

  const filteredDesigns = useMemo(() => {
    return designs.filter(design =>
      design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      design.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, designs]);

  const shareOnWhatsApp = (design: HouseDesign, imageIndex: number = 0) => {
    const currentImageUrl = design.images[imageIndex];
    const fullImageUrl = `${window.location.origin}${currentImageUrl}`;
    
    const message = `🏠 *${design.title}*\n\n${design.description}\n\n⭐ *Key Features:*\n${design.features.map(feature => `• ${feature}`).join('\n')}\n\n👁️ ${formatViews(design.currentViews)} people have viewed this design!\n\n📸 View this design: ${fullImageUrl}\n\nInterested in this design? Contact us for more details! 🏡`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const sortedDesigns = useMemo(() => {
    return [...filteredDesigns].sort((a, b) => b.currentViews - a.currentViews);
  }, [filteredDesigns]);

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">
              House Designs Gallery
            </h1>
            <p className="text-muted-foreground text-lg">
            </p>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <div className="max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by style, features, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span>Updates every 2min</span>
            </div>
          </div>

          {/* Designs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDesigns.map((design) => (
              <Card 
                key={design.id} 
                className="glass hover-lift cursor-pointer overflow-hidden relative"
                onClick={() => openDesign(design)}
              >
                {/* Popular Badge - Only show for top 2 */}
                {isTrending(design.id) && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      TRENDING #{trendingDesigns.findIndex(d => d.id === design.id) + 1}
                    </span>
                  </div>
                )}
                
                <div className="aspect-video relative bg-muted/20">
                  <img 
                    src={design.images[0]} 
                    alt={design.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      {formatViews(design.currentViews)}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{design.title}</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareOnWhatsApp(design, 0);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{design.style}</p>
                  <p className="text-sm line-clamp-2">{design.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {design.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag}
                        className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {sortedDesigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No designs found matching your search. Try different keywords.
              </p>
            </div>
          )}

          {/* Design Detail Modal */}
          <Dialog open={!!selectedDesign} onOpenChange={() => setSelectedDesign(null)}>
            <DialogContent className={`glass border-0 ${isZoomed ? 'max-w-full h-full' : 'max-w-4xl'}`}>
              {selectedDesign && (
                <>
                  <DialogHeader>
                    <div className="flex justify-between items-start">
                      <DialogTitle className="text-2xl">{selectedDesign.title}</DialogTitle>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{formatViews(selectedDesign.currentViews)} views</span>
                        {isTrending(selectedDesign.id) && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                            TRENDING #{trendingDesigns.findIndex(d => d.id === selectedDesign.id) + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  </DialogHeader>
                  
                  {/* Image Carousel */}
                  <div className={`relative bg-muted/20 rounded-lg ${isZoomed ? 'h-[80vh]' : 'aspect-video mb-4'}`}>
                    <img
                      src={selectedDesign.images[currentImageIndex]}
                      alt={`${selectedDesign.title} - View ${currentImageIndex + 1}`}
                      className={`w-full h-full object-contain rounded-lg cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}`}
                      onClick={toggleZoom}
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedDesign.images.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 glass"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 glass"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* Zoom Button */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 glass"
                      onClick={toggleZoom}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 glass px-3 py-1 rounded-full">
                      <span className="text-sm">
                        {currentImageIndex + 1} / {selectedDesign.images.length}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {selectedDesign.images.length > 1 && !isZoomed && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedDesign.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-20 h-12 object-cover rounded cursor-pointer border-2 ${
                            index === currentImageIndex ? 'border-accent' : 'border-transparent'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Design Info - Hide when zoomed */}
                  {!isZoomed && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">{selectedDesign.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Style</h4>
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                          {selectedDesign.style}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Key Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDesign.features.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* WhatsApp Share Button */}
                      <Button 
                        className="w-full gradient-primary hover:opacity-90"
                        onClick={() => shareOnWhatsApp(selectedDesign, currentImageIndex)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share this Design on WhatsApp
                      </Button>
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default HouseDesignsGallery;