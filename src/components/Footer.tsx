import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="col-span-1 sm:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4">RealPartnersOS</h3>
          <p className="text-gray-400 text-sm">
            Your ultimate referral ecosystem for seamless connections, managed programs, and new revenue streams.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition-colors text-sm">Home</Link></li>
            <li><Link to="/client-portal" className="hover:text-white transition-colors text-sm">Clients</Link></li>
            <li><Link to="/vendor-portal" className="hover:text-white transition-colors text-sm">Vendors</Link></li>
            <li><Link to="/customer-portal" className="hover:text-white transition-colors text-sm">Customers</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors text-sm">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors text-sm">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} RealPartnersOS. All rights reserved.
      </div>
    </footer>
  );
};