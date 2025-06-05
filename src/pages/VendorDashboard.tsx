import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils"; // Import cn utility for conditional classes
import { Footer } from "@/components/Footer"; // Import Footer

const VendorDashboard = () => {
  const location = useLocation();

  const navItems = [
    { name: "Profile Setup", path: "/vendor-portal/profile" },
    { name: "Referral Dashboard", path: "/vendor-portal/referrals" },
    { name: "Invite System", path: "/vendor-portal/invite" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white dark:bg-gray-900 p-4 flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Vendor Menu</h2>
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
          <div className="mt-auto pt-4 border-t dark:border-gray-700">
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Outlet /> {/* This is where nested route components will render */}
        </main>
      </div>
      <Footer /> {/* Add Footer here */}
    </div>
  );
};

export default VendorDashboard;