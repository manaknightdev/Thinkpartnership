import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OnboardingVendor = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Vendor Onboarding</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        This page will guide referral partners (vendors) through listing their services, setting up their profile,
        and understanding how to invite customers and earn commissions.
      </p>
      <Button asChild>
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default OnboardingVendor;