import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle, Leaf, Zap, Droplet, Sun } from 'lucide-react';
import { toast } from 'sonner';

const GreenBuildCalculator = () => {
  const [area, setArea] = useState('');
  const [occupants, setOccupants] = useState('');
  const [features, setFeatures] = useState({
    solarPanels: false,
    rainwaterHarvest: false,
    ledLighting: false,
    doubleGlazing: false,
    greenRoof: false,
    insulatedWalls: false,
    efficientHVAC: false,
    lowFlowFixtures: false
  });

  const [result, setResult] = useState<{
    energySavings: number;
    waterSavings: number;
    costSavings: number;
    carbonReduction: number;
    initialCost: number;
    paybackYears: number;
  } | null>(null);

  const calculate = () => {
    const sqft = parseFloat(area);
    const people = parseFloat(occupants);

    if (!sqft || !people) {
      toast.error('Please enter area and occupants');
      return;
    }

    // Base consumption
    const baseEnergyKwh = sqft * 10; // 10 kWh per sqft per year
    const baseWaterLiters = people * 150 * 365; // 150 liters per person per day

    let energySavingPercent = 0;
    let waterSavingPercent = 0;
    let initialCost = 0;

    if (features.solarPanels) {
      energySavingPercent += 40;
      initialCost += sqft * 150;
    }
    if (features.ledLighting) {
      energySavingPercent += 10;
      initialCost += sqft * 20;
    }
    if (features.efficientHVAC) {
      energySavingPercent += 25;
      initialCost += sqft * 100;
    }
    if (features.insulatedWalls) {
      energySavingPercent += 15;
      initialCost += sqft * 80;
    }
    if (features.doubleGlazing) {
      energySavingPercent += 10;
      initialCost += sqft * 60;
    }
    if (features.greenRoof) {
      energySavingPercent += 8;
      initialCost += sqft * 120;
    }

    if (features.rainwaterHarvest) {
      waterSavingPercent += 50;
      initialCost += 200000;
    }
    if (features.lowFlowFixtures) {
      waterSavingPercent += 30;
      initialCost += 50000;
    }

    energySavingPercent = Math.min(energySavingPercent, 85);
    waterSavingPercent = Math.min(waterSavingPercent, 80);

    const energySavings = (baseEnergyKwh * energySavingPercent) / 100;
    const waterSavings = (baseWaterLiters * waterSavingPercent) / 100;

    // Cost savings (NPR)
    const energyCostSavings = energySavings * 12; // NPR 12 per kWh
    const waterCostSavings = (waterSavings / 1000) * 30; // NPR 30 per 1000 liters
    const totalAnnualSavings = energyCostSavings + waterCostSavings;

    // Carbon reduction (kg CO2)
    const carbonReduction = energySavings * 0.5; // 0.5 kg CO2 per kWh

    const paybackYears = initialCost / totalAnnualSavings;

    setResult({
      energySavings: Math.round(energySavings),
      waterSavings: Math.round(waterSavings),
      costSavings: Math.round(totalAnnualSavings),
      carbonReduction: Math.round(carbonReduction),
      initialCost: Math.round(initialCost),
      paybackYears: parseFloat(paybackYears.toFixed(1))
    });

    toast.success('Green savings calculated');
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Green Build <span className="text-gradient">Calculator</span>
          </h1>
          <p className="text-lg text-muted-foreground">Calculate savings with eco-friendly features</p>
          <Button 
            onClick={() => window.open('https://wa.me/9779763653181?text=I want to build an eco-friendly home', '_blank')}
            className="mt-4 bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Get Green Building Advice
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Building Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="area">Total Area (sq.ft)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="e.g., 2000"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="occupants">Number of Occupants</Label>
                <Input
                  id="occupants"
                  type="number"
                  placeholder="e.g., 5"
                  value={occupants}
                  onChange={(e) => setOccupants(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Green Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="solar"
                  checked={features.solarPanels}
                  onCheckedChange={(checked) => setFeatures({...features, solarPanels: !!checked})}
                />
                <label htmlFor="solar" className="text-sm cursor-pointer">
                  <Sun className="w-4 h-4 inline mr-1" />
                  Solar Panels (40% energy savings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rain"
                  checked={features.rainwaterHarvest}
                  onCheckedChange={(checked) => setFeatures({...features, rainwaterHarvest: !!checked})}
                />
                <label htmlFor="rain" className="text-sm cursor-pointer">
                  <Droplet className="w-4 h-4 inline mr-1" />
                  Rainwater Harvesting (50% water savings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="led"
                  checked={features.ledLighting}
                  onCheckedChange={(checked) => setFeatures({...features, ledLighting: !!checked})}
                />
                <label htmlFor="led" className="text-sm cursor-pointer">
                  <Zap className="w-4 h-4 inline mr-1" />
                  LED Lighting (10% energy savings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hvac"
                  checked={features.efficientHVAC}
                  onCheckedChange={(checked) => setFeatures({...features, efficientHVAC: !!checked})}
                />
                <label htmlFor="hvac" className="text-sm cursor-pointer">
                  Efficient HVAC (25% energy savings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insulation"
                  checked={features.insulatedWalls}
                  onCheckedChange={(checked) => setFeatures({...features, insulatedWalls: !!checked})}
                />
                <label htmlFor="insulation" className="text-sm cursor-pointer">
                  Insulated Walls (15% energy savings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="glazing"
                  checked={features.doubleGlazing}
                  onCheckedChange={(checked) => setFeatures({...features, doubleGlazing: !!checked})}
                />
                <label htmlFor="glazing" className="text-sm cursor-pointer">
                  Double Glazing (10% energy savings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="roof"
                  checked={features.greenRoof}
                  onCheckedChange={(checked) => setFeatures({...features, greenRoof: !!checked})}
                />
                <label htmlFor="roof" className="text-sm cursor-pointer">
                  Green Roof (8% energy savings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fixtures"
                  checked={features.lowFlowFixtures}
                  onCheckedChange={(checked) => setFeatures({...features, lowFlowFixtures: !!checked})}
                />
                <label htmlFor="fixtures" className="text-sm cursor-pointer">
                  Low-Flow Fixtures (30% water savings)
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={calculate} className="w-full mb-8" size="lg">
          <Leaf className="w-4 h-4 mr-2" />
          Calculate Savings
        </Button>

        {result && (
          <div className="space-y-6">
            <Card className="glass glow">
              <CardHeader>
                <CardTitle>Annual Savings</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 glass rounded-lg">
                  <Zap className="w-8 h-8 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Energy Savings</div>
                  <div className="text-2xl font-bold text-foreground">{result.energySavings.toLocaleString()} kWh</div>
                </div>
                <div className="p-4 glass rounded-lg">
                  <Droplet className="w-8 h-8 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Water Savings</div>
                  <div className="text-2xl font-bold text-foreground">{result.waterSavings.toLocaleString()} L</div>
                </div>
                <div className="p-4 glass rounded-lg">
                  <div className="text-sm text-muted-foreground">Annual Cost Savings</div>
                  <div className="text-2xl font-bold text-primary">NPR {result.costSavings.toLocaleString()}</div>
                </div>
                <div className="p-4 glass rounded-lg">
                  <Leaf className="w-8 h-8 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Carbon Reduction</div>
                  <div className="text-2xl font-bold text-foreground">{result.carbonReduction.toLocaleString()} kg CO₂</div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Investment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 glass rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Initial Investment</div>
                  <div className="text-2xl font-bold text-foreground">NPR {result.initialCost.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Payback Period</div>
                  <div className="text-3xl font-bold text-primary">{result.paybackYears} years</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    After payback, all savings are pure profit while helping the environment!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Equivalent to planting {Math.round(result.carbonReduction / 20)} trees per year</li>
                  <li>Reduces carbon footprint by {((result.carbonReduction / 1000) * 100).toFixed(1)}% for average household</li>
                  <li>Conserves {(result.waterSavings / 1000).toFixed(0)} cubic meters of water annually</li>
                  <li>Potential government incentives and rebates may be available</li>
                  <li>Increases property resale value by 5-10%</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreenBuildCalculator;
