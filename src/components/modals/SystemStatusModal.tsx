import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  HardDrive,
  Cpu,
  MemoryStick,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const systemMetrics = {
  api: {
    status: "operational",
    uptime: "99.98%",
    responseTime: "145ms",
    requests: "2.4M",
    errors: "0.02%"
  },
  database: {
    status: "operational",
    uptime: "99.99%",
    connections: "45/100",
    queryTime: "12ms",
    storage: "68%"
  },
  server: {
    status: "operational",
    cpu: 23,
    memory: 67,
    disk: 45,
    network: "stable"
  },
  services: [
    { name: "Authentication Service", status: "operational", lastCheck: "2 min ago" },
    { name: "Payment Gateway", status: "operational", lastCheck: "1 min ago" },
    { name: "Email Service", status: "degraded", lastCheck: "3 min ago" },
    { name: "File Storage", status: "operational", lastCheck: "1 min ago" },
    { name: "Analytics Engine", status: "operational", lastCheck: "2 min ago" },
    { name: "Notification System", status: "operational", lastCheck: "1 min ago" }
  ]
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "degraded":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case "down":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <CheckCircle className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "operational":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
    case "degraded":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Degraded</Badge>;
    case "down":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Down</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>;
  }
};

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            System Status Dashboard
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Real-time monitoring of platform infrastructure and services
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Server className="h-4 w-4 text-blue-600" />
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">Healthy</span>
                  {getStatusIcon(systemMetrics.api.status)}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{systemMetrics.api.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-medium">{systemMetrics.api.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requests (24h):</span>
                    <span className="font-medium">{systemMetrics.api.requests}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-600" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">Healthy</span>
                  {getStatusIcon(systemMetrics.database.status)}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{systemMetrics.database.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connections:</span>
                    <span className="font-medium">{systemMetrics.database.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Query Time:</span>
                    <span className="font-medium">{systemMetrics.database.queryTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-purple-600" />
                  Network
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">Stable</span>
                  {getStatusIcon("operational")}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="font-medium">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packet Loss:</span>
                    <span className="font-medium">0.01%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bandwidth:</span>
                    <span className="font-medium">1.2 Gbps</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Server Metrics */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Server className="h-5 w-5 text-purple-600" />
                Server Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{systemMetrics.server.cpu}%</span>
                  </div>
                  <Progress value={systemMetrics.server.cpu} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{systemMetrics.server.memory}%</span>
                  </div>
                  <Progress value={systemMetrics.server.memory} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{systemMetrics.server.disk}%</span>
                  </div>
                  <Progress value={systemMetrics.server.disk} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Status */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemMetrics.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        <p className="text-xs text-gray-500">Last check: {service.lastCheck}</p>
                      </div>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
