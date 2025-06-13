import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Camera,
  Save,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Award,
  Calendar,
  DollarSign
} from "lucide-react";

const AccountPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data
  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    bio: "Looking for reliable home services in my area. I value quality work and professional service.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    memberSince: "2023-06-15",
    totalOrders: 12,
    totalSpent: 2450,
    favoriteCategories: ["Cleaning", "Plumbing", "Landscaping"]
  });

  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    emailOrders: true,
    emailMessages: true,
    pushNotifications: true,
    smsUpdates: false,
    weeklyDigest: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showReviews: true,
    showOrderHistory: false,
    allowMessages: true
  });

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "privacy", name: "Privacy", icon: Shield },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "security", name: "Security", icon: Settings }
  ];

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    console.log("Profile saved:", userProfile);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-green-600 hover:bg-green-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(userProfile.memberSince).toLocaleDateString()}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Verified Customer
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{userProfile.totalOrders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">${userProfile.totalSpent}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">4.8</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={userProfile.firstName}
                onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={userProfile.lastName}
                onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={userProfile.phone}
              onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={userProfile.address}
              onChange={(e) => setUserProfile(prev => ({ ...prev, address: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={userProfile.bio}
              onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
              rows={3}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
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
                <Label htmlFor="emailOrders">Order Updates</Label>
                <p className="text-sm text-gray-600">Get notified about order status changes</p>
              </div>
              <Switch
                id="emailOrders"
                checked={notifications.emailOrders}
                onCheckedChange={(checked) => handleNotificationChange("emailOrders", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailMessages">Messages</Label>
                <p className="text-sm text-gray-600">Receive messages from service providers</p>
              </div>
              <Switch
                id="emailMessages"
                checked={notifications.emailMessages}
                onCheckedChange={(checked) => handleNotificationChange("emailMessages", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailMarketing">Marketing</Label>
                <p className="text-sm text-gray-600">Promotional offers and updates</p>
              </div>
              <Switch
                id="emailMarketing"
                checked={notifications.emailMarketing}
                onCheckedChange={(checked) => handleNotificationChange("emailMarketing", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Push Notifications</h3>
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
                <Label htmlFor="smsUpdates">SMS Updates</Label>
                <p className="text-sm text-gray-600">Important updates via text message</p>
              </div>
              <Switch
                id="smsUpdates"
                checked={notifications.smsUpdates}
                onCheckedChange={(checked) => handleNotificationChange("smsUpdates", checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPrivacyTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profileVisible">Public Profile</Label>
              <p className="text-sm text-gray-600">Make your profile visible to service providers</p>
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
              <p className="text-sm text-gray-600">Display your reviews publicly</p>
            </div>
            <Switch
              id="showReviews"
              checked={privacy.showReviews}
              onCheckedChange={(checked) => handlePrivacyChange("showReviews", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowMessages">Allow Messages</Label>
              <p className="text-sm text-gray-600">Let service providers contact you directly</p>
            </div>
            <Switch
              id="allowMessages"
              checked={privacy.allowMessages}
              onCheckedChange={(checked) => handlePrivacyChange("allowMessages", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPaymentTab = () => {
    const paymentMethods = [
      {
        id: 1,
        type: "card",
        brand: "visa",
        last4: "4242",
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        name: "John Doe"
      },
      {
        id: 2,
        type: "card",
        brand: "mastercard",
        last4: "8888",
        expiryMonth: 8,
        expiryYear: 2026,
        isDefault: false,
        name: "John Doe"
      }
    ];

    const getBrandIcon = (brand: string) => {
      switch (brand) {
        case "visa":
          return "💳";
        case "mastercard":
          return "💳";
        case "amex":
          return "💳";
        default:
          return "💳";
      }
    };

    return (
      <div className="space-y-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Button className="bg-green-600 hover:bg-green-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-lg">
                    {getBrandIcon(method.brand)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        •••• •••• •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <Badge className="bg-green-100 text-green-700 text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      Set as Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2024-01-15", amount: "$150.00", service: "Emergency Plumbing Repair", status: "Paid" },
                { date: "2024-01-10", amount: "$200.00", service: "Deep House Cleaning", status: "Paid" },
                { date: "2024-01-05", amount: "$80.00", service: "Professional Lawn Care", status: "Paid" },
                { date: "2024-01-01", amount: "$500.00", service: "Premium Home Painting", status: "Paid" }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{transaction.service}</div>
                    <div className="text-sm text-gray-600">{transaction.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{transaction.amount}</div>
                    <Badge className="bg-green-100 text-green-700 text-xs">{transaction.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">View All Transactions</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-pay for recurring services</Label>
                <p className="text-sm text-gray-600">Automatically charge your default payment method</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Payment notifications</Label>
                <p className="text-sm text-gray-600">Get notified when payments are processed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Save payment methods</Label>
                <p className="text-sm text-gray-600">Securely store cards for faster checkout</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSecurityTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Update Password
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline">
              Enable 2FA
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Account Settings
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account preferences and settings.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-64">
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-2">
                      {tabs.map((tab) => (
                        <Button
                          key={tab.id}
                          variant={activeTab === tab.id ? "default" : "ghost"}
                          className={`w-full justify-start ${
                            activeTab === tab.id ? "bg-green-600 hover:bg-green-700" : ""
                          }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <tab.icon className="w-4 h-4 mr-2" />
                          {tab.name}
                        </Button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {activeTab === "profile" && renderProfileTab()}
                {activeTab === "notifications" && renderNotificationsTab()}
                {activeTab === "privacy" && renderPrivacyTab()}
                {activeTab === "security" && renderSecurityTab()}
                {activeTab === "payment" && renderPaymentTab()}
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default AccountPage;
