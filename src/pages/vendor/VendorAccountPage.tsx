import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const VendorAccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [vendorProfile, setVendorProfile] = useState({
    companyName: "Rapid Plumbers",
    ownerName: "John Smith",
    email: "john@rapidplumbers.com",
    phone: "(555) 123-4567",
    website: "https://www.rapidplumbers.com",
    address: "123 Main Street, Anytown, ST 12345",
    businessLicense: "BL-2023-001234",
    insuranceNumber: "INS-789456123",
    taxId: "TAX-987654321",
    bio: "Professional plumbing services with 15+ years of experience. We provide 24/7 emergency services, leak detection, drain cleaning, and water heater installations.",
  });

  const [notifications, setNotifications] = useState({
    emailRequests: true,
    emailMessages: true,
    emailPayments: true,
    emailReviews: true,
    pushNotifications: true,
    smsUrgent: true,
    weeklyReport: true,
    monthlyReport: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showReviews: true,
    showCompletedJobs: true,
    allowDirectContact: true,
    showResponseTime: true,
  });

  const tabs = [
    { id: "profile", name: "Account Info", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "privacy", name: "Privacy", icon: Shield },
    { id: "security", name: "Security", icon: Settings }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Notification preferences updated!");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success("Privacy settings updated!");
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Account Information</CardTitle>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownerName">Full Name *</Label>
              <Input
                id="ownerName"
                value={vendorProfile.ownerName}
                onChange={(e) => setVendorProfile({...vendorProfile, ownerName: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={vendorProfile.email}
                onChange={(e) => setVendorProfile({...vendorProfile, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={vendorProfile.phone}
                onChange={(e) => setVendorProfile({...vendorProfile, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={vendorProfile.companyName}
                disabled={true}
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Update company details in <a href="/vendor-portal/profile" className="text-blue-600 hover:underline">Profile Setup</a>
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Account Type</p>
                <p className="text-sm text-gray-600">Verified Vendor Account</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Email Verification</p>
                <p className="text-sm text-gray-600">Email address verified</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Phone Verification</p>
                <p className="text-sm text-gray-600">Phone number verified</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Payment Setup</p>
                <p className="text-sm text-gray-600">Bank account connected</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Connected</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Email Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailRequests">New Service Requests</Label>
                <p className="text-sm text-gray-600">Get notified when customers request your services</p>
              </div>
              <Switch
                id="emailRequests"
                checked={notifications.emailRequests}
                onCheckedChange={(checked) => handleNotificationChange("emailRequests", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailMessages">New Messages</Label>
                <p className="text-sm text-gray-600">Customer messages and chat notifications</p>
              </div>
              <Switch
                id="emailMessages"
                checked={notifications.emailMessages}
                onCheckedChange={(checked) => handleNotificationChange("emailMessages", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailPayments">Payment Updates</Label>
                <p className="text-sm text-gray-600">Payment confirmations and invoices</p>
              </div>
              <Switch
                id="emailPayments"
                checked={notifications.emailPayments}
                onCheckedChange={(checked) => handleNotificationChange("emailPayments", checked)}
              />
            </div>

          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Mobile & SMS</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Real-time notifications on your device</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsUrgent">Urgent SMS Alerts</Label>
                <p className="text-sm text-gray-600">Emergency requests and time-sensitive updates</p>
              </div>
              <Switch
                id="smsUrgent"
                checked={notifications.smsUrgent}
                onCheckedChange={(checked) => handleNotificationChange("smsUrgent", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Reports</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyReport">Weekly Business Report</Label>
                <p className="text-sm text-gray-600">Summary of requests, earnings, and performance</p>
              </div>
              <Switch
                id="weeklyReport"
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => handleNotificationChange("weeklyReport", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthlyReport">Monthly Analytics</Label>
                <p className="text-sm text-gray-600">Detailed business insights and trends</p>
              </div>
              <Switch
                id="monthlyReport"
                checked={notifications.monthlyReport}
                onCheckedChange={(checked) => handleNotificationChange("monthlyReport", checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your vendor account preferences and business information.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "notifications" && renderNotificationsTab()}
          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profileVisible">Public Profile</Label>
                    <p className="text-sm text-gray-600">Make your business profile visible to customers</p>
                  </div>
                  <Switch
                    id="profileVisible"
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showReviews">Show Reviews</Label>
                    <p className="text-sm text-gray-600">Display customer reviews on your profile</p>
                  </div>
                  <Switch
                    id="showReviews"
                    checked={privacy.showReviews}
                    onCheckedChange={(checked) => handlePrivacyChange("showReviews", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowDirectContact">Allow Direct Contact</Label>
                    <p className="text-sm text-gray-600">Let customers contact you directly</p>
                  </div>
                  <Switch
                    id="allowDirectContact"
                    checked={privacy.allowDirectContact}
                    onCheckedChange={(checked) => handlePrivacyChange("allowDirectContact", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">Change Password</Button>
                {/* <Button variant="outline">Two-Factor Authentication</Button> */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorAccountPage;
