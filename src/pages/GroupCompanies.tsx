import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Wrench, 
  Package, 
  Armchair, 
  MapPin, 
  Phone, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MessageCircle,
  Clock,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

export interface CompanyInfo {
  id: string;
  name: string;
  tagline: string;
  tenure: string;
  tenureNum: string;
  established: string;
  parentNote?: string;
  category: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  coverImage: string;
  description: string;
  highlights: string[];
  productsServices: string[];
  location: string;
  phone: string;
  stats: { label: string; value: string }[];
  mapUrl?: string;
}

const companies: CompanyInfo[] = [
  {
    id: "butwal",
    name: "Butwal Construction and Builders",
    tagline: "Turnkey Architectural Design, Modern Engineering & Construction",
    tenure: "1 Year (Construction Unit)",
    tenureNum: "1 Year",
    established: "2025",
    category: "Flagship Turnkey Engineering & Construction",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    icon: Building2,
    coverImage: "/public/designs/neo7.jpg",
    description: "The main flagship construction company of the group. Combining a decade of material supply expertise from Satyawati Devi Hardware with cutting-edge engineering, 3D architectural modeling, Vastu integration, and complete turnkey construction execution across Rupandehi and Western Nepal.",
    highlights: [
      "Complete Turnkey Construction (Design to Key Handover)",
      "In-house Structural Engineers, Architects & Vastu Experts",
      "Smart 3D Floor Planning & VR Visualization",
      "Strict Budget Assurance & On-Time Milestone Guarantee"
    ],
    productsServices: [
      "Turnkey Residential Villa Construction",
      "Commercial Building & Complex Projects",
      "Architectural 2D/3D Design & Blueprints",
      "Nepal Municipal Building Permit Assistance",
      "Vastu-Compliant Space Planning",
      "Eco-Friendly Green Construction Solutions"
    ],
    location: "Head Office: Butwal-11, Kalikanagar, Horizonchowk, Annapurna Path, Rupandehi, Nepal",
    phone: "+977-9763653181",
    stats: [
      { label: "Ongoing Projects", value: "18" },
      { label: "Expert Engineers", value: "25+" },
      { label: "3D House Designs", value: "100+" },
      { label: "On-Time Delivery", value: "100%" }
    ],
    mapUrl: "https://maps.app.goo.gl/VTb2oEUmRSjk5jhV9"
  },
  {
    id: "dang",
    name: "Dang Construction and Builders",
    tagline: "Newly Started Regional Branch by Butwal Construction & Builders",
    tenure: "Newly Started Regional Division",
    tenureNum: "New Branch",
    established: "2025 (Started Recently)",
    parentNote: "Official regional extension branch operated directly by Butwal Construction and Builders",
    category: "Regional Branch Construction",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: MapPin,
    coverImage: "/public/designs/neo10.jpg",
    description: "Newly established by Butwal Construction and Builders to bring world-class architectural engineering, turnkey residential homes, and commercial complex construction directly to Ghorahi, Tulsipur, and the broader Dang Valley. Operating with full backing from parent company materials, heavy equipment, and senior structural engineers.",
    highlights: [
      "Newly launched regional branch for Dang Valley (Ghorahi & Tulsipur)",
      "Direct parent support from Butwal Construction's engineering & material supply hub",
      "Custom earthquake-resistant designs tailored for Dang geography",
      "Full local municipality legal, permit, and Ward office coordination"
    ],
    productsServices: [
      "Turnkey Residential Construction in Ghorahi & Tulsipur",
      "Commercial Warehouses & Showrooms in Dang",
      "Architectural Blueprints & 3D Front Elevations",
      "On-Site Quality Supervision & Concrete Testing",
      "Land Layout & Development Consultancy"
    ],
    location: "Branch Office: Dang Valley (Ghorahi / Tulsipur), Nepal",
    phone: "+977-9763653181",
    stats: [
      { label: "Service Region", value: "Dang Valley" },
      { label: "Parent Company", value: "Butwal Construction" },
      { label: "Engineers", value: "Dedicated Team" },
      { label: "Status", value: "Active & Booking" }
    ],
    mapUrl: "https://maps.app.goo.gl/x2hAah1ff7CiCU1i7"
  },
  {
    id: "satyawati",
    name: "Satyawati Devi Hardware",
    tagline: "Pioneering Building Materials & Hardware Supply in Western Nepal",
    tenure: "1 Decade (10+ Years)",
    tenureNum: "10 Years",
    established: "2016",
    category: "Hardware & Construction Materials",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: Package,
    coverImage: "/public/designs/neo1.jpg",
    description: "The founding pillar of our group. With over a decade of unshakeable market trust, Satyawati Devi Hardware supplies top-tier TMT steel bars, OPC/PPC cement, bricks, aggregates, sanitary fittings, and structural hardware to hundreds of residential and commercial projects across Rupandehi and surrounding districts.",
    highlights: [
      "10+ Years of uninterrupted market trust & reliability",
      "Authorized dealer for premier Nepalese steel & cement brands",
      "Direct bulk supply logistics to construction sites",
      "Comprehensive hardware inventory for all building phases"
    ],
    productsServices: [
      "TMT Rebars (Fe 500 / 500D Grade)",
      "OPC & PPC High Grade Cement",
      "Structural Steel & Metal Piping",
      "Plumbing, Fittings & Sanitaryware",
      "Water Proofing Chemicals & Admixtures",
      "Heavy Machinery Hardware & Tools"
    ],
    location: "Butwal, Rupandehi, Nepal",
    phone: "+977-9763653181",
    stats: [
      { label: "Years of Trust", value: "10+" },
      { label: "Suppled Projects", value: "2,500+" },
      { label: "Product Items", value: "10,000+" },
      { label: "Satisfaction", value: "99%" }
    ],
    mapUrl: "https://maps.app.goo.gl/3a6iK9awGGEj9Lpp6"
  },
  {
    id: "navdurga",
    name: "Navdurga Furniture and Plywood Centre",
    tagline: "Custom Interior Craftsmanship, Quality Plywood & Modern Furniture",
    tenure: "5 Years",
    tenureNum: "5 Years",
    established: "2021",
    category: "Interior Woodwork & Furniture",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Armchair,
    coverImage: "/public/designs/neo3.jpg",
    description: "For 5 years, Navdurga Furniture and Plywood Centre has brought elegance to homes and commercial spaces. Specializing in high-grade waterproof marine plywood, teak wood doors, modular kitchen fittings, customized sofas, office desks, and bespoke interior woodwork.",
    highlights: [
      "5 Years of specialized interior woodworking expertise",
      "Waterproof, termite-resistant IS 710 marine plywood supplier",
      "In-house master carpenters & custom design manufacturing",
      "End-to-end interior furnish packages for new homes"
    ],
    productsServices: [
      "IS 710 Marine & Commercial Plywood",
      "Custom Modular Kitchen Units",
      "Living Room Sofas & Dining Sets",
      "Bespoke Wooden Doors & Frames",
      "Office Workstations & Decor",
      "Laminates, Veneers & Edge Banding"
    ],
    location: "Butwal, Rupandehi, Nepal",
    phone: "+977-9763653181",
    stats: [
      { label: "Years Active", value: "5" },
      { label: "Homes Furnished", value: "650+" },
      { label: "Wood Grades", value: "25+" },
      { label: "Custom Designs", value: "1,200+" }
    ]
  },
  {
    id: "malika",
    name: "Malika Hardware and Suppliers",
    tagline: "Essential Construction Hardware, Electrical & Water Systems",
    tenure: "5 Years",
    tenureNum: "5 Years",
    established: "2021",
    category: "Hardware & Electrical Supplies",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Wrench,
    coverImage: "/public/designs/neo5.jpg",
    description: "Malika Hardware and Suppliers has served local contractors, engineers, and individual home builders for 5 years with reliable building hardware, electrical wiring, CPVC/PPR plumbing pipes, paints, and safety equipment. Dedicated to providing genuine quality products at competitive wholesale prices.",
    highlights: [
      "5 Years delivering genuine hardware & electrical solutions",
      "Complete residential CPVC & PPR plumbing catalog",
      "Paints, primers, & exterior weather-shield coatings",
      "Power tools & safety gear for site workers"
    ],
    productsServices: [
      "PPR, CPVC & PVC Piping Solutions",
      "Electrical Cables, Switches & DB Boxes",
      "Exterior & Interior Weatherproof Paints",
      "Fasteners, Anchors & Door Locksets",
      "Power Tools, Drills & Cutting Discs",
      "Safety Helmets, Harnesses & Gear"
    ],
    location: "Rupandehi, Nepal",
    phone: "+977-9763653181",
    stats: [
      { label: "Years Active", value: "5" },
      { label: "Partner Contractors", value: "180+" },
      { label: "Hardware Items", value: "5,000+" },
      { label: "Quality Rating", value: "4.9/5" }
    ]
  }
];

export default function GroupCompanies() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("butwal");

  const currentCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background text-foreground relative overflow-hidden">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-3 px-4 py-1.5 text-sm bg-primary/20 text-primary border-primary/30 font-medium">
            <Sparkles className="w-4 h-4 mr-1.5 inline" />
            Our Group Network & Legacy
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Group Companies & <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Sister Concerns</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From a decade of trusted hardware supply to modern architectural engineering across Nepal.
            Explore the specialized companies powering our complete construction ecosystem.
          </p>
        </div>

        {/* Featured Announcement Banner for Butwal Construction & Dang Branch */}
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/10 border border-primary/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1">
                Flagship Highlight
              </Badge>
              <Badge className="bg-purple-500 text-white font-bold px-3 py-1">
                New Branch Launch
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Butwal Construction & Builders <span className="text-primary font-normal">expands with</span> Dang Construction & Builders
            </h2>
            <p className="text-muted-foreground text-sm max-w-3xl">
              We are proud to announce the official opening of <strong>Dang Construction and Builders</strong>! Powered directly by <strong>Butwal Construction and Builders</strong>, we bring full turnkey architectural design, structural engineering, and house construction to Ghorahi, Tulsipur, and the Dang valley.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <Button 
              onClick={() => setSelectedCompanyId("dang")}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md font-semibold"
            >
              View Dang Branch
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button 
              onClick={() => setSelectedCompanyId("butwal")}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              View Butwal Flagship
            </Button>
          </div>
        </div>

        {/* Company Quick Summary Grid / Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {companies.map((company) => {
            const Icon = company.icon;
            const isSelected = company.id === selectedCompanyId;
            return (
              <button
                key={company.id}
                onClick={() => setSelectedCompanyId(company.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-lg ring-2 ring-primary/30 transform -translate-y-1"
                    : "glass border-border hover:border-primary/50 hover:bg-card/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={`text-xs ${company.badgeColor}`}>
                      {company.tenureNum}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{company.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{company.category}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                  <span>{isSelected ? "Currently Viewing" : "View Details"}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ml-1 transition-transform ${isSelected ? "translate-x-1" : ""}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-Pages / Interactive Detail View for Selected Company */}
        <div className="glass rounded-2xl p-6 md:p-10 border border-border shadow-2xl animate-fade-in relative overflow-hidden">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Sub Navigation Bar inside Page */}
          <div className="border-b border-border pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/30">
                <currentCompany.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{currentCompany.name}</h2>
                  <Badge className={currentCompany.badgeColor}>{currentCompany.tenure}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{currentCompany.tagline}</p>
              </div>
            </div>

            <Button
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md"
              onClick={() => window.open(`https://wa.me/9779763653181?text=Hello! I am inquiring about ${encodeURIComponent(currentCompany.name)}`, '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Inquire via WhatsApp
            </Button>
          </div>

          {currentCompany.parentNote && (
            <div className="mb-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span><strong>Note:</strong> {currentCompany.parentNote}</span>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {currentCompany.stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-card/60 border border-border text-center">
                <div className="text-2xl md:text-3xl font-black text-primary mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Grid: Description & Highlights vs Products/Services */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center text-foreground">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  Company Story & Experience
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {currentCompany.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 text-foreground">Key Pillars & Highlights</h3>
                <div className="space-y-2.5">
                  {currentCompany.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-card/40 border border-border/50">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{currentCompany.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Est. {currentCompany.established}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{currentCompany.phone}</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Offerings & Catalog */}
            <div className="lg:col-span-5 bg-card/70 rounded-xl p-6 border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-4 text-foreground flex items-center">
                  <Award className="w-5 h-5 text-primary mr-2" />
                  Core Offerings & Catalog
                </h3>
                <ul className="space-y-3 mb-6">
                  {currentCompany.productsServices.map((ps, idx) => (
                    <li key={idx} className="flex items-center justify-between p-2.5 rounded-md bg-background/50 border border-border/40 text-sm font-medium text-foreground">
                      <span>{ps}</span>
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0">Available</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                {currentCompany.mapUrl && (
                  <Button 
                    className="w-full bg-[#4285F4] hover:bg-[#357AE8] text-white flex items-center justify-center gap-2"
                    onClick={() => window.open(currentCompany.mapUrl, '_blank')}
                  >
                    <MapPin className="w-4 h-4" />
                    Locate on Google Maps
                  </Button>
                )}
                <Link to="/contact">
                  <Button variant="outline" className="w-full border-border">
                    Get Free Quote from {currentCompany.name.split(" ")[0]}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="w-full border-border">
                    Learn More in About Section
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center p-8 rounded-2xl glass border border-border">
          <h3 className="text-2xl font-bold mb-2">Need Complete End-to-End Construction?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            From raw materials supplied by Satyawati Devi Hardware to modern turnkey construction by Butwal Construction & Builders.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/tools">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Construction Tools & Apps
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-border">
                View Completed Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
