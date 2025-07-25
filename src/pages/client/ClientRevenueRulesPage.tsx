import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Settings, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import ClientAPI, { RevenueRule } from "@/services/ClientAPI";

const ClientRevenueRulesPage = () => {
  const [loading, setLoading] = useState(true);
  const [revenueRules, setRevenueRules] = useState<RevenueRule[]>([]);
  const [serviceFeeEnabled, setServiceFeeEnabled] = useState(true);

  // Load revenue rules on component mount
  useEffect(() => {
    loadRevenueRules();
  }, []);

  const loadRevenueRules = async () => {
    try {
      setLoading(true);
      const rulesData = await ClientAPI.getRevenueRules();
      setRevenueRules(Array.isArray(rulesData) ? rulesData : []);
    } catch (error) {
      console.error('Error loading revenue rules:', error);
      toast.error('Failed to load revenue rules');

      // Fallback to mock data if API fails
      const mockServiceRules = [
        { id: "r001", service: "Plumbing", clientShare: "15%", vendorShare: "80%", platformShare: "5%" },
        { id: "r002", service: "Painting", clientShare: "10%", vendorShare: "85%", platformShare: "5%" },
        { id: "r003", service: "Inspections", clientShare: "20%", vendorShare: "75%", platformShare: "5%" },
      ];
      setRevenueRules(mockServiceRules);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGlobalRules = async () => {
    try {
      await ClientAPI.updateRevenueRules(revenueRules);
      toast.success("Global rules saved!");
    } catch (error) {
      console.error('Error saving rules:', error);
      toast.error('Failed to save rules');
    }
  };

  const handleEditRule = async (service: string) => {
    try {
      // TODO: Replace with actual API call when client revenue rule endpoints are created
      toast.info(`Editing rule for ${service}...`);
    } catch (error) {
      console.error('Error editing rule:', error);
      toast.error('Failed to edit rule');
    }
  };

  const handleDeleteRule = async (service: string) => {
    try {
      const ruleToDelete = revenueRules?.find(rule => rule.service === service);
      if (ruleToDelete) {
        await ClientAPI.deleteRevenueRule(ruleToDelete.id);
        setRevenueRules((revenueRules || []).filter(rule => rule.service !== service));
        toast.success(`Revenue rule for ${service} deleted successfully`);
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
    }
  };

  const handleAddCustomRule = async () => {
    try {
      // TODO: Replace with actual API call when client revenue rule endpoints are created
      toast.success("Custom rule added!");
    } catch (error) {
      console.error('Error adding rule:', error);
      toast.error('Failed to add rule');
    }
  };



  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Revenue & Commission Rules</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Configure how commissions are split and managed within your marketplace.
      </p>

      {/* API Notice */}
      <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                API Integration Pending
              </p>
              <p className="text-xs text-yellow-700">
                Client-specific revenue rule endpoints need to be created in the backend. Currently displaying mock data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Fee Toggle */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Marketplace Management Service
          </CardTitle>
          <CardDescription>
            Choose whether admin manages your marketplace operations for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Professional Management Service</h3>
              <p className="text-sm text-gray-600">
                {serviceFeeEnabled
                  ? "Admin manages your marketplace for 2.5% service fee"
                  : "You manage your marketplace independently"
                }
              </p>
            </div>
            {/* <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                {serviceFeeEnabled ? "Enabled" : "Disabled"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={serviceFeeEnabled}
                  onChange={(e) => handleToggleServiceFee(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Global Commission Settings</CardTitle>
          <CardDescription>Set default commission percentages for your marketplace after platform fees.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Fee Structure Overview:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Platform Transaction Fee: 5% (charged by admin)</p>
              {serviceFeeEnabled && <p>• Service Fee: 2.5% (marketplace management by admin)</p>}
              <p>• Remaining amount is split between you and vendors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="client-commission">Your Commission (%)</Label>
              <Input id="client-commission" type="number" placeholder="e.g., 10" defaultValue={10} />
            </div>
            <div>
              <Label htmlFor="platform-commission">Platform Commission (%)</Label>
              <Input id="platform-commission" type="number" placeholder="e.g., 3" defaultValue={3} readOnly className="bg-gray-50 cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="vendor-commission">Vendor Commission (%)</Label>
              <Input id="vendor-commission" type="number" placeholder="e.g., 85" defaultValue={85} />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Example: $100 Transaction</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Customer Payment:</span>
                <span className="font-medium">$100.00</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Platform Fee (5%):</span>
                <span>-$5.00</span>
              </div>
              {serviceFeeEnabled && (
                <div className="flex justify-between text-blue-600">
                  <span>Service Fee (2.5%):</span>
                  <span>-$2.50</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>Your Commission (10% of ${serviceFeeEnabled ? '92.50' : '95.00'}):</span>
                <span>-${serviceFeeEnabled ? '9.25' : '9.50'}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Vendor Receives:</span>
                <span className="text-green-600">${serviceFeeEnabled ? '83.25' : '85.50'}</span>
              </div>
            </div>
            {!serviceFeeEnabled && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <CheckCircle className="inline h-4 w-4 mr-1" />
                  <strong>Higher margins:</strong> Without service fees, you and your vendors keep more of each transaction.
                </p>
              </div>
            )}
          </div>

          <Button onClick={handleSaveGlobalRules}>Save Global Rules</Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Service-Specific Rules</CardTitle>
          <CardDescription>Override global rules for specific service categories or vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          {(revenueRules?.length || 0) > 0 ? (
            <div className="overflow-x-auto">
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Category</TableHead>
                    <TableHead>Your Share</TableHead>
                    <TableHead>Vendor Share</TableHead>
                    <TableHead>Platform Share</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p>Loading revenue rules...</p>
                      </TableCell>
                    </TableRow>
                  ) : !revenueRules || revenueRules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No revenue rules found
                      </TableCell>
                    </TableRow>
                  ) : (
                    revenueRules?.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.service}</TableCell>
                        <TableCell>{rule.clientShare}</TableCell>
                        <TableCell>{rule.vendorShare}</TableCell>
                        <TableCell>{rule.platformShare}</TableCell>
                        <TableCell className="text-right">
                          <Button onClick={() => handleEditRule(rule.service)} variant="ghost" size="sm">Edit</Button>
                          <Button onClick={() => handleDeleteRule(rule.service)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-4">No service-specific rules configured yet.</p>
          )}
          
          <h3 className="text-xl font-semibold mb-4">Add New Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-client-share">Your Share (%)</Label>
              <Input id="new-client-share" type="number" placeholder="e.g., 15" />
            </div>
            <div>
              <Label htmlFor="new-vendor-share">Vendor Share (%)</Label>
              <Input id="new-vendor-share" type="number" placeholder="e.g., 85" />
            </div>
            <div>
              <Label htmlFor="new-platform-share">Platform Share (%)</Label>
              <Input id="new-platform-share" type="number" placeholder="e.g., 3" defaultValue={3} readOnly className="bg-gray-50 cursor-not-allowed" />
            </div>
          </div>
          <Button onClick={handleAddCustomRule} className="mt-4">Add Custom Rule</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRevenueRulesPage;