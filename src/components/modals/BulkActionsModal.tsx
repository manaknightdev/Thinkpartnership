import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  UserCheck, 
  Ban, 
  Mail, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from "lucide-react";

interface BulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: any[];
  onBulkAction: (action: string, vendorIds: string[]) => void;
}

export const BulkActionsModal: React.FC<BulkActionsModalProps> = ({ 
  isOpen, 
  onClose, 
  vendors,
  onBulkAction
}) => {
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVendors.length === vendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(vendors.map(v => v.id));
    }
  };

  const handleExecuteAction = async () => {
    if (!selectedAction || selectedVendors.length === 0) {
      toast.error("Please select an action and at least one vendor");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      onBulkAction(selectedAction, selectedVendors);
      
      const actionLabels = {
        approve: "approved",
        suspend: "suspended",
        activate: "activated",
        delete: "deleted",
        send_email: "sent email to"
      };

      const actionLabel = actionLabels[selectedAction as keyof typeof actionLabels] || selectedAction;
      toast.success(`Successfully ${actionLabel} ${selectedVendors.length} vendor(s)`);
      
      // Reset state
      setSelectedAction("");
      setSelectedVendors([]);
      onClose();
    } catch (error) {
      toast.error("Failed to execute bulk action. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "approve":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "suspend":
        return <Ban className="h-4 w-4 text-red-600" />;
      case "activate":
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "send_email":
        return <Mail className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case "approve":
        return "Approve selected vendors and activate their accounts";
      case "suspend":
        return "Suspend selected vendors and restrict their access";
      case "activate":
        return "Reactivate suspended vendors";
      case "delete":
        return "Permanently delete selected vendors (cannot be undone)";
      case "send_email":
        return "Send notification email to selected vendors";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const isActionDestructive = selectedAction === "delete" || selectedAction === "suspend";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-purple-600" />
            Bulk Actions
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Select vendors and choose an action to apply to all selected vendors
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Select Action</label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Choose an action to perform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Approve Vendors
                  </div>
                </SelectItem>
                <SelectItem value="suspend">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-red-600" />
                    Suspend Vendors
                  </div>
                </SelectItem>
                <SelectItem value="activate">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    Activate Vendors
                  </div>
                </SelectItem>
                <SelectItem value="send_email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    Send Email Notification
                  </div>
                </SelectItem>
                <SelectItem value="delete">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    Delete Vendors
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {selectedAction && (
              <div className={`p-3 rounded-lg border ${isActionDestructive ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {getActionIcon(selectedAction)}
                  <span className={`text-sm font-medium ${isActionDestructive ? 'text-red-800' : 'text-blue-800'}`}>
                    {selectedAction.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <p className={`text-sm ${isActionDestructive ? 'text-red-700' : 'text-blue-700'}`}>
                  {getActionDescription(selectedAction)}
                </p>
                {isActionDestructive && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">This action cannot be undone</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vendor Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Select Vendors</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectedVendors.length === vendors.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <Checkbox
                    checked={selectedVendors.includes(vendor.id)}
                    onCheckedChange={() => handleVendorToggle(vendor.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{vendor.name}</p>
                        <p className="text-xs text-gray-500">{vendor.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(vendor.status)}>
                          {vendor.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{vendor.client}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedVendors.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedVendors.length} vendor(s) selected
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExecuteAction}
            disabled={!selectedAction || selectedVendors.length === 0 || isProcessing}
            className={isActionDestructive ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}
          >
            {isProcessing ? "Processing..." : `Execute Action (${selectedVendors.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
