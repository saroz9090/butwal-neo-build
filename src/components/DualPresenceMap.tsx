import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Navigation, 
  Clock, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useNepalBusinessStatus } from "@/hooks/useNepalBusinessStatus";

export interface DualPresenceMapProps {
  compact?: boolean;
}

export const DualPresenceMap = ({ compact = false }: DualPresenceMapProps) => {
  const [selectedHub, setSelectedHub] = useState<"butwal" | "dang">("butwal");
  const businessStatus = useNepalBusinessStatus();

  const locations = {
    butwal: {
      id: "butwal",
      name: "Butwal Head Office",
      companyName: "Butwal Construction & Builders Pvt. Ltd.",
      badge: "Corporate Headquarters (Established Flagship)",
      badgeColor: "bg-primary/20 text-rose-300 border-primary/40",
      timing: "Sunday - Friday: 9:00 AM - 6:00 PM",
      address: "Butwal-11, Kalikanagar, Horizonchowk, Annapurna Path, Rupandehi, Nepal",
      shortAddress: "Butwal-11, Kalikanagar, Horizonchowk",
      phone: "+977 9857076965",
      altPhone: "+977 9869472803",
      email: "info@butwalconstruction.com.np",
      whatsappText: "Namaste! I want to visit/consult the Butwal Head Office.",
      mapQuery: "Butwal-11, Kalikanagar, Rupandehi, Nepal",
      directionUrl: "https://maps.app.goo.gl/VTb2oEUmRSjk5jhV9",
      teamLead: "Er. Ramesh Karki (Senior Structural Engineer)",
      coverage: [
        "Butwal Sub-Metropolitan (Wards 1-19)",
        "Tilottama Municipality (Drivertole, Manigram, Bhalwari)",
        "Sainamaina & Devdaha Municipalities",
        "Bhairahawa & Lumbini Special Economic Zone"
      ],
      highlights: [
        "In-house Structural & Architectural CAD Lab",
        "Direct Coordination with Satyawati Devi Hardware",
        "Full Turnkey Project Management Team"
      ],
      stats: {
        completed: "350+",
        activeSites: "24",
        engineers: "18"
      },
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7937397705137!2d83.46513477531766!3d27.69275147619069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996868832a84d41%3A0xb35a0cb0aa3c9597!2sKalikanagar%2C%20Butwal!5e0!3m2!1sen!2snp!4v1723434343435!5m2!1sen!2snp"
    },
    dang: {
      id: "dang",
      name: "Dang Regional Branch",
      companyName: "Dang Construction & Builders",
      badge: "Regional Expansion Branch (Dang Valley)",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      timing: "Sunday - Friday: 9:00 AM - 6:00 PM",
      address: "Ghorahi-15, Main Road, Dang Valley, Nepal",
      shortAddress: "Ghorahi-15, Main Road, Dang",
      phone: "+977 9763653181",
      altPhone: "+977 9857076965",
      email: "dang@butwalconstruction.com.np",
      whatsappText: "Namaste! I want to consult the Dang Branch engineers.",
      mapQuery: "Ghorahi-15, Main Road, Dang, Nepal",
      directionUrl: "https://maps.app.goo.gl/x2hAah1ff7CiCU1i7",
      teamLead: "Er. Bikash Sharma (Regional Project Manager)",
      coverage: [
        "Ghorahi Sub-Metropolitan City",
        "Tulsipur Sub-Metropolitan City",
        "Lamahi Municipality & Deukhuri Valley",
        "Bhalubang (Lumbini Provincial Capital Corridor)"
      ],
      highlights: [
        "Dedicated Dang Valley Site Engineers",
        "Municipal Naksa Pass Liaison with Ghorahi & Tulsipur",
        "Direct Bulk Material Freight Logistics"
      ],
      stats: {
        completed: "150+",
        activeSites: "12",
        engineers: "10"
      },
      embedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3527.784534882194!2d82.4930398753239!3d27.904875317765187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDU0JzE3LjYiTiA4MsKwMjknNDUuNCJF!5e0!3m2!1sen!2snp!4v1723434343434!5m2!1sen!2snp"
    }
  };

  const current = locations[selectedHub];

  if (compact) {
    return (
      <Card className="glass-ios p-5 rounded-3xl border-white/15 overflow-hidden backdrop-blur-2xl shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">Dual Regional Presence</span>
          </div>
          <div className="flex glass-ios-pill p-1 rounded-2xl border-white/15">
            <button
              onClick={() => setSelectedHub("butwal")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedHub === "butwal" 
                  ? "bg-primary text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Butwal HQ
            </button>
            <button
              onClick={() => setSelectedHub("dang")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedHub === "dang" 
                  ? "bg-purple-600 text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dang Branch
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedHub}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-foreground text-sm">{current.name}</h4>
                <p className="text-xs text-muted-foreground">{current.shortAddress}</p>
              </div>
              <Badge className={`text-[10px] font-bold shrink-0 ${
                businessStatus.isOpen 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20" 
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }`}>
                {businessStatus.isOpen ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Open Now
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {businessStatus.statusText}
                  </span>
                )}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                asChild
                size="sm"
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md shadow-primary/20"
              >
                <a href={`tel:${current.phone}`}>
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  {current.phone}
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-[#25D366] hover:text-white font-semibold rounded-xl"
                onClick={() => window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(current.whatsappText)}`, '_blank')}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                WhatsApp
              </Button>
              <Link to="/contact" className="text-xs text-primary font-bold hover:underline ml-auto flex items-center">
                Details <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    );
  }

  return (
    <Card className="glass-ios p-6 md:p-10 rounded-[32px] border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      {/* Background Liquid Mesh Highlights */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none liquid-orb-1" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none liquid-orb-2" />

      <div className="relative z-10 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-rose-300 border-white/15 font-bold px-3 py-1 text-xs">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline text-primary animate-pulse" />
                Interactive Territory Visualizer
              </Badge>
              <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground glass-ios-pill">
                Lumbini Province Corridor
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Our Presence in <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Butwal</span> & <span className="text-purple-400 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Dang</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Click between our headquarters and regional branch to explore on-ground engineering teams, municipal permit coverage, and direct contact channels.
            </p>
          </div>

          {/* Interactive Hub Switcher */}
          <div className="flex glass-ios-pill p-1.5 rounded-2xl border-white/15 shadow-xl shrink-0">
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="hub-tab-butwal"
              onClick={() => setSelectedHub("butwal")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 ${
                selectedHub === "butwal"
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Butwal Corporate HQ</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="hub-tab-dang"
              onClick={() => setSelectedHub("dang")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 ${
                selectedHub === "dang"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Dang Regional Branch</span>
            </motion.button>
          </div>
        </div>

        {/* Dynamic Interactive Content Block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedHub}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left: Office Specific Details & Coverage */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl ${selectedHub === 'butwal' ? 'bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/10' : 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'} flex items-center justify-center shrink-0`}>
                    {selectedHub === 'butwal' ? <Building2 size={28} /> : <MapPin size={28} />}
                  </div>
                  <div>
                    <Badge className={`text-xs font-bold mb-1 ${current.badgeColor}`}>
                      {current.badge}
                    </Badge>
                    <h3 className="text-2xl font-extrabold text-foreground">{current.companyName}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground pt-1">
                  <Badge className={`font-bold px-2.5 py-1 ${
                    businessStatus.isOpen 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20" 
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}>
                    {businessStatus.isOpen ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Open Now
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        {businessStatus.statusText}
                      </span>
                    )}
                  </Badge>

                  <span className="text-foreground/70">•</span>

                  <span className="flex items-center gap-1 text-muted-foreground font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {current.timing}
                  </span>

                  <span className="text-foreground/70">•</span>

                  <span className="text-[11px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    Nepal Time: {businessStatus.currentTimeFormatted}
                  </span>
                </div>

                {/* Status Detail Callout */}
                <div className={`p-2.5 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
                  businessStatus.isOpen
                    ? "bg-emerald-950/25 border-emerald-500/30 text-emerald-300 shadow-sm"
                    : "bg-amber-950/25 border-amber-500/30 text-amber-300 shadow-sm"
                }`}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{businessStatus.statusDetail}</span>
                </div>
              </div>

              {/* Address */}
              <div className="p-4 sm:p-5 rounded-2xl glass-ios border border-white/10 space-y-3 text-xs sm:text-sm shadow-sm backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold">Physical Address:</strong>
                    <span className="text-muted-foreground">{current.address}</span>
                  </div>
                </div>
              </div>

              {/* Territory Coverage List */}
              <div className="space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center justify-between">
                  <span>Municipal & Project Coverage:</span>
                  <span className="text-[11px] text-primary font-bold">100% On-Site Support</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {current.coverage.map((cov, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl glass-ios border border-white/10 text-xs text-foreground font-medium backdrop-blur-md hover:border-primary/40 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{cov}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                  <Button 
                    size="default" 
                    className="bg-primary hover:bg-primary/90 text-white font-bold px-5 shadow-lg shadow-primary/30 rounded-2xl h-11"
                    asChild
                  >
                    <a href={`tel:${current.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Office ({current.phone})
                    </a>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                  <Button 
                    size="default" 
                    className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-5 rounded-2xl shadow-lg shadow-emerald-600/25 h-11"
                    onClick={() => window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(current.whatsappText)}`, '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Direct
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    size="default"
                    variant="outline"
                    className="glass-ios border-white/15 text-foreground hover:bg-white/10 font-semibold rounded-2xl h-11"
                    onClick={() => window.open(current.directionUrl, '_blank')}
                  >
                    <Navigation className="w-4 h-4 mr-2 text-primary" />
                    Get Directions
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Right: Embedded Google Maps Container */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-[28px] overflow-hidden border border-white/15 shadow-2xl relative bg-card h-[380px] sm:h-[450px] group">
                <iframe
                  title={`${current.name} Google Map Location`}
                  src={current.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[25%] contrast-110 group-hover:grayscale-0 transition-all duration-500"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 p-3.5 rounded-2xl glass-ios border-white/20 shadow-xl text-xs space-y-1 backdrop-blur-2xl">
                  <div className="font-extrabold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {current.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{current.shortAddress}</div>
                </div>
              </div>

              {/* Direct Navigation Callout */}
              <div className="p-4 sm:p-5 rounded-2xl glass-ios border border-white/10 flex items-center justify-between gap-4 backdrop-blur-xl">
                <div className="text-xs text-muted-foreground">
                  <strong className="text-foreground block font-bold">Visiting our office?</strong>
                  Both locations feature free on-site parking and dedicated structural discussion conference rooms.
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-primary/40 text-primary hover:bg-primary hover:text-white rounded-xl shrink-0 font-semibold text-xs h-9 px-3.5 glass-ios"
                    onClick={() => window.open(current.directionUrl, '_blank')}
                  >
                    Open Maps <ExternalLink className="w-3 h-3 ml-1.5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default DualPresenceMap;
