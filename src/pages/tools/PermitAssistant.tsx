import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Users, 
  Phone,
  Search,
  Landmark,
  ShieldCheck
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MunicipalityItem {
  name: string;
  nepaliName: string;
  contact: string;
  location: string;
  district: "Dang" | "Rupandehi" | "Kapilvastu";
  ebpsSupported: boolean;
  bylawNotes: string;
}

const PermitAssistant = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const municipalities: MunicipalityItem[] = [
    // Dang District Municipalities
    { 
      name: "Ghorahi Sub-Metropolitan City", 
      nepaliName: "घोराही उपमहानगरपालिका",
      contact: "082-560124 / 082-560244", 
      location: "Ghorahi, Dang", 
      district: "Dang",
      ebpsSupported: true,
      bylawNotes: "Mandatory EBPS online naksa pass system for all 19 wards. Setback 1.5m standard residential."
    },
    { 
      name: "Tulsipur Sub-Metropolitan City", 
      nepaliName: "तुलसीपुर उपमहानगरपालिका",
      contact: "082-520155 / 082-520108", 
      location: "Tulsipur, Dang", 
      district: "Dang",
      ebpsSupported: true,
      bylawNotes: "Electronic Building Permit System active. Airport flight-path height restrictions near Tarigaun (Ward 12)."
    },
    { 
      name: "Lamahi Municipality", 
      nepaliName: "लमही नगरपालिका",
      contact: "082-540134 / 082-540200", 
      location: "Lamahi, Dang (Deukhuri Valley)", 
      district: "Dang",
      ebpsSupported: true,
      bylawNotes: "Highway corridor building regulations along East-West Highway. 31m highway center-line setback."
    },
    { 
      name: "Rapti Rural Municipality (Bhalubang)", 
      nepaliName: "राप्ती गाउँपालिका (लुम्बिनी प्रदेश राजधानी)",
      contact: "082-580123 / 082-580155", 
      location: "Bhalubang, Dang (Provincial Capital Zone)", 
      district: "Dang",
      ebpsSupported: true,
      bylawNotes: "Lumbini Provincial Capital Special Planning Bylaws apply. Planned urban road widths and green buffers."
    },
    { 
      name: "Gadawa Rural Municipality", 
      nepaliName: "गढवा गाउँपालिका",
      contact: "082-580045", 
      location: "Gadawa, Dang (Deukhuri)", 
      district: "Dang",
      ebpsSupported: false,
      bylawNotes: "Physical Naksa Pass verification with ward engineer field survey recommendation."
    },
    { 
      name: "Shantinagar Rural Municipality", 
      nepaliName: "शान्तिनगर गाउँपालिका",
      contact: "082-690112", 
      location: "Shantinagar, Dang", 
      district: "Dang",
      ebpsSupported: false,
      bylawNotes: "Standard NBC 205 RCC guideline compliance for residential builds."
    },

    // Rupandehi District Municipalities
    { 
      name: "Butwal Sub-Metropolitan City", 
      nepaliName: "बुटवल उपमहानगरपालिका",
      contact: "071-540294 / 071-540145", 
      location: "Butwal, Rupandehi", 
      district: "Rupandehi",
      ebpsSupported: true,
      bylawNotes: "Mandatory EBPS. Minimum 1.5m setback, soil test mandatory for >2 storeys. Riverbank buffer on Tinau."
    },
    { 
      name: "Tilottama Municipality", 
      nepaliName: "तिलोत्तमा नगरपालिका",
      contact: "071-590123 / 071-590155", 
      location: "Tilottama, Rupandehi (Manigram / Kotihawa)", 
      district: "Rupandehi",
      ebpsSupported: true,
      bylawNotes: "Green City bylaws: Mandatory 2 trees plantation inside plot boundary, rooftop solar provision."
    },
    { 
      name: "Siddharthanagar Municipality", 
      nepaliName: "सिद्धार्थनगर नगरपालिका (भैरहवा)",
      contact: "071-520145 / 071-525678", 
      location: "Bhairahawa, Rupandehi", 
      district: "Rupandehi",
      ebpsSupported: true,
      bylawNotes: "Gautam Buddha International Airport funnel zone height limit compliance for commercial/hotels."
    },
    { 
      name: "Sainamaina Municipality", 
      nepaliName: "सैनामैना नगरपालिका",
      contact: "071-440123", 
      location: "Sainamaina, Rupandehi", 
      district: "Rupandehi",
      ebpsSupported: true,
      bylawNotes: "Standard residential and agricultural zoning setbacks enforced along Mahendra Highway."
    },
    { 
      name: "Devdaha Municipality", 
      nepaliName: "देवदह नगरपालिका",
      contact: "071-570145", 
      location: "Devdaha, Rupandehi", 
      district: "Rupandehi",
      ebpsSupported: true,
      bylawNotes: "Heritage archaeological preservation zone buffer around historical ancient Koliya kingdom sites."
    }
  ];

  const filteredMunicipalities = municipalities.filter((m) => {
    const matchesDistrict = selectedDistrict === "all" || m.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nepaliName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const permitWorkflow = [
    {
      step: 1,
      title: "Site Verification & Field Survey",
      description: "Municipality technical team verifies land ownership (Lalpurja), road width access, boundary pegs (Kitta No.), and takes physical GPS coordinates.",
      duration: "2-3 days",
      documents: ["Land Ownership (Lalpurja)", "Cadastral Map (Trace Naksa)", "Tax Clearance Receipt (Tiro Tirheko Rasid)"]
    },
    {
      step: 2,
      title: "EBPS Digital Architectural & Structural Design Submission",
      description: "Submit 2D floor plans, 4-side elevations, cross sections, structural design report (NBC 105:2020), and soil test (SBC) through the municipal EBPS portal.",
      duration: "7-15 days",
      documents: ["Architectural 2D/3D Drawings", "Structural Design & Calculation Book", "Soil Investigation Report", "Sanitary & Electrical Layout"]
    },
    {
      step: 3,
      title: "15-Day Public Notice & Neighbor Consent",
      description: "Ward Office issues a 15-day public notice (Sandhi Sarpanch Suchana) to adjacent land owners. Neighbors provide written consent or objections.",
      duration: "15 days",
      documents: [
        "Public Notice Form (15 Dine Suchana)",
        "Neighbor Consent Form (Sandhi Sarpanch Manjurinama)",
        "Ward Recommendation Letter (Sifarish)"
      ]
    },
    {
      step: 4,
      title: "Plinth Level Permit & Nirman Sampanna",
      description: "Municipality issues Plinth Level Temporary Permit (Dharauti/Ijaajat). After structural inspection at roof level, final Building Completion Certificate is granted.",
      duration: "3-5 days",
      documents: ["Municipality Fee Payment Voucher", "Plinth Inspection Report", "Final Completion Application (Nirman Sampanna)"]
    }
  ];

  const documentChecklist = [
    {
      category: "Land & Legal Ownership Documents",
      items: [
        "Land Ownership Certificate (Lalpurja original & copy)",
        "Cadastral Map Blueprint (Napi Trace / Field Book copy)",
        "Latest Land Revenue Tax Clearance (Malpot Tiro Rasid)",
        "Citizenship Certificates of Landowners (Nagarikta)",
        "Ward Office Recommendation Letter (Ghar Naksa Sifarish)"
      ]
    },
    {
      category: "Engineering & Technical Drawings",
      items: [
        "Architectural Drawings (Site plan, Floor plans, Elevations, Sections)",
        "Structural Analysis & Design Calculations (NBC 105:2020 code)",
        "Soil Bearing Capacity Investigation Report (SBC Borehole test)",
        "Concealed Electrical & Sanitary Plumbing Layout Diagrams",
        "Registered Engineer / Architect Council Registration (NEC Stamp)"
      ]
    },
    {
      category: "Municipal & Neighbor Approvals",
      items: [
        "15-Day Public Notice Acknowledgment Form",
        "Neighbor Boundary Consent / No-Objection Affidavit (Sandhi Sarpanch)",
        "Commitment Undertaking Letter (Kabuliyatnama by Builder/Owner)",
        "Environmental / Setback Compliance Clearance (if near river or highway)"
      ]
    },
    {
      category: "Post-Construction Handover Documents",
      items: [
        "As-Built Architectural Drawings (if deviations occurred)",
        "Supervising Structural Engineer Safety Certification",
        "Building Completion Certificate (Nirman Sampanna Pramanpatra)",
        "Drinking Water & Permanent 3-Phase Electricity Connection Sanction"
      ]
    }
  ];

  const buildingCodes = [
    {
      title: "Setbacks & Road Width Guidelines (Dang & Lumbini Province)",
      checks: [
        "Minimum 1.5m (5 feet) setback required from rear and side property lines",
        "Minimum road width: 6 meters for residential access, 8-12 meters for commercial zoning",
        "Highway Corridor Setback: 31m from center-line on Mahendra Highway / Rapti Highway (Lamahi/Bhalubang/Ghorahi)",
        "River & Stream Buffer: Minimum 10m to 15m from riverbanks (Tinau, Babai, Rapti rivers)"
      ]
    },
    {
      title: "Earthquake Safety & Structural NBC 105:2020 Compliance",
      checks: [
        "Mandatory seismic zone ductile detailing (IS 13920 / NBC 105:2020)",
        "Minimum column dimension: 12\"x12\" (300x300mm) for up to 2.5 storeys, 12\"x16\" for 3+ storeys",
        "Fe500D TMT high-ductility rebar with 135° inward seismic hooks on stirrups",
        "M20 / M25 design mix concrete with compulsory 14-21 days water curing"
      ]
    },
    {
      title: "Building Height & Floor Area Ratio (FAR)",
      checks: [
        "Residential zoning: Maximum 3.5 storeys standard without special high-rise NOC",
        "Commercial zoning: Maximum 5 to 7 storeys subject to road width and parking space",
        "Floor-to-floor height: Minimum 2.75m (9 ft) to Maximum 3.65m (12 ft)",
        "Tarigaun Airport (Tulsipur) flight path zone: Strict height restrictions enforced by CAAN"
      ]
    },
    {
      title: "Ventilation, Sanitation & Green Building Regulations",
      checks: [
        "Window light/ventilation area: Minimum 10% to 15% of carpet room area",
        "Underground rainwater harvesting or minimum 10,000L water reserve tank",
        "Septic tank & soak pit placement minimum 2m away from building foundations",
        "Tilottama Green City / Ghorahi Bylaw: Compulsory 2 fruit/ornamental trees inside boundary"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background pt-32 pb-20 px-4">
      {/* Liquid Ambient Iridescent Background Mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center animate-fade-in space-y-3">
          <Badge className="px-4 py-1.5 text-sm bg-primary/20 text-primary border-primary/30 font-medium">
            <Landmark className="w-4 h-4 mr-1.5 inline text-primary" />
            Nepal Municipal Permit & EBPS Naksa Pass Guide
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
            Building Permit <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Complete municipal building permits, EBPS digital Naksa Pass, neighbor consent, and NBC seismic code guidelines for <strong>Dang District (Ghorahi, Tulsipur, Lamahi, Rapti)</strong>, <strong>Rupandehi (Butwal, Tilottama, Bhairahawa)</strong>, and Lumbini Province.
          </p>
        </div>

        {/* Quick WhatsApp Consultation Card */}
        <Card className="glass border-primary/30 shadow-2xl p-6 md:p-8 relative overflow-hidden text-center space-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Need End-to-End Permit & Naksa Pass in Dang or Rupandehi?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2 text-sm md:text-base">
              Our registered structural engineers and municipal liasion specialists handle everything: site survey, 3D architectural design, soil testing, 15-day notice, EBPS submission, and final Nirman Sampanna certificate.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button 
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold shadow-lg"
              onClick={() => window.open('https://wa.me/9779763653181?text=Hello! I need assistance with municipal building permits / Naksa Pass for my plot in Dang / Rupandehi.', '_blank')}
            >
              <MessageCircle className="mr-2" size={20} />
              Chat with Permit Engineer on WhatsApp
            </Button>
          </div>
        </Card>

        {/* 1. MUNICIPALITY DIRECTORY WITH DANG DISTRICT INTEGRATION */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2.5">
                <MapPin className="w-7 h-7 text-primary" />
                Municipality & Ward Permit Directory
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Official contact numbers, EBPS digital status, and local bylaws for Dang and Rupandehi municipalities
              </p>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center glass p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setSelectedDistrict("all")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedDistrict === "all" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Districts
                </button>
                <button
                  onClick={() => setSelectedDistrict("dang")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedDistrict === "dang" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dang District (दाङ)
                </button>
                <button
                  onClick={() => setSelectedDistrict("rupandehi")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedDistrict === "rupandehi" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Rupandehi (रुपन्देही)
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search municipality (e.g. Ghorahi, Tulsipur)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl glass border border-white/15 text-foreground bg-transparent w-full sm:w-64 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMunicipalities.map((municipality, index) => (
              <Card key={index} className="glass border-white/10 shadow-lg p-5 hover-lift flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
                        {municipality.name}
                      </h3>
                      <div className="text-xs text-primary font-medium mt-0.5">
                        {municipality.nepaliName}
                      </div>
                    </div>
                    <Badge variant={municipality.district === "Dang" ? "default" : "secondary"} className="text-[11px] flex-shrink-0">
                      {municipality.district}
                    </Badge>
                  </div>

                  <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="font-semibold text-foreground">{municipality.contact}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{municipality.location}</span>
                    </div>
                    <div className="flex items-center text-xs gap-2 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-[11px] text-muted-foreground">
                        EBPS Portal: {municipality.ebpsSupported ? (
                          <span className="text-emerald-400 font-semibold">Active Online</span>
                        ) : (
                          <span className="text-amber-400 font-semibold">Ward Physical Verification</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Local Bylaw: </span>
                    {municipality.bylawNotes}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => window.open(`https://wa.me/9779763653181?text=Hello! I need Naksa Pass & Building Permit assistance in ${municipality.name}, ${municipality.location}.`, '_blank')}
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Inquire for {municipality.name}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* 2. 4-STEP PERMIT WORKFLOW */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Nepal Standard <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Permit Workflow</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step-by-step statutory lifecycle from preliminary survey to final Nirman Sampanna
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {permitWorkflow.map((step, index) => (
              <Card key={index} className="glass border-white/10 shadow-lg p-6 hover-lift relative flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-lg font-black shadow-md mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                </div>
                
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center text-xs text-primary font-semibold">
                    <Clock className="mr-1.5 w-3.5 h-3.5" />
                    <span>Estimated: {step.duration}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-foreground">Key Documents:</div>
                    {step.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={12} />
                        <span className="text-[11px] text-muted-foreground">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 3. DOCUMENT CHECKLIST */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Comprehensive <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Document Checklist</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ensure you have these statutory papers ready before municipal application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentChecklist.map((category, index) => (
              <Card key={index} className="glass border-white/10 shadow-lg p-6 hover-lift">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-white/10">
                  <FileText className="text-primary w-6 h-6" />
                  <h3 className="text-lg font-bold text-foreground">{category.category}</h3>
                </div>
                <div className="space-y-2.5">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-xs md:text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. BUILDING CODE & NBC SEISMIC COMPLIANCE */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Building Code & <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">NBC Compliance</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Nepal National Building Code (NBC 105:2020) and municipal zoning bylaws
            </p>
          </div>

          <Card className="glass border-white/10 shadow-lg p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {buildingCodes.map((code, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10">
                  <AccordionTrigger className="text-base md:text-lg font-bold text-foreground hover:text-primary">
                    <div className="flex items-center space-x-2.5">
                      <Building2 className="text-primary w-5 h-5" />
                      <span>{code.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                      {code.checks.map((check, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 p-3 bg-white/5 rounded-xl border border-white/5">
                          <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-xs text-muted-foreground leading-relaxed">{check}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PermitAssistant;
