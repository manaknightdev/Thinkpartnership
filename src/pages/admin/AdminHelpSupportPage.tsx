import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Phone, 
  Mail, 
  Search,
  BookOpen,
  Video,
  Users,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const AdminHelpSupportPage = () => {
  const handleSubmitTicket = () => {
    toast.success("Support ticket submitted successfully!");
  };

  const handleContactSupport = () => {
    toast.info("Connecting you to support...");
  };

  const faqItems = [
    {
      question: "How do I approve new vendor applications?",
      answer: "Navigate to the Vendor Approvals page from the sidebar. Review pending applications and click 'Approve' or 'Reject' based on your assessment of the vendor's qualifications and documentation."
    },
    {
      question: "How can I set global revenue rules?",
      answer: "Go to Global Revenue Rules in the admin panel. Here you can set commission percentages, fee structures, and revenue sharing models that apply across all client marketplaces."
    },
    {
      question: "How do I generate platform reports?",
      answer: "Visit the Usage Reports section to access comprehensive analytics. You can filter by date ranges, export data, and view performance metrics for clients, vendors, and overall platform health."
    },
    {
      question: "What should I do if a client's license expires?",
      answer: "Check the License Management page for expiring licenses. You can renew licenses, send notifications to clients, or temporarily suspend access until renewal is completed."
    },
    {
      question: "How do I manage subscription plans?",
      answer: "Use the Subscription Plans section to create, modify, or deactivate plans. You can set pricing tiers, feature limitations, and billing cycles for different client types."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">
            Get assistance with platform administration and management
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </Button>
          <Button onClick={handleContactSupport} className="bg-purple-600 hover:bg-purple-700" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Admin Guide</h3>
            <p className="text-sm text-gray-600">Complete administration manual</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
              <Video className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Step-by-step video guides</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community Forum</h3>
            <p className="text-sm text-gray-600">Connect with other admins</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-4">
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">API Reference</h3>
            <p className="text-sm text-gray-600">Technical documentation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Common questions about platform administration
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search FAQs..." 
                  className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500" 
                />
              </div>
            </div>
            
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium text-gray-900">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Ticket Form */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              Submit Support Ticket
            </CardTitle>
            <CardDescription className="text-gray-600">
              Get personalized help from our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
              <Input 
                placeholder="Brief description of your issue" 
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
              <div className="flex space-x-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-green-50 hover:border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Low
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-yellow-50 hover:border-yellow-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Medium
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-red-50 hover:border-red-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  High
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
              <Textarea 
                placeholder="Please provide detailed information about your issue..."
                rows={4}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <Button onClick={handleSubmitTicket} className="w-full bg-purple-600 hover:bg-purple-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Submit Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Contact Information</CardTitle>
          <CardDescription className="text-gray-600">
            Multiple ways to reach our support team
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-sm text-gray-600">admin@realpartneros.com</p>
                <p className="text-xs text-gray-500">Response within 24 hours</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              {/* <div>
                <p className="font-medium text-gray-900">Live Chat</p>
                <p className="text-sm text-gray-600">Available 24/7</p>
                <p className="text-xs text-gray-500">Instant response</p>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHelpSupportPage;
