import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  User,
  Calendar,
  MessageCircle,
  Loader2,
  Package,
  Star,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDate } from "@/utils/dateFormat";
import VendorOrdersAPI, { VendorOrder } from "@/services/VendorOrdersAPI";

// Use the status type from VendorOrder interface
type VendorOrderStatus = VendorOrder['status'];

// Create a wrapper for getOrderStatusVariant that handles VendorOrderStatus
const getVendorOrderStatusVariant = (status: VendorOrderStatus) => {
  switch (status) {
    case "completed":
      return "default"; // Green
    case "paid":
    case "processing":
      return "secondary"; // Blue
    case "pending":
      return "outline"; // Gray
    case "cancelled":
      return "destructive"; // Red
    default:
      return "outline";
  }
};

const VendorOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<VendorOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await VendorOrdersAPI.getOrders();

      if (response.error) {
        setError(response.message || 'Failed to load orders');
        return;
      }

      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const handleViewOrderDetails = (order: VendorOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleContactCustomer = (order: VendorOrder) => {
    navigate(`/vendor-portal/messages?customer=${order.customer_email}`);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: VendorOrderStatus) => {
    try {
      // Set loading state
      setUpdatingOrderId(orderId);

      const response = await VendorOrdersAPI.updateOrderStatus(orderId, { status: newStatus });

      if (response.error) {
        toast.error(response.message);
        return;
      }

      // Update local state for both orders list and selected order
      const updatedOrder = {
        status: newStatus,
        completion_date: newStatus === 'completed' ? new Date().toISOString() : undefined
      };

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? {
            ...order,
            ...updatedOrder
          } : order
        )
      );

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? {
          ...prev,
          ...updatedOrder
        } : null);
      }

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error("Failed to update order status");
    } finally {
      // Clear loading state
      setUpdatingOrderId(null);
    }
  };

  const getStatusIcon = (status: VendorOrderStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'paid':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTotalEarnings = () => {
    return orders
      .filter(order => order.payment_status === 'paid')
      .reduce((total, order) => total + (order.amount || 0), 0);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const paid = orders.filter(o => o.payment_status === 'paid').length;

    return { total, completed, processing, paid };
  };

  const stats = getOrderStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-2">
          Manage and track all your customer orders in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${getTotalEarnings().toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders by customer, service, or order ID..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters to see more orders."
                  : "You don't have any orders yet. Orders will appear here when customers purchase your services."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-gray-600">{order.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.service_name}</p>
                          <Badge variant="outline" className="mt-1">
                            {order.service_type === 'fixed' ? 'Fixed Price' : 'Custom Quote'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${(order.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Badge variant={getVendorOrderStatusVariant(order.status)} className="capitalize">
                            {order.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactCustomer(order)}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details: {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Complete order information and management options.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Customer</Label>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Service</Label>
                  <p className="font-medium">{selectedOrder.service_name}</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedOrder.service_type === 'fixed' ? 'Fixed Price' : 'Custom Quote'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Amount</Label>
                  <p className="font-medium text-green-600">${(selectedOrder.amount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedOrder.status)}
                    <Badge variant={getVendorOrderStatusVariant(selectedOrder.status)} className="capitalize">
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Order Date</Label>
                  <p>{formatDate(selectedOrder.order_date)}</p>
                </div>
                {selectedOrder.completion_date && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Completion Date</Label>
                    <p>{formatDate(selectedOrder.completion_date)}</p>
                  </div>
                )}
              </div>

              {selectedOrder.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md mt-1">{selectedOrder.notes}</p>
                </div>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleContactCustomer(selectedOrder)}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Customer
                </Button>
                
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Update Status:</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(newStatus: VendorOrderStatus) => handleUpdateOrderStatus(selectedOrder.id, newStatus)}
                    disabled={updatingOrderId === selectedOrder.id}
                  >
                    <SelectTrigger className="w-40">
                      {updatingOrderId === selectedOrder.id ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VendorOrdersPage;
