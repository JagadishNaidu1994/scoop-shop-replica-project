
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
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Plus, RefreshCw, Tag, Check, X, ShieldCheck, Truck, ChevronRight, Percent } from 'lucide-react';
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

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  description?: string;
  assigned_users?: string;
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

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showCoupons, setShowCoupons] = useState(false);

  const shippingCost = 0;
  const subtotal = getTotalPrice();
  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.min(subtotal * (appliedCoupon.discount_value / 100), subtotal)
      : Math.min(appliedCoupon.discount_value, subtotal)
    : 0;
  const totalAmount = subtotal - discount + shippingCost;

  useEffect(() => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'postalCode', 'phone'];
    const isValid = required.every((field) => shippingAddress[field as keyof ShippingAddress]);
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
    fetchAvailableCoupons();
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
      const defaultAddress = data?.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        loadAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchAvailableCoupons = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      if (error) throw error;

      const filtered = (data || []).filter((coupon) => {
        if (!coupon.assigned_users) return true;
        if (user.email) {
          return coupon.assigned_users
            .split(',')
            .map((e: string) => e.trim().toLowerCase())
            .includes(user.email.toLowerCase());
        }
        return false;
      });
      setAvailableCoupons(filtered);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const applyCoupon = async (code: string) => {
    if (!code.trim()) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupon_codes')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({ title: 'Invalid Coupon', description: 'This coupon code is not valid.', variant: 'destructive' });
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast({ title: 'Expired', description: 'This coupon has expired.', variant: 'destructive' });
        return;
      }

      if (data.max_uses && data.used_count >= data.max_uses) {
        toast({ title: 'Limit Reached', description: 'This coupon has reached its usage limit.', variant: 'destructive' });
        return;
      }

      if (subtotal < data.minimum_order_amount) {
        toast({
          title: 'Minimum Not Met',
          description: `Minimum order of ₹${data.minimum_order_amount} required.`,
          variant: 'destructive'
        });
        return;
      }

      if (data.assigned_users && user?.email) {
        const allowed = data.assigned_users.split(',').map((e: string) => e.trim().toLowerCase());
        if (!allowed.includes(user.email.toLowerCase())) {
          toast({ title: 'Not Eligible', description: 'This coupon is not available for your account.', variant: 'destructive' });
          return;
        }
      }

      setAppliedCoupon(data);
      setCouponCode(data.code);
      setShowCoupons(false);
      toast({ title: 'Coupon Applied!', description: `You saved ${data.discount_type === 'percentage' ? `${data.discount_value}%` : `₹${data.discount_value}`}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to apply coupon.', variant: 'destructive' });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast({ title: 'Coupon Removed' });
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
      setShippingAddress({ firstName: '', lastName: '', address: '', addressLine2: '', landmark: '', city: '', state: '', postalCode: '', phone: '', country: 'India' });
      setAvailableCities([]);
    } else {
      const selectedAddress = savedAddresses.find((addr) => addr.id === addressId);
      if (selectedAddress) loadAddress(selectedAddress);
    }
  };

  const handleStateChange = (value: string) => {
    setShippingAddress((prev) => ({ ...prev, state: value, city: '' }));
    setAvailableCities(indianStatesAndCities[value] || []);
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'postalCode', 'phone'];
    for (const field of required) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        toast({ title: "Missing Information", description: `Please fill in the ${field} field`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm() || !user) return;
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { shipping_address: shippingAddress, shipping_cost: shippingCost }
      });
      if (orderError || !orderData?.razorpay_order_id) throw new Error(orderData?.error || orderError?.message || 'Failed to create payment order');

      const options = {
        key: orderData.key_id, amount: orderData.amount, currency: orderData.currency,
        name: 'NASTEA', description: 'Order Payment', order_id: orderData.razorpay_order_id,
        handler: (response: any) => handlePaymentSuccess(response),
        prefill: { name: `${shippingAddress.firstName} ${shippingAddress.lastName}`, email: user.email, contact: shippingAddress.phone },
        theme: { color: '#000000' },
        modal: { ondismiss: () => { setLoading(false); toast({ title: 'Payment Cancelled', description: 'Your cart is intact.' }); } }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setLoading(false);
        toast({ title: 'Payment Failed', description: resp.error?.description || 'Please try again.', variant: 'destructive' });
      });
      rzp.open();
    } catch (error: any) {
      setLoading(false);
      toast({ title: 'Payment Error', description: error.message || 'Failed to initiate payment.', variant: 'destructive' });
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      const hasSubscription = items.some((item) => item.is_subscription);
      const subscriptionItem = items.find((item) => item.is_subscription);
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature, shipping_address: shippingAddress,
          shipping_cost: shippingCost, is_subscription: hasSubscription,
          subscription_frequency: subscriptionItem?.subscription_frequency || null
        }
      });
      if (verifyError || !verifyData?.success) throw new Error(verifyData?.error || verifyError?.message || 'Payment verification failed');
      if (selectedAddressId === 'new') await saveNewAddress();
      await clearCart();
      toast({ title: 'Order Placed Successfully!', description: `Order #${verifyData.order_number} placed. Check email for confirmation.` });
      navigate(`/orders/${verifyData.order_id}`);
    } catch (error: any) {
      toast({ title: 'Verification Error', description: error.message || 'Payment received but verification failed. Contact support.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveNewAddress = async () => {
    if (!user) return;
    try {
      const { data: existingAddresses } = await supabase.from('addresses').select('id')
        .eq('user_id', user.id).eq('address_line1', shippingAddress.address)
        .eq('city', shippingAddress.city).eq('pincode', shippingAddress.postalCode);
      if (existingAddresses && existingAddresses.length > 0) return;
      const { data: userAddresses } = await supabase.from('addresses').select('id').eq('user_id', user.id);
      const isFirstAddress = !userAddresses || userAddresses.length === 0;
      await supabase.from('addresses').insert({
        user_id: user.id, full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        phone: shippingAddress.phone, address_line1: shippingAddress.address,
        address_line2: shippingAddress.addressLine2 || null, landmark: shippingAddress.landmark || null,
        city: shippingAddress.city, state: shippingAddress.state, pincode: shippingAddress.postalCode,
        is_default: isFirstAddress
      });
    } catch (err) {
      console.warn('Failed to save address (non-critical):', err);
    }
  };

  if (!user || items.length === 0) return null;

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
    "Lakshadweep", "Puducherry"
  ];

  return (
    <>
      <HeaderNavBar />

      <div className="min-h-screen bg-muted/30">
        {/* Progress Steps */}
        <div className="bg-background border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">✓</span>
                Cart
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                Checkout
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</span>
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Address + Coupon */}
            <div className="lg:col-span-3 space-y-6">

              {/* ── Delivery Address ─────────────────────── */}
              <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Delivery Address</h2>
                    <p className="text-sm text-muted-foreground">Where should we deliver your order?</p>
                  </div>
                </div>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3 mb-5">
                    <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelection} className="space-y-2">
                      {savedAddresses.map((address) => (
                        <label
                          key={address.id}
                          htmlFor={address.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          <RadioGroupItem value={address.id} id={address.id} className="mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{address.full_name}</span>
                              {address.is_default && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {address.address_line1}
                              {address.address_line2 && `, ${address.address_line2}`}
                              {address.landmark && ` (${address.landmark})`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} – {address.pincode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.phone}</p>
                          </div>
                        </label>
                      ))}
                      <label
                        htmlFor="new"
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === 'new'
                            ? 'border-primary bg-primary/5'
                            : 'border-dashed border-border hover:border-primary/40'
                        }`}
                      >
                        <RadioGroupItem value="new" id="new" />
                        <Plus className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">Add a new address</span>
                      </label>
                    </RadioGroup>
                  </div>
                )}

                {/* New Address Form */}
                {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name *</Label>
                        <Input value={shippingAddress.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="mt-1.5 rounded-lg" placeholder="John" />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name *</Label>
                        <Input value={shippingAddress.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="mt-1.5 rounded-lg" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone *</Label>
                      <Input type="tel" value={shippingAddress.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="mt-1.5 rounded-lg" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address Line 1 *</Label>
                      <Input value={shippingAddress.address} onChange={(e) => handleInputChange('address', e.target.value)} className="mt-1.5 rounded-lg" placeholder="House / Flat no., Building" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address Line 2</Label>
                      <Input value={shippingAddress.addressLine2} onChange={(e) => handleInputChange('addressLine2', e.target.value)} className="mt-1.5 rounded-lg" placeholder="Street, Area" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Landmark</Label>
                      <Input value={shippingAddress.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} className="mt-1.5 rounded-lg" placeholder="Near Metro Station" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">State *</Label>
                        <Select value={shippingAddress.state} onValueChange={handleStateChange}>
                          <SelectTrigger className="mt-1.5 rounded-lg"><SelectValue placeholder="Select State" /></SelectTrigger>
                          <SelectContent>
                            {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">City *</Label>
                        <Select value={shippingAddress.city} onValueChange={(v) => handleInputChange('city', v)} disabled={!shippingAddress.state}>
                          <SelectTrigger className="mt-1.5 rounded-lg"><SelectValue placeholder={shippingAddress.state ? "Select City" : "Select State First"} /></SelectTrigger>
                          <SelectContent>
                            {availableCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pincode *</Label>
                      <Input value={shippingAddress.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className="mt-1.5 rounded-lg" placeholder="500001" />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Coupons Section ─────────────────────── */}
              <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Apply Coupon</h2>
                    <p className="text-sm text-muted-foreground">Have a promo code? Apply it below.</p>
                  </div>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-green-800">{appliedCoupon.code}</code>
                          <Badge className="bg-green-100 text-green-700 text-[10px] border-0">
                            {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% OFF` : `₹${appliedCoupon.discount_value} OFF`}
                          </Badge>
                        </div>
                        <p className="text-sm text-green-600 mt-0.5">You're saving ₹{discount.toFixed(0)} on this order!</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="rounded-lg font-mono uppercase tracking-wider"
                        onKeyDown={(e) => e.key === 'Enter' && applyCoupon(couponCode)}
                      />
                      <Button
                        onClick={() => applyCoupon(couponCode)}
                        disabled={couponLoading || !couponCode.trim()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 whitespace-nowrap"
                      >
                        {couponLoading ? 'Checking...' : 'Apply'}
                      </Button>
                    </div>

                    {availableCoupons.length > 0 && (
                      <div>
                        <button
                          onClick={() => setShowCoupons(!showCoupons)}
                          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          <Percent className="h-3.5 w-3.5" />
                          {showCoupons ? 'Hide' : 'View'} available coupons ({availableCoupons.length})
                        </button>

                        {showCoupons && (
                          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                            {availableCoupons.map((coupon) => (
                              <div
                                key={coupon.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer"
                                onClick={() => { setCouponCode(coupon.code); applyCoupon(coupon.code); }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Tag className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <code className="font-mono font-bold text-sm text-foreground">{coupon.code}</code>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `₹${coupon.discount_value} off`}
                                      {coupon.minimum_order_amount > 0 && ` • Min ₹${coupon.minimum_order_amount}`}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-primary">TAP TO APPLY</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-background rounded-2xl border border-border p-6 shadow-sm sticky top-28">
                <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.product_id}-checkout`} className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.product_image || '/placeholder.svg'} alt={item.product_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-medium text-sm text-foreground truncate">{item.product_name}</h4>
                          {item.is_subscription && (
                            <Badge className="bg-accent text-accent-foreground rounded-full text-[10px] px-1.5 py-0 flex items-center gap-0.5 flex-shrink-0">
                              <RefreshCw className="h-2.5 w-2.5" /> Sub
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        {item.is_subscription && item.subscription_frequency && (
                          <p className="text-[10px] text-muted-foreground capitalize">{item.subscription_frequency}</p>
                        )}
                      </div>
                      <span className="font-semibold text-sm text-foreground whitespace-nowrap">₹{(item.product_price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>−₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Shipping</span>
                    <span className="text-green-600 font-medium">{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(0)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleRazorpayPayment}
                  disabled={loading || !isFormValid}
                  className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-base font-semibold shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" /> Processing…
                    </span>
                  ) : (
                    `Pay ₹${totalAmount.toFixed(0)}`
                  )}
                </Button>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Secure Payment</span>
                  <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Fast Delivery</span>
                </div>

                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
