import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ToggleLeft, ToggleRight, Globe, CreditCard, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface ClientLicense {
  id: string;
  name: string;
  subdomain: string;
  status: "Active" | "Inactive";
  lastPayment: string;
  nextRenewal: string;
}

const mockClients: ClientLicense[] = [
  { id: "cl001", name: "Client A Corp", subdomain: "clienta", status: "Active", lastPayment: "2023-10-01", nextRenewal: "2024-10-01" },
  { id: "cl002", name: "Global Solutions", subdomain: "globalsol", status: "Active", lastPayment: "2023-11-15", nextRenewal: "2024-11-15" },
  { id: "cl003", name: "Innovate Hub", subdomain: "innovate", status: "Inactive", lastPayment: "2023-08-20", nextRenewal: "2024-08-20" },
  { id: "cl004", name: "Future Ventures", subdomain: "futurev", status: "Active", lastPayment: "2023-12-01", nextRenewal: "2024-12-01" },
];

const AdminLicenseManagementPage = () => {
  const [clients, setClients] = useState<ClientLicense[]>(mockClients);
  const [editingSubdomainId, setEditingSubdomainId] = useState<string | null>(null);
  const [currentSubdomainValue, setCurrentSubdomainValue] = useState<string>("");

  const toggleLicenseStatus = (clientId: string) => {
    setClients(clients.map(client =>
      client.id === clientId
        ? { ...client, status: client.status === "Active" ? "Inactive" : "Active" }
        : client
    ));
    const clientName = clients.find(c => c.id === clientId)?.name;
    toast.success(`${clientName}'s license status toggled!`);
  };

  const handleEditSubdomain = (client: ClientLicense) => {
    setEditingSubdomainId(client.id);
    setCurrentSubdomainValue(client.subdomain);
  };

  const handleSaveSubdomain = (clientId: string) => {
    setClients(clients.map(client =>
      client.id === clientId
        ? { ...client, subdomain: currentSubdomainValue }
        : client
    ));
    setEditingSubdomainId(null);
    toast.success("Subdomain updated successfully!");
  };

  const handleCancelEditSubdomain = () => {
    setEditingSubdomainId(null);
    setCurrentSubdomainValue("");
  };

  const getStatusVariant = (status: string) => {
    return status === "Active" ? "default" : "destructive";
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">SaaS Licensing Control Panel</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Manage client licenses, subdomain configurations, and monitor payment statuses.
      </p>

      {/* License Activation/Deactivation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Client License Management
          </CardTitle>
          <CardDescription>Activate or deactivate client marketplace licenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Subdomain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead>Next Renewal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      {editingSubdomainId === client.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={currentSubdomainValue}
                            onChange={(e) => setCurrentSubdomainValue(e.target.value)}
                            className="w-32"
                          />
                          <span className="text-gray-600 dark:text-gray-400">.thinkpartnerships.com</span>
                        </div>
                      ) : (
                        <a href={`https://${client.subdomain}.thinkpartnerships.com`} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-400">
                          {client.subdomain}.thinkpartnerships.com
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>{client.lastPayment}</TableCell>
                    <TableCell>{client.nextRenewal}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {editingSubdomainId === client.id ? (
                        <>
                          <Button onClick={() => handleSaveSubdomain(client.id)} size="sm">Save</Button>
                          <Button onClick={handleCancelEditSubdomain} variant="outline" size="sm">Cancel</Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEditSubdomain(client)} variant="outline" size="sm">
                          <Globe className="mr-2 h-4 w-4" /> Edit Subdomain
                        </Button>
                      )}
                      <Button
                        onClick={() => toggleLicenseStatus(client.id)}
                        variant="outline"
                        size="sm"
                        className={client.status === "Active" ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}
                      >
                        {client.status === "Active" ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                        {client.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Processing Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Payment Processing Overview
          </CardTitle>
          <CardDescription>Monitor subscription payments and manage billing cycles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This section would integrate with your chosen payment gateway (e.g., Stripe, PayPal) to display
            real-time payment statuses, upcoming renewals, and allow for manual invoice generation or payment collection.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>View all subscription payments (successful, failed, pending)</li>
            <li>Manage billing cycles and pricing plans for different license tiers</li>
            <li>Generate and send invoices</li>
            <li>Process refunds or adjustments</li>
          </ul>
          <Button variant="outline" disabled>
            Go to Payment Dashboard (Integration Required)
          </Button>
        </CardContent>
      </Card>

      {/* Support Ticketing / CRM Integration (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Support & CRM Integration
          </CardTitle>
          <CardDescription>Connect with customer support systems for seamless client management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Integrate with popular CRM or support ticketing systems (e.g., Salesforce, Zendesk, HubSpot)
            to centralize client communication and issue tracking.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>View client support tickets directly from their profile</li>
            <li>Track communication history and client interactions</li>
            <li>Automate onboarding and renewal workflows</li>
          </ul>
          <Button variant="outline" disabled>
            Configure CRM (Optional)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLicenseManagementPage;