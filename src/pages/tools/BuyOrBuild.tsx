import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Home, Hammer, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useTools } from "@/contexts/ToolsContext";
import { ToolSuggestions } from "@/components/ToolSuggestions";

const BuyOrBuild = () => {
  const { setBuyOrBuildData } = useTools();
  const [buyPrice, setBuyPrice] = useState('');
  const [landPrice, setLandPrice] = useState('');
  const [buildingCost, setBuildingCost] = useState('');
  const [legalFees, setLegalFees] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [result, setResult] = useState<{
    buyTotal: number;
    buildTotal: number;
    savings: number;
    recommendation: string;
  } | null>(null);

  const calculate = () => {
    const buy = parseFloat(buyPrice);
    const land = parseFloat(landPrice);
    const build = parseFloat(buildingCost);
    const legal = parseFloat(legalFees) || 0;
    const time = parseFloat(timeAvailable);

    if (!buy || !land || !build || !time) {
      toast.error('Please fill all required fields');
      return;
    }

    const buyTotal = buy + (buy * 0.05); // 5% registration fees
    const buildTotal = land + build + legal + (build * 0.10); // 10% contingency

    const savings = buyTotal - buildTotal;
    let recommendation = '';

    if (time < 6) {
      recommendation = 'Buying is recommended - Building takes 12-18 months typically. With limited time, buying a ready property is more practical.';
    } else if (savings > 0) {
      recommendation = `Building is recommended - You can save approximately NPR ${savings.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} by building. You have sufficient time and can customize to your needs.`;
    } else {
      recommendation = `Buying is recommended - Building will cost approximately NPR ${Math.abs(savings).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} more. Consider buying unless customization is essential.`;
    }

    setResult({
      buyTotal,
      buildTotal,
      savings,
      recommendation
    });

    // Save to context
    setBuyOrBuildData({
      buyTotal,
      buildTotal,
      savings,
      recommendation,
      timestamp: Date.now()
    });

    toast.success('Analysis complete');
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Should I <span className="text-gradient">Buy or Build?</span>
          </h1>
          <p className="text-lg text-muted-foreground">Make an informed decision about your next home</p>
          <Button 
            onClick={() => window.open('https://wa.me/9779845323733?text=I need help deciding whether to buy or build', '_blank')}
            className="mt-4 bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Get Expert Advice
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                Buying Option
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buyPrice">Property Price (NPR)</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  placeholder="e.g., 15000000"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="w-5 h-5 text-primary" />
                Building Option
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="landPrice">Land Price (NPR)</Label>
                <Input
                  id="landPrice"
                  type="number"
                  placeholder="e.g., 8000000"
                  value={landPrice}
                  onChange={(e) => setLandPrice(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buildingCost">Construction Cost (NPR)</Label>
                <Input
                  id="buildingCost"
                  type="number"
                  placeholder="e.g., 6000000"
                  value={buildingCost}
                  onChange={(e) => setBuildingCost(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="legalFees">Legal & Other Fees (NPR)</Label>
                <Input
                  id="legalFees"
                  type="number"
                  placeholder="e.g., 200000"
                  value={legalFees}
                  onChange={(e) => setLegalFees(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="timeAvailable">Months Available (Before you need to move in)</Label>
              <Input
                id="timeAvailable"
                type="number"
                placeholder="e.g., 12"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={calculate} className="w-full mb-8" size="lg">
          <TrendingUp className="w-4 h-4 mr-2" />
          Analyze Options
        </Button>

        {result && (
          <Card className="glass glow">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 glass rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Buying Total Cost</div>
                  <div className="text-2xl font-bold text-foreground">
                    NPR {result.buyTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                </div>
                <div className="p-4 glass rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Building Total Cost</div>
                  <div className="text-2xl font-bold text-foreground">
                    NPR {result.buildTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="text-sm font-semibold text-primary mb-2">Recommendation</div>
                <p className="text-foreground">{result.recommendation}</p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">Additional Considerations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Building allows full customization to your needs</li>
                  <li>Buying is faster - move in immediately</li>
                  <li>Building requires active involvement and decision-making</li>
                  <li>Buying eliminates construction stress and delays</li>
                  <li>Land appreciation may favor building long-term</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tool Suggestions */}
        {result && <ToolSuggestions />}
      </div>
    </div>
  );
};

export default BuyOrBuild;
