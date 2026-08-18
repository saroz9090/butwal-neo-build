import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  FileText, 
  Layers, 
  Hammer, 
  Compass, 
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { useWebsiteContent, INITIAL_PROJECTS } from "@/contexts/WebsiteContentContext";
import LazyImage from "@/components/LazyImage";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import { 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem 
} from "@/components/AnimatedSection";

export const DangBranch = () => {
  const { location: locationParam } = useParams<{ location?: string }>();
  const { projects: dynamicProjects, designs } = useWebsiteContent();

  const selectedLocation = useMemo(() => {
    if (!locationParam) return "all";
    const loc = locationParam.toLowerCase();
    if (loc.includes("ghorahi")) return "ghorahi";
    if (loc.includes("tulsipur")) return "tulsipur";
    if (loc.includes("lamahi")) return "lamahi";
    return "all";
  }, [locationParam]);

  const [activeAreaTab, setActiveAreaTab] = useState<string>(
    selectedLocation === "all" ? "ghorahi" : selectedLocation
  );

  const rawProjects = dynamicProjects.length > 0 ? dynamicProjects : INITIAL_PROJECTS;

  // Filter Dang projects
  const dangProjects = useMemo(() => {
    return rawProjects.filter(p => 
      p.location.toLowerCase().includes("dang") ||
      p.location.toLowerCase().includes("ghorahi") ||
      p.location.toLowerCase().includes("tulsipur") ||
      p.location.toLowerCase().includes("lamahi")
    ).slice(0, 4);
  }, [rawProjects]);

  const dangServices = [
    {
      icon: Building2,
      title: "Turnkey House Construction",
      desc: "Complete residential building from foundation, RCC pillar casting, brickwork to luxury interior and bathroom fittings.",
      badge: "Most Popular"
    },
    {
      icon: Layers,
      title: "Commercial & Complex Building",
      desc: "Hotels, commercial complexes, retail shopping centers, and mixed-use structures built with high load-bearing standards.",
      badge: "Commercial"
    },
    {
      icon: Compass,
      title: "House Design & 3D Elevations",
      desc: "Modern Box-type, Contemporary, and Classical Nepali architectural drawings, 3D renders, and Vastu-aligned floor plans.",
      badge: "Architecture"
    },
    {
      icon: FileText,
      title: "Estimate & Detailed BOQ",
      desc: "Accurate Bill of Quantities, material cost breakdowns, and transparent stage-wise milestone payment schedules.",
      badge: "Engineering"
    },
    {
      icon: Hammer,
      title: "Renovation & Remodeling",
      desc: "Structural strengthening, additional floor extensions, elevation redesign, and contemporary interior modernization.",
      badge: "Renovation"
    },
    {
      icon: ShieldCheck,
      title: "Construction Supervision",
      desc: "Daily on-site civil engineering quality inspection, slump test, rebar binding verification, and live client updates.",
      badge: "Quality Audit"
    }
  ];

  const areaDetails: Record<string, { title: string; subtitle: string; desc: string; landmarks: string[]; municipalInfo: string }> = {
    ghorahi: {
      title: "Ghorahi Sub-Metropolitan City",
      subtitle: "Heart of Dang Valley — Leading Urban Construction Hub",
      desc: "Our primary regional branch office is conveniently situated in Ghorahi-15. We actively serve all wards of Ghorahi including Shahid Gate, Bharatpur, Narayanpur, Dharna, and surrounding developing residential zones with turn-key construction and engineering supervision.",
      landmarks: ["Ghorahi-15 Main Road", "Shahid Gate Area", "Bharatpur & Ratnanagar", "Narayanpur Chowk"],
      municipalInfo: "We handle 100% of the Ghorahi Sub-Metropolitan municipal Naksa Pass approvals, soil stability reports, and structural clearance."
    },
    tulsipur: {
      title: "Tulsipur Sub-Metropolitan City",
      subtitle: "Western Dang's Fastest Growing Commercial & Residential Zone",
      desc: "Tulsipur has experienced rapid residential growth with modern box-type residences and commercial arcades. Our engineering team provides fast-track building permits, architectural 3D designs, and complete construction execution across Tulsipur Airport area, BP Chowk, and Tarigaun.",
      landmarks: ["BP Chowk & Main Market", "Tarigaun Airport Area", "Araniko Chowk", "Bijauri & Hemantapur"],
      municipalInfo: "Fully compliant with Tulsipur Sub-Metropolis building codes, FAR regulations, and seismic safety requirements."
    },
    lamahi: {
      title: "Lamahi Municipality & Deukhuri Valley",
      subtitle: "Deukhuri Valley Gateway & Highway Commercial Construction",
      desc: "Serving East-West Highway commercial setups, hotels, resorts, and modern duplex homes across Lamahi, Bhalubang, and Gadhawa. We ensure robust foundation designs tailored to Deukhuri valley soil conditions.",
      landmarks: ["Lamahi Bazar & Highway Corridor", "Bhalubang Junction", "Rapti Rural Municipality zone"],
      municipalInfo: "Comprehensive municipal drawing documentation and environmental clearance support for Lamahi and Rapti region."
    }
  };

  const faqs = [
    {
      q: "What is the average house construction cost per sq.ft in Dang?",
      a: "In Dang (Ghorahi, Tulsipur, Lamahi), standard turnkey construction typically ranges from NPR 3,800 to NPR 4,500 per sq.ft depending on material grades, structural specs, tile/sanitary choices, and finishing quality. We provide a guaranteed, itemized BOQ with zero hidden costs."
    },
    {
      q: "How does Dang Construction & Builders relate to Butwal Construction & Builders?",
      a: "Dang Construction & Builders is the dedicated regional branch and unit of Butwal Construction & Builders Pvt. Ltd. You get the direct backing of government-certified engineering excellence, seasoned structural engineers, and established material networks, right here locally in Dang."
    },
    {
      q: "Do you handle municipal building permits (Naksa Pass) in Ghorahi & Tulsipur?",
      a: "Yes, our in-house civil engineers and architects prepare the complete architectural, structural, electrical, and sanitary drawings required by Ghorahi and Tulsipur Sub-Metropolitan cities, and coordinate the approval from submission to final building completion certificate (Nirman Sampanna Pramanpatra)."
    },
    {
      q: "Can I inspect the construction progress if I am abroad (NRNA / Foreign Employment)?",
      a: "Absolutely! We specialize in serving overseas Nepali clients with daily site photo logs, video updates, milestone-based transparent bank transfers, and live WhatsApp walkthroughs."
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-card/40 via-background to-background border-b border-border/40 relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>Butwal Construction & Builders • Dang Regional Branch</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-heading leading-tight">
              Professional Construction Services in <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400 font-black">Dang (Ghorahi, Tulsipur & Lamahi)</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              <strong>Butwal Construction & Builders</strong> brings its civil engineering excellence and structural precision directly to Dang through our dedicated branch. We deliver turnkey house construction, commercial building, 3D architectural house designs, municipal permits, and structural supervision.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg glow">
                <Link to="/estimate">
                  <Calculator className="mr-2 h-5 w-5" />
                  Get Construction Estimate
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-[#25D366]/10 border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-white"
                onClick={() => window.open('https://wa.me/9779763653181?text=Namaste! I want to consult about construction in Dang.', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Talk on WhatsApp
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-foreground hover:bg-accent">
                <Link to="/contact">
                  Visit Dang Branch Office
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Quick Location Tags */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>Fast-Track Service in:</span>
              <Badge variant="outline" className="border-primary/40 text-primary">Ghorahi Sub-Metropolis</Badge>
              <Badge variant="outline" className="border-primary/40 text-primary">Tulsipur Sub-Metropolis</Badge>
              <Badge variant="outline" className="border-primary/40 text-primary">Lamahi & Deukhuri Valley</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Services in Dang */}
      <section className="py-20 container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Comprehensive Solutions</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Our Construction Services in <span className="text-primary">Dang</span>
          </h2>
          <p className="text-muted-foreground mt-3">
            From initial plot soil testing and 3D architectural models to turnkey handover, we handle everything under one roof.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dangServices.map((service, idx) => (
            <StaggerItem key={idx}>
              <Card className="glass p-6 hover-lift border-border/50 hover:border-primary/50 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">{service.badge}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </div>
                <div className="pt-6 border-t border-border/40 mt-6 flex items-center justify-between">
                  <Link to="/estimate" className="text-xs font-bold text-primary hover:underline flex items-center">
                    Get Estimate <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                  <Link to="/contact" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                    Consult Engineer
                  </Link>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Areas We Serve in Dang */}
      <section className="py-16 bg-card/40 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-foreground">Areas We Serve Across Dang Valley</h2>
            <p className="text-sm text-muted-foreground mt-2">Choose your city to see localized services, municipality approval guides, and key landmarks.</p>
            
            {/* Area Tabs */}
            <div className="flex justify-center gap-3 mt-6">
              {Object.keys(areaDetails).map((key) => (
                <Button
                  key={key}
                  variant={activeAreaTab === key ? "default" : "outline"}
                  onClick={() => setActiveAreaTab(key)}
                  className={`capitalize transition-all hover:scale-105 ${activeAreaTab === key ? "bg-primary text-primary-foreground font-bold shadow-lg" : "text-muted-foreground"}`}
                >
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {key}
                </Button>
              ))}
            </div>
          </AnimatedSection>

          {/* Active Area Card */}
          <AnimatedSection delay={0.15}>
            <Card className="glass p-8 border-primary/30 shadow-xl transition-all">
            <div className="space-y-6">
              <div>
                <Badge className="bg-primary/20 text-primary mb-2">Regional Coverage</Badge>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{areaDetails[activeAreaTab].title}</h3>
                <p className="text-sm font-semibold text-primary mt-1">{areaDetails[activeAreaTab].subtitle}</p>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{areaDetails[activeAreaTab].desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/40">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Major Wards & Coverage
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {areaDetails[activeAreaTab].landmarks.map((landmark, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{landmark}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    Municipal Permit Support
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {areaDetails[activeAreaTab].municipalInfo}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button asChild className="bg-primary text-primary-foreground font-bold hover:scale-105 transition-all">
                  <Link to="/contact">Book Site Consultation in {areaDetails[activeAreaTab].title.split(" ")[0]}</Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(`https://wa.me/9779763653181?text=Hello! I am planning a construction project in ${areaDetails[activeAreaTab].title.split(" ")[0]}.`, '_blank')}
                  className="text-green-500 border-green-500/40 hover:bg-green-500 hover:text-white transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Quick WhatsApp Enquiry
                </Button>
              </div>
            </div>
          </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Dang Projects Showcase */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Proven Track Record</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Featured Projects & Works
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore residential and commercial developments managed by our engineering teams.
            </p>
          </div>
          <Link to="/projects" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-primary/40 hover:bg-primary/10">
              View All Projects <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(dangProjects.length > 0 ? dangProjects : rawProjects.slice(0, 2)).map((proj) => (
            <Card key={proj.id} className="glass overflow-hidden hover-lift group flex flex-col justify-between cursor-pointer">
              <Link to={`/projects/${proj.id}`} className="block relative aspect-[16/9] overflow-hidden">
                <LazyImage
                  src={proj.image || project1}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-primary text-primary-foreground">{proj.category}</Badge>
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
                  <Button size="sm" variant="ghost" className="text-primary font-semibold hover:underline">
                    Details →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* House Designs for Dang */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Modern Elevations</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Popular House Designs for <span className="text-primary">Dang</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              Climate-responsive 2 to 2.5-storey residences, modern box facades, and Vastu-compliant layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.slice(0, 3).map((design) => (
              <Card key={design.id} className="glass overflow-hidden hover-lift flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video overflow-hidden">
                    <LazyImage
                      src={design.images[0] || project2}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white border-none">{design.style}</Badge>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg text-foreground line-clamp-1">{design.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{design.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {design.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-border/40 mt-4 flex items-center justify-between">
                  <Button 
                    size="sm" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    onClick={() => window.open(`https://wa.me/9779763653181?text=Hello! I am interested in building the '${design.title}' house design in Dang.`, '_blank')}
                  >
                    Want This Design? Consult Us
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/designs">
              <Button variant="outline" size="lg" className="border-primary/40 hover:bg-primary/10">
                Explore Full 3D House Designs Gallery <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Dang Construction & Builders */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Institutional Trust</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Why Build with Us in Dang?
            </h2>
            <p className="text-muted-foreground mt-2">
              Combining the security of an established construction group with responsive local field engineers in Ghorahi & Tulsipur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Certified Civil Engineering Pedigree",
                desc: "Backed by Butwal Construction & Builders Pvt. Ltd., bringing seasoned structural engineers, IOE alumni design practices, and proven project delivery."
              },
              {
                title: "100% NBC Code Earthquake Safety",
                desc: "Every pillar, beam, and raft foundation is designed strictly adhering to Nepal National Building Code (NBC 105:2020) for high seismic resilience."
              },
              {
                title: "Zero Hidden Costs & Milestone Invoicing",
                desc: "Transparent BOQ and payment schedule tied strictly to completed construction stages (Plinth → Pillar → Slab Casting → Finishing)."
              },
              {
                title: "Dedicated Local Field Office in Ghorahi",
                desc: "Direct walk-in assistance, continuous material quality testing, and on-demand site visits whenever you need us."
              }
            ].map((item, index) => (
              <Card key={index} className="glass p-6 hover-lift border-border/60">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-card/40 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/30 mb-3">Have Questions?</Badge>
            <h2 className="text-3xl font-extrabold text-foreground">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm mt-1">Essential information for prospective property owners in Dang.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="glass p-6">
                <h3 className="font-bold text-foreground text-base flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-muted-foreground pl-7.5 mt-2 leading-relaxed">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 container mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl glass border border-primary/30 text-center relative overflow-hidden bg-gradient-to-br from-card via-primary/5 to-purple-500/10 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Ready to Start Your Construction Project in <span className="text-primary">Dang</span>?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Book a free site consultation with our Senior Civil Engineer in Ghorahi or Tulsipur. We will assess your land, review municipal bylaws, and provide a complimentary cost estimation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
                <Link to="/estimate">
                  Calculate Construction Cost
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold"
                onClick={() => window.open('https://wa.me/9779763653181?text=Hello! I would like to schedule a site inspection in Dang.', '_blank')}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Us: +977 9763653181
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              📍 <strong>Head Office:</strong> Butwal-11, Kalikanagar, Horizonchowk, Annapurna Path | <strong>Regional Branch:</strong> Ghorahi-15, Main Road, Dang
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DangBranch;
