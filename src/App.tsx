import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/Navigation";
import Vote from "./pages/Vote";
import Leaderboard from "./pages/Leaderboard";
import Reviews from "./pages/Reviews";
import CompanyDetails from "./pages/CompanyDetails";
import NotFound from "./pages/NotFound";
import { initializeDatabase } from "./lib/database";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize database with sample data
    initializeDatabase().then(success => {
      if (success) {
        console.log('Database initialized successfully');
      } else {
        console.error('Failed to initialize database');
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Vote />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/company/:id" element={<CompanyDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
