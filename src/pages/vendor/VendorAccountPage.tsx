import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import VendorAuthAPI from "@/services/VendorAuthAPI";
import { showSuccess, showError } from "@/utils/toast";

const VendorAccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [vendorProfile, setVendorProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_name: "",
    business_address: "",
    business_license: "",
    insurance_number: "",
    tax_id: "",
    website: "",
    bio: "",
  });

  const [originalProfile, setOriginalProfile] = useState(vendorProfile);

  const [notifications, setNotifications] = useState({
    email_requests: true,
    email_messages: true,
    email_payments: true,
    email_reviews: true,
    push_notifications: true,
    sms_urgent: true,
    weekly_report: true,
    monthly_report: true,
  });

  const [privacy, setPrivacy] = useState({
    profile_visible: true,
    show_reviews: true,
    show_completed_jobs: true,
    allow_direct_contact: true,
    show_response_time: true,
  });

  const tabs = [
    { id: "profile", name: "Account Info", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "privacy", name: "Privacy", icon: Shield },
    { id: "security", name: "Security", icon: Settings }
  ];

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await VendorAuthAPI.getProfile();

      if (response.error) {
        setError(response.message || "Failed to load profile");
        return;
      }

      const profileData = {
        first_name: response.user.first_name || "",
        last_name: response.user.last_name || "",
        email: response.user.email || "",
        phone: response.user.phone || "",
        company_name: response.user.company_name || "",
        business_address: response.user.business_address || "",
        business_license: response.user.business_license || "",
        insurance_number: response.user.insurance_number || "",
        tax_id: response.user.tax_id || "",
        website: response.user.website || "",
        bio: response.user.bio || "",
      };

      setVendorProfile(profileData);
      setOriginalProfile(profileData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError("");

      const response = await VendorAuthAPI.updateProfile(vendorProfile);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
      }

      setOriginalProfile(vendorProfile);
      setIsEditing(false);
      showSuccess("Profile updated successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setVendorProfile(originalProfile);
    setIsEditing(false);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    // TODO: Add API call to save notification preferences
    showSuccess("Notification preferences updated!");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    // TODO: Add API call to save privacy settings
    showSuccess("Privacy settings updated!");
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Account Information</CardTitle>
          <div className="flex gap-2">
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={vendorProfile.first_name}
                onChange={(e) => setVendorProfile({...vendorProfile, first_name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={vendorProfile.last_name}
                onChange={(e) => setVendorProfile({...vendorProfile, last_name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={vendorProfile.phone}
                onChange={(e) => setVendorProfile({...vendorProfile, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={vendorProfile.company_name}
                onChange={(e) => setVendorProfile({...vendorProfile, company_name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={vendorProfile.website}
                onChange={(e) => setVendorProfile({...vendorProfile, website: e.target.value})}
                disabled={!isEditing}
                placeholder="https://www.yourcompany.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input
              id="businessAddress"
              value={vendorProfile.business_address}
              onChange={(e) => setVendorProfile({...vendorProfile, business_address: e.target.value})}
              disabled={!isEditing}
              placeholder="123 Main Street, City, State, ZIP"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="businessLicense">Business License</Label>
              <Input
                id="businessLicense"
                value={vendorProfile.business_license}
                onChange={(e) => setVendorProfile({...vendorProfile, business_license: e.target.value})}
                disabled={!isEditing}
                placeholder="BL-2023-001234"
              />
            </div>
            <div>
              <Label htmlFor="insuranceNumber">Insurance Number</Label>
              <Input
                id="insuranceNumber"
                value={vendorProfile.insurance_number}
                onChange={(e) => setVendorProfile({...vendorProfile, insurance_number: e.target.value})}
                disabled={!isEditing}
                placeholder="INS-789456123"
              />
            </div>
            <div>
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={vendorProfile.tax_id}
                onChange={(e) => setVendorProfile({...vendorProfile, tax_id: e.target.value})}
                disabled={!isEditing}
                placeholder="TAX-987654321"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Business Bio</Label>
            <Textarea
              id="bio"
              value={vendorProfile.bio}
              onChange={(e) => setVendorProfile({...vendorProfile, bio: e.target.value})}
              disabled={!isEditing}
              placeholder="Describe your business, services, and experience..."
              rows={4}
            />
          </div>
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
                checked={notifications.email_requests}
                onCheckedChange={(checked) => handleNotificationChange("email_requests", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailMessages">New Messages</Label>
                <p className="text-sm text-gray-600">Customer messages and chat notifications</p>
              </div>
              <Switch
                id="emailMessages"
                checked={notifications.email_messages}
                onCheckedChange={(checked) => handleNotificationChange("email_messages", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailPayments">Payment Updates</Label>
                <p className="text-sm text-gray-600">Payment confirmations and invoices</p>
              </div>
              <Switch
                id="emailPayments"
                checked={notifications.email_payments}
                onCheckedChange={(checked) => handleNotificationChange("email_payments", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailReviews">Review Notifications</Label>
                <p className="text-sm text-gray-600">New reviews and ratings from customers</p>
              </div>
              <Switch
                id="emailReviews"
                checked={notifications.email_reviews}
                onCheckedChange={(checked) => handleNotificationChange("email_reviews", checked)}
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
                checked={notifications.push_notifications}
                onCheckedChange={(checked) => handleNotificationChange("push_notifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsUrgent">Urgent SMS Alerts</Label>
                <p className="text-sm text-gray-600">Emergency requests and time-sensitive updates</p>
              </div>
              <Switch
                id="smsUrgent"
                checked={notifications.sms_urgent}
                onCheckedChange={(checked) => handleNotificationChange("sms_urgent", checked)}
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
                checked={notifications.weekly_report}
                onCheckedChange={(checked) => handleNotificationChange("weekly_report", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthlyReport">Monthly Analytics</Label>
                <p className="text-sm text-gray-600">Detailed business insights and trends</p>
              </div>
              <Switch
                id="monthlyReport"
                checked={notifications.monthly_report}
                onCheckedChange={(checked) => handleNotificationChange("monthly_report", checked)}
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

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

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
                    checked={privacy.profile_visible}
                    onCheckedChange={(checked) => handlePrivacyChange("profile_visible", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showReviews">Show Reviews</Label>
                    <p className="text-sm text-gray-600">Display customer reviews on your profile</p>
                  </div>
                  <Switch
                    id="showReviews"
                    checked={privacy.show_reviews}
                    onCheckedChange={(checked) => handlePrivacyChange("show_reviews", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showCompletedJobs">Show Completed Jobs</Label>
                    <p className="text-sm text-gray-600">Display your completed work portfolio</p>
                  </div>
                  <Switch
                    id="showCompletedJobs"
                    checked={privacy.show_completed_jobs}
                    onCheckedChange={(checked) => handlePrivacyChange("show_completed_jobs", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowDirectContact">Allow Direct Contact</Label>
                    <p className="text-sm text-gray-600">Let customers contact you directly</p>
                  </div>
                  <Switch
                    id="allowDirectContact"
                    checked={privacy.allow_direct_contact}
                    onCheckedChange={(checked) => handlePrivacyChange("allow_direct_contact", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showResponseTime">Show Response Time</Label>
                    <p className="text-sm text-gray-600">Display your average response time to customers</p>
                  </div>
                  <Switch
                    id="showResponseTime"
                    checked={privacy.show_response_time}
                    onCheckedChange={(checked) => handlePrivacyChange("show_response_time", checked)}
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
