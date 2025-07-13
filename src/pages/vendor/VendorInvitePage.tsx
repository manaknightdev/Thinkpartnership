import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import VendorInviteAPI from "@/services/VendorInviteAPI";
import VendorReferralAPI from "@/services/VendorReferralAPI";

const VendorInvitePage = () => {
  // State for API data
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [referralLinks, setReferralLinks] = useState([]);
  const [sentInvites, setSentInvites] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadInviteData();
  }, []);

  const loadInviteData = async () => {
    setLoading(true);
    try {
      // Load referral links and sent invitations in parallel
      const [linksRes, invitesRes] = await Promise.all([
        VendorReferralAPI.getReferralLinks(),
        VendorInviteAPI.getInvitations({ limit: 20 })
      ]);

      // Update referral links
      if (!linksRes.error && linksRes.data?.links) {
        setReferralLinks(linksRes.data.links);
      }

      // Update sent invites
      if (!invitesRes.error && invitesRes.data?.invitations) {
        setSentInvites(invitesRes.data.invitations);
      } else if (!invitesRes.error && invitesRes.invitations) {
        // Handle direct response format
        setSentInvites(invitesRes.invitations);
      }

    } catch (error) {
      console.error('Error loading invite data:', error);
      toast.error('Failed to load invite data');
    } finally {
      setLoading(false);
    }
  };

  // Get the primary referral link
  const referralLink = referralLinks.length > 0
    ? referralLinks[0].url
    : "https://realpartneros.com/invite/yourcompanyid";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const handleSendInviteEmail = async () => {
    if (!customerEmail.trim()) {
      toast.error("Please enter a customer email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSending(true);
    try {
      const response = await VendorInviteAPI.sendInvitation({
        email: customerEmail,
        name: "", // Optional name field
        invitation_type: "customer",
        message: "Join our marketplace to discover amazing services!"
      });

      if (response.error) {
        toast.error(response.message || "Failed to send invitation");
        return;
      }

      toast.success("Invite email sent successfully!");
      setCustomerEmail(""); // Clear the input

      // Reload invitations to show the new one
      loadInviteData();

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error("Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  // Show loading state for initial load
  if (loading && sentInvites.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invite page...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              readOnly
              value={loading ? "Loading your referral link..." : referralLink}
              className="flex-grow"
              disabled={loading}
            />
            <Button
              onClick={copyToClipboard}
              className="shrink-0"
              disabled={loading}
            >
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
            <Input
              id="customer-email"
              type="email"
              placeholder="customer@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              disabled={sending}
            />
          </div>
          <Button
            onClick={handleSendInviteEmail}
            disabled={sending || !customerEmail.trim()}
          >
            {sending ? "Sending..." : "Send Invite Email"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sent Invites History</CardTitle>
          <CardDescription>Track the status of your sent invitations.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sent invites...</p>
            </div>
          ) : sentInvites.length > 0 ? (
            <div className="overflow-x-auto">
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
                  {sentInvites.map((invite: any) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">
                        {invite.invitee_email}
                      </TableCell>
                      <TableCell>
                        {new Date(invite.sent_at || invite.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invite.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : invite.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invite.status === 'expired'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invite.status === 'accepted' ? 'Converted' :
                           invite.status === 'pending' ? 'Sent' :
                           invite.status === 'expired' ? 'Expired' :
                           invite.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {invite.status === 'accepted' ? 'Yes' : 'No'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No invites sent yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorInvitePage;