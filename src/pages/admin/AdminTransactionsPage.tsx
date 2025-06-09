import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Download } from "lucide-react";

const mockTransactions = [
  { id: "TXN001", client: "Client A", vendor: "Rapid Plumbers", customer: "Alice Smith", service: "Emergency Plumbing", amount: "$250.00", date: "2023-10-28", status: "Completed" },
  { id: "TXN002", client: "Client B", vendor: "Brush Strokes Pro", customer: "Bob Johnson", service: "Interior Painting", amount: "$1200.00", date: "2023-10-27", status: "Completed" },
  { id: "TXN003", client: "Client A", vendor: "Certified Inspectors Inc.", customer: "Charlie Brown", service: "Home Inspection", amount: "$350.00", date: "2023-10-26", status: "Pending" },
  { id: "TXN004", client: "Client C", vendor: "Green Thumb Landscaping", customer: "Diana Prince", service: "Lawn Mowing", amount: "$80.00", date: "2023-10-25", status: "Completed" },
  { id: "TXN005", client: "Client B", vendor: "Sparky Electric", customer: "Eve Adams", service: "Electrical Repair", amount: "$180.00", date: "2023-10-24", status: "Cancelled" },
  { id: "TXN006", client: "Client A", vendor: "Climate Control Experts", customer: "Frank White", service: "HVAC Tune-up", amount: "$120.00", date: "2023-10-23", status: "Completed" },
  { id: "TXN007", client: "Client C", vendor: "Rapid Plumbers", customer: "Grace Lee", service: "Drain Cleaning", amount: "$150.00", date: "2023-10-22", status: "Completed" },
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

const AdminTransactionsPage = () => {
  const handleExport = () => {
    toast.info("Exporting transactions data...");
    // Logic to export data
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">All Marketplace Transactions</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        View a comprehensive list of all service transactions across all clients and vendors.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Filter and review all completed, pending, and cancelled orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex w-full sm:w-auto space-x-2">
              <Input placeholder="Search by ID, customer, or vendor..." className="flex-grow" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.id}</TableCell>
                    <TableCell>{txn.client}</TableCell>
                    <TableCell>{txn.vendor}</TableCell>
                    <TableCell>{txn.customer}</TableCell>
                    <TableCell>{txn.service}</TableCell>
                    <TableCell>{txn.amount}</TableCell>
                    <TableCell>{txn.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(txn.status)}>{txn.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPage;