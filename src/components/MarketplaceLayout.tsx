import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PortalQuickNavFooter } from "@/components/PortalQuickNavFooter";
import UserAPI, { UserProfile } from "@/services/UserAPI";
import NotificationsAPI from "@/services/NotificationsAPI";
import { useAuth } from "@/hooks/useAuth";
import { useClient } from "@/contexts/ClientContext";
import MarketplaceAuthAPI from "@/services/MarketplaceAuthAPI";
import {
  Search,
  FileText,
  Bell,
  User,
  Menu,
  Home,
  Grid3X3,
  Settings,
  HelpCircle,
  List,
  LogOut,
  ChevronDown,
  MessageCircle,
  UserPlus,
  LogIn
} from "lucide-react";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
}

export const MarketplaceLayout = ({ children }: MarketplaceLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Collapsed by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);


  // Use the auth hook
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();

  // Use client context to get client name
  const { client } = useClient();

  // User profile state (for additional profile data if needed)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch user profile and notification count only when authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);

        // Fetch user profile
        const profileResponse = await UserAPI.getProfile();
        if (!profileResponse.error) {
          setUserProfile(profileResponse.user);
        }

        // Fetch notification count
        const notificationResponse = await NotificationsAPI.getUnreadCount();
        if (!notificationResponse.error) {
          setNotificationCount(notificationResponse.count);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'User';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'User';
  };

  // Get first name for header
  const getFirstName = () => {
    if (!user) return 'User';
    return user.first_name || 'User';
  };

  // Get marketplace name - show client name if authenticated, otherwise default
  const getMarketplaceName = () => {
    // First try to get from MarketplaceAuthAPI (has client_name)
    const marketplaceUserData = MarketplaceAuthAPI.getUserData();
    if (isAuthenticated && marketplaceUserData && marketplaceUserData.client_name) {
      return marketplaceUserData.client_name;
    }

    // Fallback to regular user data
    if (isAuthenticated && user && user.client_name) {
      return user.client_name;
    }

    // Fallback to client context
    if (client && client.company_name) {
      return client.company_name;
    }

    return 'RealPartnersOS';
  };

  // Define sidebar items based on authentication status
  const publicSidebarItems = [
    { name: "Browse", path: "/marketplace", icon: Home, exact: true },
    { name: "All Services", path: "/marketplace/services", icon: List },
  ];

  const authenticatedSidebarItems = [
    { name: "Browse", path: "/marketplace", icon: Home, exact: true },
    { name: "All Services", path: "/marketplace/services", icon: List },
    { name: "My Orders", path: "/marketplace/orders", icon: FileText },
    { name: "Messages", path: "/marketplace/messages", icon: MessageCircle },
    { name: "Account", path: "/marketplace/account", icon: Settings },
    { name: "Help", path: "/marketplace/help", icon: HelpCircle },
  ];

  const sidebarItems = isAuthenticated ? authenticatedSidebarItems : publicSidebarItems;

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      navigate(`/marketplace/services?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleNotificationClick = () => {
    navigate('/marketplace/notifications');
  };





  const handleLogout = () => {
    logout();
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Marketplace Header */}
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
                sidebarCollapsed ? "bg-green-50 text-green-700 border border-green-200" : ""
              )}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Menu</span>}
              {sidebarCollapsed && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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

            {/* Logo - Show client name when authenticated */}
            <Link to="/marketplace" className="text-xl font-bold text-green-600">
              {getMarketplaceName()}
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search for services..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => navigate('/marketplace/services')}
            >
              <Search className="h-5 w-5" />
            </Button>

            {authLoading ? (
              <>
                {/* Loading state - show skeleton buttons */}
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </>
            ) : isAuthenticated ? (
              <>
                {/* Notifications - Only show when authenticated */}
                <Button
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
                </Button>
              </>
            ) : (
              <>
                {/* Login/Signup buttons for unauthenticated users */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/marketplace/login')}
                  className="text-gray-700 hover:text-green-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Log In</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/marketplace/signup')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </>
            )}

            {!authLoading && isAuthenticated && (
              <>


                {/* User Menu - Only show when authenticated */}
                <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  {userProfile?.photo ? (
                    <img
                      src={userProfile.photo}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium">
                    {authLoading ? 'Loading...' : getFirstName()}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {authLoading ? 'Loading...' : getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {authLoading ? 'Loading...' : user?.email || 'No email'}
                  </p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/marketplace/account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/marketplace/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
              </>
            )}
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
                    ? "bg-green-100 text-green-700 shadow-sm border border-green-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                )}

              >
                <item.icon className={cn("flex-shrink-0", sidebarCollapsed ? "h-5 w-5" : "h-5 w-5")} />
                {!sidebarCollapsed && <span>{item.name}</span>}

                {/* Badge for My Orders */}
                {item.name === "My Orders" && orderCount > 0 && (
                  <Badge className={cn(
                    "h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center p-0",
                    sidebarCollapsed ? "absolute -top-1 -right-1" : "ml-auto"
                  )}>
                    {orderCount}
                  </Badge>
                )}

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
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
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>

                    {/* Badge for My Orders */}
                    {item.name === "My Orders" && orderCount > 0 && (
                      <Badge className="ml-auto h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center p-0">
                        {orderCount}
                      </Badge>
                    )}
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
