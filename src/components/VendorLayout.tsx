import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PortalQuickNavFooter } from "@/components/PortalQuickNavFooter";
import VendorAuthAPI, { VendorProfile } from "@/services/VendorAuthAPI";
import {
  Menu,
  Bell,
  User,
  LogOut,
  Building,
  DollarSign,
  Mail,
  Crown,
  List,
  MessageCircle,
  FileText,
  ChevronDown,
  HelpCircle,
  Wallet,
  Package,
} from "lucide-react";
import { toast } from "sonner";

interface VendorLayoutProps {
  children: React.ReactNode;
}

export const VendorLayout = ({ children }: VendorLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Collapsed by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(2);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile['vendor'] | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load vendor profile on component mount
  useEffect(() => {
    const loadVendorProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await VendorAuthAPI.getProfile();

        if (!response.error && response.vendor) {
          setVendorProfile(response.vendor);
        } else {
          console.error('Failed to load vendor profile:', response.message);
          // If profile fails to load, redirect to login
          navigate('/vendor/login');
        }
      } catch (error) {
        console.error('Error loading vendor profile:', error);
        navigate('/vendor/login');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadVendorProfile();
  }, [navigate]);

  const sidebarItems = [
    { name: "Profile Setup", path: "/vendor-portal/profile", icon: Building, exact: false },
    { name: "Flat fee Services", path: "/vendor-portal/services", icon: List, exact: false },
    // { name: "Custom Services", path: "/vendor-portal/service-tiers", icon: Package, exact: false },
    { name: "Orders", path: "/vendor-portal/orders", icon: FileText, exact: false },
    { name: "Messages", path: "/vendor-portal/messages", icon: MessageCircle, exact: false },
    { name: "My Customers", path: "/vendor-portal/customers", icon: User, exact: false },
    // { name: "Featured Placement", path: "/vendor-portal/featured", icon: Crown, exact: false },
    { name: "Wallet", path: "/vendor-portal/wallet", icon: Wallet, exact: false },
    { name: "Referral Dashboard", path: "/vendor-portal/referrals", icon: DollarSign, exact: false },
    { name: "Invite System", path: "/vendor-portal/invite", icon: Mail, exact: false },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNotificationClick = () => {
    navigate('/vendor-portal/notifications');
  };

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      VendorAuthAPI.logout();
    }, 500);
  };

  // Show loading state while profile is being loaded
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
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
                sidebarCollapsed ? "bg-blue-50 text-blue-700 border border-blue-200" : ""
              )}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Menu</span>}
              {sidebarCollapsed && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
            <Link to="/vendor-portal" className="text-xl font-bold text-blue-600">
              Vendor Portal
            </Link>
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
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {isLoadingProfile ? "Loading..." : (vendorProfile?.business_name || "Vendor")}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {isLoadingProfile ? "Loading..." : (vendorProfile?.business_name || "Vendor")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isLoadingProfile ? "Loading..." : (vendorProfile?.email || "vendor@example.com")}
                  </p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/vendor-portal/profile')}>
                  <Building className="mr-2 h-4 w-4" />
                  Company Profile
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => navigate('/vendor-portal/account')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem onClick={() => navigate('/vendor-portal/subscription')}>
                  <Crown className="mr-2 h-4 w-4" />
                  Subscription
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem onClick={() => navigate('/vendor-portal/notifications')}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/vendor-portal/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
                    ? "bg-blue-100 text-blue-700 shadow-sm border border-blue-200"
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
                        ? "bg-blue-100 text-blue-700"
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
