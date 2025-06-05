import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirection
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OnboardingClient from "./pages/OnboardingClient";
import OnboardingVendor from "./pages/OnboardingVendor";
import ClientDashboard from "./pages/ClientDashboard";
import VendorDashboard from "./pages/VendorDashboard"; // VendorDashboard is now a layout
import CustomerPortal from "./pages/CustomerPortal";
// Import new vendor sub-pages
import VendorProfilePage from "./pages/vendor/VendorProfilePage";
import VendorReferralsPage from "./pages/vendor/VendorReferralsPage";
import VendorInvitePage from "./pages/vendor/VendorInvitePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client-portal" element={<ClientDashboard />} />
          <Route path="/customer-portal" element={<CustomerPortal />} />
          <Route path="/onboarding-client" element={<OnboardingClient />} />
          <Route path="/onboarding-vendor" element={<OnboardingVendor />} />

          {/* Nested routes for Vendor Dashboard */}
          <Route path="/vendor-portal" element={<VendorDashboard />}>
            <Route index element={<Navigate to="profile" replace />} /> {/* Default sub-route */}
            <Route path="profile" element={<VendorProfilePage />} />
            <Route path="referrals" element={<VendorReferralsPage />} />
            <Route path="invite" element={<VendorInvitePage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;