/**
 * VendorSubscriptionPage - Manage vendor featured plans and durations
 *
 * Features:
 * - Three tiers: Basic ($10), Professional ($20), Premium ($30)
 * - Featured durations: 3, 7, and 30 days respectively
 * - Unlimited services during active featured period
 * - Different commission rates per tier (unchanged)
 * - Plan changes and reactivation supported
 *
 * Revenue Model:
 * - Monthly recurring revenue for clients
 * - Lower commission rates for higher tiers incentivize upgrades
 * - Simple, predictable pricing structure
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Crown,
  Star,
  Package,
  Calendar,
  DollarSign,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Users,
  ArrowUp,
  CreditCard,
  Info,
  Loader2
} from "lucide-react";
import VendorSubscriptionAPI, {
  SubscriptionPlan,
  VendorSubscription,
  SubscriptionUsage
} from "@/services/VendorSubscriptionAPI";



const VendorSubscriptionPage = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<VendorSubscription | null>(null);
  const [subscriptionUsage, setSubscriptionUsage] = useState<SubscriptionUsage | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [changingPlan, setChangingPlan] = useState(false);

  // Helper: derive featured days from plan
  const getPlanDays = (plan?: SubscriptionPlan | null) => {
    if (!plan) return 0;
    const nameLower = (plan.name || '').toLowerCase();
    const defaultDays = nameLower.includes('basic') ? 3 : (nameLower.includes('professional') ? 7 : (nameLower.includes('premium') ? 30 : 30));
    return plan.features?.featured_duration_days || defaultDays;
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load subscription plans, current subscription, and usage in parallel
      const [plansRes, currentRes, usageRes] = await Promise.all([
        VendorSubscriptionAPI.getPlans(),
        VendorSubscriptionAPI.getCurrentSubscription(),
        VendorSubscriptionAPI.getSubscriptionUsage()
      ]);

      if (!plansRes.error && plansRes.data?.plans) {
        setSubscriptionPlans(plansRes.data.plans);
      }

      if (!currentRes.error && currentRes.data?.subscription) {
        setCurrentSubscription(currentRes.data.subscription);
      }

      if (!usageRes.error && usageRes.data?.usage) {
        setSubscriptionUsage(usageRes.data.usage);
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeToPlan = async (planId: number) => {
    setSubscribing(planId);
    try {
      const response = await VendorSubscriptionAPI.subscribeToPlan(planId);

      if (response.error) {
        toast.error(response.message || 'Failed to subscribe to plan');
        return;
      }

      const plan = subscriptionPlans.find(p => p.id === planId);
      toast.success(`Successfully subscribed to ${plan?.name} plan!`);

      // Reload subscription data
      await loadData();
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      toast.error('Failed to subscribe to plan');
    } finally {
      setSubscribing(null);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setChangingPlan(true);
    try {
      const response = await VendorSubscriptionAPI.changePlan(selectedPlan);

      if (response.error) {
        toast.error(response.message || 'Failed to change plan');
        return;
      }

      const plan = subscriptionPlans.find(p => p.id === selectedPlan);
      toast.success(`Successfully changed to ${plan?.name} plan!`);
      setIsUpgradeDialogOpen(false);
      setSelectedPlan(null);

      // Reload subscription data
      await loadData();
    } catch (error) {
      console.error('Error changing plan:', error);
      toast.error('Failed to change plan');
    } finally {
      setChangingPlan(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? Your services will be deactivated at the end of your current billing period.")) {
      return;
    }

    try {
      const response = await VendorSubscriptionAPI.cancelSubscription();

      if (response.error) {
        toast.error(response.message || 'Failed to cancel subscription');
        return;
      }

      toast.success('Subscription cancelled successfully');
      await loadData();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic': return <Package className="h-6 w-6 text-blue-600" />;
      case 'professional': return <Star className="h-6 w-6 text-purple-600" />;
      case 'premium': return <Crown className="h-6 w-6 text-yellow-600" />;
      default: return <Package className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'past_due': return 'bg-yellow-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const isCurrentPlan = (planId: number) => {
    return currentSubscription?.plan_id === planId;
  };

  const canUpgrade = (planId: number) => {
    if (!currentSubscription) return true;
    const currentPlan = subscriptionPlans.find(p => p.id === currentSubscription.plan_id);
    const targetPlan = subscriptionPlans.find(p => p.id === planId);
    return !!(targetPlan && currentPlan && getPlanDays(targetPlan) > getPlanDays(currentPlan));
  };

  const canDowngrade = (planId: number) => {
    if (!currentSubscription) return false;
    const currentPlan = subscriptionPlans.find(p => p.id === currentSubscription.plan_id);
    const targetPlan = subscriptionPlans.find(p => p.id === planId);
    return !!(targetPlan && currentPlan && getPlanDays(targetPlan) < getPlanDays(currentPlan));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading featured placement data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Paid Promotion
          </h1>
          <p className="text-gray-600 mt-2">
            Get featured in the marketplace for a set number of days. Services are unlimited while featured
          </p>
        </div>

        {currentSubscription && (
          <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowUp className="h-4 w-4 mr-2" />
                Change Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                 <DialogTitle>Change Featured Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="plan-select">Select New Plan</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedPlan || ''}
                    onChange={(e) => setSelectedPlan(parseInt(e.target.value))}
                  >
                    <option value="">Choose a plan</option>
                    {subscriptionPlans.map((plan) => (
                      <option 
                        key={plan.id} 
                        value={plan.id}
                        disabled={isCurrentPlan(plan.id)}
                      >
                        {plan.name} - ${plan.monthly_price} for {getPlanDays(plan)} days (unlimited services)
                        {isCurrentPlan(plan.id) ? ' (Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleChangePlan}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedPlan || changingPlan}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                   {changingPlan ? 'Processing...' : 'Change Plan'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && subscriptionUsage && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPlanIcon(currentSubscription.plan.name)}
              Current Plan: {currentSubscription.plan.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Cost</div>
                <div className="text-2xl font-bold text-blue-600">${currentSubscription.plan.monthly_price}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Services Active</div>
                <div className="text-2xl font-bold text-purple-600">
                  {subscriptionUsage.current_services} (unlimited allowed)
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Plan Status</div>
                <div className="text-2xl font-bold text-green-600">Active</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-600">Flat Fee Services:</span>
                  <span className="ml-2 font-semibold">{subscriptionUsage.flat_fee_services}</span>
                </div>
                <div>
                  <span className="text-gray-600">Custom Services:</span>
                  <span className="ml-2 font-semibold">{subscriptionUsage.custom_services}</span>
                </div>
                <div>
                  <span className="text-gray-600">Days Remaining:</span>
                  <span className="ml-2 font-semibold">{subscriptionUsage.days_remaining}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">Paid Promotion</TabsTrigger>
          <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
        </TabsList>

        {/* Subscription Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  isCurrentPlan(plan.id) ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${plan.name.toLowerCase() === 'professional' ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}
              >
                {plan.name.toLowerCase() === 'professional' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isCurrentPlan(plan.id) && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {getPlanIcon(plan.name)}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      ${plan.monthly_price}
                      <span className="text-lg text-gray-500"> / {getPlanDays(plan)} days</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Unlimited services while featured
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Featured in marketplace for {getPlanDays(plan)} days
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Unlimited services while featured
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Accept orders from customers
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Receive payments directly
                    </li>
                  </ul>

                  {isCurrentPlan(plan.id) ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : currentSubscription ? (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setIsUpgradeDialogOpen(true);
                      }}
                      disabled={!!subscribing}
                    >
                      {canUpgrade(plan.id) ? 'Upgrade' : canDowngrade(plan.id) ? 'Downgrade' : 'Switch'} to {plan.name}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSubscribeToPlan(plan.id)}
                      disabled={subscribing === plan.id}
                    >
                      {subscribing === plan.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscribe Now
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How Paid Promotion Work</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your services are featured for a set number of days</li>
                    <li>• Unlimited services while your plan is active</li>
                    <li>• Receive payments directly from customers</li>
                    <li>• Plans do not auto-renew; pay again to extend</li>
                    <li>• Upgrade or downgrade your plan at any time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage & Analytics Tab */}
        <TabsContent value="usage" className="space-y-6">
          {currentSubscription && subscriptionUsage ? (
            <div className="space-y-6">
              {/* Usage Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {subscriptionUsage.current_services}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Unlimited services while featured</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {subscriptionUsage.days_remaining} days remaining in current plan
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Flat Fee Services</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {subscriptionUsage.flat_fee_services}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Fixed-price services
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Custom Services</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {subscriptionUsage.custom_services}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Quantity-based pricing
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>
                    Current plan information and billing cycle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Current Plan</div>
                          <div className="font-semibold flex items-center gap-2">
                            {getPlanIcon(currentSubscription.plan.name)}
                            {currentSubscription.plan.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost</div>
                          <div className="font-semibold">${currentSubscription.plan.monthly_price}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Featured Duration</div>
                          <div className="font-semibold">{getPlanDays(currentSubscription.plan)} days</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Services</div>
                          <div className="font-semibold">Unlimited while active</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Status</div>
                          <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                            {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Days Remaining</div>
                          <div className="font-semibold">{subscriptionUsage.days_remaining} days</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Next Billing</div>
                          <div className="font-semibold">
                            {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-3">
                      {currentSubscription.status === 'active' && (
                        <Button 
                          variant="destructive" 
                          onClick={handleCancelSubscription}
                        >
                          Cancel Subscription
                        </Button>
                      )}
                      {currentSubscription.status === 'cancelled' && (
                        <Button 
                          onClick={async () => {
                            try {
                              await VendorSubscriptionAPI.reactivateSubscription();
                              toast.success('Subscription reactivated successfully');
                              await loadData();
                            } catch (error) {
                              toast.error('Failed to reactivate subscription');
                            }
                          }}
                        >
                          Reactivate Subscription
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-4">Subscribe to a plan to start offering services and track your usage</p>
                <Button
                  onClick={() => {
                    // Focus on the plans tab
                    const plansTab = document.querySelector('[value="plans"]') as HTMLElement;
                    plansTab?.click();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default VendorSubscriptionPage;
