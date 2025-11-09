import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Home, Compass, Calculator, ArrowRight } from "lucide-react";
import { useTools } from "@/contexts/ToolsContext";

interface SuggestionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  data?: string;
}

const SuggestionCard = ({ title, description, icon, linkTo, data }: SuggestionCardProps) => (
  <Card className="glass border-primary/20 hover-lift">
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {data && (
            <div className="text-sm font-semibold text-primary mb-2">{data}</div>
          )}
          <Link to={linkTo}>
            <Button variant="ghost" size="sm" className="text-primary p-0 h-auto hover:bg-transparent">
              Explore <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ToolSuggestions = () => {
  const { estimateData, roiData, emiData, buyOrBuildData } = useTools();
  const suggestions = [];

  // From Estimate to ROI Calculator
  if (estimateData && !roiData) {
    suggestions.push({
      title: "Calculate Future Value",
      description: `Based on your NPR ${estimateData.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })} project, see what it could be worth in the future.`,
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      linkTo: "/tools/calculators",
      data: `Property Value: NPR ${estimateData.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    });
  }

  // From Estimate to EMI Calculator
  if (estimateData && !emiData) {
    suggestions.push({
      title: "Plan Your Loan EMI",
      description: "Calculate monthly loan payments for your construction project.",
      icon: <Calculator className="w-5 h-5 text-primary" />,
      linkTo: "/tools/calculators",
      data: `Loan Amount: NPR ${estimateData.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    });
  }

  // From Estimate to Vastu Guide
  if (estimateData && estimateData.floors >= 2) {
    suggestions.push({
      title: "Check Vastu for Multi-Story",
      description: `Your ${estimateData.floors}-floor design should follow Vastu principles for prosperity.`,
      icon: <Compass className="w-5 h-5 text-primary" />,
      linkTo: "/tools/vastu"
    });
  }

  // From ROI to Rental Yield
  if (roiData) {
    const estimatedRent = Math.round(roiData.propertyValue * 0.004); // 0.4% of property value as monthly rent
    suggestions.push({
      title: "Calculate Rental Income",
      description: "Your property could generate rental income. Calculate your rental yield.",
      icon: <Home className="w-5 h-5 text-primary" />,
      linkTo: "/tools/calculators",
      data: `Est. Rent: NPR ${estimatedRent.toLocaleString('en-IN')}/month`
    });
  }

  // From EMI to ROI
  if (emiData && !roiData) {
    const propertyValue = emiData.loanAmount;
    suggestions.push({
      title: "See Your Investment Growth",
      description: "Calculate how much your property will appreciate over time.",
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      linkTo: "/tools/calculators",
      data: `Property Value: NPR ${propertyValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    });
  }

  // From Buy or Build to Timeline
  if (buyOrBuildData && buyOrBuildData.recommendation.includes('Building')) {
    suggestions.push({
      title: "View Construction Timeline",
      description: "See the complete timeline for building your dream home.",
      icon: <Home className="w-5 h-5 text-primary" />,
      linkTo: "/tools/timeline"
    });
  }

  // From Buy or Build to Vastu
  if (buyOrBuildData) {
    suggestions.push({
      title: "Plan with Vastu Shastra",
      description: "Ensure your home follows Vastu principles for prosperity and harmony.",
      icon: <Compass className="w-5 h-5 text-primary" />,
      linkTo: "/tools/vastu"
    });
  }

  // Show Construction Timeline for any project
  if (estimateData && estimateData.area > 0) {
    suggestions.push({
      title: "View Construction Stages",
      description: "Watch your project come to life with our 3D construction timeline.",
      icon: <Home className="w-5 h-5 text-primary" />,
      linkTo: "/tools/timeline",
      data: `${estimateData.area * estimateData.floors} sq ft project`
    });
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h3 className="text-lg font-semibold text-foreground">Suggested Next Steps</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.slice(0, 4).map((suggestion, index) => (
          <SuggestionCard key={index} {...suggestion} />
        ))}
      </div>
    </div>
  );
};
