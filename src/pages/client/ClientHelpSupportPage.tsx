import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Building,
  Settings,
  BarChart,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";

const ClientHelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [supportTicket, setSupportTicket] = useState({
    subject: "",
    category: "",
    priority: "",
    description: ""
  });

  const handleSubmitTicket = () => {
    if (!supportTicket.subject || !supportTicket.description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Support ticket submitted successfully! We'll get back to you within 24 hours.");
    setSupportTicket({ subject: "", category: "", priority: "", description: "" });
  };

  const faqItems = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I set up my marketplace?",
          answer: "To set up your marketplace, start by customizing your branding in the Branding section, then invite vendors through the Invite System, and configure your commission rules in Set Rules."
        },
        {
          question: "How do I invite vendors to my marketplace?",
          answer: "Go to the Invite System page and use either the referral links or send email invitations. You can invite multiple vendors at once and track their application status."
        },
        {
          question: "What commission structures can I set?",
          answer: "You can set percentage-based commissions, flat fees, or tiered commission structures based on vendor performance or service categories."
        }
      ]
    },
    {
      category: "Vendor Management",
      questions: [
        {
          question: "How do I approve vendor applications?",
          answer: "Go to Manage Vendors and click 'Review All Applications' to see pending applications. You can approve or reject each application with optional notes."
        },
        {
          question: "Can I edit vendor information after approval?",
          answer: "Yes, you can edit vendor details by going to Manage Vendors and clicking the edit button next to any vendor."
        },
        {
          question: "How do I suspend a vendor?",
          answer: "In the Manage Vendors section, click edit on the vendor and change their status to 'Suspended'. This will temporarily disable their services."
        }
      ]
    },
    {
      category: "Customer Management",
      questions: [
        {
          question: "How can I track customer referrals?",
          answer: "In the All Customers section, you can see which vendor referred each customer and track referral performance."
        },
        {
          question: "Can I invite customers directly?",
          answer: "Yes, use the Invite System to send customer invitations via email or share your customer referral link."
        },
        {
          question: "How do I view customer order history?",
          answer: "Customer order details are available in the Marketplace Orders section, where you can filter by customer."
        }
      ]
    },
    {
      category: "Reports & Analytics",
      questions: [
        {
          question: "What reports are available?",
          answer: "You can access revenue reports, vendor performance analytics, customer insights, and marketplace overview statistics in the Reports section."
        },
        {
          question: "Can I export report data?",
          answer: "Yes, most reports include export functionality to download data in CSV or PDF format."
        },
        {
          question: "How often are reports updated?",
          answer: "Reports are updated in real-time as transactions occur in your marketplace."
        }
      ]
    }
  ];

  const quickLinks = [
    { title: "Marketplace Setup Guide", icon: Building, description: "Step-by-step guide to setting up your marketplace" },
    { title: "Vendor Onboarding", icon: Users, description: "Best practices for inviting and managing vendors" },
    { title: "Commission Configuration", icon: Settings, description: "How to set up and manage commission structures" },
    { title: "Analytics Dashboard", icon: BarChart, description: "Understanding your marketplace metrics" },
    { title: "Customer Acquisition", icon: UserPlus, description: "Strategies for growing your customer base" }
  ];

  const filteredFAQs = faqItems.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-lg text-gray-700 mb-4">
          Get help with your marketplace management and find answers to common questions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700">
            <MessageCircle className="mr-2 h-4 w-4" />
            Live Chat
          </Button>
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Schedule Call
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email Support
          </Button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support team</p>
            <Badge className="bg-green-100 text-green-800">Available 24/7</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-6 text-center">
            <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Speak directly with our experts</p>
            <Badge className="bg-blue-100 text-blue-800">Mon-Fri 9AM-6PM</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Comprehensive guides and tutorials</p>
            <Badge className="bg-purple-100 text-purple-800">Always Updated</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Support Center
          </CardTitle>
          <CardDescription>Find answers, submit tickets, and access resources.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              {/* <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger> */}
            </TabsList>

            <TabsContent value="faq" className="mt-6">
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  {filteredFAQs.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{category.category}</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ticket" className="mt-6">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Before submitting a ticket:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Check our FAQ section for quick answers</li>
                    <li>• Try our live chat for immediate assistance</li>
                    <li>• Include as much detail as possible in your description</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={supportTicket.subject}
                      onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={supportTicket.category}
                      onChange={(e) => setSupportTicket({...supportTicket, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Subscription</option>
                      <option value="vendor">Vendor Management</option>
                      <option value="customer">Customer Management</option>
                      <option value="reports">Reports & Analytics</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={supportTicket.priority}
                    onChange={(e) => setSupportTicket({...supportTicket, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={supportTicket.description}
                    onChange={(e) => setSupportTicket({...supportTicket, description: e.target.value})}
                    placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                    rows={6}
                  />
                </div>

                <Button onClick={handleSubmitTicket} className="bg-green-600 hover:bg-green-700">
                  Submit Ticket
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickLinks.map((link, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <link.icon className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{link.title}</h4>
                            <p className="text-sm text-gray-600">{link.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Video Tutorials
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Marketplace Setup Walkthrough</span>
                        <Badge variant="outline">15 min</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Vendor Management Best Practices</span>
                        <Badge variant="outline">12 min</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Understanding Analytics</span>
                        <Badge variant="outline">8 min</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        System Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">All systems operational</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Payment processing: Normal</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Email notifications: Normal</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View Status Page
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientHelpSupportPage;
