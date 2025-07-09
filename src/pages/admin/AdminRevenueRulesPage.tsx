import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Settings, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import AdminAPI from '@/services/AdminAPI';
import { showError, showSuccess } from '@/utils/toast';

const mockGlobalServiceRules = [
  { id: "r001", service: "Plumbing", platformShare: "10%", clientShare: "10%", vendorShare: "80%" },
  { id: "r002", service: "Painting", platformShare: "8%", clientShare: "12%", vendorShare: "80%" },
  { id: "r003", service: "Inspections", platformShare: "15%", clientShare: "5%", vendorShare: "80%" },
];

const AdminRevenueRulesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [revenueRules, setRevenueRules] = useState([]);
  const [defaultPlatformCommission, setDefaultPlatformCommission] = useState(5);
  const [defaultClientCommission, setDefaultClientCommission] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRevenueRules();
  }, []);

  const fetchRevenueRules = async () => {
    try {
      setIsLoading(true);

      const response = await AdminAPI.getRevenueRules();

      if (response.error) {
        showError(response.message || 'Failed to fetch revenue rules');
      } else {
        setRevenueRules(response.rules || []);
        // Set default values if available
        const defaultRule = response.rules?.find(rule => rule.is_default);
        if (defaultRule) {
          setDefaultPlatformCommission(defaultRule.platform_commission || 5);
          setDefaultClientCommission(defaultRule.client_commission || 10);
        }
      }
    } catch (error) {
      console.error('Error fetching revenue rules:', error);
      showError('Failed to load revenue rules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDefaultRules = async () => {
    try {
      setIsSaving(true);

      const response = await AdminAPI.updateDefaultRevenueRules({
        platform_commission: defaultPlatformCommission,
        client_commission: defaultClientCommission
      });

      if (response.error) {
        showError(response.message || 'Failed to save default rules');
      } else {
        showSuccess('Default platform rules saved successfully!');
        fetchRevenueRules(); // Refresh the list
      }
    } catch (error) {
      console.error('Error saving default rules:', error);
      showError('Failed to save default rules. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRule = async (ruleId: string) => {
    try {
      // This would typically open a modal for editing
      toast.info('Edit functionality would open a modal here');
    } catch (error) {
      console.error('Error editing rule:', error);
      showError('Failed to edit rule. Please try again.');
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      const response = await AdminAPI.deleteRevenueRule(ruleId);

      if (response.error) {
        showError(response.message || 'Failed to delete rule');
      } else {
        showSuccess('Revenue rule deleted successfully');
        fetchRevenueRules(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
      showError('Failed to delete rule. Please try again.');
    }
  };

  const handleAddCustomRule = async (ruleData: any) => {
    try {
      const response = await AdminAPI.createRevenueRule(ruleData);

      if (response.error) {
        showError(response.message || 'Failed to create rule');
      } else {
        showSuccess('New revenue rule created successfully!');
        fetchRevenueRules(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating rule:', error);
      showError('Failed to create rule. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Global Revenue & Commission Rules</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Configure the default commission splits and revenue sharing across the entire marketplace.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Default Platform Commission
          </CardTitle>
          <CardDescription>Set the default percentage the platform takes from each transaction.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="platform-commission">Platform Share (%)</Label>
            <Input
              id="platform-commission"
              type="number"
              placeholder="e.g., 5"
              value={defaultPlatformCommission}
              onChange={(e) => setDefaultPlatformCommission(Number(e.target.value))}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This percentage is taken before the remaining amount is split between the client and vendor.
          </p>
          <Button
            onClick={handleSaveDefaultRules}
            disabled={isSaving}
            className="flex items-center"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Default Rules
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Global Service-Specific Rules
          </CardTitle>
          <CardDescription>Define custom commission splits for specific service categories that apply globally.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading revenue rules...
              </div>
            </div>
          ) : (revenueRules.length > 0 || mockGlobalServiceRules.length > 0) ? (
            <div className="overflow-x-auto">
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Category</TableHead>
                    <TableHead>Platform Share</TableHead>
                    <TableHead>Client Share</TableHead>
                    <TableHead>Vendor Share</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(revenueRules.length > 0 ? revenueRules : mockGlobalServiceRules).map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        {rule.service_category || rule.service}
                      </TableCell>
                      <TableCell>
                        {rule.platform_commission || rule.platformShare}%
                      </TableCell>
                      <TableCell>
                        {rule.client_commission || rule.clientShare}%
                      </TableCell>
                      <TableCell>
                        {rule.vendor_commission || rule.vendorShare}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleEditRule(rule.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteRule(rule.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-4">No global service-specific rules configured yet.</p>
          )}
          
          <h3 className="text-xl font-semibold mb-4">Add New Global Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="new-service-category">Service Category</Label>
              <Select>
                <SelectTrigger id="new-service-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="moving">Moving</SelectItem>
                  <SelectItem value="inspections">Inspections</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-platform-share">Platform Share (%)</Label>
              <Input id="new-platform-share" type="number" placeholder="e.g., 5" />
            </div>
            <div>
              <Label htmlFor="new-client-share">Client Share (%)</Label>
              <Input id="new-client-share" type="number" placeholder="e.g., 10" />
            </div>
            <div>
              <Label htmlFor="new-vendor-share">Vendor Share (%)</Label>
              <Input id="new-vendor-share" type="number" placeholder="e.g., 85" />
            </div>
          </div>
          <Button onClick={handleAddCustomRule} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Global Rule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenueRulesPage;