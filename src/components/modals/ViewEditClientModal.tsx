import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  CreditCard, 
  Edit, 
  Eye, 
  Users, 
  DollarSign,
  Calendar,
  MapPin
} from "lucide-react";

interface ViewEditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  mode: 'view' | 'edit';
  onUpdate?: (client: any) => void;
}

export const ViewEditClientModal: React.FC<ViewEditClientModalProps> = ({ 
  isOpen, 
  onClose, 
  client, 
  mode, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    plan: '',
    status: '',
    contactPerson: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        website: client.website || '',
        plan: client.plan || '',
        status: client.status || '',
        contactPerson: client.contactPerson || '',
        address: client.address || '',
        description: client.description || ''
      });
    }
  }, [client]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.plan) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedClient = {
        ...client,
        ...formData
      };

      if (onUpdate) {
        onUpdate(updatedClient);
      }
      
      toast.success(`Client "${formData.name}" has been updated successfully!`);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Professional":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Basic":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Trial":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Trial":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {isEditing ? <Edit className="h-5 w-5 text-purple-600" /> : <Eye className="h-5 w-5 text-purple-600" />}
            {isEditing ? 'Edit Client' : 'Client Details'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing ? 'Update client information and settings' : 'View detailed client information and statistics'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Client Details</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Client Name *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{client.name}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  {isEditing ? (
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Trial">Trial</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{client.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{client.phone}</span>
                    </div>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                    Website
                  </Label>
                  {isEditing ? (
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{client.website}</span>
                    </div>
                  )}
                </div>

                {/* Plan */}
                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-sm font-medium text-gray-700">
                    Subscription Plan *
                  </Label>
                  {isEditing ? (
                    <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trial">Trial</SelectItem>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getPlanColor(client.plan)}>{client.plan}</Badge>
                  )}
                </div>
              </div>

              {!isEditing && (
                <DialogFooter className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button type="button" onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Client
                  </Button>
                </DialogFooter>
              )}

              {isEditing && (
                <DialogFooter className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? "Updating..." : "Update Client"}
                  </Button>
                </DialogFooter>
              )}
            </form>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{client.vendors}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    Customers
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{client.customers}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-2xl font-bold text-gray-900">{client.totalRevenue}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    Join Date
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm font-medium text-gray-900">{client.joinDate}</p>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button type="button" onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
