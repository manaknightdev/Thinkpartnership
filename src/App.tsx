import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Header } from "./components/Header"; // Import the Header component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* The Header will be part of the main layout, so it's outside Routes for now */}
        {/* <Header /> // Decided to put it inside Index for now, as it's a landing page header */}
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/client-portal" element={<div>Client Portal - Coming Soon!</div>} />
          <Route path="/vendor-portal" element={<div>Vendor Portal - Coming Soon!</div>} />
          <Route path="/customer-portal" element={<div>Customer Portal - Coming Soon!</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;