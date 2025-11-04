import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Target, Eye, Award, Home, Building, Hammer, Ruler, Cog, ClipboardCheck, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AboutServices = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Construction",
      description: "Complete home building services from foundation to finishing, including custom homes, villas, and apartment complexes.",
      features: ["Custom Home Design", "Apartment Buildings", "Villa Construction", "Interior Finishing"]
    },
    {
      icon: Building,
      title: "Commercial Construction",
      description: "Professional commercial building services for offices, retail spaces, and mixed-use developments.",
      features: ["Office Buildings", "Retail Spaces", "Shopping Centers", "Industrial Facilities"]
    },
    {
      icon: Hammer,
      title: "Renovation & Remodeling",
      description: "Transform existing structures with our expert renovation and remodeling services.",
      features: ["Building Renovation", "Interior Remodeling", "Facade Upgrades", "Space Optimization"]
    },
    {
      icon: Ruler,
      title: "Architectural Design",
      description: "Creative and functional architectural designs tailored to your needs and preferences.",
      features: ["Concept Development", "3D Visualization", "Structural Planning", "Permit Assistance"]
    },
    {
      icon: Cog,
      title: "Project Management",
      description: "Comprehensive project management ensuring timely completion within budget.",
      features: ["Planning & Scheduling", "Budget Management", "Quality Control", "Progress Monitoring"]
    },
    {
      icon: ClipboardCheck,
      title: "Consultation Services",
      description: "Expert consultation for construction planning, material selection, and cost estimation.",
      features: ["Cost Estimation", "Material Selection", "Technical Advice", "Feasibility Studies"]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Us & <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building excellence with comprehensive construction solutions
          </p>
        </div>

        {/* Tabs for About and Services */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="about">About Us</TabsTrigger>
            <TabsTrigger value="services">Our Services</TabsTrigger>
          </TabsList>

          {/* About Content */}
          <TabsContent value="about" className="space-y-12">
            {/* Company Overview */}
            <Card className="glass p-8 md:p-12 animate-slide-up">
              <div className="flex items-start space-x-4 mb-6">
                <Building2 className="text-primary flex-shrink-0" size={40} />
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Butwal Construction and Builders</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    A sister company of Satyawati Devi Hardware, we bring decades of experience in the construction 
                    industry combined with modern innovation and technology. Our commitment to excellence has made us 
                    one of the most trusted construction companies in Nepal.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We specialize in residential, commercial, and industrial construction projects, offering comprehensive 
                    solutions from design to completion. Our team of experienced engineers, architects, and craftsmen work 
                    together to deliver projects that exceed expectations.
                  </p>
                </div>
              </div>
            </Card>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass p-8 hover-lift">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="text-primary" size={32} />
                  <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To deliver exceptional construction services that combine quality, innovation, and sustainability. 
                  We strive to build lasting relationships with our clients by consistently exceeding their expectations 
                  and contributing to the development of Nepal's infrastructure.
                </p>
              </Card>

              <Card className="glass p-8 hover-lift">
                <div className="flex items-center space-x-3 mb-6">
                  <Eye className="text-primary" size={32} />
                  <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be the leading construction company in Nepal, recognized for our commitment to quality, innovation, 
                  and customer satisfaction. We envision a future where our projects set new standards in construction 
                  excellence and contribute to building a modern Nepal.
                </p>
              </Card>
            </div>

            {/* Values */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">
                Our <span className="text-primary">Values</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Quality First", description: "We never compromise on quality, using only the best materials and techniques" },
                  { title: "Innovation", description: "Embracing modern technology and construction methods for better results" },
                  { title: "Integrity", description: "Transparent communication and honest business practices in all our dealings" },
                  { title: "Safety", description: "Maintaining the highest safety standards for our workers and clients" },
                  { title: "Sustainability", description: "Environmentally responsible construction practices for a better future" },
                  { title: "Customer Focus", description: "Dedicated to understanding and exceeding our clients' expectations" }
                ].map((value, index) => (
                  <Card key={index} className="glass p-6 hover-lift">
                    <Award className="text-primary mb-3" size={28} />
                    <h4 className="text-xl font-semibold mb-2 text-foreground">{value.title}</h4>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats */}
            <Card className="glass p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: "500+", label: "Projects Completed" },
                  { number: "15+", label: "Years Experience" },
                  { number: "200+", label: "Happy Clients" },
                  { number: "50+", label: "Expert Team" }
                ].map((stat, index) => (
                  <div key={index} className="animate-counter">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Services Content */}
          <TabsContent value="services" className="space-y-12">
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className="glass p-6 hover-lift group transition-all duration-300 hover:border-primary/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="text-primary" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-primary mb-2">Key Features:</div>
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Process Section */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-12">
                Our <span className="text-primary">Process</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Consultation", description: "Initial meeting to understand your requirements" },
                  { step: "02", title: "Planning", description: "Detailed project planning and design development" },
                  { step: "03", title: "Execution", description: "Professional construction with quality control" },
                  { step: "04", title: "Delivery", description: "Final inspection and project handover" }
                ].map((phase, index) => (
                  <Card key={index} className="glass p-6 text-center hover-lift">
                    <div className="text-4xl font-bold text-primary mb-3">{phase.step}</div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">{phase.title}</h4>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Card className="glass p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Every project is unique. Let's discuss your specific requirements and create a tailored solution.
              </p>
              <Button 
                size="lg" 
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                onClick={() => window.open('https://wa.me/9779845323733?text=Hello! I need a custom construction solution.', '_blank')}
              >
                <MessageCircle className="mr-2" size={20} />
                Discuss on WhatsApp
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AboutServices;
