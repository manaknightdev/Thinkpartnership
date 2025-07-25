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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<MarketplaceOrder["status"] | "">("");
  const [editedNotes, setEditedNotes] = useState<string>(""); // State for edited notes

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status);
      setEditedNotes(selectedOrder.notes || "");
    }
  }, [selectedOrder]);

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
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      // Set empty array instead of mock data to show real data only
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportOrders = () => {
    toast.info("Exporting marketplace orders data...");
  };

  const handleViewOrderDetails = (order: MarketplaceOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };
  
  const handleSaveChangesAndCloseModal = async () => {
    if (selectedOrder) {
      const statusChanged = newStatus && newStatus !== selectedOrder.status;
      const notesChanged = editedNotes !== (selectedOrder.notes || "");

      if (statusChanged || notesChanged) {
        try {
          if (statusChanged) {
            await ClientAPI.updateOrderStatus(selectedOrder.id, newStatus, editedNotes);
          }

          setOrders(prevOrders =>
            (prevOrders || []).map(order =>
              order.id === selectedOrder.id ? {
                ...order,
                status: statusChanged ? (newStatus as MarketplaceOrder["status"]) : order.status,
                notes: notesChanged ? editedNotes : order.notes
              } : order
            )
          );

          let toastMessage = "Order details updated: ";
          if (statusChanged) toastMessage += `Status set to ${newStatus}. `;
          if (notesChanged) toastMessage += `Notes updated.`;
          toast.success(toastMessage.trim());
        } catch (error) {
          console.error('Error updating order:', error);
          toast.error('Failed to update order');
          return; // Don't close modal if update failed
        }
      } else {
        toast.info("No changes were made.");
      }
    }
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
    setEditedNotes("");
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
              <Input placeholder="Search by Order ID, Customer, or Vendor..." className="flex-grow" />
              <Button variant="outline" size="icon">
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
                ) : !orders || orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : orders?.map((order) => (
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
            // setNewStatus(""); // Keep these for potential re-open without saving
            // setEditedNotes("");
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
              
              <div className="space-y-2 mt-2">
                <Label htmlFor="order-notes" className="font-semibold">Notes:</Label>
                <Textarea
                  id="order-notes"
                  placeholder="Add or edit notes for this order..."
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2 mt-2">
                <Label htmlFor="order-status" className="font-semibold">Change Status:</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as MarketplaceOrder["status"])}>
                  <SelectTrigger id="order-status">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map(status => (
                      <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDetailModalOpen(false);
                setSelectedOrder(null); // Clear selected order on cancel
              }}>Cancel</Button>
              <Button onClick={handleSaveChangesAndCloseModal}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientMarketplaceOrdersPage;