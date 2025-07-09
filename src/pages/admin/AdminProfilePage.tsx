import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminAPI from '@/services/AdminAPI';
import { showError, showSuccess } from '@/utils/toast';
import {
  User,
  Shield,
  Settings,
  Bell,
  Key,
  Crown,
  Building,
  Users,
  BarChart,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

const AdminProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "Platform Administrator",
    department: "System Operations",
    location: "",
    joinDate: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await AdminAPI.getProfile();

        if (response.error) {
          showError(response.message || 'Failed to fetch profile data');
        } else {
          const userData = response.user;
          setProfileData({
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            title: userData.title || 'Platform Administrator',
            department: userData.department || 'System Operations',
            location: userData.location || '',
            joinDate: userData.created_at ? new Date(userData.created_at).toISOString().split('T')[0] : '',
            bio: userData.bio || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [systemSettings, setSystemSettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    systemAlerts: true,
    maintenanceMode: false,
    debugMode: false,
    auditLogging: true,
  });

  const [permissions] = useState([
    { name: "Full System Access", level: "Administrator", active: true },
    { name: "User Management", level: "Full Control", active: true },
    { name: "Financial Operations", level: "Full Control", active: true },
    { name: "System Configuration", level: "Full Control", active: true },
    { name: "Data Export", level: "Full Control", active: true },
    { name: "Audit Logs", level: "Read/Write", active: true },
  ]);

  const tabs = [
    { id: "profile", name: "Profile Info", icon: User },
    { id: "security", name: "Security", icon: Shield },
    // { id: "system", name: "System Settings", icon: Settings },
    // { id: "permissions", name: "Permissions", icon: Key }
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemSettingChange = (setting: string, value: boolean) => {
    setSystemSettings(prev => ({ ...prev, [setting]: value }));
    toast.info(`${setting} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const updateData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        title: profileData.title,
        department: profileData.department,
        location: profileData.location,
        bio: profileData.bio,
      };

      const response = await AdminAPI.updateProfile(updateData);

      if (response.error) {
        showError(response.message || 'Failed to update profile');
      } else {
        setIsEditing(false);
        showSuccess("Admin profile updated successfully!");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    toast.info("Password change initiated. Check your email for instructions.");
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Shield className="w-12 h-12 text-purple-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      {profileData.title}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {profileData.department}
                    </span>
                    {profileData.joinDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Since {new Date(profileData.joinDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Super Admin
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                </>
              )}
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={3}
            />
          </div>
          {isEditing && (
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-600" />
            Password & Authentication
          </CardTitle>
          <CardDescription>
            Manage your password and authentication settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="Enter new password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
          </div>
          <Button onClick={handleChangePassword} className="bg-purple-600 hover:bg-purple-700">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Secure your account with 2FA</p>
            </div>
            <Switch
              checked={systemSettings.twoFactorEnabled}
              onCheckedChange={(checked) => handleSystemSettingChange("twoFactorEnabled", checked)}
            />
          </div>
          {systemSettings.twoFactorEnabled && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                Two-factor authentication is enabled. Your account is protected with an additional security layer.
              </p>
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            System Preferences
          </CardTitle>
          <CardDescription>
            Configure your system-wide preferences and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive email alerts for system events</p>
            </div>
            <Switch
              checked={systemSettings.emailNotifications}
              onCheckedChange={(checked) => handleSystemSettingChange("emailNotifications", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>System Alerts</Label>
              <p className="text-sm text-gray-600">Get notified about critical system issues</p>
            </div>
            <Switch
              checked={systemSettings.systemAlerts}
              onCheckedChange={(checked) => handleSystemSettingChange("systemAlerts", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Audit Logging</Label>
              <p className="text-sm text-gray-600">Track all administrative actions</p>
            </div>
            <Switch
              checked={systemSettings.auditLogging}
              onCheckedChange={(checked) => handleSystemSettingChange("auditLogging", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Advanced Settings
          </CardTitle>
          <CardDescription>
            Advanced system configuration options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-gray-600">Put the platform in maintenance mode</p>
            </div>
            <Switch
              checked={systemSettings.maintenanceMode}
              onCheckedChange={(checked) => handleSystemSettingChange("maintenanceMode", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Debug Mode</Label>
              <p className="text-sm text-gray-600">Enable detailed system logging</p>
            </div>
            <Switch
              checked={systemSettings.debugMode}
              onCheckedChange={(checked) => handleSystemSettingChange("debugMode", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPermissionsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            System Permissions
          </CardTitle>
          <CardDescription>
            Your current access levels and permissions across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissions.map((permission, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${permission.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{permission.name}</p>
                    <p className="text-sm text-gray-600">Access Level: {permission.level}</p>
                  </div>
                </div>
                <Badge variant={permission.active ? "default" : "secondary"} className={permission.active ? "bg-green-100 text-green-700" : ""}>
                  {permission.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used administrative actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="/admin-portal/clients">
              <Building className="mr-2 h-4 w-4" />
              Manage All Clients
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="/admin-portal/vendors">
              <Users className="mr-2 h-4 w-4" />
              Manage All Vendors
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="/admin-portal/reports">
              <BarChart className="mr-2 h-4 w-4" />
              View System Reports
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="/admin-portal/revenue-rules">
              <Settings className="mr-2 h-4 w-4" />
              Global Revenue Rules
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your administrator profile, security settings, and system permissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-purple-100 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "security" && renderSecurityTab()}
          {activeTab === "system" && renderSystemTab()}
          {activeTab === "permissions" && renderPermissionsTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
