import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  CreditCard,
  Loader2,
  AlertTriangle,
  Package,
  CheckCircle,
  X
} from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    summary,
    itemCount,
    loading,
    error,
    refreshCart,
    updateQuantity,
    removeItem,
    clearCart,
    validateCart
  } = useCart();

  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [validationIssues, setValidationIssues] = useState<any[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/marketplace/login');
    }
  }, [isAuthenticated, navigate]);

  // Validate cart on load
  useEffect(() => {
    if (items.length > 0) {
      handleValidateCart();
    }
  }, [items]);

  const handleValidateCart = async () => {
    const isValid = await validateCart();
    if (!isValid) {
      // Issues are already shown via toast from the context
      // You could also set validation issues state here if needed
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItems(prev => new Set(prev.add(itemId)));
    const success = await removeItem(itemId);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/marketplace/cart/checkout');
  };

  // Loading state
  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Cart</h2>
            <p className="text-gray-600">Please wait while we load your cart items...</p>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  // Empty cart state
  if (!loading && items.length === 0) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <section className="bg-white border-b border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <Button
                variant="outline"
                className="mb-6 flex items-center gap-2"
                onClick={() => navigate('/marketplace/services')}
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                  <p className="text-gray-600">Review your selected services</p>
                </div>
              </div>
            </div>
          </section>

          {/* Empty State */}
          <section className="py-16">
            <div className="max-w-md mx-auto text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Start browsing our services to find what you need.
              </p>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/marketplace/services')}
              >
                Browse Services
              </Button>
            </div>
          </section>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <Button
              variant="outline"
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate('/marketplace/services')}
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                  <p className="text-gray-600">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} from {summary?.vendors.length || 0} {summary?.vendors.length === 1 ? 'vendor' : 'vendors'}
                  </p>
                </div>
              </div>

              {items.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {summary?.vendors.map((vendor, vendorIndex) => (
                  <Card key={vendor.vendor_id} className="shadow-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={vendor.items[0]?.service.vendor?.image} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {vendor.vendor_name?.charAt(0) || 'V'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{vendor.vendor_name}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {vendor.items.length} {vendor.items.length === 1 ? 'service' : 'services'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {vendor.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img
                            src={item.service.image || item.service.images?.[0]}
                            alt={item.service.title}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500';
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.service.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.service.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {item.service.category_tags?.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              min="1"
                              className="w-16 text-center h-8"
                              readOnly
                            />
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ${(parseFloat(item.service.base_price.toString()) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updatingItems.has(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {updatingItems.has(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}

                      <Separator />

                      {/* Vendor Subtotal */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subtotal from {vendor.vendor_name}</span>
                        <span className="font-medium">${(vendor.subtotal || 0).toFixed(2)}</span>
                      </div>
                      {vendor.tax_calculation && vendor.tax_calculation.tax_amount != null && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">${(vendor.tax_calculation.tax_amount || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total from {vendor.vendor_name}</span>
                        <span className="text-green-600">${(vendor.total || 0).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="shadow-sm sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-green-600" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                        <span>${(summary?.grand_subtotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>${(summary?.grand_tax_amount || 0).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-green-600">${(summary?.grand_total || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>

                    <div className="text-xs text-gray-500 text-center">
                      Secure checkout • SSL encrypted
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Secure payment processing</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Professional service providers</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>24/7 customer support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default CartPage;