
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, MapPin, User, Phone, Mail, Plus, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { indianStatesAndCities } from '@/data/indianStatesAndCities';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  country: string;
}

interface SavedAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const Checkout = () => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'India'
  });

  const shippingCost = 0;
  const totalAmount = getTotalPrice() + shippingCost;

  // Validate form whenever shipping address changes
  useEffect(() => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'postalCode', 'phone'];
    const isValid = required.every(field => shippingAddress[field as keyof ShippingAddress]);
    setIsFormValid(isValid);
  }, [shippingAddress]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (items.length === 0) {
      navigate('/shop');
      return;
    }
    fetchSavedAddresses();
  }, [user, items, navigate]);

  const fetchSavedAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (error) throw error;

      setSavedAddresses(data || []);

      // Auto-select default address if exists
      const defaultAddress = data?.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        loadAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const loadAddress = (address: SavedAddress) => {
    const [firstName, ...lastNameParts] = address.full_name.split(' ');
    setShippingAddress({
      firstName: firstName || '',
      lastName: lastNameParts.join(' ') || '',
      address: address.address_line1,
      addressLine2: address.address_line2 || '',
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      postalCode: address.pincode,
      phone: address.phone,
      country: 'India'
    });

    if (address.state && indianStatesAndCities[address.state]) {
      setAvailableCities(indianStatesAndCities[address.state]);
    }
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setShippingAddress({
        firstName: '',
        lastName: '',
        address: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        country: 'India'
      });
      setAvailableCities([]);
    } else {
      const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
      if (selectedAddress) {
        loadAddress(selectedAddress);
      }
    }
  };

  const handleStateChange = (value: string) => {
    setShippingAddress(prev => ({ ...prev, state: value, city: '' }));
    setAvailableCities(indianStatesAndCities[value] || []);
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'postalCode', 'phone'];
    for (const field of required) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        setIsFormValid(false);
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field} field`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const getProductImage = (productId: number) => {
    const imageMap: { [key: number]: string } = {
      1: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop",
      2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
      3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    };
    return imageMap[productId] || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";
  };

  // ── Secure Razorpay Payment Flow ──────────────────────────────

  const handleRazorpayPayment = async () => {
    if (!validateForm() || !user) return;
    setLoading(true);

    try {
      // Step 1: Create Razorpay order server-side (amount validated from DB)
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            shipping_address: shippingAddress,
            shipping_cost: shippingCost,
          },
        }
      );

      if (orderError || !orderData?.razorpay_order_id) {
        throw new Error(orderData?.error || orderError?.message || 'Failed to create payment order');
      }

      // Step 2: Open Razorpay checkout with server-returned order_id
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NASTEA',
        description: 'Order Payment',
        order_id: orderData.razorpay_order_id,
        handler: function (response: any) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: user.email,
          contact: shippingAddress.phone,
        },
        theme: { color: '#000000' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment. Your cart is intact.',
            });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setLoading(false);
        console.error('Payment failed:', resp.error);
        toast({
          title: 'Payment Failed',
          description: resp.error?.description || 'Payment could not be completed. Please try again.',
          variant: 'destructive',
        });
      });
      rzp.open();
    } catch (error: any) {
      setLoading(false);
      console.error('Payment initiation error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Step 3: Verify payment server-side, create order atomically
  const handlePaymentSuccess = async (response: any) => {
    try {
      const hasSubscription = items.some(item => item.is_subscription);
      const subscriptionItem = items.find(item => item.is_subscription);

      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'verify-razorpay-payment',
        {
          body: {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shipping_address: shippingAddress,
            shipping_cost: shippingCost,
            is_subscription: hasSubscription,
            subscription_frequency: subscriptionItem?.subscription_frequency || null,
          },
        }
      );

      if (verifyError || !verifyData?.success) {
        throw new Error(verifyData?.error || verifyError?.message || 'Payment verification failed');
      }

      // Save new address if applicable
      if (selectedAddressId === 'new') {
        await saveNewAddress();
      }

      // Clear cart
      await clearCart();

      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${verifyData.order_number} has been placed. Check your email for confirmation.`,
      });

      navigate(`/orders/${verifyData.order_id}`);
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Verification Error',
        description: error.message || 'Payment was received but verification failed. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNewAddress = async () => {
    if (!user) return;
    try {
      const { data: existingAddresses } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', user.id)
        .eq('address_line1', shippingAddress.address)
        .eq('city', shippingAddress.city)
        .eq('pincode', shippingAddress.postalCode);

      if (existingAddresses && existingAddresses.length > 0) return;

      const { data: userAddresses } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', user.id);

      const isFirstAddress = !userAddresses || userAddresses.length === 0;

      await supabase.from('addresses').insert({
        user_id: user.id,
        full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        phone: shippingAddress.phone,
        address_line1: shippingAddress.address,
        address_line2: shippingAddress.addressLine2 || null,
        landmark: shippingAddress.landmark || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.postalCode,
        is_default: isFirstAddress,
      });
    } catch (err) {
      console.warn('Failed to save address (non-critical):', err);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <>
      <HeaderNavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Saved Addresses Selection */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3 pb-4 border-b">
                      <Label>Select Address</Label>
                      <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelection}>
                        {savedAddresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <div className="font-semibold">{address.full_name}</div>
                              <div className="text-sm text-gray-600">
                                {address.address_line1}
                                {address.address_line2 && `, ${address.address_line2}`}
                              </div>
                              {address.landmark && (
                                <div className="text-sm text-gray-600">Landmark: {address.landmark}</div>
                              )}
                              <div className="text-sm text-gray-600">
                                {address.city}, {address.state} - {address.pincode}
                              </div>
                              <div className="text-sm text-gray-600">{address.phone}</div>
                              {address.is_default && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1 inline-block">
                                  Default
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                          <RadioGroupItem value="new" id="new" />
                          <Label htmlFor="new" className="flex items-center gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add New Address
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Address Form */}
                  {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
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
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address Line 1 *</Label>
                      <Input
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        value={shippingAddress.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        className="mt-1"
                        placeholder="e.g., Near Metro Station"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={shippingAddress.state}
                          onValueChange={handleStateChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                            <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                            <SelectItem value="Assam">Assam</SelectItem>
                            <SelectItem value="Bihar">Bihar</SelectItem>
                            <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                            <SelectItem value="Goa">Goa</SelectItem>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="Haryana">Haryana</SelectItem>
                            <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                            <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                            <SelectItem value="Kerala">Kerala</SelectItem>
                            <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Manipur">Manipur</SelectItem>
                            <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                            <SelectItem value="Mizoram">Mizoram</SelectItem>
                            <SelectItem value="Nagaland">Nagaland</SelectItem>
                            <SelectItem value="Odisha">Odisha</SelectItem>
                            <SelectItem value="Punjab">Punjab</SelectItem>
                            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                            <SelectItem value="Sikkim">Sikkim</SelectItem>
                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="Telangana">Telangana</SelectItem>
                            <SelectItem value="Tripura">Tripura</SelectItem>
                            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                            <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                            <SelectItem value="West Bengal">West Bengal</SelectItem>
                            <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
                            <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                            <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                            <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                            <SelectItem value="Ladakh">Ladakh</SelectItem>
                            <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                            <SelectItem value="Puducherry">Puducherry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Select
                          value={shippingAddress.city}
                          onValueChange={(value) => handleInputChange('city', value)}
                          disabled={!shippingAddress.state}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={shippingAddress.state ? "Select City" : "Select State First"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Pincode *</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Credit/Debit Card</span>
                  <span className="ml-auto text-sm text-gray-500">Secure payment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.product_id}-checkout`} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.product_image || getProductImage(item.product_id)}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{item.product_name}</h4>
                          {item.is_subscription && (
                            <Badge className="bg-purple-100 text-purple-800 rounded-full text-xs px-1.5 py-0 flex items-center gap-0.5">
                              <RefreshCw className="h-2.5 w-2.5" />
                              <span className="text-[10px]">Sub</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                          {item.is_subscription && <span className="text-green-600 ml-1">(20% off)</span>}
                        </p>
                        {item.is_subscription && item.subscription_frequency && (
                          <p className="text-xs text-purple-600 capitalize">{item.subscription_frequency}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.product_price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shippingCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleRazorpayPayment}
                  disabled={loading || !isFormValid}
                  className={`w-full bg-black text-white hover:bg-gray-800 py-3 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : `Pay with Razorpay - ₹${totalAmount.toFixed(2)}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
