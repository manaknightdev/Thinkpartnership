import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import ChatAPI, { Chat, ChatMessage } from "@/services/ChatAPI";
import OrdersAPI from "@/services/OrdersAPI";
import StripeAPI from "@/services/StripeAPI";
import { toast } from "sonner";

import {
  ArrowLeft,
  Send,
  MoreVertical,
  Check,
  CheckCheck,
  CheckCircle,
  Menu,
  MessageCircle
} from "lucide-react";

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [stripeConnected, setStripeConnected] = useState<boolean | null>(null);
  const [checkingStripe, setCheckingStripe] = useState(false);
  const [acceptingQuote, setAcceptingQuote] = useState(false);
  const [acceptedQuotes, setAcceptedQuotes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Update specific chat's last message without refreshing entire list
  const updateChatLastMessage = (chatId: string, lastMessage: string) => {
    setAllChats(prevChats =>
      prevChats.map(chat =>
        chat.id.toString() === chatId
          ? {
              ...chat,
              last_message: lastMessage,
              last_message_time: new Date().toISOString()
            }
          : chat
      )
    );
  };

  // Function to load messages for the current chat
  const loadMessages = async (chatIdToLoad: string, silent: boolean = false) => {
    try {
      const messagesResponse = await ChatAPI.getChatMessages(parseInt(chatIdToLoad));
      if (!messagesResponse.error) {
        setMessages(messagesResponse.messages || []);

        // Also refresh the chat list to update last message and unread counts (only during polling)
        if (silent) {
          try {
            const chatsResponse = await ChatAPI.getChats();
            if (!chatsResponse.error) {
              // Only update chats if there are actual changes to prevent unnecessary re-renders
              const currentChatsJson = JSON.stringify(allChats);
              const newChatsJson = JSON.stringify(chatsResponse.chats);
              if (currentChatsJson !== newChatsJson) {
                setAllChats(chatsResponse.chats);
              }
            }
          } catch (error) {
            console.error('Error refreshing chat list during message load:', error);
          }
        }
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // Load chat data and messages
  useEffect(() => {
    const loadChatData = async () => {
      if (!chatId) {
        setError("Chat ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get all chats to find the current one
        const chatsResponse = await ChatAPI.getChats();
        if (chatsResponse.error) {
          throw new Error('Failed to load chats');
        }

        // Store all chats for the sidebar
        setAllChats(chatsResponse.chats);

        const chat = chatsResponse.chats.find(c => c.id.toString() === chatId);
        if (!chat) {
          throw new Error('Chat not found');
        }

        setCurrentChat(chat);

        // Load messages for this chat
        await loadMessages(chatId);

        // Set up polling for new messages every 3 seconds
        const interval = setInterval(() => {
          loadMessages(chatId);
        }, 3000);
        setPollingInterval(interval);

      } catch (err: any) {
        console.error('Error loading chat:', err);
        setError(err.message || 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    loadChatData();

    // Cleanup polling on unmount or chatId change
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    };
  }, [chatId]);

  // Check Stripe connection status on component mount
  useEffect(() => {
    checkStripeConnection();
  }, []);

  // Cleanup polling on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId || !currentChat) return;

    const messageText = message.trim();
    const optimisticId = Date.now();
    setMessage("");

    try {
      // Optimistically add message to UI
      const optimisticMessage: ChatMessage = {
        id: optimisticId, // Temporary ID
        message: messageText,
        sender_type: 'customer',
        message_type: 0,
        created_at: new Date().toISOString(),
        read_by_customer: true,
        read_by_vendor: false
      };

      setMessages(prev => [...(prev || []), optimisticMessage]);

      // Send message to API
      const response = await ChatAPI.sendMessage(parseInt(chatId), {
        message: messageText,
        message_type: 0
      });

      if (response.error) {
        throw new Error(response.message || 'Failed to send message');
      }

      // Refresh messages to get the latest state from server (silently)
      if (chatId) {
        await loadMessages(chatId, true);
      }

      // Update just this chat's last message without refreshing entire list
      updateChatLastMessage(chatId, messageText);

    } catch (err: any) {
      console.error('Error sending message:', err);
      // Remove optimistic message on error
      setMessages(prev => (prev || []).filter(msg => msg.id !== optimisticId));
      setError(err.message || 'Failed to send message');
      setMessage(messageText); // Restore message text
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };



  // Check Stripe connection status
  const checkStripeConnection = async () => {
    try {
      setCheckingStripe(true);
      const status = await StripeAPI.getAccountStatus();
      setStripeConnected(status.connected);
    } catch (error) {
      console.error('Error checking Stripe connection:', error);
      setStripeConnected(false);
    } finally {
      setCheckingStripe(false);
    }
  };

  const handleAcceptQuote = async (quoteMessage: ChatMessage) => {
    if (!chatId || !quoteMessage.quote_amount || !quoteMessage.quote_details || !currentChat) {
      toast.error("Invalid quote data or chat not loaded");
      return;
    }

    try {
      setAcceptingQuote(true);

      // First, check if Stripe account is connected
      if (stripeConnected === null) {
        toast.info("Checking Stripe connection...");
        await checkStripeConnection();
      }

      if (stripeConnected === false) {
        toast.error("Please connect your Stripe account first to accept quotes");
        // Redirect to Stripe Connect
        StripeAPI.redirectToStripeConnect();
        return;
      }

      toast.info("Processing payment...");

      // Create a payment intent for the quote amount
      const paymentResponse = await StripeAPI.createPayment({
        amount: quoteMessage.quote_amount,
        currency: 'usd',
        service_id: currentChat.service.id,
        service_name: quoteMessage.quote_details.service || 'Custom Quote Service'
      });

      if (!paymentResponse.client_secret) {
        toast.error("Failed to initiate payment");
        return;
      }

      toast.info("Creating order...");

      // Create order using the existing order creation API
      const orderData = await OrdersAPI.createOrder({
        service_id: currentChat.service.id,
        service_name: quoteMessage.quote_details.service || 'Custom Quote Service',
        vendor_id: currentChat.vendor.id,
        amount: quoteMessage.quote_amount,
        payment_intent_id: paymentResponse.payment_intent_id,
        service_type: 'custom' // Mark as custom since it's from a quote
      });

      if (orderData.error) {
        toast.error("Failed to create order");
        return;
      }

      // Mark this quote as accepted
      setAcceptedQuotes(prev => new Set(prev).add(quoteMessage.id));

      // Send acceptance message
      const acceptMessage = `I've accepted your quote for $${quoteMessage.quote_amount}! Order has been created (Order ID: ${orderData.data?.order_id}). When can we schedule the work?`;
      setMessage(acceptMessage);
      await handleSendMessage();

      toast.success("Quote accepted and order created successfully!");

    } catch (error) {
      console.error("Error accepting quote:", error);
      toast.error("Failed to accept quote");
    } finally {
      setAcceptingQuote(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      navigate(`/marketplace/services?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };



  const getMessageStatusIcon = (msg: ChatMessage) => {
    if (msg.sender_type === 'customer') {
      if (msg.read_by_vendor) {
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      } else {
        return <Check className="w-3 h-3 text-gray-400" />;
      }
    }
    return null;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <MarketplaceLayout>
      {/* Chat Split Layout */}
      <div className="flex h-[calc(100vh-4rem)] min-w-0 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Chat List Sidebar */}
        <div className={`w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-50 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:relative lg:z-auto fixed lg:static inset-y-0 left-0`}>
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
                  onClick={() => navigate('/marketplace/messages')}
                  className="p-2 hidden lg:block"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Loading chats...</div>
              </div>
            ) : allChats.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">No chats available</div>
              </div>
            ) : (
              allChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => navigate(`/marketplace/chat/${chat.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={chat.vendor.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                        alt={chat.vendor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{chat.vendor.name}</h3>
                        <span className="text-xs text-gray-500">{formatTimestamp(chat.last_message_time)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
                        {chat.unread_count > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs ml-2">
                            {chat.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between w-full flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="p-2 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              {currentChat && (
                <div className="flex items-center space-x-3">
                  <img
                    src={currentChat.vendor.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                    alt={currentChat.vendor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{currentChat.vendor.name}</h3>
                    <p className="text-xs text-gray-500">{currentChat.service.title}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-red-500">{error}</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">No messages yet. Start the conversation!</div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender_type === 'customer'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {msg.message_type === 3 ? (
                      <div className="space-y-2">
                        <div className="font-medium">Service Quote</div>
                        <div className="text-sm opacity-90">
                          <div>Service: {msg.quote_details?.service || 'Custom Service'}</div>
                          <div>Price: ${msg.quote_amount}</div>
                          <div>Description: {msg.quote_details?.description || 'No description provided'}</div>
                        </div>
                        {msg.sender_type === 'vendor' && !acceptedQuotes.has(msg.id) && (
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptQuote(msg)}
                              disabled={acceptingQuote}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {acceptingQuote ? 'Processing...' : 'Accept & Pay'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white text-white hover:bg-white hover:text-gray-900"
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                        {acceptedQuotes.has(msg.id) && (
                          <div className="flex items-center space-x-1 mt-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Quote Accepted</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm">{msg.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {getMessageStatusIcon(msg)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default ChatPage;
