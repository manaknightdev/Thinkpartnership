import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { LogOut, LayoutDashboard, DollarSign, Users, Settings, BarChart, PlusCircle, Key, Crown, Code } from "lucide-react"; // Added Crown, Code icons
import { toast } from "sonner";

const AdminDashboard = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard Overview", path: "/admin-portal/overview", icon: LayoutDashboard },
    { name: "All Transactions", path: "/admin-portal/transactions", icon: DollarSign },
    { name: "Vendor Approvals", path: "/admin-portal/vendor-approvals", icon: Users },
    { name: "Global Revenue Rules", path: "/admin-portal/revenue-rules", icon: Settings },
    { name: "Usage Reports", path: "/admin-portal/reports", icon: BarChart },
    { name: "Manual Commissions", path: "/admin-portal/manual-commissions", icon: PlusCircle },
    { name: "License Management", path: "/admin-portal/license-management", icon: Key },
    { name: "Subscription Plans", path: "/admin-portal/subscription-plans", icon: Crown }, // New nav item
    { name: "Integrations", path: "/admin-portal/integrations", icon: Code }, // New nav item
  ];

  const handleLogout = () => {
    toast.info("Logging out from Admin Portal...");
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GlobalNavbar />
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-full md:w-64 border-b md:border-r bg-white dark:bg-gray-900 p-4 flex-col">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Admin Menu</h2>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "justify-start",
                  location.pathname.startsWith(item.path) && "bg-muted dark:bg-gray-800" // Highlight active link
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h2>
          {/* No MobileSheet trigger here */}
        </div>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;