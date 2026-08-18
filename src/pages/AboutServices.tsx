import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Target, 
  Eye, 
  Award, 
  Home, 
  Building, 
  Hammer, 
  Ruler, 
  Cog, 
  ClipboardCheck, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  Package, 
  Armchair, 
  MapPin,
  CheckCircle2,
  Sparkles,
  Phone,
  Calculator,
  Compass,
  FileCheck,
  Zap,
  Users,
  Clock,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";

interface ServiceItem {
  id: string;
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  detailedScope: string[];
  standards: string;
  deliverables: string[];
  materialsUsed: string[];
  timeline: string;
  requiredDocs: string[];
  badge: string;
  estimateLink: string;
  estimateLabel: string;
}

interface AboutServicesProps {
  defaultTab?: "about" | "services";
}

const AboutServices = ({ defaultTab }: AboutServicesProps) => {
  const location = useLocation();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  // Determine active tab based on route or prop
  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    if (location.pathname === "/services") return "services";
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "services") return "services";
    return "about";
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());

  useEffect(() => {
    if (location.pathname === "/services") {
      setActiveTab("services");
    } else if (location.pathname === "/about") {
      const params = new URLSearchParams(location.search);
      if (params.get("tab") === "services") {
        setActiveTab("services");
      } else {
        setActiveTab("about");
      }
    }
  }, [location.pathname, location.search]);

  const comprehensiveServices: ServiceItem[] = [
    {
      id: "residential",
      icon: Home,
      title: "Turnkey Residential House Construction",
      tagline: "Complete End-to-End Home Building from Soil to Handover",
      description: "We handle every aspect of your residential building journey. Starting from soil bearing capacity testing, structural modeling, pillar-beam RCC casting, 9-inch brick masonry, to sanitary fittings, flooring, waterproof exterior paint, and final key handover.",
      detailedScope: [
        "Complete structural soil testing & depth calculation for isolated or raft footings.",
        "3D architectural perspective rendering & 2D CAD floor plan drafts for family approval.",
        "Full municipal permit (Naksa Pass) clearance at Butwal, Tilottama, Ghorahi, or Tulsipur.",
        "Strict seismic reinforcement detailing conforming to Nepal National Building Code NBC 105:2020.",
        "Pillar-beam RCC framing, slab casting with machine compaction & curing monitoring.",
        "Weatherproof external plastering, Asian Paints Apex Weathercoat exterior painting, and vitrified floor tiling.",
        "Concealed electrical conduit wiring, modular switchboards, and premium sanitary fittings.",
        "Post-construction deep cleaning, Nirman Sampanna certificate processing, and key handover ceremony."
      ],
      standards: "100% Nepal National Building Code (NBC 105:2020) Seismic Resistance",
      deliverables: [
        "Architectural & Structural engineering blueprints",
        "NBC 105:2020 earthquake-resistant design & execution",
        "Grade 53 OPC Cement & Fe 500D TMT Steel Rebars",
        "Milestone-based stage inspection & transparent billing",
        "Internal & External electrical, plumbing & sanitary lines",
        "Comprehensive 1-year post-handover defect warranty"
      ],
      materialsUsed: [
        "Fe 500D TMT Earthquake-resistant Rebars (Jagdamba / Shivam / Panchakanya)",
        "Fresh Grade 53 OPC Cement for RCC columns and slabs",
        "Machine-cut red clay bricks for sound & thermal insulation",
        "Finolex / Havells multi-strand fire-resistant electrical copper wires",
        "Supreme / Astral heavy CPVC hot & cold plumbing piping"
      ],
      timeline: "4 to 7 Months (Depending on built-up square footage and floor count)",
      requiredDocs: [
        "Land Ownership Certificate (Lalpurja)",
        "Cadastral Map / Trace Naksa of plot",
        "Citizenship copies of property owner",
        "Latest Property Tax Receipt (Tiro Tirya Rasid)"
      ],
      badge: "Flagship Service",
      estimateLink: "/estimate",
      estimateLabel: "Calculate Construction Cost"
    },
    {
      id: "commercial",
      icon: Building,
      title: "Commercial Complex & Plaza Construction",
      tagline: "Multi-Storey Commercial, Retail & Corporate Infrastructure",
      description: "Engineered for high load durability, open-span retail flexibility, and modern architectural elegance. We build shopping complexes, corporate office towers, hotels, banks, and healthcare clinics across Butwal, Rupandehi, and Dang Valley.",
      detailedScope: [
        "High-density dynamic load analysis for retail, banking, hospital, and corporate occupancy.",
        "Underground basement parking design with waterproofing membrane and retaining walls.",
        "Double-height entrance lobbies, high-speed elevator shafts, and emergency staircase integration.",
        "Structural glazing, aluminium composite panels (ACP), and heat-reflective acoustic facades.",
        "Commercial fire safety infrastructure, emergency hydrants, and generator backup line ducts.",
        "Fast-track project staging to reduce capital payback period and business downtime."
      ],
      standards: "Heavy RCC Raft/Isolated Foundations & Municipal Commercial Code",
      deliverables: [
        "Heavy-load structural framework with cantilever engineering",
        "Underground basement parking & seismic retaining walls",
        "Emergency exit pathways, fire hydrants & safety shafts",
        "Modern structural glazing, ACP cladding & acoustic insulation",
        "Fast-track project scheduling to minimize business downtime"
      ],
      materialsUsed: [
        "High-strength M25 / M30 Grade Readymix Concrete",
        "Heavy gauge structural steel sections & Fe 500D TMT reinforcement",
        "Toughened low-E glass facade panels with weather seals",
        "Heavy-duty commercial vitrified tiles & granite flooring"
      ],
      timeline: "8 to 14 Months (Phased floor handover available)",
      requiredDocs: [
        "Commercial Land Lalpurja & Cadastral Blueprints",
        "Municipality Commercial Zone NOC clearance",
        "Environmental / Traffic assessment clearance (if applicable)"
      ],
      badge: "Commercial Grade",
      estimateLink: "/contact",
      estimateLabel: "Request Commercial BOQ & Quote"
    },
    {
      id: "design-3d",
      icon: Ruler,
      title: "3D Architectural Design & Elevation Modeling",
      tagline: "Photorealistic 3D Visualizations & Spatial Planning",
      description: "Our in-house architects and visualizers create stunning modern Box-type, Contemporary, and Classical Nepali elevations that blend optimal natural lighting with spatial efficiency. Every 3D model is synced directly with structural CAD drawings.",
      detailedScope: [
        "Topographical site study to maximize natural sunlight and cross-ventilation.",
        "2D floor layout planning with exact room dimensions, circulation space, and door/window schedule.",
        "Photorealistic 4K 3D exterior daytime and night elevation renderings with lighting effects.",
        "Virtual 3D video walkthrough animation showing interior and exterior flow.",
        "Complete mason working drawings (structural CAD, electrical conduit diagrams, plumbing risers)."
      ],
      standards: "Precise CAD Layouts, Daylight Factor & Wind Path Optimization",
      deliverables: [
        "High-definition 3D exterior daytime and nighttime renders",
        "Detailed 2D floor plans with accurate room dimensions",
        "Furniture placement & electrical conduit layout schemes",
        "Cross-sectional & elevation working drawings for masons",
        "Interactive virtual walkthrough previews for your family"
      ],
      materialsUsed: [
        "Industry-standard AutoCAD, SketchUp, Revit, and Lumion rendering suites",
        "Accurate material texture mapping matching real Nepalese exterior tiles and paints"
      ],
      timeline: "7 to 15 Days (With up to 3 iterative revision rounds)",
      requiredDocs: [
        "Plot dimensions (frontage length, depth, and road width)",
        "Preferred floor count and family bedroom requirements",
        "Photos or orientation of adjacent existing buildings"
      ],
      badge: "Interactive Design",
      estimateLink: "/designs",
      estimateLabel: "Browse 3D Gallery & Pick Design"
    },
    {
      id: "permits",
      icon: FileCheck,
      title: "Municipal Building Permit (Naksa Pass) Assistance",
      tagline: "Stress-Free Legal & Ward Level Approvals Across Nepal",
      description: "Navigating municipal building codes can be daunting. We prepare complete municipal drawing sets, coordinate with Butwal Sub-Metropolitan, Tilottama, Ghorahi, and Tulsipur municipalities, and handle Ward office clearance on your behalf.",
      detailedScope: [
        "Drafting municipal standard blue-sheet drawings following local municipality bye-laws.",
        "Calculating Ground Coverage (FAR), Setbacks, and Right-of-Way (RoW) road clearance.",
        "Structural engineer sign-off and stability certification for building submission.",
        "Filing application at Ward office and coordinating municipal site inspection engineer.",
        "Issuance of Temporary Building Permit (Assthai Ijazat) and subsequent Nirman Sampanna (Completion Certificate)."
      ],
      standards: "Official Nepal Municipal Building By-Laws Compliance",
      deliverables: [
        "Complete municipal drawing blueprint generation",
        "Ward office recommendation & boundary clearance coordination",
        "Soil test certificates and structural engineering sign-offs",
        "Building completion certificate (Nirman Sampanna) processing",
        "Direct tracking and digital updates for overseas homeowners"
      ],
      materialsUsed: [
        "Official Nepal Engineering Council (NEC) registered engineer digital stamping",
        "Municipality compliant CAD drafting formats"
      ],
      timeline: "10 to 20 Working Days (Dependent on Ward verification schedules)",
      requiredDocs: [
        "Original Lalpurja & Citizenship photocopy",
        "Kitta Kat Trace Naksa from Land Survey Department (Napi Karyalaya)",
        "Neighbor boundary consent (if plot has common wall / minimal setback)"
      ],
      badge: "Legal & Compliance",
      estimateLink: "/tools/permits",
      estimateLabel: "Calculate Municipal Permit Fee"
    },
    {
      id: "renovation",
      icon: Hammer,
      title: "Structural Renovation, Retrofitting & Floor Additions",
      tagline: "Transform, Strengthen & Expand Existing Structures",
      description: "Whether you need to add extra floors to an existing home, retrofit older columns for seismic safety, or execute complete modern interior remodeling, our structural team evaluates load integrity before executing seamless expansions.",
      detailedScope: [
        "Non-destructive Schmidt Rebound Hammer & Ultrasonic testing on existing pillars.",
        "Foundation and column jacketing using micro-concrete and high-tensile steel ties.",
        "Removal of non-load bearing interior partition walls to create open-plan living spaces.",
        "Waterproofing rooftop terraces, bathroom floor slabs, and exterior parapet walls.",
        "Installation of modern false ceilings, contemporary facade louvers, and UPVC soundproof windows."
      ],
      standards: "Column Jacketing, Carbon Fiber Reinforcement & Load Capacity Audit",
      deliverables: [
        "Non-destructive concrete strength & rebound hammer testing",
        "RCC column and beam jacketing for vertical expansions",
        "Facade modernization, contemporary exterior plaster & tiling",
        "Modern bathroom remodeling & plumbing line overhaul",
        "Rooftop terrace waterproofing & heat-reflective coating"
      ],
      materialsUsed: [
        "Dr. Fixit / Fosroc chemical bonding agents & epoxy grouts",
        "High-early-strength micro-concrete for structural column encasement",
        "Aluplast / Fenesta multi-chamber UPVC double-glazed windows"
      ],
      timeline: "2 to 6 Weeks (Depending on structural scope)",
      requiredDocs: [
        "Original building drawings (if available) or site access for audit",
        "Municipal permit history for additional floor clearance"
      ],
      badge: "Structural Upgrade",
      estimateLink: "/contact",
      estimateLabel: "Request Structural Audit & Quote"
    },
    {
      id: "vastu",
      icon: Compass,
      title: "Vastu Shastra Consultation & Spatial Alignment",
      tagline: "Harmonious Living Guided by Vedic Architecture Principles",
      description: "We harmonize modern contemporary architecture with time-tested Vastu Shastra principles. From the placement of the main entrance (Simhadwara), kitchen fire zone (Agni Kona), to the master bedroom (Nairritya Kona), we optimize prosperity and positive energy.",
      detailedScope: [
        "Magnetic compass orientation audit of your land plot to detect cardinal axis tilt.",
        "Dividing plot into 16 Vedic energy zones (Padavinyasa) for precise functional allocation.",
        "Main gate positioning in auspicious Pada (e.g., Jayanta, Mahendra, or Pushpadanta).",
        "Kitchen Agni Kona (South-East) alignment with East-facing cooking platform.",
        "Borewell, water tank, and septic tank placement in non-conflicting zones.",
        "Zero-demolition non-invasive remedies (pyramids, colors, elemental balancing) for existing homes."
      ],
      standards: "Authentic 16-Zone Vastu Chakra & Cardinal Direction Analysis",
      deliverables: [
        "Detailed Vastu compliance audit report for your land/plot",
        "Optimal main gate, kitchen, master bedroom & puja room placement",
        "Brahmasthan (center zone) openness optimization",
        "Correction remedies for non-compliant existing buildings without major demolition",
        "Borewell, water sump, and septic tank location mapping"
      ],
      materialsUsed: [
        "Digital magnetic declination compass mapping tools",
        "16-Zone energy chart overlay blueprints"
      ],
      timeline: "2 to 4 Days for complete evaluation and report",
      requiredDocs: [
        "Plot shape sketch with North direction arrow",
        "Current or proposed room layout arrangement"
      ],
      badge: "Vedic Planning",
      estimateLink: "/tools/vastu",
      estimateLabel: "Open Interactive Vastu Compass"
    },
    {
      id: "interiors",
      icon: Armchair,
      title: "Turnkey Interior Fitouts & Custom Modular Woodwork",
      tagline: "Bespoke Modern Interiors in Partnership with Navdurga Furniture",
      description: "Through our group sister company, Navdurga Furniture & Plywood, we provide factory-crafted modular kitchens, custom wardrobes, gypsum false ceilings, and ambient lighting directly to your site at manufacturer rates.",
      detailedScope: [
        "Custom 3D interior design mockups with realistic material and fabric textures.",
        "Factory-precision modular kitchen manufacturing with waterproof IS 710 marine plywood.",
        "Soft-close tandem drawers, corner carousels, and quartz/granite countertop integration.",
        "Floor-to-ceiling bedroom wardrobes with sliding profile doors and sensor LED strip lights.",
        "Gypsum false ceiling design with cove lighting, magnetic track lights, and acoustic treatment."
      ],
      standards: "IS 710 Marine Grade BWP Plywood & Soft-Close Hardware",
      deliverables: [
        "Modular kitchen with acrylic/laminate finish & pantry pullouts",
        "Floor-to-ceiling bedroom wardrobes with integrated lighting",
        "Gypsum false ceiling design with warm LED cove illumination",
        "Custom TV unit wall paneling and wooden divider partitions",
        "Anti-termite treated timber frames and premium doors"
      ],
      materialsUsed: [
        "100% Boiling Water Proof (BWP) IS 710 Grade Plywood from Navdurga",
        "Hettich / Hafele soft-close hinges, channels, and hydraulic lift-ups",
        "Saint-Gobain Gyproc false ceiling boards & Philips LED lighting"
      ],
      timeline: "3 to 6 Weeks (Concurrent with final painting stage)",
      requiredDocs: [
        "Interior floor dimensions or room measurements",
        "Family preferences on color palette and storage requirements"
      ],
      badge: "Group Synergy",
      estimateLink: "/group-companies",
      estimateLabel: "Explore Furniture & Interiors"
    },
    {
      id: "materials",
      icon: Package,
      title: "Direct Material Supply & Site Logistics Guarantee",
      tagline: "Zero Middleman Markups via Satyawati Devi Hardware",
      description: "Construction delays usually happen due to material shortages. As part of our group ecosystem with Satyawati Devi Hardware, your site receives uninterrupted, priority delivery of certified TMT steel, cement, aggregates, and hardware directly from manufacturers.",
      detailedScope: [
        "Direct factory truckload dispatch of fresh Grade 53 OPC cement without warehouse moisture degradation.",
        "Standardized Fe 500D earthquake-resistant TMT rebars cut and bent to exact BBS specifications.",
        "Washed river sand and machine-crushed graded aggregates for high-strength concrete mix.",
        "Complete plumbing, electrical pipe conduits, water storage tanks, and hardware fittings under one contract.",
        "Batch quality test certificates provided for every delivery to ensure client satisfaction."
      ],
      standards: "NS Certified Fe 500D Steel & High-Strength 53 Grade Cement",
      deliverables: [
        "Guaranteed availability of top Nepalese steel brands",
        "Fresh OPC and PPC cement batches direct from factory warehouses",
        "River sand, aggregate gravel, and machine-cut bricks delivery",
        "Batch test certificates for steel tensile strength and cement setting time",
        "Transparent itemized billing with zero hidden distributor markups"
      ],
      materialsUsed: [
        "NS 191 certified Fe 500D / 550D TMT Rebars",
        "Fresh 53 Grade OPC Cement (Shivam / Arghakhanchi / Jagdamba)",
        "High-density concrete blocks and clay bricks"
      ],
      timeline: "On-demand 24-hour site delivery across Butwal & Dang corridors",
      requiredDocs: [
        "Site delivery address & access road width confirmation",
        "Stage construction Bill of Quantities (BOQ)"
      ],
      badge: "Supply Chain Power",
      estimateLink: "/estimate",
      estimateLabel: "Check Material Rates on Estimator"
    }
  ];


  const executionProcess = [
    {
      step: "01",
      title: "Consultation & Site Survey",
      description: "Initial consultation, plot boundary measurement, soil bearing audit, and understanding your family's budget and lifestyle requirements.",
      icon: Users
    },
    {
      step: "02",
      title: "3D Design & Permit Blueprint",
      description: "Architectural 2D plans, realistic 3D elevation renderings, structural CAD analysis, and submission to the local municipality for Naksa Pass.",
      icon: Ruler
    },
    {
      step: "03",
      title: "RCC Foundation & Superstructure",
      description: "Earthwork excavation, column footing casting, tie-beams, 9-inch brick masonry, and seismic slab casting using 53-Grade OPC cement and 500D steel.",
      icon: Building2
    },
    {
      step: "04",
      title: "MEP, Plastering & Waterproofing",
      description: "Concealed electrical conduit wiring, CPVC plumbing lines, two-coat smooth wall plaster, and multi-layer terrace & bathroom waterproofing.",
      icon: Wrench
    },
    {
      step: "05",
      title: "Finishing & Milestone Handover",
      description: "Vitrified tiles, modular kitchen installation, premium exterior/interior paint, deep site cleaning, and handing over the keys with full documentation.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background text-foreground animate-page-in relative overflow-hidden">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Page Hero Header */}
        <div className="text-center mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline text-primary" />
              Turnkey Construction & Engineering
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">
              Butwal Corporate HQ & Dang Regional Division
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            About Us & <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Our Services</span>
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Leading turnkey residential builders, commercial structural contractors, and 3D architectural engineering specialists in Western Nepal.
          </p>
        </div>

        {/* Dynamic High-Contrast Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1.5 rounded-2xl bg-card border border-border/80 shadow-lg">
              <TabsTrigger 
                value="about" 
                className="rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Building2 className="w-4 h-4 mr-2" />
                About Our Company
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Layers className="w-4 h-4 mr-2" />
                Our Services ({comprehensiveServices.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* =========================================================================
              TAB 1: ABOUT US CONTENT
             ========================================================================= */}
          <TabsContent value="about" className="space-y-12 animate-fade-in">
            {/* Company Overview Card */}
            <Card className="glass p-8 md:p-12 border-border/70 rounded-3xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Butwal Construction & Builders</h2>
                      <p className="text-xs sm:text-sm text-primary font-semibold">Flagship Engineering & Turnkey Contracting</p>
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong>Butwal Construction & Builders Pvt. Ltd.</strong> is a premier engineering and turnkey construction company headquartered in Butwal, Rupandehi, with a dedicated regional division, <strong>Dang Construction & Builders</strong>, serving Ghorahi and Tulsipur.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Backed by our founding pillar sister enterprise, <strong>Satyawati Devi Hardware</strong>, we bridge the gap between architectural innovation, seismic engineering safety, and direct factory-rate building material supply. From initial soil testing and municipal Naksa Pass permits to final turnkey key handover, we ensure your home is built on time and within budget.
                  </p>

                  {/* Address Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-card/80 border border-border/70 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <MapPin className="w-4 h-4" />
                        Corporate Head Office (Established Flagship)
                      </div>
                      <div className="text-sm font-bold text-foreground">Butwal-11, Kalikanagar</div>
                      <div className="text-xs text-muted-foreground">Horizonchowk, Annapurna Path, Rupandehi, Nepal</div>
                      <div className="text-xs text-foreground/80 font-medium pt-1">Phone: +977-9763653181</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-card/80 border border-border/70 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                        <MapPin className="w-4 h-4" />
                        Regional Branch (Dang Division)
                      </div>
                      <div className="text-sm font-bold text-foreground">Dang Construction & Builders</div>
                      <div className="text-xs text-muted-foreground">Ghorahi-15, Main Road, Dang Valley, Nepal</div>
                      <div className="text-xs text-foreground/80 font-medium pt-1">Phone: +977-9763653181</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-card border border-primary/30 space-y-4 text-center">
                    <Award className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="font-extrabold text-lg text-foreground">Our Engineering Pledge</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      "Every pillar cast, rebar bound, and brick laid strictly adheres to Nepal Seismic Code NBC 105:2020. No compromises on material grade, safety, or structural longevity."
                    </p>
                    <div className="pt-2 border-t border-border/60">
                      <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                        <Link to="/contact">Book an Office Visit</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Group Ecosystem Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 mb-2">Integrated Strength</Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Our Group <span className="text-primary">Ecosystem</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Direct supply integration from raw hardware to custom woodwork and regional contracting.
                  </p>
                </div>
                <Link to="/group-companies">
                  <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary hover:text-white font-semibold">
                    Explore Sister Companies <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Satyawati Devi Hardware",
                    role: "Building Material & TMT Steel Supply",
                    desc: "Our founding pillar supply house providing high-grade Fe 500D TMT rebars, OPC/PPC cement, and bulk structural hardware directly from manufacturers.",
                    icon: Package,
                    badge: "Supply Chain Pillar"
                  },
                  {
                    name: "Dang Construction and Builders",
                    role: "Regional Division in Dang Valley",
                    desc: "Newly established regional branch serving Ghorahi, Tulsipur, and Lamahi with in-house civil engineers and turnkey residential construction.",
                    icon: MapPin,
                    badge: "Regional Branch"
                  },
                  {
                    name: "Navdurga Furniture & Plywood",
                    role: "Custom Woodwork & Modular Interiors",
                    desc: "Supplying IS 710 marine-grade BWP plywood, custom modular kitchen cabinetry, bedroom wardrobes, and architectural woodwork.",
                    icon: Armchair,
                    badge: "Interior Specialist"
                  }
                ].map((item, idx) => (
                  <Card key={idx} className="glass p-6 hover-lift border-border/70 flex flex-col justify-between rounded-3xl">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center">
                          <item.icon size={22} />
                        </div>
                        <Badge className="text-[11px] bg-primary/20 text-rose-300 border border-primary/40 font-bold px-2.5 py-0.5">
                          {item.badge}
                        </Badge>
                      </div>
                      <h3 className="font-extrabold text-foreground text-lg mb-1">{item.name}</h3>
                      <div className="text-xs font-bold text-primary mb-3">{item.role}</div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Core Values / Engineering Pillars */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <Badge className="bg-primary/10 text-primary border-primary/30 mb-2">Our Values</Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  The Pillars of Our Construction Integrity
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Seismic Safety First",
                    desc: "All structural designs conform strictly to NBC 105:2020 seismic guidelines to safeguard lives in earthquake zones."
                  },
                  {
                    icon: Target,
                    title: "Zero Hidden Costs",
                    desc: "Itemized BOQ with transparent milestone-based invoicing. The price agreed upon is what you pay."
                  },
                  {
                    icon: Zap,
                    title: "Direct Material Advantage",
                    desc: "Factory-direct steel and cement supply from Satyawati Devi Hardware guarantees certified materials at wholesale rates."
                  },
                  {
                    icon: Award,
                    title: "1-Year Warranty",
                    desc: "We stand behind our craftsmanship with a comprehensive 12-month post-handover defect liability warranty."
                  }
                ].map((val, idx) => (
                  <Card key={idx} className="glass p-6 hover-lift text-center border-border/60">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                      <val.icon size={24} />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-2">{val.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Verified Statistics Banner */}
            <Card className="glass p-8 md:p-12 border-border/70 rounded-3xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: "100%", label: "NBC 105:2020 Code Compliant" },
                  { number: "500+", label: "Projects Completed" },
                  { number: "200+", label: "Satisfied Homeowners" },
                  { number: "50+", label: "Engineers & Craftsmen" }
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-3xl md:text-5xl font-black text-primary">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>

          </TabsContent>

          {/* =========================================================================
              TAB 2: OUR SERVICES CONTENT (RICH & COMPREHENSIVE)
             ========================================================================= */}
          <TabsContent value="services" className="space-y-12 animate-fade-in">
            
            {/* Intro text for Services */}
            <div className="text-center max-w-3xl mx-auto mb-8">
              <Badge className="bg-primary/10 text-primary border-primary/30 mb-2">Comprehensive Solutions</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                End-to-End Construction & Engineering Services
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                From initial architectural 3D modeling and municipal Naksa Pass permits to complete turnkey construction and interior woodworking.
              </p>
            </div>

            {/* Services Grid (8 Comprehensive Clickable Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comprehensiveServices.map((srv, index) => (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card 
                    id={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className="glass p-6 md:p-8 hover-lift border-border/70 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 rounded-3xl flex flex-col justify-between group cursor-pointer transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Top Subtle Click Hint Pill */}
                    <div className="absolute top-4 right-4 opacity-70 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white px-2.5 py-1 rounded-full border border-primary/30 transition-colors">
                        <span>Details & Specs</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-3 pr-24">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <srv.icon size={28} />
                          </div>
                          <div>
                            <Badge className="text-[11px] bg-primary/20 text-rose-300 border border-primary/40 font-bold px-2.5 py-0.5 mb-1">
                              {srv.badge}
                            </Badge>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                              {srv.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-primary">
                        {srv.tagline}
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {srv.description}
                      </p>

                      {/* Standard Badge */}
                      <div className="p-3 rounded-2xl bg-card/90 border border-border/80 text-xs text-foreground font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong className="text-foreground">Standard:</strong> <span className="text-muted-foreground">{srv.standards}</span></span>
                      </div>

                      {/* Deliverables List */}
                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center justify-between">
                          <span>Key Deliverables:</span>
                          <span className="text-[10px] text-primary font-semibold">Click to expand</span>
                        </div>
                        <div className="space-y-1.5">
                          {srv.deliverables.slice(0, 4).map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom CTA Actions */}
                    <div className="pt-6 border-t border-border/70 mt-6 flex flex-wrap items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-white font-bold shadow-md rounded-xl"
                        onClick={() => setSelectedService(srv)}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        View Full Specs
                      </Button>
                      <Button asChild size="sm" variant="outline" className="border-border text-foreground hover:bg-card rounded-xl font-semibold">
                        <Link to={srv.estimateLink}>
                          {srv.estimateLabel} →
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-emerald-500/50 bg-emerald-950/30 text-emerald-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] font-semibold transition-all shadow-sm rounded-xl ml-auto"
                        onClick={() => window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(`Hello! I would like to inquire about ${srv.title} in Butwal/Dang.`)}`, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400 group-hover:text-white" />
                        WhatsApp
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Service Details Modal Dialog */}
            <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
              {selectedService && (
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border-primary/40 bg-card/95 backdrop-blur-xl shadow-2xl">
                  <DialogHeader className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center shrink-0">
                        <selectedService.icon size={28} />
                      </div>
                      <div>
                        <Badge className="bg-primary/20 text-rose-300 border-primary/40 font-bold text-xs mb-1">
                          {selectedService.badge}
                        </Badge>
                        <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                          {selectedService.title}
                        </DialogTitle>
                      </div>
                    </div>
                    <DialogDescription className="text-sm font-semibold text-primary">
                      {selectedService.tagline}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 pt-4 text-xs sm:text-sm">
                    {/* Overview & Scope */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Engineering Methodology & Scope of Work
                      </h4>
                      <p className="text-muted-foreground leading-relaxed bg-background/50 p-4 rounded-2xl border border-border/70">
                        {selectedService.description}
                      </p>
                    </div>

                    {/* Step-by-Step Engineering Execution Checklist */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                        Complete Turnkey Deliverables & Execution Steps
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedService.detailedScope.map((scope, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-background/60 border border-border/60 text-foreground text-xs leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{scope}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Materials & Quality Standards Applied */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          Building Codes & Seismic Standards
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          {selectedService.standards}
                        </p>
                        <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                          ✓ Certified by Registered NEC Civil Engineers
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          Estimated Project Timeline
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          {selectedService.timeline}
                        </p>
                        <div className="text-[11px] text-primary font-semibold pt-1">
                          ✓ Phased milestone tracking & weekly reporting
                        </div>
                      </div>
                    </div>

                    {/* Certified Materials Inclusions */}
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        Certified Materials & Brands Used
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {selectedService.materialsUsed.map((mat, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span>{mat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents from Client */}
                    <div className="p-4 rounded-2xl bg-background/60 border border-border/70 space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-primary" />
                        Documents Required to Initiate Project
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {selectedService.requiredDocs.map((doc, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direct Action CTAs for this service */}
                    <div className="pt-4 border-t border-border/70 space-y-3">
                      <div className="text-xs font-bold text-center text-foreground">
                        Take Action for this Service:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button 
                          asChild
                          size="default" 
                          className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg"
                        >
                          <Link to={selectedService.estimateLink} onClick={() => setSelectedService(null)}>
                            <Calculator className="w-4 h-4 mr-2" />
                            {selectedService.estimateLabel}
                          </Link>
                        </Button>

                        <Button 
                          size="default" 
                          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl shadow-md"
                          onClick={() => {
                            window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(`Namaste! I would like to consult with an engineer regarding "${selectedService.title}".`)}`, '_blank');
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp Engineer
                        </Button>

                        <Button 
                          asChild
                          size="default" 
                          variant="outline"
                          className="w-full border-border text-foreground hover:bg-card rounded-xl font-semibold"
                        >
                          <Link to="/contact" onClick={() => setSelectedService(null)}>
                            <Phone className="w-4 h-4 mr-2 text-primary" />
                            Book Site Visit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>

            {/* 5-Stage Execution Process */}
            <div className="py-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <Badge className="bg-primary/10 text-primary border-primary/30 mb-2">Structured Execution</Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  Our 5-Stage Construction Process
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Transparent milestone billing with photo/video updates for complete peace of mind.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {executionProcess.map((proc, idx) => (
                  <Card key={idx} className="glass p-5 text-center hover-lift border-border/60 flex flex-col justify-between rounded-2xl">
                    <div>
                      <div className="text-3xl font-black text-primary/30 font-mono mb-2">{proc.step}</div>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                        <proc.icon size={20} />
                      </div>
                      <h4 className="font-bold text-foreground text-sm mb-2">{proc.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{proc.description}</p>
                    </div>
                    <div className="w-6 h-1 bg-primary/40 mx-auto mt-4 rounded-full" />
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Solution & Direct Booking Banner */}
            <Card className="glass p-8 md:p-12 text-center rounded-3xl border-primary/40 bg-gradient-to-br from-card via-card to-primary/10 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                Ready to Start Your Construction Project?
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-2xl mx-auto">
                Schedule a free technical site visit or speak with our senior structural civil engineers in Butwal or Dang.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg shadow-primary/25 rounded-full"
                  asChild
                >
                  <Link to="/contact">
                    <Phone className="mr-2 h-4 w-4" />
                    Book Free Consultation
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-6 rounded-full"
                  onClick={() => window.open('https://wa.me/9779763653181?text=Hello! I want to discuss a construction project in Butwal/Dang.', '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </div>
            </Card>

          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AboutServices;
export { AboutServices };
