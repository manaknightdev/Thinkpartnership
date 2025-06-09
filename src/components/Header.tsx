import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b p-4 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-900">
      <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
        ThinkPartnerships
      </Link>
      <nav className="flex flex-wrap justify-center sm:justify-end gap-2 sm:space-x-4">
        <Button variant="ghost" asChild>
          <Link to="/client-portal">Clients</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/vendor-portal">Vendors</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/customer-portal">Customers</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
      </nav>
    </header>
  );
};