import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

const VendorFullReferralReportPage = () => {
  const mockFullReferralHistory = [
    { id: "ref001", customer: "Alice Smith", service: "Home Painting", date: "2023-10-26", commission: "$50.00", status: "Paid", notes: "Completed on time." },
    { id: "ref002", customer: "Bob Johnson", service: "Emergency Plumbing", date: "2023-10-20", commission: "$25.00", status: "Paid", notes: "Customer satisfied." },
    { id: "ref003", customer: "Charlie Brown", service: "HVAC Check-up", date: "2023-10-15", commission: "$30.00", status: "Pending", notes: "Awaiting client payment." },
    { id: "ref004", customer: "Diana Prince", service: "Landscaping Design", date: "2023-10-10", commission: "$70.00", status: "Paid", notes: "Large project." },
    { id: "ref005", customer: "Eve Adams", service: "Deep House Cleaning", date: "2023-10-05", commission: "$40.00", status: "Paid", notes: "Recurring client." },
    { id: "ref006", customer: "Frank White", service: "Electrical Wiring", date: "2023-09-30", commission: "$60.00", status: "Paid", notes: "New installation." },
    { id: "ref007", customer: "Grace Lee", service: "Roof Repair", date: "2023-09-25", commission: "$80.00", status: "Paid", notes: "Urgent repair." },
    { id: "ref008", customer: "Henry King", service: "Window Cleaning", date: "2023-09-20", commission: "$15.00", status: "Paid", notes: "Small job." },
    { id: "ref009", customer: "Ivy Green", service: "Pest Control", date: "2023-09-15", commission: "$35.00", status: "Pending", notes: "Follow-up required." },
    { id: "ref010", customer: "Jack Black", service: "Appliance Repair", date: "2023-09-10", commission: "$20.00", status: "Paid", notes: "Quick fix." },
  ];

  return (
    <div className="p-6">
      <Button variant="outline" className="mb-6" asChild>
        <Link to="/vendor-portal/referrals">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Referral Dashboard
        </Link>
      </Button>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Full Referral Report</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        A comprehensive list of all your referred customers and their service details.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Referral History</CardTitle>
          <CardDescription>All referrals, including status and notes.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockFullReferralHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFullReferralHistory.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.id}</TableCell>
                    <TableCell>{referral.customer}</TableCell>
                    <TableCell>{referral.service}</TableCell>
                    <TableCell>{referral.date}</TableCell>
                    <TableCell>{referral.commission}</TableCell>
                    <TableCell>{referral.status}</TableCell>
                    <TableCell>{referral.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No detailed referral history available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorFullReferralReportPage;