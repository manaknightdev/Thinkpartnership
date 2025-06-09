import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bell, Code, Webhook } from "lucide-react";

const AdminIntegrationsPage = () => {
  const handleSaveNotificationSettings = () => {
    toast.success("Notification settings saved!");
  };

  const handleGenerateApiKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    navigator.clipboard.writeText(newKey);
    toast.success("New API Key generated and copied to clipboard!");
  };

  const handleAddWebhook = () => {
    toast.info("Webhook added! (Requires backend configuration)");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Platform Integrations</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manage external system integrations, notification settings, and API access for your marketplace.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notification Engine
          </CardTitle>
          <CardDescription>Configure automated email and SMS notifications for key events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This section allows you to set up and customize notifications for events such as:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>New vendor application submitted</li>
            <li>Vendor application approved/rejected</li>
            <li>New service order placed by customer</li>
            <li>Referral commission earned</li>
            <li>Client license renewal reminders</li>
          </ul>
          <div className="space-y-2">
            <Label htmlFor="notification-email">Admin Notification Email</Label>
            <Input id="notification-email" type="email" placeholder="admin@yourcompany.com" defaultValue="admin@thinkpartnerships.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-sms">Admin Notification Phone (for SMS)</Label>
            <Input id="notification-sms" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
          <p className="text-sm text-red-500 dark:text-red-400 mt-2">
            Note: Actual email/SMS sending requires backend integration with a service like SendGrid or Twilio.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" /> API Access
          </CardTitle>
          <CardDescription>Manage API keys for programmatic access to your marketplace data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Generate API keys to allow external applications to interact with your marketplace data (e.g., pull reports, manage vendors).
          </p>
          <div className="space-y-2">
            <Label htmlFor="api-key">Your API Key</Label>
            <Input id="api-key" type="text" readOnly defaultValue="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
          </div>
          <Button onClick={handleGenerateApiKey}>Generate New API Key</Button>
          <p className="text-sm text-red-500 dark:text-red-400 mt-2">
            Note: API key functionality requires backend API endpoints to be implemented.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" /> Webhooks
          </CardTitle>
          <CardDescription>Set up webhooks to send real-time data to external systems.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Configure webhook URLs to receive automated notifications when specific events occur in your marketplace (e.g., new order, vendor status change).
          </p>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input id="webhook-url" type="url" placeholder="https://your-external-system.com/webhook" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-events">Events to Trigger</Label>
            <Input id="webhook-events" type="text" placeholder="e.g., order.created, vendor.approved" defaultValue="order.created, vendor.approved" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Comma-separated list of events.</p>
          </div>
          <Button onClick={handleAddWebhook}>Add Webhook</Button>
          <p className="text-sm text-red-500 dark:text-red-400 mt-2">
            Note: Webhook functionality requires backend event triggers and a robust webhook delivery system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminIntegrationsPage;