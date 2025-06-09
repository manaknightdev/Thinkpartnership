import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { LogOut, LayoutGrid, ShoppingBag, User } from "lucide-react"; // Import new icons
import { toast } from "sonner";

const CustomerDashboard = () => {
  const location = useLocation();

  const navItems = [
    { name: "Browse Services", path: "/customer-portal/browse", icon: LayoutGrid },
    { name: "My Orders", path: "/customer-portal/orders", icon: ShoppingBag },
    { name: "Account Settings", path: "/customer-portal/account", icon: User },
  ];

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white dark:bg-gray-900 p-4 flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Customer Menu</h2>
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

        {/* Main Content Area */}
        <main className="flex-grow">
          <Outlet /> {/* This is where nested route components will render */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;