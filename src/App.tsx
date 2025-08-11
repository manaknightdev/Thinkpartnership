import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClientProvider } from "./contexts/ClientContext";
import { CartProvider } from "./contexts/CartContext";

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
import VendorServiceTiersPage from "./pages/vendor/VendorServiceTiersPage";
import VendorRequestsPage from "./pages/vendor/VendorRequestsPage";
import VendorOrdersPage from "./pages/vendor/VendorOrdersPage";
import VendorMessagesPage from "./pages/vendor/VendorMessagesPage";
import VendorCustomersPage from "./pages/vendor/VendorCustomersPage";
// import VendorSubscriptionPage from "./pages/vendor/VendorSubscriptionPage";
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
import ClientCustomersPage from "./pages/client/ClientCustomersPage";
import ClientInviteSystemPage from "./pages/client/ClientInviteSystemPage";
import ClientSubscriptionPage from "./pages/client/ClientSubscriptionPage";
import ClientPricingBillingPage from "./pages/client/ClientPricingBillingPage";
import ClientWalletPage from "./pages/client/ClientWalletPage";
import ClientNotificationsPage from "./pages/client/ClientNotificationsPage";
import ClientHelpSupportPage from "./pages/client/ClientHelpSupportPage";
import ClientRevenueRulesPage from "./pages/client/ClientRevenueRulesPage";
import ClientBrandingPage from "./pages/client/ClientBrandingPage";
import ClientMarketplaceOrdersPage from "./pages/client/ClientMarketplaceOrdersPage"; // New import
import ClientTasksPage from "./pages/client/ClientTasksPage";
import ClientCategoriesPage from "./pages/client/ClientCategoriesPage"; // New import

// Import new customer sub-pages
import CustomerBrowseServicesPage from "./pages/customer/CustomerBrowseServicesPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import CustomerAccountPage from "./pages/customer/CustomerAccountPage";
import ServiceDetailsPage from "./pages/customer/ServiceDetailsPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage";
import CategoriesPage from "./pages/customer/CategoriesPage";
import AllServicesPage from "./pages/customer/AllServicesPage";
import AccountPage from "./pages/customer/AccountPage";
import HelpSupportPage from "./pages/customer/HelpSupportPage";
import ServiceRequestsPage from "./pages/customer/ServiceRequestsPage";
import ServiceRequestDetailsPage from "./pages/customer/ServiceRequestDetailsPage";
import RequestServicePage from "./pages/customer/RequestServicePage";
import ChatPage from "./pages/customer/ChatPage";
import MessagesPage from "./pages/customer/MessagesPage";
import NotificationsPage from "./pages/customer/NotificationsPage";
import PlaceholderPage from "./pages/customer/PlaceholderPage";
import CartPage from "./pages/customer/CartPage";
import CartCheckoutPage from "./pages/customer/CartCheckoutPage";
import CartPaymentSuccessPage from "./pages/customer/CartPaymentSuccessPage";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerSignup from "./pages/customer/CustomerSignup";
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorSignup from "./pages/vendor/VendorSignup";
import ClientLogin from "./pages/client/ClientLogin";
import ClientSignup from "./pages/client/ClientSignup";
import AdminLogin from "./pages/admin/AdminLogin";
import OAuthCallback from "./pages/customer/OAuthCallback";
import ProtectedRoute, { VendorProtectedRoute, ClientProtectedRoute, AdminProtectedRoute } from "./components/ProtectedRoute";

// Import new admin sub-pages
import AdminDashboardOverviewPage from "./pages/admin/AdminDashboardOverviewPage";
import AdminAllClientsPage from "./pages/admin/AdminAllClientsPage";
import AdminAllVendorsPage from "./pages/admin/AdminAllVendorsPage";
import AdminAllCustomersPage from "./pages/admin/AdminAllCustomersPage";
import AdminTransactionsPage from "./pages/admin/AdminTransactionsPage";
import AdminWalletPage from "./pages/admin/AdminWalletPage";
import AdminVendorApprovalsPage from "./pages/admin/AdminVendorApprovalsPage";

import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminManualCommissionsPage from "./pages/admin/AdminManualCommissionsPage";
import AdminLicenseManagementPage from "./pages/admin/AdminLicenseManagementPage";
import AdminSubscriptionPlansPage from "./pages/admin/AdminSubscriptionPlansPage";
import AdminIntegrationsPage from "./pages/admin/AdminIntegrationsPage";
import AdminHelpSupportPage from "./pages/admin/AdminHelpSupportPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClientProvider>
          <CartProvider>
            <Routes>
          {/* Multi-Client Routes - Support /clientname/marketplace pattern */}
          {/* Client-specific marketplace routes - INVITE-ONLY REGISTRATION */}
          <Route path="/:clientSlug/marketplace" element={<CustomerBrowseServicesPage />} />
          <Route path="/:clientSlug/marketplace/login" element={<CustomerLogin />} />
          <Route path="/:clientSlug/marketplace/signup" element={<CustomerSignup />} />
          <Route path="/:clientSlug/marketplace/register" element={<CustomerSignup />} />
          <Route path="/:clientSlug/marketplace/invite/customer" element={<CustomerSignup />} />
          <Route path="/:clientSlug/login/oauth" element={<OAuthCallback />} />
          <Route path="/:clientSlug/marketplace/invite/vendor" element={<VendorSignup />} />
          <Route path="/:clientSlug/marketplace/categories" element={<CategoriesPage />} />
          <Route path="/:clientSlug/marketplace/services" element={<AllServicesPage />} />
          <Route path="/:clientSlug/marketplace/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/:clientSlug/marketplace/checkout/:serviceName" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/orders" element={<ProtectedRoute><CustomerOrdersPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/requests" element={<ProtectedRoute><ServiceRequestsPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/requests/:requestId" element={<ProtectedRoute><ServiceRequestDetailsPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/request-service/:id" element={<ProtectedRoute><RequestServicePage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/request-submitted" element={<ProtectedRoute><PlaceholderPage title="Request Submitted" description="Your service request has been submitted successfully! We'll match you with qualified professionals soon." /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/chat/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/:clientSlug/marketplace/map" element={<ProtectedRoute><PlaceholderPage title="Service Map" description="Interactive map view coming soon." /></ProtectedRoute>} />

          {/* Client-specific vendor routes - INVITE-ONLY */}
          <Route path="/:clientSlug/vendor/login" element={<VendorLogin />} />
          <Route path="/:clientSlug/vendor/signup" element={<VendorSignup />} />
          <Route path="/:clientSlug/vendor/register" element={<VendorSignup />} />
          <Route path="/:clientSlug/vendor/invite" element={<VendorSignup />} />

          {/* Default route - Show client selection or redirect */}
          <Route path="/" element={<Navigate to="/select-client" replace />} />

          {/* Client selection page for users without client context */}
          <Route path="/select-client" element={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Access Required
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please access the marketplace through your client's specific link.
                </p>
                <p className="mt-4 text-xs text-gray-500">
                  Contact your service provider for the correct marketplace URL.
                </p>
              </div>
            </div>
          </div>} />

          {/* Legacy routes - DISABLED for multi-client */}
          <Route path="/signup" element={<Navigate to="/select-client" replace />} />
          <Route path="/login" element={<Navigate to="/select-client" replace />} />
          <Route path="/onboarding-client" element={<OnboardingClient />} />
          <Route path="/onboarding-vendor" element={<Navigate to="/select-client" replace />} />

          {/* Customer Authentication Routes */}
          <Route path="/marketplace/login" element={<CustomerLogin />} />
          <Route path="/marketplace/signup" element={<CustomerSignup />} />
          <Route path="/marketplace/register" element={<CustomerSignup />} />
          <Route path="/login/oauth" element={<OAuthCallback />} />

          {/* Register route for referral links */}
          <Route path="/register" element={<CustomerSignup />} />

          {/* Vendor Authentication Routes */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/signup" element={<VendorSignup />} />
          <Route path="/vendor/register" element={<VendorSignup />} />

          {/* Client Authentication Routes */}
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/signup" element={<ClientSignup />} />

          {/* Admin Authentication Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public Marketplace Routes - No authentication required for browsing */}
          <Route path="/marketplace" element={<CustomerBrowseServicesPage />} />
          <Route path="/marketplace/login" element={<CustomerLogin />} />
          <Route path="/marketplace/register" element={<CustomerSignup />} />
          <Route path="/marketplace/signup" element={<CustomerSignup />} />
          <Route path="/marketplace/categories" element={<CategoriesPage />} />
          <Route path="/marketplace/services" element={<AllServicesPage />} />
          <Route path="/marketplace/services/:id" element={<ServiceDetailsPage />} />

          {/* Protected Marketplace Routes - Authentication required for actions */}
          <Route path="/marketplace/checkout/:serviceName" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/marketplace/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
          <Route path="/marketplace/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/marketplace/cart/checkout" element={<ProtectedRoute><CartCheckoutPage /></ProtectedRoute>} />
          <Route path="/marketplace/cart/payment-success" element={<ProtectedRoute><CartPaymentSuccessPage /></ProtectedRoute>} />
          <Route path="/marketplace/orders" element={<ProtectedRoute><CustomerOrdersPage /></ProtectedRoute>} />
          <Route path="/marketplace/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/marketplace/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
          <Route path="/marketplace/requests" element={<ProtectedRoute><ServiceRequestsPage /></ProtectedRoute>} />
          <Route path="/marketplace/requests/:requestId" element={<ProtectedRoute><ServiceRequestDetailsPage /></ProtectedRoute>} />
          <Route path="/marketplace/request-service/:id" element={<ProtectedRoute><RequestServicePage /></ProtectedRoute>} />
          <Route path="/marketplace/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/marketplace/request-submitted" element={<ProtectedRoute><PlaceholderPage title="Request Submitted" description="Your service request has been submitted successfully! We'll match you with qualified professionals soon." /></ProtectedRoute>} />
          <Route path="/marketplace/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/marketplace/chat/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/marketplace/map" element={<ProtectedRoute><PlaceholderPage title="Service Map" description="Interactive map view coming soon." /></ProtectedRoute>} />

          {/* Nested routes for Customer Dashboard */}
          <Route path="/customer-portal" element={<CustomerDashboard />}>
            <Route index element={<Navigate to="/marketplace" replace />} />
            <Route path="orders" element={<CustomerOrdersPage />} />
            <Route path="account" element={<CustomerAccountPage />} />
          </Route>

          {/* Nested routes for Client Dashboard */}
          <Route path="/client-portal" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ClientOverviewPage />} />
            <Route path="tasks" element={<ClientTasksPage />} />
            <Route path="reports" element={<ClientReportsPage />} />
            <Route path="vendors" element={<ClientVendorManagementPage />} />
            <Route path="customers" element={<ClientCustomersPage />} />
            <Route path="invites" element={<ClientInviteSystemPage />} />
            <Route path="subscription" element={<ClientSubscriptionPage />} />
            <Route path="pricing" element={<ClientPricingBillingPage />} />
            <Route path="wallet" element={<ClientWalletPage />} />
            <Route path="notifications" element={<ClientNotificationsPage />} />
            <Route path="help" element={<ClientHelpSupportPage />} />
            <Route path="rules" element={<ClientRevenueRulesPage />} />
            <Route path="branding" element={<ClientBrandingPage />} />
            <Route path="categories" element={<ClientCategoriesPage />} /> {/* New route */}
            <Route path="orders" element={<ClientMarketplaceOrdersPage />} /> {/* New route */}
          </Route>

          {/* Nested routes for Vendor Dashboard */}
          <Route path="/vendor-portal" element={<VendorProtectedRoute><VendorDashboard /></VendorProtectedRoute>}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<VendorProfilePage />} />
            <Route path="services" element={<VendorServicesPage />} />
            <Route path="service-tiers" element={<VendorServiceTiersPage />} />
            <Route path="requests" element={<VendorRequestsPage />} />
            <Route path="orders" element={<VendorOrdersPage />} />
            <Route path="messages" element={<VendorMessagesPage />} />
            <Route path="messages/:customerId" element={<VendorMessagesPage />} />
            <Route path="customers" element={<VendorCustomersPage />} />
            <Route path="subscription" element={<VendorSubscriptionPage />} />
            <Route path="wallet" element={<VendorWalletPage />} />
            <Route path="notifications" element={<VendorNotificationsPage />} />
            <Route path="account" element={<VendorAccountPage />} />
            <Route path="help" element={<VendorHelpSupportPage />} />
            <Route path="referrals" element={<VendorReferralsPage />} />
            <Route path="referrals/full-report" element={<VendorFullReferralReportPage />} />
            <Route path="invite" element={<VendorInvitePage />} />
          </Route>

          {/* Nested routes for Admin Portal */}
          <Route path="/admin-portal" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminDashboardOverviewPage />} />
            <Route path="tasks" element={<AdminTasksPage />} />
            <Route path="clients" element={<AdminAllClientsPage />} />
            <Route path="vendors" element={<AdminAllVendorsPage />} />
            <Route path="customers" element={<AdminAllCustomersPage />} />
            <Route path="transactions" element={<AdminTransactionsPage />} />
            <Route path="wallet" element={<AdminWalletPage />} />
            <Route path="vendor-approvals" element={<AdminVendorApprovalsPage />} />

            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="manual-commissions" element={<AdminManualCommissionsPage />} />
            <Route path="license-management" element={<AdminLicenseManagementPage />} />
            <Route path="subscription-plans" element={<AdminSubscriptionPlansPage />} />
            <Route path="integrations" element={<AdminIntegrationsPage />} />
            <Route path="help" element={<AdminHelpSupportPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </ClientProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;