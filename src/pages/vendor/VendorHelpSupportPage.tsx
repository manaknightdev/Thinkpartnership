import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  FileText,
  Shield,
  CreditCard,
  Users,
  Settings,
  AlertCircle,
  BookOpen,
  Video,
  Download,
  Building,
  DollarSign,
  Bell,
  Zap
} from "lucide-react";

const VendorHelpSupportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });

  const categories = [
    { id: "all", name: "All Categories", count: 12 },
    { id: "getting-started", name: "Getting Started", count: 3 },
    { id: "profile", name: "Profile & Services", count: 2 },
    { id: "requests", name: "Service Requests", count: 2 },
    { id: "payments", name: "Payments & Billing", count: 2 },
    { id: "account", name: "Account Management", count: 2 },
    { id: "technical", name: "Technical Issues", count: 1 }
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I set up my vendor profile?",
      answer: "Complete your business profile by adding company information, services offered, pricing, and verification documents. A complete profile increases your visibility to customers.",
      helpful: 45,
      notHelpful: 2
    },
    {
      id: 2,
      category: "requests",
      question: "How do I respond to service requests?",
      answer: "When you receive a request, review the details and either send a quote or decline. Quick responses improve your acceptance rate and customer satisfaction.",
      helpful: 38,
      notHelpful: 1
    },
    {
      id: 3,
      category: "payments",
      question: "When do I get paid for completed services?",
      answer: "Payments are processed within 2-3 business days after service completion and customer approval. Funds are deposited directly to your connected bank account.",
      helpful: 52,
      notHelpful: 3
    },
    {
      id: 4,
      category: "profile",
      question: "How can I improve my service visibility?",
      answer: "Maintain a complete profile, respond quickly to requests, provide excellent service, and consider upgrading to a premium subscription for better placement.",
      helpful: 29,
      notHelpful: 1
    },
    {
      id: 5,
      category: "requests",
      question: "What should I include in my quotes?",
      answer: "Include detailed pricing, scope of work, estimated timeline, and any terms or conditions. Clear quotes help customers make informed decisions.",
      helpful: 33,
      notHelpful: 2
    },
    {
      id: 6,
      category: "payments",
      question: "What are the platform fees?",
      answer: "Platform fees vary by subscription plan. Basic plans have higher transaction fees, while premium plans offer reduced fees and additional benefits.",
      helpful: 41,
      notHelpful: 4
    },
    {
      id: 7,
      category: "account",
      question: "How do I update my business information?",
      answer: "Go to Profile Setup in your vendor portal. You can update company details, contact information, and service offerings at any time.",
      helpful: 25,
      notHelpful: 1
    },
    {
      id: 8,
      category: "technical",
      question: "I'm having trouble with notifications",
      answer: "Check your notification settings in Account Settings. Ensure your email and phone number are verified, and check your spam folder for missed notifications.",
      helpful: 18,
      notHelpful: 2
    }
  ];

  const quickActions = [
    {
      title: "View Service Requests",
      description: "Check new requests and manage your pipeline",
      icon: FileText,
      action: "view-requests",
      color: "bg-blue-500"
    },
    {
      title: "Contact Support",
      description: "Get help from our vendor success team",
      icon: MessageCircle,
      action: "contact-support",
      color: "bg-green-500"
    },
    {
      title: "Report Technical Issue",
      description: "Report bugs or technical problems",
      icon: AlertCircle,
      action: "report-issue",
      color: "bg-red-500"
    },
    {
      title: "Upgrade Subscription",
      description: "Explore premium features and benefits",
      icon: Zap,
      action: "upgrade",
      color: "bg-purple-500"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFaqToggle = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general"
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "view-requests":
        window.location.href = "/vendor-portal/requests";
        break;
      case "contact-support":
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "report-issue":
        setContactForm(prev => ({ ...prev, category: "technical" }));
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "upgrade":
        window.location.href = "/vendor-portal/subscription";
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Vendor Help Center
        </h1>
        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
          Find answers to common questions, get support, or contact our vendor success team.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickAction(action.action)}>
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* FAQ List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <p className="text-gray-600">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} found
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600">Try adjusting your search or category filter.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleFaqToggle(faq.id)}
                      className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-gray-700 mb-4 pt-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Was this helpful?</span>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {faq.helpful}
                              </Button>
                              <Button variant="outline" size="sm">
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                {faq.notHelpful}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="contact-form">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <p className="text-gray-600">Our vendor success team is here to help you succeed.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-gray-600">Available Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-gray-600">vendors@thinkpartnership.com</p>
                <p className="text-sm text-gray-500">Response within 4-6 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone Support</h3>
                <p className="text-gray-600">1-800-VENDOR-1</p>
                <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={contactForm.category} onValueChange={(value) => setContactForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Question</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorHelpSupportPage;
