import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ServicesAPI, { ServiceDetails } from "@/services/ServicesAPI";
import ServiceRequestsAPI from "@/services/ServiceRequestsAPI";
import {
  FileText,
  CheckCircle,
  ArrowLeft,
  Send,
  Loader2
} from "lucide-react";

const RequestServicePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // API state
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service_address: "",
    service_city: "",
    service_postal_code: "",
    preferred_date: "",
    preferred_time: "",
    urgency: 3, // Default to normal
    description: "",
    selected_tier: "",
    estimated_price: 0
  });

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!id) {
        setError('Service ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await ServicesAPI.getServiceDetails(parseInt(id));
        if (response.error) {
          throw new Error('Service not found');
        }

        setService(response.service);
      } catch (err: any) {
        setError(err.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!service) return;

    try {
      setSubmitting(true);
      setError('');

      const requestData = {
        service_id: service.id,
        ...formData
      };

      const response = await ServiceRequestsAPI.createServiceRequest(requestData);

      if (response.error) {
        throw new Error(response.message || 'Failed to submit service request');
      }

      // Navigate to success page or service requests page
      navigate('/marketplace/service-requests', {
        state: { message: 'Service request submitted successfully!' }
      });

    } catch (err: any) {
      setError(err.message || 'Failed to submit service request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Loading state
  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
          <section className="bg-white border-b border-gray-200 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <Skeleton className="h-10 w-32 mb-4" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index}>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  // Error state
  if (error && !service) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
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

              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          </section>
        </div>
      </MarketplaceLayout>
    );
  }

  // No service found
  if (!service) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
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

              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
                <p className="text-gray-600 mb-6">The service you're trying to request doesn't exist or has been removed.</p>
                <Button onClick={() => navigate('/marketplace')}>
                  Browse Services
                </Button>
              </div>
            </div>
          </section>
        </div>
      </MarketplaceLayout>
    );
  }

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
                  Requesting: {service.title}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {error && (
            <Alert className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
                          <Label htmlFor="customer_name">Full Name *</Label>
                          <Input
                            id="customer_name"
                            value={formData.customer_name}
                            onChange={(e) => handleInputChange('customer_name', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customer_email">Email Address *</Label>
                          <Input
                            id="customer_email"
                            type="email"
                            value={formData.customer_email}
                            onChange={(e) => handleInputChange('customer_email', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="customer_phone">Phone Number *</Label>
                        <Input
                          id="customer_phone"
                          type="tel"
                          value={formData.customer_phone}
                          onChange={(e) => handleInputChange('customer_phone', e.target.value)}
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
                        <Label htmlFor="service_address">Street Address *</Label>
                        <Input
                          id="service_address"
                          value={formData.service_address}
                          onChange={(e) => handleInputChange('service_address', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="service_city">City *</Label>
                          <Input
                            id="service_city"
                            value={formData.service_city}
                            onChange={(e) => handleInputChange('service_city', e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="service_postal_code">Postal Code *</Label>
                          <Input
                            id="service_postal_code"
                            value={formData.service_postal_code}
                            onChange={(e) => handleInputChange('service_postal_code', e.target.value)}
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
                          <Label htmlFor="preferred_date">Preferred Date</Label>
                          <Input
                            id="preferred_date"
                            type="date"
                            value={formData.preferred_date}
                            onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                            className="mt-1"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferred_time">Preferred Time</Label>
                          <Select value={formData.preferred_time} onValueChange={(value) => handleInputChange('preferred_time', value)}>
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
                        <Select value={formData.urgency.toString()} onValueChange={(value) => handleInputChange('urgency', parseInt(value))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="How urgent is this?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Emergency (ASAP)</SelectItem>
                            <SelectItem value="2">Urgent (Within 24 hours)</SelectItem>
                            <SelectItem value="3">Normal (Within a week)</SelectItem>
                            <SelectItem value="4">Flexible timing</SelectItem>
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

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Service Request
                        </>
                      )}
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
                  {service && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Service</div>
                      <div className="font-semibold">{service.title}</div>
                      <div className="text-sm text-gray-500">by {service.vendor.name}</div>
                      <div className="text-lg font-bold text-green-600 mt-2">
                        Starting from ${service.base_price}
                      </div>
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
