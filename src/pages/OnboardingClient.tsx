import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OnboardingClient = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Client Onboarding</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        This is where clients (licensees) would go through the process of setting up their branded sub-marketplace.
        This involves configuring their domain, branding, and initial settings.
      </p>
      {/* Removed "Return to Home" button */}
    </div>
  );
};

export default OnboardingClient;