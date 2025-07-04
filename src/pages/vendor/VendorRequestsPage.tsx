import React, { useState, useEffect } from "react";
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
  Loader2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import VendorRequestsAPI, { VendorRequest, SendQuoteData } from "@/services/VendorRequestsAPI";
import { showSuccess, showError } from "@/utils/toast";

const VendorRequestsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<VendorRequest | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingQuote, setIsSendingQuote] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [quoteData, setQuoteData] = useState<SendQuoteData>({
    vendor_quote: 0,
    quote_description: "",
    quote_expires_at: "",
    estimated_completion_time: "",
    terms_conditions: "",
  });

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
  }, [pagination.page, statusFilter, urgencyFilter]);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      setError("");

      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? getStatusNumber(statusFilter) : undefined,
        urgency: urgencyFilter !== "all" ? urgencyFilter : undefined,
      };

      const response = await VendorRequestsAPI.getRequests(filters);

      if (response.error) {
        setError(response.message || "Failed to load requests");
        return;
      }

      setRequests(response.requests);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusNumber = (status: string): number => {
    switch (status) {
      case "new": return 0;
      case "viewed": return 1;
      case "quoted": return 2;
      case "accepted": return 3;
      case "in_progress": return 4;
      case "completed": return 5;
      case "declined": return 6;
      default: return 0;
    }
  };

  const getStatusString = (status: number): string => {
    switch (status) {
      case 0: return "new";
      case 1: return "viewed";
      case 2: return "quoted";
      case 3: return "accepted";
      case 4: return "in_progress";
      case 5: return "completed";
      case 6: return "declined";
      default: return "new";
    }
  };

  const handleSendQuote = async () => {
    if (!selectedRequest) return;

    try {
      setIsSendingQuote(true);
      setError("");

      const response = await VendorRequestsAPI.sendQuote(selectedRequest.id, quoteData);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
      }

      showSuccess("Quote sent successfully!");
      setShowQuoteModal(false);
      resetQuoteData();
      await loadRequests();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send quote";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSendingQuote(false);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const response = await VendorRequestsAPI.acceptRequest(requestId);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("Request accepted successfully!");
      await loadRequests();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleDeclineRequest = async (requestId: number, reason?: string) => {
    try {
      const response = await VendorRequestsAPI.declineRequest(requestId, reason);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("Request declined successfully!");
      await loadRequests();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to decline request");
    }
  };

  const handleCompleteRequest = async (requestId: number) => {
    try {
      const response = await VendorRequestsAPI.completeRequest(requestId);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("Request marked as completed!");
      await loadRequests();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to complete request");
    }
  };

  const resetQuoteData = () => {
    setQuoteData({
      vendor_quote: 0,
      quote_description: "",
      quote_expires_at: "",
      estimated_completion_time: "",
      terms_conditions: "",
    });
  };

  const openQuoteModal = (request: VendorRequest) => {
    setSelectedRequest(request);
    setShowQuoteModal(true);
  };

  const getStatusColor = (status: number) => {
    const statusString = getStatusString(status);
    switch (statusString) {
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

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleChatWithCustomer = (customerName: string) => {
    // Navigate to messages with customer
    navigate(`/vendor-portal/messages/${customerName.toLowerCase().replace(' ', '-')}`);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.service_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || getStatusString(request.status) === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const statusCounts = {
    all: requests.length,
    new: requests.filter(r => r.status === 0).length,
    viewed: requests.filter(r => r.status === 1).length,
    quoted: requests.filter(r => r.status === 2).length,
    accepted: requests.filter(r => r.status === 3).length,
    in_progress: requests.filter(r => r.status === 4).length,
    completed: requests.filter(r => r.status === 5).length,
    declined: requests.filter(r => r.status === 6).length,
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

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

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
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{request.service_title}</h3>
                          <Badge className={cn("text-xs", getStatusColor(request.status))}>
                            {getStatusString(request.status).replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{request.customer_name}</span>
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
                          <span>${request.budget_min} - ${request.budget_max}</span>
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
                        <span>{new Date(request.preferred_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{request.preferred_time}</span>
                      </div>
                      {request.vendor_quote && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          <span>Quoted: ${request.vendor_quote}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {request.status === 0 && (
                        <>
                          <Dialog open={showQuoteModal && selectedRequest?.id === request.id} onOpenChange={setShowQuoteModal}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => openQuoteModal(request)}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Send Quote
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Send Quote to {request.customer_name}</DialogTitle>
                                <DialogDescription>
                                  Create a detailed quote for this service request.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="quote-price">Quote Amount *</Label>
                                  <Input
                                    id="quote-price"
                                    type="number"
                                    value={quoteData.vendor_quote}
                                    onChange={(e) => setQuoteData({...quoteData, vendor_quote: parseFloat(e.target.value) || 0})}
                                    placeholder="450"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="quote-description">Quote Description *</Label>
                                  <Textarea
                                    id="quote-description"
                                    value={quoteData.quote_description}
                                    onChange={(e) => setQuoteData({...quoteData, quote_description: e.target.value})}
                                    placeholder="Detailed description of work included..."
                                    rows={3}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="quote-valid">Quote Expires At</Label>
                                    <Input
                                      id="quote-valid"
                                      type="date"
                                      value={quoteData.quote_expires_at}
                                      onChange={(e) => setQuoteData({...quoteData, quote_expires_at: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="quote-duration">Estimated Completion Time</Label>
                                    <Input
                                      id="quote-duration"
                                      value={quoteData.estimated_completion_time}
                                      onChange={(e) => setQuoteData({...quoteData, estimated_completion_time: e.target.value})}
                                      placeholder="e.g., 2-3 days"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="terms">Terms & Conditions</Label>
                                  <Textarea
                                    id="terms"
                                    value={quoteData.terms_conditions}
                                    onChange={(e) => setQuoteData({...quoteData, terms_conditions: e.target.value})}
                                    placeholder="Payment terms, warranty, etc..."
                                    rows={2}
                                  />
                                </div>
                              </div>
                              <Button
                                onClick={handleSendQuote}
                                disabled={isSendingQuote}
                                className="w-full"
                              >
                                {isSendingQuote ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending Quote...
                                  </>
                                ) : (
                                  "Send Quote"
                                )}
                              </Button>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}

                      {request.status === 2 && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            Quote Sent (${request.vendor_quote}) - Awaiting Customer Response
                          </Badge>
                          {request.quote_sent_at && (
                            <span className="text-xs text-gray-500">
                              Sent on {new Date(request.quote_sent_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === 3 && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Start Work
                          </Button>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Customer Confirmed (${request.vendor_quote})
                          </Badge>
                          {request.accepted_at && (
                            <span className="text-xs text-gray-500">
                              Accepted on {new Date(request.accepted_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === 4 && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => handleCompleteRequest(request.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                            Work in Progress
                          </Badge>
                          {request.started_at && (
                            <span className="text-xs text-gray-500">
                              Started on {new Date(request.started_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === 5 && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                            ✅ Work Completed
                          </Badge>
                          {request.completed_at && (
                            <span className="text-xs text-gray-500">
                              Completed on {new Date(request.completed_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}

                      {request.status === 6 && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          ❌ Request Declined
                        </Badge>
                      )}

                      {/* Chat button - available for all active statuses */}
                      {![6, 5].includes(request.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleChatWithCustomer(request.customer_name)}
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
                        onClick={() => window.open(`tel:${request.customer_phone}`)}
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

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} requests
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRequestsPage;
