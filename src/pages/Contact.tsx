import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Send, MessageCircle, CheckCircle2, Clock, Sparkles, Shield, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DualPresenceMap } from "@/components/DualPresenceMap";
import { motion } from "motion/react";
import { useNepalBusinessStatus } from "@/hooks/useNepalBusinessStatus";

export const Contact = () => {
  const { toast } = useToast();
  const businessStatus = useNepalBusinessStatus();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Butwal, Rupandehi",
    serviceInterest: "Turnkey House Construction",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Consultation Request Received!",
      description: "Our Senior Civil Engineer will contact you within 24 hours.",
    });

    const text = `*New Website Consultation Request*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email || 'N/A'}\n*Project Location:* ${formData.location}\n*Interested In:* ${formData.serviceInterest}\n*Message:* ${formData.message}`;
    
    // Direct WhatsApp trigger
    window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(text)}`, '_blank');
    
    setFormData({ name: "", email: "", phone: "", location: "Butwal, Rupandehi", serviceInterest: "Turnkey House Construction", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl space-y-12 relative z-10">
        {/* Header with Liquid Glass Capsule & Dynamic Entry */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-ios-pill border border-white/20 text-rose-300 text-xs sm:text-sm font-bold shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Dual Engineering Hubs in Butwal & Dang</span>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
            Connect with <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Our Engineers</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Schedule a complimentary on-site plot visit, discuss 3D architectural elevations, calculate municipal permit costs, or review your building BOQ with our licensed engineers.
          </p>
        </motion.div>

        {/* Interactive Dual Presence Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <DualPresenceMap />
        </motion.div>

        {/* Contact Form & Consultation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Quick Info & Working Hours */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <Card className="glass-ios p-6 sm:p-7 rounded-[28px] border-white/15 shadow-2xl space-y-6 backdrop-blur-2xl">
              <div>
                <Badge className="bg-primary/20 text-rose-300 border-white/15 font-bold mb-2.5 px-3 py-1">Direct Line</Badge>
                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Immediate Assistance</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Have an urgent construction or drawing inquiry? Reach our central desk directly.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-muted-foreground border-t border-white/10 pt-4">
                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold">Engineering Hotlines:</strong>
                    <span className="text-muted-foreground font-medium">+977 9857076965 / +977 9763653181</span>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold">Official Communications:</strong>
                    <span className="text-muted-foreground font-medium">info@butwalconstruction.com.np</span>
                  </div>
                </motion.div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <strong className="text-foreground font-bold">Working Hours</strong>
                    </div>
                    <Badge className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      businessStatus.isOpen 
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20" 
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    }`}>
                      {businessStatus.isOpen ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Open Now
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {businessStatus.statusText}
                        </span>
                      )}
                    </Badge>
                  </div>
                  <span className="block text-xs text-muted-foreground pl-10">Sunday – Friday: 9:00 AM – 6:00 PM (Saturday on Appointment)</span>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10 pl-10">
                    <span className={`font-semibold ${businessStatus.isOpen ? "text-emerald-400" : "text-amber-400"}`}>
                      {businessStatus.statusDetail}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {businessStatus.currentTimeFormatted}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Button 
                    size="lg" 
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 h-12"
                    onClick={() => window.open('https://wa.me/9779763653181?text=Namaste! I would like to inquire about construction services.', '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Direct WhatsApp Chat
                  </Button>
                </motion.div>
              </div>
            </Card>

            {/* Quality Guarantee Box */}
            <Card className="glass-ios p-6 rounded-[28px] border-white/15 space-y-3">
              <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Why Consult Butwal Construction & Builders?
              </h4>
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-rose-300 font-bold flex items-center justify-center shrink-0 text-[10px]">✓</span>
                  <span><strong>100% NBC 105:2020 Compliance:</strong> Complete seismic structural durability guarantee.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-rose-300 font-bold flex items-center justify-center shrink-0 text-[10px]">✓</span>
                  <span><strong>Direct Material Supply:</strong> Backed by Satyawati Devi Hardware for authentic Grade 53 cement & Fe 500D steel.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-rose-300 font-bold flex items-center justify-center shrink-0 text-[10px]">✓</span>
                  <span><strong>Dual-Valley Team:</strong> Dedicated on-ground civil engineers stationed in both Butwal and Dang.</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Consultation Form Column */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <Card className="glass-ios p-6 sm:p-9 rounded-[32px] border-white/20 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              {/* Subtle inner top glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary/20 text-rose-300 border-white/15 font-bold text-xs px-3 py-1">Online Booking</Badge>
                  <span className="text-xs text-muted-foreground">• Fast 24-hr response</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 tracking-tight">Book a Free Consultation</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
                  Tell us about your land or building idea. Our Senior Civil Engineer will get in touch with preliminary estimates.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-semibold text-xs sm:text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Ramesh Karki"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="glass-ios-input h-12 rounded-2xl border-white/10 px-4 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-semibold text-xs sm:text-sm">Phone / WhatsApp *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. 98570XXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="glass-ios-input h-12 rounded-2xl border-white/10 px-4 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-semibold text-xs sm:text-sm">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="glass-ios-input h-12 rounded-2xl border-white/10 px-4 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-foreground font-semibold text-xs sm:text-sm">Project Location *</Label>
                      <select
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-2xl glass-ios-input border-white/10 text-sm text-foreground focus:ring-2 focus:ring-primary/60 outline-none cursor-pointer"
                      >
                        <option value="Butwal, Rupandehi" className="bg-slate-900 text-white">Butwal, Rupandehi</option>
                        <option value="Tilottama, Rupandehi" className="bg-slate-900 text-white">Tilottama, Rupandehi</option>
                        <option value="Ghorahi, Dang" className="bg-slate-900 text-white">Ghorahi, Dang</option>
                        <option value="Tulsipur, Dang" className="bg-slate-900 text-white">Tulsipur, Dang</option>
                        <option value="Lamahi, Dang" className="bg-slate-900 text-white">Lamahi, Dang</option>
                        <option value="Other Dang Valley" className="bg-slate-900 text-white">Other Dang Valley</option>
                        <option value="Other Western Nepal" className="bg-slate-900 text-white">Other Western Nepal</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceInterest" className="text-foreground font-semibold text-xs sm:text-sm">Service Required *</Label>
                      <select
                        id="serviceInterest"
                        value={formData.serviceInterest}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-2xl glass-ios-input border-white/10 text-sm text-foreground focus:ring-2 focus:ring-primary/60 outline-none cursor-pointer"
                      >
                        <option value="Turnkey House Construction" className="bg-slate-900 text-white">Turnkey House Construction</option>
                        <option value="3D Architectural House Design" className="bg-slate-900 text-white">3D Architectural House Design</option>
                        <option value="Commercial Complex Construction" className="bg-slate-900 text-white">Commercial Complex Construction</option>
                        <option value="Estimate & BOQ Calculation" className="bg-slate-900 text-white">Estimate & BOQ Calculation</option>
                        <option value="Municipal Naksa Pass" className="bg-slate-900 text-white">Municipal Naksa Pass</option>
                        <option value="Renovation / Additional Floor" className="bg-slate-900 text-white">Renovation / Additional Floor</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground font-semibold text-xs sm:text-sm">Project Details / Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your plot size, number of floors, preferred timeline..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="glass-ios-input resize-none rounded-2xl border-white/10 p-4 text-sm"
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl shadow-xl shadow-primary/30 mt-2">
                      <Send className="mr-2 h-4 w-4" />
                      Send Request & Connect on WhatsApp
                    </Button>
                  </motion.div>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free Initial Land & Plot Inspection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero Obligation Cost Estimation</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


