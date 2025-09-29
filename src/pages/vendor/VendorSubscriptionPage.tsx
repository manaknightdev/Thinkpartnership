/**
 * VendorSubscriptionPage - Manage paid promotion for individual services
 *
 * NEW FEATURES:
 * - Services are always displayed regardless of subscription status
 * - Paid promotion features ONE service at a time at the top of marketplace
 * - Client approval required before promotion goes live
 * - Three promotion packages: Basic (3 days), Professional (7 days), Premium (30 days)
 * - Only one service can be promoted at a time per vendor
 *
 * Flow:
 * 1. Vendor selects a service to promote
 * 2. Vendor chooses promotion package
 * 3. Request sent to client for approval
 * 4. Once approved, service appears at top of marketplace
 * 5. Promotion expires after duration, vendor can request new promotion
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Loader2,
  Eye,
  MousePointer,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import VendorPaidPromotionAPI, {
  PromotionPackage,
  VendorService,
  CurrentPromotion
} from "@/services/VendorPaidPromotionAPI";

const VendorSubscriptionPage = () => {
  const [promotionPackages, setPromotionPackages] = useState<PromotionPackage[]>([]);
  const [vendorServices, setVendorServices] = useState<VendorService[]>([]);
  const [currentPromotion, setCurrentPromotion] = useState<CurrentPromotion | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingPromotion, setRequestingPromotion] = useState(false);

  // Helper: get package color
  const getPackageColor = (packageName: string) => {
    const nameLower = packageName.toLowerCase();
    if (nameLower.includes('basic')) return 'bg-blue-500';
    if (nameLower.includes('professional')) return 'bg-purple-500';
    if (nameLower.includes('premium')) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  // Helper: get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'rejected': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load promotion packages, services, and current promotion in parallel
      const [packagesRes, servicesRes, currentRes] = await Promise.all([
        VendorPaidPromotionAPI.getPackages(),
        VendorPaidPromotionAPI.getServices(),
        VendorPaidPromotionAPI.getCurrentPromotion()
      ]);

      if (packagesRes.error) {
        throw new Error(packagesRes.message || 'Failed to load promotion packages');
      }

      if (servicesRes.error) {
        throw new Error(servicesRes.message || 'Failed to load services');
      }

      if (currentRes.error) {
        console.warn('No current promotion found:', currentRes.message);
      }

      setPromotionPackages(packagesRes.packages || []);
      setVendorServices(servicesRes.services || []);
      setCurrentPromotion(currentRes.promotion);

    } catch (err: any) {
      console.error('Error loading promotion data:', err);
      setError(err.message || 'Failed to load promotion data');
      toast.error(err.message || 'Failed to load promotion data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPromotion = async () => {
    if (!selectedService || !selectedPackage) {
      toast.error('Please select a service and promotion package');
      return;
    }

    setRequestingPromotion(true);
    try {
      const service = vendorServices.find(s => s.id === selectedService);
      if (!service) {
        toast.error('Selected service not found');
        return;
      }

      const response = await VendorPaidPromotionAPI.requestPromotion({
        service_id: selectedService,
        service_type: service.service_type,
        package_id: selectedPackage
      });

      if (response.error) {
        toast.error(response.message || 'Failed to request promotion');
        return;
      }

      toast.success(response.message || 'Promotion request submitted successfully!');
      setIsPromotionDialogOpen(false);
      setSelectedService(null);
      setSelectedPackage(null);

      // Reload promotion data
      await loadData();
    } catch (error) {
      console.error('Error requesting promotion:', error);
      toast.error('Failed to request promotion');
    } finally {
      setRequestingPromotion(false);
    }
  };

  const handleCancelPromotion = async () => {
    if (!currentPromotion) {
      toast.error("No promotion to cancel");
      return;
    }

    if (currentPromotion.status !== 'pending') {
      toast.error("Only pending promotions can be cancelled");
      return;
    }

    try {
      const response = await VendorPaidPromotionAPI.cancelPromotion(currentPromotion.id);

      if (response.error) {
        toast.error(response.message || 'Failed to cancel promotion');
        return;
      }

      toast.success('Promotion request cancelled successfully');

      // Reload promotion data
      await loadData();
    } catch (error) {
      console.error('Error cancelling promotion:', error);
      toast.error('Failed to cancel promotion');
    }
  };

  // Helper functions for promotion management
  const getSelectedServiceName = () => {
    const service = vendorServices.find(s => s.id === selectedService);
    return service ? service.title : '';
  };

  const getSelectedPackageName = () => {
    const pkg = promotionPackages.find(p => p.id === selectedPackage);
    return pkg ? pkg.name : '';
  };

  const canRequestPromotion = () => {
    return !currentPromotion || currentPromotion.status === 'expired' || currentPromotion.status === 'rejected';
  };

  const getPromotionStatusMessage = () => {
    if (!currentPromotion) return null;

    switch (currentPromotion.status) {
      case 'pending':
        return `Your promotion request for "${currentPromotion.service_name}" is awaiting client approval.`;
      case 'approved':
        return `Your promotion for "${currentPromotion.service_name}" has been approved and will start soon.`;
      case 'active':
        return `Your service "${currentPromotion.service_name}" is currently being promoted! ${currentPromotion.days_remaining} days remaining.`;
      case 'expired':
        return `Your promotion for "${currentPromotion.service_name}" has expired. You can request a new promotion.`;
      case 'rejected':
        return `Your promotion request for "${currentPromotion.service_name}" was rejected. You can submit a new request.`;
      default:
        return null;
    }
  };

  const getPackageIcon = (packageName: string) => {
    const nameLower = packageName.toLowerCase();
    if (nameLower.includes('basic')) return <Package className="h-6 w-6 text-blue-600" />;
    if (nameLower.includes('professional')) return <Star className="h-6 w-6 text-purple-600" />;
    if (nameLower.includes('premium')) return <Crown className="h-6 w-6 text-yellow-600" />;
    return <Package className="h-6 w-6 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading promotion data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Paid Promotion
          </h1>
          <p className="text-gray-600 mt-2">
            Feature ONE service at the top of marketplace listings. Client approval required.
          </p>
        </div>

        {canRequestPromotion() && (
          <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Star className="h-4 w-4 mr-2" />
                Request Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Paid Promotion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service-select">Select Service to Promote</Label>
                  <Select value={selectedService?.toString() || ''} onValueChange={(value) => setSelectedService(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorServices.filter(service => service.can_promote).map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.title} ({service.service_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="package-select">Select Promotion Package</Label>
                  <Select value={selectedPackage?.toString() || ''} onValueChange={(value) => setSelectedPackage(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a package" />
                    </SelectTrigger>
                    <SelectContent>
                      {promotionPackages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                          {pkg.name} - ${pkg.price} for {pkg.duration_days} days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleRequestPromotion}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedService || !selectedPackage || requestingPromotion}
                >
                  {requestingPromotion ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Request Promotion
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Current Promotion Status */}
      {currentPromotion && (
        <Card className={`border-2 ${currentPromotion.status === 'active' ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' :
          currentPromotion.status === 'pending' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
          'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPackageIcon(currentPromotion.package_name)}
              Current Promotion: {currentPromotion.service_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentPromotion.duration_days}
                </div>
                <div className="text-sm text-gray-600">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${currentPromotion.amount}
                </div>
                <div className="text-sm text-gray-600">Package Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {currentPromotion.total_views || 0}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {currentPromotion.total_clicks || 0}
                </div>
                <div className="text-sm text-gray-600">Total Clicks</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Promotion Status</span>
                <Badge className={`${getStatusColor(currentPromotion.status)} text-white`}>
                  {currentPromotion.status.charAt(0).toUpperCase() + currentPromotion.status.slice(1)}
                </Badge>
              </div>

              {currentPromotion.status === 'active' && (
                <div className="text-sm text-gray-600">
                  Days remaining: {currentPromotion.days_remaining} | Ends: {new Date(currentPromotion.end_date!).toLocaleDateString()}
                </div>
              )}

              {currentPromotion.status === 'pending' && (
                <div className="text-sm text-yellow-600">
                  Awaiting client approval
                </div>
              )}

              {currentPromotion.status === 'rejected' && (
                <div className="text-sm text-red-600">
                  Request was rejected. You can submit a new promotion request.
                </div>
              )}
            </div>

            {currentPromotion.status === 'pending' && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelPromotion}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancel Request
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Message */}
      {getPromotionStatusMessage() && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {getPromotionStatusMessage()}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="packages">Promotion Packages</TabsTrigger>
          <TabsTrigger value="services">Your Services</TabsTrigger>
        </TabsList>

        {/* Promotion Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotionPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  pkg.is_popular ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {getPackageIcon(pkg.name)}
                    {pkg.name}
                  </CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      ${pkg.price}
                      <span className="text-lg text-gray-500"> / {pkg.duration_days} days</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Feature one service at marketplace top
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {pkg.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Featured at top of marketplace for {pkg.duration_days} days
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Client approval required
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Enhanced visibility to customers
                    </li>
                  </ul>

                  {!canRequestPromotion() ? (
                    <Button className="w-full" variant="outline" disabled>
                      {currentPromotion?.status === 'active' ? 'Promotion Active' :
                       currentPromotion?.status === 'pending' ? 'Awaiting Approval' :
                       'Promotion Unavailable'}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setIsPromotionDialogOpen(true);
                      }}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Select Package
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
                  <h3 className="font-semibold text-blue-900 mb-2">How Paid Promotion Works</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Select ONE service to promote at a time</li>
                    <li>• Choose a promotion package (3, 7, or 30 days)</li>
                    <li>• Submit request for client approval</li>
                    <li>• Once approved, your service appears at the top of marketplace</li>
                    <li>• All services remain visible regardless of promotion status</li>
                    <li>• Only one promotion per vendor at a time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Your Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorServices.map((service) => (
              <Card key={`${service.service_type}-${service.id}`} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {service.service_type}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-semibold">${service.base_price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm">{service.category_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={`${getStatusColor(service.promotion_status)} text-white text-xs`}>
                        {service.promotion_status === 'none' ? 'Not Promoted' : service.promotion_status}
                      </Badge>
                    </div>

                    {service.can_promote ? (
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => {
                          setSelectedService(service.id);
                          setIsPromotionDialogOpen(true);
                        }}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Promote This Service
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full mt-3" variant="outline" disabled>
                        {service.promotion_status === 'pending' ? 'Awaiting Approval' :
                         service.promotion_status === 'active' ? 'Currently Promoted' :
                         'Cannot Promote'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {vendorServices.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600 mb-4">
                  You need to create services before you can promote them.
                </p>
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Create Your First Service
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
