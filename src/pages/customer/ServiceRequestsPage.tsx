import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
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
  Eye,
  Trash2
} from "lucide-react";

const ServiceRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([
    {
      id: 1,
      serviceName: "Premium Home Painting",
      vendor: "Brush Strokes Pro",
      status: "pending",
      requestDate: "2024-01-15",
      scheduledDate: "2024-01-20",
      price: "$500",
      description: "Interior painting for living room and bedroom",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      location: "Downtown Area",
      urgency: "normal"
    },
    {
      id: 2,
      serviceName: "Emergency Plumbing Repair",
      vendor: "Rapid Plumbers",
      status: "confirmed",
      requestDate: "2024-01-14",
      scheduledDate: "2024-01-16",
      price: "$150",
      description: "Fix leaking kitchen faucet",
      vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      location: "Midtown",
      urgency: "urgent"
    },
    {
      id: 3,
      serviceName: "Deep House Cleaning",
      vendor: "Sparkling Spaces",
      status: "completed",
      requestDate: "2024-01-10",
      scheduledDate: "2024-01-12",
      price: "$180",
      description: "Full house deep cleaning service",
      vendorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      location: "Suburbs North",
      urgency: "normal"
    },
    {
      id: 4,
      serviceName: "HVAC System Tune-up",
      vendor: "Climate Control Experts",
      status: "cancelled",
      requestDate: "2024-01-08",
      scheduledDate: "2024-01-15",
      price: "$120",
      description: "Annual HVAC maintenance and inspection",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      location: "Suburbs South",
      urgency: "normal"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-500";
      case "normal":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
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

  const pendingCount = requests.filter(req => req.status === "pending").length;
  const confirmedCount = requests.filter(req => req.status === "confirmed").length;

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
                <div className="text-2xl font-bold text-green-600">
                  {requests.filter(req => req.status === "completed").length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {requests.filter(req => req.status === "cancelled").length}
                </div>
                <div className="text-sm text-red-700">Cancelled</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {requests.length === 0 ? (
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
                        src={request.vendorImage}
                        alt={request.vendor}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{request.serviceName}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{request.vendor}</span>
                              <div className={`w-2 h-2 rounded-full ${getUrgencyColor(request.urgency)}`}></div>
                              <span className="text-sm text-gray-500 capitalize">{request.urgency}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                              {getStatusIcon(request.status)}
                              <span className="capitalize">{request.status}</span>
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
                            <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Scheduled: {new Date(request.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{request.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-gray-900">{request.price}</div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(request.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            
                            {(request.status === "pending" || request.status === "confirmed") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleChatWithVendor(request.vendor)}
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat
                              </Button>
                            )}
                            
                            {request.status === "confirmed" && (
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
