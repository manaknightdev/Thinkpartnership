import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const VendorProfilePage = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile Setup</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manage your company information and service listings.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your business details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" type="text" placeholder="Your Company Name" />
          </div>
          <div>
            <Label htmlFor="company-bio">Company Bio</Label>
            <Textarea id="company-bio" placeholder="Tell us about your company and what you offer." rows={5} />
          </div>
          <div>
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" placeholder="contact@yourcompany.com" />
          </div>
          <Button>Save Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Listings</CardTitle>
          <CardDescription>Add or manage the services you offer.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            (Placeholder for a list of services, with options to add/edit/delete.)
          </p>
          <Button variant="outline">Add New Service</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfilePage;