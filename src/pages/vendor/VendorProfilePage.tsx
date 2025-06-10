import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Mail, Phone, Globe, PlusCircle, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  status: "Active" | "Draft";
  description: string;
  imageUrl?: string; // Added imageUrl
}

const VendorProfilePage = () => {
  const [services, setServices] = useState<Service[]>([
    { id: "s001", name: "Emergency Plumbing Repair", category: "Plumbing", price: "$150+", status: "Active", description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.", imageUrl: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA=" },
    { id: "s002", name: "Interior & Exterior Painting", category: "Painting", price: "$500+", status: "Active", description: "Transform your home with high-quality interior and exterior painting services. Experienced and reliable.", imageUrl: "https://t3.ftcdn.net/jpg/00/96/57/12/360_F_96571267_qfpHjHTvH8siby0Cey6rTpfiJczIxX3e.jpg" },
    { id: "s003", name: "Full Home Inspection", category: "Inspections", price: "$300+", status: "Draft", description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.", imageUrl: "https://www.shutterstock.com/image-photo/mid-adult-woman-architect-wearing-600nw-2060102018.jpg" },
  ]);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState<Omit<Service, 'id' | 'status'>>({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "", // Initialize imageUrl
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceData, setEditServiceData] = useState<Omit<Service, 'id' | 'status'> | null>(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);


  const handleSaveProfile = () => {
    toast.success("Company profile saved successfully!");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, isNewService: boolean) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isNewService) {
          setNewService({ ...newService, imageUrl: reader.result as string });
        } else if (editServiceData) {
          setEditServiceData({ ...editServiceData, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.category && newService.price) {
      const serviceToAdd: Service = {
        ...newService,
        id: `s${Date.now()}`, // Unique ID
        status: "Active", // Default status for new services
      };
      setServices([...services, serviceToAdd]);
      setNewService({ name: "", category: "", price: "", description: "", imageUrl: "" }); // Clear form
      toast.success("Service added successfully!");
      setIsAddServiceModalOpen(false); // Close the modal
    } else {
      toast.error("Please fill in all required fields for the new service.");
    }
  };

  const handleEditService = (serviceId: string) => {
    const serviceToEdit = services.find(s => s.id === serviceId);
    if (serviceToEdit) {
      setEditingServiceId(serviceId);
      setEditServiceData({
        name: serviceToEdit.name,
        category: serviceToEdit.category,
        price: serviceToEdit.price,
        description: serviceToEdit.description,
        imageUrl: serviceToEdit.imageUrl, // Pass existing image URL
      });
      setIsEditServiceModalOpen(true);
    }
  };

  const handleSaveEditedService = () => {
    if (editingServiceId && editServiceData && editServiceData.name && editServiceData.category && editServiceData.price) {
      setServices(services.map(s =>
        s.id === editingServiceId
          ? { ...s, ...editServiceData }
          : s
      ));
      toast.success("Service updated successfully!");
      setIsEditServiceModalOpen(false);
      setEditingServiceId(null);
      setEditServiceData(null);
    } else {
      toast.error("Please fill in all required fields for the edited service.");
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast.error("Service deleted.");
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
          {services.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead> {/* New Table Head */}
                    <TableHead>Service Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={service.name} className="w-12 h-12 object-cover rounded-md" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>{service.price}</TableCell>
                      <TableCell>{service.status}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleEditService(service.id)} variant="ghost" size="sm" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteService(service.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-4">No services listed yet. Add your first service!</p>
          )}
          
          <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>
                  Enter the details for the service you want to offer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-service-name">Service Name</Label>
                  <Input
                    id="new-service-name"
                    type="text"
                    placeholder="e.g., Emergency Plumbing Repair"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-category">Category</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) => setNewService({ ...newService, category: value })}
                  >
                    <SelectTrigger id="new-service-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="moving">Moving</SelectItem>
                      <SelectItem value="inspections">Inspections</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-price-range">Price Range (e.g., $100+, $500-$1000)</Label>
                  <Input
                    id="new-price-range"
                    type="text"
                    placeholder="$XXX+"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-description">Service Description</Label>
                  <Textarea
                    id="new-service-description"
                    placeholder="Briefly describe this service."
                    rows={3}
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-service-image">Service Image</Label>
                  <Input
                    id="new-service-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                  {newService.imageUrl && (
                    <img src={newService.imageUrl} alt="Service Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
                  )}
                </div>
              </div>
              <Button onClick={handleAddService}>Save Service</Button>
            </DialogContent>
          </Dialog>

          {/* Edit Service Dialog */}
          <Dialog open={isEditServiceModalOpen} onOpenChange={setIsEditServiceModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
                <DialogDescription>
                  Modify the details for this service.
                </DialogDescription>
              </DialogHeader>
              {editServiceData && (
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-service-name">Service Name</Label>
                    <Input
                      id="edit-service-name"
                      type="text"
                      value={editServiceData.name}
                      onChange={(e) => setEditServiceData({ ...editServiceData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-service-category">Category</Label>
                    <Select
                      value={editServiceData.category}
                      onValueChange={(value) => setEditServiceData({ ...editServiceData, category: value })}
                    >
                      <SelectTrigger id="edit-service-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="landscaping">Landscaping</SelectItem>
                        <SelectItem value="hvac">HVAC</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="moving">Moving</SelectItem>
                        <SelectItem value="inspections">Inspections</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price-range">Price Range</Label>
                    <Input
                      id="edit-price-range"
                      type="text"
                      value={editServiceData.price}
                      onChange={(e) => setEditServiceData({ ...editServiceData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-service-description">Service Description</Label>
                    <Textarea
                      id="edit-service-description"
                      placeholder="Briefly describe this service."
                      rows={3}
                      value={editServiceData.description}
                      onChange={(e) => setEditServiceData({ ...editServiceData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-service-image">Service Image</Label>
                    <Input
                      id="edit-service-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, false)}
                    />
                    {editServiceData.imageUrl && (
                      <img src={editServiceData.imageUrl} alt="Service Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
                    )}
                  </div>
                </div>
              )}
              <Button onClick={handleSaveEditedService}>Save Changes</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfilePage;