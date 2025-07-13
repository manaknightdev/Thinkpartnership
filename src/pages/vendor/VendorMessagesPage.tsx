import { useState, useRef, useEffect } from "react";
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
  MoreVertical,
  Search,
  Clock,
  DollarSign,
  FileText,
  Smile,
  Menu,
  CheckCircle,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import VendorMessagesAPI, { VendorChat, VendorMessage } from "@/services/VendorMessagesAPI";

interface Message {
  id: number;
  sender: "customer" | "vendor";
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type?: "text" | "quote" | "image" | "quote_acceptance";
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

  // API state
  const [chats, setChats] = useState<VendorChat[]>([]);
  const [messages, setMessages] = useState<VendorMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Vendor's custom service tiers (created by vendor in Service Tiers page)
  const vendorServiceTiers = [
    { id: "plumbing-basic", name: "Basic Plumbing", price: 120, description: "Standard plumbing repairs and maintenance" },
    { id: "plumbing-advanced", name: "Advanced Plumbing", price: 280, description: "Emergency plumbing with 24/7 support" },
    { id: "electrical-standard", name: "Standard Electrical", price: 200, description: "Electrical installations and repairs" }
  ];

  // Specialized Services (from Specialized Service page)
  const specializedServices = [
    { id: "s001", name: "Emergency Plumbing Repair", category: "Plumbing", price: "$120", originalPrice: "$150", hasDiscount: true, status: "Active", description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes." },
    { id: "s002", name: "Interior & Exterior Painting", category: "Painting", price: "$500", hasDiscount: false, status: "Active", description: "Transform your home with high-quality interior and exterior painting services." },
    { id: "s003", name: "Full Home Inspection", category: "Inspections", price: "$225", originalPrice: "$300", hasDiscount: true, status: "Draft", description: "Comprehensive home inspections for buyers and sellers." },
    { id: "s004", name: "HVAC System Maintenance", category: "HVAC", price: "$200", hasDiscount: false, status: "Active", description: "Professional HVAC maintenance and repair services." }
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
      toast.error("Please select a flat fee service");
      return;
    }
    const service = specializedServices.find(s => s.id === selectedExistingOrder);
    toast.success(`Selected flat fee service: ${service?.id} - ${service?.name}`);

    // Send service selection message
    const serviceMessage: Message = {
      id: messages.length + 1,
      sender: "vendor",
      content: `I'd like to discuss one of my flat fee services:\n\nService: ${service?.name}\nCategory: ${service?.category}\nPrice: ${service?.price}${service?.hasDiscount && service?.originalPrice ? ` (was ${service?.originalPrice})` : ''}\nStatus: ${service?.status}\nDescription: ${service?.description}\n\nWould you like to know more about this service?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
      type: "text"
    };

    setMessages(prev => [...prev, serviceMessage]);
    setIsChooseOrderOpen(false);
    setSelectedExistingOrder("");
  };

  // Load chats from API
  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await VendorMessagesAPI.getChats();
      if (!response.error) {
        setChats(response.chats);
        // Auto-select first chat if customerId param matches or select first chat
        if (customerId) {
          const chat = response.chats.find(c => c.id.toString() === customerId);
          if (chat) {
            setSelectedChatId(chat.id);
            loadMessages(chat.id);
          }
        } else if (response.chats.length > 0) {
          setSelectedChatId(response.chats[0].id);
          loadMessages(response.chats[0].id);
        }
      } else {
        toast.error("Failed to load chats");
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a specific chat
  const loadMessages = async (chatId: number) => {
    try {
      setLoadingMessages(true);
      const response = await VendorMessagesAPI.getMessages(chatId);
      if (!response.error) {
        setMessages(response.messages);
        setTimeout(scrollToBottom, 100);
      } else {
        toast.error("Failed to load messages");
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Convert VendorChat to Customer format for UI compatibility
  const convertChatToCustomer = (chat: VendorChat): Customer => {
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return `${Math.floor(diffInHours / 24)} days ago`;
      }
    };

    return {
      id: chat.id.toString(),
      name: chat.customer_name || chat.customer_email,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`,
      lastMessage: chat.last_message || "No messages yet",
      timestamp: chat.last_message_time ? formatTime(chat.last_message_time) : "",
      unreadCount: chat.unread_count,
      status: "offline" as const,
      location: "Unknown",
      totalSpent: "$0"
    };
  };

  // Convert chats to customers for UI
  const customers = chats.map(convertChatToCustomer);

  // Convert VendorMessage to Message format for UI compatibility
  const convertApiMessageToUI = (apiMessage: VendorMessage): Message => {
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Check if this is a quote acceptance message first
    let messageType: "text" | "quote" | "image" | "quote_acceptance" = "text";
    if (apiMessage.sender_type === 0 && apiMessage.message.includes("accepted your quote")) {
      messageType = "quote_acceptance";
    } else if (apiMessage.message_type === 3) {
      messageType = "quote";
    }

    const message: Message = {
      id: apiMessage.id,
      sender: apiMessage.sender_type === 0 ? "customer" : "vendor",
      content: apiMessage.message,
      timestamp: formatTime(apiMessage.created_at),
      status: apiMessage.read_by_customer ? "read" : "sent",
      type: messageType
    };

    // Add quote data if this is a quote message
    if (apiMessage.message_type === 3 && apiMessage.quote_amount && apiMessage.quote_details) {
      try {
        const quoteDetails = typeof apiMessage.quote_details === 'string'
          ? JSON.parse(apiMessage.quote_details)
          : apiMessage.quote_details;

        message.quoteData = {
          service: quoteDetails.service || "Custom Service",
          price: `$${apiMessage.quote_amount}`,
          description: quoteDetails.description || "",
          validUntil: quoteDetails.validUntil || ""
        };
      } catch (error) {
        console.error("Error parsing quote details:", error);
      }
    }

    return message;
  };

  // Convert API messages to UI format
  const uiMessages = messages.map(convertApiMessageToUI);

  const [quoteData, setQuoteData] = useState({
    service: "Interior Painting - Living Room & Bedroom",
    price: "",
    description: "",
    validUntil: ""
  });

  // Load chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  // Set selected customer based on selected chat
  useEffect(() => {
    if (selectedChatId && customers.length > 0) {
      const customer = customers.find(c => c.id === selectedChatId.toString());
      setSelectedCustomer(customer || null);
    }
  }, [selectedChatId, customers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChatId || sending) return;

    try {
      setSending(true);
      const response = await VendorMessagesAPI.sendMessage(selectedChatId, {
        message: message.trim()
      });

      if (!response.error) {
        setMessage("");
        toast.success("Message sent!");
        // Reload messages to get the updated list
        await loadMessages(selectedChatId);
        // Reload chats to update last message
        await loadChats();
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleSendQuote = async () => {
    if (!quoteData.service || !quoteData.price || !quoteData.description) {
      toast.error("Please fill in all quote details.");
      return;
    }

    if (!selectedChatId) {
      toast.error("No chat selected.");
      return;
    }

    try {
      setSending(true);
      const response = await VendorMessagesAPI.sendQuote(selectedChatId, {
        service: quoteData.service,
        price: parseFloat(quoteData.price),
        description: quoteData.description,
        validUntil: quoteData.validUntil,
      });

      if (!response.error) {
        setShowQuoteModal(false);
        setQuoteData({ service: "", price: "", description: "", validUntil: "" });
        toast.success("Quote sent successfully!");
        // Reload messages to show the new quote
        await loadMessages(selectedChatId);
        // Reload chats to update last message
        await loadChats();
      } else {
        toast.error("Failed to send quote");
      }
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error("Failed to send quote");
    } finally {
      setSending(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    const chatId = parseInt(customer.id);
    setSelectedChatId(chatId);
    setSelectedCustomer(customer);
    navigate(`/vendor-portal/messages/${customer.id}`);
    setShowCustomerList(false);
    loadMessages(chatId);
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
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Loading chats...</div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">No chats available</div>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
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

                  </div>
                </div>
              </div>
            </div>
            ))
          )}
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
                      {selectedCustomer.status === "online" ? "Active now" : "Last seen recently"}  {selectedCustomer.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
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
                      <Button
                        onClick={handleSendQuote}
                        className="w-full"
                        disabled={sending}
                      >
                        {sending ? "Sending..." : "Send Quote"}
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
                        Choose Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choose Flat fee Service</DialogTitle>
                        <DialogDescription>
                          Select one of your Flat fee services to discuss with this customer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="existing-service">Select Flat fee Service</Label>
                          <Select value={selectedExistingOrder} onValueChange={setSelectedExistingOrder}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose from your flat fee services" />
                            </SelectTrigger>
                            <SelectContent>
                              {specializedServices.filter(service => service.status === "Active").map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">{service.name}</span>
                                    <span className="text-sm text-gray-500">{service.category} - {service.price}{service.hasDiscount && service.originalPrice ? ` (was ${service.originalPrice})` : ''}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Note:</strong> These are your active flat fee services from your Flat fee Service page. Use this to discuss your service offerings with customers.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsChooseOrderOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleChooseOrder}>
                            Choose Service
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
              {loadingMessages ? (
                <div className="flex justify-center items-center h-32">
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              ) : uiMessages.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <div className="text-gray-500">No messages yet</div>
                </div>
              ) : (
                uiMessages.map((msg) => (
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
                      <Card className="bg-white border border-gray-200 shadow-sm max-w-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-sm font-semibold text-gray-900">Quote Proposal</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-base">{msg.quoteData.service}</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">
                              {msg.quoteData.price.replace('$', '')}
                              <span className="text-sm font-normal text-gray-500 ml-1">USD</span>
                            </p>
                          </div>
                          {msg.quoteData.description && (
                            <p className="text-sm text-gray-600">{msg.quoteData.description}</p>
                          )}
                          {msg.quoteData.validUntil && (
                            <div className="flex items-center text-xs text-gray-500 border-t pt-2">
                              <Clock className="h-3 w-3 mr-1" />
                              Valid until {new Date(msg.quoteData.validUntil).toLocaleDateString()}
                            </div>
                          )}
                          {msg.sender === "vendor" && (
                            <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Quote sent successfully
                            </div>
                          )}
                          {msg.type === "quote_acceptance" && (
                            <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Quote accepted & paid
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
                ))
              )}

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
                  disabled={!message.trim() || !selectedChatId || sending}
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
