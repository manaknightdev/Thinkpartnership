import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Mail, Phone, Globe, PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const VendorProfilePage = () => {
  const mockServices = [
    { id: "s001", name: "Emergency Plumbing Repair", category: "Plumbing", price: "$150+", status: "Active" },
    { id: "s002", name: "Interior & Exterior Painting", category: "Painting", price: "$500+", status: "Active" },
    { id: "s003", name: "Full Home Inspection", category: "Inspections", price: "$300+", status: "Draft" },
  ];

  const handleSaveProfile = () => {
    toast.success("Company profile saved successfully!");
  };

  const handleAddService = () => {
    toast.info("Opening form to add new service...");
  };

  const handleEditService = (serviceName: string) => {
    toast.info(`Editing service: ${serviceName}...`);
  };

  const handleDeleteService = (serviceName: string) => {
    toast.error(`Service "${serviceName}" deleted.`);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile Setup</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manage your company information and service listings. This is how clients and customers will see you.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" /> Company Information
          </CardTitle>
          <CardDescription>Update your business details that will be visible on your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" type="text" placeholder="Your Company Name" defaultValue="Rapid Plumbers" />
          </div>
          <div>
            <Label htmlFor="company-bio">Company Bio</Label>
            <Textarea id="company-bio" placeholder="Tell us about your company and what you offer." rows={5} defaultValue="Rapid Plumbers provides 24/7 emergency plumbing services, leak detection, drain cleaning, and water heater installations. We are committed to fast, reliable, and high-quality service." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" placeholder="contact@yourcompany.com" defaultValue="info@rapidplumbers.com" />
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input id="contact-phone" type="tel" placeholder="(123) 456-7890" defaultValue="(555) 123-4567" />
            </div>
          </div>
          <div>
            <Label htmlFor="company-website">Website URL</Label>
            <Input id="company-website" type="url" placeholder="https://www.yourcompany.com" defaultValue="https://www.rapidplumbers.com" />
          </div>
          <Button onClick={handleSaveProfile}>Save Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Service Listings
          </CardTitle>
          <CardDescription>Add or manage the services you offer to customers.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockServices.length > 0 ? (
            <Table className="mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>{service.status}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => handleEditService(service.name)} variant="ghost" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteService(service.name)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-4">No services listed yet. Add your first service!</p>
          )}
          <Button onClick={handleAddService} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfilePage;