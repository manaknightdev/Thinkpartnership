import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Crown, CheckCircle, DollarSign } from "lucide-react";

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
    description: "Ideal for new clients looking to get started."
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

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" /> Your Current Plan
          </CardTitle>
          <CardDescription>Details of your active subscription.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPlanId ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {mockAvailablePlans.find(p => p.id === currentPlanId)?.name || "N/A"}
                </h3>
                <Badge className="bg-green-500 text-white">
                  Active
                </Badge>
              </div>
              <p className="text-xl text-primary font-semibold">
                {mockAvailablePlans.find(p => p.id === currentPlanId)?.price || "N/A"}
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {(mockAvailablePlans.find(p => p.id === currentPlanId)?.features || []).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> {feature}
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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Available Plans
          </CardTitle>
          <CardDescription>Choose a plan that best suits your business needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAvailablePlans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`flex flex-col relative transition-all duration-200 hover:shadow-lg ${
                  currentPlanId === plan.id
                    ? 'ring-2 ring-primary/50 bg-primary/5'
                    : index === 1
                      ? 'shadow-lg border-blue-200 dark:border-blue-800'
                      : 'hover:border-gray-300'
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {currentPlanId === plan.id && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white px-3 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4 text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <p className="text-3xl font-bold text-primary mt-2">{plan.price}</p>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col justify-between">
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.name)}
                    className="w-full"
                    variant={currentPlanId === plan.id ? "secondary" : "default"}
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