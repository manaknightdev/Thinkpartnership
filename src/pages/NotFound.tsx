import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GlobalNavbar } from "@/components/GlobalNavbar"; // Import GlobalNavbar
import { Footer } from "@/components/Footer"; // Import Footer

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      <GlobalNavbar /> {/* Add GlobalNavbar */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Oops! Page not found</p>
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default NotFound;