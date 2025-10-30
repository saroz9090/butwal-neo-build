import { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Building2 } from "lucide-react";
import House3D from "@/components/House3D";

const Estimate = () => {
  const [area, setArea] = useState<string>("");
  const [floors, setFloors] = useState<string>("1");
  const [materialType, setMaterialType] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [animatedCost, setAnimatedCost] = useState(0);
  const [animatedRod, setAnimatedRod] = useState(0);
  const [animatedCement, setAnimatedCement] = useState(0);

  const materialRates = {
    standard: { rate: 8000, rodPerSqFt: 4.5, cementPerSqFt: 0.4 },
    premium: { rate: 12000, rodPerSqFt: 5.0, cementPerSqFt: 0.45 },
    luxury: { rate: 16000, rodPerSqFt: 5.5, cementPerSqFt: 0.5 }
  };

  const calculateEstimate = () => {
    if (!area || !materialType) return;

    const sqFt = parseFloat(area);
    const rates = materialRates[materialType as keyof typeof materialRates];
    
    const totalCost = sqFt * rates.rate;
    const totalRod = sqFt * rates.rodPerSqFt;
    const totalCement = sqFt * rates.cementPerSqFt;

    setShowResults(true);
    animateValue(setAnimatedCost, 0, totalCost, 1500);
    animateValue(setAnimatedRod, 0, totalRod, 1500);
    animateValue(setAnimatedCement, 0, totalCement, 1500);
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
                  area={parseFloat(area) || 1000} 
                  floors={parseInt(floors) || 1} 
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
                <Label htmlFor="area" className="text-foreground">Area (Square Feet)</Label>
                <Input
                  id="area"
                  type="number"
                  min="1"
                  placeholder="Enter area in sq ft"
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
                    <SelectItem value="standard">Standard (NPR 8,000/sq ft)</SelectItem>
                    <SelectItem value="premium">Premium (NPR 12,000/sq ft)</SelectItem>
                    <SelectItem value="luxury">Luxury (NPR 16,000/sq ft)</SelectItem>
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
            </div>
          </Card>
        </div>

        {/* Results */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="glass p-6 text-center hover-lift animate-glow-pulse">
              <div className="text-sm text-muted-foreground mb-2">Estimated Cost</div>
              <div className="text-4xl font-bold text-primary mb-1">
                NPR {animatedCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-muted-foreground">Total Project Cost</div>
            </Card>

            <Card className="glass p-6 text-center hover-lift">
              <div className="text-sm text-muted-foreground mb-2">Steel Rod Required</div>
              <div className="text-4xl font-bold text-accent mb-1">
                {animatedRod.toLocaleString('en-IN', { maximumFractionDigits: 1 })} kg
              </div>
              <div className="text-xs text-muted-foreground">Reinforcement Steel</div>
            </Card>

            <Card className="glass p-6 text-center hover-lift">
              <div className="text-sm text-muted-foreground mb-2">Cement Required</div>
              <div className="text-4xl font-bold text-accent mb-1">
                {animatedCement.toLocaleString('en-IN', { maximumFractionDigits: 1 })} bags
              </div>
              <div className="text-xs text-muted-foreground">50kg Cement Bags</div>
            </Card>
          </div>
        )}

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
