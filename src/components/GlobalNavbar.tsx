import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { MobileSheet } from "./MobileSheet"; // New import
import { LogOut } from "lucide-react"; // For logout button in mobile menu

export const GlobalNavbar = () => {
  return (
    <header className="border-b p-4 flex justify-between items-center bg-white dark:bg-gray-900">
      <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
        ThinkPartnerships
      </Link>

      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex"> {/* Hidden on mobile, flex on desktop */}
        <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>
            <Link to="/client-portal" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Clients
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/vendor-portal" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Vendors
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/customer-portal" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Customers
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/login" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Login
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <MobileSheet title="Navigation">
        <nav className="flex flex-col space-y-2">
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/client-portal">Clients</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/vendor-portal">Vendors</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/customer-portal">Customers</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="justify-start">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </nav>
      </MobileSheet>
    </header>
  );
};