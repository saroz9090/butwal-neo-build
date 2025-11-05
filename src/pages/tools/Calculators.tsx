import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Home, DollarSign, MessageCircle } from "lucide-react";

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

  const banks = [
    { name: "Nepal Bank Limited", rate: "9.5-11%", features: "Low interest, flexible tenure" },
    { name: "Rastriya Banijya Bank", rate: "9.75-11.5%", features: "Government bank, subsidized rates" },
    { name: "Nabil Bank", rate: "10-12%", features: "Quick processing, premium service" },
    { name: "NIC Asia Bank", rate: "9.8-11.8%", features: "Competitive rates, digital banking" },
    { name: "Global IME Bank", rate: "10-12.5%", features: "Wide branch network" },
    { name: "Himalayan Bank", rate: "9.9-11.9%", features: "Personalized solutions" }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Financial <span className="text-primary">Calculators</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Plan your construction budget with our comprehensive financial tools
          </p>
        </div>

        {/* Quick Contact */}
        <Card className="glass p-6 mb-12 text-center border border-border">
          <h3 className="text-xl font-bold mb-3 text-foreground">Need Personalized Financial Advice?</h3>
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
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-1 md:grid-cols-3 mb-12 bg-muted p-1">
            <TabsTrigger value="emi" className="text-foreground data-[state=active]:bg-card">EMI Calculator</TabsTrigger>
            <TabsTrigger value="roi" className="text-foreground data-[state=active]:bg-card">ROI Calculator</TabsTrigger>
            <TabsTrigger value="rental" className="text-foreground data-[state=active]:bg-card">Rental Yield</TabsTrigger>
          </TabsList>

          {/* EMI Calculator */}
          <TabsContent value="emi">
            <Card className="glass p-8 max-w-2xl mx-auto border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="text-primary" size={32} />
                <h2 className="text-2xl font-bold text-foreground">Home Loan EMI Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="loanAmount" className="text-foreground">Loan Amount (NPR)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate" className="text-foreground">Interest Rate (% per annum)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 10.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="loanTenure" className="text-foreground">Loan Tenure (Years)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    placeholder="e.g., 15"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <Button onClick={calculateEMI} className="w-full" size="lg">
                  Calculate EMI
                </Button>
                {emi && (
                  <div className="bg-card/50 border border-primary/20 p-6 rounded-lg text-center animate-fade-in">
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
            <div className="max-w-2xl mx-auto">
              <Card className="glass p-8 border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="text-primary" size={32} />
                <h2 className="text-2xl font-bold text-foreground">Property Appreciation Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="propertyValue" className="text-foreground">Current Property Value (NPR)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    placeholder="e.g., 10000000"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="appreciationRate" className="text-foreground">Expected Appreciation Rate (% per year)</Label>
                  <Input
                    id="appreciationRate"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 8 (Nepal avg: 6-10%)"
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="years" className="text-foreground">Investment Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="e.g., 10"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <Button onClick={calculateROI} className="w-full" size="lg">
                  Calculate Future Value
                </Button>
                {futureValue && (
                  <div className="bg-card/50 border border-primary/20 p-6 rounded-lg text-center animate-fade-in">
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
            </div>
          </TabsContent>

          {/* Rental Yield Calculator */}
          <TabsContent value="rental">
            <div className="max-w-2xl mx-auto">
              <Card className="glass p-8 border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Home className="text-primary" size={32} />
                <h2 className="text-2xl font-bold text-foreground">Rental Yield Calculator</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="purchasePrice" className="text-foreground">Property Purchase Price (NPR)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="e.g., 15000000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRent" className="text-foreground">Expected Monthly Rent (NPR)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="e.g., 50000"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <Button onClick={calculateRentalYield} className="w-full" size="lg">
                  Calculate Rental Yield
                </Button>
                {rentalYield && (
                  <div className="bg-card/50 border border-primary/20 p-6 rounded-lg text-center animate-fade-in">
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Bank Loan Information */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            Nepal Home Loan <span className="text-primary">Comparison</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bank, index) => (
              <Card key={index} className="glass p-6 border border-border hover-lift">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="text-primary" size={24} />
                  <h3 className="font-bold text-lg text-foreground">{bank.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <span className="font-semibold text-primary">{bank.rate}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{bank.features}</p>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            * Interest rates are approximate and subject to change. Please contact banks directly for current rates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculators;