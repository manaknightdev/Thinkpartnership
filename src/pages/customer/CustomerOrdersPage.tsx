import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateFormat";
import { ORDER_STATUSES, getOrderStatusVariant, type OrderStatus } from "@/utils/orderStatus";

interface CustomerOrder {
  id: string;
  service: string;
  vendor: string;
  date: string;
  status: OrderStatus;
  amount: string;
  notes?: string;
}

const mockOrders: CustomerOrder[] = [
  { id: "ORD001", service: "Interior Painting", vendor: "Brush Strokes Pro", date: "2024-01-28", status: "completed", amount: "$1200.00", notes: "Excellent job, very clean." },
  { id: "ORD002", service: "Emergency Drain Cleaning", vendor: "Rapid Plumbers", date: "2024-01-25", status: "completed", amount: "$250.00" },
  { id: "ORD003", service: "HVAC Check-up", vendor: "Climate Control Experts", date: "2024-01-20", status: "processing", amount: "$120.00", notes: "Technician arriving between 2-4 PM." },
  { id: "ORD004", service: "Full Home Inspection", vendor: "Certified Inspectors Inc.", date: "2024-01-15", status: "paid", amount: "$350.00" },
  { id: "ORD005", service: "Lawn Mowing Service", vendor: "Green Thumb Landscaping", date: "2024-01-10", status: "cancelled", amount: "$80.00", notes: "Rescheduled due to rain." },
  { id: "ORD006", service: "Appliance Repair", vendor: "FixItQuick", date: "2024-01-01", status: "not paid", amount: "$180.00", notes: "Waiting for payment." },
];



const CustomerOrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewOrderDetails = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Here you can view the history and status of all services you've ordered through the marketplace.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>A list of all your past and pending service requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      onClick={() => handleViewOrderDetails(order)} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.service}</TableCell>
                      <TableCell>{order.vendor}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>
                        <Badge variant={getOrderStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{order.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details: {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Information for your service order placed on {formatDate(selectedOrder.date)}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <p className="font-semibold">Order ID:</p><p>{selectedOrder.id}</p>
                <p className="font-semibold">Service:</p><p>{selectedOrder.service}</p>
                <p className="font-semibold">Vendor:</p><p>{selectedOrder.vendor}</p>
                <p className="font-semibold">Date:</p><p>{formatDate(selectedOrder.date)}</p>
                <p className="font-semibold">Amount:</p><p>{selectedOrder.amount}</p>
                <p className="font-semibold">Status:</p>
                <p><Badge variant={getOrderStatusVariant(selectedOrder.status)} className="capitalize">{selectedOrder.status}</Badge></p>
              </div>
              {selectedOrder.notes && (
                <div className="mt-2">
                  <p className="font-semibold mb-1">Notes:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerOrdersPage;