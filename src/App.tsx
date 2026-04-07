import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContentProvider } from "@/lib/content";
import Home from "./pages/Home";
import About from "./pages/About";
import Staff from "./pages/Staff";
import Fleet from "./pages/Fleet";
import RoutesPage from "./pages/Routes";
import Hubs from "./pages/Hubs";
import Ranks from "./pages/Ranks";
import Apply from "./pages/Apply";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* ContentProvider fetches from Supabase ONCE and shares via context */}
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/hubs" element={<Hubs />} />
            <Route path="/ranks" element={<Ranks />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
