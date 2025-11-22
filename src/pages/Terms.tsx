import { Card } from "@/components/ui/card";
import { FileText, Scale, Shield, AlertTriangle, BookOpen, Mail, Phone } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-primary" size={32} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Terms & <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before using our services
          </p>
        </div>

        {/* Last Updated */}
        <Card className="glass p-6 mb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </Card>

        <div className="space-y-8">
          {/* Introduction */}
          <Card className="glass p-8 hover-lift">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Welcome to Butwal Construction & Builders. These Terms and Conditions govern your use of 
                our website, services, and all related construction estimation tools, consultation services, 
                and project management features.
              </p>
              <p>
                By accessing or using our services, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access our services.
              </p>
            </div>
          </Card>

          {/* Services Description */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Services Description</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Butwal Construction & Builders provides construction estimation services, project planning, 
                3D visualization tools, and construction consulting services through our digital platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Estimation Tools</h4>
                  <p className="text-sm">Automated cost calculators and material estimators</p>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Consultation</h4>
                  <p className="text-sm">Professional construction advice and guidance</p>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Project Planning</h4>
                  <p className="text-sm">Timeline development and project management</p>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">3D Visualization</h4>
                  <p className="text-sm">Interactive project previews and designs</p>
                </div>
              </div>
            </div>
          </Card>

          {/* User Responsibilities */}
          <Card className="glass p-8 hover-lift">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Scale className="text-accent" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">User Responsibilities</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Account Security</h3>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Maintain the confidentiality of your account credentials
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Notify us immediately of any unauthorized access
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    You are responsible for all activities under your account
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Accurate Information</h3>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Provide accurate and complete project information
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Update information as project requirements change
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Ensure compliance with local building codes and regulations
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Proper Use</h3>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Use services only for lawful purposes
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Do not attempt to disrupt or compromise our systems
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Respect intellectual property rights
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Intellectual Property */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Intellectual Property</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                All content, features, and functionality on our platform, including but not limited to 
                text, graphics, logos, images, software, and source code, are owned by Butwal Construction 
                & Builders and are protected by international copyright, trademark, and other intellectual 
                property laws.
              </p>
              <div className="bg-accent/5 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">License Grant</h4>
                <p className="text-sm">
                  We grant you a limited, non-exclusive, non-transferable license to access and use 
                  our services for personal, non-commercial purposes subject to these terms.
                </p>
              </div>
            </div>
          </Card>

          {/* Payment Terms */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Payment Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Free Services</h4>
                  <p className="text-sm">Basic estimation tools and consultations are free</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Premium Services</h4>
                  <p className="text-sm">Advanced features may require payment</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Payment Methods</h4>
                  <p className="text-sm">We accept various payment methods as displayed</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Refund Policy</h4>
                  <p className="text-sm">Refunds are processed according to our policy</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Disclaimer of Warranties */}
          <Card className="glass p-8 hover-lift">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-accent" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Disclaimer of Warranties</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our services are provided "as is" and "as available" without any warranties of any kind, 
                either express or implied. We do not warrant that:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  The services will meet your specific requirements
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  The services will be uninterrupted, timely, or error-free
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  The results obtained from using our services will be accurate or reliable
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  The quality of any services will meet your expectations
                </li>
              </ul>
              <p className="mt-4">
                Construction estimates provided are approximations and actual costs may vary based on 
                market conditions, material availability, and specific project requirements.
              </p>
            </div>
          </Card>

          {/* Limitation of Liability */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Limitation of Liability</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                To the fullest extent permitted by applicable law, Butwal Construction & Builders shall 
                not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Financial Loss</h4>
                  <p className="text-sm">Loss of profits, revenue, or business opportunities</p>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Data Loss</h4>
                  <p className="text-sm">Loss or corruption of data or information</p>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Service Issues</h4>
                  <p className="text-sm">Service interruptions or termination</p>
                </div>
                <div className="bg-accent/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Third Parties</h4>
                  <p className="text-sm">Conduct of any third party using our services</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Indemnification */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Indemnification</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                You agree to defend, indemnify, and hold harmless Butwal Construction & Builders and its 
                affiliates, officers, directors, employees, and agents from and against any claims, 
                liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of 
                or relating to your violation of these Terms and Conditions or your use of our services.
              </p>
            </div>
          </Card>

          {/* Termination */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Termination</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may terminate or suspend your access to our services immediately, without prior notice 
                or liability, for any reason whatsoever, including without limitation if you breach these 
                Terms and Conditions.
              </p>
              <p>
                Upon termination, your right to use our services will cease immediately. All provisions 
                of these Terms which by their nature should survive termination shall survive termination, 
                including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </div>
          </Card>

          {/* Governing Law */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Governing Law</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                These Terms and Conditions shall be governed and construed in accordance with the laws of 
                Nepal, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms and Conditions or your use of our services shall be 
                subject to the exclusive jurisdiction of the courts located in Butwal, Nepal.
              </p>
            </div>
          </Card>

          {/* Changes to Terms */}
          <Card className="glass p-8 hover-lift">
            <h2 className="text-2xl font-bold text-foreground mb-6">Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days' notice prior to any new terms 
                taking effect.
              </p>
              <p>
                What constitutes a material change will be determined at our sole discretion. By continuing 
                to access or use our services after those revisions become effective, you agree to be bound 
                by the revised terms.
              </p>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="glass p-8 hover-lift text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-accent/5 p-4 rounded-lg">
                <Mail className="text-accent mx-auto mb-2" size={20} />
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">info@butwalconstruction.com</p>
              </div>
              <div className="bg-accent/5 p-4 rounded-lg">
                <Phone className="text-accent mx-auto mb-2" size={20} />
                <p className="text-sm font-medium">Phone</p>
                <p className="text-xs text-muted-foreground">+977 9845323733</p>
              </div>
            </div>
          </Card>

          {/* Final Note */}
          <Card className="glass p-6 mt-8">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Note:</strong> These Terms and Conditions constitute 
              the entire agreement between you and Butwal Construction & Builders regarding our services 
              and supersede all prior agreements and understandings.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;