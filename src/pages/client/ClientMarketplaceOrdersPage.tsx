import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import React, { useState, useEffect } from "react"; // Added useEffect
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/utils/dateFormat";
import { ORDER_STATUSES, getOrderStatusVariant, type OrderStatus } from "@/utils/orderStatus";
import ClientAPI, { type ClientOrder } from "@/services/ClientAPI";

interface MarketplaceOrder {
  id: string;
  customer: string;
  vendor: string;
  service: string;
  date: string;
  amount: string;
  status: OrderStatus;
  notes?: string;
}



const ClientMarketplaceOrdersPage = () => {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

  useEffect(() => {
    loadOrders();
  }, []);



  // Filter orders based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = orders.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.vendor.toLowerCase().includes(query) ||
        order.service.toLowerCase().includes(query)
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchQuery]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await ClientAPI.getOrders();

      // Convert ClientOrder to MarketplaceOrder format
      const formattedOrders: MarketplaceOrder[] = Array.isArray(ordersData)
        ? ordersData.map((order: ClientOrder) => ({
            id: order.id,
            customer: order.customer,
            vendor: order.vendor,
            service: order.service,
            date: order.date,
            amount: order.amount,
            status: order.status as OrderStatus,
            notes: order.notes || ''
          }))
        : [];

      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders); // Initialize filtered orders
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      // Set empty array instead of mock data to show real data only
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportOrders = () => {
    try {
      const ordersToExport = searchQuery ? filteredOrders : orders;
      if (!ordersToExport || ordersToExport.length === 0) {
        toast.info(searchQuery ? 'No matching orders to export' : 'No orders to export');
        return;
      }

      const headers = ['Order ID', 'Customer', 'Vendor', 'Service', 'Date', 'Amount', 'Status', 'Notes'];
      const csvContent = [
        headers.join(','),
        ...ordersToExport.map(o => [
          `"${o.id}"`,
          `"${o.customer}"`,
          `"${o.vendor}"`,
          `"${o.service}"`,
          `"${formatDate(o.date)}"`,
          `"${o.amount}"`,
          `"${o.status}"`,
          `"${(o.notes || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const filename = searchQuery
        ? `orders-filtered-export-${new Date().toISOString().split('T')[0]}.csv`
        : `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Orders exported successfully');
    } catch (error) {
      console.error('Error exporting orders:', error);
      toast.error('Failed to export orders');
    }
  };

  const handleViewOrderDetails = (order: MarketplaceOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };
  
  const handleSearch = () => {
    // Search is handled by useEffect, this function can be used for additional search logic if needed
    // For now, the search is real-time as user types
  };




  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace Orders</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Review all service orders processed through your branded marketplace.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>A list of all service requests fulfilled by vendors in your marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex w-full sm:w-auto space-x-2">
              <Input
                placeholder="Search by Order ID, Customer, or Vendor..."
                className="flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="outline" size="icon" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleExportOrders} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Orders
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : !filteredOrders || filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchQuery ? `No orders found matching "${searchQuery}"` : "No orders found"}
                    </TableCell>
                  </TableRow>
                ) : filteredOrders?.map((order) => (
                  <TableRow
                    key={order.id}
                    onClick={() => handleViewOrderDetails(order)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.vendor}</TableCell>
                    <TableCell>{order.service}</TableCell>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={order.status === "completed" ? "secondary" : getOrderStatusVariant(order.status)}
                        className={`capitalize ${order.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleViewOrderDetails(order); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={isDetailModalOpen} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedOrder(null);
          }
          setIsDetailModalOpen(isOpen);
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details: {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Detailed information for order placed on {formatDate(selectedOrder.date)}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <p className="font-semibold">Order ID:</p><p>{selectedOrder.id}</p>
                <p className="font-semibold">Customer:</p><p>{selectedOrder.customer}</p>
                <p className="font-semibold">Vendor:</p><p>{selectedOrder.vendor}</p>
                <p className="font-semibold">Service:</p><p>{selectedOrder.service}</p>
                <p className="font-semibold">Date:</p><p>{formatDate(selectedOrder.date)}</p>
                <p className="font-semibold">Amount:</p><p>{selectedOrder.amount}</p>
                <p className="font-semibold">Current Status:</p>
                <p>
                  <Badge
                    variant={selectedOrder.status === "completed" ? "secondary" : getOrderStatusVariant(selectedOrder.status)}
                    className={`capitalize ${selectedOrder.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}
                  >
                    {selectedOrder.status}
                  </Badge>
                </p>
              </div>
              
              {selectedOrder.notes && (
                <div className="space-y-2 mt-2">
                  <Label className="font-semibold">Notes:</Label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => {
                setIsDetailModalOpen(false);
                setSelectedOrder(null);
              }}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientMarketplaceOrdersPage;