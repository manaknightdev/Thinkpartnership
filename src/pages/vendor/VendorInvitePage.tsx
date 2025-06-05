import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const VendorInvitePage = () => {
  const referralLink = "https://thinkpartnerships.com/invite/yourcompanyid"; // Placeholder link

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Invite Customers</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Generate unique links or codes to invite your clients to the marketplace and earn commissions.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Unique Referral Link</CardTitle>
          <CardDescription>Share this link with your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input readOnly value={referralLink} className="flex-grow" />
            <Button onClick={copyToClipboard} className="shrink-0">
              <Copy className="mr-2 h-4 w-4" /> Copy Link
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            When customers sign up or make a purchase through this link, they'll be attributed to you.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite via Email</CardTitle>
          <CardDescription>Send personalized invitations directly from here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customer-email">Customer Email</Label>
            <Input id="customer-email" type="email" placeholder="customer@example.com" />
          </div>
          <Button>Send Invite Email</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorInvitePage;