import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { ToolsProvider } from "@/contexts/ToolsContext";
import { WebsiteContentProvider } from "@/contexts/WebsiteContentContext";
import { AuthProvider } from "@/hooks/useAuth";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import SEOHead from "./components/SEOHead";
import { ScrollToTop } from "./components/ScrollToTop";
import { ScrollProgress } from "./components/ScrollProgress";
import { PageTransition } from "./components/PageTransition";

import Home from "./pages/Home";
import AboutServices from "./pages/AboutServices";
import DangBranch from "./pages/DangBranch";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Estimate from "./pages/Estimate";
import Contact from "./pages/Contact";
import GroupCompanies from "./pages/GroupCompanies";
import ToolsHubPage from "./pages/tools/ToolsHubPage";
import PermitAssistant from "./pages/tools/PermitAssistant";
import Calculators from "./pages/tools/Calculators";
import VastuGuide from "./pages/tools/VastuGuide";
import BuyOrBuild from "./pages/tools/BuyOrBuild";
import ConstructionTimeline from "./pages/tools/ConstructionTimeline";
import GreenBuildCalculator from "./pages/tools/GreenBuildCalculator";
import PaintCalculator from "./pages/tools/PaintCalculator";
import TilesCalculator from "./pages/tools/TilesCalculator";
import Partnerships from "./pages/Partnerships";
import Testimonials from "./pages/Testimonials";
import NotFound from "./pages/NotFound";
import { Chatbot } from "./components/Chatbot";
import FloorPlannerPage from './pages/FloorPlannerPage';
import UnderConstructionPage from './pages/UnderConstructionPage';
import HouseDesignsGallery from "./pages/HouseDesignsGallery";
import LoginPage from "./pages/LoginPage";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminSetup from "./pages/AdminSetup";
import Privacy from "./pages/Privacy";
import TermsAndConditions from "./pages/Terms";
import Sitemap from "./pages/Sitemap";
import BlogPostDetail from "./pages/BlogPostDetail";
import ProjectDetail from "./pages/ProjectDetail";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutServices defaultTab="about" /></PageTransition>} />
        <Route path="/services" element={<PageTransition><AboutServices defaultTab="services" /></PageTransition>} />
        <Route path="/dang" element={<PageTransition><DangBranch /></PageTransition>} />
        <Route path="/dang/:location" element={<PageTransition><DangBranch /></PageTransition>} />
        <Route path="/group-companies" element={<PageTransition><GroupCompanies /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/projects/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
        <Route path="/tools" element={<PageTransition><ToolsHubPage /></PageTransition>} />
        <Route path="/apps" element={<PageTransition><ToolsHubPage /></PageTransition>} />
        <Route path="/tools/permits" element={<PageTransition><PermitAssistant /></PageTransition>} />
        <Route path="/tools/calculators" element={<PageTransition><Calculators /></PageTransition>} />
        <Route path="/tools/vastu" element={<PageTransition><VastuGuide /></PageTransition>} />
        <Route path="/tools/buy-or-build" element={<PageTransition><BuyOrBuild /></PageTransition>} />
        <Route path="/tools/timeline" element={<PageTransition><ConstructionTimeline /></PageTransition>} />
        <Route path="/tools/green-calculator" element={<PageTransition><GreenBuildCalculator /></PageTransition>} />
        <Route path="/tools/paint-calculator" element={<PageTransition><PaintCalculator /></PageTransition>} />
        <Route path="/paint-calculator" element={<PageTransition><PaintCalculator /></PageTransition>} />
        <Route path="/tools/tiles-calculator" element={<PageTransition><TilesCalculator /></PageTransition>} />
        <Route path="/tiles-calculator" element={<PageTransition><TilesCalculator /></PageTransition>} />
        <Route path="/partnerships" element={<PageTransition><Partnerships /></PageTransition>} />
        <Route path="/testimonials" element={<PageTransition><Testimonials /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:id" element={<PageTransition><BlogPostDetail /></PageTransition>} />
        <Route path="/estimate" element={<PageTransition><Estimate /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/floor-planner" element={<PageTransition><FloorPlannerPage /></PageTransition>} />
        <Route path="/under-construction" element={<PageTransition><UnderConstructionPage /></PageTransition>} />
        <Route path="/designs" element={<PageTransition><HouseDesignsGallery /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsAndConditions /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        {/* Dashboard routes */}
        <Route path="/customer/dashboard" element={<PageTransition><CustomerDashboard /></PageTransition>} />
        <Route path="/staff/dashboard" element={<PageTransition><StaffDashboard /></PageTransition>} />
        <Route path="/admin/users" element={<PageTransition><AdminUserManagement /></PageTransition>} />
        <Route path="/admin/setup" element={<PageTransition><AdminSetup /></PageTransition>} />
        <Route path="/sitemap" element={<PageTransition><Sitemap /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WebsiteContentProvider>
          <ToolsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <ScrollProgress />
            <SEOHead />
            <Navigation />
            <AnimatedRoutes />
            <Footer />
            <Chatbot />

          </BrowserRouter>
        </ToolsProvider>
      </WebsiteContentProvider>
    </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;