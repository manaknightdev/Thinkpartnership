import { Link } from "react-router-dom";
import { Building, Users, ShoppingCart, Shield } from "lucide-react";

export const PortalQuickNavFooter = () => {
  return (
    <footer className="mt-8 bg-gray-100 border-t border-gray-200">
      <div className="flex items-center justify-center py-4 px-4">
        <div className="flex items-center space-x-6">
          <Link
            to="/marketplace"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Marketplace</span>
          </Link>
          
          <Link
            to="/client-portal"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
          >
            <Building className="h-4 w-4" />
            <span>Client Portal</span>
          </Link>
          
          <Link
            to="/vendor-portal"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            <span>Vendor Portal</span>
          </Link>
          
          <Link
            to="/admin-portal"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
          >
            <Shield className="h-4 w-4" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
