import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToolsProvider } from "@/contexts/ToolsContext";
import { WebsiteContentProvider } from "@/contexts/WebsiteContentContext";
import { AuthProvider } from "@/hooks/useAuth";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import SEOHead from "./components/SEOHead";
import { ScrollToTop } from "./components/ScrollToTop";
import { ScrollProgress } from "./components/ScrollProgress";

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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutServices defaultTab="about" />} />
              <Route path="/services" element={<AboutServices defaultTab="services" />} />
              <Route path="/dang" element={<DangBranch />} />
              <Route path="/dang/:location" element={<DangBranch />} />
              <Route path="/group-companies" element={<GroupCompanies />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/tools" element={<ToolsHubPage />} />
              <Route path="/apps" element={<ToolsHubPage />} />
              <Route path="/tools/permits" element={<PermitAssistant />} />
              <Route path="/tools/calculators" element={<Calculators />} />
              <Route path="/tools/vastu" element={<VastuGuide />} />
              <Route path="/tools/buy-or-build" element={<BuyOrBuild />} />
              <Route path="/tools/timeline" element={<ConstructionTimeline />} />
              <Route path="/tools/green-calculator" element={<GreenBuildCalculator />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="/estimate" element={<Estimate />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/floor-planner" element={<FloorPlannerPage />} />
              <Route path="/under-construction" element={<UnderConstructionPage />} />
              <Route path="/designs" element={<HouseDesignsGallery />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* Dashboard routes */}
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              <Route path="/admin/users" element={<AdminUserManagement />} />
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
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