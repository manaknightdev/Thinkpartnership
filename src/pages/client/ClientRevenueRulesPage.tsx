import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ClientRevenueRulesPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Revenue & Commission Rules</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Configure how commissions are split and managed within your marketplace.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Global Commission Settings</CardTitle>
          <CardDescription>Set default commission percentages for your marketplace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client-commission">Your Commission (%)</Label>
            <Input id="client-commission" type="number" placeholder="e.g., 10" defaultValue={10} />
          </div>
          <div>
            <Label htmlFor="vendor-commission">Vendor Commission (%)</Label>
            <Input id="vendor-commission" type="number" placeholder="e.g., 90" defaultValue={90} />
          </div>
          <Button>Save Global Rules</Button>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Service-Specific Rules</CardTitle>
          <CardDescription>Override global rules for specific service categories or vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            (Placeholder for a system to add custom rules based on service type or individual vendor agreements.)
          </p>
          <Button variant="outline">Add Custom Rule</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRevenueRulesPage;