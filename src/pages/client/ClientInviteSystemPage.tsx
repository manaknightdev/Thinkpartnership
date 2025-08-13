import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  UserPlus,
  Users,
  Copy,
  Mail,
  Send,
  Link as LinkIcon,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Building,
  Share,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import ClientAPI, { ClientInvite } from "@/services/ClientAPI";
import ClientReferralAPI from "@/services/ClientReferralAPI";

const ClientInviteSystemPage = () => {
  // Public site base for referral links shown to users (QA wants Netlify domain)
  const PUBLIC_SITE_BASE = (import.meta as any).env?.VITE_PUBLIC_SITE_URL ||
    "https://think-partnership.netlify.app";

  // Rewrite any incoming referral link to the public site base while preserving path and query
  const rewriteReferralLink = (link: string): string => {
    try {
      // Support absolute and relative links
      const parsed = new URL(link, PUBLIC_SITE_BASE);
      const rewritten = new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, PUBLIC_SITE_BASE);
      return rewritten.toString();
    } catch {
      return link;
    }
  };

  const [activeTab, setActiveTab] = useState("customers");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"customer" | "vendor">("customer");
  const [bulkEmails, setBulkEmails] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [selectedInvite, setSelectedInvite] = useState<ClientInvite | null>(null);
  const [isViewInviteOpen, setIsViewInviteOpen] = useState(false);
  const [invites, setInvites] = useState<ClientInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [referralLinks, setReferralLinks] = useState<any[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  // Single email invite states
  const [singleEmail, setSingleEmail] = useState("");
  const [singleInviteType, setSingleInviteType] = useState<"customer" | "vendor">("customer");
  const [sendingSingle, setSendingSingle] = useState(false);

  // Load invites and referral links on component mount
  useEffect(() => {
    loadInviteData();
  }, []);

  const loadInviteData = async () => {
    setLoading(true);
    setLoadingLinks(true);
    try {
      // Load invites and referral links in parallel
      const [inviteData, linksRes] = await Promise.all([
        ClientAPI.getInvites(),
        ClientReferralAPI.getReferralLinks()
      ]);

      // Update invites
      setInvites(inviteData || []);

      // Update referral links
      if (!linksRes.error && linksRes.data?.links) {
        setReferralLinks(linksRes.data.links);
      }

    } catch (error) {
      console.error('Error loading invite data:', error);
      toast.error('Failed to load invite data');
      setInvites([]);
    } finally {
      setLoading(false);
      setLoadingLinks(false);
    }
  };

  const customerInvites = (invites || []).filter(invite => invite?.type === "customer");
  const vendorInvites = (invites || []).filter(invite => invite?.type === "vendor");

  // Get referral links (always display with public site base, preserving query params)
  const rawCustomerLink = referralLinks.find((link) => link.referral_type === 'customer')?.url ||
    `${PUBLIC_SITE_BASE}/marketplace/register?ref=client-customer`;
  const rawVendorLink = referralLinks.find((link) => link.referral_type === 'vendor')?.url ||
    `${PUBLIC_SITE_BASE}/vendor/register?ref=client-vendor`;

  const customerReferralLink = rewriteReferralLink(rawCustomerLink);
  const vendorReferralLink = rewriteReferralLink(rawVendorLink);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} referral link copied to clipboard!`);
  };

  const handleSendInvites = async () => {
    const emails = bulkEmails.split('\n').filter(email => email.trim());
    if (emails.length === 0) {
      toast.error("Please enter at least one email address.");
      return;
    }

    try {
      setSending(true);
      const inviteData = emails.map(email => ({
        email: email.trim(),
        type: inviteType
      }));

      await ClientAPI.sendInvites(inviteData);
      toast.success(`${emails.length} ${inviteType} invite(s) sent successfully!`);
      setBulkEmails("");
      setInviteMessage("");
      setIsInviteDialogOpen(false);

      // Reload invites to show the new ones
      await loadInviteData();
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Failed to send invites. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSendSingleInvite = async () => {
    if (!singleEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(singleEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingSingle(true);
    try {
      await ClientAPI.sendSingleInvite({
        email: singleEmail,
        type: singleInviteType,
        message: `Join our marketplace to ${singleInviteType === 'customer' ? 'discover amazing services' : 'offer your services to customers'}!`
      });

      toast.success(`${singleInviteType} invite sent successfully!`);
      setSingleEmail("");

      // Reload invites to show the new one
      await loadInviteData();

    } catch (error) {
      console.error('Error sending single invite:', error);
      toast.error("Failed to send invitation");
    } finally {
      setSendingSingle(false);
    }
  };

  const handleViewInvite = (invite: ClientInvite) => {
    setSelectedInvite(invite);
    setIsViewInviteOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // const getStatusBadgeVariant = (status: string) => {
  //   switch (status?.toLowerCase()) {
  //     case 'accepted': return 'default';
  //     case 'sent': return 'secondary';
  //     case 'opened': return 'outline';
  //     case 'expired': return 'destructive';
  //     default: return 'secondary';
  //   }
  // };

  const handleResendInvite = async (invite: ClientInvite) => {
    try {
      await ClientAPI.sendInvites([{ email: invite.email, type: invite.type }]);
      toast.success(`Invite resent to ${invite.email}`);
      await loadInviteData();
    } catch (error) {
      console.error('Error resending invite:', error);
      toast.error('Failed to resend invite. Please try again.');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Accepted": return "white";
      case "Opened": return "secondary";
      case "Sent": return "outline";
      case "Expired": return "white";
      default: return "outline";
    }
  };

  const handleOpenInviteDialog = (type: "customer" | "vendor") => {
    setInviteType(type);
    setIsInviteDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite System</h1>
        <p className="text-lg text-gray-700 mb-4">
          Invite customers and vendors to join your marketplace ecosystem.
        </p>
        {/* <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={() => {
              setInviteType("customer");
              setIsInviteDialogOpen(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Customers
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setInviteType("vendor");
              setIsInviteDialogOpen(true);
            }}
          >
            <Building className="mr-2 h-4 w-4" />
            Invite Vendors
          </Button>
        </div> */}
      </div>

      {/* Quick Invite Section */}
      <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Send className="h-5 w-5 text-purple-600" />
            </div>
            Quick Invite
          </CardTitle>
          <CardDescription>Send a single invitation quickly via email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="single-email">Email Address</Label>
              <Input
                id="single-email"
                type="email"
                placeholder="user@example.com"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                disabled={sendingSingle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="single-invite-type">Invite Type</Label>
              <Select value={singleInviteType} onValueChange={(value: "customer" | "vendor") => setSingleInviteType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={handleSendSingleInvite}
                disabled={sendingSingle || !singleEmail.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {sendingSingle ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invite
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Links Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              Customer Referral Link
            </CardTitle>
            <CardDescription>Share this link to invite customers directly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <LinkIcon className="h-4 w-4 text-gray-400" />
              <code className="flex-1 text-sm text-gray-700 break-all">
                {loadingLinks ? "Loading your referral link..." : customerReferralLink}
              </code>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(customerReferralLink, "Customer")}
                className="flex-1"
                disabled={loadingLinks}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              {/* <Button variant="outline" disabled={loadingLinks}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button> */}
            </div>
            <p className="text-sm text-gray-500">
              When customers sign up through this link, they'll be attributed to your client account.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              Vendor Referral Link
            </CardTitle>
            <CardDescription>Share this link to invite vendors directly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <LinkIcon className="h-4 w-4 text-gray-400" />
              <code className="flex-1 text-sm text-gray-700 break-all">
                {loadingLinks ? "Loading your referral link..." : vendorReferralLink}
              </code>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(vendorReferralLink, "Vendor")}
                className="flex-1"
                disabled={loadingLinks}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              {/* <Button variant="outline" disabled={loadingLinks}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button> */}
            </div>
            <p className="text-sm text-gray-500">
              When vendors sign up through this link, they'll be attributed to your client account.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invite History */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite History
          </CardTitle>
          <CardDescription>Track all sent invitations and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customer Invites ({customerInvites.length})
              </TabsTrigger>
              <TabsTrigger value="vendors" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Vendor Invites ({vendorInvites.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date Sent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p>Loading invites...</p>
                        </TableCell>
                      </TableRow>
                    ) : customerInvites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No customer invites found
                        </TableCell>
                      </TableRow>
                    ) : (
                      customerInvites.map((invite) => (
                        <TableRow key={invite.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{invite.email}</TableCell>
                          <TableCell>{invite.email}</TableCell>
                          <TableCell>{formatDate(invite.sent_at)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(invite.status)}>
                              {invite.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewInvite(invite)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {invite.status !== "accepted" && (
                                <Button variant="ghost" size="sm" onClick={() => handleResendInvite(invite)}>
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="vendors" className="mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Date Sent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p>Loading invites...</p>
                        </TableCell>
                      </TableRow>
                    ) : vendorInvites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No vendor invites found
                        </TableCell>
                      </TableRow>
                    ) : (
                      vendorInvites.map((invite) => (
                        <TableRow key={invite.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{invite.email}</TableCell>
                          <TableCell>Vendor</TableCell>
                          <TableCell>{invite.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Services
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(invite.sent_at)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(invite.status)}>
                              {invite.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewInvite(invite)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {invite.status !== "accepted" && (
                                <Button variant="ghost" size="sm" onClick={() => handleResendInvite(invite)}>
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Send Invites Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Invite {inviteType === "customer" ? "Customers" : "Vendors"}
            </DialogTitle>
            <DialogDescription>
              Send email invitations to {inviteType === "customer" ? "potential customers" : "service providers"} to join your marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bulk-emails">Email Addresses</Label>
              <Textarea
                id="bulk-emails"
                placeholder={`Enter email addresses (one per line):\n\nexample1@email.com\nexample2@email.com\nexample3@email.com`}
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Enter one email address per line. You can paste multiple emails at once.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-message">Custom Message (Optional)</Label>
              <Textarea
                id="invite-message"
                placeholder={`Add a personal message to your invitation...

Example: "Hi! I'd like to invite you to join our marketplace where you can ${
                  inviteType === "customer"
                    ? "find trusted service providers for all your needs"
                    : "offer your services to customers in our network"
                }."`}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                What happens when you send invites:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Recipients will receive a branded email invitation</li>
                <li>• They'll get a unique signup link to join your marketplace</li>
                <li>• You can track invitation status in the history below</li>
                <li>• Invites expire after 30 days if not accepted</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendInvites}
              disabled={sending}
              className="bg-primary hover:bg-primary/90"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invites
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invite Details Dialog */}
      <Dialog open={isViewInviteOpen} onOpenChange={setIsViewInviteOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite Details</DialogTitle>
            <DialogDescription>
              Complete information about this invitation.
            </DialogDescription>
          </DialogHeader>
          {selectedInvite && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedInvite.type === "customer" ? "bg-green-100" : "bg-blue-100"
                }`}>
                  {selectedInvite.type === "customer" ? (
                    <Users className={`h-8 w-8 ${selectedInvite.type === "customer" ? "text-green-600" : "text-blue-600"}`} />
                  ) : (
                    <Building className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedInvite.email}</h3>
                  <p className="text-gray-600">{selectedInvite.type} invite</p>
                  <Badge variant={getStatusBadgeVariant(selectedInvite.status)} className="mt-1">
                    {selectedInvite.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Type</Label>
                  <p className="capitalize">{selectedInvite.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date Sent</Label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(selectedInvite.sent_at)}
                  </p>
                </div>
              </div>

              {selectedInvite.type === "vendor" && (
                <div className="grid grid-cols-1 gap-4">
                  {selectedInvite.company && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company</Label>
                      <p>{selectedInvite.company}</p>
                    </div>
                  )}
                  {selectedInvite.services && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Services</Label>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {selectedInvite.services}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {selectedInvite.status === "accepted" && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Successfully joined your marketplace</span>
                    </>
                  )}
                  {selectedInvite.status === "sent" && (
                    <>
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span>Invitation sent, waiting for response</span>
                    </>
                  )}
                  {selectedInvite.status === "opened" && (
                    <>
                      <Eye className="h-4 w-4 text-orange-600" />
                      <span>Invitation opened, but not yet accepted</span>
                    </>
                  )}
                  {selectedInvite.status === "expired" && (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Invitation expired after 30 days</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedInvite && selectedInvite.status !== "accepted" && (
              <Button
                onClick={() => {
                  handleResendInvite(selectedInvite);
                  setIsViewInviteOpen(false);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="mr-2 h-4 w-4" />
                Resend Invite
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientInviteSystemPage;
