import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UserAPI, { UserProfile, UpdateProfileData, ChangePasswordData } from "@/services/UserAPI";
import StripeAPI, { StripeAccountStatus } from "@/services/StripeAPI";
import {
  User,
  CreditCard,
  Settings,
  Camera,
  Save,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Loader2,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  DollarSign
} from "lucide-react";

const AccountPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // API state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data for editing
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Stripe account state
  const [stripeAccount, setStripeAccount] = useState<StripeAccountStatus | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await UserAPI.getProfile();
        if (response.error) {
          throw new Error(response.message || 'Failed to load profile');
        }

        setUserProfile(response.user);
        setFormData({
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          phone: response.user.phone,
          address: response.user.address || '',
          city: response.user.city || '',
          province: response.user.province || '',
          postal_code: response.user.postal_code || '',
          bio: response.user.bio || '',
          email_notifications: response.user.email_notifications || true,
          sms_notifications: response.user.sms_notifications || false,
          marketing_emails: response.user.marketing_emails || false
        });

        // Load Stripe account status
        await loadStripeAccountStatus();
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await UserAPI.updateProfile(formData);
      if (response.error) {
        throw new Error(response.message || 'Failed to update profile');
      }

      setUserProfile(response.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await UserAPI.changePassword(passwordData);
      if (response.error) {
        throw new Error(response.message || 'Failed to change password');
      }

      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setSuccess('Password changed successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await UserAPI.uploadAvatar(file);
      if (response.error) {
        throw new Error(response.message || 'Failed to upload avatar');
      }

      // Update the user profile with new avatar
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          avatar: response.avatar_url
        });
      }
      setSuccess('Avatar updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  // Load Stripe account status
  const loadStripeAccountStatus = async () => {
    try {
      const accountStatus = await StripeAPI.getAccountStatus();
      setStripeAccount(accountStatus);
    } catch (err: any) {
      console.error('Failed to load Stripe account status:', err);
      // Don't show error for Stripe account status as it's not critical
    }
  };

  // Handle Stripe account connection
  const handleStripeConnect = async () => {
    try {
      setStripeLoading(true);
      setError('');

      await StripeAPI.redirectToStripeConnect();
    } catch (err: any) {
      setError(err.message || 'Failed to connect Stripe account');
      setStripeLoading(false);
    }
  };

  // Handle Stripe account disconnection
  const handleStripeDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Stripe account? This will disable your ability to receive payments.')) {
      return;
    }

    try {
      setStripeLoading(true);
      setError('');
      setSuccess('');

      await StripeAPI.disconnectAccount();
      await loadStripeAccountStatus();
      setSuccess('Stripe account disconnected successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect Stripe account');
    } finally {
      setStripeLoading(false);
    }
  };

  // Check for Stripe connection status from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      setSuccess('Stripe account connected successfully!');
      loadStripeAccountStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('refresh') === 'true') {
      loadStripeAccountStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "security", name: "Security", icon: Settings }
  ];

  // Loading state
  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-6 w-32 mx-auto mb-2" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index}>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  // Error state
  if (error && !userProfile) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  // No profile found
  if (!userProfile) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
              <p className="text-gray-600 mb-6">Unable to load your profile information.</p>
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={userProfile.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label htmlFor="avatar-upload">
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-green-600 hover:bg-green-700"
                  disabled={saving}
                  asChild
                >
                  <span>
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </span>
                </Button>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {userProfile.first_name || 'User'} {userProfile.last_name || ''}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(userProfile.created_at).toLocaleDateString()}
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Active Customer
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{userProfile.total_orders || 0}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">${userProfile.total_spent || 0}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
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
                value={isEditing ? formData.first_name || '' : userProfile.first_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={isEditing ? formData.last_name || '' : userProfile.last_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
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
              disabled={true}
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={isEditing ? formData.phone || '' : userProfile.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={isEditing ? formData.address || '' : userProfile.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={isEditing ? formData.city || '' : userProfile.city || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={isEditing ? formData.province || '' : userProfile.province || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={isEditing ? formData.bio || '' : userProfile.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
              rows={3}
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setSuccess('');
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );



  const renderPaymentTab = () => {

    return (
      <div className="space-y-6">
        {/* Stripe Account Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Stripe Account Connection
            </CardTitle>
            <p className="text-sm text-gray-600">
              Connect your Stripe account to receive payments and manage withdrawals securely.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {stripeAccount ? (
              <div className="space-y-4">
                {/* Account Status */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      stripeAccount.connected && stripeAccount.details_submitted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {stripeAccount.connected && stripeAccount.details_submitted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <AlertCircle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {stripeAccount.connected ? 'Stripe Account Connected' : 'Stripe Account Not Connected'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stripeAccount.connected && stripeAccount.details_submitted
                          ? 'Your account is fully set up and ready to receive payments'
                          : stripeAccount.connected
                            ? 'Complete your account setup to start receiving payments'
                            : 'Connect your Stripe account to receive payments'
                        }
                      </div>
                      {stripeAccount.individual && (
                        <div className="text-xs text-gray-500 mt-1">
                          {stripeAccount.individual.first_name} {stripeAccount.individual.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stripeAccount.connected ? (
                      <>
                        {!stripeAccount.details_submitted && (
                          <Button
                            onClick={handleStripeConnect}
                            disabled={stripeLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {stripeLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <ExternalLink className="w-4 h-4 mr-2" />
                            )}
                            Complete Setup
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={handleStripeDisconnect}
                          disabled={stripeLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          {stripeLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleStripeConnect}
                        disabled={stripeLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {stripeLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ExternalLink className="w-4 h-4 mr-2" />
                        )}
                        Connect Stripe Account
                      </Button>
                    )}
                  </div>
                </div>

                {/* Account Capabilities */}
                {stripeAccount.connected && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          stripeAccount.charges_enabled ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">Accept Payments</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {stripeAccount.charges_enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          stripeAccount.payouts_enabled ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">Receive Payouts</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {stripeAccount.payouts_enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {stripeAccount.connected && stripeAccount.requirements && stripeAccount.requirements.currently_due.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Action Required</span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-2">
                      Complete the following requirements to fully activate your account:
                    </p>
                    <ul className="text-sm text-yellow-700 list-disc list-inside">
                      {stripeAccount.requirements.currently_due.map((requirement, index) => (
                        <li key={index}>{requirement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Loading Stripe account status...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2024-01-15", amount: "$150.00", service: "Emergency Plumbing Repair", status: "Completed", type: "Payment" },
                { date: "2024-01-10", amount: "$200.00", service: "Deep House Cleaning", status: "Completed", type: "Payment" },
                { date: "2024-01-05", amount: "$80.00", service: "Professional Lawn Care", status: "Completed", type: "Payment" },
                { date: "2024-01-01", amount: "$500.00", service: "Premium Home Painting", status: "Completed", type: "Payment" }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{transaction.service}</div>
                    <div className="text-sm text-gray-600">{transaction.date} • {transaction.type}</div>
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
                <Label>Payment notifications</Label>
                <p className="text-sm text-gray-600">Get notified when payments are processed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Transaction notifications</Label>
                <p className="text-sm text-gray-600">Get notified about withdrawals and deposits</p>
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
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
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
                value={passwordData.new_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
              />
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleChangePassword}
              disabled={saving || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
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

        {/* Success/Error Messages */}
        {(error || success) && (
          <section className="py-4">
            <div className="max-w-7xl mx-auto px-4">
              {error && (
                <Alert className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
            </div>
          </section>
        )}

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
