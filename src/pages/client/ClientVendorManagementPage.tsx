import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ClientVendorManagementPage = () => {
  const mockVendors = [
    { id: "v001", name: "Rapid Plumbers", email: "rapid@example.com", status: "Active", services: "Plumbing" },
    { id: "v002", name: "Brush Strokes Pro", email: "brush@example.com", status: "Active", services: "Painting" },
    { id: "v003", name: "Certified Inspectors Inc.", email: "inspect@example.com", status: "Active", services: "Inspections" },
    { id: "v004", name: "Green Thumb Landscaping", email: "green@example.com", status: "Active", services: "Landscaping" },
    { id: "v005", name: "Sparky Electric", email: "sparky@example.com", status: "Suspended", services: "Electrical" },
  ];

  const mockPendingVendors = [
    { id: "p001", name: "Clean Sweep Services", email: "clean@example.com", services: "Cleaning" },
    { id: "p002", name: "Move It Right", email: "move@example.com", services: "Moving" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manage Vendors</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Review and manage the service providers in your marketplace.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vendor List</CardTitle>
          <CardDescription>View and search your current vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search vendors by name or email..." />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.services}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === "Active" ? "default" : "destructive"}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" className="mt-4">Add New Vendor</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review new vendor applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockPendingVendors.length > 0 ? (
            <div className="space-y-4">
              {mockPendingVendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.email} - {vendor.services}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="default" size="sm">Approve</Button>
                    <Button variant="outline" size="sm">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No pending vendor applications at this time.</p>
          )}
          <Button variant="outline" className="mt-4">Review All Applications</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientVendorManagementPage;