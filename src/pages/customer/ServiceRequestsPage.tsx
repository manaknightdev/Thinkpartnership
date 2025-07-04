import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import ServiceRequestsAPI, { ServiceRequest } from "@/services/ServiceRequestsAPI";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  Trash2,
  Loader2
} from "lucide-react";

const ServiceRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch service requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await ServiceRequestsAPI.getServiceRequests();
        if (response.error) {
          throw new Error('Failed to load service requests');
        }

        setRequests(response.requests);
      } catch (err: any) {
        setError(err.message || 'Failed to load service requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Helper functions
  const getStatusColor = (status: number) => {
    return ServiceRequestsAPI.getStatusColor(status);
  };

  const getStatusText = (status: number) => {
    return ServiceRequestsAPI.getStatusText(status);
  };

  const getUrgencyText = (urgency: number) => {
    return ServiceRequestsAPI.getUrgencyText(urgency);
  };

  const handleViewDetails = (requestId: number) => {
    navigate(`/marketplace/requests/${requestId}`);
  };

  const handleChatWithVendor = (vendorName: string) => {
    navigate(`/marketplace/chat/${encodeURIComponent(vendorName)}`);
  };

  const handleDeleteRequest = (requestId: number) => {
    setRequests(requests.filter(req => req.id !== requestId));
  };

  // Helper functions for status display
  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: // Pending
        return <Clock className="w-4 h-4" />;
      case 1: // Accepted
        return <CheckCircle className="w-4 h-4" />;
      case 2: // In Progress
        return <Clock className="w-4 h-4" />;
      case 3: // Completed
        return <CheckCircle className="w-4 h-4" />;
      case 4: // Cancelled
        return <XCircle className="w-4 h-4" />;
      case 5: // Rejected
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: number) => {
    switch (urgency) {
      case 1: // Urgent
        return "bg-red-500";
      case 2: // High
        return "bg-orange-500";
      case 3: // Normal
        return "bg-green-500";
      case 4: // Low
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate counts for stats
  const pendingCount = requests.filter(req => req.status === 0).length;
  const confirmedCount = requests.filter(req => req.status === 1).length;
  const completedCount = requests.filter(req => req.status === 3).length;
  const cancelledCount = requests.filter(req => req.status === 4).length;

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
                  <p className="text-gray-600">{requests.length} total requests</p>
                </div>
              </div>

              <Button
                onClick={() => navigate('/marketplace')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Request New Service
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{confirmedCount}</div>
                <div className="text-sm text-blue-700">Confirmed</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{cancelledCount}</div>
                <div className="text-sm text-red-700">Cancelled</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <Alert className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            /* Loading State */
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : requests.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No service requests</h2>
              <p className="text-gray-600 mb-8">You haven't requested any services yet. Browse our marketplace to get started.</p>
              <Button
                onClick={() => navigate('/marketplace')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Services
              </Button>
            </div>
          ) : (
            /* Requests List */
            <div className="space-y-6">
              {requests.map((request) => (
                <Card key={request.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={request.vendor_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                        alt={request.vendor_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{request.service_title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{request.vendor_name}</span>
                              <div className={`w-2 h-2 rounded-full ${getUrgencyColor(request.urgency)}`}></div>
                              <span className="text-sm text-gray-500 capitalize">{getUrgencyText(request.urgency)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{getStatusText(request.status)}</span>
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRequest(request.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{request.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Scheduled: {request.scheduled_date ? new Date(request.scheduled_date).toLocaleDateString() : 'Not scheduled'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{request.vendor_phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-gray-900">${request.service_price}</div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(request.id)}
                            >
                              View Details
                            </Button>

                            {(request.status === 0 || request.status === 1) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleChatWithVendor(request.vendor_name)}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat
                              </Button>
                            )}

                            {request.status === 1 && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        {requests.length > 0 && (
          <section className="bg-white border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help with Your Requests?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you manage your service requests
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/marketplace/help')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Contact Support
              </Button>
            </div>
          </section>
        )}
      </div>
    </MarketplaceLayout>
  );
};

export default ServiceRequestsPage;
