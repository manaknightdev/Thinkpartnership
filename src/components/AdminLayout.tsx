import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PortalQuickNavFooter } from '@/components/PortalQuickNavFooter';
import {
  Menu,
  LayoutDashboard,
  DollarSign,
  Users,
  Settings,
  BarChart,
  PlusCircle,
  Key,
  Crown,
  Code,
  User,
  ChevronDown,
  LogOut,
  Shield,
  Wallet,
  HelpCircle,
  Building,
  UserCheck,
  CheckSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Collapsed by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userName = "Admin User"; // This would come from auth context

  const sidebarItems = [
    { name: "Dashboard Overview", path: "/admin-portal/overview", icon: LayoutDashboard, exact: false },
    { name: "Admin Profile", path: "/admin-portal/profile", icon: User, exact: false },
    // { name: "Tasks & Follow-ups", path: "/admin-portal/tasks", icon: CheckSquare, exact: false },
    { name: "Client", path: "/admin-portal/clients", icon: Building, exact: false },
    { name: "All Vendors", path: "/admin-portal/vendors", icon: Users, exact: false },
    { name: "All Customers", path: "/admin-portal/customers", icon: UserCheck, exact: false },
    { name: "All Transactions", path: "/admin-portal/transactions", icon: DollarSign, exact: false },
    { name: "Wallet & Payments", path: "/admin-portal/wallet", icon: Wallet, exact: false },
    // { name: "Vendor Approvals", path: "/admin-portal/vendor-approvals", icon: Shield, exact: false },

    // { name: "Usage Reports", path: "/admin-portal/reports", icon: BarChart, exact: false },
    // { name: "Manual Commissions", path: "/admin-portal/manual-commissions", icon: PlusCircle, exact: false },
    // { name: "License Management", path: "/admin-portal/license-management", icon: Key, exact: false },
    // { name: "Subscription Plans", path: "/admin-portal/subscription-plans", icon: Crown, exact: false },
    // { name: "Integrations", path: "/admin-portal/integrations", icon: Code, exact: false },
    // { name: "Help & Support", path: "/admin-portal/help", icon: HelpCircle, exact: false },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    toast.info("Logging out from Admin Portal...");
    // Clear admin auth data
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user_data');
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
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
                sidebarCollapsed ? "bg-purple-50 text-purple-700 border border-purple-200" : ""
              )}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Menu</span>}
              {sidebarCollapsed && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
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
            <Link to="/admin-portal" className="text-xl font-bold text-purple-600">
              Admin Portal
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{userName}</span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Platform Administrator</p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/admin-portal/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Admin Profile
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => navigate('/admin-portal/tasks')}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Tasks & Follow-ups
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem onClick={() => navigate('/admin-portal/reports')}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Usage Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin-portal/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem> */}
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
                    ? "bg-purple-100 text-purple-700 shadow-sm border border-purple-200"
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
                        ? "bg-purple-100 text-purple-700"
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
          <div className="p-6">
            {children}
          </div>

         
        </main>
      </div>
    </div>
  );
};
