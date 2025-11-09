import { createContext, useContext, useState, ReactNode } from 'react';

interface EstimateData {
  area: number;
  floors: number;
  materialType: string;
  totalCost: number;
  timestamp: number;
}

interface ROIData {
  propertyValue: number;
  appreciationRate: number;
  years: number;
  futureValue: number;
  timestamp: number;
}

interface EMIData {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  timestamp: number;
}

interface RentalYieldData {
  purchasePrice: number;
  monthlyRent: number;
  rentalYield: number;
  timestamp: number;
}

interface VastuData {
  direction: string;
  recommendations: string[];
  timestamp: number;
}

interface BuyOrBuildData {
  buyTotal: number;
  buildTotal: number;
  savings: number;
  recommendation: string;
  timestamp: number;
}

interface ToolsContextType {
  estimateData: EstimateData | null;
  roiData: ROIData | null;
  emiData: EMIData | null;
  rentalYieldData: RentalYieldData | null;
  vastuData: VastuData | null;
  buyOrBuildData: BuyOrBuildData | null;
  setEstimateData: (data: EstimateData | null) => void;
  setROIData: (data: ROIData | null) => void;
  setEMIData: (data: EMIData | null) => void;
  setRentalYieldData: (data: RentalYieldData | null) => void;
  setVastuData: (data: VastuData | null) => void;
  setBuyOrBuildData: (data: BuyOrBuildData | null) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: ReactNode }) => {
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);
  const [roiData, setROIData] = useState<ROIData | null>(null);
  const [emiData, setEMIData] = useState<EMIData | null>(null);
  const [rentalYieldData, setRentalYieldData] = useState<RentalYieldData | null>(null);
  const [vastuData, setVastuData] = useState<VastuData | null>(null);
  const [buyOrBuildData, setBuyOrBuildData] = useState<BuyOrBuildData | null>(null);

  return (
    <ToolsContext.Provider
      value={{
        estimateData,
        roiData,
        emiData,
        rentalYieldData,
        vastuData,
        buyOrBuildData,
        setEstimateData,
        setROIData,
        setEMIData,
        setRentalYieldData,
        setVastuData,
        setBuyOrBuildData,
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
};
