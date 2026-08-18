import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Building, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  HardHat, 
  FileText, 
  Compass, 
  Truck, 
  ShieldCheck, 
  Hammer, 
  Trees, 
  MessageCircle, 
  Sparkles,
  Zap,
  Info,
  Layers,
  Activity,
  Award
} from 'lucide-react';
import ConstructionAnimation3D from '@/components/ConstructionAnimation3D';

interface TimelineStage {
  id: number;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  baseDurationMonths: number;
  durationMultiplier: number; // Factor multiplied by storey count
  color: string;
  description: string;
  nepalChecklist: string[];
  materialsNeeded: string[];
  supervisionTip: string;
  seismicCode: string;
}

export default function ConstructionTimeline() {
  // Storey state: 1, 1.5, 2, 2.5, 3, 3.5, 4
  const [storey, setStorey] = useState<number>(2.5);
  const [buildingType, setBuildingType] = useState<'residential' | 'commercial'>('residential');
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 1.5x, 2x
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Auto-scroll ref
  const stageCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 13 Real-world Nepal Construction Stages
  const stages: TimelineStage[] = [
    {
      id: 0,
      name: "Planning, Architectural Design & Naksa Pass",
      shortName: "Planning & Design",
      icon: FileText,
      baseDurationMonths: 0.7,
      durationMultiplier: 0.1,
      color: "bg-blue-500",
      description: "Complete architectural floor plans, structural engineering calculations, 3D elevations, soil testing, and municipal Naksa Pass approvals.",
      nepalChecklist: [
        "Architectural 2D Naksa & 3D elevations prepared by registered engineer",
        "Soil bearing capacity report (SBC test)",
        "Structural design according to NBC 105:2020 seismic code",
        "Ward office recommendation & municipality permit submission"
      ],
      materialsNeeded: ["Digital Blueprint Drawings", "Soil Borehole Rig Report", "Municipal Fee Vouchers"],
      supervisionTip: "Ensure minimum 1.5m (5 feet) setback from property boundary line as mandated by Nepal municipal bylaws.",
      seismicCode: "NBC 105:2020 & NBC 205 (Mandatory Rule of Thumb for RCC)"
    },
    {
      id: 1,
      name: "Site Survey, Soil Testing & Grid Demarcation",
      shortName: "Site Survey & Layout",
      icon: Compass,
      baseDurationMonths: 0.3,
      durationMultiplier: 0.05,
      color: "bg-amber-500",
      description: "Boundary peg marking with theodolite/total station, grid center-line layout with lime powder, and setting up temporary water & electrical supplies.",
      nepalChecklist: [
        "Physical boundary verification with cadastral map (Napi Naksa)",
        "Lime powder center-line grid marking for column footings",
        "Temporary sub-meter electricity line & borewell water connection",
        "Worker shed and secure tool storage setup"
      ],
      materialsNeeded: ["Boundary pegs", "Cotton alignment strings", "Lime powder (Chuna)", "Total Station/Dumpy Level"],
      supervisionTip: "Always double-check right angles (3-4-5 Pythagoras rule) on boundary diagonals before excavation starts.",
      seismicCode: "NBC 206: Architectural Design Requirements"
    },
    {
      id: 2,
      name: "Earth Excavation & Trench Digging",
      shortName: "Excavation",
      icon: Truck,
      baseDurationMonths: 0.4,
      durationMultiplier: 0.1,
      color: "bg-orange-600",
      description: "Excavator/JCB machine digging for isolated/combined footing pits, retaining wall trenches, and underground water reservoir tank.",
      nepalChecklist: [
        "Footing pit excavation to minimum 5 - 7 feet depth until hard strata",
        "Water reservoir tank pit (8,000L - 15,000L underground reserve)",
        "Anti-termite chemical ground spray treatment",
        "Dewatering setup if groundwater or monsoon dampness is encountered"
      ],
      materialsNeeded: ["JCB/Excavator Machine", "Anti-termite chemical (Chlorpyrifos)", "Leveling rods"],
      supervisionTip: "Do not leave excavated pits open during heavy rainfall; ensure bottom soil is rammed and leveled before PCC.",
      seismicCode: "IS 1893 / NBC 105 Geotechnical parameters"
    },
    {
      id: 3,
      name: "Stone Soling, PCC & Foundation Footing Casting",
      shortName: "Foundation & PCC",
      icon: HardHat,
      baseDurationMonths: 0.7,
      durationMultiplier: 0.15,
      color: "bg-slate-600",
      description: "Flat brick/stone soling, Plain Cement Concrete (PCC 1:3:6), rebar footing mesh (Jaali), and casting trapezoidal concrete footing pads.",
      nepalChecklist: [
        "Single flat brick/stone soling well packed with sand",
        "75mm thick PCC bed M10 grade for clean work platform",
        "High-yield Fe500D TMT rebar mesh cutting & tying",
        "Column starter bars (overlap/lap length minimum 50d)",
        "M20 / M25 grade concrete with needle vibrator compaction"
      ],
      materialsNeeded: ["OPC 53 Grade Cement", "Fe500D TMT Rebar (12mm/16mm)", "Coarse River Sand", "20mm Crushed Aggregates"],
      supervisionTip: "Continuous water curing of footing concrete for at least 10 to 14 days is essential to achieve full design strength.",
      seismicCode: "NBC 105:2020 Section 4 - Foundation Design"
    },
    {
      id: 4,
      name: "Plinth Tie Beam & DPC (Damp Proof Course)",
      shortName: "Plinth Beam & DPC",
      icon: ShieldCheck,
      baseDurationMonths: 0.5,
      durationMultiplier: 0.1,
      color: "bg-emerald-600",
      description: "Continuous reinforced concrete plinth tie beam casting at ground level, bitumen DPC membrane, and soil backfilling compaction.",
      nepalChecklist: [
        "Continuous 9x12 or 12x14 inch plinth tie beam to tie all columns",
        "Concealed plumbing soil pipe sleeves pre-installed before casting",
        "Damp-Proof Course (DPC 1:2:4 with waterproofing compound)",
        "Layer-by-layer soil backfilling and mechanical plate compaction"
      ],
      materialsNeeded: ["OPC Cement", "TMT 16mm/12mm Rebar", "Waterproofing chemical (Dr. Fixit/Pidilite)", "Plate Compactor"],
      supervisionTip: "Never puncture or chisel plinth beams later for pipes; always insert PVC sleeves during shuttering.",
      seismicCode: "NBC 205 Plinth Band Ductility Provisions"
    },
    {
      id: 5,
      name: "RCC Columns / Pillars Casting",
      shortName: "RCC Columns",
      icon: Building2,
      baseDurationMonths: 0.6,
      durationMultiplier: 0.35,
      color: "bg-indigo-600",
      description: "Column rebar cage fabrication, 135-degree seismic stirrup ties, shuttering formwork, and casting columns for all storeys.",
      nepalChecklist: [
        "12x12 or 12x16 inch columns with minimum 8 bars of 16mm/20mm Fe500",
        "8mm stirrups with 135-degree seismic hooks spaced at 100mm in confinement zones",
        "Plumb bob alignment check in both directions",
        "Cover blocks (40mm) tied securely on all four sides",
        "Hessian jute cloth wrapping for continuous 14-day wet curing"
      ],
      materialsNeeded: ["OPC Cement", "16mm/20mm TMT Rebar", "8mm Stirrup Rebar", "Steel/Plywood Shuttering Boxes", "40mm Concrete Cover Blocks"],
      supervisionTip: "Ensure stirrups have 135° inward bends (not 90°) to prevent bursting under earthquake lateral loads.",
      seismicCode: "IS 13920 Ductile Detailing of Reinforced Concrete"
    },
    {
      id: 6,
      name: "Floor Slabs, Beams & Balcony Casting",
      shortName: "Slabs & Beams",
      icon: Layers,
      baseDurationMonths: 0.7,
      durationMultiplier: 0.4,
      color: "bg-violet-600",
      description: "Centering/shuttering props, two-way slab rebar layout, concealed electrical fan box & pipe embedding, and monolithic slab casting.",
      nepalChecklist: [
        "Steel pipe props & waterproof plywood shuttering",
        "Beam rebar with extra top bars at supports and bottom bars at mid-span",
        "Concealed PVC electrical conduits and fan box fixture placement",
        "M20 / M25 design mix concrete poured monotonically without cold joints",
        "Water bund ponding method on top slab for 21 days curing"
      ],
      materialsNeeded: ["OPC Cement", "10mm/12mm Rebar", "Electrical Fan Boxes & Conduits", "Waterproofing Admixture"],
      supervisionTip: "Do not remove bottom shuttering props before 14-21 days to prevent creep deflection.",
      seismicCode: "NBC 105:2020 Slab-Beam Frame Systems"
    },
    {
      id: 7,
      name: "Brickwork & Masonry Walls",
      shortName: "Brickwork & Walls",
      icon: Hammer,
      baseDurationMonths: 0.8,
      durationMultiplier: 0.35,
      color: "bg-rose-600",
      description: "9-inch exterior weather walls and 4.5-inch interior partition walls using kiln-fired red bricks or lightweight AAC blocks.",
      nepalChecklist: [
        "First-class red clay chimney bricks soaked in water prior to laying",
        "1:4 or 1:6 cement-sand mortar joints (maximum 10-12mm thickness)",
        "RCC continuous sill band at window bottom and lintel band with sunshades at window top",
        "Anchor ties into RCC columns every 3-4 brick courses"
      ],
      materialsNeeded: ["1st Class Red Bricks / AAC Blocks", "PPC Cement", "Fine River Sand", "RCC Lintel Bars"],
      supervisionTip: "Never build more than 1.5 meters (5 feet) height of brick wall per day to avoid collapse and mortar squeezing.",
      seismicCode: "NBC 202: Seismic Code for Masonry Buildings"
    },
    {
      id: 8,
      name: "Concealed MEP (Plumbing & Electrical Rough-in)",
      shortName: "Electrical & Plumbing",
      icon: Zap,
      baseDurationMonths: 0.6,
      durationMultiplier: 0.25,
      color: "bg-sky-600",
      description: "Wall groove chasing for concealed copper electrical wiring conduits, switch boxes, CPVC hot/cold water pipes, and PVC drainage stacks.",
      nepalChecklist: [
        "Heavy-duty CPVC plumbing pipes for solar hot water and cold water lines",
        "Wall groove cutter machine (avoid heavy hammer chiseling on structural columns)",
        "Pressure testing of all water supply lines at 10 bar before plastering",
        "Separate dedicated earthing pit and 3-phase MCB distribution board wiring"
      ],
      materialsNeeded: ["CPVC & PVC Pipes (Supreme/Astral/Panchakanya)", "FRLS Copper Wires", "PVC Junction Boxes", "Switch Back Boxes"],
      supervisionTip: "Conduct hydraulic pressure test on all water joints for 24 hours to catch concealed leaks before plastering.",
      seismicCode: "NBC 207: Electrical & Sanitary Guidelines"
    },
    {
      id: 9,
      name: "Internal & External Plastering with Chicken Mesh",
      shortName: "Plastering",
      icon: Sparkles,
      baseDurationMonths: 0.7,
      durationMultiplier: 0.3,
      color: "bg-teal-600",
      description: "Fixing chicken wire mesh at RCC beam-brick joints, 12mm internal smooth plaster, and 20mm external waterproof sand-face plaster.",
      nepalChecklist: [
        "Galvanized chicken wire mesh (150mm wide) over all column-brick joints to prevent cracks",
        "External 20mm double-coat sand-faced waterproof plaster with drip moulds",
        "Internal 12mm smooth cement plaster with level button markers",
        "Window and door edge corner beads for sharp 90-degree corners"
      ],
      materialsNeeded: ["PPC Cement", "Washed Fine Sand", "Chicken Wire Mesh", "Waterproofing Liquid", "Corner Beads"],
      supervisionTip: "Water curing for plaster must continue for at least 7-10 days to avoid hollow plaster or shrinkage hairline cracks.",
      seismicCode: "IS 1661: Cement Plastering Code"
    },
    {
      id: 10,
      name: "Flooring, Bathroom Waterproofing & Glazed Windows",
      shortName: "Flooring & Windows",
      icon: Building,
      baseDurationMonths: 0.8,
      durationMultiplier: 0.3,
      color: "bg-cyan-600",
      description: "Multi-layer elastomeric bathroom waterproofing, vitrified tiles / marble flooring, granite stairs, and UPVC double-glazed windows.",
      nepalChecklist: [
        "3-layer chemical waterproofing in all bathrooms, balconies & roof terrace",
        "48-hour water ponding test in bathrooms to verify 100% leak-proof seal",
        "High-grade anti-skid vitrified tiles (600x1200mm / 800x1600mm)",
        "Heavy-gauge UPVC / Powder-coated aluminum soundproof sliding windows"
      ],
      materialsNeeded: ["Vitrified Floor Tiles", "Bathroom Wall & Floor Tiles", "Granite Slabs", "UPVC Window Frames & Float Glass", "Tile Grout & Adhesive"],
      supervisionTip: "Always slope bathroom floors 1:50 towards floor drain trap so water never pools in corners.",
      seismicCode: "IS 3370: Waterproofing Standards"
    },
    {
      id: 11,
      name: "Doors, Balcony Railings & Exterior Painting",
      shortName: "Painting & Fixtures",
      icon: Award,
      baseDurationMonths: 0.7,
      durationMultiplier: 0.25,
      color: "bg-pink-600",
      description: "Solid teakwood main entrance door, flush interior doors, stainless steel toughened glass balcony railings, and exterior weather-shield paint.",
      nepalChecklist: [
        "Solid Teak/Sal wood main entrance carved door frame & shutter",
        "304-grade stainless steel with 10mm toughened glass balcony railings",
        "Exterior silicone primer + 2 coats anti-fungal weather-shield exterior paint",
        "Interior wall putty (2 coats) + primer + 2 coats luxury emulsion paint"
      ],
      materialsNeeded: ["Wood Doors & Mortise Locks", "SS304 Glass Railings", "Exterior Weather-proof Paint (Asian/Berger)", "Interior Wall Putty & Emulsion"],
      supervisionTip: "Ensure exterior walls are completely dry (moisture content < 10%) before applying primer to prevent peeling.",
      seismicCode: "IS 2395: Painting Standards"
    },
    {
      id: 12,
      name: "Solar Tank, Fixtures, Landscaping & Griha Pravesh Handover",
      shortName: "Final Handover",
      icon: Trees,
      baseDurationMonths: 0.5,
      durationMultiplier: 0.1,
      color: "bg-emerald-500",
      description: "Rooftop Sintex water tank & solar heater connection, sanitary fixtures, LED lighting, compound gate, paved driveway, deep cleaning and key handover!",
      nepalChecklist: [
        "1000L/2000L Sintex food-grade overhead water tank with automatic water level sensor",
        "Solar water heater (200L/300L ETC system) & rooftop solar net metering",
        "Sanitary ware installation (wall-hung commodes, vanity counters, diverters)",
        "Driveway interlocking paving blocks and lawn landscaping",
        "Final municipal completion certificate (Nirman Sampanna Pramanpatra) and Griha Pravesh!"
      ],
      materialsNeeded: ["Sintex Water Tank", "Solar Water Heater", "LED Spotlights & Chandeliers", "Sanitary Wares (Kohler/Hindware/Jaquar)", "Interlocking Paver Blocks"],
      supervisionTip: "Conduct a comprehensive pre-handover snag list audit (doors, locks, water pressure, electrical trip testing) with your engineer.",
      seismicCode: "NBC 208: Building Safety & Completion Certificate"
    }
  ];

  // Calculate dynamic durations based on storeys (1 floor = exactly 8.0 months for final handover)
  const getStageDuration = (stage: TimelineStage) => {
    const extraStorey = Math.max(0, storey - 1.0);
    const raw = stage.baseDurationMonths + stage.durationMultiplier * extraStorey;
    return Math.round(raw * 10) / 10; // Round to 1 decimal
  };

  const totalDurationMonths = Math.round(
    stages.reduce((sum, s) => sum + getStageDuration(s), 0) * 10
  ) / 10;

  const totalDurationWeeks = Math.round(totalDurationMonths * 4.33);

  // Approximate Estimated Built-up Area based on Storeys
  const getEstimatedArea = () => {
    return Math.round(storey * 1100);
  };

  // Approximate Estimated Materials based on Storey & Area
  const getMaterialEstimations = () => {
    const sqft = getEstimatedArea();
    return {
      cementBags: Math.round(sqft * 0.45),
      tmtSteelTons: Math.round((sqft * 3.8) / 1000 * 10) / 10,
      bricksCount: Math.round(sqft * 19),
      sandTrucks: Math.round(sqft * 0.0022 * 10) / 10,
      aggregateTrucks: Math.round(sqft * 0.0018 * 10) / 10,
    };
  };

  const materials = getMaterialEstimations();

  // Progress percentage
  const currentProgress = Math.round(((currentStage + 1) / stages.length) * 100);

  // Play / Pause Animation Loop Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const stepDuration = 2400 / playbackSpeed;
      interval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev >= stages.length - 1) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, stepDuration);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, isLooping, stages.length]);

  const handleNextStage = () => {
    setCurrentStage((prev) => Math.min(stages.length - 1, prev + 1));
  };

  const handlePrevStage = () => {
    setCurrentStage((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStage(0);
  };

  const activeStageData = stages[currentStage];
  const ActiveIcon = activeStageData.icon;

  const storeyOptions = [
    { value: 1.0, label: "1 Storey", desc: "Single Floor Bungalow (8 Months to Handover)", tag: "8 Months Handover" },
    { value: 1.5, label: "1.5 Storey", desc: "Ground + Attic / Mezzanine (~9.4 Months)", tag: "Modern" },
    { value: 2.0, label: "2 Storey", desc: "Full Double Storey Duplex (~10.8 Months)", tag: "Family" },
    { value: 2.5, label: "2.5 Storey", desc: "Ground + 1st + Top Puja & Terrace (~12.2 Months)", tag: "Most Popular in Nepal" },
    { value: 3.0, label: "3 Storey", desc: "Triple Storey Residence (~13.6 Months)", tag: "Spacious" },
    { value: 3.5, label: "3.5+ Storey", desc: "Commercial Ground + Multi-Floor (~15.0 Months)", tag: "Commercial / Rental" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background pt-32 pb-20 px-4">
      {/* Liquid Ambient Iridescent Background Mesh (Apple iOS style) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/6 left-1/10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/20 to-rose-600/10 blur-[130px] liquid-orb-1" />
        <div className="absolute top-1/2 right-1/10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-600/20 to-indigo-600/15 blur-[140px] liquid-orb-2" />
        <div className="absolute bottom-1/10 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-pink-500/15 to-amber-500/10 blur-[120px] liquid-orb-3" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-6 animate-fade-in">
          <Badge className="mb-3 px-4 py-1.5 text-sm bg-primary/20 text-primary border-primary/30 font-medium">
            <Activity className="w-4 h-4 mr-1.5 inline text-primary animate-pulse" />
            Interactive 3D Stage-by-Stage Construction Simulator
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-foreground tracking-tight leading-tight">
            Construction <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-primary to-pink-400">Timeline & 3D Process</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Select your building height (1, 1.5, 2, 2.5, 3 storeys) and press <strong>Play Animation</strong> to watch the complete step-by-step construction journey from site survey to Griha Pravesh handover!
          </p>
        </div>

        {/* 1. STOREY & CONFIGURATION SELECTOR BAR */}
        <Card className="glass border-white/10 shadow-xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Building className="w-6 h-6 text-primary" />
                  Select Building Storeys & Scale
                </CardTitle>
                <CardDescription>
                  Choose your target building size to instantly calibrate timeline durations, materials, and 3D simulation
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 w-fit">
                Approx. {getEstimatedArea()} Sq. Ft Total Built-up
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {storeyOptions.map((opt) => {
                const isSelected = storey === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStorey(opt.value);
                      if (!isPlaying) setCurrentStage(0);
                    }}
                    className={`relative p-3.5 rounded-xl text-left transition-all duration-300 flex flex-col justify-between border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-[1.03]"
                        : "glass border-white/10 hover:border-primary/40 hover:bg-primary/5 text-foreground"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-base font-black ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                          {opt.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground flex-shrink-0" />}
                      </div>
                      <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                        {opt.desc}
                      </p>
                    </div>
                    <div className="mt-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isSelected 
                          ? "bg-white/20 text-white border-white/30" 
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}>
                        {opt.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10">
              <div className="p-3 glass rounded-xl border border-white/5">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Estimated Duration
                </div>
                <div className="text-lg font-black text-foreground">
                  {totalDurationMonths} Months <span className="text-xs font-normal text-muted-foreground">({totalDurationWeeks} wks)</span>
                </div>
              </div>

              <div className="p-3 glass rounded-xl border border-white/5">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  Total Stages
                </div>
                <div className="text-lg font-black text-foreground">
                  13 Full Phases
                </div>
              </div>

              <div className="p-3 glass rounded-xl border border-white/5">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Truck className="w-3.5 h-3.5 text-primary" />
                  OPC/PPC Cement
                </div>
                <div className="text-lg font-black text-foreground">
                  ~{materials.cementBags} Bags
                </div>
              </div>

              <div className="p-3 glass rounded-xl border border-white/5">
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <HardHat className="w-3.5 h-3.5 text-primary" />
                  Fe500D TMT Steel
                </div>
                <div className="text-lg font-black text-foreground">
                  ~{materials.tmtSteelTons} Metric Tons
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. 3D REAL-TIME ANIMATION VIEWER & CONTROLLER */}
        <div className="space-y-4">
          {/* Main 3D Canvas */}
          <ConstructionAnimation3D 
            stage={currentStage} 
            storey={storey} 
            buildingType={buildingType} 
          />

          {/* Interactive Player Controller Bar */}
          <Card className="glass border-white/10 shadow-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Active Stage Indicator */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-xl flex-shrink-0">
                  {currentStage + 1}
                </div>
                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Stage {currentStage + 1} of {stages.length} • {getStageDuration(activeStageData)} Months
                  </div>
                  <div className="text-lg md:text-xl font-bold text-foreground truncate max-w-[320px] sm:max-w-md">
                    {activeStageData.name}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center flex-wrap justify-center gap-2.5 w-full md:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrevStage}
                  disabled={currentStage === 0}
                  className="border-white/15 hover:bg-white/10"
                  title="Previous Stage"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  size="lg"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-lg shadow-primary/30"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause Animation
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Play Animation
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNextStage}
                  disabled={currentStage === stages.length - 1}
                  className="border-white/15 hover:bg-white/10"
                  title="Next Stage"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground"
                  title="Reset to Stage 1"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Reset
                </Button>

                {/* Speed Toggle */}
                <div className="flex items-center glass rounded-lg p-1 border border-white/10 ml-1">
                  {[0.5, 1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        playbackSpeed === spd
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Overall Animated Progress Bar */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Overall Construction Progress</span>
                <span className="font-bold text-primary">{currentProgress}% Completed</span>
              </div>
              <Progress value={currentProgress} className="h-2.5 bg-white/10" />
            </div>
          </Card>
        </div>

        {/* 3. QUICK STAGE SCRUBBER BAR */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex gap-2 min-w-max">
            {stages.map((stg, idx) => {
              const IconComp = stg.icon;
              const isActive = idx === currentStage;
              const isPassed = idx < currentStage;

              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    setCurrentStage(idx);
                    setIsPlaying(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                      : isPassed
                      ? "glass border-primary/30 text-foreground hover:bg-primary/10"
                      : "glass border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? "bg-white text-primary" : isPassed ? "bg-primary/20 text-primary" : "bg-white/10"
                  }`}>
                    {idx + 1}
                  </span>
                  <IconComp className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{stg.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. CURRENT ACTIVE STAGE SPOTLIGHT CARD */}
        <Card className="glass border-primary/30 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[90px] -z-10 pointer-events-none" />
          
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <ActiveIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">
                    Detailed Phase Breakdown
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-black text-foreground">
                    Stage {currentStage + 1}: {activeStageData.name}
                  </CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1 font-bold">
                  ⏱️ {getStageDuration(activeStageData)} Months Duration
                </Badge>
              </div>
            </div>
            <p className="text-base text-muted-foreground mt-3 leading-relaxed">
              {activeStageData.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nepal Municipal & Quality Checklist */}
              <div className="p-5 glass border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Nepal Quality & Municipal Execution Checklist
                </div>
                <div className="space-y-2.5">
                  {activeStageData.nepalChecklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials & Site Engineering Tip */}
              <div className="space-y-4">
                <div className="p-4 glass border-white/10 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase">
                    <Truck className="w-4 h-4" />
                    Essential Materials for this Stage
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeStageData.materialsNeeded.map((mat, i) => (
                      <Badge key={i} variant="outline" className="bg-white/5 border-white/15 text-xs text-foreground">
                        {mat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-1.5">
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Senior Site Engineer Pro Tip
                  </div>
                  <p className="text-xs md:text-sm text-foreground/90 italic leading-relaxed">
                    "{activeStageData.supervisionTip}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Compliance Code:</span>
                  <span className="font-semibold text-foreground">{activeStageData.seismicCode}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. FULL 13-STAGE COMPREHENSIVE ROADMAP (VERTICAL ACCORDION / CARDS) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Complete Stage-by-Stage Roadmap ({storey} Storey)
            </h2>
            <span className="text-sm text-muted-foreground">
              Click on any stage to jump the 3D model directly to that phase
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {stages.map((stg, index) => {
              const StageIcon = stg.icon;
              const isCurrent = index === currentStage;
              const isPast = index < currentStage;
              const duration = getStageDuration(stg);

              return (
                <div
                  key={stg.id}
                  ref={(el) => (stageCardRefs.current[index] = el)}
                  onClick={() => {
                    setCurrentStage(index);
                    setIsPlaying(false);
                  }}
                  className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                    isCurrent
                      ? "glass border-primary/70 shadow-xl shadow-primary/10 ring-1 ring-primary/40 bg-primary/10"
                      : isPast
                      ? "glass border-white/15 opacity-80 hover:opacity-100 hover:border-primary/40"
                      : "glass border-white/10 opacity-55 hover:opacity-85 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                        isCurrent 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : isPast 
                          ? "bg-primary/20 text-primary" 
                          : "bg-white/10 text-muted-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-base md:text-lg font-bold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                            {stg.name}
                          </h3>
                          {isCurrent && (
                            <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 animate-pulse">
                              Active in 3D
                            </Badge>
                          )}
                          {isPast && (
                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                          {stg.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center flex-shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">{duration} Months</div>
                        <div className="text-[11px] text-muted-foreground">Approx. {Math.round(duration * 4.33)} Weeks</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={isCurrent ? "default" : "outline"} 
                        className={`text-xs h-8 ${isCurrent ? "bg-primary text-primary-foreground" : "border-white/15"}`}
                      >
                        {isCurrent ? "Simulating" : "View 3D"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. EXPERT CONSULTATION & WHATSAPP SUPPORT */}
        <Card className="glass border-white/10 shadow-2xl p-6 md:p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] mx-auto">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Need a Custom Engineered Timeline for Your Plot?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2 text-sm md:text-base">
              Our registered structural engineers at Butwal Construction and Builders can prepare a customized Gannt chart, soil-bearing foundation plan, and municipal permit schedule for your exact land location.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => window.open(`https://wa.me/9779763653181?text=Hello! I am planning a ${storey} Storey building and would like a customized construction timeline and cost consultation.`, '_blank')}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold shadow-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with Senior Engineer on WhatsApp
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
