import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Home, DollarSign, Percent, MessageCircle, Compass } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Calculators = () => {
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);

  // ROI Calculator State
  const [propertyValue, setPropertyValue] = useState("");
  const [appreciationRate, setAppreciationRate] = useState("");
  const [years, setYears] = useState("");
  const [futureValue, setFutureValue] = useState<number | null>(null);

  // Rental Yield Calculator State
  const [purchasePrice, setPurchasePrice] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [rentalYield, setRentalYield] = useState<number | null>(null);

  // Vastu Direction
  const [vastuDirection, setVastuDirection] = useState("");
  const [vastuRecommendation, setVastuRecommendation] = useState("");

  // EMI Calculation
  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(loanTenure) * 12;

    if (P && r && n) {
      const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(Math.round(emiValue));
    }
  };

  // ROI Calculation
  const calculateROI = () => {
    const P = parseFloat(propertyValue);
    const r = parseFloat(appreciationRate) / 100;
    const t = parseFloat(years);

    if (P && r && t) {
      const future = P * Math.pow(1 + r, t);
      setFutureValue(Math.round(future));
    }
  };

  // Rental Yield Calculation
  const calculateRentalYield = () => {
    const price = parseFloat(purchasePrice);
    const rent = parseFloat(monthlyRent);

    if (price && rent) {
      const annualRent = rent * 12;
      const yield_value = (annualRent / price) * 100;
      setRentalYield(Math.round(yield_value * 100) / 100);
    }
  };

  // Vastu Analysis
  const analyzeVastu = () => {
    const recommendations: { [key: string]: string } = {
      north: "Excellent for main entrance! North brings prosperity and wealth. Ideal for living rooms and workspaces.",
      south: "Avoid main entrance in south. Best for heavy storage, master bedroom. Use red/maroon colors to balance energy.",
      east: "Auspicious direction! Perfect for main entrance, pooja room, and study areas. Morning sunlight brings positive energy.",
      west: "Good for dining areas and children's rooms. Avoid main entrance. Use light colors and proper ventilation.",
      northeast: "Most sacred direction! Ideal for pooja room, meditation space. Keep this area clutter-free and elevated.",
      northwest: "Suitable for guest rooms and storage. Avoid placing heavy items. Good for vehicle parking.",
      southeast: "Ideal for kitchen placement. Governs fire element. Avoid bedrooms in this direction.",
      southwest: "Best for master bedroom. Place heavy furniture here. Store valuables and important documents."
    };

    setVastuRecommendation(recommendations[vastuDirection] || "Please select a direction for Vastu analysis.");
  };

  const banks = [
    { name: "Nepal Bank Limited", rate: "9.5-11%", features: "Low interest, flexible tenure" },
    { name: "Rastriya Banijya Bank", rate: "9.75-11.5%", features: "Government bank, subsidized rates" },
    { name: "Nabil Bank", rate: "10-12%", features: "Quick processing, premium service" },
    { name: "NIC Asia Bank", rate: "9.8-11.8%", features: "Competitive rates, digital banking" },
    { name: "Global IME Bank", rate: "10-12.5%", features: "Wide branch network" },
    { name: "Himalayan Bank", rate: "9.9-11.9%", features: "Personalized solutions" }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Practical <span className="text-primary">Tools</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Financial calculators and Vastu guidance for your construction project
          </p>
        </div>

        {/* Quick Contact */}
        <Card className="glass p-6 mb-12 text-center">
          <h3 className="text-xl font-bold mb-3">Need Personalized Financial Advice?</h3>
          <p className="text-muted-foreground mb-4">Our team can help you plan your construction budget and financing</p>
          <Button 
            size="lg"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
            onClick={() => window.open('https://wa.me/9779845323733?text=Hello! I need help with construction financing and planning.', '_blank')}
          >
            <MessageCircle className="mr-2" size={20} />
            Get Financial Guidance
          </Button>
        </Card>

        {/* Main Calculators */}
        <Tabs defaultValue="emi" className="w-full mb-16">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2 md:grid-cols-4 mb-12">
            <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
            <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
            <TabsTrigger value="rental">Rental Yield</TabsTrigger>
            <TabsTrigger value="vastu">Vastu Guide</TabsTrigger>
          </TabsList>

          {/* EMI Calculator */}
          <TabsContent value="emi">
            <Card className="glass p-8 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="text-primary" size={32} />
                <h2 className="text-2xl font-bold">Home Loan EMI Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount (NPR)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="loanTenure">Loan Tenure (Years)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    placeholder="e.g., 15"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                  />
                </div>
                <Button onClick={calculateEMI} className="w-full" size="lg">
                  Calculate EMI
                </Button>
                {emi && (
                  <div className="bg-primary/10 p-6 rounded-lg text-center animate-fade-in">
                    <div className="text-sm text-muted-foreground mb-2">Monthly EMI</div>
                    <div className="text-4xl font-bold text-primary">NPR {emi.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Total Payment: NPR {(emi * parseFloat(loanTenure) * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Interest: NPR {((emi * parseFloat(loanTenure) * 12) - parseFloat(loanAmount)).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* ROI Calculator */}
          <TabsContent value="roi">
            <Card className="glass p-8 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="text-primary" size={32} />
                <h2 className="text-2xl font-bold">Property Appreciation Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="propertyValue">Current Property Value (NPR)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    placeholder="e.g., 10000000"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="appreciationRate">Expected Appreciation Rate (% per year)</Label>
                  <Input
                    id="appreciationRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8 (Nepal avg: 6-10%)"
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="years">Investment Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="e.g., 10"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>
                <Button onClick={calculateROI} className="w-full" size="lg">
                  Calculate Future Value
                </Button>
                {futureValue && (
                  <div className="bg-primary/10 p-6 rounded-lg text-center animate-fade-in">
                    <div className="text-sm text-muted-foreground mb-2">Estimated Future Value</div>
                    <div className="text-4xl font-bold text-primary">NPR {futureValue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Total Appreciation: NPR {(futureValue - parseFloat(propertyValue)).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ROI: {Math.round(((futureValue - parseFloat(propertyValue)) / parseFloat(propertyValue)) * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Rental Yield Calculator */}
          <TabsContent value="rental">
            <Card className="glass p-8 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3 mb-6">
                <Home className="text-primary" size={32} />
                <h2 className="text-2xl font-bold">Rental Yield Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="purchasePrice">Property Purchase Price (NPR)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="e.g., 15000000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRent">Expected Monthly Rent (NPR)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="e.g., 50000"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                  />
                </div>
                <Button onClick={calculateRentalYield} className="w-full" size="lg">
                  Calculate Rental Yield
                </Button>
                {rentalYield && (
                  <div className="bg-primary/10 p-6 rounded-lg text-center animate-fade-in">
                    <div className="text-sm text-muted-foreground mb-2">Annual Rental Yield</div>
                    <div className="text-4xl font-bold text-primary">{rentalYield}%</div>
                    <div className="text-sm text-muted-foreground mt-4">
                      Annual Rental Income: NPR {(parseFloat(monthlyRent) * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {rentalYield > 6 ? "✅ Excellent rental yield for Nepal market!" : 
                       rentalYield > 4 ? "✓ Good rental yield" : 
                       "⚠️ Consider location and property type"}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Vastu Guide */}
          <TabsContent value="vastu">
            <Card className="glass p-8 max-w-2xl mx-auto">
              <div className="flex items-center space-x-3 mb-6">
                <Compass className="text-primary" size={32} />
                <h2 className="text-2xl font-bold">Vastu Direction Guide</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="vastuDirection">Select Direction</Label>
                  <Select value={vastuDirection} onValueChange={setVastuDirection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North (उत्तर)</SelectItem>
                      <SelectItem value="south">South (दक्षिण)</SelectItem>
                      <SelectItem value="east">East (पूर्व)</SelectItem>
                      <SelectItem value="west">West (पश्चिम)</SelectItem>
                      <SelectItem value="northeast">Northeast (ईशान)</SelectItem>
                      <SelectItem value="northwest">Northwest (वायव्य)</SelectItem>
                      <SelectItem value="southeast">Southeast (आग्नेय)</SelectItem>
                      <SelectItem value="southwest">Southwest (नैऋत्य)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={analyzeVastu} className="w-full" size="lg">
                  Get Vastu Recommendation
                </Button>
                {vastuRecommendation && (
                  <div className="bg-primary/10 p-6 rounded-lg animate-fade-in">
                    <div className="text-sm font-semibold text-primary mb-2">Vastu Recommendation:</div>
                    <p className="text-muted-foreground leading-relaxed">{vastuRecommendation}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bank Loan Comparison */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Nepal Bank <span className="text-primary">Home Loan</span> Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bank, index) => (
              <Card key={index} className="glass p-6 hover-lift">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="text-primary" size={24} />
                  <h3 className="text-lg font-bold text-foreground">{bank.name}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="text-lg font-bold text-primary">{bank.rate}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-start space-x-2">
                      <Percent className="text-primary flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-muted-foreground">{bank.features}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="glass p-6 mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Interest rates are approximate and may vary. Contact banks directly for current rates and eligibility.
            </p>
            <Button 
              variant="outline"
              onClick={() => window.open('https://wa.me/9779845323733?text=Hello! I want to compare home loan options for my construction project.', '_blank')}
            >
              <MessageCircle className="mr-2" size={16} />
              Get Loan Assistance
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calculators;
