import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, FileText, Phone, Mail, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-semibold mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span>Data Protection & Client Security</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading mb-4 text-foreground">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            How Butwal Construction & Builders protects your personal data, house plans, and property information.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Commitment Card */}
          <Card className="glass p-6 sm:p-8 border-border/60 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Our Privacy Commitment</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              At <strong>Butwal Construction & Builders Pvt. Ltd.</strong> (and our regional branch <strong>Dang Construction & Builders</strong>), we respect and protect your privacy. When you request construction cost estimates, 3D elevation drawings, municipal Naksa Pass permits, or site inspections, your personal and architectural details are handled with strict engineering confidentiality.
            </p>
          </Card>

          {/* Information We Collect */}
          <Card className="glass p-6 sm:p-8 border-border/60 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Information We Collect</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
              <p>To provide accurate civil engineering, estimation, and turnkey construction services, we collect:</p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span><strong>Contact Details:</strong> Full name, phone number, WhatsApp number, and email address.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span><strong>Project & Property Specifications:</strong> Land location (ward/municipality), plot area (Aana/Dhur/Sq. Ft.), soil type, and preferred floor count.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span><strong>Architectural & Structural Preferences:</strong> 3D elevation preferences, budget targets, and custom floor planner layout drafts.</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* How We Use Your Information */}
          <Card className="glass p-6 sm:p-8 border-border/60 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">How We Use Your Information</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
              <p>Your details are used exclusively for:</p>
              <ul className="space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>Generating customized Bill of Quantities (BOQ) and rate estimations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>Coordinating free site visits with civil engineers in Butwal, Rupandehi, or Dang Valley.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>Submitting Naksa Pass permit documents to local municipal sub-metropolises upon client authorization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  <span>Delivering construction milestone reports and photo updates for your project.</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Data Protection & Security */}
          <Card className="glass p-6 sm:p-8 border-border/60 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Zero Third-Party Sharing</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We never sell, rent, or lease client personal contact details or house blueprints to third-party marketing companies. All blueprints, land certificates (Lalpurja copies submitted for municipal Naksa Pass), and structural calculations are archived in encrypted systems strictly accessible by our certified engineering team.
            </p>
          </Card>

          {/* Contact Details & Grievances */}
          <Card className="glass p-6 sm:p-8 border-primary/40 bg-gradient-to-br from-card via-primary/5 to-transparent hover-lift">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Privacy Inquiries & Official Contact</h2>
            <p className="text-sm text-muted-foreground mb-6">
              If you have any questions regarding how your project data is handled, feel free to contact our head office directly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-2">
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">Head Office</Badge>
                <h4 className="font-bold text-foreground">Butwal Construction & Builders</h4>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Butwal-11, Kalikanagar, Horizonchowk, Annapurna Path, Rupandehi, Nepal</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>+977 9857076965 / +977 9869472803</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-2">
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">Regional Branch</Badge>
                <h4 className="font-bold text-foreground">Dang Construction & Builders</h4>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Ghorahi-15, Main Road, Dang, Nepal</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>+977 9763653181</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-border/40">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>info@butwalconstruction.com.np</span>
              </p>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Link to="/contact">
                  Contact Support <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
