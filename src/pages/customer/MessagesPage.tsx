import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import ChatAPI, { Chat } from "@/services/ChatAPI";
import {
  Search,
  MessageCircle,
  Loader2
} from "lucide-react";

const MessagesPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ChatAPI.getChats();
        if (response.error) {
          throw new Error('Failed to load chats');
        }

        setChats(response.chats);
      } catch (err: any) {
        console.error('Error loading chats:', err);
        setError(err.message || 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

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

  const filteredChats = chats.filter(chat =>
    chat.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MarketplaceLayout>
      {/* Messages Split Layout */}
      <div className="flex h-[calc(100vh-4rem)] min-w-0 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-3">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            )}

            {error && (
              <div className="p-4 text-center text-red-600">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && filteredChats.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No conversations yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start conversations with service providers from their service pages
                </p>
              </div>
            )}

            {!loading && !error && filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/marketplace/chat/${chat.id}`)}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img
                      src={chat.vendor.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"}
                      alt={chat.vendor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate text-sm">{chat.vendor.name}</h3>
                      <span className="text-xs text-gray-500">{formatTimestamp(chat.last_message_time)}</span>
                    </div>
                    <p className="text-xs text-blue-600 truncate">{chat.service.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-600 truncate">{chat.last_message}</p>
                      {chat.unread_count > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Welcome Placeholder */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Messages</h2>
            <p className="text-gray-500 mb-4">Select a conversation to start messaging</p>
            <p className="text-sm text-gray-400">
              Start conversations with service providers from their service pages
            </p>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default MessagesPage;
