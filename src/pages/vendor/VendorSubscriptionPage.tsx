import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Crown, CheckCircle, DollarSign, Zap, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  description: string;
}

interface FeaturedPlacement {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  benefits: string[];
  popular?: boolean;
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

const featuredPlacements: FeaturedPlacement[] = [
  {
    id: "featured-3day",
    name: "3-Day Featured",
    duration: "3 days",
    price: 29,
    description: "Quick visibility boost for immediate results",
    benefits: [
      "Top placement for 3 days",
      "Featured badge on listings",
      "Priority in search results",
      "Increased visibility by 300%"
    ]
  },
  {
    id: "featured-7day",
    name: "7-Day Featured",
    duration: "7 days",
    price: 69,
    description: "Perfect for promoting new services or special offers",
    benefits: [
      "Top placement for 7 days",
      "Featured badge on listings",
      "Priority in search results",
      "Increased visibility by 400%",
      "Email promotion to customers"
    ],
    popular: true
  },
  {
    id: "featured-30day",
    name: "30-Day Featured",
    duration: "30 days",
    price: 199,
    description: "Maximum exposure for sustained business growth",
    benefits: [
      "Top placement for 30 days",
      "Featured badge on listings",
      "Priority in search results",
      "Increased visibility by 500%",
      "Email promotion to customers",
      "Social media promotion",
      "Dedicated account support"
    ]
  }
];

const VendorSubscriptionPage = () => {
  const currentPlanId = "plan-premium"; // Mock current plan for the vendor
  const [activeFeatured, setActiveFeatured] = useState<string | null>("featured-7day"); // Mock active featured placement

  const handleSubscribe = (planName: string) => {
    toast.success(`Successfully subscribed to ${planName}!`);
    // In a real app, this would initiate a payment process and update the vendor's subscription status
  };

  const handleManageSubscription = () => {
    toast.info("Managing your current subscription... (redirect to billing portal)");
    // In a real app, this would redirect to a billing portal
  };

  const handlePurchaseFeatured = (placementName: string, price: number) => {
    toast.success(`Successfully purchased ${placementName} for $${price}!`);
    // In a real app, this would initiate payment and activate the featured placement
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Subscription & Promotions</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manage your subscription and boost your visibility with featured placements.
      </p>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscription">Monthly Subscription</TabsTrigger>
          <TabsTrigger value="featured">Featured Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6">

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
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          {/* Active Featured Placement */}
          {activeFeatured && (
            <Card className="border-l-4 border-l-orange-500 shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Active Featured Placement
                </CardTitle>
                <CardDescription>Your current promotional boost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-orange-900">
                      {featuredPlacements.find(p => p.id === activeFeatured)?.name}
                    </h3>
                    <p className="text-orange-700">
                      {featuredPlacements.find(p => p.id === activeFeatured)?.description}
                    </p>
                    <p className="text-sm text-orange-600 mt-2">
                      5 days remaining • Expires on Jan 15, 2024
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-orange-500 text-white mb-2">Featured</Badge>
                    <div className="text-2xl font-bold text-orange-600">
                      +{featuredPlacements.find(p => p.id === activeFeatured)?.benefits.find(b => b.includes('visibility'))?.match(/\d+/)?.[0] || '400'}%
                    </div>
                    <div className="text-sm text-orange-600">visibility boost</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Featured Placement Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Featured Placement Options
              </CardTitle>
              <CardDescription>
                Boost your visibility and get more customers with featured placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPlacements.map((placement) => (
                  <Card
                    key={placement.id}
                    className={`relative transition-all duration-200 hover:shadow-lg ${
                      placement.popular
                        ? 'ring-2 ring-blue-500 border-blue-200'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    {placement.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                      </div>
                    )}

                    <CardHeader className="text-center">
                      <div className="mx-auto p-3 rounded-lg bg-gradient-to-r from-orange-100 to-yellow-100 w-fit">
                        <Zap className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl">{placement.name}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">${placement.price}</div>
                      <div className="text-sm text-gray-500">for {placement.duration}</div>
                      <CardDescription>{placement.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        {placement.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handlePurchaseFeatured(placement.name, placement.price)}
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                        disabled={activeFeatured === placement.id}
                      >
                        {activeFeatured === placement.id ? "Currently Active" : `Purchase for $${placement.price}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">How Featured Placements Work:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Instant activation upon purchase
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Appear at the top of search results
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Significant increase in profile views
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Featured badge on all your listings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Higher conversion rates
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Premium placement in categories
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSubscriptionPage;