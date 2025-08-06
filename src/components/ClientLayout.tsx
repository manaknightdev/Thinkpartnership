import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PortalQuickNavFooter } from "@/components/PortalQuickNavFooter";
import { useBranding } from "@/contexts/BrandingContext";
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  BarChart,
  Users,
  Palette,
  ListOrdered,
  ChevronDown,
  HelpCircle,
  Building,
  Crown,
  UserPlus,
  DollarSign,
  Wallet,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import ClientAPI from "@/services/ClientAPI";

// Helper function to convert relative URLs to full URLs
const getFullImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Already a full URL
  }
  if (url.startsWith('/uploads/')) {
    // Use local development server for development, production server for production
    const baseUrl = import.meta.env.DEV
      ? 'http://localhost:5172'
      : 'https://baas.mytechpassport.com';
    return `${baseUrl}${url}`;
  }
  return url;
};

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Collapsed by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);
  const { branding } = useBranding();
  const [isAdminImpersonation, setIsAdminImpersonation] = useState(false);
  const [isReturningToAdmin, setIsReturningToAdmin] = useState(false);

  const companyName = branding?.company_name || "Client Portal";
  const logoUrl = branding?.logo_url ? getFullImageUrl(branding.logo_url) : '';

  // Check if this is an admin impersonation session
  useEffect(() => {
    setIsAdminImpersonation(ClientAPI.isAdminImpersonation());
  }, []);

  const sidebarItems = [
    { name: "Overview", path: "/client-portal/overview", icon: LayoutDashboard, exact: false },
    // { name: "Tasks & Follow-ups", path: "/client-portal/tasks", icon: CheckSquare, exact: false },
    { name: "Reports", path: "/client-portal/reports", icon: BarChart, exact: false },
    { name: "Marketplace Orders", path: "/client-portal/orders", icon: ListOrdered, exact: false },
    { name: "Manage Vendors", path: "/client-portal/vendors", icon: Users, exact: false },
    { name: "All Customers", path: "/client-portal/customers", icon: User, exact: false },
    { name: "Invite System", path: "/client-portal/invites", icon: UserPlus, exact: false },
    // { name: "Platform Subscription", path: "/client-portal/subscription", icon: Crown, exact: false },
    // { name: "Pricing & Billing", path: "/client-portal/pricing", icon: DollarSign, exact: false },
    { name: "Wallet & Payments", path: "/client-portal/wallet", icon: Wallet, exact: false },
    // { name: "Set Rules", path: "/client-portal/rules", icon: Settings, exact: false },
    { name: "Branding", path: "/client-portal/branding", icon: Palette, exact: false },
    
    { name: "Help & Support", path: "/client-portal/help", icon: HelpCircle, exact: false },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNotificationClick = () => {
    navigate('/client-portal/notifications');
  };

  const handleLogout = () => {
    toast.info("Logging out...");
    // Clear client auth data
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_id');
    localStorage.removeItem('client_user');
    setTimeout(() => {
      window.location.href = "/client/login";
    }, 500);
  };

  const handleReturnToAdmin = async () => {
    if (!isAdminImpersonation) return;

    setIsReturningToAdmin(true);
    toast.info("Returning to admin portal...");

    try {
      await ClientAPI.returnToAdminPortal();
      // The returnToAdminPortal method handles the redirect
    } catch (error: any) {
      console.error('Error returning to admin portal:', error);
      toast.error(error.message || 'Failed to return to admin portal');
      setIsReturningToAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Client Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "hidden md:flex items-center gap-2 hover:bg-gray-100 transition-all duration-200 rounded-lg px-3 py-2",
                sidebarCollapsed ? "bg-primary/10 text-primary border border-primary/20" : ""
              )}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Menu</span>}
              {sidebarCollapsed && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link to="/client-portal" className="text-xl font-bold text-primary">
                {companyName}
              </Link>
              {isAdminImpersonation && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                  Admin View
                </Badge>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            {/* <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={handleNotificationClick}
              title="View notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {notificationCount}
                </Badge>
              )}
            </Button> */}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100">
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-medium">{companyName}</span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{companyName}</p>
                  <p className="text-xs text-gray-500">Client Portal Admin</p>
                </div>
                {/* <DropdownMenuItem onClick={() => navigate('/client-portal/tasks')}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Tasks & Follow-ups
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => navigate('/client-portal/vendors')}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Vendors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/client-portal/invites')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite System
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => navigate('/client-portal/reports')}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Reports & Analytics
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => navigate('/client-portal/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isAdminImpersonation && (
                  <>
                    <DropdownMenuItem
                      onClick={handleReturnToAdmin}
                      disabled={isReturningToAdmin}
                      className="text-blue-600 focus:text-blue-600"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {isReturningToAdmin ? 'Returning...' : 'Return to Admin Portal'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "hidden md:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 flex-col",
          sidebarCollapsed
            ? "w-16 border-gray-200 shadow-md"
            : "w-64 border-gray-200 shadow-lg"
        )}>
          <nav className={cn("flex-1 space-y-2", sidebarCollapsed ? "p-2" : "p-4")}>
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200 relative group",
                  sidebarCollapsed ? "px-2 py-3 justify-center mx-1" : "px-3 py-2 space-x-3",
                  isActive(item.path, item.exact)
                    ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("h-5 w-5", sidebarCollapsed ? "mx-auto" : "")} />
                {!sidebarCollapsed && <span>{item.name}</span>}

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.path, item.exact)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}>
          {children}

     
        </main>
      </div>
    </div>
  );
};
