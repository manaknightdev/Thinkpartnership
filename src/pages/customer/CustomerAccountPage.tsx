import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CustomerAccountPage = () => {
  const handleSaveAccountDetails = () => {
    toast.success("Account details updated successfully!");
  };

  const handleChangePassword = () => {
    toast.info("Password change initiated. Check your email for instructions.");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manage your personal information, contact details, and security settings.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name, email, and contact number.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" type="text" defaultValue="Jane" />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" type="text" defaultValue="Doe" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="jane.doe@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="(123) 456-7890" />
          </div>
          <Button onClick={handleSaveAccountDetails}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <CardDescription>Change your password or manage other security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div>
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <Input id="confirm-new-password" type="password" />
          </div>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAccountPage;