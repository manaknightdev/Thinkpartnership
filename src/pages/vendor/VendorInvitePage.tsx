import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";

const VendorInvitePage = () => {
  const referralLink = "https://thinkpartnerships.com/invite/yourcompanyid"; // Placeholder link

  const mockSentInvites = [
    { id: "inv001", email: "customer1@example.com", dateSent: "2023-10-25", status: "Sent", conversion: "No" },
    { id: "inv002", email: "customer2@example.com", dateSent: "2023-10-20", status: "Converted", conversion: "Yes" },
    { id: "inv003", email: "customer3@example.com", dateSent: "2023-10-18", status: "Sent", conversion: "No" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const handleSendInviteEmail = () => {
    toast.success("Invite email sent successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Invite Customers</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Generate unique links or codes to invite your clients to the marketplace and earn commissions.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Your Unique Referral Link
          </CardTitle>
          <CardDescription>Share this link with your customers to track their activity.</CardDescription>
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Invite via Email
          </CardTitle>
          <CardDescription>Send personalized invitations directly from here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customer-email">Customer Email</Label>
            <Input id="customer-email" type="email" placeholder="customer@example.com" />
          </div>
          <Button onClick={handleSendInviteEmail}>Send Invite Email</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sent Invites History</CardTitle>
          <CardDescription>Track the status of your sent invitations.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockSentInvites.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Converted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSentInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>{invite.dateSent}</TableCell>
                    <TableCell>{invite.status}</TableCell>
                    <TableCell>{invite.conversion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No invites sent yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorInvitePage;