import { Link, useLocation } from "react-router-dom"; // Import useLocation
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { MobileSheet } from "./MobileSheet";
import { cn } from "@/lib/utils"; // Import cn utility

export const GlobalNavbar = () => {
  const location = useLocation(); // Get current location

  // Define main navigation items
  const mainNavItems = [
    { name: "Clients", path: "/client-portal" },
    { name: "Vendors", path: "/vendor-portal" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Admin", path: "/admin-portal" }, // New Admin link
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b p-4 flex justify-between items-center bg-white dark:bg-gray-900">
      <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
        RealPartnersOS
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    location.pathname.startsWith(item.path) && "bg-primary/10 font-semibold" // Highlight active link
                  )}
                  asChild
                >
                  <Link to={item.path}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileSheet title="RealPartnersOS"> {/* Pass logo text as title */}
        <nav className="flex flex-col space-y-2">
          {mainNavItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "justify-start",
                location.pathname.startsWith(item.path) && "bg-muted dark:bg-gray-800" // Highlight active link
              )}
              asChild
            >
              <Link to={item.path}>{item.name}</Link>
            </Button>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <Button variant="ghost" className="w-full justify-start mb-2" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </MobileSheet>
    </header>
  );
};