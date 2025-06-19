import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  ArrowLeft,
  Send
} from "lucide-react";

const RequestServicePage = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    preferredDate: "",
    preferredTime: "",
    urgency: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Service request submitted:", { serviceName, ...formData });
    // In a real app, this would submit to backend
    navigate('/marketplace/request-submitted');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Request Service</h1>
                <p className="text-gray-600">
                  {serviceName ? `Requesting: ${decodeURIComponent(serviceName)}` : 'Submit your service request'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Service Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Contact Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Service Location
                      </h3>
                      
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Scheduling */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Scheduling Preferences
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="preferredDate">Preferred Date</Label>
                          <Input
                            id="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                            className="mt-1"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredTime">Preferred Time</Label>
                          <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                              <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="How urgent is this?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emergency">Emergency (ASAP)</SelectItem>
                            <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                            <SelectItem value="soon">Soon (Within a week)</SelectItem>
                            <SelectItem value="flexible">Flexible timing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Service Details
                      </h3>
                      
                      <div>
                        <Label htmlFor="description">Describe your needs *</Label>
                        <Textarea
                          id="description"
                          rows={4}
                          placeholder="Please provide details about what you need done, any specific requirements, materials needed, etc."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg">
                      <Send className="w-5 h-5 mr-2" />
                      Submit Service Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Request Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceName && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Service</div>
                      <div className="font-semibold">{decodeURIComponent(serviceName)}</div>
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Free consultation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>No commitment required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Verified professionals</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Satisfaction guaranteed</span>
                    </div>
                  </div>

                  {/* <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">What happens next?</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-green-600">1</span>
                        </div>
                        <span className="text-gray-700">We'll match you with qualified professionals</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-green-600">2</span>
                        </div>
                        <span className="text-gray-700">You'll receive quotes and can chat with providers</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-green-600">3</span>
                        </div>
                        <span className="text-gray-700">Choose your preferred professional and schedule</span>
                      </div>
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default RequestServicePage;
