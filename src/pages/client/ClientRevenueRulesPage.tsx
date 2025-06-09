import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClientRevenueRulesPage = () => {
  const mockServiceRules = [
    { id: "r001", service: "Plumbing", clientShare: "15%", vendorShare: "85%" },
    { id: "r002", service: "Painting", clientShare: "10%", vendorShare: "90%" },
    { id: "r003", service: "Inspections", clientShare: "20%", vendorShare: "80%" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Revenue & Commission Rules</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Configure how commissions are split and managed within your marketplace.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Global Commission Settings</CardTitle>
          <CardDescription>Set default commission percentages for your marketplace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client-commission">Your Commission (%)</Label>
            <Input id="client-commission" type="number" placeholder="e.g., 10" defaultValue={10} />
          </div>
          <div>
            <Label htmlFor="vendor-commission">Vendor Commission (%)</Label>
            <Input id="vendor-commission" type="number" placeholder="e.g., 90" defaultValue={90} />
          </div>
          <Button>Save Global Rules</Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Service-Specific Rules</CardTitle>
          <CardDescription>Override global rules for specific service categories or vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockServiceRules.length > 0 ? (
            <Table className="mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Service Category</TableHead>
                  <TableHead>Your Share</TableHead>
                  <TableHead>Vendor Share</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockServiceRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.service}</TableCell>
                    <TableCell>{rule.clientShare}</TableCell>
                    <TableCell>{rule.vendorShare}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-4">No service-specific rules configured yet.</p>
          )}
          
          <h3 className="text-xl font-semibold mb-4">Add New Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-service-category">Service Category</Label>
              <Select>
                <SelectTrigger id="new-service-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-client-share">Your Share (%)</Label>
              <Input id="new-client-share" type="number" placeholder="e.g., 15" />
            </div>
            <div>
              <Label htmlFor="new-vendor-share">Vendor Share (%)</Label>
              <Input id="new-vendor-share" type="number" placeholder="e.g., 85" />
            </div>
          </div>
          <Button className="mt-4">Add Custom Rule</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRevenueRulesPage;