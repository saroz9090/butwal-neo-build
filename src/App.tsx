import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToolsProvider } from "@/contexts/ToolsContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutServices from "./pages/AboutServices";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Estimate from "./pages/Estimate";
import Contact from "./pages/Contact";
import PermitAssistant from "./pages/tools/PermitAssistant";
import Calculators from "./pages/tools/Calculators";
import VastuGuide from "./pages/tools/VastuGuide";
import BuyOrBuild from "./pages/tools/BuyOrBuild";
import ConstructionTimeline from "./pages/tools/ConstructionTimeline";
import GreenBuildCalculator from "./pages/tools/GreenBuildCalculator";
import Partnerships from "./pages/Partnerships";
import Testimonials from "./pages/Testimonials";
import NotFound from "./pages/NotFound";
import { Chatbot } from "./components/Chatbot";
import FloorPlannerPage from './pages/FloorPlannerPage';
import UnderConstructionPage from './pages/UnderConstructionPage';
import HouseDesignsGallery from "./pages/HouseDesignsGallery"; // Add this import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToolsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutServices />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tools/permits" element={<PermitAssistant />} />
          <Route path="/tools/calculators" element={<Calculators />} />
          <Route path="/tools/vastu" element={<VastuGuide />} />
          <Route path="/tools/buy-or-build" element={<BuyOrBuild />} />
          <Route path="/tools/timeline" element={<ConstructionTimeline />} />
          <Route path="/tools/green-calculator" element={<GreenBuildCalculator />} />
          <Route path="/partnerships" element={<Partnerships />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/floor-planner" element={<FloorPlannerPage />} />
          <Route path="/under-construction" element={<UnderConstructionPage />} /> {/* Add this line */}
          <Route path="*" element={<NotFound />} />
          <Route path="/designs" element={<HouseDesignsGallery />} />
        </Routes>
        <Footer />
        <Chatbot />
      </BrowserRouter>
      </ToolsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;