import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { cn } from "@/lib/utils";
import { LogOut, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { toast } from "sonner";
// MobileSheet import is no longer needed here

const CustomerDashboard = () => {
  const location = useLocation();

  const navItems = [
    { name: "Browse Services", path: "/marketplace/services", icon: LayoutGrid },
    { name: "My Orders", path: "/customer-portal/orders", icon: ShoppingBag },
    { name: "Account Settings", path: "/customer-portal/account", icon: User },
  ];

  const handleLogout = () => {
    toast.info("Logging out...");
    // Clear customer auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setTimeout(() => {
      window.location.href = "/marketplace/login";
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GlobalNavbar />
      <div className="flex flex-grow">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-16 z-10 w-64 h-[calc(100vh-4rem)] border-r bg-white dark:bg-gray-900 p-4 flex-col overflow-hidden">
          {/* <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Customer Menu</h2> */}
          <nav className="flex flex-col space-y-2 flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "justify-start",
                  location.pathname === item.path && "bg-muted dark:bg-gray-800" // Highlight active link
                )}
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t dark:border-gray-700 space-y-2">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Dashboard Title (no mobile sidebar here) */}
        <div className="md:hidden p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Customer Dashboard</h2>
          {/* No MobileSheet trigger here */}
        </div>

        {/* Main Content Area */}
        <main className="flex-grow md:ml-64 pt-16 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;