import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BriefProvider } from "@/hooks/useBrief";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Work from "./pages/Work";
import CaseDetail from "./pages/CaseDetail";
import Builder from "./pages/Builder";
import Blueprint from "./pages/Blueprint";
import Contact from "./pages/Contact";
import IdeaEngine from "./pages/IdeaEngine";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BriefProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:id" element={<CaseDetail />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/blueprint" element={<Blueprint />} />
              <Route path="/ideas" element={<IdeaEngine />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BriefProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
