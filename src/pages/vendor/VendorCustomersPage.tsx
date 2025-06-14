import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Users,
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  UserPlus,
  Star,
  ShoppingBag,
  ArrowUpRight,
  Share,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

const VendorCustomersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data for customers brought by this vendor
  const [customers] = useState<Customer[]>([
    {
      id: "cust_001",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      address: "123 Oak Street, Springfield, IL 62701",
      joinDate: "2024-01-15",
      totalSpent: 2450.00,
      ordersCount: 8,
      lastOrderDate: "2024-01-20",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "cust_002",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "(555) 234-5678",
      address: "456 Pine Avenue, Chicago, IL 60601",
      joinDate: "2024-01-10",
      totalSpent: 1875.50,
      ordersCount: 12,
      lastOrderDate: "2024-01-18",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "cust_003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "(555) 345-6789",
      address: "789 Maple Drive, Austin, TX 73301",
      joinDate: "2024-01-08",
      totalSpent: 3200.75,
      ordersCount: 15,
      lastOrderDate: "2024-01-19",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "cust_004",
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "(555) 456-7890",
      address: "321 Elm Street, Denver, CO 80201",
      joinDate: "2024-01-05",
      totalSpent: 890.25,
      ordersCount: 4,
      lastOrderDate: "2024-01-12",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "cust_005",
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      phone: "(555) 567-8901",
      address: "654 Cedar Lane, Seattle, WA 98101",
      joinDate: "2023-12-20",
      totalSpent: 1650.00,
      ordersCount: 9,
      lastOrderDate: "2024-01-16",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "cust_006",
      name: "Robert Martinez",
      email: "robert.martinez@email.com",
      phone: "(555) 678-9012",
      address: "987 Birch Road, Phoenix, AZ 85001",
      joinDate: "2023-12-15",
      totalSpent: 425.50,
      ordersCount: 2,
      lastOrderDate: "2023-12-28",
      status: "inactive"
    },
    {
      id: "cust_007",
      name: "Jennifer Lee",
      email: "jennifer.lee@email.com",
      phone: "(555) 789-0123",
      address: "147 Willow Court, Miami, FL 33101",
      joinDate: "2024-01-12",
      totalSpent: 2100.00,
      ordersCount: 11,
      lastOrderDate: "2024-01-21",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  // Calculate summary stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgSpendPerCustomer = totalRevenue / totalCustomers;

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case "totalSpent":
        return b.totalSpent - a.totalSpent;
      case "ordersCount":
        return b.ordersCount - a.ordersCount;
      case "joinDate":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleInviteCustomers = () => {
    navigate('/vendor-portal/invite');
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const shareCustomer = (customer: Customer) => {
    const shareText = `Check out ${customer.name} - one of my valued customers on ThinkPartnership!`;
    if (navigator.share) {
      navigator.share({
        title: "Customer Referral",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Customer info copied to clipboard!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Customers</h1>
          <p className="text-gray-600 mt-1">
            Track customers you've brought to the platform and their spending across all vendors.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleInviteCustomers} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Customer
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Customer</p>
                <p className="text-2xl font-bold text-gray-900">${avgSpendPerCustomer.toFixed(2)}</p>
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
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalSpent">Total Spent</SelectItem>
                <SelectItem value="ordersCount">Order Count</SelectItem>
                <SelectItem value="joinDate">Join Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-4">
        {sortedCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters to see more customers."
                  : "Start inviting customers to build your referral network."}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 flex-shrink-0">
                    {customer.avatar ? (
                      <img 
                        src={customer.avatar} 
                        alt={customer.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                      
                      <Badge
                        className={cn(
                          "text-xs",
                          customer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {customer.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Total Spent</p>
                        <p className="font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Orders</p>
                        <p className="font-semibold text-blue-600">{customer.ordersCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="font-semibold text-gray-700">{new Date(customer.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Order</p>
                        <p className="font-semibold text-gray-700">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(customer)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  {selectedCustomer.avatar ? (
                                    <img
                                      src={selectedCustomer.avatar}
                                      alt={selectedCustomer.name}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                      <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                                    <p className="text-sm text-gray-600">{selectedCustomer.status}</p>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{selectedCustomer.email}</span>
                                  </div>
                                  {selectedCustomer.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">{selectedCustomer.phone}</span>
                                    </div>
                                  )}
                                  {selectedCustomer.address && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">{selectedCustomer.address}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Joined {new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.ordersCount}</p>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    Last order: {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareCustomer(customer)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
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

export default VendorCustomersPage;
