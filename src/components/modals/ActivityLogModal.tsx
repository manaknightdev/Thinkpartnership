import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Plus,
  Settings,
  AlertTriangle
} from "lucide-react";

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockActivityLog = [
  {
    id: 1,
    action: "Vendor Approved",
    user: "Admin User",
    target: "Rapid Plumbers",
    timestamp: "2024-01-11 14:30:25",
    type: "approval",
    details: "Vendor application approved and activated"
  },
  {
    id: 2,
    action: "Commission Rule Updated",
    user: "Admin User",
    target: "Global Revenue Rules",
    timestamp: "2024-01-11 13:15:10",
    type: "update",
    details: "Updated commission rate from 15% to 18%"
  },
  {
    id: 3,
    action: "Client Suspended",
    user: "Admin User",
    target: "Local Connect",
    timestamp: "2024-01-11 11:45:33",
    type: "suspension",
    details: "Client suspended due to payment issues"
  },
  {
    id: 4,
    action: "New Customer Added",
    user: "System",
    target: "Alice Johnson",
    timestamp: "2024-01-11 10:20:15",
    type: "creation",
    details: "Customer registered through TechCorp Solutions"
  },
  {
    id: 5,
    action: "License Renewed",
    user: "Admin User",
    target: "ServiceHub Inc",
    timestamp: "2024-01-11 09:30:45",
    type: "renewal",
    details: "Enterprise license renewed for 12 months"
  },
  {
    id: 6,
    action: "Vendor Rejected",
    user: "Admin User",
    target: "Quick Fix Services",
    timestamp: "2024-01-10 16:22:18",
    type: "rejection",
    details: "Application rejected - incomplete documentation"
  },
  {
    id: 7,
    action: "Integration Updated",
    user: "Admin User",
    target: "Stripe Payment Gateway",
    timestamp: "2024-01-10 14:55:30",
    type: "update",
    details: "Updated API keys and webhook endpoints"
  },
  {
    id: 8,
    action: "Manual Commission Added",
    user: "Admin User",
    target: "Special Project Bonus",
    timestamp: "2024-01-10 13:10:22",
    type: "creation",
    details: "Added $500 bonus commission for Q4 performance"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "approval":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "rejection":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "update":
      return <Edit className="h-4 w-4 text-blue-600" />;
    case "creation":
      return <Plus className="h-4 w-4 text-purple-600" />;
    case "renewal":
      return <Settings className="h-4 w-4 text-emerald-600" />;
    case "suspension":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getActivityBadgeColor = (type: string) => {
  switch (type) {
    case "approval":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "rejection":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "update":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "creation":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "renewal":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    case "suspension":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const ActivityLogModal: React.FC<ActivityLogModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Platform Activity Log
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Recent administrative actions and system events across the platform
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {mockActivityLog.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </h3>
                    <Badge className={getActivityBadgeColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {activity.user}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.timestamp}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Target:</span> {activity.target}
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    {activity.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
