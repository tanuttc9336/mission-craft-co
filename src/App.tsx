import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BriefProvider } from "@/hooks/useBrief";
import { LensProvider } from "@/hooks/useLens";
import { PortalAuthProvider } from "@/hooks/usePortalAuth";
import Layout from "@/components/Layout";
import PortalLayout from "@/components/portal/PortalLayout";
import Home from "./pages/Home";
import ProcessPage from "./pages/ProcessPage";
import Work from "./pages/Work";
import Golf from "./pages/Golf";
import Drone from "./pages/Drone";
import Services from "./pages/Services";
import CaseDetail from "./pages/CaseDetail";
import BriefingRoom from "./pages/BriefingRoom";
import Blueprint from "./pages/Blueprint";
import Confirmation from "./pages/Confirmation";
// IdeaEngine removed — redirected to /lens
import Lens from "./pages/Lens";
import Credentials from "./pages/Credentials";
import NotFound from "./pages/NotFound";
import Login from "./pages/portal/Login";
import Dashboard from "./pages/portal/Dashboard";
import ProjectDetail from "./pages/portal/ProjectDetail";
import Timeline from "./pages/portal/Timeline";
import Deliverables from "./pages/portal/Deliverables";
import Reviews from "./pages/portal/Reviews";
import Files from "./pages/portal/Files";
import Brief from "./pages/portal/Brief";
import NextSteps from "./pages/portal/NextSteps";
import Account from "./pages/portal/Account";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BriefProvider>
          <LensProvider>
            <PortalAuthProvider>
              <Routes>
                {/* Public site with Layout */}
                <Route element={<Layout><Routes><Route path="*" element={null} /></Routes></Layout>}>
                </Route>

                {/* Public routes — two landing funnels */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/process" element={<ProcessPage />} />
                {/* Work browse (cold funnel) */}
                <Route path="/work" element={<Layout><Work /></Layout>} />
                <Route path="/work/:id" element={<Layout><CaseDetail /></Layout>} />
                {/* Golf — specialty landing */}
                <Route path="/golf" element={<Layout><Golf /></Layout>} />
                <Route path="/industries/golf" element={<Navigate to="/golf" replace />} />
                <Route path="/drone" element={<Layout><Drone /></Layout>} />
                <Route path="/industries/drone" element={<Navigate to="/drone" replace />} />
                <Route path="/credentials" element={<Layout><Credentials /></Layout>} />
                <Route path="/deck" element={<Navigate to="/credentials" replace />} />
                <Route path="/services" element={<Layout><Services /></Layout>} />
                <Route path="/services/drone" element={<Navigate to="/drone" replace />} />
                <Route path="/contact" element={<Navigate to="/process#09-the-pass" replace />} />
                <Route path="/briefing-room" element={<Layout><BriefingRoom /></Layout>} />
                {/* Legacy /builder route → redirect */}
                <Route path="/builder" element={<Navigate to="/briefing-room" replace />} />
                <Route path="/blueprint" element={<Layout><Blueprint /></Layout>} />
                <Route path="/confirmation/:id" element={<Layout><Confirmation /></Layout>} />
                {/* IdeaEngine retired — redirect to Lens */}
                <Route path="/ideas" element={<Navigate to="/lens" replace />} />
                <Route path="/lens" element={<Layout><Lens /></Layout>} />

                {/* Portal auth */}
                <Route path="/login" element={<Login />} />

                {/* Portal routes — own layout */}
                <Route path="/portal" element={<PortalLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="timeline" element={<Timeline />} />
                  <Route path="deliverables" element={<Deliverables />} />
                  <Route path="reviews" element={<Reviews />} />
                  <Route path="files" element={<Files />} />
                  <Route path="brief" element={<Brief />} />
                  <Route path="next-steps" element={<NextSteps />} />
                  <Route path="account" element={<Account />} />
                  <Route path="project/:id" element={<ProjectDetail />} />
                </Route>

                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </PortalAuthProvider>
          </LensProvider>
        </BriefProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
