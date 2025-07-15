import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings, Loader2 } from "lucide-react";
import AdminAPI from '@/services/AdminAPI';
import { showError, showSuccess } from '@/utils/toast';

const AdminRevenueRulesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [platformShare, setPlatformShare] = useState(10);
  const [clientShare, setClientShare] = useState(10);
  const [vendorAShare, setVendorAShare] = useState(5);
  const [vendorBShare, setVendorBShare] = useState(75);
  const [vendorBShareNoReferrer, setVendorBShareNoReferrer] = useState(80);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRevenueRules();
  }, []);

  const fetchRevenueRules = async () => {
    try {
      setIsLoading(true);

      const response = await AdminAPI.getRevenueRules();

      if (response.error) {
        showError('Failed to fetch revenue rules');
      } else {
        // Set default values if available
        const defaultRule = response.rules?.find((rule: any) => rule.rule_type === 'default');
        if (defaultRule) {
          setPlatformShare(defaultRule.platform_share || 10);
          setClientShare(defaultRule.client_share || 10);
          setVendorAShare(defaultRule.vendor_a_share || 5);
          setVendorBShare(defaultRule.vendor_b_share || 75);
          setVendorBShareNoReferrer(defaultRule.vendor_b_share_no_referrer || 80);
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

      // Validate percentages
      const totalWithReferrer = Number(platformShare) + Number(clientShare) + Number(vendorAShare) + Number(vendorBShare);
      const totalWithoutReferrer = Number(platformShare) + Number(clientShare) + Number(vendorBShareNoReferrer);

      // Check if any total exceeds 100%
      if (totalWithReferrer > 100) {
        showError(`Commission percentages with referrer cannot exceed 100%. Current total: ${totalWithReferrer.toFixed(2)}%`);
        return;
      }

      if (totalWithoutReferrer > 100) {
        showError(`Commission percentages without referrer cannot exceed 100%. Current total: ${totalWithoutReferrer.toFixed(2)}%`);
        return;
      }

      // Check if totals are exactly 100%
      if (Math.abs(totalWithReferrer - 100) > 0.01) {
        showError(`Commission percentages with referrer must add up to exactly 100%. Current total: ${totalWithReferrer.toFixed(2)}%`);
        return;
      }

      if (Math.abs(totalWithoutReferrer - 100) > 0.01) {
        showError(`Commission percentages without referrer must add up to exactly 100%. Current total: ${totalWithoutReferrer.toFixed(2)}%`);
        return;
      }

      const response = await AdminAPI.createPlatformRevenueRule({
        platform_share: Number(platformShare),
        client_share: Number(clientShare),
        vendor_a_share: Number(vendorAShare),
        vendor_b_share: Number(vendorBShare),
        vendor_b_share_no_referrer: Number(vendorBShareNoReferrer)
      });

      if (response.error) {
        showError('Failed to save default rules');
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



  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Platform Revenue & Commission Rules</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Configure the default commission splits for all marketplace transactions. The system supports a 4-way split structure.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Default Platform Commission Structure
          </CardTitle>
          <CardDescription>
            Set the default commission percentages for all marketplace transactions.
            The system automatically adjusts when there's no referrer (Vendor A).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="platform-share">Platform Share (%)</Label>
              <Input
                id="platform-share"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 10"
                value={platformShare}
                onChange={(e) => setPlatformShare(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Platform commission from each transaction</p>
            </div>

            <div>
              <Label htmlFor="client-share">Client Share (%)</Label>
              <Input
                id="client-share"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 10"
                value={clientShare}
                onChange={(e) => setClientShare(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Client commission from each transaction</p>
            </div>

            <div>
              <Label htmlFor="vendor-a-share">Vendor A Share (Referrer) (%)</Label>
              <Input
                id="vendor-a-share"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 5"
                value={vendorAShare}
                onChange={(e) => setVendorAShare(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Commission for vendor who referred the customer</p>
            </div>

            <div>
              <Label htmlFor="vendor-b-share">Vendor B Share (Service Owner) (%)</Label>
              <Input
                id="vendor-b-share"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 75"
                value={vendorBShare}
                onChange={(e) => setVendorBShare(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Commission for vendor providing the service (with referrer)</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div>
              <Label htmlFor="vendor-b-share-no-referrer">Vendor B Share (No Referrer) (%)</Label>
              <Input
                id="vendor-b-share-no-referrer"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 80"
                value={vendorBShareNoReferrer}
                onChange={(e) => setVendorBShareNoReferrer(Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Commission for vendor when there's no referrer (Vendor A gets 0%)
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Commission Summary:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-600">With Referrer:</p>
                <p>Platform: {platformShare}%</p>
                <p>Client: {clientShare}%</p>
                <p>Vendor A (Referrer): {vendorAShare}%</p>
                <p>Vendor B (Service): {vendorBShare}%</p>
                <p className={`font-medium ${
                  Math.abs((Number(platformShare) + Number(clientShare) + Number(vendorAShare) + Number(vendorBShare)) - 100) < 0.01
                    ? 'text-green-600'
                    : (Number(platformShare) + Number(clientShare) + Number(vendorAShare) + Number(vendorBShare)) > 100
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}>
                  Total: {(Number(platformShare) + Number(clientShare) + Number(vendorAShare) + Number(vendorBShare)).toFixed(2)}%
                  {(Number(platformShare) + Number(clientShare) + Number(vendorAShare) + Number(vendorBShare)) > 100 && ' ⚠️ Exceeds 100%'}
                  {(Number(platformShare) + Number(clientShare) + Number(vendorAShare) + Number(vendorBShare)) < 100 && Math.abs((Number(platformShare) + Number(clientShare) + Number(vendorAShare) + Number(vendorBShare)) - 100) > 0.01 && ' ⚠️ Under 100%'}
                </p>
              </div>
              <div>
                <p className="font-medium text-blue-600">Without Referrer:</p>
                <p>Platform: {platformShare}%</p>
                <p>Client: {clientShare}%</p>
                <p>Vendor A (Referrer): 0%</p>
                <p>Vendor B (Service): {vendorBShareNoReferrer}%</p>
                <p className={`font-medium ${
                  Math.abs((Number(platformShare) + Number(clientShare) + Number(vendorBShareNoReferrer)) - 100) < 0.01
                    ? 'text-green-600'
                    : (Number(platformShare) + Number(clientShare) + Number(vendorBShareNoReferrer)) > 100
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}>
                  Total: {(Number(platformShare) + Number(clientShare) + Number(vendorBShareNoReferrer)).toFixed(2)}%
                  {(Number(platformShare) + Number(clientShare) + Number(vendorBShareNoReferrer)) > 100 && ' ⚠️ Exceeds 100%'}
                  {(Number(platformShare) + Number(clientShare) + Number(vendorBShareNoReferrer)) < 100 && Math.abs((Number(platformShare) + Number(clientShare) + Number(vendorBShareNoReferrer)) - 100) > 0.01 && ' ⚠️ Under 100%'}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveDefaultRules}
            disabled={isSaving}
            className="flex items-center"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Commission Rules
          </Button>
        </CardContent>
      </Card>


    </div>
  );
};

export default AdminRevenueRulesPage;