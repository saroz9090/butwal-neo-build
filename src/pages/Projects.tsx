import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/carousel"; // Shadcn Carousel Component
import { MessageCircle, MapPin, Calendar, Layers } from "lucide-react";

import project1_img1 from "@/assets/project-1.jpg";
import project1_img2 from "@/assets/project-2.jpg"; 
import project2_img1 from "@/assets/project-2.jpg";
import chaudhary1_img1 from "@/assets/chaudhary-1.jpeg"; // Chaudhary Residential Complex Image
import chaudhary1_img2 from "@/assets/chaudhary-2.jpeg"; // Chaudhary Residential Complex Image

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const projects = [
    {
      title: "Chaudhary Residential Complex",
      category: "Residential",
      location: "Butwal-11, Naharpur",
      year: "2025",
      description: "A state-of-the-art residential complex featuring modern amenities and sustainable design.",
      longDescription: "This premium residential project features eco-friendly construction materials, earthquake-resistant structure, spacious modern layouts, a community park, and 24/7 security services.",
      // यहाँ एउटा प्रोजेक्टका धेरै फोटोहरू एरेमा हाल्ने
      images: [chaudhary1_img1, chaudhary1_img2], 
      status: "Under Construction"
    },
 {
  "title": "Sharma Residence Project",
  "category": "Residential",
  "location": "Butwal-13, Jitgadi",
  "year": "2025",
  "description": "Modern 2.5-story residential house designed with a dual-purpose layout for rental income and premium owner living.",
  "longDescription": "A contemporary 2.5-story residential building located in Butwal-13, Jitgadi. The ground floor is thoughtfully engineered as a 2-family system dedicated entirely to rental purposes. The first floor and upper partial floor (second floor) serve as a spacious, modern private residence for the owner, seamlessly blending functional utility with modern aesthetics.",
  "images": [project2_img1, project1_img1],
  "status": "Under Construction"
},
{
  "title": "Pokhrel Residence",
  "category": "Residential",
  "location": "Butwal, Padampur",
  "year": "2026",
  "description": "Modern 1-story box-type residential house featuring a sleek, minimalist architectural design.",
  "longDescription": "A premium single-story private residence located in Padampur, Butwal. Designed with a contemporary box-type architectural concept, this home maximizes spatial efficiency and clean structural lines. It features modern high-end finishes, open-plan living areas, and a minimalist aesthetic tailored for a sophisticated urban lifestyle.",
  "images": [project1_img1, project2_img1],
  "status": "Completed"
},
{
  "title": "Poudel Residence",
  "category": "Commercial & Residential",
  "location": "Tilottama, Dinganagar",
  "year": "2026",
  "description": "Smartly engineered 2-story commercial and residential mixed-use building optimized for a compact footprint.",
  "longDescription": "A modern 2-story mixed-use building located in Dinganagar, Tilottama. Designed with high structural efficiency within a compact 700 sq. ft. area, this project maximizes space without compromising on aesthetic appeal. The ground floor features a functional commercial layout for rental or business use, while the first floor comprises a comfortable, modern private residence for the owner.",
  "images": [project2_img1, project1_img1],
  "status": "Under Construction"
},
{
  "title": "Pandey Residence",
  "category": "Residential",
  "location": "Ghodha",
  "year": "2024",
  "description": "An elite 1.5-story box-type modern residence, standing out as the benchmark for premium architecture in the area.",
  "longDescription": "A flagship 1.5-story private residence located in Ghodha. Featuring a bold and sophisticated contemporary box-type design, this property stands as the most premium and visually stunning landmark within the entire neighborhood. Built with first-class craftsmanship and elite modern aesthetics, it seamlessly blends structural innovation with high-end luxury to deliver an unmatched standard of living.",
  "images": [project1_img1, project2_img1],
  "status": "Completed"
},
{
  "title": "Bhujel Residence",
  "category": "Residential",
  "location": "Tilottama-11, Madrani",
  "year": "2024",
  "description": "An exquisite 1.5-story premium residence, standing out as one of the finest modern homes in the region.",
  "longDescription": "A standout 1.5-story private residence located in Tilottama-11, Madrani, meticulously engineered to deliver premium luxury. Widely recognized as one of the best modern houses in the locality, this home features high-end architectural finishes, a sophisticated contemporary layout, and superior craftsmanship. It seamlessly blends structural innovation with elite aesthetics to create a landmark of modern residential elegance.",
  "images": [project2_img1, project1_img1],
  "status": "Completed"
},
{
  "title": "Amarpath Commercial Project",
  "category": "Commercial & Residential",
  "location": "Butwal-4, Amarpath",
  "year": "2025",
  "description": "A striking 4-story semi-commercial landmark combining premium retail spaces with luxury urban living.",
  "longDescription": "A flagship 4-story semi-commercial building situated in the bustling heart of Butwal-4, Amarpath. The project features full 3D architectural modeling and smart space-planning. The lower two floors are highly optimized with versatile, high-visibility commercial layouts designed for retail or corporate use. The top two floors transition into a spacious, premium private residence, perfectly balancing active commercial utility with peaceful residential luxury.",
  "images": [project1_img1, project2_img1],
  "status": "Completed"
},
{
  "title": "Chandrauta Commercial Center",
  "category": "Commercial",
  "location": "Chandrauta, Kapilvastu",
  "year": "2026",
  "description": "Smartly planned multi-story small shopping center optimized for high retail footfall and maximum commercial viability.",
  "longDescription": "A meticulous engineering project featuring complete site survey parameters and optimized floor layout frameworks designed for a small-scale modern shopping center in Chandrauta. The structure features a high-visibility ground floor retail zone with a dedicated front parking grid, multiple flexible-size modular shops separated by an open walkway, and integrated infrastructure blueprints for premium top-floor commercial outlets or service units.",
  "images": [project1_img1, project2_img1],
  "status": "In Progress"
},
{
  "title": "Kunwar Residence",
  "category": "Residential",
  "location": "Siddharthanagar, Goligadh",
  "year": "2026",
  "description": "A premium contemporary residential project currently undergoing advanced design verification and structural construction.",
  "longDescription": "A modern private residence located in the growing community of Goligadh, Siddharthanagar. The project is currently active, seamlessly transitioning from detailed architectural 3D modeling and space planning into the structural construction phase. It is being built with high-end modern aesthetics, rigorous engineering standards, and optimized spatial layouts tailored for elite family living.",
  "images": [project1_img1, project2_img1],
  "status": "In Progress"
},
    {
      title: "Shopping Complex",
      category: "Commercial",
      location: "Siddharthanagar",
      year: "2023",
      description: "Multi-story shopping center with modern retail spaces and parking facilities.",
      longDescription: "Designed to elevate the shopping experience in Siddharthanagar, this complex features spacious walkways, central air conditioning, and a dedicated food court zone.",
      images: [project2_img1, project1_img1],
      status: "Completed"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing excellence in construction across Nepal
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="glass overflow-hidden hover-lift group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* बाहिर Grid मा पनि इमेज रेसियो १६:९ (aspect-video) बनाइएको छ */}
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={project.images[0]} // पहिलो इमेज कभरको रूपमा देखिनेछ
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-foreground">{project.status}</Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {project.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{project.year}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">📍 {project.location}</p>
                <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                
                <span className="text-sm font-semibold text-primary mt-4 inline-block hover:underline">
                  View Details & Gallery →
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Details Popup (Dialog with Carousel) */}
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="sm:max-w-[650px] glass overflow-hidden">
            {selectedProject && (
              <>
                {/* Image Slider - Image Ratio 16:9 (aspect-video) */}
                <div className="relative w-full mb-6 px-10"> {/* साइड Arrow को लागि हल्का प्याडिङ */}
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedProject.images.map((imgUrl: string, idx: number) => (
                        <CarouselItem key={idx}>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10">
                            <img 
                              src={imgUrl} 
                              alt={`${selectedProject.title} - view ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* इमेज धेरै भएमा मात्र अगाडि/पछाडि सार्ने बटनहरू देखाउने */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <CarouselPrevious className="-left-2" />
                        <CarouselNext className="-right-2" />
                      </>
                    )}
                  </Carousel>
                  <Badge className="absolute top-2 right-12 bg-primary text-foreground z-10">
                    {selectedProject.status}
                  </Badge>
                </div>
                
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-foreground mb-2">
                    {selectedProject.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm flex flex-wrap gap-4 text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Layers size={16} className="text-primary" /> {selectedProject.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={16} className="text-primary" /> {selectedProject.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} className="text-primary" /> {selectedProject.year}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedProject(null)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    onClick={() => window.open(`https://wa.me/9779763653181?text=Hello! I am interested in knowing more about the ${selectedProject.title} project.`, '_blank')}
                  >
                    <MessageCircle className="mr-2" size={18} />
                    Inquire About This
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Call to Action */}
        <Card className="glass p-8 md:p-12 mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to See Your Project Here?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss your construction needs and bring your vision to life
          </p>
          <Button 
            size="lg" 
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            onClick={() => window.open('https://wa.me/9779763653181?text=Hello! I am interested in starting a construction project.', '_blank')}
          >
            <MessageCircle className="mr-2" size={20} />
            Start Your Project
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Projects;