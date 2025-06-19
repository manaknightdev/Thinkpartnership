import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Menu,
  Home,
  Grid3X3,
  List,
  Settings,
  HelpCircle,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  MessageCircle,
  Percent
} from "lucide-react";

const ChatPage = () => {
  const { vendorName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requestCount] = useState(2);
  const [notificationCount] = useState(3);
  const [userName] = useState("John Doe");

  // Mock vendor data
  const vendor = {
    name: decodeURIComponent(vendorName || ""),
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    status: "online",
    lastSeen: "Active now",

    completedJobs: 127,
    responseTime: "Usually responds within 30 minutes",
    location: "Downtown Area"
  };

  // Mock messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "vendor",
      content: "Hi! Thanks for your interest in my painting services. I'd be happy to help with your project.",
      timestamp: "10:30 AM",
      status: "read"
    },
    {
      id: 2,
      sender: "user",
      content: "Hello! I need interior painting for my living room and bedroom. Can you provide a quote?",
      timestamp: "10:32 AM",
      status: "read"
    },
    {
      id: 3,
      sender: "vendor",
      content: "Absolutely! Could you tell me the approximate square footage of both rooms? Also, do you have any color preferences?",
      timestamp: "10:35 AM",
      status: "read"
    },
    {
      id: 4,
      sender: "user",
      content: "The living room is about 300 sq ft and bedroom is 200 sq ft. I'm thinking neutral colors - maybe light gray for living room and soft beige for bedroom.",
      timestamp: "10:38 AM",
      status: "read"
    },
    {
      id: 5,
      sender: "vendor",
      content: "Perfect! For 500 sq ft with quality paint and professional application, I can offer this for $450. This includes all materials, prep work, and cleanup. When would you like to schedule?",
      timestamp: "10:42 AM",
      status: "delivered"
    },
    {
      id: 6,
      sender: "vendor",
      type: "quote",
      content: {
        title: "Interior Painting Quote",
        description: "Living room (300 sq ft) + Bedroom (200 sq ft)",
        price: "$450",
        includes: [
          "Premium quality paint",
          "Surface preparation",
          "Professional application",
          "Complete cleanup",
          "1-year warranty"
        ],
        timeline: "2-3 days",
        validUntil: "Valid for 30 days"
      },
      timestamp: "10:45 AM",
      status: "delivered"
    }
  ]);

  // Marketplace sidebar items
  const sidebarItems = [
    { name: "Browse", path: "/marketplace", icon: Home, exact: true },
    { name: "Categories", path: "/marketplace/categories", icon: Grid3X3 },
    { name: "All Services", path: "/marketplace/services", icon: List },
    { name: "Messages", path: "/marketplace/chat/Certified%20Inspectors%20Inc.", icon: MessageCircle },
    { name: "Account", path: "/marketplace/account", icon: Settings },
    { name: "Help", path: "/marketplace/help", icon: HelpCircle },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Quick reply suggestions
  const quickReplies = [
    "When can you start?",
    "What's included in the price?",
    "Do you have references?",
    "Can we schedule a call?",
    "Send me your portfolio",
    "I accept this quote",
    "Can you adjust the price?",
    "What about materials?",
    "Do you offer warranty?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user" as const,
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent" as const
      };
      
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Simulate vendor typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate vendor response
        const vendorResponse = {
          id: messages.length + 2,
          sender: "vendor" as const,
          content: "Thanks for your message! Let me get back to you with more details.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "read" as const
        };
        setMessages(prev => [...prev, vendorResponse]);
      }, 2000);
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };

  const handlePhoneCall = () => {
    // In a real app, this would initiate a phone call
    console.log("Initiating phone call with", vendor.name);
    alert(`Calling ${vendor.name}...`);
  };

  const handleVideoCall = () => {
    // In a real app, this would start a video call
    console.log("Starting video call with", vendor.name);
    alert(`Starting video call with ${vendor.name}...`);
  };

  const handleAcceptQuote = () => {
    const acceptMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      content: "I accept your quote! When can we schedule the work?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent" as const
    };
    setMessages([...messages, acceptMessage]);
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      navigate(`/marketplace/services?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleNotificationClick = () => {
    navigate('/marketplace/notifications');
  };

  const handleRequestsClick = () => {
    navigate('/marketplace/requests');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Marketplace Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "hidden md:flex items-center gap-2 hover:bg-gray-100 transition-all duration-200 rounded-lg px-3 py-2",
                sidebarCollapsed ? "bg-green-50 text-green-700 border border-green-200" : ""
              )}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Menu</span>}
              {sidebarCollapsed && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link to="/marketplace" className="text-xl font-bold text-green-600">
              ThinkPartnership
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search for services..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => navigate('/marketplace/services')}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={handleNotificationClick}
              title="View notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Service Requests */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={handleRequestsClick}
              title="View service requests"
            >
              <FileText className="h-5 w-5" />
              {requestCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center p-0">
                  {requestCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{userName.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">john.doe@example.com</p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/marketplace/account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/marketplace/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Marketplace Sidebar */}
        <aside className={cn(
          "hidden md:flex fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 flex-col",
          sidebarCollapsed
            ? "w-16 border-gray-200 shadow-md"
            : "w-64 border-gray-200 shadow-lg"
        )}>
          <nav className={cn("flex-1 space-y-2", sidebarCollapsed ? "p-2" : "p-4")}>
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200 relative group",
                  sidebarCollapsed ? "px-2 py-3 justify-center mx-1" : "px-3 py-2 space-x-3",
                  isActive(item.path, item.exact)
                    ? "bg-green-100 text-green-700 shadow-sm border border-green-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={cn("flex-shrink-0", sidebarCollapsed ? "h-5 w-5" : "h-5 w-5")} />
                {!sidebarCollapsed && <span>{item.name}</span>}

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Marketplace Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.path, item.exact)
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Chat Layout */}
        <main className={cn(
          "flex-1 transition-all duration-300 flex h-[calc(100vh-4rem)] relative min-w-0 overflow-hidden",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}>
          {/* Mobile Chat Sidebar Overlay */}
          {showSidebar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Chat Sidebar */}
          <div className={`w-64 lg:w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-50 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:relative lg:z-auto fixed lg:static inset-y-0 left-0`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
                className="p-2 lg:hidden"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2 hidden lg:block"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {[
            {
              name: "Certified Inspectors Inc.",
              lastMessage: "Perfect! For 500 sq ft with quality paint...",
              time: "10:45 AM",
              unread: 2,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
              active: vendor.name === "Certified Inspectors Inc."
            },
            {
              name: "Rapid Plumbers",
              lastMessage: "I can be there tomorrow morning",
              time: "Yesterday",
              unread: 0,
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
              active: vendor.name === "Rapid Plumbers"
            },
            {
              name: "Sparkling Spaces",
              lastMessage: "Thank you for choosing our service!",
              time: "2 days ago",
              unread: 0,
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
              active: vendor.name === "Sparkling Spaces"
            },
            {
              name: "Green Thumb Landscaping",
              lastMessage: "The quote is ready for review",
              time: "3 days ago",
              unread: 1,
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
              active: vendor.name === "Green Thumb Landscaping"
            }
          ].map((chat, index) => (
            <div
              key={index}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                chat.active ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => navigate(`/marketplace/chat/${encodeURIComponent(chat.name)}`)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <Badge className="bg-blue-500 text-white text-xs ml-2">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-3 flex items-center justify-between w-full flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(true)}
              className="p-2 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 hidden lg:block"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 truncate">{vendor.name}</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="hidden sm:inline">{vendor.lastSeen}</span>
                  <span className="hidden sm:inline">•</span>

                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 sm:p-2 hover:bg-green-50 hover:text-green-600"
              onClick={handlePhoneCall}
              title="Call vendor"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1.5 sm:p-2 hover:bg-blue-50 hover:text-blue-600"
              onClick={handleVideoCall}
              title="Video call"
            >
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Vendor Info Card */}
        <div className="bg-blue-50 border-b border-blue-100 px-2 sm:px-4 py-3 w-full flex-shrink-0">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600">{vendor.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600">{vendor.responseTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold text-gray-900">{vendor.completedJobs} jobs completed</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    Verified Pro
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-3 lg:px-4 py-4 space-y-4 w-full max-w-full">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[280px] sm:max-w-sm lg:max-w-md ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                {msg.sender === "vendor" && (
                  <div className="flex items-center space-x-2 mb-1">
                    <img
                      src={vendor.avatar}
                      alt={vendor.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500">{vendor.name}</span>
                  </div>
                )}
                
                {msg.type === "quote" ? (
                  /* Quote Card */
                  <Card className="border border-gray-200 bg-white max-w-[280px] sm:max-w-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <h4 className="font-semibold text-gray-900">{msg.content.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{msg.content.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">{msg.content.price}</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {msg.content.timeline}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">Includes:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {msg.content.includes.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-xs text-gray-500 border-t pt-2">
                          {msg.content.validUntil}
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handleAcceptQuote}
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Accept Quote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setMessage("I'd like to negotiate the price. Can we discuss?")}
                          >
                            <ThumbsDown className="w-3 h-3 mr-1" />
                            Negotiate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Regular Message */
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                )}
                
                <div className={`flex items-center space-x-1 mt-1 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  {msg.sender === "user" && getMessageStatusIcon(msg.status)}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
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

        {/* Quick Replies */}
        <div className="px-2 sm:px-3 lg:px-4 py-2 bg-gray-50 border-t border-gray-200 w-full">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="whitespace-nowrap text-xs bg-white hover:bg-gray-50 border-gray-300"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-2 sm:px-3 lg:px-4 py-3 w-full">
          <div className="flex items-center space-x-2 sm:space-x-3 w-full max-w-full">
            <Button variant="ghost" size="sm" className="p-2 text-gray-500">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-gray-500">
              <Image className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
      </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
