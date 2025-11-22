import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

const Projects = () => {
  const projects = [
    {
      title: "Modern Residential Complex",
      category: "Residential",
      location: "Butwal",
      year: "2024",
      description: "A state-of-the-art residential complex featuring modern amenities and sustainable design.",
      image: project1,
      status: "Completed"
    },
    {
      title: "Commercial Business Hub",
      category: "Commercial",
      location: "Butwal",
      year: "2024",
      description: "Contemporary commercial building with advanced infrastructure and eco-friendly features.",
      image: project2,
      status: "Completed"
    },
    {
      title: "Luxury Villa Development",
      category: "Residential",
      location: "Lumbini",
      year: "2023",
      description: "Premium villa complex with modern architecture and high-end finishes.",
      image: project1,
      status: "Completed"
    },
    {
      title: "Shopping Complex",
      category: "Commercial",
      location: "Siddharthanagar",
      year: "2023",
      description: "Multi-story shopping center with modern retail spaces and parking facilities.",
      image: project2,
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
              className="glass overflow-hidden hover-lift group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={project.image}
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
                
                <h3 className="text-2xl font-bold text-foreground mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">📍 {project.location}</p>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </Card>
          ))}
        </div>

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
