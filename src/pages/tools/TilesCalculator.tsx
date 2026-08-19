import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  Plus, 
  Trash2, 
  Calculator, 
  Printer, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  ArrowRight, 
  Layers, 
  Building2, 
  Home, 
  Sliders, 
  RotateCcw,
  Info,
  ShieldCheck,
  Check,
  Copy,
  Ruler,
  Maximize2,
  Zap,
  CheckCircle2,
  Minus
} from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { AnimatedSection } from "@/components/AnimatedSection";

export interface TileAreaItem {
  id: string;
  name: string;
  type: "floor" | "bathroom_wall" | "kitchen_counter" | "staircase" | "parking";
  length: number;
  width: number;
  height?: number; // for wall tiles dado
  includeSkirting: boolean;
  skirtingHeightInches: number; // 4 inch or 5 inch
  doorsCount: number;
  doorWidth: number;
  materialType: "tile" | "granite" | "marble" | "parking_tile";
  tileSize: "1x1" | "2x2" | "2x4" | "1x1.5" | "custom";
  customTileLength?: number;
  customTileWidth?: number;
  graniteType?: string;
  singleMouldingRft: number;
  doubleMouldingRft: number;
  stairStepsCount?: number;
  stepTreadLength?: number; // ft
  stepTreadWidth?: number;  // ft
  stepRiserHeight?: number; // inches
}

const TILE_SIZES = [
  { id: "1x1", label: "1 × 1 ft (12″ × 12″)", sqFtPerTile: 1, pcsPerBox: 25, boxSqFt: 25, bestFor: "Bathrooms, Kitchen Walls, Balconies" },
  { id: "2x2", label: "2 × 2 ft (24″ × 24″)", sqFtPerTile: 4, pcsPerBox: 4, boxSqFt: 16, bestFor: "Standard Living Rooms, Bedrooms, Flats" },
  { id: "2x4", label: "2 × 4 ft (24″ × 48″)", sqFtPerTile: 8, pcsPerBox: 2, boxSqFt: 16, bestFor: "Premium Vitrified Luxury GVT/PGVT Slabs" },
  { id: "1x1.5", label: "1 × 1.5 ft (12″ × 18″)", sqFtPerTile: 1.5, pcsPerBox: 6, boxSqFt: 9, bestFor: "Kitchen & Bathroom Wall Dado" },
];

const GRANITE_OPTIONS = [
  { id: "black_galaxy", name: "Black Galaxy Granite (Gold Star)", ratePerSqFt: 280, desc: "Premium South Indian black granite with copper/gold flakes for counters & stairs" },
  { id: "rajasthan_black", name: "Rajasthan Jet Black Granite", ratePerSqFt: 210, desc: "Durable high-density black stone for staircases, window sills & door frames" },
  { id: "tan_brown", name: "Tan Brown Granite", ratePerSqFt: 230, desc: "Classic reddish-brown crystal grain, highly popular in Nepal residential kitchens" },
  { id: "steel_grey", name: "Steel Grey Granite", ratePerSqFt: 190, desc: "Modern matte/polished grey texture for high-traffic steps and patio corridors" },
  { id: "jhansi_red", name: "Jhansi Red Granite", ratePerSqFt: 240, desc: "Vibrant royal red stone with dark veins for entrance thresholds & puja rooms" },
  { id: "kashmir_white", name: "Kashmir White / Moon White", ratePerSqFt: 260, desc: "Elegant marble-like luxury granite with garnet specs" },
];

// Easy Mode House Presets for Regular Homeowners
const HOUSE_PRESETS = [
  {
    id: "1bhk",
    title: "1 BHK Flat",
    subtitle: "Apartment / Unit",
    approxSqFt: 600,
    bedrooms: 1,
    livingHalls: 1,
    kitchens: 1,
    bathrooms: 1,
    staircases: 0,
    icon: "🏠"
  },
  {
    id: "2bhk",
    title: "2 BHK House / Flat",
    subtitle: "Standard Family Unit",
    approxSqFt: 1000,
    bedrooms: 2,
    livingHalls: 1,
    kitchens: 1,
    bathrooms: 2,
    staircases: 1,
    icon: "🏡"
  },
  {
    id: "3bhk",
    title: "3 BHK Family Home",
    subtitle: "Spacious Single Floor",
    approxSqFt: 1500,
    bedrooms: 3,
    livingHalls: 1,
    kitchens: 1,
    bathrooms: 2,
    staircases: 1,
    icon: "🏘️"
  },
  {
    id: "standard_2_5",
    title: "2.5 Storey House",
    subtitle: "Most Popular in Butwal & Dang",
    approxSqFt: 2200,
    bedrooms: 5,
    livingHalls: 2,
    kitchens: 2,
    bathrooms: 4,
    staircases: 2,
    icon: "🏰"
  },
  {
    id: "commercial_3_5",
    title: "3.5 Storey Villa / Commercial",
    subtitle: "Large Multi-Floor Building",
    approxSqFt: 3500,
    bedrooms: 7,
    livingHalls: 3,
    kitchens: 3,
    bathrooms: 6,
    staircases: 3,
    icon: "🏢"
  }
];

const INITIAL_ADVANCED_AREAS: TileAreaItem[] = [
  {
    id: "1",
    name: "Living Hall & Dining",
    type: "floor",
    length: 20,
    width: 16,
    includeSkirting: true,
    skirtingHeightInches: 4,
    doorsCount: 2,
    doorWidth: 3.5,
    materialType: "tile",
    tileSize: "2x4",
    singleMouldingRft: 0,
    doubleMouldingRft: 0,
  },
  {
    id: "2",
    name: "Master Bedroom",
    type: "floor",
    length: 15,
    width: 14,
    includeSkirting: true,
    skirtingHeightInches: 4,
    doorsCount: 1,
    doorWidth: 3.25,
    materialType: "tile",
    tileSize: "2x2",
    singleMouldingRft: 0,
    doubleMouldingRft: 0,
  },
  {
    id: "3",
    name: "Kitchen Countertop & L-Box",
    type: "kitchen_counter",
    length: 12,
    width: 2.5,
    includeSkirting: true,
    skirtingHeightInches: 4,
    doorsCount: 0,
    doorWidth: 0,
    materialType: "granite",
    graniteType: "black_galaxy",
    tileSize: "2x4",
    singleMouldingRft: 4, // for sink cutout & side edges
    doubleMouldingRft: 12, // main 12 ft front counter edge (3x labor equivalent)
  },
  {
    id: "4",
    name: "Main Staircase (18 Steps)",
    type: "staircase",
    length: 0,
    width: 0,
    includeSkirting: true,
    skirtingHeightInches: 4,
    doorsCount: 0,
    doorWidth: 0,
    materialType: "granite",
    graniteType: "rajasthan_black",
    tileSize: "2x4",
    stairStepsCount: 18,
    stepTreadLength: 4, // 4 ft wide staircase
    stepTreadWidth: 1,  // 1 ft step depth
    stepRiserHeight: 6, // 6 inch vertical riser
    singleMouldingRft: 0,
    doubleMouldingRft: 72, // 18 steps * 4 ft = 72 Rft double moulding
  },
  {
    id: "5",
    name: "Attached Bathroom (Floor & 7ft Wall Dado)",
    type: "bathroom_wall",
    length: 8,
    width: 6,
    height: 7, // 7ft high wall dado
    includeSkirting: false,
    skirtingHeightInches: 4,
    doorsCount: 1,
    doorWidth: 2.5,
    materialType: "tile",
    tileSize: "1x1",
    singleMouldingRft: 0,
    doubleMouldingRft: 0,
  }
];

export default function TilesCalculator() {
  // Mode: "easy" (for regular homeowners) vs "advanced" (for detailed room-by-room / contractors)
  const [calculatorMode, setCalculatorMode] = useState<"easy" | "advanced">("easy");
  const [activeTab, setActiveTab] = useState<"calculator" | "moulding_guide">("calculator");
  
  // Easy Mode State
  const [easyPreset, setEasyPreset] = useState<string>("standard_2_5");
  const [easyBuiltUpArea, setEasyBuiltUpArea] = useState<number>(2200);
  const [easyBedrooms, setEasyBedrooms] = useState<number>(4);
  const [easyLivingHalls, setEasyLivingHalls] = useState<number>(2);
  const [easyKitchens, setEasyKitchens] = useState<number>(2);
  const [easyBathrooms, setEasyBathrooms] = useState<number>(3);
  const [easyStaircases, setEasyStaircases] = useState<number>(2);
  const [easyQualityTier, setEasyQualityTier] = useState<"economy" | "standard" | "luxury">("standard");
  const [easyIncludeParking, setEasyIncludeParking] = useState<boolean>(true);

  // Advanced Mode State
  const [advancedAreas, setAdvancedAreas] = useState<TileAreaItem[]>(INITIAL_ADVANCED_AREAS);
  const [wastagePercentage, setWastagePercentage] = useState<number>(8); // 8% standard in Nepal

  // Unit Rates (NPR)
  const [rates, setRates] = useState({
    tile1x1Rate: 75,
    tile2x2Rate: 110,
    tile2x4Rate: 165,
    graniteBlackGalaxy: 280,
    graniteRajasthanBlack: 210,
    graniteTanBrown: 230,
    cementBagRate: 720,
    sandPerCft: 55,
    adhesiveBagRate: 650,
    groutPerKg: 120,
    
    // Labor rates in Nepal
    tileLaborPerSqFt: 32,
    wallTileLaborPerSqFt: 38,
    graniteLaborPerSqFt: 48,
    skirtingLaborPerRft: 20,
    singleMouldingLaborPerRft: 55,
    doubleMouldingLaborPerRft: 160,
  });

  // Apply Easy Preset
  const handleSelectPreset = (presetId: string) => {
    const preset = HOUSE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setEasyPreset(presetId);
      setEasyBuiltUpArea(preset.approxSqFt);
      setEasyBedrooms(preset.bedrooms);
      setEasyLivingHalls(preset.livingHalls);
      setEasyKitchens(preset.kitchens);
      setEasyBathrooms(preset.bathrooms);
      setEasyStaircases(preset.staircases);
      toast.success(`Loaded ${preset.title} preset`);
    }
  };

  // Convert Easy Mode to Advanced Areas
  const handleTransferToAdvanced = () => {
    const generatedAreas: TileAreaItem[] = [];
    let idCounter = 1;

    // Living Halls (2x4 tiles)
    for (let i = 1; i <= easyLivingHalls; i++) {
      generatedAreas.push({
        id: (idCounter++).toString(),
        name: `Living Hall ${i > 1 ? i : ""}`.trim(),
        type: "floor",
        length: 18,
        width: 14,
        includeSkirting: true,
        skirtingHeightInches: 4,
        doorsCount: 2,
        doorWidth: 3.5,
        materialType: "tile",
        tileSize: "2x4",
        singleMouldingRft: 0,
        doubleMouldingRft: 0,
      });
    }

    // Bedrooms (2x2 tiles)
    for (let i = 1; i <= easyBedrooms; i++) {
      generatedAreas.push({
        id: (idCounter++).toString(),
        name: `Bedroom ${i}`,
        type: "floor",
        length: 14,
        width: 12,
        includeSkirting: true,
        skirtingHeightInches: 4,
        doorsCount: 1,
        doorWidth: 3.25,
        materialType: "tile",
        tileSize: "2x2",
        singleMouldingRft: 0,
        doubleMouldingRft: 0,
      });
    }

    // Kitchens (Floor + Granite counter with double moulding)
    for (let i = 1; i <= easyKitchens; i++) {
      generatedAreas.push({
        id: (idCounter++).toString(),
        name: `Kitchen Floor ${i > 1 ? i : ""}`.trim(),
        type: "floor",
        length: 12,
        width: 10,
        includeSkirting: true,
        skirtingHeightInches: 4,
        doorsCount: 1,
        doorWidth: 3,
        materialType: "tile",
        tileSize: "2x2",
        singleMouldingRft: 0,
        doubleMouldingRft: 0,
      });
      generatedAreas.push({
        id: (idCounter++).toString(),
        name: `Kitchen ${i} Granite Countertop`,
        type: "kitchen_counter",
        length: 12,
        width: 2.5,
        includeSkirting: true,
        skirtingHeightInches: 4,
        doorsCount: 0,
        doorWidth: 0,
        materialType: "granite",
        graniteType: easyQualityTier === "luxury" ? "black_galaxy" : "tan_brown",
        tileSize: "2x4",
        singleMouldingRft: 4,
        doubleMouldingRft: 12,
      });
    }

    // Bathrooms (Floor + 7ft wall tile dado)
    for (let i = 1; i <= easyBathrooms; i++) {
      generatedAreas.push({
        id: (idCounter++).toString(),
        name: `Bathroom ${i} (Floor & 7ft Dado)`,
        type: "bathroom_wall",
        length: 8,
        width: 6,
        height: 7,
        includeSkirting: false,
        skirtingHeightInches: 4,
        doorsCount: 1,
        doorWidth: 2.5,
        materialType: "tile",
        tileSize: "1x1",
        singleMouldingRft: 0,
        doubleMouldingRft: 0,
      });
    }

    // Staircases (Granite steps with double moulding)
    for (let i = 1; i <= easyStaircases; i++) {
      generatedAreas.push({
        id: (idCounter++).toString(),
        name: `Staircase Flight ${i} (18 Steps)`,
        type: "staircase",
        length: 0,
        width: 0,
        includeSkirting: true,
        skirtingHeightInches: 4,
        doorsCount: 0,
        doorWidth: 0,
        materialType: "granite",
        graniteType: "rajasthan_black",
        tileSize: "2x4",
        stairStepsCount: 18,
        stepTreadLength: 4,
        stepTreadWidth: 1,
        stepRiserHeight: 6,
        singleMouldingRft: 0,
        doubleMouldingRft: 72,
      });
    }

    // Parking Paver if enabled
    if (easyIncludeParking) {
      generatedAreas.push({
        id: (idCounter++).toString(),
        name: "Porch & Car Parking Area",
        type: "parking",
        length: 16,
        width: 14,
        includeSkirting: false,
        skirtingHeightInches: 4,
        doorsCount: 0,
        doorWidth: 0,
        materialType: "parking_tile",
        tileSize: "1x1",
        singleMouldingRft: 0,
        doubleMouldingRft: 0,
      });
    }

    setAdvancedAreas(generatedAreas);
    setCalculatorMode("advanced");
    toast.success("Converted your house plan into detailed room-by-room editor!");
  };

  // Advanced Mode Helpers
  const handleAddArea = (type: TileAreaItem["type"] = "floor") => {
    const newArea: TileAreaItem = {
      id: Date.now().toString(),
      name: `New ${type === "kitchen_counter" ? "Counter" : type === "staircase" ? "Stairs" : "Room"} ${advancedAreas.length + 1}`,
      type,
      length: type === "staircase" ? 0 : 12,
      width: type === "staircase" ? 0 : 10,
      height: type === "bathroom_wall" ? 7 : undefined,
      includeSkirting: type !== "bathroom_wall",
      skirtingHeightInches: 4,
      doorsCount: 1,
      doorWidth: 3,
      materialType: type === "kitchen_counter" || type === "staircase" ? "granite" : "tile",
      graniteType: type === "kitchen_counter" ? "black_galaxy" : type === "staircase" ? "rajasthan_black" : undefined,
      tileSize: type === "bathroom_wall" ? "1x1" : "2x2",
      stairStepsCount: type === "staircase" ? 16 : undefined,
      stepTreadLength: type === "staircase" ? 3.5 : undefined,
      stepTreadWidth: type === "staircase" ? 1 : undefined,
      stepRiserHeight: type === "staircase" ? 6 : undefined,
      singleMouldingRft: 0,
      doubleMouldingRft: type === "staircase" ? 56 : type === "kitchen_counter" ? 10 : 0,
    };
    setAdvancedAreas(prev => [...prev, newArea]);
    toast.success("Area added to calculation");
  };

  const handleRemoveArea = (id: string) => {
    if (advancedAreas.length <= 1) {
      toast.error("You must keep at least one area");
      return;
    }
    setAdvancedAreas(prev => prev.filter(a => a.id !== id));
    toast.info("Area removed");
  };

  const handleUpdateArea = <K extends keyof TileAreaItem>(id: string, key: K, value: TileAreaItem[K]) => {
    setAdvancedAreas(prev => prev.map(a => a.id === id ? { ...a, [key]: value } : a));
  };

  // Metrics Calculation (for both Easy and Advanced modes)
  const metrics = useMemo(() => {
    if (calculatorMode === "easy") {
      // High-precision Nepal Architectural Ratios for Easy Mode
      // Floor tile area is roughly 70% of built up area
      const floorTileSqFtNet = Math.round(easyBuiltUpArea * 0.68);
      // Wall tile dado: ~200 sq.ft per bathroom
      const bathroomDadoSqFt = easyBathrooms * 190;
      const totalTileSqFtNet = floorTileSqFtNet + bathroomDadoSqFt;
      
      // Granite: Kitchen (30 sq.ft per kitchen) + Staircase (108 sq.ft per 18-step flight)
      const kitchenGraniteSqFt = easyKitchens * 32;
      const stairsGraniteSqFt = easyStaircases * 110;
      const totalGraniteSqFtNet = kitchenGraniteSqFt + stairsGraniteSqFt;

      // Skirting: ~0.45 Rft per sq ft of floor area
      const totalSkirtingRft = Math.round(floorTileSqFtNet * 0.42);

      // Moulding: 12 Rft per kitchen counter + 72 Rft double moulding per 18-step stair flight
      const totalDoubleMouldingRft = (easyKitchens * 12) + (easyStaircases * 72);
      const totalSingleMouldingRft = easyKitchens * 4;
      const doubleMouldingLaborEquivalentRft = totalDoubleMouldingRft * 3;

      // Gross with 8% waste
      const totalTileGrossSqFt = Math.ceil(totalTileSqFtNet * 1.08);
      const totalGraniteGrossSqFt = Math.ceil(totalGraniteSqFtNet * 1.10);

      // Box counts
      // In easy mode, living uses 2x4 (35%), bedrooms use 2x2 (45%), bathrooms use 1x1 (20%)
      const boxes2x4 = Math.ceil((totalTileGrossSqFt * 0.35) / 16);
      const boxes2x2 = Math.ceil((totalTileGrossSqFt * 0.45) / 16);
      const boxes1x1 = Math.ceil((bathroomDadoSqFt * 1.08) / 25);

      // Materials
      const totalPlasterArea = totalTileGrossSqFt + totalGraniteGrossSqFt;
      const cementBagsCount = Math.ceil(totalPlasterArea / 45);
      const sandCftCount = Math.ceil((totalPlasterArea / 100) * 11);
      const adhesiveBagsCount = Math.ceil((bathroomDadoSqFt + totalGraniteGrossSqFt) / 40);
      const groutKg = Math.ceil(totalTileGrossSqFt / 65);

      // Rate multiplier by quality tier
      const tileAvgRate = easyQualityTier === "luxury" ? 175 : easyQualityTier === "standard" ? 125 : 95;
      const graniteAvgRate = easyQualityTier === "luxury" ? 280 : 220;

      const tileCost = totalTileGrossSqFt * tileAvgRate;
      const graniteCost = totalGraniteGrossSqFt * graniteAvgRate;
      const cementCost = cementBagsCount * rates.cementBagRate;
      const sandCost = sandCftCount * rates.sandPerCft;
      const adhesiveCost = adhesiveBagsCount * rates.adhesiveBagRate;
      const groutCost = groutKg * rates.groutPerKg;
      const materialsTotal = Math.round(tileCost + graniteCost + cementCost + sandCost + adhesiveCost + groutCost);

      const tileLayingLabor = Math.round(floorTileSqFtNet * rates.tileLaborPerSqFt);
      const wallDadoLabor = Math.round(bathroomDadoSqFt * rates.wallTileLaborPerSqFt);
      const graniteLabor = Math.round(totalGraniteSqFtNet * rates.graniteLaborPerSqFt);
      const skirtingLabor = Math.round(totalSkirtingRft * rates.skirtingLaborPerRft);
      const singleMouldingLabor = Math.round(totalSingleMouldingRft * rates.singleMouldingLaborPerRft);
      const doubleMouldingLabor = Math.round(totalDoubleMouldingRft * rates.doubleMouldingLaborPerRft);

      const laborTotal = tileLayingLabor + wallDadoLabor + graniteLabor + skirtingLabor + singleMouldingLabor + doubleMouldingLabor;
      const grandTotal = materialsTotal + laborTotal;

      return {
        totalTileSqFtNet,
        totalTileGrossSqFt,
        totalGraniteSqFtNet,
        totalGraniteGrossSqFt,
        totalSkirtingRft,
        totalSingleMouldingRft,
        totalDoubleMouldingRft,
        doubleMouldingLaborEquivalentRft,
        boxes1x1,
        boxes2x2,
        boxes2x4,
        cementBagsCount,
        sandCftCount,
        adhesiveBagsCount,
        groutKg,
        materialsTotal,
        laborTotal,
        grandTotal,
        costPerSqFt: (grandTotal / Math.max(1, totalTileGrossSqFt + totalGraniteGrossSqFt)).toFixed(1),
      };

    } else {
      // Advanced Mode Calculation
      let totalTileSqFtNet = 0;
      let totalGraniteSqFtNet = 0;
      let totalSkirtingRft = 0;
      let totalSingleMouldingRft = 0;
      let totalDoubleMouldingRft = 0;
      let tile1x1SqFt = 0;
      let tile2x2SqFt = 0;
      let tile2x4SqFt = 0;
      let wallDadoSqFt = 0;

      advancedAreas.forEach(area => {
        let areaSqFt = 0;
        let skirting = 0;

        if (area.type === "staircase") {
          const steps = Number(area.stairStepsCount) || 16;
          const treadL = Number(area.stepTreadLength) || 3.5;
          const treadW = Number(area.stepTreadWidth) || 1;
          const riserH = (Number(area.stepRiserHeight) || 6) / 12;

          const treadsArea = steps * (treadL * treadW);
          const risersArea = steps * (treadL * riserH);
          areaSqFt = treadsArea + risersArea;

          if (area.includeSkirting) {
            skirting = steps * 1.4;
          }
        } else if (area.type === "bathroom_wall") {
          const floorArea = (Number(area.length) || 0) * (Number(area.width) || 0);
          const perimeter = 2 * ((Number(area.length) || 0) + (Number(area.width) || 0));
          const dadoH = Number(area.height) || 7;
          const doorDeduction = (Number(area.doorsCount) || 0) * ((Number(area.doorWidth) || 2.5) * dadoH);
          const wallArea = Math.max(0, (perimeter * dadoH) - doorDeduction);
          
          areaSqFt = floorArea + wallArea;
          wallDadoSqFt += wallArea;
        } else {
          areaSqFt = (Number(area.length) || 0) * (Number(area.width) || 0);
          
          if (area.includeSkirting) {
            const perimeter = 2 * ((Number(area.length) || 0) + (Number(area.width) || 0));
            const doorDeduction = (Number(area.doorsCount) || 0) * (Number(area.doorWidth) || 3);
            skirting = Math.max(0, perimeter - doorDeduction);
          }
        }

        // Nepal Labor Rule: Minimum 1 Foot Rule
        let singleM = Number(area.singleMouldingRft) || 0;
        let doubleM = Number(area.doubleMouldingRft) || 0;
        if (singleM > 0 && singleM < 1) singleM = 1;
        if (doubleM > 0 && doubleM < 1) doubleM = 1;

        totalSingleMouldingRft += singleM;
        totalDoubleMouldingRft += doubleM;
        totalSkirtingRft += skirting;

        if (area.materialType === "granite") {
          totalGraniteSqFtNet += areaSqFt;
        } else {
          totalTileSqFtNet += areaSqFt;
          if (area.tileSize === "1x1") tile1x1SqFt += areaSqFt;
          if (area.tileSize === "2x2") tile2x2SqFt += areaSqFt;
          if (area.tileSize === "2x4") tile2x4SqFt += areaSqFt;
        }
      });

      const tileWastageSqFt = totalTileSqFtNet * (wastagePercentage / 100);
      const graniteWastageSqFt = totalGraniteSqFtNet * ((wastagePercentage + 2) / 100);

      const totalTileGrossSqFt = Math.ceil(totalTileSqFtNet + tileWastageSqFt);
      const totalGraniteGrossSqFt = Math.ceil(totalGraniteSqFtNet + graniteWastageSqFt);

      const boxes1x1 = Math.ceil((tile1x1SqFt * (1 + wastagePercentage / 100)) / 25);
      const boxes2x2 = Math.ceil((tile2x2SqFt * (1 + wastagePercentage / 100)) / 16);
      const boxes2x4 = Math.ceil((tile2x4SqFt * (1 + wastagePercentage / 100)) / 16);

      const doubleMouldingLaborEquivalentRft = totalDoubleMouldingRft * 3;

      const totalPlasterArea = totalTileGrossSqFt + totalGraniteGrossSqFt;
      const cementBagsCount = Math.ceil(totalPlasterArea / 45);
      const sandCftCount = Math.ceil((totalPlasterArea / 100) * 11);
      
      const adhesiveArea = wallDadoSqFt + (totalGraniteGrossSqFt * 0.7);
      const adhesiveBagsCount = Math.ceil(adhesiveArea / 40);

      const groutKg = Math.ceil(totalTileGrossSqFt / 70);

      const tileCost = (tile1x1SqFt * (1 + wastagePercentage / 100) * rates.tile1x1Rate) +
                       (tile2x2SqFt * (1 + wastagePercentage / 100) * rates.tile2x2Rate) +
                       (tile2x4SqFt * (1 + wastagePercentage / 100) * rates.tile2x4Rate);

      const graniteCost = totalGraniteGrossSqFt * rates.graniteBlackGalaxy;
      const cementCost = cementBagsCount * rates.cementBagRate;
      const sandCost = sandCftCount * rates.sandPerCft;
      const adhesiveCost = adhesiveBagsCount * rates.adhesiveBagRate;
      const groutCost = groutKg * rates.groutPerKg;
      const materialsTotal = Math.round(tileCost + graniteCost + cementCost + sandCost + adhesiveCost + groutCost);

      const tileLayingLabor = Math.round((totalTileSqFtNet - wallDadoSqFt) * rates.tileLaborPerSqFt);
      const wallDadoLabor = Math.round(wallDadoSqFt * rates.wallTileLaborPerSqFt);
      const graniteLayingLabor = Math.round(totalGraniteSqFtNet * rates.graniteLaborPerSqFt);
      const skirtingLabor = Math.round(totalSkirtingRft * rates.skirtingLaborPerRft);
      const singleMouldingLabor = Math.round(totalSingleMouldingRft * rates.singleMouldingLaborPerRft);
      const doubleMouldingLabor = Math.round(totalDoubleMouldingRft * rates.doubleMouldingLaborPerRft);

      const laborTotal = tileLayingLabor + wallDadoLabor + graniteLayingLabor + skirtingLabor + singleMouldingLabor + doubleMouldingLabor;
      const grandTotal = materialsTotal + laborTotal;

      return {
        totalTileSqFtNet: Math.round(totalTileSqFtNet),
        totalTileGrossSqFt,
        totalGraniteSqFtNet: Math.round(totalGraniteSqFtNet),
        totalGraniteGrossSqFt,
        totalSkirtingRft: Math.round(totalSkirtingRft),
        totalSingleMouldingRft: Math.round(totalSingleMouldingRft),
        totalDoubleMouldingRft: Math.round(totalDoubleMouldingRft),
        doubleMouldingLaborEquivalentRft: Math.round(doubleMouldingLaborEquivalentRft),
        boxes1x1,
        boxes2x2,
        boxes2x4,
        cementBagsCount,
        sandCftCount,
        adhesiveBagsCount,
        groutKg,
        materialsTotal,
        laborTotal,
        grandTotal,
        costPerSqFt: (grandTotal / Math.max(1, totalTileGrossSqFt + totalGraniteGrossSqFt)).toFixed(1),
      };
    }
  }, [calculatorMode, easyBuiltUpArea, easyBedrooms, easyLivingHalls, easyKitchens, easyBathrooms, easyStaircases, easyQualityTier, easyIncludeParking, advancedAreas, wastagePercentage, rates]);

  // WhatsApp share
  const generateWhatsAppLink = () => {
    const text = `Namaste Butwal Construction & Builders team!
I generated my Tiling, Granite & Skirting estimate (${calculatorMode === "easy" ? "Quick House Estimator" : "Custom Room-by-Room BOQ"}):
- Total Tile Surface: ${metrics.totalTileGrossSqFt} sq. ft
- Granite Surface: ${metrics.totalGraniteGrossSqFt} sq. ft
- Skirting: ${metrics.totalSkirtingRft} Running Feet
- Double Moulding: ${metrics.totalDoubleMouldingRft} Rft (3x labor eqv = ${metrics.doubleMouldingLaborEquivalentRft} Rft)
- Cement & Sand: ${metrics.cementBagsCount} Bags + ${metrics.sandCftCount} CFT Sand
- Estimated Total: NPR ${metrics.grandTotal.toLocaleString()}
Please review this calculation and advise on site measurement.`;
    return `https://wa.me/9779763653181?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background pt-32 pb-24 text-foreground">
      <SEOHead 
        title="Tiles & Granite Area Calculator Nepal | Easy 1-Click Estimator" 
        description="Easy 1-click tile & granite estimator for homeowners in Nepal. Calculate tile boxes (1x1, 2x2, 2x4), skirting, double moulding 3x labor rule, cement & live NPR costs."
        canonicalUrl="/tools/tiles-calculator"
      />

      {/* Ambient background mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden print:hidden">
        <div className="absolute top-1/12 left-1/12 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/10 via-primary/10 to-purple-500/8 blur-[160px]" />
        <div className="absolute top-1/2 right-1/12 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-amber-500/10 to-rose-500/10 blur-[170px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Breadcrumb & Hero */}
        <AnimatedSection direction="down" className="text-center mb-8 print:mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs sm:text-sm font-semibold mb-4 shadow-sm backdrop-blur-md">
            <Grid3X3 className="w-4 h-4 text-primary animate-pulse" />
            <span>Nepal Masonry & Finishing Standard</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
            Tiles, Granite & <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-primary to-amber-500">Moulding</span> Calculator
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed print:hidden">
            Instant estimate for <strong>regular homeowners</strong> or detailed room-by-room BOQ with Nepal's <strong>minimum 1-foot labor rule</strong> & <strong>3x double moulding rate</strong>.
          </p>
        </AnimatedSection>

        {/* Top Control Bar: Mode Toggle (Easy vs Advanced) */}
        <div className="glass-ios-card border-white/10 p-3 sm:p-4 rounded-2xl mb-8 shadow-xl print:hidden backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          
          {/* Easy vs Advanced Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setCalculatorMode("easy")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                calculatorMode === "easy"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ Easy 1-Minute Estimator (For Homeowners)</span>
            </button>

            <button
              type="button"
              onClick={() => setCalculatorMode("advanced")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                calculatorMode === "advanced"
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders className="w-4 h-4 text-blue-300" />
              <span>📐 Detailed Room-by-Room BOQ</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant={activeTab === "moulding_guide" ? "default" : "outline"}
              onClick={() => setActiveTab(activeTab === "moulding_guide" ? "calculator" : "moulding_guide")}
              className="text-xs rounded-xl border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
            >
              <Ruler className="w-3.5 h-3.5 mr-1" />
              Nepal 1-Ft & 3x Moulding Rules
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="text-xs border-border/70 hover:bg-muted/70 rounded-xl"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print BOQ
            </Button>
          </div>
        </div>

        {/* Nepal Moulding Educational Card */}
        {activeTab === "moulding_guide" && (
          <AnimatedSection direction="up" className="mb-8">
            <Card className="glass-ios-card border-white/15 shadow-2xl rounded-3xl p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Official Nepal Tiling, Skirting & Moulding Measurement Rules</h3>
                  <p className="text-xs text-muted-foreground">Standardized by Masonry Contractors in Butwal, Dang, Kathmandu & Pokhara</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border border-white/10 bg-card/50 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary font-black text-xs flex items-center justify-center">1</div>
                  <h4 className="font-bold text-sm text-foreground">Minimum 1-Foot Labor Rule</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If a tile, granite step, window sill, or skirting piece is <strong>cut in half or is less than 1 foot</strong> (e.g., 4″ or 6″ width), the mason labor rate is strictly measured as a <strong>minimum of 1 Running Foot (or 1 sq. ft)</strong> to cover diamond-wheel cutting time, blade wear, and edge sanding.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-card/50 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center">2</div>
                  <h4 className="font-bold text-sm text-foreground">Double Moulding (3 Feet Work Rule)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>1 linear foot of Double Moulding (Sandwich Bullnose)</strong> is measured as <strong>3 running feet equivalent work</strong> (or at 3x rate ~NPR 150-180/Rft). It requires bottom companion strip cutting, epoxy clamp bonding, and dual 180° rounded mirror polishing.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-card/50 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 font-black text-xs flex items-center justify-center">3</div>
                  <h4 className="font-bold text-sm text-foreground">Skirting Measurement & Cuts</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Wall skirting is measured along the room perimeter minus door openings. Cutting a 2×2 ft tile into 4″ skirting strips yields <strong>6 pieces = 12 running feet</strong> per tile.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        )}

        {/* Main 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Easy Form OR Advanced Area Editor (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {calculatorMode === "easy" ? (
              /* EASY MODE (FOR HOMEOWNERS) */
              <Card className="glass-ios-card border-white/10 shadow-xl rounded-3xl overflow-hidden backdrop-blur-xl">
                <CardHeader className="pb-4 bg-muted/20 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Quick Home Tile & Granite Setup
                      </CardTitle>
                      <CardDescription>
                        Simply choose your house type or tap plus/minus for your rooms.
                      </CardDescription>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      Homeowner Friendly
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  
                  {/* Step 1: House Size Presets */}
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                      Step 1: Pick Your House Type or Size
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {HOUSE_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPreset(preset.id)}
                          className={`p-3.5 rounded-2xl text-left border transition-all ${
                            easyPreset === preset.id
                              ? "border-primary bg-primary/15 shadow-md ring-1 ring-primary"
                              : "border-white/10 bg-card/40 hover:bg-card/70"
                          }`}
                        >
                          <div className="text-2xl mb-1">{preset.icon}</div>
                          <div className="font-bold text-xs sm:text-sm text-foreground">{preset.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{preset.approxSqFt} sq.ft area</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Room Counters (Easy Plus/Minus) */}
                  <div className="pt-2 border-t border-white/10">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                      Step 2: Room & Staircase Quantities
                    </Label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      
                      {/* Bedrooms */}
                      <div className="p-3 rounded-2xl bg-card/50 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">🛏️ Bedrooms</div>
                          <div className="text-[11px] text-muted-foreground">Standard 2×2 floor tiles</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyBedrooms(Math.max(0, easyBedrooms - 1))}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="font-bold text-sm w-5 text-center">{easyBedrooms}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyBedrooms(easyBedrooms + 1)}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Living Halls */}
                      <div className="p-3 rounded-2xl bg-card/50 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">🛋️ Living & Dining Halls</div>
                          <div className="text-[11px] text-muted-foreground">Luxury 2×4 GVT Slabs</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyLivingHalls(Math.max(0, easyLivingHalls - 1))}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="font-bold text-sm w-5 text-center">{easyLivingHalls}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyLivingHalls(easyLivingHalls + 1)}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Kitchens */}
                      <div className="p-3 rounded-2xl bg-card/50 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">🍳 Kitchens & Counters</div>
                          <div className="text-[11px] text-muted-foreground">Tiles + Granite Counter</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyKitchens(Math.max(0, easyKitchens - 1))}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="font-bold text-sm w-5 text-center">{easyKitchens}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyKitchens(easyKitchens + 1)}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Bathrooms */}
                      <div className="p-3 rounded-2xl bg-card/50 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">🚿 Bathrooms</div>
                          <div className="text-[11px] text-muted-foreground">Floor + 7ft Wall Tile Dado</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyBathrooms(Math.max(0, easyBathrooms - 1))}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="font-bold text-sm w-5 text-center">{easyBathrooms}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyBathrooms(easyBathrooms + 1)}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Staircases */}
                      <div className="p-3 rounded-2xl bg-card/50 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-amber-400">🪜 Staircase Flights</div>
                          <div className="text-[11px] text-muted-foreground">Granite + Double Moulding</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyStaircases(Math.max(0, easyStaircases - 1))}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </Button>
                          <span className="font-bold text-sm w-5 text-center">{easyStaircases}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEasyStaircases(easyStaircases + 1)}
                            className="h-7 w-7 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Parking Paver */}
                      <div className="p-3 rounded-2xl bg-card/50 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">🚗 Car Parking / Porch</div>
                          <div className="text-[11px] text-muted-foreground">Heavy-duty paver tiles</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={easyIncludeParking}
                            onChange={(e) => setEasyIncludeParking(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                        </label>
                      </div>

                    </div>
                  </div>

                  {/* Step 3: Quality Preference */}
                  <div className="pt-2 border-t border-white/10">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                      Step 3: Finishing & Quality Grade
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "economy", name: "Economy", desc: "2×2 Tiles + Tan Brown Granite", tag: "Budget" },
                          { id: "standard", name: "Standard (Best Value)", desc: "2×4 Living + 2×2 Bedrooms + Double Moulding", tag: "Popular" },
                          { id: "luxury", name: "Luxury Premium", desc: "Large GVT Slabs + Black Galaxy Granite", tag: "High-End" },
                        ] as const
                      ).map(tier => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setEasyQualityTier(tier.id)}
                          className={`p-3.5 rounded-2xl text-left border transition-all ${
                            easyQualityTier === tier.id
                              ? "border-primary bg-primary/15 shadow-md ring-1 ring-primary"
                              : "border-white/10 bg-card/40 hover:bg-card/70"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-xs sm:text-sm text-foreground">{tier.name}</div>
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{tier.tag}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1">{tier.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Button to transfer to advanced */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      Want to customize exact room lengths, widths & door cutouts?
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTransferToAdvanced}
                      className="text-xs border-primary/40 text-primary hover:bg-primary/10 rounded-xl"
                    >
                      <span>Open in Detailed Room Editor</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ) : (
              /* ADVANCED MODE (ROOM BY ROOM) */
              <Card className="glass-ios-card border-white/10 shadow-xl rounded-2xl overflow-hidden backdrop-blur-xl">
                <CardHeader className="pb-4 bg-muted/20 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Detailed Room-by-Room Editor
                    </CardTitle>
                    <CardDescription>
                      Configure specific lengths, widths, skirting, and moulding per room.
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddArea("floor")}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl shadow"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      + Room Floor
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddArea("kitchen_counter")}
                      className="text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10 rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      + Granite Counter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddArea("staircase")}
                      className="text-xs border-blue-500/40 text-blue-300 hover:bg-blue-500/10 rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      + Staircase
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddArea("bathroom_wall")}
                      className="text-xs border-purple-500/40 text-purple-300 hover:bg-purple-500/10 rounded-xl"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      + Bathroom Dado
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {advancedAreas.map((area, idx) => {
                    let netSqFt = 0;
                    if (area.type === "staircase") {
                      const steps = area.stairStepsCount || 16;
                      const tread = (area.stepTreadLength || 3.5) * (area.stepTreadWidth || 1);
                      const riser = (area.stepTreadLength || 3.5) * ((area.stepRiserHeight || 6) / 12);
                      netSqFt = steps * (tread + riser);
                    } else if (area.type === "bathroom_wall") {
                      const fl = (area.length || 0) * (area.width || 0);
                      const perim = 2 * ((area.length || 0) + (area.width || 0));
                      const wall = Math.max(0, (perim * (area.height || 7)) - ((area.doorsCount || 1) * 2.5 * (area.height || 7)));
                      netSqFt = fl + wall;
                    } else {
                      netSqFt = (area.length || 0) * (area.width || 0);
                    }

                    return (
                      <div 
                        key={area.id}
                        className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-card/40 hover:border-primary/40 transition-all space-y-4 shadow-sm"
                      >
                        {/* Area Header */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-1 max-w-sm">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <Input
                              type="text"
                              value={area.name}
                              onChange={(e) => handleUpdateArea(area.id, "name", e.target.value)}
                              className="h-8 font-bold text-sm bg-transparent border-transparent hover:border-border focus:border-primary"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                              {Math.round(netSqFt)} sq.ft
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveArea(area.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Material & Size Selector */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <Label className="text-muted-foreground text-[11px]">Material Category</Label>
                            <select
                              value={area.materialType}
                              onChange={(e) => handleUpdateArea(area.id, "materialType", e.target.value as TileAreaItem["materialType"])}
                              className="w-full h-8 mt-1 bg-card/70 border border-white/10 rounded-lg px-2 text-foreground font-semibold"
                            >
                              <option value="tile">Vitrified Ceramic Tile</option>
                              <option value="granite">Natural Granite Stone</option>
                              <option value="marble">Marble / Indian Katni</option>
                              <option value="parking_tile">Heavy Parking Tile</option>
                            </select>
                          </div>

                          {area.materialType === "tile" ? (
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Tile Dimension Size</Label>
                              <select
                                value={area.tileSize}
                                onChange={(e) => handleUpdateArea(area.id, "tileSize", e.target.value as TileAreaItem["tileSize"])}
                                className="w-full h-8 mt-1 bg-card/70 border border-white/10 rounded-lg px-2 text-foreground font-semibold"
                              >
                                {TILE_SIZES.map(s => (
                                  <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Granite Stone Variety</Label>
                              <select
                                value={area.graniteType || "black_galaxy"}
                                onChange={(e) => handleUpdateArea(area.id, "graniteType", e.target.value)}
                                className="w-full h-8 mt-1 bg-card/70 border border-white/10 rounded-lg px-2 text-foreground font-semibold"
                              >
                                {GRANITE_OPTIONS.map(g => (
                                  <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="flex flex-col justify-end">
                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer h-8">
                              <input
                                type="checkbox"
                                checked={area.includeSkirting}
                                onChange={(e) => handleUpdateArea(area.id, "includeSkirting", e.target.checked)}
                                className="w-4 h-4 accent-primary rounded"
                              />
                              <span>4″ Wall Skirting</span>
                            </label>
                          </div>
                        </div>

                        {/* Dimensions Section */}
                        {area.type === "staircase" ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Step Count</Label>
                              <Input
                                type="number"
                                value={area.stairStepsCount || 16}
                                onChange={(e) => handleUpdateArea(area.id, "stairStepsCount", Number(e.target.value) || 0)}
                                className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Step Width (Length ft)</Label>
                              <Input
                                type="number"
                                step="0.5"
                                value={area.stepTreadLength || 3.5}
                                onChange={(e) => handleUpdateArea(area.id, "stepTreadLength", Number(e.target.value) || 0)}
                                className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Tread Depth (ft)</Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={area.stepTreadWidth || 1}
                                onChange={(e) => handleUpdateArea(area.id, "stepTreadWidth", Number(e.target.value) || 0)}
                                className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Riser Height (in)</Label>
                              <Input
                                type="number"
                                step="0.5"
                                value={area.stepRiserHeight || 6}
                                onChange={(e) => handleUpdateArea(area.id, "stepRiserHeight", Number(e.target.value) || 0)}
                                className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Length (ft)</Label>
                              <Input
                                type="number"
                                min="1"
                                value={area.length || ""}
                                onChange={(e) => handleUpdateArea(area.id, "length", Number(e.target.value) || 0)}
                                className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Width (ft)</Label>
                              <Input
                                type="number"
                                min="1"
                                value={area.width || ""}
                                onChange={(e) => handleUpdateArea(area.id, "width", Number(e.target.value) || 0)}
                                className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                              />
                            </div>
                            {area.type === "bathroom_wall" && (
                              <div>
                                <Label className="text-muted-foreground text-[11px]">Wall Dado Height (ft)</Label>
                                <Input
                                  type="number"
                                  value={area.height || 7}
                                  onChange={(e) => handleUpdateArea(area.id, "height", Number(e.target.value) || 0)}
                                  className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                                />
                              </div>
                            )}
                            <div>
                              <Label className="text-muted-foreground text-[11px]">Doors Deduction</Label>
                              <Input
                                type="number"
                                value={area.doorsCount}
                                onChange={(e) => handleUpdateArea(area.id, "doorsCount", Number(e.target.value) || 0)}
                                className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {/* Moulding Section */}
                        <div className="p-3 rounded-xl bg-muted/30 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="flex items-center justify-between">
                              <Label className="text-[11px] font-bold text-foreground">Single Moulding (Rft)</Label>
                              <span className="text-[10px] text-muted-foreground">Min. 1 ft rule</span>
                            </div>
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="e.g. 10 Rft"
                              value={area.singleMouldingRft || ""}
                              onChange={(e) => handleUpdateArea(area.id, "singleMouldingRft", Number(e.target.value) || 0)}
                              className="h-8 mt-1 bg-card/60 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <Label className="text-[11px] font-bold text-amber-400">Double Moulding (Rft)</Label>
                              <span className="text-[10px] text-amber-400/90 font-mono">3x Labor Eqv.</span>
                            </div>
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="e.g. 24 Rft"
                              value={area.doubleMouldingRft || ""}
                              onChange={(e) => handleUpdateArea(area.id, "doubleMouldingRft", Number(e.target.value) || 0)}
                              className="h-8 mt-1 bg-card/60 rounded-lg text-xs border-amber-500/30"
                            />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Nepal Unit Rates Info */}
            <div className="p-4 rounded-2xl bg-card/40 border border-white/10 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>Computed with Nepal market rates (OPC Cement: NPR 720/bag, Sand: NPR 55/cft, Tile Adhesive: NPR 650/bag).</span>
              </div>
            </div>

          </div>

          {/* Right Column: BOQ, Materials & Cost Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            <Card className="glass-ios-card border-primary/40 shadow-2xl rounded-3xl overflow-hidden relative backdrop-blur-2xl">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-primary to-amber-500" />
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold px-3 py-1 rounded-full">
                    {calculatorMode === "easy" ? "⚡ Quick Estimate" : "📐 Detailed BOQ"}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">NPR Currency</span>
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground mt-2">
                  Total Estimated Tiling & Granite Investment
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mt-1">
                  NPR {metrics.grandTotal.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Avg. rate: <span className="font-bold text-foreground">NPR {metrics.costPerSqFt}</span> / sq. ft (Materials + Mason Labor)
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-3 space-y-5">
                
                {/* Surface Quantities Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-card/60 border border-white/10 text-xs">
                  <div>
                    <div className="text-muted-foreground">Total Tile Surface ({wastagePercentage}% waste)</div>
                    <div className="text-base font-bold text-foreground mt-0.5">
                      {metrics.totalTileGrossSqFt.toLocaleString()} sq.ft
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Granite Surface</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">
                      {metrics.totalGraniteGrossSqFt.toLocaleString()} sq.ft
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Wall Skirting</div>
                    <div className="text-base font-bold text-foreground mt-0.5">
                      {metrics.totalSkirtingRft} Running Ft
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Double Moulding</div>
                    <div className="text-base font-bold text-amber-300 mt-0.5">
                      {metrics.totalDoubleMouldingRft} Rft <span className="text-[10px] text-muted-foreground">({metrics.doubleMouldingLaborEquivalentRft} Rft eqv)</span>
                    </div>
                  </div>
                </div>

                {/* Exact Material Purchasing Breakdown */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Grid3X3 className="w-4 h-4 text-primary" />
                    Exact Purchasing Quantities
                  </h4>

                  <div className="space-y-2 text-xs sm:text-sm">
                    
                    {metrics.boxes2x4 > 0 && (
                      <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">2×4 ft GVT Luxury Tiles</div>
                          <div className="text-xs text-muted-foreground">2 pcs / box (16 sq. ft per box)</div>
                        </div>
                        <div className="font-black text-primary text-base">{metrics.boxes2x4} Boxes</div>
                      </div>
                    )}

                    {metrics.boxes2x2 > 0 && (
                      <div className="p-2.5 rounded-xl bg-card/40 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">2×2 ft Vitrified Floor Tiles</div>
                          <div className="text-xs text-muted-foreground">4 pcs / box (16 sq. ft per box)</div>
                        </div>
                        <div className="font-black text-foreground text-base">{metrics.boxes2x2} Boxes</div>
                      </div>
                    )}

                    {metrics.boxes1x1 > 0 && (
                      <div className="p-2.5 rounded-xl bg-card/40 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">1×1 ft Bathroom / Wall Tiles</div>
                          <div className="text-xs text-muted-foreground">25 pcs / box (25 sq. ft per box)</div>
                        </div>
                        <div className="font-black text-foreground text-base">{metrics.boxes1x1} Boxes</div>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-card/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground">OPC / PPC Cement Bags</div>
                        <div className="text-xs text-muted-foreground">Leveling mortar bed</div>
                      </div>
                      <div className="font-bold text-foreground">{metrics.cementBagsCount} Bags (50kg)</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-card/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground">Coarse River Sand</div>
                        <div className="text-xs text-muted-foreground">Mortar base</div>
                      </div>
                      <div className="font-bold text-foreground">{metrics.sandCftCount} CFT</div>
                    </div>

                    {metrics.adhesiveBagsCount > 0 && (
                      <div className="p-2.5 rounded-xl bg-card/40 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">Tile Adhesive (SmartCare/Roff)</div>
                          <div className="text-xs text-muted-foreground">Wall dado & granite fixing</div>
                        </div>
                        <div className="font-bold text-foreground">{metrics.adhesiveBagsCount} Bags (20kg)</div>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-card/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-foreground">Tile Epoxy Grout</div>
                        <div className="text-xs text-muted-foreground">Joint sealer</div>
                      </div>
                      <div className="font-bold text-foreground">{metrics.groutKg} kg</div>
                    </div>

                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Materials (Tiles, Stone, Cement):</span>
                    <span className="font-semibold text-foreground">NPR {metrics.materialsTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Mason Laying & Moulding Labor:</span>
                    <span className="font-semibold text-foreground">NPR {metrics.laborTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-white/10">
                    <span>Grand Total:</span>
                    <span className="text-primary font-black text-base">NPR {metrics.grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Send Tiling BOQ to WhatsApp</span>
                  </a>

                  <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Book Mason & Tile Installer</span>
                  </Link>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-white/5 text-[11px] text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Butwal & Dang masonry teams ensure zero hollow sound, laser leveling, 45° miter corners, and mirror-edge double moulding.
                  </span>
                </div>

              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
