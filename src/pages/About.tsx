import { Card } from "@/components/ui/card";
import { Building2, Target, Eye, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building excellence, one project at a time
          </p>
        </div>

        {/* Company Overview */}
        <Card className="glass p-8 md:p-12 mb-12 animate-slide-up">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Our <span className="text-primary">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Quality First",
                description: "We never compromise on quality, using only the best materials and techniques"
              },
              {
                title: "Innovation",
                description: "Embracing modern technology and construction methods for better results"
              },
              {
                title: "Integrity",
                description: "Transparent communication and honest business practices in all our dealings"
              },
              {
                title: "Safety",
                description: "Maintaining the highest safety standards for our workers and clients"
              },
              {
                title: "Sustainability",
                description: "Environmentally responsible construction practices for a better future"
              },
              {
                title: "Customer Focus",
                description: "Dedicated to understanding and exceeding our clients' expectations"
              }
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
      </div>
    </div>
  );
};

export default About;
