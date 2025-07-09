import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PortalQuickNavFooter } from "@/components/PortalQuickNavFooter";
import UserAPI, { UserProfile } from "@/services/UserAPI";
import NotificationsAPI from "@/services/NotificationsAPI";
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
  MessageCircle
} from "lucide-react";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
}

export const MarketplaceLayout = ({ children }: MarketplaceLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Collapsed by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [requestCount, setRequestCount] = useState(2);
  const [notificationCount, setNotificationCount] = useState(0);

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch user profile and notification count
  useEffect(() => {
    const fetchUserData = async () => {
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
  }, []);

  // Get display name
  const getDisplayName = () => {
    if (!userProfile) return 'User';
    const firstName = userProfile.first_name || '';
    const lastName = userProfile.last_name || '';
    return firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'User';
  };

  // Get first name for header
  const getFirstName = () => {
    if (!userProfile) return 'User';
    return userProfile.first_name || 'User';
  };

  const sidebarItems = [
    { name: "Browse", path: "/marketplace", icon: Home, exact: true },
    // { name: "Categories", path: "/marketplace/categories", icon: Grid3X3 },
    { name: "All Services", path: "/marketplace/services", icon: List },
    { name: "Service Requests", path: "/marketplace/requests", icon: FileText },
    { name: "Messages", path: "/marketplace/chat/Certified%20Inspectors%20Inc.", icon: MessageCircle },
    { name: "Account", path: "/marketplace/account", icon: Settings },
    { name: "Help", path: "/marketplace/help", icon: HelpCircle },
  ];

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
    // In a real app, this would clear auth tokens and redirect
    console.log('Logging out...');
    navigate('/');
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

            {/* Logo */}
            <Link to="/marketplace" className="text-xl font-bold text-green-600">
              RealPartnersOS
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

            {/* Notifications */}
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



            {/* User Menu */}
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
                    {profileLoading ? 'Loading...' : getFirstName()}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {profileLoading ? 'Loading...' : getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profileLoading ? 'Loading...' : userProfile?.email || 'No email'}
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
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("flex-shrink-0", sidebarCollapsed ? "h-5 w-5" : "h-5 w-5")} />
                {!sidebarCollapsed && <span>{item.name}</span>}

                {/* Badge for Service Requests */}
                {item.name === "Service Requests" && requestCount > 0 && (
                  <Badge className={cn(
                    "h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center p-0",
                    sidebarCollapsed ? "absolute -top-1 -right-1" : "ml-auto"
                  )}>
                    {requestCount}
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

                    {/* Badge for Service Requests */}
                    {item.name === "Service Requests" && requestCount > 0 && (
                      <Badge className="ml-auto h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center p-0">
                        {requestCount}
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
