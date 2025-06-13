import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  Phone,
  MessageCircle,
  FileText,
  DollarSign,
  Star,
  Edit
} from "lucide-react";

const ServiceRequestDetailsPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API
  const mockRequests = {
    "1": {
      id: 1,
      serviceName: "Interior Painting",
      vendor: "Certified Inspectors Inc.",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      status: "confirmed",
      urgency: "normal",
      price: "$450",
      requestDate: "2024-01-15",
      scheduledDate: "2024-01-22",
      location: "Downtown Area",
      description: "Need interior painting for living room (300 sq ft) and bedroom (200 sq ft). Prefer neutral colors - light gray for living room and soft beige for bedroom.",
      customerInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        address: "123 Main St, Downtown Area, CA 90210"
      },
      serviceDetails: {
        preferredDate: "2024-01-22",
        preferredTime: "Morning (9 AM - 12 PM)",
        budget: "$400-500",
        urgency: "Normal"
      },
      vendorInfo: {
        rating: 4.9,
        completedJobs: 127,
        responseTime: "Usually responds within 30 minutes",
        verified: true
      }
    },
    "2": {
      id: 2,
      serviceName: "Plumbing Repair",
      vendor: "Rapid Plumbers",
      vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "pending",
      urgency: "urgent",
      price: "$180",
      requestDate: "2024-01-16",
      scheduledDate: "2024-01-17",
      location: "Suburb Heights",
      description: "Kitchen sink is completely blocked and water is backing up. Need urgent plumbing repair.",
      customerInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        address: "456 Oak Ave, Suburb Heights, CA 90211"
      },
      serviceDetails: {
        preferredDate: "2024-01-17",
        preferredTime: "ASAP",
        budget: "$150-200",
        urgency: "Urgent"
      },
      vendorInfo: {
        rating: 4.7,
        completedJobs: 89,
        responseTime: "Usually responds within 15 minutes",
        verified: true
      }
    }
  };

  const request = requestId ? mockRequests[requestId as keyof typeof mockRequests] : undefined;

  if (!request) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Request Not Found</h1>
            <p className="text-lg text-gray-700 mb-8">
              The service request you are looking for does not exist.
            </p>
            <Button onClick={() => navigate('/marketplace/requests')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/marketplace/requests')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Requests
            </Button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
                  <p className="text-gray-600">Request #{request.id} - {request.serviceName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(request.status)} border`}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1 capitalize">{request.status}</span>
                </Badge>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getUrgencyColor(request.urgency)}`}></div>
                  <span className="text-sm text-gray-600 capitalize">{request.urgency}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Details */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Service Description</h3>
                    <p className="text-gray-700">{request.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Preferred Date</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(request.serviceDetails.preferredDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Preferred Time</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{request.serviceDetails.preferredTime}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Budget Range</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{request.serviceDetails.budget}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Name</h4>
                      <p className="text-gray-700">{request.customerInfo.name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-700">{request.customerInfo.email}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-700">{request.customerInfo.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-700">{request.customerInfo.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Vendor Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Service Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={request.vendorImage}
                      alt={request.vendor}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.vendor}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{request.vendorInfo.rating}</span>
                        <span className="text-sm text-gray-500">({request.vendorInfo.completedJobs} jobs)</span>
                      </div>
                      {request.vendorInfo.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs mt-1">
                          Verified Pro
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{request.vendorInfo.responseTime}</p>
                    <div className="text-2xl font-bold text-gray-900">{request.price}</div>
                  </div>
                  
                  <div className="space-y-2">
                    {(request.status === "pending" || request.status === "confirmed") && (
                      <>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => navigate(`/marketplace/chat/${encodeURIComponent(request.vendor)}`)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat with Provider
                        </Button>
                        
                        {request.status === "confirmed" && (
                          <Button
                            variant="outline"
                            className="w-full border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Provider
                          </Button>
                        )}
                      </>
                    )}
                    
                    {request.status === "pending" && (
                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Request
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Request Timeline */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Request Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                      <p className="text-xs text-gray-500">{new Date(request.requestDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {request.status !== "pending" && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Request Confirmed</p>
                        <p className="text-xs text-gray-500">Provider accepted your request</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${request.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Service Scheduled</p>
                      <p className="text-xs text-gray-500">{new Date(request.scheduledDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default ServiceRequestDetailsPage;
