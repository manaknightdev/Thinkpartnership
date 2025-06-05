import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b p-4 flex justify-between items-center bg-white dark:bg-gray-900">
      <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
        ThinkPartnerships
      </Link>
      <nav className="space-x-4">
        <Button variant="ghost" asChild>
          <Link to="/client-portal">Clients</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/vendor-portal">Vendors</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/customer-portal">Customers</Link>
        </Button>
        <Button>Sign Up</Button>
      </nav>
    </header>
  );
};