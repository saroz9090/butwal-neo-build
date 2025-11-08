import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Shield, Users, Award, ArrowRight, MessageCircle, Handshake, BookOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-construction.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

const Home = () => {
  const features = [
    {
      icon: Building2,
      title: "Modern Construction",
      description: "State-of-the-art building techniques and materials",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Rigorous quality control at every stage",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced professionals dedicated to excellence",
    },
    {
      icon: Award,
      title: "Trusted Brand",
      description: "Years of proven track record in Nepal",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: "brightness(0.4)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Building the <span className="text-gradient">Future</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Modern construction solutions with trusted quality and innovative design
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
              onClick={() => window.open('https://wa.me/9779845323733?text=Hello! I am interested in your construction services.', '_blank')}
            >
              <MessageCircle className="mr-2" size={20} />
              Chat on WhatsApp
            </Button>
            <Link to="/estimate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-foreground glow">
                Get Estimate
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="glass border-primary/50 hover:bg-primary/10">
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-primary">Us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine modern technology with traditional craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass p-6 hover-lift hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="text-primary mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg">Our latest completed works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass overflow-hidden hover-lift group">
            <div className="relative h-64 overflow-hidden">
              <img
                src={project1}
                alt="Modern Residential Complex"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Modern Residential Complex</h3>
                <p className="text-muted-foreground">Contemporary living spaces</p>
              </div>
            </div>
          </Card>

          <Card className="glass overflow-hidden hover-lift group">
            <div className="relative h-64 overflow-hidden">
              <img
                src={project2}
                alt="Commercial Building"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">Commercial Hub</h3>
                <p className="text-muted-foreground">State-of-the-art business center</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/projects">
            <Button variant="outline" size="lg" className="glass border-primary/50 hover:bg-primary/10">
              View All Projects
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="text-primary">More</span>
          </h2>
          <p className="text-muted-foreground text-lg">Discover our partnerships, success stories, and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/partnerships">
            <Card className="glass p-8 hover-lift hover:border-primary/50 transition-all duration-300 h-full">
              <Handshake className="text-primary mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Partnerships</h3>
              <p className="text-muted-foreground mb-4">
                Explore our trusted collaborations with banks, hardware stores, and professional consultants
              </p>
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Learn More <ArrowRight className="ml-2" size={16} />
              </Button>
            </Card>
          </Link>

          <Link to="/testimonials">
            <Card className="glass p-8 hover-lift hover:border-primary/50 transition-all duration-300 h-full">
              <Star className="text-primary mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Testimonials</h3>
              <p className="text-muted-foreground mb-4">
                Read what our satisfied clients have to say about their construction experience
              </p>
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View Reviews <ArrowRight className="ml-2" size={16} />
              </Button>
            </Card>
          </Link>

          <Link to="/blog">
            <Card className="glass p-8 hover-lift hover:border-primary/50 transition-all duration-300 h-full">
              <BookOpen className="text-primary mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-3 text-foreground">Blog</h3>
              <p className="text-muted-foreground mb-4">
                Get insights, tips, and updates on construction trends and building regulations in Nepal
              </p>
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                Read Articles <ArrowRight className="ml-2" size={16} />
              </Button>
            </Card>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="glass p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your <span className="text-primary">Project?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Get a free estimate and let's build something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
              onClick={() => window.open('https://wa.me/9779845323733?text=Hello! I want to start a construction project.', '_blank')}
            >
              <MessageCircle className="mr-2" size={20} />
              WhatsApp Us
            </Button>
            <Link to="/estimate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-foreground glow">
                Calculate Estimate
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="glass border-primary/50">
                Contact Us
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;
