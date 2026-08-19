import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Paintbrush, 
  Plus, 
  Trash2, 
  Calculator, 
  Printer, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  ArrowRight, 
  Layers, 
  Droplet, 
  Palette, 
  Building2, 
  Home, 
  Sliders, 
  RotateCcw,
  Sun,
  Moon,
  Info,
  ShieldCheck,
  Share2,
  Copy,
  Eye,
  Check
} from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { AnimatedSection } from "@/components/AnimatedSection";

interface RoomItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  includeCeiling: boolean;
  doorsCount: number;
  doorWidth: number;
  doorHeight: number;
  windowsCount: number;
  windowWidth: number;
  windowHeight: number;
  assignedColorId?: string;
}

interface PaintBrandOption {
  name: string;
  logoText: string;
  description: string;
}

const PAINT_BRANDS: PaintBrandOption[] = [
  { name: "Asian Paints Nepal", logoText: "Asian Paints", description: "Apex Ultima, Royale Luxury, Tractor Emulsion, SmartCare" },
  { name: "Berger Paints Nepal", logoText: "Berger", description: "WeatherCoat All Guard, Silk Glamor, Bison Emulsion" },
  { name: "Nerolac Paints Nepal", logoText: "Nerolac", description: "Excel Total, Beauty Gold, Impressions HD, Suraksha" },
  { name: "Pashupati Paints", logoText: "Pashupati", description: "Nepalese homegrown quality: All-weather exterior & interior emulsions" },
];

export interface ColorSwatchItem {
  id: string;
  name: string;
  hex: string;
  category: "Warm Neutral" | "Cool Slate" | "Earth & Terracotta" | "Regal & Jewel" | "Pastel & Nature" | "Exterior Classic";
  nepalCode: string;
  description: string;
  bestFor: string;
  companions: {
    accentWall: { name: string; hex: string; code: string; desc: string };
    ceiling: { name: string; hex: string; code: string; desc: string };
    trim: { name: string; hex: string; code: string; desc: string };
    decor: { name: string; hex: string; code: string; desc: string };
  };
}

const EXTENSIVE_COLOR_PALETTES: ColorSwatchItem[] = [
  // 1. Warm Neutrals & Creams
  {
    id: "royal-cashmere",
    name: "Royal Cashmere (Ivory)",
    hex: "#F5F0E6",
    category: "Warm Neutral",
    nepalCode: "AP Royale 0321 / Berger Silk 102",
    description: "Soft velvet ivory tone that reflects light gracefully and enlarges spacious living halls.",
    bestFor: "Living Halls, Master Bedroom, Open Dining",
    companions: {
      accentWall: { name: "Mustard Gold Leaf", hex: "#D4A373", code: "AP Royale 7942", desc: "Adds warm sunlit depth to the TV wall or headboard" },
      ceiling: { name: "Frost White Silk", hex: "#FAFAF8", code: "AP 0001 Royale Ceiling", desc: "Illuminates overhead light fixtures" },
      trim: { name: "Warm Alabaster", hex: "#E8E2D5", code: "AP PU Finish 0110", desc: "Soft subtle frame for door architraves" },
      decor: { name: "Teak & Brass Accent", hex: "#8B5E3C", code: "Timber Polish", desc: "Perfect harmony with Nepali woodcarvings" },
    }
  },
  {
    id: "sandstone-serenade",
    name: "Sandstone Serenade",
    hex: "#EADDC7",
    category: "Warm Neutral",
    nepalCode: "Nerolac Beauty 4102 / AP 0344",
    description: "Earthy limestone warm beige inspired by Pokhara river rocks, cozy and grounding.",
    bestFor: "Bedrooms, Corridors, Drawing Rooms",
    companions: {
      accentWall: { name: "Burnt Cinnamon", hex: "#B85D3B", code: "AP Royale 0514", desc: "Warm fiery contrast wall" },
      ceiling: { name: "Pure Pearl", hex: "#F7F5F0", code: "AP Tractor 0002", desc: "Clean overhead reflection" },
      trim: { name: "Satin Cream", hex: "#D8CCA8", code: "Berger Enamel 203", desc: "Smooth baseboard transition" },
      decor: { name: "Olive Velvet", hex: "#556B2F", code: "Textile Accent", desc: "Matches indoor plants and cushions" },
    }
  },
  {
    id: "morning-linen",
    name: "Morning Linen",
    hex: "#F2EBE1",
    category: "Warm Neutral",
    nepalCode: "Berger Silk 114 / AP Apcolite 0308",
    description: "Airy, natural woven linen tone for serene, peaceful rest and tranquil meditation rooms.",
    bestFor: "Pooja Rooms, Kids Rooms, Home Offices",
    companions: {
      accentWall: { name: "Amber Ochre", hex: "#D99B43", code: "Nerolac HD 331", desc: "Spiritual positive energy highlight" },
      ceiling: { name: "Chantilly White", hex: "#FCFCFA", code: "AP Royale 0000", desc: "High reflectance ceiling" },
      trim: { name: "Bisque Cream", hex: "#E2D7C7", code: "AP Enamel 108", desc: "Smooth window casing" },
      decor: { name: "Terracotta Clay", hex: "#C86446", code: "Clay Pot Accent", desc: "Authentic Nepali ceramic tone" },
    }
  },
  {
    id: "butwal-ivory",
    name: "Butwal Sunrise Alabaster",
    hex: "#F9F6EE",
    category: "Warm Neutral",
    nepalCode: "Pashupati Classic 101 / AP 0312",
    description: "Brightest warm off-white, engineered for sunny southern Nepal exposures.",
    bestFor: "All-Round Interior, Staircases, Hallways",
    companions: {
      accentWall: { name: "Royal Teal Mirage", hex: "#1D5C63", code: "AP Royale 7412", desc: "Dramatic cool contrast focal wall" },
      ceiling: { name: "Pure White Glow", hex: "#FFFFFF", code: "AP Premium 0001", desc: "Maximum height perception" },
      trim: { name: "Soft Cashmere", hex: "#E9E2D2", code: "Berger Satin 120", desc: "Architectural shadow lines" },
      decor: { name: "Matte Black Metal", hex: "#222222", code: "Hardware Accent", desc: "Modern switchboards and door handles" },
    }
  },

  // 2. Cool Slates & Greys
  {
    id: "himalayan-mist",
    name: "Himalayan Mist Grey",
    hex: "#D8DFE5",
    category: "Cool Slate",
    nepalCode: "AP Apcolite 8244 / Berger Silk 512",
    description: "Crisp, contemporary mountain-morning mist. The preferred choice for modern luxury apartments.",
    bestFor: "Modern Living Rooms, Kitchens, Study/Studio",
    companions: {
      accentWall: { name: "Deep Cobalt Slate", hex: "#2B4162", code: "AP Royale 7291", desc: "Sophisticated executive statement" },
      ceiling: { name: "Glacier White", hex: "#F3F7FA", code: "AP Royale 0001", desc: "Sharp crisp modern ceiling" },
      trim: { name: "Platinum Grey", hex: "#BFC9D2", code: "Berger Enamel 504", desc: "Sleek metallic door framing" },
      decor: { name: "Mustard Velvet Yellow", hex: "#E3A824", code: "Lounge Fabric", desc: "Playful high-contrast throw pillows" },
    }
  },
  {
    id: "urban-granite",
    name: "Urban Granite",
    hex: "#B0B7BF",
    category: "Cool Slate",
    nepalCode: "Nerolac Impressions 812 / AP 8299",
    description: "Refined mid-tone architectural concrete look for industrial-chic minimalist residences.",
    bestFor: "Feature Wall, Balconies, Studio Lofts",
    companions: {
      accentWall: { name: "Charcoal Obsidian", hex: "#2C3138", code: "AP Royale 8312", desc: "Moody theater room accent" },
      ceiling: { name: "Ice Cap White", hex: "#EEF2F6", code: "AP Ceiling 0004", desc: "Bright balance against mid grey" },
      trim: { name: "Steel Silver", hex: "#959EA8", code: "Nerolac Satin 808", desc: "Sharp border definitions" },
      decor: { name: "Warm Oak Timber", hex: "#9A714C", code: "Wood Texture", desc: "Softens grey with organic warmth" },
    }
  },
  {
    id: "silver-birch",
    name: "Silver Birch Frost",
    hex: "#E5E9EC",
    category: "Cool Slate",
    nepalCode: "Berger Silk Glamor 502 / AP 8201",
    description: "Ultra-light airy grey that shifts delicately between silver and soft blue under natural daylight.",
    bestFor: "Bathrooms, Small Rooms, Minimalist Kitchens",
    companions: {
      accentWall: { name: "Emerald Pine", hex: "#1F4E3F", code: "AP Royale 7622", desc: "Forest retreat aesthetic" },
      ceiling: { name: "Crisp Snow", hex: "#FAFCFD", code: "AP Royale 0001", desc: "Maximum openness" },
      trim: { name: "Silver Ash", hex: "#D0D6DC", code: "Berger PU 506", desc: "Seamless flush doors" },
      decor: { name: "Brushed Rose Gold", hex: "#C58371", code: "Metallic Lights", desc: "Luxury pendant lamp harmony" },
    }
  },

  // 3. Nepalese Earth & Terracotta
  {
    id: "heritage-terracotta",
    name: "Heritage Bhaktapur Terracotta",
    hex: "#D85C3C",
    category: "Earth & Terracotta",
    nepalCode: "AP Royale 0524 / Pashupati Red 301",
    description: "Deep rustic red fired clay inspired by Kathmandu Valley temples and Malla brickwork.",
    bestFor: "Dining Rooms, Traditional Lounge, Courtyards",
    companions: {
      accentWall: { name: "Lumbini Gold Leaf", hex: "#E9C46A", code: "AP Special Effect Gold", desc: "Royal heritage gold leaf trim" },
      ceiling: { name: "Warm Sand Dune", hex: "#F3EAD8", code: "AP Apcolite 0340", desc: "Soft warm glow overhead" },
      trim: { name: "Dark Walnut Teak", hex: "#4A3222", code: "Timber Enamel 902", desc: "Carved wooden beam matching" },
      decor: { name: "Antique Brass", hex: "#B8860B", code: "Pooja Bell Brass", desc: "Heritage metal warmth" },
    }
  },
  {
    id: "lumbini-ochre",
    name: "Lumbini Sacred Ochre",
    hex: "#E2B855",
    category: "Earth & Terracotta",
    nepalCode: "AP Royale 7931 / Berger Silk 302",
    description: "Warm golden saffron shade symbolizing enlightenment, happiness, and solar vitality.",
    bestFor: "Pooja Rooms, Accent Walls, Living Room TV Units",
    companions: {
      accentWall: { name: "Crimson Palace", hex: "#9E2A2B", code: "AP Royale 0488", desc: "Spiritual temple richness" },
      ceiling: { name: "Cream Silk", hex: "#FAF6EB", code: "AP Royale 0003", desc: "Gentle warm reflection" },
      trim: { name: "Nutmeg Brown", hex: "#7E5233", code: "Berger Enamel 810", desc: "Grounded woodwork" },
      decor: { name: "Deep Maroon Silk", hex: "#540B0E", code: "Curtain Velvet", desc: "Regal ceremonial feel" },
    }
  },
  {
    id: "dang-clay-brick",
    name: "Dang Valley Red Earth",
    hex: "#B2533E",
    category: "Earth & Terracotta",
    nepalCode: "Pashupati Classic Red / Nerolac 214",
    description: "Rich Tharu-heritage clay brick tone representing grounded agricultural abundance and warmth.",
    bestFor: "Exterior Accents, Dining Walls, Patio Balconies",
    companions: {
      accentWall: { name: "Raw Umber", hex: "#5C3D2E", code: "AP 0412", desc: "Earthy foundation tone" },
      ceiling: { name: "Ivory Clay", hex: "#F6F1E9", code: "AP Tractor 0002", desc: "Smooth plaster balance" },
      trim: { name: "Washed Teak", hex: "#8A6546", code: "Berger Satin 718", desc: "Rustic timber trim" },
      decor: { name: "Forest Fern", hex: "#436436", code: "Verdant Greens", desc: "Balcony garden backdrop" },
    }
  },

  // 4. Regal & Jewel Accents
  {
    id: "regal-royal-navy",
    name: "Regal Pokhara Navy",
    hex: "#1F3A52",
    category: "Regal & Jewel",
    nepalCode: "AP Royale 7299 / Berger Silk 710",
    description: "Deep, majestic sapphire navy blue evoking Fewa Lake at dusk. Timeless opulence.",
    bestFor: "Master Bedroom Headboard, Formal Dining, Home Theaters",
    companions: {
      accentWall: { name: "Champagne Gold", hex: "#DFB15B", code: "Royale Metallic Gold", desc: "Breathtaking gold leaf stencil/stripes" },
      ceiling: { name: "Pearl Mist", hex: "#F0F4F8", code: "AP Royale 0001", desc: "Airy contrast against dark navy" },
      trim: { name: "Crisp Alabaster", hex: "#E8EEF3", code: "AP PU White", desc: "Sharp crown moulding delineation" },
      decor: { name: "Cognac Leather", hex: "#9E472A", code: "Sofa Upholstery", desc: "Gentleman's lounge aesthetic" },
    }
  },
  {
    id: "emerald-valley",
    name: "Annapurna Emerald",
    hex: "#1E4B3E",
    category: "Regal & Jewel",
    nepalCode: "Berger Silk Glamor 608 / AP 7634",
    description: "Rich botanical jewel emerald that grounds interiors in peaceful, oxygen-rich luxury.",
    bestFor: "Reading Lounges, Executive Cabins, Powder Rooms",
    companions: {
      accentWall: { name: "Warm Ochre Sand", hex: "#D4A373", code: "AP 7942", desc: "Rich jewel-tone companion" },
      ceiling: { name: "Soft Celadon Mist", hex: "#EDF3EF", code: "AP 7601", desc: "Subtle green-tinted white ceiling" },
      trim: { name: "Dark Walnut", hex: "#3A2A1D", code: "Timber Satin 912", desc: "Deep rich millwork" },
      decor: { name: "Brushed Brass & Gold", hex: "#D4AF37", code: "Metal Accents", desc: "Luxe lighting fixtures" },
    }
  },
  {
    id: "deep-nepali-crimson",
    name: "National Crimson Velvet",
    hex: "#8C1D2F",
    category: "Regal & Jewel",
    nepalCode: "AP Royale Luxury 0495 / Berger 412",
    description: "The auspicious national color of Nepal. Rich, passionate, and welcoming for grand entry foyers.",
    bestFor: "Entryway Foyers, Dining Highlights, Restaurant Lounges",
    companions: {
      accentWall: { name: "Royal Brocade Gold", hex: "#E0B758", code: "Royale Stencil Gold", desc: "Palatial symmetry" },
      ceiling: { name: "Antique Cream", hex: "#F8F3E6", code: "AP Apcolite 0302", desc: "Warm ambient glow" },
      trim: { name: "Deep Espresso", hex: "#2E1A16", code: "AP Enamel 940", desc: "Majestic archways" },
      decor: { name: "Ivory Silk Linens", hex: "#FAF5E9", code: "Drapes & Carpets", desc: "Crisp elegant drapery" },
    }
  },

  // 5. Pastel & Nature Tones
  {
    id: "forest-sage-green",
    name: "Forest Sage Serenity",
    hex: "#8E9F8B",
    category: "Pastel & Nature",
    nepalCode: "AP Apcolite 7612 / Berger 602",
    description: "Calming eucalyptus sage with grey undertones. Proven to lower heart rate and reduce stress.",
    bestFor: "Bedrooms, Yoga/Meditation Spaces, Bathrooms",
    companions: {
      accentWall: { name: "Dark Moss Olive", hex: "#465945", code: "AP Royale 7644", desc: "Forest depth accent" },
      ceiling: { name: "Frosted Lily White", hex: "#F3F7F2", code: "AP Royale 0001", desc: "Natural daylight reflection" },
      trim: { name: "Natural Birch", hex: "#D5DCD2", code: "Berger Satin 604", desc: "Organic seamless framing" },
      decor: { name: "Terracotta Planters", hex: "#D07050", code: "Ceramic Accent", desc: "Earthy potted greenery harmony" },
    }
  },
  {
    id: "pokhara-sky-blue",
    name: "Pokhara Sky Breeze",
    hex: "#9CC2C9",
    category: "Pastel & Nature",
    nepalCode: "AP Tractor 7204 / Nerolac 612",
    description: "Gentle alpine sky pastel that brings freshness, optimism, and cool mountain air inside.",
    bestFor: "Children's Rooms, Playrooms, South-Facing Bedrooms",
    companions: {
      accentWall: { name: "Deep Marine Slate", hex: "#32536A", code: "AP Royale 7244", desc: "Nautical depth wall" },
      ceiling: { name: "Cloud White", hex: "#F2F8FA", code: "AP 0001", desc: "Airy sky feeling" },
      trim: { name: "Pure White Satin", hex: "#FFFFFF", code: "AP PU Enamel", desc: "Crisp cheerful borders" },
      decor: { name: "Sunny Buttercup", hex: "#E9C46A", code: "Cushion Accent", desc: "Joyful sun & sky pairing" },
    }
  },
  {
    id: "blush-lotus",
    name: "Blush Lotus Pink",
    hex: "#E8C8C8",
    category: "Pastel & Nature",
    nepalCode: "Berger Silk 402 / AP 0415",
    description: "Warm, sophisticated petal blush inspired by sacred lotus blooms. Subtle and romantic.",
    bestFor: "Dressing Rooms, Master Suites, Boutique Stores",
    companions: {
      accentWall: { name: "Plum Royale", hex: "#613659", code: "AP Royale 7102", desc: "Glamorous jewel backdrop" },
      ceiling: { name: "Porcelain White", hex: "#FDF7F7", code: "AP Royale 0001", desc: "Soft warm ceiling reflection" },
      trim: { name: "Warm Alabaster", hex: "#EFE2E2", code: "Berger PU 404", desc: "Delicate feminine trim" },
      decor: { name: "Brushed Brass Metal", hex: "#CF9B48", code: "Mirror Frames", desc: "Chic luxury vanity accents" },
    }
  },

  // 6. Exterior Weatherproof Classics
  {
    id: "apex-weathercoat-white",
    name: "Apex Brilliant Exterior White",
    hex: "#F4F6F7",
    category: "Exterior Classic",
    nepalCode: "AP Apex Ultima 0001 / Berger All Guard 100",
    description: "High-solar-reflectance exterior emulsion with anti-algal silicone technology for heavy Terai monsoons.",
    bestFor: "Full Building Exterior Facade, Boundary Walls, Columns",
    companions: {
      accentWall: { name: "Charcoal Slate Banding", hex: "#3B424C", code: "AP Apex Ultima 8300", desc: "Groove lines & terrace parapet trims" },
      ceiling: { name: "Exterior Bright White", hex: "#FFFFFF", code: "Apex Weatherproof", desc: "Overhang balconies & porch soffits" },
      trim: { name: "Teak Wood Grain Texture", hex: "#654321", code: "AP Woodtech Exterior", desc: "Window borders and gate piers" },
      decor: { name: "Lush Lawn Grass", hex: "#3E7D32", code: "Landscaping", desc: "Crisp contrast with green lawn" },
    }
  },
  {
    id: "terai-teak-ochre",
    name: "Terai Sandstone Exterior",
    hex: "#D6B88D",
    category: "Exterior Classic",
    nepalCode: "AP Apex 0352 / Berger All Guard 310",
    description: "Dust-resistant warm sandy facade coating that hides road dust and withstands high UV summers.",
    bestFor: "Commercial Facades, Main Entrance Gates, Exterior Elevations",
    companions: {
      accentWall: { name: "Rustic Brick Red", hex: "#A63A26", code: "Apex Ultima 0510", desc: "Pillar casting & architectural feature box" },
      ceiling: { name: "Warm Cream Soffit", hex: "#F5EFE3", code: "AP Apex 0300", desc: "Balcony underside illumination" },
      trim: { name: "Espresso Dark Brown", hex: "#38251B", code: "AP Exterior Enamel", desc: "Weatherproof window frames & louvers" },
      decor: { name: "Black Cast Iron Railing", hex: "#1A1A1A", code: "Safety Railing", desc: "Classic modern contrast" },
    }
  },
];

const INITIAL_ROOMS: RoomItem[] = [
  {
    id: "1",
    name: "Living Room / Hall",
    length: 16,
    width: 14,
    height: 10,
    includeCeiling: true,
    doorsCount: 2,
    doorWidth: 3.25,
    doorHeight: 7,
    windowsCount: 2,
    windowWidth: 5,
    windowHeight: 4,
    assignedColorId: "royal-cashmere",
  },
  {
    id: "2",
    name: "Master Bedroom",
    length: 14,
    width: 12,
    height: 10,
    includeCeiling: true,
    doorsCount: 1,
    doorWidth: 3.25,
    doorHeight: 7,
    windowsCount: 2,
    windowWidth: 4,
    windowHeight: 4,
    assignedColorId: "himalayan-mist",
  },
  {
    id: "3",
    name: "Bedroom 2 / Kids",
    length: 12,
    width: 11,
    height: 10,
    includeCeiling: true,
    doorsCount: 1,
    doorWidth: 3.25,
    doorHeight: 7,
    windowsCount: 1,
    windowWidth: 4,
    windowHeight: 4,
    assignedColorId: "forest-sage-green",
  },
  {
    id: "4",
    name: "Kitchen & Dining",
    length: 14,
    width: 10,
    height: 10,
    includeCeiling: true,
    doorsCount: 1,
    doorWidth: 3.25,
    doorHeight: 7,
    windowsCount: 1,
    windowWidth: 4,
    windowHeight: 3.5,
    assignedColorId: "sandstone-serenade",
  },
];

export default function PaintCalculator() {
  const [calculationMode, setCalculationMode] = useState<"quick" | "detailed">("quick");
  
  // Detailed Mode Rooms State
  const [rooms, setRooms] = useState<RoomItem[]>(INITIAL_ROOMS);

  // Quick Mode State
  const [builtUpArea, setBuiltUpArea] = useState<number>(1200);
  const [floorsCount, setFloorsCount] = useState<number>(1);
  const [quickCeiling, setQuickCeiling] = useState<boolean>(true);
  const [quickExterior, setQuickExterior] = useState<boolean>(true);
  const [wallHeight, setWallHeight] = useState<number>(10);

  // Surface Condition & Scope
  const [surfaceCondition, setSurfaceCondition] = useState<"new_plaster" | "repaint_good" | "repaint_rough">("new_plaster");
  const [paintQuality, setPaintQuality] = useState<"economy" | "premium" | "luxury" | "exterior_weather">("premium");
  const [selectedBrand, setSelectedBrand] = useState<string>("Asian Paints Nepal");
  const [numberOfCoats, setNumberOfCoats] = useState<number>(2);

  // Custom Unit Rates (NPR)
  const [rates, setRates] = useState({
    paintPerLiter: 580, // NPR per liter for selected topcoat
    primerPerLiter: 240, // NPR per liter
    puttyPerKg: 35, // NPR per kg (~NPR 1,400 per 40kg bag)
    laborPerSqFt: 18, // NPR per sq ft for complete primer + putty + 2 coats
  });

  // Color Studio & Visualizer State
  const [paletteCategory, setPaletteCategory] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<ColorSwatchItem>(EXTENSIVE_COLOR_PALETTES[0]);
  const [lightingMode, setLightingMode] = useState<"daylight" | "golden_hour" | "cozy_night">("daylight");
  const [activeSurfaceFocus, setActiveSurfaceFocus] = useState<"main" | "accent" | "ceiling" | "trim">("main");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filtered Color Swatches
  const filteredSwatches = useMemo(() => {
    if (paletteCategory === "All") return EXTENSIVE_COLOR_PALETTES;
    return EXTENSIVE_COLOR_PALETTES.filter(item => item.category === paletteCategory);
  }, [paletteCategory]);

  // Sync default rates when paint quality changes
  const handleQualityChange = (quality: "economy" | "premium" | "luxury" | "exterior_weather") => {
    setPaintQuality(quality);
    if (quality === "economy") {
      setRates(prev => ({ ...prev, paintPerLiter: 380, laborPerSqFt: 14 }));
    } else if (quality === "premium") {
      setRates(prev => ({ ...prev, paintPerLiter: 580, laborPerSqFt: 18 }));
    } else if (quality === "luxury") {
      setRates(prev => ({ ...prev, paintPerLiter: 960, laborPerSqFt: 24 }));
    } else if (quality === "exterior_weather") {
      setRates(prev => ({ ...prev, paintPerLiter: 750, laborPerSqFt: 20 }));
    }
  };

  // Add a new room
  const handleAddRoom = () => {
    const newRoom: RoomItem = {
      id: Date.now().toString(),
      name: `Room ${rooms.length + 1}`,
      length: 12,
      width: 10,
      height: 10,
      includeCeiling: true,
      doorsCount: 1,
      doorWidth: 3.25,
      doorHeight: 7,
      windowsCount: 1,
      windowWidth: 4,
      windowHeight: 4,
      assignedColorId: selectedColor.id,
    };
    setRooms(prev => [...prev, newRoom]);
    toast.success("New room added");
  };

  // Remove room
  const handleRemoveRoom = (id: string) => {
    if (rooms.length <= 1) {
      toast.error("You must have at least one room");
      return;
    }
    setRooms(prev => prev.filter(r => r.id !== id));
    toast.info("Room removed");
  };

  // Update room attribute
  const handleUpdateRoom = <K extends keyof RoomItem>(id: string, key: K, value: RoomItem[K]) => {
    setRooms(prev => prev.map(room => {
      if (room.id === id) {
        return { ...room, [key]: value };
      }
      return room;
    }));
  };

  // Presets for Quick Mode
  const applyPreset = (preset: "1bhk" | "2bhk" | "3bhk" | "standard_2_5" | "commercial") => {
    if (preset === "1bhk") {
      setBuiltUpArea(600);
      setFloorsCount(1);
    } else if (preset === "2bhk") {
      setBuiltUpArea(950);
      setFloorsCount(1);
    } else if (preset === "3bhk") {
      setBuiltUpArea(1400);
      setFloorsCount(1);
    } else if (preset === "standard_2_5") {
      setBuiltUpArea(2200);
      setFloorsCount(2.5);
    } else if (preset === "commercial") {
      setBuiltUpArea(3800);
      setFloorsCount(3);
    }
    toast.success("Preset applied successfully");
  };

  // Reset to default
  const handleReset = () => {
    setRooms(INITIAL_ROOMS);
    setBuiltUpArea(1200);
    setFloorsCount(1);
    setSurfaceCondition("new_plaster");
    setPaintQuality("premium");
    setSelectedColor(EXTENSIVE_COLOR_PALETTES[0]);
    setRates({
      paintPerLiter: 580,
      primerPerLiter: 240,
      puttyPerKg: 35,
      laborPerSqFt: 18,
    });
    toast.info("Calculator reset to defaults");
  };

  const copyColorInfo = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Core Calculations
  const calculatedMetrics = useMemo(() => {
    let totalWallGross = 0;
    let totalCeiling = 0;
    let totalOpenings = 0;
    let netArea = 0;

    if (calculationMode === "detailed") {
      rooms.forEach(room => {
        const wallPerimeter = 2 * (Number(room.length) + Number(room.width));
        const wallGross = wallPerimeter * Number(room.height);
        const ceiling = room.includeCeiling ? (Number(room.length) * Number(room.width)) : 0;
        
        const doorsDeduction = Number(room.doorsCount) * (Number(room.doorWidth) * Number(room.doorHeight));
        const windowsDeduction = Number(room.windowsCount) * (Number(room.windowWidth) * Number(room.windowHeight));
        const openings = doorsDeduction + windowsDeduction;
        
        const roomNet = Math.max(0, wallGross + ceiling - openings);

        totalWallGross += wallGross;
        totalCeiling += ceiling;
        totalOpenings += openings;
        netArea += roomNet;
      });
    } else {
      const totalBuiltUp = builtUpArea * floorsCount;
      const baseInteriorWalls = totalBuiltUp * 2.7;
      const baseCeilings = quickCeiling ? totalBuiltUp : 0;
      const baseExterior = quickExterior ? (Math.sqrt(totalBuiltUp / floorsCount) * 4 * wallHeight * floorsCount * 0.9) : 0;
      
      totalWallGross = baseInteriorWalls + baseExterior;
      totalCeiling = baseCeilings;
      totalOpenings = totalWallGross * 0.12;
      netArea = totalWallGross + totalCeiling - totalOpenings;
    }

    const netAreaSqM = netArea * 0.092903;

    let paintCoveragePerLiter = 135;
    if (paintQuality === "economy") paintCoveragePerLiter = 120;
    if (paintQuality === "premium") paintCoveragePerLiter = 135;
    if (paintQuality === "luxury") paintCoveragePerLiter = 150;
    if (paintQuality === "exterior_weather") paintCoveragePerLiter = 70;

    const paintLiters = Math.ceil((netArea / paintCoveragePerLiter) * (numberOfCoats / 2));

    const primerNeededLiters = surfaceCondition === "repaint_good" 
      ? Math.ceil(netArea / 160) 
      : Math.ceil(netArea / 115);

    let puttyNeededKg = 0;
    if (surfaceCondition === "new_plaster") {
      puttyNeededKg = Math.ceil(netArea / 14);
    } else if (surfaceCondition === "repaint_rough") {
      puttyNeededKg = Math.ceil(netArea / 25);
    }

    const puttyBags40kg = Math.ceil(puttyNeededKg / 40);

    const paintCost = paintLiters * rates.paintPerLiter;
    const primerCost = primerNeededLiters * rates.primerPerLiter;
    const puttyCost = puttyNeededKg * rates.puttyPerKg;
    const sundriesCost = Math.round(netArea * 1.5);
    const materialTotal = paintCost + primerCost + puttyCost + sundriesCost;

    let effectiveLaborRate = rates.laborPerSqFt;
    if (surfaceCondition === "repaint_good") {
      effectiveLaborRate = Math.round(rates.laborPerSqFt * 0.65);
    }
    const laborTotal = Math.round(netArea * effectiveLaborRate);
    const grandTotal = materialTotal + laborTotal;

    const drums20L = Math.floor(paintLiters / 20);
    const remainderAfter20L = paintLiters % 20;
    const buckets4L = Math.floor(remainderAfter20L / 4);
    const tins1L = remainderAfter20L % 4;

    return {
      totalWallGross: Math.round(totalWallGross),
      totalCeiling: Math.round(totalCeiling),
      totalOpenings: Math.round(totalOpenings),
      netArea: Math.round(netArea),
      netAreaSqM: netAreaSqM.toFixed(1),
      paintLiters,
      primerNeededLiters,
      puttyNeededKg,
      puttyBags40kg,
      drums20L,
      buckets4L,
      tins1L,
      paintCost,
      primerCost,
      puttyCost,
      sundriesCost,
      materialTotal,
      effectiveLaborRate,
      laborTotal,
      grandTotal,
      costPerSqFt: (grandTotal / (netArea || 1)).toFixed(1),
    };
  }, [rooms, calculationMode, builtUpArea, floorsCount, quickCeiling, quickExterior, wallHeight, surfaceCondition, paintQuality, numberOfCoats, rates]);

  // WhatsApp share link generator
  const generateWhatsAppLink = () => {
    const text = `Namaste Butwal Construction & Builders team! 
I calculated my project painting requirements:
- Selected Color Scheme: ${selectedColor.name} (${selectedColor.nepalCode})
- Accent Harmony: ${selectedColor.companions.accentWall.name}
- Ceiling Harmony: ${selectedColor.companions.ceiling.name}
- Net Painting Area: ${calculatedMetrics.netArea.toLocaleString()} sq. ft (${calculatedMetrics.netAreaSqM} sq. m)
- Paint Quality: ${paintQuality.toUpperCase()} (${selectedBrand})
- Topcoat Paint: ~${calculatedMetrics.paintLiters} Liters
- Primer: ~${calculatedMetrics.primerNeededLiters} Liters
- Wall Putty: ~${calculatedMetrics.puttyNeededKg} kg (${calculatedMetrics.puttyBags40kg} bags)
- Estimated Cost: NPR ${calculatedMetrics.grandTotal.toLocaleString()}
Please review this estimate and provide me with a confirmed quotation.`;
    return `https://wa.me/9779763653181?text=${encodeURIComponent(text)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background pt-32 pb-24 text-foreground">
      <SEOHead 
        title="Paint Area & Cost Calculator Nepal | Butwal Construction & Builders" 
        description="Free Nepal Paint Area Calculator. Calculate exact wall & ceiling painting area, companion color schemes, Putty bags, Primer and Topcoat Liters (Asian Paints, Berger, Nerolac) with live NPR material & labor costs."
        canonicalUrl="/tools/paint-calculator"
      />

      {/* Ambient macOS liquid background mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden print:hidden">
        <div className="absolute top-1/12 left-1/12 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-rose-500/12 via-primary/10 to-amber-500/8 blur-[160px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/12 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-purple-600/14 to-indigo-600/10 blur-[170px] liquid-orb-2" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Breadcrumb & Hero */}
        <AnimatedSection direction="down" className="text-center mb-10 print:mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs sm:text-sm font-semibold mb-4 shadow-sm backdrop-blur-md">
            <Paintbrush className="w-4 h-4 text-primary animate-pulse" />
            <span>Nepal Standard Finishing & Paint Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
            Paint Area, Costs & <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-primary to-amber-500">Companion Colors</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed print:hidden">
            Calculate accurate net paintable surface area (sq. ft), explore 24+ designer Nepal shades with automated 4-way companion color harmonies, and get exact material & labor BOQs in NPR.
          </p>
        </AnimatedSection>

        {/* Top Control Bar: Mode Toggle & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 glass-ios-card border-white/10 p-3.5 sm:p-4 rounded-2xl mb-8 shadow-xl print:hidden backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-muted/60 rounded-xl border border-white/10">
              <Button
                size="sm"
                variant={calculationMode === "quick" ? "default" : "ghost"}
                onClick={() => setCalculationMode("quick")}
                className={`text-xs sm:text-sm font-semibold rounded-lg ${calculationMode === "quick" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
                ⚡ Easy 1-Minute Estimator (For Homeowners)
              </Button>
              <Button
                size="sm"
                variant={calculationMode === "detailed" ? "default" : "ghost"}
                onClick={() => setCalculationMode("detailed")}
                className={`text-xs sm:text-sm font-semibold rounded-lg ${calculationMode === "detailed" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Sliders className="w-4 h-4 mr-1.5 text-blue-300" />
                📐 Detailed Room-by-Room BOQ
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-xs border-border/70 hover:bg-muted/70 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Defaults
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs border-border/70 hover:bg-muted/70 rounded-xl"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* 🎨 FEATURED: Ultra-Premium Companion Color Studio & Visualizer */}
        <AnimatedSection direction="up" delay={0.1} className="mb-10 print:hidden">
          <Card className="glass-ios-card border-white/15 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-2xl">
            <CardHeader className="pb-4 bg-muted/30 border-b border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Interactive Color Studio & Companion Harmonies</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Every primary shade includes architecturally matched Accent Wall, Ceiling, Trim, and Decor companion colors.
                    </CardDescription>
                  </div>
                </div>

                {/* Lighting Mood Simulator Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-background/60 rounded-xl border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setLightingMode("daylight")}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-all ${
                      lightingMode === "daylight" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Daylight (5500K)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightingMode("golden_hour")}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-all ${
                      lightingMode === "golden_hour" ? "bg-amber-600 text-white shadow" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Golden Hour (3200K)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLightingMode("cozy_night")}
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 font-medium transition-all ${
                      lightingMode === "cozy_night" ? "bg-indigo-600 text-white shadow" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    Cozy Evening (2700K)
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 pt-3 mt-2 border-t border-white/5">
                {[
                  "All", 
                  "Warm Neutral", 
                  "Cool Slate", 
                  "Earth & Terracotta", 
                  "Regal & Jewel", 
                  "Pastel & Nature", 
                  "Exterior Classic"
                ].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPaletteCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      paletteCategory === cat
                        ? "bg-foreground text-background shadow-md"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              
              {/* Top Row: Visual Room Canvas + Active Companion Palette (Side by Side) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
                
                {/* 3D Multi-Surface Room Canvas (7 Cols) */}
                <div className="lg:col-span-7 relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 flex flex-col justify-between p-4 group">
                  
                  {/* Lighting Overlay */}
                  <div 
                    className={`absolute inset-0 pointer-events-none transition-all duration-500 z-0 ${
                      lightingMode === "golden_hour" 
                        ? "bg-gradient-to-tr from-amber-500/25 via-orange-400/10 to-transparent mix-blend-color-burn" 
                        : lightingMode === "cozy_night"
                        ? "bg-gradient-to-t from-black/55 via-indigo-950/30 to-black/35"
                        : "bg-gradient-to-b from-white/10 to-black/10"
                    }`}
                  />

                  {/* Ceiling Plane (Top 18%) */}
                  <div 
                    onClick={() => setActiveSurfaceFocus("ceiling")}
                    className="relative z-10 w-full h-[18%] rounded-xl shadow-md border-b-2 border-white/20 flex items-center justify-between px-4 transition-all duration-300 hover:ring-2 hover:ring-primary cursor-pointer"
                    style={{ backgroundColor: selectedColor.companions.ceiling.hex }}
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-black/75 bg-white/70 px-2 py-0.5 rounded shadow-sm">
                      Ceiling: {selectedColor.companions.ceiling.name}
                    </span>
                    <span className="text-[10px] text-black/60 font-mono hidden sm:inline">
                      {selectedColor.companions.ceiling.code}
                    </span>
                  </div>

                  {/* Mid Section: Main Wall + Feature Accent Wall Side-by-Side */}
                  <div className="relative z-10 flex-1 grid grid-cols-12 gap-3 my-2 items-stretch">
                    
                    {/* Primary Main Walls (7 cols) */}
                    <div 
                      onClick={() => setActiveSurfaceFocus("main")}
                      className="col-span-7 rounded-xl p-3.5 shadow-inner border border-white/30 flex flex-col justify-between transition-all duration-300 hover:ring-2 hover:ring-primary cursor-pointer relative overflow-hidden"
                      style={{ backgroundColor: selectedColor.hex }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm bg-black/60 text-white backdrop-blur-sm">
                          Primary Wall: {selectedColor.name}
                        </span>
                      </div>

                      {/* Framed Architecture Window with Trim */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setActiveSurfaceFocus("trim"); }}
                        className="self-end w-24 h-28 rounded-lg shadow-xl border-4 flex flex-col items-center justify-center p-1 bg-sky-200/40 backdrop-blur-sm transition-all hover:scale-105"
                        style={{ borderColor: selectedColor.companions.trim.hex }}
                      >
                        <div className="w-full h-0.5 bg-white/70" />
                        <div className="h-full w-0.5 bg-white/70 absolute" />
                        <span className="text-[9px] font-bold text-black/80 bg-white/80 px-1 rounded absolute bottom-1">
                          Trim
                        </span>
                      </div>
                    </div>

                    {/* Feature Accent Wall (5 cols) */}
                    <div 
                      onClick={() => setActiveSurfaceFocus("accent")}
                      className="col-span-5 rounded-xl p-3.5 shadow-xl border border-white/30 flex flex-col justify-between transition-all duration-300 hover:ring-2 hover:ring-primary cursor-pointer relative overflow-hidden"
                      style={{ backgroundColor: selectedColor.companions.accentWall.hex }}
                    >
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm bg-black/60 text-white backdrop-blur-sm">
                        Feature Accent Wall
                      </span>

                      {/* Decor Artwork / Lighting Fixture */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setActiveSurfaceFocus("trim"); }}
                        className="self-center w-20 h-16 rounded-md shadow-lg border-2 border-amber-300/80 flex items-center justify-center text-center p-1"
                        style={{ backgroundColor: selectedColor.companions.decor.hex }}
                      >
                        <span className="text-[9px] font-black text-white drop-shadow">
                          {selectedColor.companions.decor.name}
                        </span>
                      </div>

                      <div className="text-[10px] font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded self-start truncate max-w-full">
                        {selectedColor.companions.accentWall.name}
                      </div>
                    </div>

                  </div>

                  {/* Floor Plane with Baseboard Trim (Bottom 18%) */}
                  <div 
                    className="relative z-10 w-full h-[18%] rounded-xl shadow-2xl flex flex-col justify-between px-3 py-1 overflow-hidden"
                    style={{ backgroundColor: "#4A3222" }}
                  >
                    {/* Baseboard Trim line */}
                    <div 
                      onClick={() => setActiveSurfaceFocus("trim")}
                      className="w-full h-2 rounded-sm shadow cursor-pointer transition-all hover:ring-1 hover:ring-white"
                      style={{ backgroundColor: selectedColor.companions.trim.hex }}
                      title={`Trim: ${selectedColor.companions.trim.name}`}
                    />
                    <div className="flex items-center justify-between text-[10px] font-semibold text-white/75">
                      <span>Hardwood / Vitrified Tile Floor</span>
                      <span className="font-mono">{selectedColor.category}</span>
                    </div>
                  </div>

                </div>

                {/* Companion Harmony Specification Cards (5 Cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Harmonized Companion Specs
                    </h3>
                    <Badge variant="outline" className="text-[11px] border-primary/40 text-primary">
                      {selectedColor.category}
                    </Badge>
                  </div>

                  {/* 1. Primary Wall Spec */}
                  <div 
                    onClick={() => setActiveSurfaceFocus("main")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeSurfaceFocus === "main" ? "border-primary bg-primary/10 ring-1 ring-primary shadow-md" : "border-white/10 bg-card/40 hover:bg-card/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border shadow-inner shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                            {selectedColor.name}
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-mono">Main Wall</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{selectedColor.nepalCode}</div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); copyColorInfo(selectedColor.hex, "Primary Hex"); }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        {copiedCode === selectedColor.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  {/* 2. Accent Wall Companion */}
                  <div 
                    onClick={() => setActiveSurfaceFocus("accent")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeSurfaceFocus === "accent" ? "border-primary bg-primary/10 ring-1 ring-primary shadow-md" : "border-white/10 bg-card/40 hover:bg-card/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border shadow-inner shrink-0" style={{ backgroundColor: selectedColor.companions.accentWall.hex }} />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                            {selectedColor.companions.accentWall.name}
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Accent Wall</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{selectedColor.companions.accentWall.code}</div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); copyColorInfo(selectedColor.companions.accentWall.hex, "Accent Hex"); }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        {copiedCode === selectedColor.companions.accentWall.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 pl-10">
                      {selectedColor.companions.accentWall.desc}
                    </p>
                  </div>

                  {/* 3. Ceiling Harmony */}
                  <div 
                    onClick={() => setActiveSurfaceFocus("ceiling")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeSurfaceFocus === "ceiling" ? "border-primary bg-primary/10 ring-1 ring-primary shadow-md" : "border-white/10 bg-card/40 hover:bg-card/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border shadow-inner shrink-0" style={{ backgroundColor: selectedColor.companions.ceiling.hex }} />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                            {selectedColor.companions.ceiling.name}
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">Ceiling</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{selectedColor.companions.ceiling.code}</div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); copyColorInfo(selectedColor.companions.ceiling.hex, "Ceiling Hex"); }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        {copiedCode === selectedColor.companions.ceiling.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  {/* 4. Trim & Baseboard Harmony */}
                  <div 
                    onClick={() => setActiveSurfaceFocus("trim")}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      activeSurfaceFocus === "trim" ? "border-primary bg-primary/10 ring-1 ring-primary shadow-md" : "border-white/10 bg-card/40 hover:bg-card/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border shadow-inner shrink-0" style={{ backgroundColor: selectedColor.companions.trim.hex }} />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                            {selectedColor.companions.trim.name}
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Door / Trim</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{selectedColor.companions.trim.code}</div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); copyColorInfo(selectedColor.companions.trim.hex, "Trim Hex"); }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        {copiedCode === selectedColor.companions.trim.hex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Row: Comprehensive Color Swatch Browser (24+ Shades) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select A Primary Shade (Showing {filteredSwatches.length} Curated Nepal Palettes)
                  </Label>
                  <span className="text-xs text-primary font-medium">Click any swatch to load companion harmony</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredSwatches.map(swatch => {
                    const isSelected = selectedColor.id === swatch.id;
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => {
                          setSelectedColor(swatch);
                          toast.success(`Loaded "${swatch.name}" with companion harmonies`);
                        }}
                        className={`group relative p-2.5 rounded-2xl border text-left transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-2 ring-primary shadow-xl scale-[1.02]"
                            : "border-white/10 bg-card/40 hover:bg-card/80 hover:border-white/30"
                        }`}
                      >
                        {/* Swatch Color Preview with Mini Companion Dots */}
                        <div 
                          className="w-full h-16 rounded-xl shadow-inner border border-black/10 relative overflow-hidden mb-2"
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {/* 3 Companion Mini Dots */}
                          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/60 p-1 rounded-full backdrop-blur-sm">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-white/60 shadow" 
                              style={{ backgroundColor: swatch.companions.accentWall.hex }} 
                              title="Accent"
                            />
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-white/60 shadow" 
                              style={{ backgroundColor: swatch.companions.ceiling.hex }} 
                              title="Ceiling"
                            />
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-white/60 shadow" 
                              style={{ backgroundColor: swatch.companions.trim.hex }} 
                              title="Trim"
                            />
                          </div>
                        </div>

                        <div className="font-bold text-xs text-foreground truncate">{swatch.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{swatch.nepalCode.split("/")[0]}</div>
                        <div className="text-[10px] font-semibold text-primary/90 mt-1">{swatch.category}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Main 2-Column Content Layout for Calculator Inputs and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Configuration & Room Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Specification Panel: Surface Condition & Paint Quality */}
            <Card className="glass-ios-card border-white/10 shadow-xl rounded-2xl overflow-hidden backdrop-blur-xl">
              <CardHeader className="pb-4 bg-muted/20 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-bold">1. Surface Condition & Brand Quality</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5">
                    {selectedBrand}
                  </Badge>
                </div>
                <CardDescription>
                  Select plaster condition, paint grade, and preferred Nepalese manufacturer.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                
                {/* Surface Condition Selection */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Surface Plaster Condition
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSurfaceCondition("new_plaster")}
                      className={`p-3 rounded-xl text-left border transition-all text-xs sm:text-sm ${
                        surfaceCondition === "new_plaster"
                          ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                          : "border-white/10 bg-card/40 hover:bg-card/70"
                      }`}
                    >
                      <div className="font-bold text-foreground">New Fresh Plaster</div>
                      <div className="text-xs text-muted-foreground mt-1">2 coats Putty + 1 Primer + 2 Paint</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSurfaceCondition("repaint_good")}
                      className={`p-3 rounded-xl text-left border transition-all text-xs sm:text-sm ${
                        surfaceCondition === "repaint_good"
                          ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                          : "border-white/10 bg-card/40 hover:bg-card/70"
                      }`}
                    >
                      <div className="font-bold text-foreground">Repaint (Good Surface)</div>
                      <div className="text-xs text-muted-foreground mt-1">1 coat Primer + 2 Topcoats</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSurfaceCondition("repaint_rough")}
                      className={`p-3 rounded-xl text-left border transition-all text-xs sm:text-sm ${
                        surfaceCondition === "repaint_rough"
                          ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                          : "border-white/10 bg-card/40 hover:bg-card/70"
                      }`}
                    >
                      <div className="font-bold text-foreground">Repaint (Chalky/Cracked)</div>
                      <div className="text-xs text-muted-foreground mt-1">Touchup Putty + Primer + 2 Paint</div>
                    </button>
                  </div>
                </div>

                {/* Paint Quality Tier */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Paint Finish & Grade Tier
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(
                      [
                        { id: "economy", title: "Economy", sub: "Tractor / Bison", price: "NPR 380/L" },
                        { id: "premium", title: "Premium Emulsion", sub: "Apcolite / Rangoli", price: "NPR 580/L" },
                        { id: "luxury", title: "Luxury Sheen", sub: "Royale / Silk Glamor", price: "NPR 960/L" },
                        { id: "exterior_weather", title: "Exterior Weathercoat", sub: "Apex / AllGuard", price: "NPR 750/L" },
                      ] as const
                    ).map(tier => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleQualityChange(tier.id)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          paintQuality === tier.id
                            ? "border-primary bg-primary/10 ring-1 ring-primary shadow-sm"
                            : "border-white/10 bg-card/40 hover:bg-card/70"
                        }`}
                      >
                        <div className="font-bold text-sm text-foreground">{tier.title}</div>
                        <div className="text-xs text-muted-foreground">{tier.sub}</div>
                        <div className="text-xs font-semibold text-primary mt-1.5">{tier.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Selection Tabs */}
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                    Nepal Paint Manufacturer Brand
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PAINT_BRANDS.map(brand => (
                      <button
                        key={brand.name}
                        type="button"
                        onClick={() => setSelectedBrand(brand.name)}
                        className={`p-2.5 text-center rounded-xl border text-xs font-bold transition-all ${
                          selectedBrand === brand.name
                            ? "bg-foreground text-background border-foreground shadow-sm"
                            : "border-border/60 bg-muted/40 hover:bg-muted text-foreground"
                        }`}
                      >
                        {brand.logoText}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customizable Unit Rates */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Unit Rates in Nepal (Customizable NPR)
                    </span>
                    <span className="text-xs text-primary font-medium">Auto-adjusted for {paintQuality}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Topcoat (NPR / L)</Label>
                      <Input
                        type="number"
                        value={rates.paintPerLiter}
                        onChange={(e) => setRates({ ...rates, paintPerLiter: Number(e.target.value) || 0 })}
                        className="mt-1 bg-card/50 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Wall Primer (NPR / L)</Label>
                      <Input
                        type="number"
                        value={rates.primerPerLiter}
                        onChange={(e) => setRates({ ...rates, primerPerLiter: Number(e.target.value) || 0 })}
                        className="mt-1 bg-card/50 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Putty (NPR / kg)</Label>
                      <Input
                        type="number"
                        value={rates.puttyPerKg}
                        onChange={(e) => setRates({ ...rates, puttyPerKg: Number(e.target.value) || 0 })}
                        className="mt-1 bg-card/50 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Labor (NPR / sq.ft)</Label>
                      <Input
                        type="number"
                        value={rates.laborPerSqFt}
                        onChange={(e) => setRates({ ...rates, laborPerSqFt: Number(e.target.value) || 0 })}
                        className="mt-1 bg-card/50 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Mode 1: Detailed Room-by-Room Card */}
            {calculationMode === "detailed" && (
              <Card className="glass-ios-card border-white/10 shadow-xl rounded-2xl overflow-hidden backdrop-blur-xl">
                <CardHeader className="pb-4 bg-muted/20 border-b border-white/10 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg font-bold">2. Room Dimensions & Openings</CardTitle>
                    </div>
                    <CardDescription>
                      Enter lengths, widths, heights, and door/window deductions for precise net area.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddRoom}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold shadow rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Room
                  </Button>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {rooms.map((room, idx) => {
                    const wallPerimeter = 2 * (Number(room.length) + Number(room.width));
                    const wallArea = wallPerimeter * Number(room.height);
                    const ceilingArea = room.includeCeiling ? (Number(room.length) * Number(room.width)) : 0;
                    const deductions = (room.doorsCount * (room.doorWidth * room.doorHeight)) + 
                                       (room.windowsCount * (room.windowWidth * room.windowHeight));
                    const roomNetArea = Math.max(0, wallArea + ceilingArea - deductions);

                    return (
                      <div 
                        key={room.id}
                        className="p-4 rounded-xl border border-white/10 bg-card/40 hover:border-primary/40 transition-all space-y-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 max-w-xs">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <Input
                              type="text"
                              value={room.name}
                              onChange={(e) => handleUpdateRoom(room.id, "name", e.target.value)}
                              className="h-8 font-bold text-sm bg-transparent border-transparent hover:border-border focus:border-primary"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                              Net: {Math.round(roomNetArea)} sq.ft
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveRoom(room.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Room Dimensions Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Length (ft)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={room.length || ""}
                              onChange={(e) => handleUpdateRoom(room.id, "length", Number(e.target.value) || 0)}
                              className="h-8 text-sm mt-1 bg-card/60 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Width (ft)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={room.width || ""}
                              onChange={(e) => handleUpdateRoom(room.id, "width", Number(e.target.value) || 0)}
                              className="h-8 text-sm mt-1 bg-card/60 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Height (ft)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={room.height || ""}
                              onChange={(e) => handleUpdateRoom(room.id, "height", Number(e.target.value) || 0)}
                              className="h-8 text-sm mt-1 bg-card/60 rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col justify-end">
                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer h-8">
                              <input
                                type="checkbox"
                                checked={room.includeCeiling}
                                onChange={(e) => handleUpdateRoom(room.id, "includeCeiling", e.target.checked)}
                                className="w-4 h-4 accent-primary rounded"
                              />
                              <span>Paint Ceiling</span>
                            </label>
                          </div>
                        </div>

                        {/* Door & Window Deductions */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
                          <div>
                            <Label className="text-[11px] text-muted-foreground">Doors (Qty)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={room.doorsCount}
                              onChange={(e) => handleUpdateRoom(room.id, "doorsCount", Number(e.target.value) || 0)}
                              className="h-7 text-xs mt-1 bg-card/60 rounded-md"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-muted-foreground">Door Size (W×H ft)</Label>
                            <div className="flex gap-1 mt-1">
                              <Input
                                type="number"
                                step="0.25"
                                value={room.doorWidth}
                                onChange={(e) => handleUpdateRoom(room.id, "doorWidth", Number(e.target.value) || 0)}
                                className="h-7 text-xs bg-card/60 rounded-md"
                                placeholder="W"
                              />
                              <span className="self-center text-muted-foreground">×</span>
                              <Input
                                type="number"
                                step="0.5"
                                value={room.doorHeight}
                                onChange={(e) => handleUpdateRoom(room.id, "doorHeight", Number(e.target.value) || 0)}
                                className="h-7 text-xs bg-card/60 rounded-md"
                                placeholder="H"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-[11px] text-muted-foreground">Windows (Qty)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={room.windowsCount}
                              onChange={(e) => handleUpdateRoom(room.id, "windowsCount", Number(e.target.value) || 0)}
                              className="h-7 text-xs mt-1 bg-card/60 rounded-md"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-muted-foreground">Window Size (W×H ft)</Label>
                            <div className="flex gap-1 mt-1">
                              <Input
                                type="number"
                                step="0.5"
                                value={room.windowWidth}
                                onChange={(e) => handleUpdateRoom(room.id, "windowWidth", Number(e.target.value) || 0)}
                                className="h-7 text-xs bg-card/60 rounded-md"
                                placeholder="W"
                              />
                              <span className="self-center text-muted-foreground">×</span>
                              <Input
                                type="number"
                                step="0.5"
                                value={room.windowHeight}
                                onChange={(e) => handleUpdateRoom(room.id, "windowHeight", Number(e.target.value) || 0)}
                                className="h-7 text-xs bg-card/60 rounded-md"
                                placeholder="H"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}

                  <Button
                    variant="outline"
                    onClick={handleAddRoom}
                    className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 py-4 font-semibold rounded-2xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Room / Area (Kitchen, Stairs, Balcony, etc.)
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Mode 2: Quick Whole House Estimation */}
            {calculationMode === "quick" && (
              <Card className="glass-ios-card border-white/10 shadow-xl rounded-2xl overflow-hidden backdrop-blur-xl">
                <CardHeader className="pb-4 bg-muted/20 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-bold">2. Whole House Parameters & Quick Presets</CardTitle>
                  </div>
                  <CardDescription>
                    Select a ready Nepali home configuration or input total built-up square footage.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  
                  {/* Preset Cards */}
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                      Step 1: Pick Your House Type or Size
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {(
                        [
                          { id: "1bhk", label: "1 BHK Flat", area: "600 sq.ft", icon: "🏠" },
                          { id: "2bhk", label: "2 BHK House", area: "950 sq.ft", icon: "🏡" },
                          { id: "3bhk", label: "3 BHK House", area: "1,400 sq.ft", icon: "🏘️" },
                          { id: "standard_2_5", label: "2.5 Storey Home", area: "2,200 sq.ft", icon: "🏰" },
                          { id: "commercial", label: "3 Storey Commercial", area: "3,800 sq.ft", icon: "🏢" },
                        ] as const
                      ).map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => applyPreset(p.id)}
                          className="p-3 rounded-2xl text-left border border-white/10 bg-card/40 hover:border-primary/50 hover:bg-primary/10 transition-all text-xs group"
                        >
                          <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{p.icon}</div>
                          <div className="font-bold text-foreground">{p.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{p.area}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground">Built-up / Carpet Area per Floor (sq. ft)</Label>
                      <Input
                        type="number"
                        min="100"
                        value={builtUpArea || ""}
                        onChange={(e) => setBuiltUpArea(Number(e.target.value) || 0)}
                        className="mt-1 bg-card/60 h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground">Number of Storeys / Floors</Label>
                      <Input
                        type="number"
                        step="0.5"
                        min="1"
                        value={floorsCount || ""}
                        onChange={(e) => setFloorsCount(Number(e.target.value) || 1)}
                        className="mt-1 bg-card/60 h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground">Ceiling Height (ft)</Label>
                      <Input
                        type="number"
                        min="8"
                        value={wallHeight || ""}
                        onChange={(e) => setWallHeight(Number(e.target.value) || 10)}
                        className="mt-1 bg-card/60 h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Toggles for Exterior / Ceilings */}
                  <div className="flex flex-wrap gap-6 pt-2 border-t border-white/10">
                    <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quickCeiling}
                        onChange={(e) => setQuickCeiling(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span>Include Interior Ceilings</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quickExterior}
                        onChange={(e) => setQuickExterior(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span>Include Exterior Facade & Parapets</span>
                    </label>
                  </div>

                </CardContent>
              </Card>
            )}

          </div>

          {/* Right Column: BOQ, Material Quantity & Cost Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* Grand Total Highlight Card */}
            <Card className="glass-ios-card border-primary/40 shadow-2xl rounded-3xl overflow-hidden relative backdrop-blur-2xl">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-primary to-amber-500" />
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold px-3 py-1 rounded-full">
                    Verified Estimate
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">NPR Currency</span>
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground mt-2">
                  Total Estimated Painting Investment
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mt-1">
                  NPR {calculatedMetrics.grandTotal.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg. rate: <span className="font-bold text-foreground">NPR {calculatedMetrics.costPerSqFt}</span> / sq. ft (Materials + Labor)
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-3 space-y-6">
                
                {/* Surface Area Breakdown Metric */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-card/60 border border-white/10">
                  <div>
                    <div className="text-xs text-muted-foreground">Net Paintable Area</div>
                    <div className="text-lg font-bold text-foreground mt-0.5">
                      {calculatedMetrics.netArea.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">sq.ft</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Metric Area</div>
                    <div className="text-lg font-bold text-foreground mt-0.5">
                      {calculatedMetrics.netAreaSqM} <span className="text-xs font-normal text-muted-foreground">sq.m</span>
                    </div>
                  </div>
                </div>

                {/* Material Quantities Bill of Quantities (BOQ) */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-primary" />
                    Exact Material Quantities Required
                  </h4>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    {/* Topcoat Paint */}
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between shadow-sm">
                      <div>
                        <div className="font-bold text-foreground">
                          {selectedBrand} Topcoat
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {calculatedMetrics.drums20L > 0 && `${calculatedMetrics.drums20L} × 20L Drum `}
                          {calculatedMetrics.buckets4L > 0 && `${calculatedMetrics.buckets4L} × 4L `}
                          {calculatedMetrics.tins1L > 0 && `${calculatedMetrics.tins1L} × 1L`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-extrabold text-primary">
                          {calculatedMetrics.paintLiters} Liters
                        </div>
                        <div className="text-xs text-muted-foreground">
                          NPR {calculatedMetrics.paintCost.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Primer */}
                    <div className="p-3 rounded-2xl bg-card/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground">Water-based Wall Primer</div>
                        <div className="text-xs text-muted-foreground">Undercoat / Plaster Sealer</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-foreground">
                          {calculatedMetrics.primerNeededLiters} Liters
                        </div>
                        <div className="text-xs text-muted-foreground">
                          NPR {calculatedMetrics.primerCost.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Acrylic Wall Putty */}
                    {calculatedMetrics.puttyNeededKg > 0 && (
                      <div className="p-3 rounded-2xl bg-card/40 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">Acrylic Wall Putty</div>
                          <div className="text-xs text-muted-foreground">
                            ~{calculatedMetrics.puttyBags40kg} Bags (40 kg each)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-foreground">
                            {calculatedMetrics.puttyNeededKg} kg
                          </div>
                          <div className="text-xs text-muted-foreground">
                            NPR {calculatedMetrics.puttyCost.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sundries & Tools */}
                    <div className="p-3 rounded-2xl bg-card/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground">Masking Tape & Plastic Sheeting</div>
                        <div className="text-xs text-muted-foreground">Floor protection & sanding papers</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-muted-foreground">
                          Lump Sum
                        </div>
                        <div className="text-xs text-muted-foreground">
                          NPR {calculatedMetrics.sundriesCost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown Summary */}
                <div className="pt-3 border-t border-white/10 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Materials Cost:</span>
                    <span className="font-semibold text-foreground">NPR {calculatedMetrics.materialTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Labor & Finishing Charges:</span>
                    <span className="font-semibold text-foreground">NPR {calculatedMetrics.laborTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-white/10">
                    <span>Grand Total (Estimated):</span>
                    <span className="text-primary font-black text-base">NPR {calculatedMetrics.grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Send Estimate to WhatsApp for Quote</span>
                  </a>

                  <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Book Free Site Visit & Wall Inspection</span>
                  </Link>
                </div>

                {/* Trust Guarantee Note */}
                <div className="p-3 rounded-2xl bg-muted/40 border border-white/5 text-[11px] text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Our Butwal and Dang painting crews provide laser-measured quotations, dustless electric wall sanding, and official warranty for Asian Paints / Berger installations.
                  </span>
                </div>

              </CardContent>
            </Card>

            {/* Quick Nepal Painting Tips Card */}
            <Card className="glass-ios-card border-white/10 rounded-2xl print:hidden backdrop-blur-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Nepal Painting Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• <strong>Curing Time:</strong> Allow new cement plaster to cure for at least 28-35 days before applying primer and putty.</p>
                <p>• <strong>Moisture Level:</strong> Ensure wall surface moisture is under 15% using a digital moisture meter before painting.</p>
                <p>• <strong>Exterior Application:</strong> Avoid exterior painting during the Terai monsoon (Ashadh - Bhadra) for maximum bonding.</p>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
