import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ClientReportsPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reports & Analytics</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Access detailed reports and analytics for your marketplace performance.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace Performance</CardTitle>
          <CardDescription>Overview of transactions, revenue, and vendor activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            (Placeholder for various charts and data tables related to marketplace performance.)
          </p>
          <Button variant="outline">Generate Custom Report</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientReportsPage;