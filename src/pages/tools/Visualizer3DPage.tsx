import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Box, 
  Sun, 
  Moon, 
  Sunset, 
  Car, 
  Shield, 
  Zap, 
  DollarSign, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  Palette,
  CheckCircle2,
  Layers,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import House3D from "@/components/House3D";
import SEOHead from "@/components/SEOHead";

export default function Visualizer3DPage() {
  const [area, setArea] = useState<number>(1800);
  const [floors, setFloors] = useState<number>(2);
  const [materialType, setMaterialType] = useState<string>("premium");
  const [cameraAngle, setCameraAngle] = useState<"isometric" | "front" | "top" | "side">("isometric");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");
  
  // Custom Color State
  const [customWallColor, setCustomWallColor] = useState<string>("#FAF7F2");
  const [customRoofColor, setCustomRoofColor] = useState<string>("#1D2228");

  // Interactive Add-on Toggles
  const [includeCar, setIncludeCar] = useState<boolean>(true);
  const [includeSolar, setIncludeSolar] = useState<boolean>(true);
  const [includeCompound, setIncludeCompound] = useState<boolean>(true);
  const [includePool, setIncludePool] = useState<boolean>(true);
  const [roofStyle, setRoofStyle] = useState<"terrace" | "slope">("terrace");

  // Land & House Dimensions and Style
  const [landLength, setLandLength] = useState<number>(50);
  const [landWidth, setLandWidth] = useState<number>(40);
  const [frontSetback, setFrontSetback] = useState<number>(12);
  const [houseLength, setHouseLength] = useState<number>(35);
  const [houseWidth, setHouseWidth] = useState<number>(28);
  const [architecturalStyle, setArchitecturalStyle] = useState<"modern_box" | "neoclassical" | "traditional" | "standard">("modern_box");

  // Cost calculation
  const ratePerSqFt = materialType === "luxury" ? 5800 : materialType === "premium" ? 4800 : 3800;
  const totalCost = area * floors * ratePerSqFt;

  const wallColorPresets = [
    { name: "Warm Ivory", value: "#FAF7F2" },
    { name: "Pure Arctic White", value: "#FFFFFF" },
    { name: "Soft Pearl Grey", value: "#E5E7EB" },
    { name: "Terracotta Earth", value: "#D97706" },
    { name: "Modern Navy", value: "#1E3A8A" }
  ];

  const roofColorPresets = [
    { name: "Charcoal Slate", value: "#1D2228" },
    { name: "Obsidian Black", value: "#111111" },
    { name: "Terracotta Tile", value: "#9A3412" },
    { name: "Deep Cobalt", value: "#1E40AF" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SEOHead 
        title="3D Architectural Visualizer Studio | Butwal & Dang Construction"
        description="Professional 3D building visualizer with camera angles, custom color palettes, lighting moods, vehicles, solar panels, and live cost calculation."
      />

      {/* Header bar */}
      <div className="bg-card/90 border-b border-border sticky top-0 z-30 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/tools">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <Box className="w-6 h-6 text-primary" />
                  3D Architectural Visualizer Studio
                </h1>
                <Badge className="bg-primary/20 text-primary border-primary/30">Interactive 3D CAD</Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Customize vehicles, solar arrays, compound walls, roofing styles, and lighting in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2 border-border bg-card/60"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" /> Export 3D Spec Sheet
            </Button>
            <Link to="/estimate">
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <DollarSign className="w-4 h-4" /> Full Estimation BOQ
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / 3D Stage (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative w-full h-[550px] sm:h-[650px] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
              
              {/* Floating Camera Angle Selector Top-Left */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-card/90 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-lg">
                <span className="text-[11px] font-bold text-muted-foreground px-2 hidden sm:inline">Camera:</span>
                {[
                  { id: "isometric", label: "Isometric" },
                  { id: "front", label: "Front" },
                  { id: "top", label: "Top-Down" },
                  { id: "side", label: "Side" },
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setCameraAngle(cam.id as "isometric" | "front" | "top" | "side")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      cameraAngle === cam.id 
                        ? "bg-primary text-primary-foreground shadow" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>

              {/* Floating Lighting Mood Selector Top-Right */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-card/90 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-lg">
                <span className="text-[11px] font-bold text-muted-foreground px-2 hidden sm:inline">Lighting:</span>
                {[
                  { id: "day", icon: Sun, label: "Day" },
                  { id: "sunset", icon: Sunset, label: "Sunset" },
                  { id: "night", icon: Moon, label: "Night" },
                ].map((light) => {
                  const Icon = light.icon;
                  return (
                    <button
                      key={light.id}
                      onClick={() => setTimeOfDay(light.id as "day" | "sunset" | "night")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        timeOfDay === light.id 
                          ? "bg-primary text-primary-foreground shadow" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {light.label}
                    </button>
                  );
                })}
              </div>

              {/* Three.js 3D Canvas */}
              <div className="w-full h-full">
                <House3D 
                  area={area} 
                  floors={floors} 
                  materialType={materialType} 
                  cameraAngle={cameraAngle}
                  timeOfDay={timeOfDay}
                  customWallColor={customWallColor}
                  customRoofColor={customRoofColor}
                  includeCar={includeCar}
                  includeSolar={includeSolar}
                  includeCompound={includeCompound}
                  includePool={includePool}
                  roofStyle={roofStyle}
                  landLength={landLength}
                  landWidth={landWidth}
                  frontSetback={frontSetback}
                  houseLength={houseLength}
                  houseWidth={houseWidth}
                  architecturalStyle={architecturalStyle}
                />
              </div>

              {/* Floating Bottom Info Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-card/90 backdrop-blur-md p-3.5 rounded-xl border border-border shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Floor Area</span>
                    <span className="font-bold text-sm text-foreground">{area} sq.ft</span>
                  </div>
                  <div className="h-7 w-px bg-border" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Total Built-up</span>
                    <span className="font-bold text-sm text-foreground">{area * floors} sq.ft</span>
                  </div>
                  <div className="h-7 w-px bg-border hidden sm:block" />
                  <div className="hidden sm:block">
                    <span className="text-muted-foreground block text-[10px]">Est. Cost (NPR)</span>
                    <span className="font-bold text-sm text-primary">NPR {totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <Badge variant="outline" className="bg-background/80 font-semibold">
                  {floors} Storey • {materialType.toUpperCase()} Edition
                </Badge>
              </div>

            </div>

            {/* Tabs for details */}
            <Tabs defaultValue="boq" className="w-full">
              <TabsList className="grid grid-cols-3 bg-card/60 p-1 border border-border rounded-xl">
                <TabsTrigger value="boq" className="rounded-lg text-xs sm:text-sm">Material Bill of Quantities</TabsTrigger>
                <TabsTrigger value="specs" className="rounded-lg text-xs sm:text-sm">Architectural Specs</TabsTrigger>
                <TabsTrigger value="vastu" className="rounded-lg text-xs sm:text-sm">Vastu & Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="boq" className="mt-4">
                <Card className="border-border bg-card/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Estimated Material Quantities</CardTitle>
                    <CardDescription className="text-xs">Based on {area * floors} sq.ft total construction area</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-background/60 border border-border text-center">
                      <span className="text-muted-foreground block mb-1">Cement (OPC/PPC)</span>
                      <span className="font-bold text-base text-primary">{Math.round((area * floors) * 0.45)} bags</span>
                    </div>
                    <div className="p-3 rounded-xl bg-background/60 border border-border text-center">
                      <span className="text-muted-foreground block mb-1">TMT Steel (Fe 500D)</span>
                      <span className="font-bold text-base text-primary">{Math.round((area * floors) * 3.5)} kg</span>
                    </div>
                    <div className="p-3 rounded-xl bg-background/60 border border-border text-center">
                      <span className="text-muted-foreground block mb-1">Red Bricks</span>
                      <span className="font-bold text-base text-primary">{Math.round((area * floors) * 32).toLocaleString()} pcs</span>
                    </div>
                    <div className="p-3 rounded-xl bg-background/60 border border-border text-center">
                      <span className="text-muted-foreground block mb-1">River Sand</span>
                      <span className="font-bold text-base text-primary">{Math.round((area * floors) * 1.2)} CFT</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specs" className="mt-4">
                <Card className="border-border bg-card/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Structural & Finishing Specifications</CardTitle>
                    <CardDescription className="text-xs">Engineered for Nepalese seismic zones (NBC 105:2020)</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-background/60 border border-border">
                      <span className="text-muted-foreground block mb-1">Foundation Type</span>
                      <span className="font-semibold text-sm">RCC Column Footing with Deep Earthquake Tie Beams</span>
                    </div>
                    <div className="p-3 rounded-xl bg-background/60 border border-border">
                      <span className="text-muted-foreground block mb-1">Wall Finish & Paint</span>
                      <span className="font-semibold text-sm">Asian Paints Apex Weatherproof Exterior & Tractor Emulsion Interior</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vastu" className="mt-4">
                <Card className="border-border bg-card/40">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Vastu Shastra Compliance</CardTitle>
                    <CardDescription className="text-xs">Traditional auspicious design guidelines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-border">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-foreground">Main Entrance (Simhadwara):</strong> Positioned in North or East quadrant for positive energy flow.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-border">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-foreground">Kitchen Placement:</strong> Designed for South-East (Agneya) corner compatibility.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>

          {/* Right / Studio Customizer Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="border-border bg-card/40 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" /> Studio Customization Panel
                </CardTitle>
                <CardDescription className="text-xs">Configure building proportions, vehicles, solar & finishes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-xs sm:text-sm">
                
                {/* Architectural Style */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">House Architectural Style</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "modern_box", name: "Modern Square Box" },
                      { id: "neoclassical", name: "Neo-Classical" },
                      { id: "traditional", name: "Traditional Nepal" },
                      { id: "standard", name: "Standard Modern" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setArchitecturalStyle(s.id as "modern_box" | "neoclassical" | "traditional" | "standard")}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          architecturalStyle === s.id 
                            ? "bg-primary/20 border-primary ring-1 ring-primary" 
                            : "bg-background/60 border-border hover:bg-background"
                        }`}
                      >
                        <span className="font-semibold text-xs text-foreground">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Land Plot & Setback Configuration */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <Label className="text-xs font-bold text-primary">Land Plot & Setback (ft)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium">Land Length (ft)</span>
                      <Input 
                        type="number" 
                        value={landLength} 
                        onChange={(e) => setLandLength(Number(e.target.value))}
                        className="h-8 bg-background/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium">Land Width (ft)</span>
                      <Input 
                        type="number" 
                        value={landWidth} 
                        onChange={(e) => setLandWidth(Number(e.target.value))}
                        className="h-8 bg-background/60"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-medium">Front Setback</span>
                      <Input 
                        type="number" 
                        value={frontSetback} 
                        onChange={(e) => setFrontSetback(Number(e.target.value))}
                        className="h-8 bg-background/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-medium">House Length</span>
                      <Input 
                        type="number" 
                        value={houseLength} 
                        onChange={(e) => setHouseLength(Number(e.target.value))}
                        className="h-8 bg-background/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground font-medium">House Width</span>
                      <Input 
                        type="number" 
                        value={houseWidth} 
                        onChange={(e) => setHouseWidth(Number(e.target.value))}
                        className="h-8 bg-background/60"
                      />
                    </div>
                  </div>
                </div>

                {/* Footprint Area Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-semibold">Footprint Area (per floor)</Label>
                    <span className="text-xs font-bold text-primary">{area} sq.ft</span>
                  </div>
                  <Slider 
                    value={[area]} 
                    min={800} 
                    max={4000} 
                    step={100} 
                    onValueChange={(v) => setArea(v[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>800 sq.ft</span>
                    <span>2,400 sq.ft</span>
                    <span>4,000 sq.ft</span>
                  </div>
                </div>

                {/* Number of Floors */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Number of Storeys</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFloors(f)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                          floors === f 
                            ? "bg-primary text-primary-foreground border-primary shadow" 
                            : "bg-background/60 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f} {f === 1 ? "Flr" : "Flrs"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Roof Style */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Roof Architecture Style</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "terrace", name: "Flat Terrace (Nepal)" },
                      { id: "slope", name: "Sloped Gable Roof" },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRoofStyle(r.id as "terrace" | "slope")}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          roofStyle === r.id 
                            ? "bg-primary/20 border-primary ring-1 ring-primary" 
                            : "bg-background/60 border-border hover:bg-background"
                        }`}
                      >
                        <span className="font-semibold text-xs text-foreground">{r.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Architectural Edition */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Architectural Edition</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "standard", name: "Standard", rate: "NPR 3.8k" },
                      { id: "premium", name: "Premium", rate: "NPR 4.8k" },
                      { id: "luxury", name: "Luxury", rate: "NPR 5.8k" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMaterialType(m.id)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          materialType === m.id 
                            ? "bg-primary/20 border-primary ring-1 ring-primary" 
                            : "bg-background/60 border-border hover:bg-background"
                        }`}
                      >
                        <div className="font-bold text-xs text-foreground">{m.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{m.rate}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exterior Add-on Toggles */}
                <div className="space-y-2.5 pt-2 border-t border-border">
                  <Label className="text-xs font-semibold">Exterior Landscaping & Add-ons</Label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border cursor-pointer hover:bg-background">
                      <span className="flex items-center gap-2 text-xs font-medium">
                        <Car className="w-3.5 h-3.5 text-primary" /> Front Yard Vehicle (SUV/Sedan)
                      </span>
                      <input 
                        type="checkbox" 
                        checked={includeCar} 
                        onChange={(e) => setIncludeCar(e.target.checked)}
                        className="rounded border-border accent-primary w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border cursor-pointer hover:bg-background">
                      <span className="flex items-center gap-2 text-xs font-medium">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Rooftop Solar Panel Array
                      </span>
                      <input 
                        type="checkbox" 
                        checked={includeSolar} 
                        onChange={(e) => setIncludeSolar(e.target.checked)}
                        className="rounded border-border accent-primary w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border cursor-pointer hover:bg-background">
                      <span className="flex items-center gap-2 text-xs font-medium">
                        <Shield className="w-3.5 h-3.5 text-blue-400" /> Front Compound Wall & Gate
                      </span>
                      <input 
                        type="checkbox" 
                        checked={includeCompound} 
                        onChange={(e) => setIncludeCompound(e.target.checked)}
                        className="rounded border-border accent-primary w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border cursor-pointer hover:bg-background">
                      <span className="flex items-center gap-2 text-xs font-medium">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" /> Swimming Pool & Garden
                      </span>
                      <input 
                        type="checkbox" 
                        checked={includePool} 
                        onChange={(e) => setIncludePool(e.target.checked)}
                        className="rounded border-border accent-primary w-4 h-4"
                      />
                    </label>
                  </div>
                </div>

                {/* Custom Wall Paint Color */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Exterior Wall Paint</span>
                    <span className="text-[10px] text-muted-foreground">Click swatch or custom</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    {wallColorPresets.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCustomWallColor(c.value)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          customWallColor === c.value ? "border-primary scale-110 shadow-md" : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={customWallColor}
                      onChange={(e) => setCustomWallColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-border ml-auto"
                      title="Custom Color Picker"
                    />
                  </div>
                </div>

                {/* Custom Roof Color */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold flex items-center justify-between">
                    <span>Roof & Parapet Color</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    {roofColorPresets.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCustomRoofColor(c.value)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          customRoofColor === c.value ? "border-primary scale-110 shadow-md" : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={customRoofColor}
                      onChange={(e) => setCustomRoofColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-border ml-auto"
                      title="Custom Roof Picker"
                    />
                  </div>
                </div>

                {/* Total Cost Summary */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-background border border-primary/30 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Total Built-Up Area</span>
                    <span className="font-bold text-foreground">{area * floors} sq.ft</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Est. Rate per sq.ft</span>
                    <span className="font-bold text-foreground">NPR {ratePerSqFt.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-sm">Estimated Total</span>
                    <span className="font-black text-base text-primary">NPR {totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <Link to="/estimate" className="block">
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-lg">
                    Generate Full Quotation & BOQ <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </Link>

              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
