import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Crown, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  description: string;
}

const mockAvailablePlans: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "Basic Listing",
    price: "$19/month",
    features: ["Standard listing", "5 service listings", "Basic analytics"],
    description: "Ideal for new vendors looking to get started."
  },
  {
    id: "plan-premium",
    name: "Premium Placement",
    price: "$49/month",
    features: ["Featured listing (rotating)", "Unlimited service listings", "Advanced analytics", "Priority support"],
    description: "Boost visibility and access deeper insights."
  },
  {
    id: "plan-elite",
    name: "Elite Partner",
    price: "$99/month",
    features: ["Top placement (fixed)", "Unlimited service listings", "Full analytics suite", "Dedicated account manager", "API access"],
    description: "Maximize your reach and integrate seamlessly."
  },
];

const VendorSubscriptionPage = () => {
  const currentPlanId = "plan-premium"; // Mock current plan for the vendor

  const handleSubscribe = (planName: string) => {
    toast.success(`Successfully subscribed to ${planName}!`);
    // In a real app, this would initiate a payment process and update the vendor's subscription status
  };

  const handleManageSubscription = () => {
    toast.info("Managing your current subscription... (redirect to billing portal)");
    // In a real app, this would redirect to a billing portal
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Subscription</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Upgrade your vendor account to unlock premium features and increase your visibility.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" /> Your Current Plan
          </CardTitle>
          <CardDescription>Details of your active subscription.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPlanId ? (
            <>
              <h3 className="text-2xl font-bold">
                {mockAvailablePlans.find(p => p.id === currentPlanId)?.name || "N/A"}
              </h3>
              <p className="text-xl text-primary">
                {mockAvailablePlans.find(p => p.id === currentPlanId)?.price || "N/A"}
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                {(mockAvailablePlans.find(p => p.id === currentPlanId)?.features || []).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={handleManageSubscription} variant="outline">
                Manage Subscription
              </Button>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">You are currently on the Free plan.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Available Plans
          </CardTitle>
          <CardDescription>Choose a plan that best suits your business needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAvailablePlans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary mb-4">{plan.price}</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={() => handleSubscribe(plan.name)}
                    className="mt-6 w-full"
                    disabled={currentPlanId === plan.id}
                  >
                    {currentPlanId === plan.id ? "Current Plan" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorSubscriptionPage;