import { GlobalNavbar } from "@/components/GlobalNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Handshake, DollarSign, ShieldCheck, Lightbulb, Quote,
  Palette, Zap, Star, ArrowRight,
  Globe, Sparkles, CheckCircle, Play, Eye, Building2, Heart, Wrench
} from "lucide-react";
import { Footer } from "@/components/Footer";

const Index = () => {
  const clientMarketplaces = [
    {
      name: "HomePro Network",
      description: "Premium home services marketplace",
      category: "Real Estate & Home Services",
      logo: "🏠",
      color: "from-blue-500 to-cyan-500",
      services: [
        {
          name: "Kitchen Renovation",
          vendor: "Elite Kitchen Designs",
          price: "From $15,000",
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center"
        },
        {
          name: "Smart Home Installation",
          vendor: "TechHome Solutions",
          price: "From $2,500",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
        },
        {
          name: "Landscape Design",
          vendor: "GreenSpace Architects",
          price: "From $5,000",
          rating: 5.0,
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center"
        },
      ],
    },
    {
      name: "WellnessHub",
      description: "Holistic health & wellness community",
      category: "Health & Wellness",
      logo: "🌿",
      color: "from-emerald-500 to-teal-500",
      services: [
        {
          name: "Personal Training",
          vendor: "FitLife Studios",
          price: "From $80/session",
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
        },
        {
          name: "Nutrition Coaching",
          vendor: "NutriWise Experts",
          price: "From $120/month",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center"
        },
        {
          name: "Massage Therapy",
          vendor: "Zen Healing Center",
          price: "From $90/session",
          rating: 5.0,
          image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&crop=center"
        },
      ],
    },
    {
      name: "BizConnect Pro",
      description: "Professional business services network",
      category: "Business & Professional",
      logo: "💼",
      color: "from-purple-500 to-indigo-500",
      services: [
        {
          name: "Legal Consulting",
          vendor: "Premier Law Group",
          price: "From $300/hour",
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop&crop=center"
        },
        {
          name: "Digital Marketing",
          vendor: "Growth Marketing Co",
          price: "From $2,000/month",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center"
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <GlobalNavbar />
      <main className="pt-16">

        {/* Hero Section - Modern & Beautiful */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-cyan-200 rounded-full opacity-50 animate-pulse"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                The Future of Marketplace Platforms
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
              Build Your Own
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Marketplace Empire
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create custom-branded marketplaces where vendors thrive, customers discover amazing services,
              and you earn from every connection. Join the global network that's revolutionizing business partnerships.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300" asChild>
                <Link to="/signup" className="flex items-center">
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300" asChild>
                <Link to="#preview" className="flex items-center">
                  <Play className="mr-2 w-5 h-5" />
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>Launch in 24 Hours</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>Full Brand Control</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Client Marketplaces Section */}
        <section id="preview" className="w-full py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Discover Services from Our Thriving Communities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore real services from our most successful client marketplaces. Each one is a unique branded experience
                powered by ThinkPartnership's platform.
              </p>
            </div>

            {clientMarketplaces.map((marketplace, index) => (
              <div key={index} className="mb-20 last:mb-0">
                {/* Marketplace Header */}
                <div className="flex items-center justify-between mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${marketplace.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {marketplace.logo}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{marketplace.name}</h3>
                      <p className="text-gray-600">{marketplace.description}</p>
                      <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {marketplace.category}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Visit Marketplace</span>
                  </Button>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplace.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="group overflow-hidden bg-white border-0 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="relative overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{service.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h4>
                        <p className="text-gray-600 mb-3">by {service.vendor}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">{service.price}</span>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Marketplace Preview Section */}
        <section className="w-full py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                    <Building2 className="w-4 h-4 mr-2" />
                    Your Branded Experience
                  </span>
                </div>
                <h2 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  See What Your
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}Marketplace{" "}
                  </span>
                  Could Look Like
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Every marketplace is fully customizable with your branding, colors, and domain.
                  Create a seamless experience that feels authentically yours while leveraging our powerful platform.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Custom domain & SSL certificate included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Full brand customization (colors, logos, fonts)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Mobile-responsive design out of the box</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced vendor & customer management</span>
                  </div>
                </div>

                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300" asChild>
                  <Link to="/signup" className="flex items-center">
                    Create Your Marketplace
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>

              {/* Right Content - Marketplace Preview */}
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Browser Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1 text-sm text-gray-500 ml-4">
                      yourbrand.thinkpartnership.com
                    </div>
                  </div>

                  {/* Marketplace Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                          YB
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Your Brand Marketplace</h3>
                          <p className="text-sm text-gray-500">Trusted Services Network</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Sign In</Button>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-lg font-semibold mb-3">Featured Services</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="w-full h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded mb-2"></div>
                          <p className="text-sm font-medium">Premium Service</p>
                          <p className="text-xs text-gray-500">by Top Vendor</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="w-full h-20 bg-gradient-to-br from-green-100 to-green-200 rounded mb-2"></div>
                          <p className="text-sm font-medium">Expert Solution</p>
                          <p className="text-xs text-gray-500">by Pro Partner</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$127K</div>
                    <div className="text-xs text-gray-500">Monthly Revenue</div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2.4K</div>
                    <div className="text-xs text-gray-500">Active Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 text-gray-900">
                How ThinkPartnership Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A simple, powerful platform that connects everyone in the marketplace ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Platform Owner */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Platform Owner</h3>
                <p className="text-gray-600 leading-relaxed">
                  You oversee the entire ecosystem, onboard clients, and earn from every transaction across all marketplaces.
                </p>
              </div>

              {/* Client/Licensee */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Client (Licensee)</h3>
                <p className="text-gray-600 leading-relaxed">
                  Launch your branded marketplace, manage vendors, and generate new revenue streams from your network.
                </p>
              </div>

              {/* Vendors */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <Handshake className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Vendors (Partners)</h3>
                <p className="text-gray-600 leading-relaxed">
                  List services, refer customers, and earn commissions within a trusted, branded network.
                </p>
              </div>

              {/* Customers */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">4</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Customers</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover and purchase vetted services from trusted providers in a seamless, branded experience.
                </p>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="hidden lg:block relative mt-12">
              <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-300 via-blue-300 via-green-300 to-pink-300 transform -translate-y-1/2"></div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 text-gray-900">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features designed to help you build, manage, and scale your marketplace effortlessly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Lightning Fast Setup</h3>
                <p className="text-gray-600 leading-relaxed">
                  Launch your branded marketplace in 24 hours with our turnkey solution. No technical expertise required.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Revenue Optimization</h3>
                <p className="text-gray-600 leading-relaxed">
                  Maximize earnings with intelligent commission structures and automated revenue sharing across your network.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Complete Brand Control</h3>
                <p className="text-gray-600 leading-relaxed">
                  Customize every aspect of your marketplace to perfectly match your brand identity and vision.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Enterprise Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bank-level security with SSL certificates, secure payments, and compliance-ready infrastructure.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Advanced Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Powerful admin tools for vendor onboarding, customer management, and performance analytics.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Smart Automation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automated referral tracking, commission calculations, and payout management save you time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 text-gray-900">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how businesses are transforming their networks into thriving marketplaces
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "ThinkPartnership transformed our real estate business. We launched HomePro Network and now earn $15K+ monthly from vendor partnerships. Game-changer!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    AC
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Alex Chen</p>
                    <p className="text-gray-500 text-sm">CEO, City Realty Group</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "As a wellness coach, joining WellnessHub was seamless. I've gained 200+ new clients and earn referral commissions. The platform just works!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    MR
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Maria Rodriguez</p>
                    <p className="text-gray-500 text-sm">Wellness Coach & Entrepreneur</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "The setup was incredibly fast. Within 48 hours, we had our branded marketplace live with 50+ vendors. Revenue started flowing immediately."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    JS
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">James Smith</p>
                    <p className="text-gray-500 text-sm">Founder, BizConnect Pro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action Section */}
        <section className="w-full py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:32px_32px]"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
            <div className="mb-8">
              <span className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Join 500+ Successful Marketplaces
              </span>
            </div>

            <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Ready to Build Your
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Marketplace Empire?
              </span>
            </h2>

            <p className="text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your business network into a powerful revenue engine.
              Start building your custom marketplace today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300" asChild>
                <Link to="/signup" className="flex items-center">
                  Start Building Free
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-5 text-xl font-semibold rounded-2xl transition-all duration-300" asChild>
                <Link to="#preview">
                  Schedule Demo
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-indigo-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;