import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, DollarSign, History } from "lucide-react";
import React, { useState } from "react";

interface ManualCommission {
  id: string;
  vendor: string;
  customer: string;
  service: string;
  amount: string;
  date: string;
  notes?: string;
}

const AdminManualCommissionsPage = () => {
  const [newCommission, setNewCommission] = useState<Omit<ManualCommission, 'id' | 'date'>>({
    vendor: "",
    customer: "",
    service: "",
    amount: "",
    notes: "",
  });
  const [recentCommissions, setRecentCommissions] = useState<ManualCommission[]>([]);

  const handleAddCommission = () => {
    if (newCommission.vendor && newCommission.customer && newCommission.service && newCommission.amount) {
      const commissionToAdd: ManualCommission = {
        ...newCommission,
        id: `MAN${Date.now()}`,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      };
      setRecentCommissions([commissionToAdd, ...recentCommissions]);
      setNewCommission({ vendor: "", customer: "", service: "", amount: "", notes: "" });
      toast.success("Commission added successfully!");
    } else {
      toast.error("Please fill in all required fields for the new commission.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manual Commission Management</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manually add commissions for vendors or clients, typically for adjustments or special cases.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Add New Manual Commission
          </CardTitle>
          <CardDescription>Enter details for a commission to be manually added to a vendor's earnings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="commission-vendor">Vendor Name</Label>
            <Input
              id="commission-vendor"
              type="text"
              placeholder="e.g., Rapid Plumbers"
              value={newCommission.vendor}
              onChange={(e) => setNewCommission({ ...newCommission, vendor: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="commission-customer">Customer Name (Optional)</Label>
            <Input
              id="commission-customer"
              type="text"
              placeholder="e.g., John Doe"
              value={newCommission.customer}
              onChange={(e) => setNewCommission({ ...newCommission, customer: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="commission-service">Service Provided (Optional)</Label>
            <Input
              id="commission-service"
              type="text"
              placeholder="e.g., Emergency Plumbing Repair"
              value={newCommission.service}
              onChange={(e) => setNewCommission({ ...newCommission, service: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="commission-amount">Amount ($)</Label>
              <Input
                id="commission-amount"
                type="number"
                placeholder="e.g., 50.00"
                value={newCommission.amount}
                onChange={(e) => setNewCommission({ ...newCommission, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="commission-type">Commission Type</Label>
              <Select defaultValue="vendor">
                <SelectTrigger id="commission-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor Commission</SelectItem>
                  <SelectItem value="client">Client Commission</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="commission-notes">Notes (Optional)</Label>
            <Textarea
              id="commission-notes"
              placeholder="Reason for manual commission, reference ID, etc."
              rows={3}
              value={newCommission.notes}
              onChange={(e) => setNewCommission({ ...newCommission, notes: e.target.value })}
            />
          </div>
          <Button onClick={handleAddCommission} className="w-full">
            <DollarSign className="mr-2 h-4 w-4" /> Add Commission
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Recent Manual Commissions
          </CardTitle>
          <CardDescription>A list of commissions recently added manually.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentCommissions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell className="font-medium">{commission.id}</TableCell>
                      <TableCell>{commission.vendor}</TableCell>
                      <TableCell>{commission.customer || "N/A"}</TableCell>
                      <TableCell>{commission.service || "N/A"}</TableCell>
                      <TableCell>${parseFloat(commission.amount).toFixed(2)}</TableCell>
                      <TableCell>{commission.date}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{commission.notes || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No manual commissions added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManualCommissionsPage;