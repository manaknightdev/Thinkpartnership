import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Download
} from "lucide-react";

const HelpSupportPage = () => {
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

  const helpCategories = [
    { id: "all", name: "All Topics", icon: HelpCircle, count: 45 },
    { id: "getting-started", name: "Getting Started", icon: BookOpen, count: 8 },
    { id: "booking", name: "Booking Services", icon: Users, count: 12 },
    { id: "payments", name: "Payments & Billing", icon: CreditCard, count: 10 },
    { id: "account", name: "Account Settings", icon: Settings, count: 7 },
    { id: "safety", name: "Safety & Security", icon: Shield, count: 8 }
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I create an account?",
      answer: "Creating an account is simple! Click the 'Sign Up' button, enter your email and create a password. You'll receive a verification email to confirm your account.",
      helpful: 24,
      notHelpful: 2
    },
    {
      id: 2,
      category: "booking",
      question: "How do I book a service?",
      answer: "Browse our services, select the one you need, choose your preferred date and time, and complete the booking process. You'll receive confirmation via email and SMS.",
      helpful: 31,
      notHelpful: 1
    },
    {
      id: 3,
      category: "payments",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through Stripe.",
      helpful: 28,
      notHelpful: 3
    },
    {
      id: 4,
      category: "booking",
      question: "Can I cancel or reschedule my booking?",
      answer: "Yes! You can cancel or reschedule up to 24 hours before your appointment. Go to 'My Orders' in your account to make changes. Cancellation fees may apply depending on the service provider's policy.",
      helpful: 19,
      notHelpful: 4
    },
    {
      id: 5,
      category: "safety",
      question: "How do you verify service providers?",
      answer: "All service providers undergo background checks, license verification, and insurance validation. We also monitor customer reviews and ratings to maintain quality standards.",
      helpful: 35,
      notHelpful: 1
    },
    {
      id: 6,
      category: "payments",
      question: "When will I be charged?",
      answer: "Payment is processed when you confirm your booking. For some services, a deposit may be required upfront with the balance due upon completion.",
      helpful: 22,
      notHelpful: 2
    },
    {
      id: 7,
      category: "account",
      question: "How do I update my profile information?",
      answer: "Go to Account Settings in your profile menu. You can update your personal information, contact details, and preferences at any time.",
      helpful: 15,
      notHelpful: 1
    },
    {
      id: 8,
      category: "safety",
      question: "What if I'm not satisfied with a service?",
      answer: "We offer a satisfaction guarantee. Contact our support team within 48 hours of service completion, and we'll work with you and the provider to resolve any issues.",
      helpful: 27,
      notHelpful: 3
    }
  ];

  const quickActions = [
    {
      title: "Track Your Order",
      description: "Check the status of your current bookings",
      icon: Clock,
      action: "track-order",
      color: "bg-blue-500"
    },
    {
      title: "Contact Support",
      description: "Get help from our customer service team",
      icon: MessageCircle,
      action: "contact-support",
      color: "bg-green-500"
    },
    {
      title: "Report an Issue",
      description: "Report problems with services or providers",
      icon: AlertCircle,
      action: "report-issue",
      color: "bg-red-500"
    },
    {
      title: "Download App",
      description: "Get our mobile app for iOS and Android",
      icon: Download,
      action: "download-app",
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
    // In a real app, this would submit to backend
    console.log("Contact form submitted:", contactForm);
    // Reset form
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
      case "track-order":
        // Navigate to orders page
        break;
      case "contact-support":
        // Scroll to contact form
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "report-issue":
        setContactForm(prev => ({ ...prev, category: "issue" }));
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "download-app":
        // Open app download links
        break;
    }
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers to common questions, get support, or contact our team directly.
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
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500 bg-white"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Quick answers to common questions about our platform
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {helpCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 ${
                    selectedCategory === category.id ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="max-w-4xl mx-auto">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <Card key={faq.id} className="border border-gray-200">
                      <CardContent className="p-0">
                        <button
                          onClick={() => handleFaqToggle(faq.id)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                          {expandedFaq === faq.id ? (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {expandedFaq === faq.id && (
                          <div className="px-6 pb-6 border-t border-gray-100">
                            <p className="text-gray-600 mb-4 pt-4">{faq.answer}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">Was this helpful?</span>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    {faq.helpful}
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <ThumbsDown className="w-4 h-4" />
                                    {faq.notHelpful}
                                  </Button>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {helpCategories.find(c => c.id === faq.category)?.name}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section id="contact-form" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Still need help?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Our support team is here to help you with any questions or issues you may have.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Live Chat</h3>
                      <p className="text-gray-600">Available 24/7 for immediate assistance</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Support</h3>
                      <p className="text-gray-600">support@thinkpartnership.com</p>
                      <p className="text-sm text-gray-500">Response within 2-4 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone Support</h3>
                      <p className="text-gray-600">1-800-THINK-HELP</p>
                      <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
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

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default HelpSupportPage;
