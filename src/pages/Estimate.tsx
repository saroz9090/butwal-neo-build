import { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Building2, MessageCircle } from "lucide-react";
import House3D from "@/components/House3D";
import { useTools } from "@/contexts/ToolsContext";
import { ToolSuggestions } from "@/components/ToolSuggestions";

const Estimate = () => {
  const { setEstimateData } = useTools();
  const [area, setArea] = useState<string>("");
  const [floors, setFloors] = useState<string>("1");
  const [materialType, setMaterialType] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [animatedCost, setAnimatedCost] = useState(0);
  const [results, setResults] = useState({
    ppcCement: 0,
    opcCement: 0,
    rod8mm: 0,
    rod10mm: 0,
    rod12mm: 0,
    rod16mm: 0,
    rod20mm: 0,
    pvcPipes: 0,
    cpvcPipes: 0,
    giPipes: 0,
    bricks: 0,
    sand: 0,
    aggregate: 0
  });

  const materialRates = {
    standard: { 
      rate: 3300, // Updated from 8000 to 3300 NPR per sq ft
      ppcCement: 0.18, // bags per sq ft (adjusted proportionally)
      opcCement: 0.12,
      rods: { "8mm": 1.2, "10mm": 0.9, "12mm": 0.7, "16mm": 0.4, "20mm": 0.2 }, // kg per sq ft (adjusted)
      pvcPipes: 0.5, // ft per sq ft (adjusted)
      cpvcPipes: 0.3,
      giPipes: 0.15,
      bricks: 6, // per sq ft (adjusted)
      sand: 0.03, // cubic ft (adjusted)
      aggregate: 0.06 // cubic ft (adjusted)
    },
    premium: { 
      rate: 4500, // Updated from 12000 to 4500 NPR per sq ft
      ppcCement: 0.22,
      opcCement: 0.15,
      rods: { "8mm": 1.5, "10mm": 1.1, "12mm": 0.9, "16mm": 0.5, "20mm": 0.25 },
      pvcPipes: 0.6,
      cpvcPipes: 0.4,
      giPipes: 0.2,
      bricks: 7,
      sand: 0.035,
      aggregate: 0.07
    },
    luxury: { 
      rate: 6000, // Updated from 16000 to 6000 NPR per sq ft
      ppcCement: 0.25,
      opcCement: 0.18,
      rods: { "8mm": 1.8, "10mm": 1.3, "12mm": 1.0, "16mm": 0.6, "20mm": 0.3 },
      pvcPipes: 0.7,
      cpvcPipes: 0.5,
      giPipes: 0.25,
      bricks: 8,
      sand: 0.04,
      aggregate: 0.08
    }
  };

  const calculateEstimate = () => {
    if (!area || !materialType) return;

    const areaPerFloor = parseFloat(area);
    const numFloors = parseInt(floors) || 1;
    const totalArea = areaPerFloor * numFloors;
    const rates = materialRates[materialType as keyof typeof materialRates];
    
    const totalCost = totalArea * rates.rate;
    
    const calculatedResults = {
      ppcCement: totalArea * rates.ppcCement,
      opcCement: totalArea * rates.opcCement,
      rod8mm: totalArea * rates.rods["8mm"],
      rod10mm: totalArea * rates.rods["10mm"],
      rod12mm: totalArea * rates.rods["12mm"],
      rod16mm: totalArea * rates.rods["16mm"],
      rod20mm: totalArea * rates.rods["20mm"],
      pvcPipes: totalArea * rates.pvcPipes,
      cpvcPipes: totalArea * rates.cpvcPipes,
      giPipes: totalArea * rates.giPipes,
      bricks: totalArea * rates.bricks,
      sand: totalArea * rates.sand,
      aggregate: totalArea * rates.aggregate
    };

    setShowResults(true);
    animateValue(setAnimatedCost, 0, totalCost, 1500);
    
    // Save to tools context
    setEstimateData({
      area: areaPerFloor,
      floors: numFloors,
      materialType,
      totalCost,
      timestamp: Date.now()
    });
    
    // Animate all results
    Object.keys(calculatedResults).forEach((key) => {
      const value = calculatedResults[key as keyof typeof calculatedResults];
      animateValue(
        (val) => setResults(prev => ({ ...prev, [key]: val })),
        0,
        value,
        1500
      );
    });
  };

  const animateValue = (setter: (val: number) => void, start: number, end: number, duration: number) => {
    const startTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;
      
      setter(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Cost <span className="text-primary">Estimate</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Visualize and calculate your dream construction project in 3D
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 3D Visualization */}
          <div className="animate-fade-in">
            <Card className="glass p-6 mb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building2 className="text-primary" size={20} />
                </div>
                <h2 className="text-xl font-bold text-foreground">3D Preview</h2>
              </div>
              <Suspense fallback={
                <div className="w-full h-[400px] rounded-xl glass flex items-center justify-center">
                  <div className="text-muted-foreground">Loading 3D model...</div>
                </div>
              }>
                <House3D 
                  area={(parseFloat(area) || 600) * (parseInt(floors) || 1)} 
                  floors={parseInt(floors) || 1}
                  materialType={materialType || "standard"}
                />
              </Suspense>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Drag to rotate • Scroll to zoom
              </p>
            </Card>
          </div>

          {/* Calculator Card */}
          <Card className="glass p-8 md:p-12 animate-slide-up">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calculator className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Construction Calculator</h2>
          </div>

            <div className="space-y-6">
              {/* Area Input */}
              <div className="space-y-2">
                <Label htmlFor="area" className="text-foreground">Area Per Floor (Square Feet)</Label>
                <p className="text-sm text-muted-foreground">
                  Built-up area for each floor
                  <span className="text-xs block">(e.g., 600 sq ft per floor)</span>
                </p>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  placeholder="Enter area per floor in sq ft"
                  value={area}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseFloat(value) >= 0) {
                      setArea(value);
                    }
                  }}
                  className="glass border-primary/30 focus:border-primary text-lg h-14"
                />
              </div>

              {/* Floors Input */}
              <div className="space-y-2">
                <Label htmlFor="floors" className="text-foreground">Number of Floors</Label>
                <Input
                  id="floors"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Enter number of floors"
                  value={floors}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || (parseFloat(value) >= 1 && parseFloat(value) <= 10)) {
                      setFloors(value);
                    }
                  }}
                  className="glass border-primary/30 focus:border-primary text-lg h-14"
                />
              </div>

              {/* Material Type */}
              <div className="space-y-2">
                <Label htmlFor="material" className="text-foreground">Material Type</Label>
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger className="glass border-primary/30 focus:border-primary text-lg h-14">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={calculateEstimate}
                disabled={!area || !materialType || parseFloat(area) <= 0}
                className="w-full bg-primary hover:bg-primary/90 text-foreground text-lg h-14 glow"
              >
                Calculate Estimate
                <TrendingUp className="ml-2" size={20} />
              </Button>

              {/* WhatsApp Button - always visible */}
              <Button
                onClick={() => {
                  const message = area && floors 
                    ? `Hello! I need an estimation for ${area} sq ft per floor with ${floors} floor(s).`
                    : "Hello! I'm interested in getting a construction estimate.";
                  window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-lg h-14"
              >
                <MessageCircle className="mr-2" size={20} />
                Chat on WhatsApp
              </Button>
            </div>
          </Card>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-8 animate-fade-in">
            {/* Total Cost */}
            <Card className="glass p-8 text-center hover-lift animate-glow-pulse">
              <div className="text-lg text-muted-foreground mb-3">Total Estimated Cost</div>
              <div className="text-5xl font-bold text-primary mb-2">
                NPR {animatedCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-muted-foreground mb-4">Complete Project Cost</div>
              
              {/* WhatsApp Share Button */}
              <Button
                onClick={() => {
                  const message = `Hello! I've calculated an estimate:\n\nArea: ${area} sq ft per floor\nFloors: ${floors}\nTotal Area: ${(parseFloat(area) * parseInt(floors)).toLocaleString('en-IN')} sq ft\nMaterial Type: ${materialType}\nEstimated Cost: NPR ${animatedCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\n\nI'd like to discuss this project further.`;
                  window.open(`https://wa.me/9779763653181?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                size="lg"
              >
                <MessageCircle className="mr-2" size={20} />
                Share on WhatsApp
              </Button>
            </Card>

            {/* Cement Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Building2 className="text-accent" size={20} />
                </div>
                Cement Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">PPC Cement</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.ppcCement.toLocaleString('en-IN', { maximumFractionDigits: 1 })} bags
                  </div>
                  <div className="text-xs text-muted-foreground">For plastering, brickwork & general use</div>
                </Card>
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">OPC Cement</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.opcCement.toLocaleString('en-IN', { maximumFractionDigits: 1 })} bags
                  </div>
                  <div className="text-xs text-muted-foreground">For slabs, beams & structural work</div>
                </Card>
              </div>
            </div>

            {/* Steel Rods Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-accent" size={20} />
                </div>
                Steel Reinforcement (TMT Bars)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card className="glass p-4 hover-lift">
                  <div className="text-xs text-muted-foreground mb-1">8mm Rod</div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {results.rod8mm.toLocaleString('en-IN', { maximumFractionDigits: 0 })} kg
                  </div>
                  <div className="text-xs text-muted-foreground">Stirrups & ties</div>
                </Card>
                <Card className="glass p-4 hover-lift">
                  <div className="text-xs text-muted-foreground mb-1">10mm Rod</div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {results.rod10mm.toLocaleString('en-IN', { maximumFractionDigits: 0 })} kg
                  </div>
                  <div className="text-xs text-muted-foreground">Slab distribution</div>
                </Card>
                <Card className="glass p-4 hover-lift">
                  <div className="text-xs text-muted-foreground mb-1">12mm Rod</div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {results.rod12mm.toLocaleString('en-IN', { maximumFractionDigits: 0 })} kg
                  </div>
                  <div className="text-xs text-muted-foreground">Slab main bars</div>
                </Card>
                <Card className="glass p-4 hover-lift">
                  <div className="text-xs text-muted-foreground mb-1">16mm Rod</div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {results.rod16mm.toLocaleString('en-IN', { maximumFractionDigits: 0 })} kg
                  </div>
                  <div className="text-xs text-muted-foreground">Beam & column</div>
                </Card>
                <Card className="glass p-4 hover-lift">
                  <div className="text-xs text-muted-foreground mb-1">20mm Rod</div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {results.rod20mm.toLocaleString('en-IN', { maximumFractionDigits: 0 })} kg
                  </div>
                  <div className="text-xs text-muted-foreground">Heavy columns</div>
                </Card>
              </div>
            </div>

            {/* Pipes & Fittings Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Calculator className="text-accent" size={20} />
                </div>
                Pipes & Fittings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">PVC Pipes</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.pvcPipes.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ft
                  </div>
                  <div className="text-xs text-muted-foreground">Drainage & sewage lines</div>
                </Card>
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">CPVC Pipes</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.cpvcPipes.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ft
                  </div>
                  <div className="text-xs text-muted-foreground">Hot & cold water supply</div>
                </Card>
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">GI Pipes</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.giPipes.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ft
                  </div>
                  <div className="text-xs text-muted-foreground">Main water line</div>
                </Card>
              </div>
            </div>

            {/* Other Materials Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Building2 className="text-accent" size={20} />
                </div>
                Other Materials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">Bricks</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.bricks.toLocaleString('en-IN', { maximumFractionDigits: 0 })} pcs
                  </div>
                  <div className="text-xs text-muted-foreground">Standard size clay bricks</div>
                </Card>
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">Sand</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.sand.toLocaleString('en-IN', { maximumFractionDigits: 1 })} cft
                  </div>
                  <div className="text-xs text-muted-foreground">River sand for construction</div>
                </Card>
                <Card className="glass p-6 hover-lift">
                  <div className="text-sm text-muted-foreground mb-2">Aggregate</div>
                  <div className="text-3xl font-bold text-accent mb-2">
                    {results.aggregate.toLocaleString('en-IN', { maximumFractionDigits: 1 })} cft
                  </div>
                  <div className="text-xs text-muted-foreground">20mm & 10mm chips</div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Tool Suggestions */}
        {showResults && <ToolSuggestions />}

        {/* Disclaimer */}
        <Card className="glass p-6 mt-8">
          <p className="text-sm text-muted-foreground text-center">
            <strong className="text-foreground">Note:</strong> This is an approximate estimate. 
            Actual costs may vary based on specific project requirements, location, and market rates. 
            Contact us for a detailed quotation.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Estimate;