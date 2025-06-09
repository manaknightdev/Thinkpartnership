import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Users, Clock } from "lucide-react"; // Added Clock import

const mockAllVendors = [
  { id: "v001", name: "Rapid Plumbers", email: "rapid@example.com", status: "Active", services: "Plumbing", client: "Client A" },
  { id: "v002", name: "Brush Strokes Pro", email: "brush@example.com", status: "Active", services: "Painting", client: "Client B" },
  { id: "v003", name: "Certified Inspectors Inc.", email: "inspect@example.com", status: "Active", services: "Inspections", client: "Client A" },
  { id: "v004", name: "Green Thumb Landscaping", email: "green@example.com", status: "Active", services: "Landscaping", client: "Client C" },
  { id: "v005", name: "Sparky Electric", email: "sparky@example.com", status: "Suspended", services: "Electrical", client: "Client B" },
];

const mockPendingVendorApplications = [
  { id: "p001", name: "Clean Sweep Services", email: "clean@example.com", services: "Cleaning", client: "Client A" },
  { id: "p002", name: "Move It Right", email: "move@example.com", services: "Moving", client: "Client C" },
  { id: "p003", name: "Quick Fix Handyman", email: "fixit@example.com", services: "General Repair", client: "Client B" },
];

const AdminVendorApprovalsPage = () => {
  const handleApproveVendor = (vendorName: string) => {
    toast.success(`Approved ${vendorName}.`);
    // In a real app, this would update backend status and remove from pending list
  };

  const handleRejectVendor = (vendorName: string) => {
    toast.error(`Rejected ${vendorName}.`);
    // In a real app, this would update backend status and remove from pending list
  };

  const handleViewVendorDetails = (vendorName: string) => {
    toast.info(`Viewing full details for ${vendorName}...`);
    // Navigate to a detailed vendor profile page (if one exists)
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Vendor Management & Approvals</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Oversee all vendors across the marketplace and manage new applications.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> All Registered Vendors
          </CardTitle>
          <CardDescription>A list of all vendors currently in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Client Marketplace</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAllVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.client}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.services}</TableCell>
                    <TableCell>
                      <Badge variant={vendor.status === "Active" ? "default" : "destructive"}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleViewVendorDetails(vendor.name)} variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Pending Vendor Applications
          </CardTitle>
          <CardDescription>Review and decide on new vendor applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockPendingVendorApplications.length > 0 ? (
            <div className="space-y-4">
              {mockPendingVendorApplications.map((vendor) => (
                <div key={vendor.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-md dark:border-gray-700">
                  <div>
                    <p className="font-medium">{vendor.name} <span className="text-sm text-gray-500 dark:text-gray-400">({vendor.client})</span></p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.email} - {vendor.services}</p>
                  </div>
                  <div className="space-x-2 mt-2 sm:mt-0">
                    <Button onClick={() => handleApproveVendor(vendor.name)} variant="default" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button onClick={() => handleRejectVendor(vendor.name)} variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                      <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No pending vendor applications at this time.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVendorApprovalsPage;