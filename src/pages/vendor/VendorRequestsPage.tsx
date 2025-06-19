import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Eye,
  Filter,
  Search,
  Send,
  ThumbsUp,
  ThumbsDown,

  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ServiceRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar: string;
  serviceName: string;
  description: string;
  location: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  urgency: "low" | "normal" | "high" | "urgent";
  budget: string;
  status: "new" | "viewed" | "quoted" | "accepted" | "in_progress" | "completed" | "declined";
  customerStatus: "submitted" | "pending" | "quoted" | "confirmed" | "in_progress" | "completed" | "cancelled";
  requestDate: string;
  lastUpdated: string;

  isRepeatCustomer: boolean;
  quoteAmount?: string;
  quoteSentDate?: string;
  acceptedDate?: string;
  startedDate?: string;
  completedDate?: string;
}

const VendorRequestsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    price: "",
    description: "",
    validUntil: "",
    estimatedDuration: ""
  });

  // Mock service requests data
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: "req001",
      customerName: "John Doe",
      customerEmail: "john.doe@example.com",
      customerPhone: "(555) 123-4567",
      customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      serviceName: "Interior Painting",
      description: "Need interior painting for living room (300 sq ft) and bedroom (250 sq ft). Looking for neutral colors - light gray for living room and soft beige for bedroom. Quality paint preferred.",
      location: "Downtown Area",
      address: "123 Main St, Downtown Area, CA 90210",
      preferredDate: "2024-01-25",
      preferredTime: "Morning (9AM-12PM)",
      urgency: "normal",
      budget: "$400-600",
      status: "new",
      customerStatus: "pending",
      requestDate: "2024-01-20",
      lastUpdated: "2024-01-20",

      isRepeatCustomer: false
    },
    {
      id: "req002",
      customerName: "Sarah Wilson",
      customerEmail: "sarah.wilson@example.com",
      customerPhone: "(555) 987-6543",
      customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      serviceName: "Emergency Plumbing Repair",
      description: "Kitchen sink is completely blocked and water is backing up. Need urgent plumbing repair ASAP. This is affecting daily activities.",
      location: "Suburbs",
      address: "456 Oak Ave, Suburbs, CA 90211",
      preferredDate: "2024-01-21",
      preferredTime: "ASAP",
      urgency: "urgent",
      budget: "$150-250",
      status: "quoted",
      customerStatus: "quoted",
      requestDate: "2024-01-20",
      lastUpdated: "2024-01-20",

      isRepeatCustomer: true,
      quoteAmount: "$180",
      quoteSentDate: "2024-01-20"
    },
    {
      id: "req003",
      customerName: "Mike Johnson",
      customerEmail: "mike.johnson@example.com",
      customerPhone: "(555) 456-7890",
      customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      serviceName: "Bathroom Renovation",
      description: "Complete bathroom renovation including tiles, fixtures, and plumbing. Looking for modern design with quality materials.",
      location: "Industrial District",
      address: "789 Industrial Blvd, Industrial District, CA 90212",
      preferredDate: "2024-02-01",
      preferredTime: "Flexible",
      urgency: "normal",
      budget: "$2000-3000",
      status: "accepted",
      customerStatus: "confirmed",
      requestDate: "2024-01-19",
      lastUpdated: "2024-01-20",

      isRepeatCustomer: false,
      quoteAmount: "$2,450",
      quoteSentDate: "2024-01-19",
      acceptedDate: "2024-01-20"
    },
    {
      id: "req004",
      customerName: "Emily Chen",
      customerEmail: "emily.chen@example.com",
      customerPhone: "(555) 321-0987",
      customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      serviceName: "Kitchen Cabinet Painting",
      description: "Paint existing kitchen cabinets. Currently oak finish, want to change to white. About 20 cabinet doors and drawers.",
      location: "Downtown Area",
      address: "321 Pine St, Downtown Area, CA 90210",
      preferredDate: "2024-01-28",
      preferredTime: "Afternoon (1PM-5PM)",
      urgency: "low",
      budget: "$300-500",
      status: "in_progress",
      customerStatus: "in_progress",
      requestDate: "2024-01-18",
      lastUpdated: "2024-01-21",

      isRepeatCustomer: false,
      quoteAmount: "$420",
      quoteSentDate: "2024-01-18",
      acceptedDate: "2024-01-19",
      startedDate: "2024-01-21"
    },
    {
      id: "req005",
      customerName: "David Martinez",
      customerEmail: "david.martinez@example.com",
      customerPhone: "(555) 654-3210",
      customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      serviceName: "Deck Staining",
      description: "Stain and seal wooden deck. About 400 sq ft. Deck needs cleaning first, then staining with weather-resistant stain.",
      location: "Suburbs",
      address: "567 Maple Dr, Suburbs, CA 90211",
      preferredDate: "2024-01-30",
      preferredTime: "Weekend",
      urgency: "normal",
      budget: "$200-400",
      status: "completed",
      customerStatus: "completed",
      requestDate: "2024-01-15",
      lastUpdated: "2024-01-19",

      isRepeatCustomer: true,
      quoteAmount: "$320",
      quoteSentDate: "2024-01-15",
      acceptedDate: "2024-01-16",
      startedDate: "2024-01-18",
      completedDate: "2024-01-19"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "viewed": return "bg-yellow-100 text-yellow-800";
      case "quoted": return "bg-purple-100 text-purple-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-indigo-100 text-indigo-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "low": return "bg-green-500";
      case "normal": return "bg-blue-500";
      case "high": return "bg-orange-500";
      case "urgent": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "urgent": return <Zap className="h-4 w-4" />;
      case "high": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    const currentDate = new Date().toISOString().split('T')[0];

    // Map vendor status to customer status
    const getCustomerStatus = (vendorStatus: string) => {
      switch (vendorStatus) {
        case "new": return "pending";
        case "viewed": return "pending";
        case "quoted": return "quoted";
        case "accepted": return "confirmed";
        case "in_progress": return "in_progress";
        case "completed": return "completed";
        case "declined": return "cancelled";
        default: return "pending";
      }
    };

    setRequests(requests.map(req => {
      if (req.id === requestId) {
        const updatedRequest = {
          ...req,
          status: newStatus as any,
          customerStatus: getCustomerStatus(newStatus) as any,
          lastUpdated: currentDate
        };

        // Add timestamps for specific status changes
        if (newStatus === "accepted" && !req.acceptedDate) {
          updatedRequest.acceptedDate = currentDate;
        }
        if (newStatus === "in_progress" && !req.startedDate) {
          updatedRequest.startedDate = currentDate;
        }
        if (newStatus === "completed" && !req.completedDate) {
          updatedRequest.completedDate = currentDate;
        }

        return updatedRequest;
      }
      return req;
    }));

    // Show appropriate success message
    const statusMessages = {
      "viewed": "Request marked as viewed",
      "quoted": "Quote sent to customer",
      "accepted": "Request accepted - customer will be notified",
      "in_progress": "Work started - customer can track progress",
      "completed": "Work completed - customer will be notified",
      "declined": "Request declined - customer will be notified"
    };

    toast.success(statusMessages[newStatus as keyof typeof statusMessages] || `Status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleSendQuote = () => {
    if (selectedRequest && quoteData.price && quoteData.description) {
      const currentDate = new Date().toISOString().split('T')[0];

      // Update the request with quote information
      setRequests(requests.map(req => {
        if (req.id === selectedRequest.id) {
          return {
            ...req,
            status: "quoted" as any,
            customerStatus: "quoted" as any,
            lastUpdated: currentDate,
            quoteAmount: quoteData.price,
            quoteSentDate: currentDate
          };
        }
        return req;
      }));

      setShowQuoteModal(false);
      setQuoteData({ price: "", description: "", validUntil: "", estimatedDuration: "" });
      setSelectedRequest(null);
      toast.success("Quote sent successfully! Customer will be notified.");
    } else {
      toast.error("Please fill in all required quote details.");
    }
  };

  const handleChatWithCustomer = (customerName: string) => {
    // Navigate to messages with customer
    navigate(`/vendor-portal/messages/${customerName.toLowerCase().replace(' ', '-')}`);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const statusCounts = {
    all: requests.length,
    new: requests.filter(r => r.status === "new").length,
    viewed: requests.filter(r => r.status === "viewed").length,
    quoted: requests.filter(r => r.status === "quoted").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    in_progress: requests.filter(r => r.status === "in_progress").length,
    completed: requests.filter(r => r.status === "completed").length,
    declined: requests.filter(r => r.status === "declined").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage customer service requests and grow your business.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {statusCounts.new} new requests
          </Badge>
        </div>
      </div>

      {/* Workflow Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Request Workflow</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline" className="bg-white">1. New → View Request</Badge>
            <Badge variant="outline" className="bg-white">2. Send Quote → Customer Reviews</Badge>
            <Badge variant="outline" className="bg-white">3. Customer Confirms → Start Work</Badge>
            <Badge variant="outline" className="bg-white">4. Mark Complete → Get Paid</Badge>
          </div>
          <p className="text-blue-700 text-sm mt-2">
            💡 Tip: Respond quickly to new requests to increase your acceptance rate!
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Requests</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.new}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-indigo-600">{statusCounts.in_progress}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                <SelectItem value="new">New ({statusCounts.new})</SelectItem>
                <SelectItem value="viewed">Viewed ({statusCounts.viewed})</SelectItem>
                <SelectItem value="quoted">Quoted ({statusCounts.quoted})</SelectItem>
                <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                <SelectItem value="in_progress">In Progress ({statusCounts.in_progress})</SelectItem>
                <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
                <SelectItem value="declined">Declined ({statusCounts.declined})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || urgencyFilter !== "all"
                  ? "Try adjusting your filters to see more requests."
                  : "You don't have any service requests yet. Customers will see your services in the marketplace."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative">
                    <img
                      src={request.customerAvatar}
                      alt={request.customerName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {request.isRepeatCustomer && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">R</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{request.serviceName}</h3>
                          <Badge className={cn("text-xs", getStatusColor(request.status))}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Customer sees: {request.customerStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{request.customerName}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <div className={cn("w-2 h-2 rounded-full", getUrgencyColor(request.urgency))}></div>
                            <span className="text-sm text-gray-600 capitalize">{request.urgency}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600 font-semibold mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{request.budget}</span>
                        </div>
                        <p className="text-sm text-gray-500">Budget</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{request.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(request.preferredDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{request.preferredTime}</span>
                      </div>
                      {request.quoteAmount && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          <span>Quoted: {request.quoteAmount}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {request.status === "new" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(request.id, "viewed")}
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Mark as Viewed
                          </Button>
                          <Dialog open={showQuoteModal && selectedRequest?.id === request.id} onOpenChange={setShowQuoteModal}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Send Quote
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Send Quote to {request.customerName}</DialogTitle>
                                <DialogDescription>
                                  Create a detailed quote for this service request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="quote-price">Price *</Label>
                                  <Input
                                    id="quote-price"
                                    value={quoteData.price}
                                    onChange={(e) => setQuoteData({...quoteData, price: e.target.value})}
                                    placeholder="e.g., $450"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="quote-description">Description *</Label>
                                  <Textarea
                                    id="quote-description"
                                    value={quoteData.description}
                                    onChange={(e) => setQuoteData({...quoteData, description: e.target.value})}
                                    placeholder="Detailed description of work included..."
                                    rows={3}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="quote-valid">Valid Until</Label>
                                    <Input
                                      id="quote-valid"
                                      type="date"
                                      value={quoteData.validUntil}
                                      onChange={(e) => setQuoteData({...quoteData, validUntil: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="quote-duration">Estimated Duration</Label>
                                    <Input
                                      id="quote-duration"
                                      value={quoteData.estimatedDuration}
                                      onChange={(e) => setQuoteData({...quoteData, estimatedDuration: e.target.value})}
                                      placeholder="e.g., 2-3 days"
                                    />
                                  </div>
                                </div>
                              </div>
                              <Button onClick={handleSendQuote} className="w-full">
                                Send Quote
                              </Button>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(request.id, "declined")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}

                      {request.status === "viewed" && (
                        <>
                          <Dialog open={showQuoteModal && selectedRequest?.id === request.id} onOpenChange={setShowQuoteModal}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Send Quote
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(request.id, "declined")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}

                      {request.status === "quoted" && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            Quote Sent ({request.quoteAmount}) - Awaiting Customer Response
                          </Badge>
                          {request.quoteSentDate && (
                            <span className="text-xs text-gray-500">
                              Sent on {new Date(request.quoteSentDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === "accepted" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(request.id, "in_progress")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Start Work
                          </Button>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Customer Confirmed ({request.quoteAmount})
                          </Badge>
                          {request.acceptedDate && (
                            <span className="text-xs text-gray-500">
                              Accepted on {new Date(request.acceptedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === "in_progress" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => handleStatusUpdate(request.id, "completed")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                            Work in Progress
                          </Badge>
                          {request.startedDate && (
                            <span className="text-xs text-gray-500">
                              Started on {new Date(request.startedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === "completed" && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            ✅ Work Completed
                          </Badge>
                          {request.completedDate && (
                            <span className="text-xs text-gray-500">
                              Completed on {new Date(request.completedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === "declined" && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          ❌ Request Declined
                        </Badge>
                      )}

                      {/* Chat button - available for all active statuses */}
                      {!["declined", "completed"].includes(request.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleChatWithCustomer(request.customerName)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                      )}

                      {/* Phone button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => window.open(`tel:${request.customerPhone}`)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorRequestsPage;
