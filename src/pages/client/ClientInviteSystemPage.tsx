import React, { useState } from "react";
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
  Share
} from "lucide-react";
import { toast } from "sonner";

interface Invite {
  id: string;
  email: string;
  type: "customer" | "vendor";
  dateSent: string;
  status: "Sent" | "Opened" | "Accepted" | "Expired";
  name?: string;
  company?: string;
  services?: string;
}

const ClientInviteSystemPage = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteType, setInviteType] = useState<"customer" | "vendor">("customer");
  const [bulkEmails, setBulkEmails] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);
  const [isViewInviteOpen, setIsViewInviteOpen] = useState(false);

  // Referral links
  const customerReferralLink = "https://thinkpartnerships.com/join/customer/your-client-id";
  const vendorReferralLink = "https://thinkpartnerships.com/join/vendor/your-client-id";

  const mockInvites: Invite[] = [
    {
      id: "inv001",
      email: "sarah.johnson@email.com",
      type: "customer",
      dateSent: "2024-01-20",
      status: "Accepted",
      name: "Sarah Johnson"
    },
    {
      id: "inv002", 
      email: "mike.chen@email.com",
      type: "customer",
      dateSent: "2024-01-18",
      status: "Sent",
      name: "Mike Chen"
    },
    {
      id: "inv003",
      email: "rapidplumbers@email.com",
      type: "vendor",
      dateSent: "2024-01-15",
      status: "Accepted",
      name: "John Smith",
      company: "Rapid Plumbers",
      services: "Plumbing"
    },
    {
      id: "inv004",
      email: "brushstrokes@email.com", 
      type: "vendor",
      dateSent: "2024-01-12",
      status: "Opened",
      name: "Maria Garcia",
      company: "Brush Strokes Pro",
      services: "Painting"
    },
    {
      id: "inv005",
      email: "lisa.rodriguez@email.com",
      type: "customer", 
      dateSent: "2024-01-10",
      status: "Expired",
      name: "Lisa Rodriguez"
    }
  ];

  const customerInvites = mockInvites.filter(invite => invite.type === "customer");
  const vendorInvites = mockInvites.filter(invite => invite.type === "vendor");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} referral link copied to clipboard!`);
  };

  const handleSendInvites = () => {
    const emails = bulkEmails.split('\n').filter(email => email.trim());
    if (emails.length === 0) {
      toast.error("Please enter at least one email address.");
      return;
    }

    toast.success(`${emails.length} ${inviteType} invite(s) sent successfully!`);
    setBulkEmails("");
    setInviteMessage("");
    setIsInviteDialogOpen(false);
  };

  const handleViewInvite = (invite: Invite) => {
    setSelectedInvite(invite);
    setIsViewInviteOpen(true);
  };

  const handleResendInvite = (invite: Invite) => {
    toast.success(`Invite resent to ${invite.email}`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted": return "text-green-600";
      case "Opened": return "text-blue-600";
      case "Sent": return "text-orange-600";
      case "Expired": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite System</h1>
        <p className="text-lg text-gray-700 mb-4">
          Invite customers and vendors to join your marketplace ecosystem.
        </p>
        <div className="flex flex-wrap gap-3">
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
        </div>
      </div>

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
              <code className="flex-1 text-sm text-gray-700 break-all">{customerReferralLink}</code>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(customerReferralLink, "Customer")}
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
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
              <code className="flex-1 text-sm text-gray-700 break-all">{vendorReferralLink}</code>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(vendorReferralLink, "Vendor")}
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
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
                    {customerInvites.map((invite) => (
                      <TableRow key={invite.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{invite.name || "N/A"}</TableCell>
                        <TableCell>{invite.email}</TableCell>
                        <TableCell>{new Date(invite.dateSent).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(invite.status)} className={getStatusColor(invite.status)}>
                            {invite.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewInvite(invite)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invite.status !== "Accepted" && (
                              <Button variant="ghost" size="sm" onClick={() => handleResendInvite(invite)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
                    {vendorInvites.map((invite) => (
                      <TableRow key={invite.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{invite.name || "N/A"}</TableCell>
                        <TableCell>{invite.company || "N/A"}</TableCell>
                        <TableCell>{invite.email}</TableCell>
                        <TableCell>
                          {invite.services && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {invite.services}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(invite.dateSent).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(invite.status)} className={getStatusColor(invite.status)}>
                            {invite.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewInvite(invite)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invite.status !== "Accepted" && (
                              <Button variant="ghost" size="sm" onClick={() => handleResendInvite(invite)}>
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
            <Button onClick={handleSendInvites} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" />
              Send Invites
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
                  <h3 className="text-lg font-semibold">{selectedInvite.name || "Unknown"}</h3>
                  <p className="text-gray-600">{selectedInvite.email}</p>
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
                    {new Date(selectedInvite.dateSent).toLocaleDateString()}
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
                  {selectedInvite.status === "Accepted" && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Successfully joined your marketplace</span>
                    </>
                  )}
                  {selectedInvite.status === "Sent" && (
                    <>
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span>Invitation sent, waiting for response</span>
                    </>
                  )}
                  {selectedInvite.status === "Opened" && (
                    <>
                      <Eye className="h-4 w-4 text-orange-600" />
                      <span>Invitation opened, but not yet accepted</span>
                    </>
                  )}
                  {selectedInvite.status === "Expired" && (
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
            {selectedInvite && selectedInvite.status !== "Accepted" && (
              <Button onClick={() => handleResendInvite(selectedInvite)} className="bg-green-600 hover:bg-green-700">
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
