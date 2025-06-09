import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, ShoppingCart } from "lucide-react";

const mockServiceDetails = {
  "Premium Home Painting": {
    vendor: "Brush Strokes Pro",
    description: "Transform your home with high-quality interior and exterior painting services. Experienced and reliable.",
    price: "$500+",
    image: "https://t3.ftcdn.net/jpg/00/96/57/12/360_F_96571267_qfpHjHTvH8siby0Cey6rTpfiJczIxX3e.jpg"
  },
  "Emergency Plumbing Repair": {
    vendor: "Rapid Plumbers",
    description: "24/7 emergency plumbing services for leaks, clogs, and burst pipes. Fast response guaranteed.",
    price: "$150+",
    image: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA="
  },
  "Full Home Inspection": {
    vendor: "Certified Inspectors Inc.",
    description: "Comprehensive home inspections for buyers and sellers. Detailed reports and expert advice.",
    price: "$300+",
    image: "https://www.shutterstock.com/image-photo/mid-adult-woman-architect-wearing-600nw-2060102018.jpg"
  },
  "Professional Lawn Care": {
    vendor: "Green Thumb Landscaping",
    description: "Regular lawn mowing, fertilization, and garden maintenance to keep your yard pristine.",
    price: "$80+",
    image: "https://media.istockphoto.com/id/475958716/photo/lawn-mower.jpg?s=612x612&w=0&k=20&c=TIGBHDkXS9IJbq84NHtfsFIPp_aqy6APWni2r_oS2NQ="
  },
  "HVAC System Tune-up": {
    vendor: "Climate Control Experts",
    description: "Seasonal maintenance to ensure your heating and cooling systems run efficiently.",
    price: "$120+",
    image: "https://media.istockphoto.com/id/515643040/photo/man-repairing-computer.jpg?s=612x612&w=0&k=20&c=H9NBpHyqc14Rqc1AdFwypY-UXMys0nVYL2EVe8p-mUA="
  },
  "Deep House Cleaning": {
    vendor: "Sparkling Spaces",
    description: "Thorough cleaning services for homes, including kitchens, bathrooms, and living areas.",
    price: "$200+",
    image: "https://t4.ftcdn.net/jpg/03/06/99/87/360_F_306998742_5awR6uVsZ8dRNdHHnj0tnm4sGUDBAxQ5.jpg"
  },
};

const CheckoutPage = () => {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();

  const service = serviceName ? mockServiceDetails[serviceName as keyof typeof mockServiceDetails] : undefined;

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully! Redirecting to My Orders...");
    // In a real app, this would involve sending data to a backend
    setTimeout(() => {
      navigate("/customer-portal/orders");
    }, 1500);
  };

  if (!service) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">Service Not Found</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          The service you are trying to purchase does not exist.
        </p>
        <Button asChild>
          <Link to="/customer-portal/browse">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse Services
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <Button variant="outline" className="mb-6" asChild>
        <Link to={`/customer-portal/services/${encodeURIComponent(serviceName || '')}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Service Details
        </Link>
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <ShoppingCart className="h-7 w-7" /> Checkout for "{serviceName}"
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Please review your order and provide your payment details to complete the purchase.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Details of the service you are purchasing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {service.image && (
              <img src={service.image} alt={serviceName} className="w-full h-32 object-cover rounded-md mb-2" />
            )}
            <h3 className="text-xl font-semibold">{serviceName}</h3>
            <p className="text-gray-600 dark:text-gray-400">By: {service.vendor}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{service.description}</p>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">{service.price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form Cards */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Confirm your contact and billing details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" type="text" defaultValue="Jane" />
                </div>
                <div>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" type="text" defaultValue="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="jane.doe@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="(123) 456-7890" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" type="text" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" type="text" placeholder="Anytown" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" type="text" placeholder="CA" />
                </div>
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input id="zip" type="text" placeholder="90210" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Payment Details
              </CardTitle>
              <CardDescription>Enter your credit card information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" type="text" placeholder="XXXX XXXX XXXX XXXX" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiry-month">Expiry Month</Label>
                  <Select>
                    <SelectTrigger id="expiry-month">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expiry-year">Expiry Year</Label>
                  <Select>
                    <SelectTrigger id="expiry-year">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return <SelectItem key={year} value={String(year)}>{year}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" type="text" placeholder="XXX" />
                </div>
              </div>
              <div>
                <Label htmlFor="name-on-card">Name on Card</Label>
                <Input id="name-on-card" type="text" placeholder="Jane Doe" />
              </div>
              <Button onClick={handlePlaceOrder} className="w-full" size="lg">
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;