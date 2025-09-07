import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  RefreshCw, 
  Calendar,
  DollarSign,
  User,
  MessageSquare,
  Eye,
  FileText,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ClientAPI from "@/services/ClientAPI";

interface PendingService {
  id: number;
  service_type: 'fixed' | 'custom' | 'subscription';
  title: string;
  description: string;
  short_description?: string;
  base_price: number;
  billing_cycle?: string;
  images: string[];
  vendor_id: number;
  vendor_name: string;
  vendor_contact: string;
  vendor_email: string;
  category_name?: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

interface ReviewAction {
  service: PendingService | null;
  action: 'approve' | 'reject' | null;
  comments: string;
  isSubmitting: boolean;
}

const ClientServiceApprovalsPage = () => {
  const [services, setServices] = useState<PendingService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [reviewAction, setReviewAction] = useState<ReviewAction>({
    service: null,
    action: null,
    comments: "",
    isSubmitting: false
  });
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50, // Increased to match backend default
    total: 0,
    pages: 0
  });

  // Load pending services
  const loadPendingServices = async (type: string = "all", page: number = 1) => {
    try {
      setIsLoading(true);
      setError("");
      

      const response = await ClientAPI.getPendingServices({
        type: type,
        page: page,
        limit: pagination.limit
      });

      if (response.error) {
        setError(response.message || "Failed to load pending services");
        return;
      }

      setServices(response.services || []);
      setPagination(response.pagination || pagination);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load pending services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingServices(selectedTab, 1);
  }, [selectedTab]);

  // Handle review action
  const handleReviewService = async () => {
    if (!reviewAction.service || !reviewAction.action) return;

    try {
      setReviewAction(prev => ({ ...prev, isSubmitting: true }));

      const response = await ClientAPI.reviewService(reviewAction.service.id, {
        action: reviewAction.action,
        service_type: reviewAction.service.service_type,
        comments: reviewAction.comments
      });

      if (response.error) {
        toast.error(response.message || "Failed to review service");
        return;
      }

      toast.success(`Service ${reviewAction.action}d successfully`);
      setShowReviewDialog(false);
      setReviewAction({
        service: null,
        action: null,
        comments: "",
        isSubmitting: false
      });

      // Reload services
      loadPendingServices(selectedTab, pagination.page);

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to review service");
    } finally {
      setReviewAction(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Open review dialog
  const openReviewDialog = (service: PendingService, action: 'approve' | 'reject') => {
    setReviewAction({
      service,
      action,
      comments: "",
      isSubmitting: false
    });
    setShowReviewDialog(true);
  };

  // Format price display
  const formatPrice = (price: number, serviceType: string, billingCycle?: string) => {
    const formattedPrice = `$${price}`;
    
    if (serviceType === 'subscription' && billingCycle) {
      const suffix = billingCycle === 'monthly' ? '/mo' : 
                   billingCycle === 'quarterly' ? '/quarter' : 
                   billingCycle === 'annually' ? '/year' : '';
      return formattedPrice + suffix;
    }
    
    return formattedPrice;
  };

  // Get service type badge
  const getServiceTypeBadge = (serviceType: string) => {
    const config = {
      fixed: { label: "Fixed Price", color: "bg-blue-100 text-blue-800" },
      custom: { label: "Custom Service", color: "bg-green-100 text-green-800" },
      subscription: { label: "Subscription", color: "bg-purple-100 text-purple-800" }
    };

    const { label, color } = config[serviceType as keyof typeof config] || config.fixed;
    
    return (
      <Badge className={`${color} text-xs`}>
        {label}
      </Badge>
    );
  };

  // Get image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5172'}${imagePath}`;
  };

  // Show loading skeleton
  if (isLoading && services.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Approvals</h1>
          <p className="text-gray-600 mt-1">
            Review and approve vendor services before they go live in your marketplace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => loadPendingServices(selectedTab, pagination.page)}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Service Type Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Services</TabsTrigger>
          <TabsTrigger value="fixed">Fixed Price</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {/* Services List */}
          {services.length > 0 ? (
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={`${service.service_type}-${service.id}`} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Service Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {service.images && service.images.length > 0 ? (
                          <img
                            src={getImageUrl(service.images[0])}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Service Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                {service.title}
                              </h3>
                              {getServiceTypeBadge(service.service_type)}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {service.short_description || service.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{service.vendor_name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium text-gray-900">
                                  {formatPrice(service.base_price, service.service_type, service.billing_cycle)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(service.created_at).toLocaleDateString()}</span>
                              </div>
                              {service.category_name && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  <span>{service.category_name}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    {service.title}
                                    {getServiceTypeBadge(service.service_type)}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Review service details before approval
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {service.images && service.images.length > 0 && (
                                    <div>
                                      <Label className="text-sm font-medium">Service Image</Label>
                                      <img
                                        src={getImageUrl(service.images[0])}
                                        alt={service.title}
                                        className="w-full h-48 object-cover rounded-lg mt-2"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Price</Label>
                                      <p className="text-lg font-semibold text-green-600 mt-1">
                                        {formatPrice(service.base_price, service.service_type, service.billing_cycle)}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Vendor</Label>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {service.vendor_name} ({service.vendor_email})
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button 
                              onClick={() => openReviewDialog(service, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>

                            <Button 
                              onClick={() => openReviewDialog(service, 'reject')}
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={pagination.page <= 1 || isLoading}
                    onClick={() => loadPendingServices(selectedTab, pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={pagination.page >= pagination.pages || isLoading}
                    onClick={() => loadPendingServices(selectedTab, pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending services</h3>
                <p className="text-gray-600">
                  All vendor services have been reviewed. New services will appear here for approval.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reviewAction.action === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {reviewAction.action === 'approve' ? 'Approve' : 'Reject'} Service
            </DialogTitle>
            <DialogDescription>
              {reviewAction.action === 'approve' 
                ? 'This service will be published to your marketplace and customers can start ordering it.'
                : 'This service will be rejected and the vendor will be notified with your feedback.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {reviewAction.service && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{reviewAction.service.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{reviewAction.service.short_description}</p>
                <p className="text-sm font-medium text-green-600 mt-2">
                  {formatPrice(reviewAction.service.base_price, reviewAction.service.service_type, reviewAction.service.billing_cycle)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-comments">
                  {reviewAction.action === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
                </Label>
                <Textarea
                  id="review-comments"
                  placeholder={
                    reviewAction.action === 'approve' 
                      ? 'Add any notes for the vendor...'
                      : 'Please explain why this service is being rejected...'
                  }
                  value={reviewAction.comments}
                  onChange={(e) => setReviewAction(prev => ({ ...prev, comments: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewDialog(false)}
                  disabled={reviewAction.isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReviewService}
                  disabled={reviewAction.isSubmitting || (reviewAction.action === 'reject' && !reviewAction.comments.trim())}
                  className={reviewAction.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {reviewAction.isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : reviewAction.action === 'approve' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  {reviewAction.isSubmitting 
                    ? 'Processing...' 
                    : reviewAction.action === 'approve' 
                      ? 'Approve Service' 
                      : 'Reject Service'
                  }
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientServiceApprovalsPage;