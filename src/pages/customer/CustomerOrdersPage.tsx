import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import OrdersAPI, { Order } from "@/services/OrdersAPI";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ORDER_STATUSES, getOrderStatusVariant, type OrderStatus } from "@/utils/orderStatus";

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await OrdersAPI.getCustomerOrders({
        page: currentPage,
        limit: ordersPerPage
      });

      if (response.error) {
        setError(response.message || 'Failed to load orders');
        return;
      }

      // Orders are already sorted by backend (newest first)
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalOrders(response.data.pagination?.total || response.data.orders.length);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Here you can view the history and status of all services you've ordered through the marketplace.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Loading your orders...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MarketplaceLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MarketplaceLayout>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadOrders}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
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
            {orders.length > 0 ? (
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
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        onClick={() => handleViewOrderDetails(order)}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.service_name}</TableCell>
                        <TableCell>{order.vendor_name}</TableCell>
                        <TableCell>{formatDate(order.order_date)}</TableCell>
                        <TableCell>
                          <Badge variant={getOrderStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${(order.amount || 0).toFixed(2)}</TableCell>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * ordersPerPage) + 1}-{Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {selectedOrder && (
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Order Details: {selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Information for your service order placed on {formatDate(selectedOrder.order_date)}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p className="font-semibold">Order ID:</p><p>{selectedOrder.id}</p>
                  <p className="font-semibold">Service:</p><p>{selectedOrder.service_name}</p>
                  <p className="font-semibold">Vendor:</p><p>{selectedOrder.vendor_name}</p>
                  <p className="font-semibold">Date:</p><p>{formatDate(selectedOrder.order_date)}</p>
                  <p className="font-semibold">Amount:</p><p>${(selectedOrder.amount || 0).toFixed(2)}</p>
                  <p className="font-semibold">Status:</p>
                  <p><Badge variant={getOrderStatusVariant(selectedOrder.status)} className="capitalize">{selectedOrder.status}</Badge></p>
                  <p className="font-semibold">Payment:</p><p className="capitalize">{selectedOrder.payment_status}</p>
                  {selectedOrder.completion_date && (
                    <>
                      <p className="font-semibold">Completed:</p><p>{formatDate(selectedOrder.completion_date)}</p>
                    </>
                  )}
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
    </MarketplaceLayout>
  );
};

export default CustomerOrdersPage;