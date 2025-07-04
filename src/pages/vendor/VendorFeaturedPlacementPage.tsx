/**
 * VendorFeaturedPlacementPage - Allows vendors to purchase featured placement packages
 *
 * Features:
 * - 3-day, 7-day, and 30-day featured placement packages
 * - Daily rate pricing model ($1/day base rate with volume discounts)
 * - Service selection for featuring specific services
 * - Active placement tracking with analytics
 * - Performance metrics (views, click-through rates, ROI)
 *
 * Revenue Model:
 * - Vendors pay daily rates for featured placement
 * - Platform earns revenue from featured placement fees
 * - Tiered pricing encourages longer commitments
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Crown,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Eye,
  ArrowUp,
  CreditCard,
  Info
} from "lucide-react";
import VendorFeaturedPlacementAPI, {
  FeaturedPackage,
  ActivePlacement,
  FeaturedAnalytics
} from "@/services/VendorFeaturedPlacementAPI";
import VendorServicesAPI from "@/services/VendorServicesAPI";



const VendorFeaturedPlacementPage = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [featuredPackages, setFeaturedPackages] = useState<FeaturedPackage[]>([]);
  const [activePlacements, setActivePlacements] = useState<ActivePlacement[]>([]);
  const [vendorServices, setVendorServices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<FeaturedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load packages, active placements, services, and analytics in parallel
      const [packagesRes, placementsRes, servicesRes, analyticsRes] = await Promise.all([
        VendorFeaturedPlacementAPI.getPackages(),
        VendorFeaturedPlacementAPI.getActivePlacements(),
        VendorServicesAPI.getServices(),
        VendorFeaturedPlacementAPI.getAnalytics()
      ]);

      if (!packagesRes.error && packagesRes.packages) {
        setFeaturedPackages(packagesRes.packages);
      }

      if (!placementsRes.error && placementsRes.placements) {
        setActivePlacements(placementsRes.placements);
      }

      if (!servicesRes.error && servicesRes.data?.services) {
        setVendorServices(servicesRes.data.services);
      }

      if (!analyticsRes.error && analyticsRes.analytics) {
        setAnalytics(analyticsRes.analytics);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchasePackage = async () => {
    if (!selectedPackage || !selectedService) {
      toast.error("Please select both a package and service");
      return;
    }

    setPurchasing(true);
    try {
      const response = await VendorFeaturedPlacementAPI.purchasePlacement({
        package_id: selectedPackage,
        service_id: selectedService
      });

      if (response.error) {
        toast.error(response.message || 'Failed to purchase featured placement');
        return;
      }

      const packageData = featuredPackages.find(p => p.id === selectedPackage);
      const serviceData = vendorServices.find(s => s.id === selectedService);

      toast.success(`Successfully purchased ${packageData?.name} for ${serviceData?.title || serviceData?.name}! Your featured placement will begin within 24 hours.`);
      setIsDialogOpen(false);
      setSelectedPackage("");
      setSelectedService("");

      // Reload active placements
      const placementsRes = await VendorFeaturedPlacementAPI.getActivePlacements();
      if (!placementsRes.error && placementsRes.placements) {
        setActivePlacements(placementsRes.placements);
      }
    } catch (error) {
      console.error('Error purchasing placement:', error);
      toast.error('Failed to purchase featured placement');
    } finally {
      setPurchasing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expired': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
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
            <Crown className="h-8 w-8 text-yellow-500" />
            Featured Placement
          </h1>
          <p className="text-gray-600 mt-2">
            Boost your visibility and get more customers with featured placement packages
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Star className="h-4 w-4 mr-2" />
              Purchase Featured Placement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Purchase Featured Placement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-select">Select Service to Feature</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title || service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="package-select">Select Package</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {featuredPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.totalPrice} ({pkg.duration} days)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handlePurchasePackage}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!selectedPackage || !selectedService || purchasing}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {purchasing ? 'Processing...' : 'Purchase Now'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages">Available Packages</TabsTrigger>
          <TabsTrigger value="active">Active Placements</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        {/* Available Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  pkg.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    {pkg.name}
                  </CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      ${pkg.totalPrice}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${pkg.dailyRate}/day for {pkg.duration} days
                    </div>
                    {pkg.savings && (
                      <Badge variant="secondary" className="text-green-600">
                        {pkg.savings}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {pkg.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setSelectedPackage(pkg.id);
                      setIsDialogOpen(true);
                    }}
                  >
                    Select Package
                  </Button>
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
                  <h3 className="font-semibold text-blue-900 mb-2">How Featured Placement Works</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your services appear at the top of search results and category pages</li>
                    <li>• Featured badge increases customer trust and click-through rates</li>
                    <li>• Placement begins within 24 hours of purchase</li>
                    <li>• Track performance with detailed analytics</li>
                    <li>• No long-term commitments - purchase as needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Placements Tab */}
        <TabsContent value="active" className="space-y-6">
          {activePlacements.length > 0 ? (
            <div className="space-y-4">
              {activePlacements.map((placement) => (
                <Card key={placement.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(placement.status)}`} />
                        {placement.packageName}
                      </CardTitle>
                      <Badge variant={placement.status === 'active' ? 'default' : 'secondary'}>
                        {placement.status.charAt(0).toUpperCase() + placement.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Days Remaining</div>
                        <div className="text-2xl font-bold text-blue-600">{placement.daysRemaining}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Total Views</div>
                        <div className="text-2xl font-bold text-green-600">{placement.totalViews}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Click-Through</div>
                        <div className="text-2xl font-bold text-purple-600">{placement.clickThrough}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">End Date</div>
                        <div className="text-lg font-semibold">{new Date(placement.endDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Placements</h3>
                <p className="text-gray-600 mb-4">Purchase a featured placement package to boost your visibility</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Featured Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.total_featured_views?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total featured views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.click_through_rate ? `${analytics.click_through_rate}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average click-through rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.roi_percentage ? `${analytics.roi_percentage}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Return on investment
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                How your featured placements are performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.performance_insights?.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {insight.type === 'visibility' ? (
                        <ArrowUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <Target className="h-5 w-5 text-blue-600" />
                      )}
                      <div>
                        <div className={`font-semibold ${insight.type === 'visibility' ? 'text-green-900' : 'text-blue-900'}`}>
                          {insight.title}
                        </div>
                        <div className={`text-sm ${insight.type === 'visibility' ? 'text-green-700' : 'text-blue-700'}`}>
                          {insight.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    No performance insights available yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorFeaturedPlacementPage;
