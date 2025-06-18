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

const initialMockMarketplaceOrders: MarketplaceOrder[] = [
  { id: "ORDC001", customer: "Alice Wonderland", vendor: "Rapid Plumbers", service: "Emergency Drain Cleaning", date: "2024-01-01", amount: "$250.00", status: "completed", notes: "Customer reported issue resolved within 2 hours." },
  { id: "ORDC002", customer: "Bob The Builder", vendor: "Brush Strokes Pro", service: "Interior Painting - 2 Rooms", date: "2024-01-03", amount: "$1200.00", status: "completed", notes: "Color: Sky Blue. Project completed ahead of schedule." },
  { id: "ORDC003", customer: "Charlie Chaplin", vendor: "Climate Control Experts", service: "HVAC Check-up", date: "2024-01-05", amount: "$120.00", status: "processing", notes: "Scheduled for next week. Awaiting customer confirmation." },
  { id: "ORDC004", customer: "Diana Prince", vendor: "Certified Inspectors Inc.", service: "Full Home Inspection", date: "2024-01-06", amount: "$350.00", status: "paid" },
  { id: "ORDC005", customer: "Edward Scissorhands", vendor: "Green Thumb Landscaping", service: "Lawn Mowing & Edging", date: "2024-01-08", amount: "$80.00", status: "cancelled", notes: "Customer requested cancellation due to weather." },
  { id: "ORDC006", customer: "Fiona Gallagher", vendor: "Sparky Electric", service: "Outlet Installation", date: "2024-01-10", amount: "$180.00", status: "not paid" },
];



const ClientMarketplaceOrdersPage = () => {
  const [orders, setOrders] = useState<MarketplaceOrder[]>(initialMockMarketplaceOrders);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<MarketplaceOrder["status"] | "">("");
  const [editedNotes, setEditedNotes] = useState<string>(""); // State for edited notes

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status);
      setEditedNotes(selectedOrder.notes || "");
    }
  }, [selectedOrder]);

  const handleExportOrders = () => {
    toast.info("Exporting marketplace orders data...");
  };

  const handleViewOrderDetails = (order: MarketplaceOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };
  
  const handleSaveChangesAndCloseModal = () => {
    if (selectedOrder) {
      const statusChanged = newStatus && newStatus !== selectedOrder.status;
      const notesChanged = editedNotes !== (selectedOrder.notes || "");

      if (statusChanged || notesChanged) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
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
                {orders.map((order) => (
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
                      <Badge variant={getOrderStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
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
                <p><Badge variant={getOrderStatusVariant(selectedOrder.status)} className="capitalize">{selectedOrder.status}</Badge></p>
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