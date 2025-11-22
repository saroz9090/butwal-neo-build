import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, AlertCircle, Building2, MessageCircle, MapPin, Clock, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PermitAssistant = () => {
  const municipalities = [
    { name: "Butwal Sub-Metropolitan", contact: "071-540294", location: "Butwal" },
    { name: "Bhairahawa Municipality", contact: "071-520145", location: "Rupandehi" },
    { name: "Tilottama Municipality", contact: "071-590123", location: "Rupandehi" },
    { name: "Siddharthanagar Municipality", contact: "071-525678", location: "Rupandehi" }
  ];

  const permitWorkflow = [
  {
    step: 1,
    title: "Site Verification",
    description: "The municipality verifies your land ownership and conducts an on-site inspection to confirm the location and boundaries of the property.",
    duration: "2-3 days",
    documents: ["Land ownership certificate", "Site photos", "Survey map"]
  },
  {
    step: 2,
    title: "Design Approval",
    description: "Submit architectural and structural designs, along with cadastral extracts and required certifications, to the municipality for approval.",
    duration: "7-15 days",
    documents: ["Architectural drawings", "Structural drawings", "Plumbing & electrical plans"]
  },
  {
    step: 3,
    title: "15-Day Public Notice",
    description: "The Ward Office sends a public notice to the site’s neighbors to inform them about the proposed house construction. This notice period lasts 15 days, allowing neighbors to give feedback or objections before approval proceeds. The local inquiry starts after the notice period to finalize consent.",
    duration: "15 days",
    documents: [
      "Public Notice Form",
      "Proof of Land Ownership / Title Certificate",
      "Neighbor Acknowledgment / Consent Form/ Commitment letter"
    ]
  },
  {
    step: 4,
    title: "Permit Issuance",
    description: "After the notice period and local inquiry, the municipality issues the temporary or permanent building permit, allowing construction to proceed upto the plinth level. At least one neighbor must consent, or a commitment letter can be submitted by the builder to handle potential disputes.",
    duration: "3-5 days",
    documents: ["Payment receipts", "All approved drawings", "Commitment Letter / Neighbor Consent"]
  }
  ];

  const documentChecklist = [
    {
      category: "Land Documents",
      items: [
        "Land ownership certificate (Lalpurja)",
        "Tax clearance certificate",
        "Survey map (Naksha Pass)"
      ]
    },
    {
      category: "Design Documents",
      items: [
        "Site plan",
        "Floor plans for all levels",
        "Elevation drawings (all sides)",
        "Structural design with calculations",
        "Plumbing layout",
        "Electrical layout"
      ]
    },
    {
      category: "Legal Documents",
      items: [
        "Citizenship certificate of owner",
        "Tax clearance certificate",
        "Building permit application form"
      ]
    },
    {
      category: "Technical Documents",
      items: [
        "Structural engineer certificate",
        "Architect registration certificate",
        "Construction schedule"
      ]
    }
  ];

  const buildingCodes = [
    {
      title: "Building Height Restrictions",
      checks: [
        "Maximum 4 floors in residential areas",
        "Maximum 7 floors in commercial areas",
        "Minimum setback: 1.5m from property line",
        "Floor-to-floor height: 2.75m to 3.35m"
      ]
    },
    {
      title: "Earthquake Safety (NBC)",
      checks: [
        "Seismic zone V compliance required",
        "Use of reinforced concrete frame structure",
        "Proper foundation depth (minimum 2.5m)",
        "Column size: minimum 14\"x14\" for residential"
      ]
    },
    {
      title: "Fire Safety Requirements",
      checks: [
        "Two staircases for buildings above 15m",
        "Fire extinguishers on each floor",
        "Emergency exit signage",
        "Fire-resistant materials for high-rise"
      ]
    },
    {
      title: "Ventilation & Lighting",
      checks: [
        "Window area: minimum 10% of floor area",
        "Natural ventilation in all habitable rooms",
        "Kitchen ventilation mandatory",
        "Bathroom exhaust system required"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Building Permit <span className="text-primary">Assistant</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Navigate Nepal's building permit process with confidence
          </p>
        </div>

        {/* Quick Contact */}
        <Card className="glass p-6 mb-12 text-center">
          <h3 className="text-xl font-bold mb-3">Need Help with Permits?</h3>
          <p className="text-muted-foreground mb-4">Our experts can guide you through the entire permit process</p>
          <Button 
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            onClick={() => window.open('https://wa.me/9779763653181?text=Hello! I need help with building permits in Nepal.', '_blank')}
          >
            <MessageCircle className="mr-2" size={20} />
            Get Permit Assistance
          </Button>
        </Card>

        {/* Permit Workflow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Nepal Permit <span className="text-primary">Workflow</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {permitWorkflow.map((step, index) => (
              <Card key={index} className="glass p-6 hover-lift relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-background">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                <div className="flex items-center text-sm text-primary mb-4">
                  <Clock className="mr-2" size={16} />
                  <span>{step.duration}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-foreground">Required:</div>
                  {step.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-xs text-muted-foreground">{doc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Document Checklist */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Document <span className="text-primary">Checklist</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentChecklist.map((category, index) => (
              <Card key={index} className="glass p-6 hover-lift">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="text-primary" size={24} />
                  <h3 className="text-xl font-bold text-foreground">{category.category}</h3>
                </div>
                <div className="space-y-3">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Building Code Compliance */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Building Code <span className="text-primary">Compliance</span>
          </h2>
          <Card className="glass p-8">
            <Accordion type="single" collapsible className="w-full">
              {buildingCodes.map((code, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                    <div className="flex items-center space-x-2">
                      <Building2 className="text-primary" size={20} />
                      <span>{code.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {code.checks.map((check, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                          <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={18} />
                          <span className="text-sm text-muted-foreground">{check}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        {/* Municipality Contact Directory */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Municipality <span className="text-primary">Directory</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {municipalities.map((municipality, index) => (
              <Card key={index} className="glass p-6 hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-primary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{municipality.name}</h3>
                      <Badge variant="secondary">{municipality.location}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users size={16} />
                  <span className="text-sm">{municipality.contact}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermitAssistant;
