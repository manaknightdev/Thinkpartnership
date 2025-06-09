import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OnboardingClient from "./pages/OnboardingClient";
import OnboardingVendor from "./pages/OnboardingVendor";
import CustomerDashboard from "./pages/CustomerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // Import AdminDashboard

// Import new vendor sub-pages
import VendorProfilePage from "./pages/vendor/VendorProfilePage";
import VendorReferralsPage from "./pages/vendor/VendorReferralsPage";
import VendorInvitePage from "./pages/vendor/VendorInvitePage";
import VendorFullReferralReportPage from "./pages/vendor/VendorFullReferralReportPage";

// Import new client sub-pages
import ClientOverviewPage from "./pages/client/ClientOverviewPage";
import ClientReportsPage from "./pages/client/ClientReportsPage";
import ClientVendorManagementPage from "./pages/client/ClientVendorManagementPage";
import ClientRevenueRulesPage from "./pages/client/ClientRevenueRulesPage";

// Import new customer sub-pages
import CustomerBrowseServicesPage from "./pages/customer/CustomerBrowseServicesPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import CustomerAccountPage from "./pages/customer/CustomerAccountPage";
import ServiceDetailsPage from "./pages/customer/ServiceDetailsPage";
import CheckoutPage from "./pages/customer/CheckoutPage";

// Import new admin sub-pages
import AdminDashboardOverviewPage from "./pages/admin/AdminDashboardOverviewPage";
import AdminTransactionsPage from "./pages/admin/AdminTransactionsPage";
import AdminVendorApprovalsPage from "./pages/admin/AdminVendorApprovalsPage";
import AdminRevenueRulesPage from "./pages/admin/AdminRevenueRulesPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminManualCommissionsPage from "./pages/admin/AdminManualCommissionsPage";
import AdminLicenseManagementPage from "./pages/admin/AdminLicenseManagementPage"; // Import new page


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
          <Route path="/onboarding-client" element={<OnboardingClient />} />
          <Route path="/onboarding-vendor" element={<OnboardingVendor />} />

          {/* Nested routes for Customer Dashboard */}
          <Route path="/customer-portal" element={<CustomerDashboard />}>
            <Route index element={<Navigate to="browse" replace />} />
            <Route path="browse" element={<CustomerBrowseServicesPage />} />
            <Route path="services/:serviceName" element={<ServiceDetailsPage />} />
            <Route path="checkout/:serviceName" element={<CheckoutPage />} />
            <Route path="orders" element={<CustomerOrdersPage />} />
            <Route path="account" element={<CustomerAccountPage />} />
          </Route>

          {/* Nested routes for Client Dashboard */}
          <Route path="/client-portal" element={<ClientDashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ClientOverviewPage />} />
            <Route path="reports" element={<ClientReportsPage />} />
            <Route path="vendors" element={<ClientVendorManagementPage />} />
            <Route path="rules" element={<ClientRevenueRulesPage />} />
          </Route>

          {/* Nested routes for Vendor Dashboard */}
          <Route path="/vendor-portal" element={<VendorDashboard />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<VendorProfilePage />} />
            <Route path="referrals" element={<VendorReferralsPage />} />
            <Route path="referrals/full-report" element={<VendorFullReferralReportPage />} />
            <Route path="invite" element={<VendorInvitePage />} />
          </Route>

          {/* Nested routes for Admin Portal */}
          <Route path="/admin-portal" element={<AdminDashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminDashboardOverviewPage />} />
            <Route path="transactions" element={<AdminTransactionsPage />} />
            <Route path="vendor-approvals" element={<AdminVendorApprovalsPage />} />
            <Route path="revenue-rules" element={<AdminRevenueRulesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="manual-commissions" element={<AdminManualCommissionsPage />} />
            <Route path="license-management" element={<AdminLicenseManagementPage />} /> {/* New route */}
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;