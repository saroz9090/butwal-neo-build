import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, MessageCircle, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind? Let's discuss how we can help bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="glass p-6 hover-lift bg-[#25D366]/10 border-[#25D366]/30">
              <a 
                href="https://wa.me/9779763653181" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start space-x-4 group"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">WhatsApp (Primary)</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    +977 976-3653181<br />
                    <span className="text-[#25D366]">Click to chat instantly →</span>
                  </p>
                </div>
              </a>
            </Card>

            <Card className="glass p-6 hover-lift">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Phone Numbers</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Main: +977 986-9472803</p>
                    <p>Office: +977 984-5323733</p>                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 hover-lift">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Corporate Office</h3>
                  <p className="text-sm text-muted-foreground">
                    Butwal, Rupandehi<br />
                    Lumbini Province, Nepal
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 hover-lift">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Branch Office</h3>
                  <p className="text-sm text-muted-foreground">
                    Tilottama, Rupandehi<br />
                    Lumbini Province, Nepal
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass p-6 hover-lift">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    info@butwalconstruction.com.np<br />
                    contact@butwalconstruction.com.np
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass p-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="glass border-primary/30 focus:border-primary h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="glass border-primary/30 focus:border-primary h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+977 XXX-XXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="glass border-primary/30 focus:border-primary h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="glass border-primary/30 focus:border-primary min-h-[150px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-foreground text-lg h-12 glow"
                >
                  Send Message
                  <Send className="ml-2" size={20} />
                </Button>
              </form>
            </Card>

            {/* Maps Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Corporate Office Map */}
              <Card className="glass p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Building2 className="text-primary mr-2" size={20} />
                  Corporate Office
                </h3>
                <div className="rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4227.960981535822!2d83.45782297602071!3d27.678082426780524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996876f7cb0d98d%3A0x3d0680af047da6ea!2sButwal%20Construction%20and%20Builders!5e1!3m2!1sen!2snp!4v1763057870654!5m2!1sen!2snp" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0 }}
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Butwal, Rupandehi • Lumbini Province, Nepal
                </p>
              </Card>

              {/* Branch Office Map */}
              <Card className="glass p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Building2 className="text-primary mr-2" size={20} />
                  Branch Office - Tilottama
                </h3>
                <div className="rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1440.0011504050315!2d83.47247002740629!3d27.61918719670161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399685796f0e443d%3A0xa678f71a16d2cf2d!2sButwal%20Construction%20and%20Builders%20-%20Tilottama!5e1!3m2!1sen!2snp!4v1763058014296!5m2!1sen!2snp" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0 }}
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Tilottama, Rupandehi • Lumbini Province, Nepal
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <Card className="glass p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Business Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div>
              <p className="text-muted-foreground">Sunday - Friday</p>
              <p className="text-foreground font-semibold">9:00 AM - 6:00 PM</p>
            </div>
            <div>
              <p className="text-muted-foreground">Saturday</p>
              <p className="text-foreground font-semibold">9:00 AM - 2:00 PM</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;