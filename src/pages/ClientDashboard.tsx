import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { MobileSheet } from "@/components/MobileSheet"; // Import MobileSheet

const ClientDashboard = () => {
  const location = useLocation();

  const navItems = [
    { name: "Overview", path: "/client-portal/overview" },
    { name: "Reports", path: "/client-portal/reports" },
    { name: "Manage Vendors", path: "/client-portal/vendors" },
    { name: "Set Rules", path: "/client-portal/rules" },
  ];

  const handleLogout = () => {
    toast.info("Logging out...");
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Client Menu</h2>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "justify-start",
                  location.pathname === item.path && "bg-muted dark:bg-gray-800"
                )}
                asChild
              >
                <Link to={item.path}>{item.name}</Link>
              </Button>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t dark:border-gray-700 space-y-2">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Sidebar Trigger and Content */}
        <div className="md:hidden p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Client Dashboard</h2>
          <MobileSheet title="Client Menu">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "justify-start",
                    location.pathname === item.path && "bg-muted dark:bg-gray-800"
                  )}
                  asChild
                >
                  <Link to={item.path}>{item.name}</Link>
                </Button>
              ))}
            </nav>
            <div className="mt-auto pt-4 border-t dark:border-gray-700 space-y-2">
              <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </MobileSheet>
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

export default ClientDashboard;