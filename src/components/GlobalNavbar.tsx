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
        ThinkPartnerships
      </Link>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="flex space-x-4">
          {mainNavItems.map((item) => (
            <NavigationMenuItem key={item.path}>
              <Link to={item.path} legacyBehavior> {/* Removed passHref */}
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    location.pathname.startsWith(item.path) && "bg-primary/10 font-semibold" // Highlight active link
                  )}
                >
                  {item.name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <MobileSheet title="ThinkPartnerships"> {/* Pass logo text as title */}
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
        </nav>
      </MobileSheet>
    </header>
  );
};