import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Compass, 
  Home, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RotateCw, 
  Info, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight,
  Maximize2,
  RefreshCw,
  Eye,
  FileCheck2,
  SlidersHorizontal,
  Lightbulb,
  DoorOpen,
  Utensils,
  Bed,
  Bath,
  Tv
} from "lucide-react";

// ==========================================
// VASTU DATA DEFINITIONS & 9-ZONE MANDALA GRID
// ==========================================
export type DirectionKey = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" | "CENTER";

export interface ZoneData {
  key: DirectionKey;
  label: string;
  nepaliName: string;
  deity: string;
  element: "Water" | "Fire" | "Earth" | "Air" | "Space";
  elementColor: string;
  accentBg: string;
  borderColor: string;
  recommendedRooms: string[];
  avoidRooms: string[];
  idealItems: string[];
  defectRemedies: string[];
  description: string;
  nepaliDescription: string;
  colors: string[];
  angle: number; // degrees from North
}

export const VASTU_ZONES: Record<DirectionKey, ZoneData> = {
  N: {
    key: "N",
    label: "North",
    nepaliName: "उत्तर दिशा",
    deity: "Kuber (Lord of Wealth)",
    element: "Water",
    elementColor: "#38BDF8",
    accentBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    borderColor: "#0284C7",
    recommendedRooms: ["Living Room", "Treasury / Safe", "Main Entrance", "Home Office", "Study Room"],
    avoidRooms: ["Toilet / Bathroom", "Kitchen", "Master Bedroom", "Heavy Clutter / Storage"],
    idealItems: ["Cash locker opening towards North", "Water fountain / Aquarium", "Green plants / Money plant", "Large glass windows"],
    defectRemedies: ["Place a Kuber Yantra or brass bowl with clean water & camphor", "Paint walls in pearl white or light blue", "Hang a mirror on the North wall"],
    description: "Governed by Kuber and Mercury. Magnet for financial prosperity, career expansion, and new opportunities.",
    nepaliDescription: "धनका देवता कुबेरको वासस्थान। उत्तर दिशामा ढोका, झ्याल वा खुला स्थान हुँदा आर्थिक समृद्धि र नयाँ अवसरहरूको प्रवाह हुन्छ।",
    colors: ["Light Blue", "Off-White", "Sea Green"],
    angle: 0
  },
  NE: {
    key: "NE",
    label: "North-East",
    nepaliName: "ईशान कोण",
    deity: "Lord Shiva / Ishanya",
    element: "Water",
    elementColor: "#818CF8",
    accentBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    borderColor: "#6366F1",
    recommendedRooms: ["Pooja / Prayer Room", "Meditation Space", "Underground Water Tank", "Main Entrance", "Study / Library"],
    avoidRooms: ["Toilet / Septic Tank", "Kitchen / Fireplace", "Overhead Water Tank", "Master Bedroom", "Staircase"],
    idealItems: ["Tulsi plant in copper pot", "Temple / Puja mandir", "Crystal Shree Yantra", "Light, clutter-free open balcony"],
    defectRemedies: ["Never place septic tank here; if toilet exists, place energized Vastu pyramid & sea salt bowls", "Keep this area spotless and well-lit with white light"],
    description: "The most sacred cosmic portal (Brahma / Shiva). Generates spiritual peace, supreme intellect, and overall family health.",
    nepaliDescription: "समस्त वास्तुको सबैभन्दा पवित्र कोण। ईश्वरीय आशीर्वाद, मानसिक शान्ति र सन्तानको प्रगतिको मुख्य स्रोत।",
    colors: ["Pure White", "Light Sky Blue", "Pastel Yellow"],
    angle: 45
  },
  E: {
    key: "E",
    label: "East",
    nepaliName: "पूर्व दिशा",
    deity: "Lord Indra / Surya (Sun)",
    element: "Air",
    elementColor: "#34D399",
    accentBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    borderColor: "#10B981",
    recommendedRooms: ["Main Entrance", "Living Hall", "Balcony / Verandah", "Study Room", "Guest Room"],
    avoidRooms: ["Toilet", "Heavy Storage", "Garage", "High Parapet Walls blocking Sun"],
    idealItems: ["Morning sun-facing wide windows", "Surya Brass Yantra", "Family photo gallery", "Wooden furniture"],
    defectRemedies: ["Install a 12-pointed brass Surya mural on the East wall", "Burn pure camphor in the morning to invite solar energy"],
    description: "Governed by Lord Indra and the rising Sun. Brings vibrant health, social networking, and royal recognition.",
    nepaliDescription: "सूर्य देवको दिशा। बिहानको सकारात्मक किरणहरूले स्वास्थ्य, सामाजिक प्रतिष्ठा र दीर्घायु प्रदान गर्दछ।",
    colors: ["Light Green", "Golden Cream", "Mint"],
    angle: 90
  },
  SE: {
    key: "SE",
    label: "South-East",
    nepaliName: "आग्नेय कोण",
    deity: "Agni Dev (Fire Lord)",
    element: "Fire",
    elementColor: "#FB923C",
    accentBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    borderColor: "#F97316",
    recommendedRooms: ["Kitchen (Cook facing East)", "Electrical Panel / Inverter", "Generator / Geyser", "Gym / Fitness Area"],
    avoidRooms: ["Master Bedroom", "Underground Water Tank", "Pooja Room", "Main Gate"],
    idealItems: ["Cooking burner placed in SE corner", "Microwave, boiler, inverter setup", "Warm ambient orange-tone lights"],
    defectRemedies: ["If underground water exists in SE, place Red Jasper stones and Agni Yantra", "Paint kitchen borders in warm pastel coral or terracotta"],
    description: "The Fire Zone (Agni). Controls metabolic digestion, vitality, female health, cash flow, and passion.",
    nepaliDescription: "अग्नि तत्वको मुख्य केन्द्र। भान्सा र विद्युतीय उपकरणका लागि सर्वोत्तम। महिला स्वास्थ्य र आर्थिक ऊर्जा बढाउँछ।",
    colors: ["Coral Red", "Warm Orange", "Peach", "Pink"],
    angle: 135
  },
  S: {
    key: "S",
    label: "South",
    nepaliName: "दक्षिण दिशा",
    deity: "Lord Yama (Justice & Discipline)",
    element: "Earth",
    elementColor: "#F87171",
    accentBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    borderColor: "#EF4444",
    recommendedRooms: ["Master Bedroom", "Heavy Storage / Cupboards", "Staircase", "Safe / Valuables"],
    avoidRooms: ["Main Entrance (unless calibrated)", "Underground Tank", "Boring Well", "Pooja Room"],
    idealItems: ["Heavy wardrobe or solid wood cupboards", "High, thick structural walls with smaller windows", "Red earth pots"],
    defectRemedies: ["Place Lead Helix or Red Coral pyramid on South wall", "Keep this zone heavy and elevated relative to North"],
    description: "Governed by Yama and Mars. Bestows grounded stability, unshakeable confidence, and legal protection.",
    nepaliDescription: "स्थिरता र सुरक्षाको दिशा। भारी फर्निचर, दराज र मास्टर बेडरूमका लागि उपयुक्त। यो भाग अग्लो र गह्रुंगो हुनुपर्छ।",
    colors: ["Warm Terracotta", "Deep Brown", "Maroon"],
    angle: 180
  },
  SW: {
    key: "SW",
    label: "South-West",
    nepaliName: "नैऋत्य कोण",
    deity: "Nirriti (Earth / Ancestors)",
    element: "Earth",
    elementColor: "#FBBF24",
    accentBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    borderColor: "#F59E0B",
    recommendedRooms: ["Master Bedroom (Head of Family)", "Overhead Water Tank", "Heavy Machinery", "Staircase Tower"],
    avoidRooms: ["Main Entrance", "Pooja Room", "Kitchen", "Underground Septic Tank / Boring", "Balcony / Open Cutouts"],
    idealItems: ["Solid master bed (Head to South)", "Brass heavy artifacts", "Locker opening towards North / East", "Highest roof level"],
    defectRemedies: ["Place Rahu / Pitra Yantra, Lead bricks, or Yellow Jasper in the SW corner", "Ensure SW roof is the highest point of the house"],
    description: "The Earth Foundation (Nirriti). Ensures family head leadership, matrimonial bliss, longevity, and wealth accumulation.",
    nepaliDescription: "घरको सबैभन्दा बलियो जग। घरमूलीको मास्टर बेडरूम र ओभरहेड ट्यांकीका लागि उत्तम। यसले पारिवारिक सम्बन्ध बलियो बनाउँछ।",
    colors: ["Mustard Yellow", "Earth Brown", "Warm Beige"],
    angle: 225
  },
  W: {
    key: "W",
    label: "West",
    nepaliName: "पश्चिम दिशा",
    deity: "Lord Varuna (Water / Commerce)",
    element: "Space",
    elementColor: "#94A3B8",
    accentBg: "bg-slate-500/10 text-slate-300 border-slate-500/30",
    borderColor: "#64748B",
    recommendedRooms: ["Children's Bedroom", "Dining Room", "Study Room", "Overhead Tank", "Toilets / Bathrooms"],
    avoidRooms: ["Pooja Room", "Main Entrance without proper Pada check", "Underground Sump"],
    idealItems: ["Rectangular/Square dining table", "Study desk facing East", "Metal sculptures or white wind chimes"],
    defectRemedies: ["Hang a 7-rod metallic wind chime or place a Varuna Yantra", "Use silver or gunmetal accent decorations"],
    description: "Ruled by Varuna and Saturn. Fuels profitable business gains, academic discipline, and children's career focus.",
    nepaliDescription: "वरुण देवको दिशा। भोजन कक्ष, छोराछोरीको अध्ययन र व्यापारिक नाफाका लागि अनुकूल।",
    colors: ["Silver Grey", "Pure White", "Metallic Blue"],
    angle: 270
  },
  NW: {
    key: "NW",
    label: "North-West",
    nepaliName: "वायव्य कोण",
    deity: "Lord Vayu (Wind Lord)",
    element: "Air",
    elementColor: "#A78BFA",
    accentBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    borderColor: "#8B5CF6",
    recommendedRooms: ["Guest Bedroom", "Daughter's Bedroom", "Finished Goods / Grain Storage", "Garage / Parking", "Septic Tank"],
    avoidRooms: ["Master Bedroom", "Pooja Room", "Heavy Safe / Permanent Wealth Lockers", "Boring Well in exact corner"],
    idealItems: ["Aerated cross-ventilation windows", "White or pearl decorative artefacts", "Guest luggage storage"],
    defectRemedies: ["Place a Vayu Yantra or Brass Moon hanging", "Keep clean air fresheners with natural lemongrass or camphor"],
    description: "Ruled by Vayu and Moon. Drives mobility, beneficial travels, social support, and quick business turnover.",
    nepaliDescription: "वायु तत्वको क्षेत्र। पाहुना कोठा, छोरीको कोठा र सवारी साधन पार्किङका लागि उपयुक्त। गतिशीलता र व्यापार बढाउँछ।",
    colors: ["Cream", "Off-White", "Light Grey", "Silver"],
    angle: 315
  },
  CENTER: {
    key: "CENTER",
    label: "Brahmasthan (Center)",
    nepaliName: "ब्रह्मस्थान (केन्द्र)",
    deity: "Lord Brahma (The Creator)",
    element: "Space",
    elementColor: "#E879F9",
    accentBg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30",
    borderColor: "#D946EF",
    recommendedRooms: ["Open Courtyard / Aangan", "Skylight Atrium", "Spiritual Gathering Space", "Light Living Hall"],
    avoidRooms: ["Pillars / Heavy Load Columns", "Staircase", "Toilet", "Kitchen / Fire", "Heavy Machines"],
    idealItems: ["Open skylight with soft natural daylight", "Clean marble floor with floral rangoli", "Zero load structural span"],
    defectRemedies: ["Never place heavy RCC columns in the exact center; if columns exist, install Copper Brahma pyramids on 4 sides", "Keep strictly clean & well ventilated"],
    description: "The umbilical cosmic epicenter of the home. Must be light, airy, and free from any structural load or toilets.",
    nepaliDescription: "घरको नाभि (केन्द्र)। यो भाग सधैं खुला, हलुका, सफा र भारमुक्त हुनुपर्छ। यहाँ पिलर वा भर्याङ हुनुहुँदैन।",
    colors: ["Golden White", "Soft Cream", "Clear Light"],
    angle: 0
  }
};

export type RoomType = 
  | "master_bedroom" 
  | "kitchen" 
  | "pooja_room" 
  | "living_room" 
  | "toilet" 
  | "entrance" 
  | "dining" 
  | "study" 
  | "water_tank";

interface RoomConfig {
  id: RoomType;
  name: string;
  nepaliName: string;
  icon: React.ElementType;
  idealZones: DirectionKey[];
  neutralZones: DirectionKey[];
  negativeZones: DirectionKey[];
  guidance: string;
  dos: string[];
  donts: string[];
}

export const ROOM_CONFIGS: Record<RoomType, RoomConfig> = {
  master_bedroom: {
    id: "master_bedroom",
    name: "Master Bedroom",
    nepaliName: "मास्टर बेडरूम",
    icon: Bed,
    idealZones: ["SW", "S", "W"],
    neutralZones: ["NW"],
    negativeZones: ["NE", "SE", "CENTER", "N"],
    guidance: "Place the master bedroom in the South-West to maintain family authority, emotional grounding, and restful sleep.",
    dos: [
      "Sleep with head towards South or East (never North)",
      "Use heavy solid wooden bed with headboard against solid South/West wall",
      "Decorate with warm earth tones (beige, terracotta, cream)",
      "Keep electronic screens and mirrors away from directly reflecting the bed"
    ],
    donts: [
      "Avoid sleeping directly under exposed ceiling beams",
      "Never locate the master bedroom in the sacred North-East (causes mental restlessness)",
      "Do not install water elements or aquariums inside the bedroom"
    ]
  },
  kitchen: {
    id: "kitchen",
    name: "Kitchen & Cooking",
    nepaliName: "भान्सा र चुल्हो",
    icon: Utensils,
    idealZones: ["SE", "NW"],
    neutralZones: ["E", "S"],
    negativeZones: ["NE", "SW", "N", "CENTER"],
    guidance: "South-East (Agneya) is the divine fire quadrant. Position the cooking stove so the cook faces East while cooking.",
    dos: [
      "Face East while cooking to receive morning solar blessings",
      "Place wash sink in the North-East corner of the kitchen (separate from fire)",
      "Keep heavy storage shelves on Southern and Western walls",
      "Use warm tones like soft orange, coral, light beige, or peach"
    ],
    donts: [
      "Never place the kitchen in the North-East (clashes Fire with Water, risking finances)",
      "Avoid adjoining common wall between kitchen and toilet",
      "Do not keep the cooking gas burner directly adjacent to the water tap"
    ]
  },
  pooja_room: {
    id: "pooja_room",
    name: "Pooja & Meditation Room",
    nepaliName: "पूजा कोठा र ध्यान कक्ष",
    icon: Sparkles,
    idealZones: ["NE", "E", "N"],
    neutralZones: ["CENTER"],
    negativeZones: ["S", "SW", "SE", "NW"],
    guidance: "North-East (Ishanya) is the supreme divine direction for the family mandir and daily spiritual connection.",
    dos: [
      "Face East or North while performing prayer and meditation",
      "Keep the prayer area elevated, spotless, and filled with natural white/gold light",
      "Use sacred brass lamps, copper vessels, and white/yellow flower offerings",
      "Place idols on a clean raised wooden pedestal"
    ],
    donts: [
      "Never build a toilet above, below, or sharing a wall with the Pooja room",
      "Do not build the temple inside the master bedroom or under staircases",
      "Avoid storing heavy suitcases or brooms inside the prayer space"
    ]
  },
  living_room: {
    id: "living_room",
    name: "Living Room / Hall",
    nepaliName: "बस्ने कोठा (हल)",
    icon: Home,
    idealZones: ["N", "E", "NE", "NW"],
    neutralZones: ["W"],
    negativeZones: ["SW", "S", "CENTER"],
    guidance: "The living room welcomes guest energy and family bonding. North or East placement promotes vibrant conversations and welcoming warmth.",
    dos: [
      "Position the house owner's seating facing East or North during meetings",
      "Arrange heavy sofa sets along the South and West boundaries",
      "Ensure expansive open windows and natural ventilation on North and East",
      "Incorporate live indoor plants in North or East corners"
    ],
    donts: [
      "Avoid locating the main family hall in the heavy South-West",
      "Do not display aggressive animal paintings, war imagery, or weeping art",
      "Keep the central area of the living room free of heavy tables"
    ]
  },
  toilet: {
    id: "toilet",
    name: "Toilet & Septic Tank",
    nepaliName: "शौचालय र सेप्टिक ट्याङ्क",
    icon: Bath,
    idealZones: ["NW", "W", "S"],
    neutralZones: ["SE"],
    negativeZones: ["NE", "SW", "CENTER", "N", "E"],
    guidance: "Toilets represent heavy negative energy disposal. North-West or West ensures safe discharge without draining prosperity.",
    dos: [
      "Align the commode seat facing North-South axis (facing North or South while using)",
      "Keep toilet doors closed and use pleasant natural aroma diffusers",
      "Provide high ventilation windows opening towards exterior walls",
      "Place a small bowl of raw sea salt to absorb lingering damp energies"
    ],
    donts: [
      "CRITICAL: Never build a toilet in the sacred North-East or Center (Brahmasthan)",
      "Avoid placing toilets directly facing the main entrance or kitchen door",
      "Do not construct toilets underneath structural staircases if avoidable"
    ]
  },
  entrance: {
    id: "entrance",
    name: "Main Entrance (Maha Dwar)",
    nepaliName: "मुख्य प्रवेशद्वार",
    icon: DoorOpen,
    idealZones: ["NE", "N", "E"],
    neutralZones: ["NW", "SE", "W"],
    negativeZones: ["SW", "S"],
    guidance: "The main door is the mouth of Prana (cosmic energy). North, North-East, and East gateways welcome health, wealth, and joy.",
    dos: [
      "Construct a double-shutter solid teak or hardwood door that opens inward clockwise",
      "Decorate the threshold with auspicious Swastika, Om, and brass Toran",
      "Ensure entrance has an even number of steps and bright, warm illumination",
      "Make the main entrance larger than other interior doors"
    ],
    donts: [
      "Avoid shadows of lampposts, poles, or large trees directly falling on the main gate",
      "Never place shoe racks or garbage bins right at the front doorway",
      "Do not have a mirror directly facing the main door reflecting energy outside"
    ]
  },
  dining: {
    id: "dining",
    name: "Dining Room",
    nepaliName: "भोजन कक्ष",
    icon: Utensils,
    idealZones: ["W", "NW", "E"],
    neutralZones: ["SE", "N"],
    negativeZones: ["SW", "NE"],
    guidance: "West is the direction of Varuna and prosperity gains. Dining in the West nurtures physical health and family unity.",
    dos: [
      "Family head should face East or North while having meals",
      "Use square or rectangular solid wood dining tables",
      "Decorate dining area with mirrors reflecting food (symbolizes doubling of abundance)",
      "Use warm pastel colors like light yellow, cream, and peach"
    ],
    donts: [
      "Never face South while eating (drains digestive vigor)",
      "Avoid round, triangular, or irregular glass dining tables",
      "Do not place dining table directly facing the bathroom door"
    ]
  },
  study: {
    id: "study",
    name: "Study & Home Office",
    nepaliName: "अध्ययन कोठा / अफिस",
    icon: BookOpen,
    idealZones: ["NE", "E", "N", "W"],
    neutralZones: ["NW"],
    negativeZones: ["SE", "SW", "S"],
    guidance: "East and North-East energize memory retention, mental sharpness, and professional breakthrough.",
    dos: [
      "Sit facing East or North while studying or working on laptops",
      "Place books and heavy bookshelves along the South or West walls",
      "Keep the study desk clutter-free with soft illumination from the left side",
      "Incorporate green plants to stimulate Mercury's intellect vibration"
    ],
    donts: [
      "Do not sit directly facing a blank, windowless solid wall immediately against the desk",
      "Avoid studying under ceiling beams or directly facing a toilet door",
      "Keep dark, gloomy colors away from the study study walls"
    ]
  },
  water_tank: {
    id: "water_tank",
    name: "Water Storage (Overhead / Sump)",
    nepaliName: "पानी ट्याङ्की (भूमिगत / छत)",
    icon: Droplets,
    idealZones: ["NE", "SW", "N", "W"],
    neutralZones: ["NW", "E"],
    negativeZones: ["SE", "S", "CENTER"],
    guidance: "Underground sump belongs strictly in North-East / North; Overhead heavy storage belongs strictly in South-West / West.",
    dos: [
      "Place underground boring & rainwater sumps in North-East (Water zone)",
      "Place heavy overhead Sintex/concrete water tanks on the South-West roof corner",
      "Ensure overhead tanks are elevated on concrete pedestals",
      "Keep water storage tanks clean and covered at all times"
    ],
    donts: [
      "Never put underground water sump in the South-East (Agni) or South-West (Earth)",
      "Never place overhead heavy water tank in the North-East (burdens the cosmic portal)",
      "Avoid water tanks in the exact Brahmasthan center of the roof"
    ]
  }
};

// 9-Zone Grid Layout for visual rendering
const MANDALA_GRID: DirectionKey[][] = [
  ["NW", "N", "NE"],
  ["W", "CENTER", "E"],
  ["SW", "S", "SE"]
];

export default function VastuGuide() {
  const [activeTab, setActiveTab] = useState<"compass" | "audit" | "remedies" | "knowledge">("compass");
  const [selectedZoneKey, setSelectedZoneKey] = useState<DirectionKey>("NE");
  const [plotRotation, setPlotRotation] = useState<number>(0);
  const [selectedRoomForFilter, setSelectedRoomForFilter] = useState<RoomType | "all">("all");
  
  // Interactive Home Vastu Audit State
  const [auditPlacements, setAuditPlacements] = useState<Record<RoomType, DirectionKey>>({
    master_bedroom: "SW",
    kitchen: "SE",
    pooja_room: "NE",
    living_room: "N",
    toilet: "NW",
    entrance: "E",
    dining: "W",
    study: "E",
    water_tank: "NE"
  });

  const selectedZone = VASTU_ZONES[selectedZoneKey];

  // Calculate overall Vastu Compatibility Score (0 to 100)
  const auditScore = useMemo(() => {
    let totalScore = 0;
    const roomKeys = Object.keys(auditPlacements) as RoomType[];
    
    roomKeys.forEach((roomKey) => {
      const placedZone = auditPlacements[roomKey];
      const cfg = ROOM_CONFIGS[roomKey];
      if (cfg.idealZones.includes(placedZone)) {
        totalScore += 100 / roomKeys.length;
      } else if (cfg.neutralZones.includes(placedZone)) {
        totalScore += 55 / roomKeys.length;
      } else {
        totalScore += 15 / roomKeys.length;
      }
    });

    return Math.round(totalScore);
  }, [auditPlacements]);

  // Evaluate Zone status for selected room filter
  const getZoneStatusForFilter = (zoneKey: DirectionKey) => {
    if (selectedRoomForFilter === "all") return "default";
    const cfg = ROOM_CONFIGS[selectedRoomForFilter];
    if (cfg.idealZones.includes(zoneKey)) return "ideal";
    if (cfg.neutralZones.includes(zoneKey)) return "neutral";
    return "negative";
  };

  const handleUpdateAudit = (room: RoomType, zone: DirectionKey) => {
    setAuditPlacements(prev => ({ ...prev, [room]: zone }));
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: "Excellent (महा शुभ)", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
    if (score >= 70) return { label: "Good (शुभ)", color: "bg-sky-500/20 text-sky-400 border-sky-500/40" };
    if (score >= 50) return { label: "Moderate (मध्यम - उपाय आवश्यक)", color: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
    return { label: "Needs Correction (दोषपूर्ण)", color: "bg-rose-500/20 text-rose-400 border-rose-500/40" };
  };

  const scoreBadge = getScoreBadge(auditScore);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background pt-28 pb-20 px-4 md:px-6">
      {/* Ambient Celestial Vastu Mandala Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] rounded-full bg-amber-500/10 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-widest shadow-sm">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Interactive Vastu Shastra Simulator</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
            Interactive Vastu <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-primary to-orange-400">Mandala & Audit</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed">
            Click, rotate, and evaluate your floor plan zones in real-time. Discover elemental balance, 
            directional energies, room positioning, and authentic Vedic remedies for modern homes in Nepal.
          </p>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl glass border border-white/10 shadow-xl overflow-x-auto max-w-full">
            {[
              { id: "compass" as const, label: "Interactive 9-Zone Mandala", icon: Compass },
              { id: "audit" as const, label: "Floor Plan Vastu Score Calculator", icon: SlidersHorizontal },
              { id: "remedies" as const, label: "Vastu Dosha & Remedies", icon: ShieldCheck },
              { id: "knowledge" as const, label: "Vedic Principles & Guide", icon: BookOpen },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md font-bold scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <IconComp className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE 9-ZONE MANDALA GRID & COMPASS EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === "compass" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT 7 COLS: INTERACTIVE 3X3 GRID & COMPASS ROTATION */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="glass border-white/10 shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                      <Compass className="w-6 h-6 text-primary" />
                      Vastu Purusha Mandala (९ कोठे चक्र)
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click any zone below to inspect deity, elements, dos/don'ts, and ideal room functions.
                    </p>
                  </div>

                  {/* Filter by Room Highlight */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">Filter Room:</span>
                    <select
                      value={selectedRoomForFilter}
                      onChange={(e) => setSelectedRoomForFilter(e.target.value as RoomType | "all")}
                      className="text-xs bg-slate-900/90 border border-white/20 rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="all">Show All Elements</option>
                      <option value="master_bedroom">Master Bedroom</option>
                      <option value="kitchen">Kitchen (भान्सा)</option>
                      <option value="pooja_room">Pooja Room (मन्दिर)</option>
                      <option value="living_room">Living Room</option>
                      <option value="toilet">Toilet / Bathroom</option>
                      <option value="entrance">Main Entrance (ढोका)</option>
                      <option value="dining">Dining Room</option>
                      <option value="study">Study / Office</option>
                      <option value="water_tank">Water Tanks</option>
                    </select>
                  </div>
                </div>

                {/* ORIENTATION / ROTATION CONTROLLER */}
                <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-black/30 border border-white/10 mb-6 text-xs">
                  <div className="flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-primary animate-spin-slow" />
                    <span className="font-semibold text-foreground">Plot Orientation:</span>
                    <Badge variant="outline" className="border-primary/40 text-primary font-mono">
                      {plotRotation}° North Offset
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 w-48">
                    <Slider
                      value={[plotRotation]}
                      min={0}
                      max={360}
                      step={45}
                      onValueChange={(val) => setPlotRotation(val[0])}
                      className="cursor-pointer"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPlotRotation(0)}
                      className="h-7 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                {/* 3X3 INTERACTIVE MANDALA GRID */}
                <div 
                  className="grid grid-cols-3 gap-3 md:gap-4 p-4 rounded-3xl bg-slate-950/80 border border-white/10 shadow-inner transition-transform duration-500 ease-out relative"
                  style={{ transform: `rotate(${plotRotation}deg)` }}
                >
                  {MANDALA_GRID.map((row, rIdx) =>
                    row.map((zKey) => {
                      const zone = VASTU_ZONES[zKey];
                      const isSelected = selectedZoneKey === zKey;
                      const filterStatus = getZoneStatusForFilter(zKey);

                      // Visual styling based on room filter
                      let filterBorder = "border-white/10";
                      let filterBadge = null;

                      if (selectedRoomForFilter !== "all") {
                        if (filterStatus === "ideal") {
                          filterBorder = "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/30";
                          filterBadge = <span className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">BEST</span>;
                        } else if (filterStatus === "neutral") {
                          filterBorder = "border-amber-500/60 bg-amber-950/20";
                          filterBadge = <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/80 text-slate-950">OK</span>;
                        } else {
                          filterBorder = "border-rose-500/50 opacity-60 bg-rose-950/20";
                          filterBadge = <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">AVOID</span>;
                        }
                      }

                      return (
                        <button
                          key={zKey}
                          onClick={() => setSelectedZoneKey(zKey)}
                          style={{ transform: `rotate(${-plotRotation}deg)` }}
                          className={`relative p-3 md:p-4 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between min-h-[105px] md:min-h-[135px] border ${
                            isSelected 
                              ? "bg-primary/20 border-primary shadow-lg shadow-primary/25 scale-[1.03] z-10 ring-2 ring-primary/60" 
                              : `glass hover:bg-white/10 ${filterBorder}`
                          }`}
                        >
                          {filterBadge}

                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs md:text-sm font-black text-foreground">
                                {zone.label}
                              </span>
                              <span 
                                className="w-2.5 h-2.5 rounded-full" 
                                style={{ backgroundColor: zone.elementColor }} 
                                title={`Element: ${zone.element}`}
                              />
                            </div>
                            <div className="text-[11px] md:text-xs text-primary font-semibold mt-0.5">
                              {zone.nepaliName}
                            </div>
                          </div>

                          <div className="mt-2 space-y-1">
                            <div className="text-[10px] md:text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                              <span className="font-semibold text-slate-300">{zone.element}</span> • {zone.deity.split(" ")[0]}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {zone.recommendedRooms[0]}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* LEGEND BAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#38BDF8]" /> Water (जल)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FB923C]" /> Fire (अग्नि)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FBBF24]" /> Earth (पृथ्वी)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#34D399]" /> Air (वायु)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#E879F9]" /> Space (आकाश)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-primary">Center: Brahmasthan</span>
                </div>
              </Card>
            </div>

            {/* RIGHT 5 COLS: DETAILED ZONE SPOTLIGHT CARD */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="glass border-primary/30 shadow-2xl p-6 md:p-7 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl -z-10" style={{ backgroundColor: selectedZone.elementColor, opacity: 0.15 }} />

                {/* HEADER */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className={selectedZone.accentBg}>
                        {selectedZone.element} Element
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">Zone: {selectedZone.key}</span>
                    </div>
                    <h3 className="text-2xl font-black text-foreground mt-2">
                      {selectedZone.label} ({selectedZone.nepaliName})
                    </h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      Presiding Deity: {selectedZone.deity}
                    </p>
                  </div>

                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 text-white shadow-lg"
                    style={{ backgroundColor: selectedZone.borderColor }}
                  >
                    {selectedZone.key}
                  </div>
                </div>

                {/* DESCRIPTIONS */}
                <div className="space-y-3 p-4 rounded-2xl bg-black/20 border border-white/5 text-xs md:text-sm text-foreground/90 leading-relaxed">
                  <p>{selectedZone.description}</p>
                  <p className="text-primary/90 font-medium pt-2 border-t border-white/10">{selectedZone.nepaliDescription}</p>
                </div>

                {/* RECOMMENDED ROOMS & AVOID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      Ideal Placements (शुभ)
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {selectedZone.recommendedRooms.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" />
                      Strictly Avoid (अशुभ)
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {selectedZone.avoidRooms.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* REMEDIES & AUSPICIOUS ARTIFACTS */}
                <div className="mt-5 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1.5">
                      <Lightbulb className="w-4 h-4" />
                      Vedic Remedies & Power Enhancers
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {selectedZone.defectRemedies.map((rem, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Auspicious Paint Colors */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5 text-xs">
                    <span className="font-semibold text-muted-foreground">Beneficial Wall Colors:</span>
                    <div className="flex items-center gap-2">
                      {selectedZone.colors.map((c, i) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-foreground text-[10px]">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INTERACTIVE FLOOR PLAN VASTU AUDIT & SCORE CALCULATOR */}
        {/* ========================================================================= */}
        {activeTab === "audit" && (
          <div className="space-y-8">
            {/* SCORE HERO BANNER */}
            <Card className="glass border-primary/40 shadow-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Real-time Layout Evaluation</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">
                    Your Home Vastu Compatibility Score
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground max-w-xl">
                    Configure your actual or proposed room placements below. The engine calculates an instant 
                    score with specific dosha alerts and corrective architectural remedies.
                  </p>
                </div>

                <div className="flex items-center gap-5 p-4 rounded-3xl bg-slate-950/80 border border-white/15 shadow-xl flex-shrink-0">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-white/10"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={auditScore >= 75 ? "text-emerald-400" : auditScore >= 50 ? "text-amber-400" : "text-rose-500"}
                        strokeDasharray={`${auditScore}, 100`}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-black text-foreground">{auditScore}%</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Vastu</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-muted-foreground">Rating Status</div>
                    <Badge className={`${scoreBadge.color} font-bold text-xs py-1 px-3 border`}>
                      {scoreBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* ROOM ASSIGNMENT SELECTORS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(Object.keys(ROOM_CONFIGS) as RoomType[]).map((rKey) => {
                const cfg = ROOM_CONFIGS[rKey];
                const currentZone = auditPlacements[rKey];
                const IconComp = cfg.icon;

                const isIdeal = cfg.idealZones.includes(currentZone);
                const isNeutral = cfg.neutralZones.includes(currentZone);
                const isNegative = cfg.negativeZones.includes(currentZone);

                let statusBadge = (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Ideal (शुभ)
                  </Badge>
                );

                if (isNeutral) {
                  statusBadge = (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] flex items-center gap-1">
                      <Info className="w-3 h-3" /> Acceptable (मध्यम)
                    </Badge>
                  );
                } else if (isNegative) {
                  statusBadge = (
                    <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Dosha (दोष)
                    </Badge>
                  );
                }

                return (
                  <Card key={rKey} className="glass border-white/10 shadow-lg p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-primary/20 text-primary">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-sm">{cfg.name}</div>
                            <div className="text-[11px] text-muted-foreground">{cfg.nepaliName}</div>
                          </div>
                        </div>
                        {statusBadge}
                      </div>

                      <div className="space-y-2 text-xs">
                        <label className="text-muted-foreground font-medium block">
                          Current / Proposed Zone:
                        </label>
                        <select
                          value={currentZone}
                          onChange={(e) => handleUpdateAudit(rKey, e.target.value as DirectionKey)}
                          className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-foreground font-semibold focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          {Object.keys(VASTU_ZONES).map((zKey) => (
                            <option key={zKey} value={zKey}>
                              {VASTU_ZONES[zKey as DirectionKey].label} ({VASTU_ZONES[zKey as DirectionKey].nepaliName})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Best Ideal Direction:</span>
                        <span className="font-bold text-emerald-400">
                          {cfg.idealZones.map(z => VASTU_ZONES[z].label).join(", ")}
                        </span>
                      </div>
                      {isNegative && (
                        <p className="text-rose-400 font-medium text-[10px] bg-rose-950/30 p-2 rounded-lg border border-rose-500/20">
                          ⚠️ Warning: Placing {cfg.name} in {VASTU_ZONES[currentZone].label} causes energy disharmony. Consult remedies tab.
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: VASTU DOSHA & PRACTICAL REMEDIES */}
        {/* ========================================================================= */}
        {activeTab === "remedies" && (
          <div className="space-y-6">
            <Card className="glass border-white/10 shadow-2xl p-6 md:p-8">
              <div className="max-w-3xl mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                  Common Vastu Doshas & Non-Destructive Remedies (दोष निवारण उपाय)
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                  In modern urban construction in Nepal, shifting walls is not always physically possible. 
                  Ancient Vastu Shastra provides non-demolition corrective remedies using elemental balancers, 
                  pyramids, mirrors, copper helixes, and planetary colors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Toilet in North-East (ईशान कोणमा शौचालय)",
                    severity: "High (गम्भीर दोष)",
                    impact: "Mental restlessness, recurring healthcare expenses, and spiritual blockages.",
                    remedy: "Install a 3-tier copper Vastu Pyramid above the toilet frame, keep a bronze bowl with natural Himalayan rock salt (renew weekly), and paint the exterior wall light sky blue.",
                    icon: AlertTriangle,
                    color: "border-rose-500/40 bg-rose-950/20"
                  },
                  {
                    title: "Kitchen in North-East (ईशानमा भान्सा)",
                    severity: "High (गम्भीर दोष)",
                    impact: "Financial outflow and heated arguments due to Fire (Agni) clashing with Water.",
                    remedy: "Place a green marble slab directly under the gas burner stove, hang a 12-leaf brass Surya yantra on the East wall, and keep a water pot in the NE corner of the room.",
                    icon: Flame,
                    color: "border-rose-500/40 bg-rose-950/20"
                  },
                  {
                    title: "Master Bedroom in South-East or North-East",
                    severity: "Medium (मध्यम दोष)",
                    impact: "Sleep disturbance, anxiety, or lack of authoritative decision-making.",
                    remedy: "Shift head direction strictly towards South while sleeping. Place a lead pyramid under the mattress and use soothing sea green or cream bed linens.",
                    icon: Bed,
                    color: "border-amber-500/40 bg-amber-950/20"
                  },
                  {
                    title: "Main Entrance Facing South-West (नैऋत्यमा मुख्य ढोका)",
                    severity: "High (गम्भीर दोष)",
                    impact: "Sudden business volatility, conflicts, and sluggish career growth.",
                    remedy: "Fix two brass Rahu Yantras or Hanuman Ji with Gada picture on the door frame, place yellow citrine crystals inside, and install two bright warm outdoor lamps.",
                    icon: DoorOpen,
                    color: "border-rose-500/40 bg-rose-950/20"
                  },
                  {
                    title: "Staircase in Center (ब्रह्मस्थानमा भर्याङ वा पिलर)",
                    severity: "High (गम्भीर दोष)",
                    impact: "Heaviness in chest, stress among family elders, and hindered prosperity.",
                    remedy: "Place 4 copper Brahma pyramids along the corners of the staircase base, keep the central area intensely illuminated, and avoid storage under steps.",
                    icon: Layers,
                    color: "border-rose-500/40 bg-rose-950/20"
                  },
                  {
                    title: "Cut in North-East Plot / Missing Corner",
                    severity: "Medium (मध्यम दोष)",
                    impact: "Lack of clarity and reduced luck in high-stake ventures.",
                    remedy: "Install 2 large convex mirrors on the adjacent walls to optically extend the zone, or erect a 15-foot flagpole in the corner with a red/saffron flag.",
                    icon: Sparkles,
                    color: "border-amber-500/40 bg-amber-950/20"
                  }
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div key={idx} className={`p-6 rounded-3xl border ${item.color} space-y-3 shadow-lg`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-foreground font-bold text-base">
                          <IconComp className="w-5 h-5 text-primary" />
                          {item.title}
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold border-white/20">
                          {item.severity}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <strong className="text-slate-300">Negative Impact:</strong> {item.impact}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-xs text-slate-200">
                        <strong className="text-emerald-400 font-bold block mb-1">Effective Remedy (समाधान):</strong>
                        {item.remedy}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: VEDIC PRINCIPLES & ANCIENT TEXTS */}
        {/* ========================================================================= */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            <Card className="glass border-white/10 shadow-2xl p-6 md:p-8">
              <div className="max-w-4xl space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">
                    Vastu Shastra Fundamentals & Five Elements (पञ्चतत्व सिद्धान्त)
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                    Vastu Shastra harmonizes the human dwelling with the cosmos by balancing the Pancha Mahabhutas: 
                    Earth (Prithvi), Water (Jal), Fire (Agni), Air (Vayu), and Space (Akasha).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {[
                    {
                      name: "Jal (जल - Water)",
                      zone: "North-East (ईशान)",
                      color: "text-sky-400",
                      desc: "Controls clarity of mind, spiritual intuition, and wealth generation. Keep open, clean, and low."
                    },
                    {
                      name: "Agni (अग्नि - Fire)",
                      zone: "South-East (आग्नेय)",
                      color: "text-orange-400",
                      desc: "Fuels vitality, digestion, female wellness, and cash liquidities. Ideal for kitchens and electrics."
                    },
                    {
                      name: "Prithvi (पृथ्वी - Earth)",
                      zone: "South-West (नैऋत्य)",
                      color: "text-amber-400",
                      desc: "Grants stability, leadership, longevity, and wealth retention. Must be high, heavy, and closed."
                    },
                    {
                      name: "Vayu (वायु - Air)",
                      zone: "North-West (वायव्य)",
                      color: "text-emerald-400",
                      desc: "Drives motion, opportunities, social connections, and quick travel. Ideal for guest rooms and parking."
                    },
                    {
                      name: "Akasha (आकाश - Space)",
                      zone: "Center (ब्रह्मस्थान)",
                      color: "text-purple-400",
                      desc: "The open cosmic receiver. Must remain load-free and illuminated with natural light."
                    },
                    {
                      name: "Surya Urja (Solar Energy)",
                      zone: "East (पूर्व)",
                      color: "text-yellow-400",
                      desc: "Brings Vitamin D, infrared rays, and mental vitality. Maximize doors and windows on this side."
                    }
                  ].map((elem, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                      <div className={`font-black text-sm ${elem.color}`}>{elem.name}</div>
                      <div className="text-[11px] text-primary font-semibold">{elem.zone}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{elem.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Practical Construction Checklist */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-primary" />
                    Essential Vastu Checklist for New Home Construction in Nepal
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-300">
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2">
                      <div className="font-bold text-emerald-400">1. Plot Selection & Orientation</div>
                      <p>Square or rectangular (1:1.5 to 1:2 ratio) plots are best. Avoid irregular triangles or L-shapes. Gaumukhi plots (narrow front, wide back) are highly auspicious for residences.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2">
                      <div className="font-bold text-emerald-400">2. Boundary & Elevation Slope</div>
                      <p>Ensure the building floor level and land slope from South-West (highest) down towards North-East (lowest) for smooth positive magnetic runoff.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2">
                      <div className="font-bold text-emerald-400">3. Staircase Direction</div>
                      <p>Stairs should climb in a clockwise direction (Dakshinavarta), starting from East to West or North to South.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/10 space-y-2">
                      <div className="font-bold text-emerald-400">4. Griha Pravesh & Muhurat</div>
                      <p>Perform foundation laying (Shilanyas) in the South-East or North-East and conduct Griha Pravesh during auspicious Uttarayan solar transits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
