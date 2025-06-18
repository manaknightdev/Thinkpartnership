import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  FileText,
  Smile,
  Paperclip,
  ArrowLeft,
  Menu,
  CheckCircle,
  AlertCircle,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: number;
  sender: "customer" | "vendor";
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type?: "text" | "quote" | "image";
  quoteData?: {
    service: string;
    price: string;
    description: string;
    validUntil: string;
  };
}

interface Customer {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: "online" | "offline";
  location: string;
  rating?: number;
  totalSpent?: string;
}

const VendorMessagesPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(true);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isChooseOrderOpen, setIsChooseOrderOpen] = useState(false);
  const [selectedServiceTier, setSelectedServiceTier] = useState("");
  const [selectedExistingOrder, setSelectedExistingOrder] = useState("");

  // Vendor's custom service tiers (created by vendor in Service Tiers page)
  const vendorServiceTiers = [
    { id: "plumbing-basic", name: "Basic Plumbing", price: 120, description: "Standard plumbing repairs and maintenance" },
    { id: "plumbing-premium", name: "Premium Plumbing", price: 280, description: "Emergency plumbing with 24/7 support" },
    { id: "electrical-standard", name: "Standard Electrical", price: 200, description: "Electrical installations and repairs" }
  ];

  // Orders from Service Listings (Specialized Service) page
  const serviceListingOrders = [
    { id: "SL001", service: "Emergency Drain Cleaning", category: "Plumbing", price: 150, customer: "John Doe", status: "Active", dateCreated: "2024-01-15" },
    { id: "SL002", service: "Interior House Painting", category: "Painting", price: 800, customer: "Jane Smith", status: "Completed", dateCreated: "2024-01-10" },
    { id: "SL003", service: "HVAC System Maintenance", category: "HVAC", price: 200, customer: "Bob Johnson", status: "In Progress", dateCreated: "2024-01-12" },
    { id: "SL004", service: "Electrical Panel Upgrade", category: "Electrical", price: 1200, customer: "Alice Wilson", status: "Pending", dateCreated: "2024-01-18" }
  ];

  const handleCreateOrder = () => {
    if (!selectedServiceTier || !selectedCustomer) {
      toast.error("Please select a service tier");
      return;
    }
    const tier = vendorServiceTiers.find(t => t.id === selectedServiceTier);
    const orderId = `ORD${Date.now().toString().slice(-6)}`;

    // Create a new order using vendor's custom tier
    toast.success(`New order created! Order ID: ${orderId} - ${tier?.name} ($${tier?.price}) for ${selectedCustomer.name}`);

    // Send order creation message
    const orderMessage: Message = {
      id: messages.length + 1,
      sender: "vendor",
      content: `I've created a new order for you using my custom service tier:\n\nOrder ID: ${orderId}\nService Tier: ${tier?.name}\nPrice: $${tier?.price}\nDescription: ${tier?.description}\n\nPlease confirm to proceed.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
      type: "text"
    };

    setMessages(prev => [...prev, orderMessage]);
    setIsCreateOrderOpen(false);
    setSelectedServiceTier("");
  };

  const handleChooseOrder = () => {
    if (!selectedExistingOrder || !selectedCustomer) {
      toast.error("Please select an existing service listing order");
      return;
    }
    const order = serviceListingOrders.find(o => o.id === selectedExistingOrder);
    toast.success(`Selected service listing order: ${order?.id} - ${order?.service}`);

    // Send order selection message
    const orderMessage: Message = {
      id: messages.length + 1,
      sender: "vendor",
      content: `I've selected an existing order from my service listings:\n\nOrder ID: ${order?.id}\nService: ${order?.service}\nCategory: ${order?.category}\nPrice: $${order?.price}\nStatus: ${order?.status}\nCreated: ${order?.dateCreated}\n\nLet's discuss this service.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
      type: "text"
    };

    setMessages(prev => [...prev, orderMessage]);
    setIsChooseOrderOpen(false);
    setSelectedExistingOrder("");
  };

  // Mock customers data
  const [customers] = useState<Customer[]>([
    {
      id: "c1",
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Hello! I need interior painting for my living room and bedroom. Can you provide a quote?",
      timestamp: "10:32 AM",
      unreadCount: 2,
      status: "online",
      location: "Downtown Area",
      rating: 4.8,
      totalSpent: "$2,450"
    },
    {
      id: "c2",
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Thank you for the quick response! When can you start?",
      timestamp: "Yesterday",
      unreadCount: 0,
      status: "offline",
      location: "Suburbs",
      rating: 5.0,
      totalSpent: "$1,200"
    },
    {
      id: "c3",
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      lastMessage: "I accept your quote! Let's schedule the work.",
      timestamp: "2 days ago",
      unreadCount: 1,
      status: "online",
      location: "Industrial District",
      rating: 4.9,
      totalSpent: "$3,800"
    },
    {
      id: "c4",
      name: "Emily Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      lastMessage: "Could you send me some references from previous work?",
      timestamp: "3 days ago",
      unreadCount: 0,
      status: "offline",
      location: "Downtown Area",
      rating: 4.7,
      totalSpent: "$950"
    }
  ]);

  // Mock messages for selected customer
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "customer",
      content: "Hello! I need interior painting for my living room and bedroom. Can you provide a quote?",
      timestamp: "10:32 AM",
      status: "read",
      type: "text"
    },
    {
      id: 2,
      sender: "vendor",
      content: "Hi John! Thanks for reaching out. I'd be happy to help with your painting project. Could you tell me the approximate square footage of both rooms?",
      timestamp: "10:35 AM",
      status: "read",
      type: "text"
    },
    {
      id: 3,
      sender: "customer",
      content: "The living room is about 300 sq ft and the bedroom is 250 sq ft. I'm looking for neutral colors, maybe light gray or beige.",
      timestamp: "10:38 AM",
      status: "read",
      type: "text"
    }
  ]);

  const [quoteData, setQuoteData] = useState({
    service: "Interior Painting - Living Room & Bedroom",
    price: "",
    description: "",
    validUntil: ""
  });

  // Set selected customer based on URL param or default to first customer
  useEffect(() => {
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      setSelectedCustomer(customer || customers[0]);
    } else {
      setSelectedCustomer(customers[0]);
    }
  }, [customerId, customers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "vendor",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent",
        type: "text"
      };
      
      setMessages([...messages, newMessage]);
      setMessage("");
      toast.success("Message sent!");
      
      // Simulate customer typing response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const customerResponse: Message = {
            id: messages.length + 2,
            sender: "customer",
            content: "Thanks for the quick response!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "read",
            type: "text"
          };
          setMessages(prev => [...prev, customerResponse]);
        }, 2000);
      }, 500);
    }
  };

  const handleSendQuote = () => {
    if (quoteData.service && quoteData.price && quoteData.description) {
      const quoteMessage: Message = {
        id: messages.length + 1,
        sender: "vendor",
        content: "I've prepared a quote for your project:",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent",
        type: "quote",
        quoteData: quoteData
      };
      
      setMessages([...messages, quoteMessage]);
      setShowQuoteModal(false);
      setQuoteData({ service: "", price: "", description: "", validUntil: "" });
      toast.success("Quote sent successfully!");
    } else {
      toast.error("Please fill in all quote details.");
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    navigate(`/vendor-portal/messages/${customer.id}`);
    setShowCustomerList(false);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnreadCount = customers.reduce((sum, customer) => sum + customer.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
      {/* Customer List Sidebar */}
      <div className={cn(
        "w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        showCustomerList ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {totalUnreadCount} unread
            </Badge>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => handleCustomerSelect(customer)}
              className={cn(
                "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                selectedCustomer?.id === customer.id ? "bg-blue-50 border-blue-200" : ""
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full",
                    customer.status === "online" ? "bg-green-500" : "bg-gray-400"
                  )}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{customer.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{customer.timestamp}</span>
                      {customer.unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                          {customer.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{customer.lastMessage}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{customer.location}</span>
                    {customer.rating && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">{customer.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomerList(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full",
                      selectedCustomer.status === "online" ? "bg-green-500" : "bg-gray-400"
                    )}></div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedCustomer.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedCustomer.status === "online" ? "Active now" : "Last seen recently"} • {selectedCustomer.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Customer Info Bar */}
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-700">{selectedCustomer.rating} rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{selectedCustomer.totalSpent} total spent</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Send Quote Button */}
                  <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <FileText className="h-4 w-4 mr-1" />
                        Send Quote
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Send Quote to {selectedCustomer.name}</DialogTitle>
                        <DialogDescription>
                          Create a detailed quote for your customer's project.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="quote-service">Service</Label>
                          <Input
                            id="quote-service"
                            value={quoteData.service}
                            onChange={(e) => setQuoteData({...quoteData, service: e.target.value})}
                            placeholder="e.g., Interior Painting - Living Room & Bedroom"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quote-price">Price</Label>
                          <Input
                            id="quote-price"
                            value={quoteData.price}
                            onChange={(e) => setQuoteData({...quoteData, price: e.target.value})}
                            placeholder="e.g., $850"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quote-description">Description</Label>
                          <Textarea
                            id="quote-description"
                            value={quoteData.description}
                            onChange={(e) => setQuoteData({...quoteData, description: e.target.value})}
                            placeholder="Detailed description of work included..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quote-valid">Valid Until</Label>
                          <Input
                            id="quote-valid"
                            type="date"
                            value={quoteData.validUntil}
                            onChange={(e) => setQuoteData({...quoteData, validUntil: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={handleSendQuote} className="w-full">
                        Send Quote
                      </Button>
                    </DialogContent>
                  </Dialog>

                  {/* Create Order Button */}
                  <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Order</DialogTitle>
                        <DialogDescription>
                          Create a new order for {selectedCustomer?.name} using your custom service tiers. This will generate a new order ID and send the details to the customer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="service-tier">Select Your Service Tier</Label>
                          <Select value={selectedServiceTier} onValueChange={setSelectedServiceTier}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose from your custom service tiers" />
                            </SelectTrigger>
                            <SelectContent>
                              {vendorServiceTiers.map((tier) => (
                                <SelectItem key={tier.id} value={tier.id}>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{tier.name} - ${tier.price}</span>
                                    <span className="text-sm text-gray-500">{tier.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> These are your custom service tiers created in the Service page. This will create a new order using the selected tier.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateOrder}>
                            Create New Order
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Choose Order Button */}
                  <Dialog open={isChooseOrderOpen} onOpenChange={setIsChooseOrderOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Choose Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choose Order from Service Listings</DialogTitle>
                        <DialogDescription>
                          Select an existing order from your Service Listings (Specialized Service) to reference in this conversation.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="existing-order">Select Service Listing Order</Label>
                          <Select value={selectedExistingOrder} onValueChange={setSelectedExistingOrder}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose from your service listings orders" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceListingOrders.map((order) => (
                                <SelectItem key={order.id} value={order.id}>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{order.id} - {order.service}</span>
                                    <span className="text-sm text-gray-500">{order.category} - ${order.price} ({order.status})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Note:</strong> These are orders from your Service Listings (Specialized Service) page. Use this to discuss existing services you've created.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsChooseOrderOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleChooseOrder}>
                            Choose Order
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "vendor" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-sm lg:max-w-md ${msg.sender === "vendor" ? "order-2" : "order-1"}`}>
                    {msg.sender === "customer" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <img
                          src={selectedCustomer.avatar}
                          alt={selectedCustomer.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-gray-500">{selectedCustomer.name}</span>
                      </div>
                    )}

                    {msg.type === "quote" && msg.quoteData ? (
                      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            Quote Proposal
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="font-semibold text-gray-900">{msg.quoteData.service}</p>
                            <p className="text-2xl font-bold text-blue-600">{msg.quoteData.price}</p>
                          </div>
                          <p className="text-sm text-gray-700">{msg.quoteData.description}</p>
                          {msg.quoteData.validUntil && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Valid until {new Date(msg.quoteData.validUntil).toLocaleDateString()}
                            </div>
                          )}
                          {msg.sender === "vendor" && (
                            <div className="flex items-center text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Quote sent successfully
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.sender === "vendor"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    )}

                    <div className={`flex items-center mt-1 space-x-1 ${
                      msg.sender === "vendor" ? "justify-end" : "justify-start"
                    }`}>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                      {msg.sender === "vendor" && (
                        <div className="flex items-center">
                          {msg.status === "sent" && <Clock className="h-3 w-3 text-gray-400" />}
                          {msg.status === "delivered" && <CheckCircle className="h-3 w-3 text-gray-400" />}
                          {msg.status === "read" && <CheckCircle className="h-3 w-3 text-blue-500" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <img
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>



            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Paperclip className="h-5 w-5" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a customer to start messaging</h3>
              <p className="text-gray-600">Choose a customer from the list to view your conversation.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorMessagesPage;
