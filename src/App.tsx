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
import VendorServicesPage from "./pages/vendor/VendorServicesPage";
import VendorRequestsPage from "./pages/vendor/VendorRequestsPage";
import VendorMessagesPage from "./pages/vendor/VendorMessagesPage";
import VendorWalletPage from "./pages/vendor/VendorWalletPage";
import VendorNotificationsPage from "./pages/vendor/VendorNotificationsPage";
import VendorAccountPage from "./pages/vendor/VendorAccountPage";
import VendorHelpSupportPage from "./pages/vendor/VendorHelpSupportPage";
import VendorReferralsPage from "./pages/vendor/VendorReferralsPage";
import VendorInvitePage from "./pages/vendor/VendorInvitePage";
import VendorFullReferralReportPage from "./pages/vendor/VendorFullReferralReportPage";
import VendorSubscriptionPage from "./pages/vendor/VendorSubscriptionPage";

// Import new client sub-pages
import ClientOverviewPage from "./pages/client/ClientOverviewPage";
import ClientReportsPage from "./pages/client/ClientReportsPage";
import ClientVendorManagementPage from "./pages/client/ClientVendorManagementPage";
import ClientRevenueRulesPage from "./pages/client/ClientRevenueRulesPage";
import ClientBrandingPage from "./pages/client/ClientBrandingPage";
import ClientMarketplaceOrdersPage from "./pages/client/ClientMarketplaceOrdersPage"; // New import

// Import new customer sub-pages
import CustomerBrowseServicesPage from "./pages/customer/CustomerBrowseServicesPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import CustomerAccountPage from "./pages/customer/CustomerAccountPage";
import ServiceDetailsPage from "./pages/customer/ServiceDetailsPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import CategoriesPage from "./pages/customer/CategoriesPage";
import AllServicesPage from "./pages/customer/AllServicesPage";
import FavoritesPage from "./pages/customer/FavoritesPage";
import RecentlyViewedPage from "./pages/customer/RecentlyViewedPage";
import AccountPage from "./pages/customer/AccountPage";
import HelpSupportPage from "./pages/customer/HelpSupportPage";
import LocationBrowsePage from "./pages/customer/LocationBrowsePage";
import DealsOffersPage from "./pages/customer/DealsOffersPage";
import ServiceRequestsPage from "./pages/customer/ServiceRequestsPage";
import ServiceRequestDetailsPage from "./pages/customer/ServiceRequestDetailsPage";
import RequestServicePage from "./pages/customer/RequestServicePage";
import ChatPage from "./pages/customer/ChatPage";
import NotificationsPage from "./pages/customer/NotificationsPage";
import PlaceholderPage from "./pages/customer/PlaceholderPage";

// Import new admin sub-pages
import AdminDashboardOverviewPage from "./pages/admin/AdminDashboardOverviewPage";
import AdminTransactionsPage from "./pages/admin/AdminTransactionsPage";
import AdminVendorApprovalsPage from "./pages/admin/AdminVendorApprovalsPage";
import AdminRevenueRulesPage from "./pages/admin/AdminRevenueRulesPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminManualCommissionsPage from "./pages/admin/AdminManualCommissionsPage";
import AdminLicenseManagementPage from "./pages/admin/AdminLicenseManagementPage";
import AdminSubscriptionPlansPage from "./pages/admin/AdminSubscriptionPlansPage";
import AdminIntegrationsPage from "./pages/admin/AdminIntegrationsPage";


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

          {/* Standalone Marketplace Routes */}
          <Route path="/marketplace" element={<CustomerBrowseServicesPage />} />
          <Route path="/marketplace/categories" element={<CategoriesPage />} />
          <Route path="/marketplace/services" element={<AllServicesPage />} />
          <Route path="/marketplace/services/:serviceName" element={<ServiceDetailsPage />} />
          <Route path="/marketplace/checkout/:serviceName" element={<CheckoutPage />} />
          <Route path="/marketplace/favorites" element={<FavoritesPage />} />
          <Route path="/marketplace/recent" element={<RecentlyViewedPage />} />
          <Route path="/marketplace/account" element={<AccountPage />} />
          <Route path="/marketplace/help" element={<HelpSupportPage />} />
          <Route path="/marketplace/location" element={<LocationBrowsePage />} />
          <Route path="/marketplace/deals" element={<DealsOffersPage />} />
          <Route path="/marketplace/requests" element={<ServiceRequestsPage />} />
          <Route path="/marketplace/requests/:requestId" element={<ServiceRequestDetailsPage />} />
          <Route path="/marketplace/request-service/:serviceName" element={<RequestServicePage />} />
          <Route path="/marketplace/notifications" element={<NotificationsPage />} />
          <Route path="/marketplace/request-submitted" element={<PlaceholderPage title="Request Submitted" description="Your service request has been submitted successfully! We'll match you with qualified professionals soon." />} />
          <Route path="/marketplace/chat/:vendorName" element={<ChatPage />} />
          <Route path="/marketplace/map" element={<PlaceholderPage title="Service Map" description="Interactive map view coming soon." />} />

          {/* Nested routes for Customer Dashboard */}
          <Route path="/customer-portal" element={<CustomerDashboard />}>
            <Route index element={<Navigate to="/marketplace" replace />} />
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
            <Route path="branding" element={<ClientBrandingPage />} />
            <Route path="orders" element={<ClientMarketplaceOrdersPage />} /> {/* New route */}
          </Route>

          {/* Nested routes for Vendor Dashboard */}
          <Route path="/vendor-portal" element={<VendorDashboard />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<VendorProfilePage />} />
            <Route path="services" element={<VendorServicesPage />} />
            <Route path="requests" element={<VendorRequestsPage />} />
            <Route path="messages" element={<VendorMessagesPage />} />
            <Route path="messages/:customerId" element={<VendorMessagesPage />} />
            <Route path="wallet" element={<VendorWalletPage />} />
            <Route path="notifications" element={<VendorNotificationsPage />} />
            <Route path="account" element={<VendorAccountPage />} />
            <Route path="help" element={<VendorHelpSupportPage />} />
            <Route path="referrals" element={<VendorReferralsPage />} />
            <Route path="referrals/full-report" element={<VendorFullReferralReportPage />} />
            <Route path="invite" element={<VendorInvitePage />} />
            <Route path="subscription" element={<VendorSubscriptionPage />} />
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
            <Route path="license-management" element={<AdminLicenseManagementPage />} />
            <Route path="subscription-plans" element={<AdminSubscriptionPlansPage />} />
            <Route path="integrations" element={<AdminIntegrationsPage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;