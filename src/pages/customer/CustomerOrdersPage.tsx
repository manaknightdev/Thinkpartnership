import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CustomerOrdersPage = () => {
  const mockOrders = [
    { id: "ORD001", service: "Interior Painting", vendor: "Brush Strokes Pro", date: "2023-10-28", status: "Completed", amount: "$1200.00" },
    { id: "ORD002", service: "Emergency Drain Cleaning", vendor: "Rapid Plumbers", date: "2023-10-25", status: "Completed", amount: "$250.00" },
    { id: "ORD003", service: "HVAC Check-up", vendor: "Climate Control Experts", date: "2023-10-20", status: "Pending", amount: "$120.00" },
    { id: "ORD004", service: "Full Home Inspection", vendor: "Certified Inspectors Inc.", date: "2023-10-15", status: "Completed", amount: "$350.00" },
    { id: "ORD005", service: "Lawn Mowing Service", vendor: "Green Thumb Landscaping", date: "2023-10-10", status: "Cancelled", amount: "$80.00" },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Pending":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    toast.info(`Viewing details for order ${orderId}...`);
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
                  <TableRow key={order.id} onClick={() => handleViewOrderDetails(order.id)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.service}</TableCell>
                    <TableCell>{order.vendor}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerOrdersPage;