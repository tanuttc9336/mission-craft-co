import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BriefProvider } from "@/hooks/useBrief";
import { LensProvider } from "@/hooks/useLens";
import { PortalAuthProvider } from "@/hooks/usePortalAuth";
import Layout from "@/components/Layout";
import PortalLayout from "@/components/portal/PortalLayout";
import Home from "./pages/Home";
import Work from "./pages/Work";
import CaseDetail from "./pages/CaseDetail";
import Builder from "./pages/Builder";
import Blueprint from "./pages/Blueprint";
import Contact from "./pages/Contact";
import IdeaEngine from "./pages/IdeaEngine";
import Lens from "./pages/Lens";
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

                {/* Public routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/work" element={<Layout><Work /></Layout>} />
                <Route path="/work/:id" element={<Layout><CaseDetail /></Layout>} />
                <Route path="/builder" element={<Layout><Builder /></Layout>} />
                <Route path="/blueprint" element={<Layout><Blueprint /></Layout>} />
                <Route path="/ideas" element={<Layout><IdeaEngine /></Layout>} />
                <Route path="/lens" element={<Layout><Lens /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />

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
);

export default App;
