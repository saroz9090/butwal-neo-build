import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  MessageCircle, 
  Star, 
  Calculator, 
  CheckCircle2, 
  MapPin, 
  Ruler, 
  FileText, 
  Hammer, 
  ClipboardCheck, 
  Sparkles, 
  Phone,
  Layers,
  ChevronRight,
  TrendingUp,
  Layout,
  FileCheck,
  Compass,
  Users,
  Handshake,
  BookOpen,
  Eye,
  Package,
  Wrench,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useWebsiteContent, INITIAL_PROJECTS } from "@/contexts/WebsiteContentContext";
import LazyImage from "@/components/LazyImage";
import heroImage from "@/assets/hero-construction.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import { 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCounter, 
  AnimatedCard 
} from "@/components/AnimatedSection";

export const Home = () => {
  const { settings, projects: dynamicProjects, designs, blogPosts } = useWebsiteContent();

  const sourceProjects = dynamicProjects.length > 0 ? dynamicProjects : INITIAL_PROJECTS;
  const featuredProjects = sourceProjects.slice(0, 4);

  const coreServices = [
    {
      icon: Building2,
      title: "House Construction (Turnkey)",
      desc: "End-to-end residential construction with 100% NBC 105:2020 seismic engineering and milestone billing.",
      link: "/services#house-construction"
    },
    {
      icon: Layers,
      title: "Commercial Buildings",
      desc: "Multi-storey commercial complexes, shopping arcades, and hotels built with high-grade RCC frameworks.",
      link: "/services#commercial-construction"
    },
    {
      icon: Ruler,
      title: "3D House Design & Planning",
      desc: "Modern Box-type, Contemporary, and Vastu-compliant architectural drawings and photorealistic 3D renders.",
      link: "/services#house-design-planning"
    },
    {
      icon: Calculator,
      title: "Estimate & Detailed BOQ",
      desc: "Accurate Bill of Quantities, material breakdown (cement, TMT steel rods), and transparent rate analysis.",
      link: "/estimate"
    },
    {
      icon: Hammer,
      title: "Renovation & Remodeling",
      desc: "Structural strengthening, additional floor additions, facade modernization, and interior upgrades.",
      link: "/services#renovation-remodeling"
    },
    {
      icon: ClipboardCheck,
      title: "Construction Supervision",
      desc: "Certified civil engineering site quality audits, slump tests, and independent material verification.",
      link: "/services#construction-supervision"
    }
  ];

  const processSteps = [
    { step: "01", title: "Consultation & Soil Test", desc: "Site visit in Butwal or Dang to assess plot stability and architectural requirements." },
    { step: "02", title: "3D Design & Naksa Pass", desc: "Photorealistic 3D elevation + municipal building permit approval from local sub-metropolis." },
    { step: "03", title: "Structural RCC & Masonry", desc: "Engineered foundation, Fe 500D rebar binding, OPC 53-grade concrete, and quality brickwork." },
    { step: "04", title: "Finishing & MEP", desc: "Sanitary fittings, modular electrical wiring, premium tiling, and weatherproof painting." },
    { step: "05", title: "Quality Audit & Handover", desc: "Final engineering inspection, defect warranty, and official Nirman Sampanna certificate." }
  ];

  const testimonials = [
    {
      name: "Er. Ramesh Shrestha",
      role: "Homeowner, Ghorahi-15, Dang",
      text: "Building our dream house while living in Kathmandu was completely stress-free with Dang Construction. Daily photo updates, honest BOQ pricing, and zero material wastage. Highly recommended!",
      rating: 5
    },
    {
      name: "Dr. Bimal Karki",
      role: "Commercial Complex Owner, Butwal-11",
      text: "Butwal Construction & Builders managed our 4-storey commercial plaza with absolute precision. Their structural engineering adherence to earthquake codes gave us total confidence.",
      rating: 5
    },
    {
      name: "Sita Sharma",
      role: "Residential Villa, Tulsipur, Dang",
      text: "The 3D design team delivered exactly what we envisioned. The modern box-type elevation has become a landmark in our neighborhood. Outstanding craftsmanship and on-time handover.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Ambient Background Mesh with subtle parallax drift */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/10 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[145px] liquid-orb-1 animate-pulse" />
        <div className="absolute top-3/4 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      {/* 1. Hero Section with staggered entrance */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: "brightness(0.35)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          {/* Trust/Location line */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ios-pill border-primary/40 text-primary-foreground text-xs sm:text-sm font-semibold mb-6 shadow-lg"
          >
            <MapPin className="w-4 h-4 text-primary animate-bounce" />
            <span>Head Office: Butwal • Regional Branch: Dang (Ghorahi | Tulsipur | Lamahi)</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-tight mb-6"
          >
            Professional Construction Services in <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-amber-300 font-black drop-shadow-md">
              Butwal & Dang
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            From turnkey house construction and 3D architectural planning to complete municipal approvals, <strong>Butwal Construction & Builders</strong> delivers certified earthquake-resistant excellence across Western Nepal.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base px-6 shadow-xl glow hover:scale-105 transition-all">
              <Link to="/estimate">
                <Calculator className="mr-2 h-5 w-5" />
                Get Construction Estimate
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-[#25D366]/20 border-[#25D366]/60 text-white hover:bg-[#25D366] hover:text-white font-bold text-base px-6 hover:scale-105 transition-all"
              onClick={() => window.open('https://wa.me/9779763653181?text=Namaste! I want to consult regarding a construction project in Butwal / Dang.', '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5 text-[#25D366]" />
              Talk to Us (WhatsApp)
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-semibold text-base px-6 hover:scale-105 transition-all">
              <Link to="/blog">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Read Construction Blog
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-foreground hover:bg-accent font-semibold hover:scale-105 transition-all">
              <Link to="/dang">
                Explore Dang Branch →
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 2. Key Metrics & Live Animated Counter Bar */}
      <section className="py-10 bg-gradient-to-r from-card/80 via-card to-card/80 border-y border-border/60 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedSection delay={0.1} className="text-center p-3 rounded-2xl glass-ios-card">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary font-mono mb-1">
                <AnimatedCounter value={settings.projectsCompleted || 250} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">Projects Delivered</p>
              <span className="text-[10px] text-muted-foreground">Residential & Commercial</span>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="text-center p-3 rounded-2xl glass-ios-card">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono mb-1">
                <AnimatedCounter value={settings.yearsExperience || 15} suffix="+ Yrs" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">Heritage & Trust</p>
              <span className="text-[10px] text-muted-foreground">Since 2010 in Nepal</span>
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="text-center p-3 rounded-2xl glass-ios-card">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mb-1">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">NBC Code Compliant</p>
              <span className="text-[10px] text-muted-foreground">Seismic Safety Code 105</span>
            </AnimatedSection>

            <AnimatedSection delay={0.4} className="text-center p-3 rounded-2xl glass-ios-card">
              <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 font-mono mb-1">
                <AnimatedCounter value={settings.happyClients || 320} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">Satisfied Clients</p>
              <span className="text-[10px] text-muted-foreground">Butwal, Dang & Abroad</span>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 3. Trust & Credibility / Why Choose Us */}
      <section className="py-12 bg-card/40 border-b border-border/50">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "Certified Engineering", subtitle: "Government-licensed team" },
              { icon: Award, title: "100% NBC Compliant", subtitle: "High seismic resilience codes" },
              { icon: Building2, title: "Turnkey Accountability", subtitle: "Design to final key handover" },
              { icon: CheckCircle2, title: "Zero Hidden Costs", subtitle: "Guaranteed transparent BOQ" }
            ].map((item, idx) => (
              <StaggerItem key={idx}>
                <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm sm:text-base leading-tight">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. Core Services Section */}
      <section className="py-20 container mx-auto px-4">
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Our Expertise</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Complete Construction Solutions
          </h2>
          <p className="text-muted-foreground mt-2">
            Engineering services engineered for modern living across Butwal, Rupandehi, Dang Valley, and Western Nepal.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((srv, idx) => (
            <StaggerItem key={idx}>
              <AnimatedCard>
                <Card className="glass-ios-card p-6 border-border/60 flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <srv.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{srv.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{srv.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-border/40 mt-6">
                    <Link to={srv.link} className="text-xs font-bold text-primary hover:underline inline-flex items-center">
                      Learn More <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection direction="up" delay={0.2} className="text-center mt-10">
          <Link to="/services">
            <Button variant="outline" className="border-primary/40 hover:bg-primary/10 font-semibold hover:scale-105 transition-all">
              View Detailed Services & Deliverables <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </section>

      {/* 5. Interactive Apps & Planning Tools Hub Showcase */}
      <section className="py-16 bg-card/40 border-y border-border/40">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Interactive Apps & Calculators</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Self-Service Construction Tools
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                Plan your budget, design custom 2D floor plans, check Vastu compliance, and navigate Nepal municipal building permits online.
              </p>
            </div>
            <Link to="/tools" className="mt-4 md:mt-0">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md hover:scale-105 transition-all">
                Explore All Apps <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "2D Floor Planner App",
                desc: "Interactive drag-and-drop tool to sketch rooms, doors, and furniture layouts with live sq. ft calculation.",
                link: "/floor-planner",
                icon: Layout,
                badge: "Interactive",
                cta: "Open Floor Planner"
              },
              {
                title: "Construction Cost Estimator",
                desc: "Get instant itemized BOQ costs for cement, steel, bricks, sand, and labor based on local Nepal market rates.",
                link: "/estimate",
                icon: Calculator,
                badge: "Instant BOQ",
                cta: "Calculate Cost"
              },
              {
                title: "Nepal Permit Assistant",
                desc: "Step-by-step guidance for Naksa Pass municipal approvals, ward clearances, and building code compliance.",
                link: "/tools/permits",
                icon: FileCheck,
                badge: "Legal Guide",
                cta: "Check Permit Steps"
              },
              {
                title: "Vastu Shastra Compass",
                desc: "Interactive compass to evaluate kitchen, main entrance, bedroom, and puja room alignments according to Vastu.",
                link: "/tools/vastu",
                icon: Compass,
                badge: "Vastu Guide",
                cta: "Check Vastu"
              }
            ].map((tool, idx) => (
              <StaggerItem key={idx}>
                <AnimatedCard>
                  <Card className="glass-ios-card p-6 border-border/60 flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <tool.icon size={24} />
                        </div>
                        <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                          {tool.badge}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-border/40 mt-6">
                      <Button asChild size="sm" variant="outline" className="w-full border-primary/40 hover:bg-primary hover:text-white font-semibold transition-all">
                        <Link to={tool.link}>
                          {tool.cta} →
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. Dedicated Dang Branch Highlight Banner */}
      <section className="py-12 container mx-auto px-4">
        <AnimatedSection direction="zoom">
          <div className="p-8 sm:p-12 rounded-3xl glass border border-primary/40 relative overflow-hidden bg-gradient-to-br from-card/95 via-primary/10 to-purple-500/10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground font-bold">Now Serving Dang</Badge>
                  <Badge variant="outline" className="border-primary/40 text-primary">Branch Office: Ghorahi-15</Badge>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                  Dang Construction & Builders by <span className="text-primary">Butwal Construction</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Looking to build your home or commercial structure in <strong>Ghorahi</strong>, <strong>Tulsipur</strong>, or <strong>Lamahi</strong>? Our dedicated Dang branch offers complete local presence with senior civil engineers, quick municipal permits (Naksa Pass), 3D elevations, and turnkey building.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold hover:scale-105 transition-all">
                    <Link to="/dang">
                      Explore Our Dang Services
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://wa.me/9779763653181?text=Hello! I want to inquire about Dang Construction services.', '_blank')}
                    className="text-green-500 border-green-500/40 hover:bg-green-500 hover:text-white font-semibold hover:scale-105 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Dang Branch
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-4 bg-background/60 backdrop-blur-md p-6 rounded-2xl border border-border/50 space-y-3">
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Fast-Track Locations</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent/40">
                    <span className="font-semibold text-foreground">Ghorahi Sub-Metropolis</span>
                    <Badge variant="secondary" className="text-[10px]">Branch Hub</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent/40">
                    <span className="font-semibold text-foreground">Tulsipur Sub-Metropolis</span>
                    <Badge variant="secondary" className="text-[10px]">Active Sites</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent/40">
                    <span className="font-semibold text-foreground">Lamahi & Deukhuri Valley</span>
                    <Badge variant="secondary" className="text-[10px]">Rapid Service</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 7. Featured Projects with Smooth Scale Animations */}
      <section className="py-20 container mx-auto px-4">
        <AnimatedSection direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Portfolio</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Featured Projects in Butwal & Dang
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore our recent turnkey residential villas and commercial developments.
            </p>
          </div>
          <Link to="/projects" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-primary/40 hover:bg-primary/10 hover:scale-105 transition-all">
              View All Projects <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((proj) => (
            <StaggerItem key={proj.id}>
              <AnimatedCard>
                <Card 
                  className="glass-ios-card overflow-hidden group flex flex-col justify-between cursor-pointer border-border/60"
                >
                  <Link to={`/projects/${proj.id}`} className="block relative aspect-[16/9] overflow-hidden">
                    <LazyImage
                      src={proj.image || project1}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-primary text-primary-foreground font-semibold">{proj.category}</Badge>
                      <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">{proj.status}</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{proj.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{proj.location}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 flex items-center justify-between border-t border-border/40">
                    <span className="text-xs text-muted-foreground line-clamp-1">{proj.description}</span>
                    <Link to={`/projects/${proj.id}`}>
                      <Button size="sm" variant="ghost" className="text-primary font-semibold hover:underline shrink-0">
                        Details →
                      </Button>
                    </Link>
                  </div>
                </Card>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 8. House Designs Preview */}
      <section className="py-20 bg-card/40 border-y border-border/40">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Architectural Concepts</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Modern 3D House Designs
            </h2>
            <p className="text-muted-foreground mt-2">
              Browse popular 2 to 2.5-storey modern box elevations, contemporary duplexes, and Vastu layouts.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.slice(0, 3).map((design) => (
              <StaggerItem key={design.id}>
                <AnimatedCard>
                  <Card className="glass-ios-card overflow-hidden flex flex-col justify-between h-full group">
                    <div>
                      <div className="relative aspect-video overflow-hidden">
                        <LazyImage
                          src={design.images[0] || project2}
                          alt={design.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <Badge className="absolute top-2 right-2 bg-black/70 text-white border-none">{design.style}</Badge>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">{design.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{design.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {design.tags.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0 border-t border-border/40 mt-4">
                      <Button 
                        size="sm" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md hover:scale-[1.02] transition-all"
                        onClick={() => window.open(`https://wa.me/9779763653181?text=Hello! I am interested in building the '${design.title}' house design.`, '_blank')}
                      >
                        Want This House Design? Get Consultation
                      </Button>
                    </div>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection direction="up" delay={0.2} className="text-center mt-10">
            <Link to="/designs">
              <Button variant="outline" size="lg" className="border-primary/40 hover:bg-primary/10 font-semibold hover:scale-105 transition-all">
                Explore Full 3D House Designs Gallery <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 9. Construction Process */}
      <section className="py-20 container mx-auto px-4">
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Structured Execution</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How We Build Your Dream Home
          </h2>
          <p className="text-muted-foreground mt-2">
            A transparent 5-stage engineering journey with guaranteed milestone billing.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {processSteps.map((phase, idx) => (
            <StaggerItem key={idx}>
              <Card className="glass-ios-card p-6 text-center h-full relative overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all duration-300">
                <div>
                  <div className="text-4xl font-black text-primary/30 mb-2 font-mono group-hover:text-primary transition-colors">{phase.step}</div>
                  <h4 className="font-bold text-foreground text-base mb-2">{phase.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{phase.desc}</p>
                </div>
                <div className="w-8 h-1 bg-primary/40 mx-auto mt-4 rounded-full group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 10. Testimonials Section */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatedSection direction="up" className="text-center mb-14">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Client Satisfaction</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              What Homeowners in Butwal & Dang Say
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">Real stories from our turnkey construction and engineering clients.</p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <StaggerItem key={idx}>
                <AnimatedCard>
                  <Card className="glass-ios-card p-6 flex flex-col justify-between h-full border-border/60">
                    <div>
                      <div className="flex gap-1 text-primary mb-3">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                        "{t.text}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/40 mt-4">
                      <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                      <p className="text-xs text-primary font-medium">{t.role}</p>
                    </div>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 11. Cost Calculator CTA Banner with Pulse Glow */}
      <section className="py-16 container mx-auto px-4">
        <AnimatedSection direction="zoom">
          <div className="p-8 sm:p-12 rounded-3xl glass border border-primary/40 text-center relative overflow-hidden bg-gradient-to-br from-card via-primary/10 to-blue-500/10 shadow-2xl max-w-4xl mx-auto">
            <div className="space-y-6">
              <Badge className="bg-primary text-primary-foreground font-bold">Instant Online Estimator</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Want to Know the Construction Cost for Your Land?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Use our interactive material rate and construction calculator. Calculate cement bags, steel rebar, brick quantities, and total construction budget in NPR in less than 30 seconds.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl glow hover:scale-105 transition-all">
                  <Link to="/estimate">
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Construction Estimate Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 12. Blog & Engineering Insights */}
      <section className="py-20 container mx-auto px-4">
        <AnimatedSection direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Engineering Knowledge</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Latest Construction Insights
            </h2>
            <p className="text-muted-foreground mt-2">
              Practical guides on municipal map approvals, material pricing, and earthquake-resilient building.
            </p>
          </div>
          <Link to="/blog" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-primary/40 hover:bg-primary/10 hover:scale-105 transition-all">
              Read All Articles <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <StaggerItem key={post.id}>
              <AnimatedCard>
                <Card className="glass-ios-card overflow-hidden flex flex-col justify-between h-full border-border/60 group">
                  <div>
                    <div className="relative aspect-video overflow-hidden">
                      <LazyImage
                        src={post.image || project1}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">{post.category}</Badge>
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] text-muted-foreground mb-1">{post.date} • {post.readTime}</div>
                      <h4 className="font-bold text-foreground text-base line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h4>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 border-t border-border/40 mt-2">
                    <Link to={`/blog/${post.id}`} className="text-xs font-bold text-primary hover:underline flex items-center">
                      Read Full Guide <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </Card>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 13. Explore All Specialty Portals & Sub-Pages */}
      <section className="py-20 bg-gradient-to-b from-card/30 to-background border-t border-border/40">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">All Portals & Hubs</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Explore Everything We Offer
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Quick access buttons to all our interactive planners, regional branch offices, sister companies, 3D portfolios, and technical resources.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[
              {
                title: "3D House Designs Gallery",
                desc: "Explore 100+ modern Box-type, Contemporary, and Nepali classical villa concepts with room plans.",
                link: "/designs",
                icon: Building2,
                btnText: "Browse House Designs",
                badge: "100+ Designs"
              },
              {
                title: "Dang Regional Branch",
                desc: "Dedicated branch office in Ghorahi-15 serving Ghorahi, Tulsipur, and Lamahi with local civil engineers.",
                link: "/dang",
                icon: MapPin,
                btnText: "Visit Dang Branch",
                badge: "Regional Office"
              },
              {
                title: "Group Sister Companies",
                desc: "Discover Satyawati Devi Hardware, Navdurga Furniture, and our complete building supply ecosystem.",
                link: "/group-companies",
                icon: Package,
                btnText: "Explore Group Companies",
                badge: "Integrated Supply"
              },
              {
                title: "2D Interactive Floor Planner",
                desc: "Sketch custom rooms, walls, doors, and furniture layouts online with instant sq. ft calculations.",
                link: "/floor-planner",
                icon: Layout,
                btnText: "Launch Floor Planner",
                badge: "Interactive Tool"
              },
              {
                title: "3D Virtual Construction",
                desc: "Interactive 3D walkthroughs of foundation rebar, structural framing, and active construction sites.",
                link: "/under-construction",
                icon: Eye,
                btnText: "Explore 3D Visualizer",
                badge: "3D Walkthrough"
              },
              {
                title: "Client Testimonials & Stories",
                desc: "Read genuine verified reviews and experiences from real homeowners across Butwal, Rupandehi, and Dang.",
                link: "/testimonials",
                icon: Star,
                btnText: "Read Client Reviews",
                badge: "Verified Trust"
              },
              {
                title: "Industry Partnerships",
                desc: "Our network of certified structural engineers, architects, geotechnical labs, and material suppliers.",
                link: "/partnerships",
                icon: Handshake,
                btnText: "View Partner Network",
                badge: "Collaborations"
              },
              {
                title: "Interactive Construction Apps",
                desc: "Access our full suite of 10+ civil calculators, Vastu compass, permit guides, and timeline planners.",
                link: "/apps",
                icon: Wrench,
                btnText: "Open Apps Hub",
                badge: "10+ Tools"
              },
              {
                title: "Technical Articles & Guides",
                desc: "Expert civil engineering blogs on municipal map approvals, material pricing trends, and soil testing.",
                link: "/blog",
                icon: BookOpen,
                btnText: "Read Construction Blog",
                badge: "Engineering Blog"
              },
              {
                title: "Nepal Permit & Naksa Pass",
                desc: "Step-by-step guidance for municipal approvals in Butwal Sub-Metropolitan, Tilottama, and Dang.",
                link: "/tools/permits",
                icon: FileCheck,
                btnText: "Check Permit Guide",
                badge: "Legal Assistant"
              },
              {
                title: "Vastu Shastra Compass",
                desc: "Evaluate 16-zone cardinal alignments for entrance doors, kitchen, master bedroom, and water tanks.",
                link: "/tools/vastu",
                icon: Compass,
                btnText: "Launch Vastu Guide",
                badge: "Vastu Shastra"
              },
              {
                title: "Client & Staff Login Portal",
                desc: "Track live site milestones, daily photo logs, material inventory, and project invoices securely.",
                link: "/login",
                icon: UserCheck,
                btnText: "Access Project Portal",
                badge: "Live Tracking"
              }
            ].map((portal, idx) => (
              <StaggerItem key={idx}>
                <AnimatedCard>
                  <Card className="glass-ios-card p-5 rounded-2xl border-border/70 flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <portal.icon size={20} />
                        </div>
                        <Badge className="text-[11px] bg-primary/20 text-rose-300 border border-primary/40 font-bold px-2 py-0.5">
                          {portal.badge}
                        </Badge>
                      </div>
                      <h3 className="font-extrabold text-foreground text-base mb-1.5 group-hover:text-primary transition-colors">
                        {portal.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {portal.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/60 mt-4">
                      <Button asChild size="sm" variant="outline" className="w-full text-xs sm:text-sm border-border/80 bg-card/80 text-foreground hover:bg-primary hover:text-white hover:border-primary font-bold rounded-xl shadow-sm transition-all">
                        <Link to={portal.link}>
                          {portal.btnText} →
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 14. Dual Presence Contact & Regional Locations */}
      <section className="py-20 bg-card/40 border-t border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatedSection direction="up" className="text-center mb-14">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Reach Out Directly</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Visit or Contact Our Regional Offices
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">We are ready to assist you with free plot inspections and design consultations.</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Butwal Corporate Head Office */}
            <AnimatedSection direction="left">
              <AnimatedCard>
                <Card className="glass-ios-card p-8 border-border/60 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge variant="outline" className="border-primary/40 text-primary text-xs">Head Office (Established)</Badge>
                      <h3 className="text-xl font-bold text-foreground">Butwal Construction & Builders</h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Corporate headquarters & central structural engineering division in Rupandehi.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span>Butwal-11, Kalikanagar, Horizonchowk, Annapurna Path, Rupandehi, Nepal</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>+977 9857076965 / +977 9869472803</span>
                    </p>
                  </div>
                  <div className="pt-6 border-t border-border/40 mt-6 flex gap-3">
                    <Button asChild size="sm" className="bg-primary text-primary-foreground font-bold hover:scale-105 transition-all">
                      <Link to="/contact">Contact Head Office</Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://wa.me/9779763653181?text=Namaste! I want to contact Butwal Head Office.', '_blank')}
                      className="text-green-500 border-green-500/40 hover:bg-green-500 hover:text-white hover:scale-105 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </Card>
              </AnimatedCard>
            </AnimatedSection>

            {/* Dang Branch Office */}
            <AnimatedSection direction="right">
              <AnimatedCard>
                <Card className="glass-ios-card p-8 border-primary/30 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge className="bg-primary text-primary-foreground text-xs">Regional Branch (New Expansion)</Badge>
                      <h3 className="text-xl font-bold text-foreground">Dang Construction & Builders</h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Dedicated regional branch of Butwal Construction & Builders serving Ghorahi, Tulsipur, and Lamahi.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span>Ghorahi-15, Main Road, Dang, Nepal</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>+977 9857076965 / +977 9763653181</span>
                    </p>
                  </div>
                  <div className="pt-6 border-t border-border/40 mt-6 flex gap-3">
                    <Button asChild size="sm" variant="outline" className="border-primary/40 font-bold hover:scale-105 transition-all">
                      <Link to="/dang">Dang Details</Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://wa.me/9779763653181?text=Namaste! I want to contact the Dang branch.', '_blank')}
                      className="text-green-500 border-green-500/40 hover:bg-green-500 hover:text-white hover:scale-105 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      WhatsApp
                    </Button>
                  </div>
                </Card>
              </AnimatedCard>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
