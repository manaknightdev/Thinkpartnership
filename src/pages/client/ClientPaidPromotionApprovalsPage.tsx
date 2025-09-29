import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  RefreshCw, 
  Calendar,
  DollarSign,
  User,
  MessageSquare,
  Eye,
  TrendingUp,
  Loader2,
  Package
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import ClientAPI from "@/services/ClientAPI";

interface PendingPromotion {
  id: number;
  vendor_id: number;
  vendor_name: string;
  vendor_contact: string;
  vendor_email: string;
  service_id: number;
  service_name: string;
  service_description: string;
  service_type: 'flat_fee' | 'custom' | 'subscription';
  package_name: string;
  duration_days: number;
  amount: number;
  created_at: string;
}

interface ReviewAction {
  promotion: PendingPromotion | null;
  action: 'approve' | 'reject' | null;
  comments: string;
  isSubmitting: boolean;
}

const ClientPaidPromotionApprovalsPage = () => {
  const [promotions, setPromotions] = useState<PendingPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewAction, setReviewAction] = useState<ReviewAction>({
    promotion: null,
    action: null,
    comments: "",
    isSubmitting: false
  });
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Load pending promotions
  const loadPendingPromotions = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await ClientAPI.getPendingPromotions();

      if (response.error) {
        setError(response.message || "Failed to load pending promotions");
        return;
      }

      setPromotions(response.promotions || []);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load pending promotions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPromotions();
  }, []);

  // Handle review action
  const handleReviewPromotion = async () => {
    if (!reviewAction.promotion || !reviewAction.action) return;

    try {
      setReviewAction(prev => ({ ...prev, isSubmitting: true }));

      const response = await ClientAPI.reviewPromotion(reviewAction.promotion.id, {
        action: reviewAction.action,
        comments: reviewAction.comments
      });

      if (response.error) {
        toast.error(response.message || "Failed to review promotion");
        return;
      }

      toast.success(`Promotion ${reviewAction.action}d successfully`);
      setShowReviewDialog(false);
      setReviewAction({
        promotion: null,
        action: null,
        comments: "",
        isSubmitting: false
      });

      // Reload promotions
      loadPendingPromotions();

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to review promotion");
    } finally {
      setReviewAction(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Open review dialog
  const openReviewDialog = (promotion: PendingPromotion, action: 'approve' | 'reject') => {
    setReviewAction({
      promotion,
      action,
      comments: "",
      isSubmitting: false
    });
    setShowReviewDialog(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Paid Promotion Approvals
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve vendor promotion requests before they go live in your marketplace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={loadPendingPromotions}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(promotions.reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined promotion value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.length > 0 
                ? Math.round(promotions.reduce((sum, p) => sum + p.duration_days, 0) / promotions.length)
                : 0
              } days
            </div>
            <p className="text-xs text-muted-foreground">
              Average promotion length
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Promotions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : promotions.length > 0 ? (
        <div className="space-y-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Promotion Icon */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="h-8 w-8 text-white" />
                  </div>

                  {/* Promotion Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {promotion.service_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          by {promotion.vendor_name} • {promotion.vendor_email}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {promotion.service_type}
                      </Badge>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {promotion.service_description}
                    </p>

                    {/* Promotion Package Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Package</div>
                        <div className="font-medium">{promotion.package_name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="font-medium">{promotion.duration_days} days</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Amount</div>
                        <div className="font-medium text-green-600">{formatCurrency(promotion.amount)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Requested</div>
                        <div className="font-medium">{formatDate(promotion.created_at)}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => openReviewDialog(promotion, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                      <Button 
                        onClick={() => openReviewDialog(promotion, 'reject')}
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Promotions</h3>
            <p className="text-gray-600">
              All promotion requests have been reviewed. New requests will appear here.
            </p>
          </CardContent>
        </Card>
      )}

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
              {reviewAction.action === 'approve' ? 'Approve' : 'Reject'} Promotion
            </DialogTitle>
            <DialogDescription>
              {reviewAction.action === 'approve' 
                ? 'This service will be featured at the top of your marketplace for the selected duration.'
                : 'This promotion request will be rejected and the vendor will be notified with your feedback.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {reviewAction.promotion && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{reviewAction.promotion.service_name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {reviewAction.promotion.package_name} • {reviewAction.promotion.duration_days} days • {formatCurrency(reviewAction.promotion.amount)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="review-comments">
                {reviewAction.action === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
              </Label>
              <Textarea
                id="review-comments"
                placeholder={
                  reviewAction.action === 'approve' 
                    ? 'Add any notes for the vendor...'
                    : 'Please explain why this promotion is being rejected...'
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
                onClick={handleReviewPromotion}
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
                    ? 'Approve Promotion' 
                    : 'Reject Promotion'
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPaidPromotionApprovalsPage;
