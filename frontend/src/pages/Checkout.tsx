
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Tag, Check, X, ChevronRight, Gift, Clock, Ticket } from 'lucide-react';
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
  email: string;
  country: string;
  description?: string;
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
  const [selectedShipping, setSelectedShipping] = useState<'free' | 'express'>('free');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '', lastName: '', address: '', addressLine2: '', landmark: '',
    city: '', state: '', postalCode: '', phone: '', email: user?.email || '', country: 'India', description: ''
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showCouponPopup, setShowCouponPopup] = useState(false);

  const shippingCost = selectedShipping === 'express' ? 99 : 0;
  const subtotal = getTotalPrice();
  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.min(subtotal * (appliedCoupon.discount_value / 100), subtotal)
      : Math.min(appliedCoupon.discount_value, subtotal)
    : 0;
  const estimatedTax = Math.round((subtotal - discount) * 0.05);
  const totalAmount = subtotal - discount + shippingCost + estimatedTax;

  useEffect(() => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'postalCode', 'phone'];
    const isValid = required.every((field) => shippingAddress[field as keyof ShippingAddress]);
    setIsFormValid(isValid);
  }, [shippingAddress]);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    if (items.length === 0) { navigate('/shop'); return; }
    fetchSavedAddresses();
    fetchAvailableCoupons();
  }, [user, items, navigate]);

  useEffect(() => {
    if (user?.email) {
      setShippingAddress(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const fetchSavedAddresses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('addresses').select('*')
        .eq('user_id', user.id).order('is_default', { ascending: false });
      if (error) throw error;
      setSavedAddresses(data || []);
      const defaultAddress = data?.find((addr) => addr.is_default);
      if (defaultAddress) { setSelectedAddressId(defaultAddress.id); loadAddress(defaultAddress); }
    } catch (error) { console.error('Error fetching addresses:', error); }
  };

  const fetchAvailableCoupons = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('coupon_codes').select('*')
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
      if (error) throw error;
      const filtered = (data || []).filter((coupon) => {
        if (!coupon.assigned_users) return true;
        if (user.email) {
          return coupon.assigned_users.split(',').map((e: string) => e.trim().toLowerCase()).includes(user.email.toLowerCase());
        }
        return false;
      });
      setAvailableCoupons(filtered);
    } catch (error) { console.error('Error fetching coupons:', error); }
  };

  const applyCoupon = async (code: string) => {
    if (!code.trim()) return;
    setCouponLoading(true);
    try {
      const { data, error } = await supabase.from('coupon_codes').select('*')
        .eq('code', code.trim().toUpperCase()).eq('is_active', true).single();
      if (error || !data) { toast({ title: 'Invalid Coupon', description: 'This coupon code is not valid.', variant: 'destructive' }); return; }
      if (data.expires_at && new Date(data.expires_at) < new Date()) { toast({ title: 'Expired', description: 'This coupon has expired.', variant: 'destructive' }); return; }
      if (data.max_uses && data.used_count >= data.max_uses) { toast({ title: 'Limit Reached', description: 'This coupon has reached its usage limit.', variant: 'destructive' }); return; }
      if (subtotal < data.minimum_order_amount) { toast({ title: 'Minimum Not Met', description: `Minimum order of ₹${data.minimum_order_amount} required.`, variant: 'destructive' }); return; }
      if (data.assigned_users && user?.email) {
        const allowed = data.assigned_users.split(',').map((e: string) => e.trim().toLowerCase());
        if (!allowed.includes(user.email.toLowerCase())) { toast({ title: 'Not Eligible', description: 'This coupon is not available for your account.', variant: 'destructive' }); return; }
      }
      setAppliedCoupon(data);
      setCouponCode(data.code);
      setShowCouponPopup(false);
      toast({ title: 'Coupon Applied!', description: `You saved ${data.discount_type === 'percentage' ? `${data.discount_value}%` : `₹${data.discount_value}`}` });
    } catch (error) { toast({ title: 'Error', description: 'Failed to apply coupon.', variant: 'destructive' }); }
    finally { setCouponLoading(false); }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponCode(''); toast({ title: 'Coupon Removed' }); };

  const loadAddress = (address: SavedAddress) => {
    const [firstName, ...lastNameParts] = address.full_name.split(' ');
    setShippingAddress(prev => ({
      ...prev,
      firstName: firstName || '', lastName: lastNameParts.join(' ') || '',
      address: address.address_line1, addressLine2: address.address_line2 || '',
      landmark: address.landmark || '', city: address.city, state: address.state,
      postalCode: address.pincode, phone: address.phone
    }));
    if (address.state && indianStatesAndCities[address.state]) setAvailableCities(indianStatesAndCities[address.state]);
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setShippingAddress(prev => ({ ...prev, firstName: '', lastName: '', address: '', addressLine2: '', landmark: '', city: '', state: '', postalCode: '', phone: '' }));
      setAvailableCities([]);
    } else {
      const sel = savedAddresses.find((a) => a.id === addressId);
      if (sel) loadAddress(sel);
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
      rzp.on('payment.failed', (resp: any) => { setLoading(false); toast({ title: 'Payment Failed', description: resp.error?.description || 'Please try again.', variant: 'destructive' }); });
      rzp.open();
    } catch (error: any) { setLoading(false); toast({ title: 'Payment Error', description: error.message || 'Failed to initiate payment.', variant: 'destructive' }); }
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
      toast({ title: 'Order Placed Successfully!', description: `Order #${verifyData.order_number} placed.` });
      navigate(`/orders/${verifyData.order_id}`);
    } catch (error: any) { toast({ title: 'Verification Error', description: error.message || 'Contact support.', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const saveNewAddress = async () => {
    if (!user) return;
    try {
      const { data: existing } = await supabase.from('addresses').select('id')
        .eq('user_id', user.id).eq('address_line1', shippingAddress.address)
        .eq('city', shippingAddress.city).eq('pincode', shippingAddress.postalCode);
      if (existing && existing.length > 0) return;
      const { data: all } = await supabase.from('addresses').select('id').eq('user_id', user.id);
      await supabase.from('addresses').insert({
        user_id: user.id, full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        phone: shippingAddress.phone, address_line1: shippingAddress.address,
        address_line2: shippingAddress.addressLine2 || null, landmark: shippingAddress.landmark || null,
        city: shippingAddress.city, state: shippingAddress.state, pincode: shippingAddress.postalCode,
        is_default: !all || all.length === 0
      });
    } catch (err) { console.warn('Failed to save address:', err); }
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

  const formatExpiry = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const globalCoupons = availableCoupons.filter(c => !c.assigned_users);
  const personalCoupons = availableCoupons.filter(c => !!c.assigned_users);

  return (
    <>
      <HeaderNavBar />

      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

            {/* ═══════════ LEFT COLUMN ═══════════ */}
            <div className="lg:col-span-7 space-y-6">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm">
                <Link to="/shop" className="text-primary hover:underline font-medium">Cart</Link>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">Shipping</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Payment</span>
              </nav>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="bg-white rounded-lg border border-border p-5">
                  <h2 className="text-base font-semibold text-foreground mb-3">Saved Addresses</h2>
                  <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelection} className="space-y-2">
                    {savedAddresses.map((address) => (
                      <label
                        key={address.id}
                        htmlFor={`addr-${address.id}`}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? 'border-foreground bg-muted/30'
                            : 'border-border hover:border-muted-foreground/40'
                        }`}
                      >
                        <RadioGroupItem value={address.id} id={`addr-${address.id}`} className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm">{address.full_name}</span>
                            {address.is_default && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-foreground/10 text-foreground">DEFAULT</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {address.address_line1}{address.address_line2 && `, ${address.address_line2}`}, {address.city}, {address.state} – {address.pincode} · {address.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                    <label
                      htmlFor="addr-new"
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedAddressId === 'new'
                          ? 'border-foreground bg-muted/30'
                          : 'border-dashed border-muted-foreground/30 hover:border-foreground/40'
                      }`}
                    >
                      <RadioGroupItem value="new" id="addr-new" />
                      <span className="text-sm font-medium">+ Add new address</span>
                    </label>
                  </RadioGroup>
                </div>
              )}

              {/* Shipping Address Form */}
              {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                <div className="bg-white rounded-lg border border-border p-5 sm:p-7">
                  <h2 className="text-lg font-semibold text-foreground mb-5">Shipping Address</h2>

                  <div className="space-y-4">
                    {/* First Name / Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-foreground">First Name*</Label>
                        <Input
                          value={shippingAddress.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="mt-1.5 h-11 bg-white border-border rounded-md text-sm"
                          placeholder="Divyansh"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">Last Name*</Label>
                        <Input
                          value={shippingAddress.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="mt-1.5 h-11 bg-white border-border rounded-md text-sm"
                          placeholder="Agarwal"
                        />
                      </div>
                    </div>

                    {/* Email / Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Email*</Label>
                        <Input
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1.5 h-11 bg-white border-border rounded-md text-sm"
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">Phone number*</Label>
                        <div className="flex mt-1.5">
                          <div className="flex items-center px-3 h-11 bg-muted/50 border border-r-0 border-border rounded-l-md text-sm text-muted-foreground">
                            IND +91
                          </div>
                          <Input
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="h-11 bg-white border-border rounded-l-none rounded-r-md text-sm"
                            placeholder="9876543210"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label className="text-sm font-medium text-foreground">Address*</Label>
                      <Input
                        value={shippingAddress.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-1.5 h-11 bg-white border-border rounded-md text-sm"
                        placeholder="House / Flat no., Building, Street"
                      />
                    </div>

                    {/* City / State / Zip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-foreground">City*</Label>
                        {availableCities.length > 0 ? (
                          <Select value={shippingAddress.city} onValueChange={(v) => handleInputChange('city', v)}>
                            <SelectTrigger className="mt-1.5 h-11 bg-white border-border text-sm">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>{availableCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={shippingAddress.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="mt-1.5 h-11 bg-white border-border rounded-md text-sm"
                            placeholder="Bangalore"
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">State*</Label>
                        <Select value={shippingAddress.state} onValueChange={handleStateChange}>
                          <SelectTrigger className="mt-1.5 h-11 bg-white border-border text-sm">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-foreground">Zip Code*</Label>
                        <Input
                          value={shippingAddress.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="mt-1.5 h-11 bg-white border-border rounded-md text-sm"
                          placeholder="560021"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-sm font-medium text-foreground">Description</Label>
                      <Textarea
                        value={shippingAddress.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="mt-1.5 bg-white border-border rounded-md text-sm min-h-[100px] resize-none"
                        placeholder="Enter a description..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Method */}
              <div className="bg-white rounded-lg border border-border p-5 sm:p-7">
                <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedShipping('free')}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left ${
                      selectedShipping === 'free'
                        ? 'border-foreground'
                        : 'border-border hover:border-muted-foreground/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedShipping === 'free' ? 'border-foreground' : 'border-muted-foreground/40'
                      }`}>
                        {selectedShipping === 'free' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Free Shipping</p>
                        <p className="text-xs text-muted-foreground">7-20 Days</p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">₹0</span>
                  </button>

                  <button
                    onClick={() => setSelectedShipping('express')}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left ${
                      selectedShipping === 'express'
                        ? 'border-foreground'
                        : 'border-border hover:border-muted-foreground/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedShipping === 'express' ? 'border-foreground' : 'border-muted-foreground/40'
                      }`}>
                        {selectedShipping === 'express' && <div className="w-2 h-2 rounded-full bg-foreground" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Express Shipping</p>
                        <p className="text-xs text-muted-foreground">1-3 Days</p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">₹99</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ═══════════ RIGHT COLUMN: Your Cart ═══════════ */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg border border-border sticky top-28 overflow-hidden">
                <div className="p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-5">Your Cart</h2>

                  {/* Cart Items */}
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={`${item.product_id}-co`} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product_image || '/placeholder.svg'}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-white text-[10px] font-bold flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">{item.product_name}</h4>
                          {item.is_subscription && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                              <RefreshCw className="h-2.5 w-2.5" /> Subscription
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                          ₹{(item.product_price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-5" />

                  {/* Discount Code */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 mb-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <code className="font-mono font-bold text-xs text-green-800">{appliedCoupon.code}</code>
                          <p className="text-[11px] text-green-600">−₹{discount.toFixed(0)} saved</p>
                        </div>
                      </div>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive p-1 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 relative">
                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Discount code"
                          className="h-11 pl-10 bg-white border-border rounded-md text-sm font-mono uppercase tracking-wider"
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon(couponCode)}
                        />
                      </div>
                      <Button
                        onClick={() => applyCoupon(couponCode)}
                        disabled={couponLoading || !couponCode.trim()}
                        variant="outline"
                        className="h-11 px-5 text-sm font-semibold border-border hover:bg-muted/50"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </Button>
                    </div>
                  )}

                  {/* View Coupons Button */}
                  {!appliedCoupon && availableCoupons.length > 0 && (
                    <button
                      onClick={() => setShowCouponPopup(true)}
                      className="w-full flex items-center justify-between py-2 px-1 text-left group mb-4"
                    >
                      <span className="flex items-center gap-2 text-xs font-medium text-primary group-hover:underline">
                        <Gift className="h-3.5 w-3.5" />
                        View {availableCoupons.length} available coupon{availableCoupons.length > 1 ? 's' : ''}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    </button>
                  )}

                  {/* Totals */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">−₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-foreground">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        Estimated taxes
                        <span className="inline-block w-3.5 h-3.5 rounded-full border border-muted-foreground/40 text-[9px] text-muted-foreground flex items-center justify-center leading-none">?</span>
                      </span>
                      <span className="font-medium text-foreground">₹{estimatedTax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                    <span className="text-base font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {discount > 0 && (
                    <p className="text-center text-[11px] font-medium text-green-600 mt-2">
                      🎉 You're saving ₹{discount.toFixed(0)} on this order
                    </p>
                  )}

                  {/* CTA */}
                  <Button
                    onClick={handleRazorpayPayment}
                    disabled={loading || !isFormValid}
                    className="w-full mt-5 bg-foreground text-white hover:bg-foreground/90 rounded-lg h-12 text-sm font-semibold tracking-wide"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Processing…</span>
                    ) : (
                      'Continue to Payment'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ Coupon Popup Dialog ═══════════ */}
      <Dialog open={showCouponPopup} onOpenChange={setShowCouponPopup}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-3 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Gift className="h-5 w-5 text-primary" />
              Available Coupons
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-3 space-y-5">
            {/* Account-Specific Coupons */}
            {personalCoupons.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Gift className="h-3.5 w-3.5" /> For Your Account
                </h3>
                <div className="space-y-2.5">
                  {personalCoupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} subtotal={subtotal} onApply={applyCoupon} loading={couponLoading} formatExpiry={formatExpiry} isPersonal />
                  ))}
                </div>
              </div>
            )}

            {/* Global Coupons */}
            {globalCoupons.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Available for Everyone
                </h3>
                <div className="space-y-2.5">
                  {globalCoupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} subtotal={subtotal} onApply={applyCoupon} loading={couponLoading} formatExpiry={formatExpiry} />
                  ))}
                </div>
              </div>
            )}

            {availableCoupons.length === 0 && (
              <div className="text-center py-10">
                <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No coupons available</p>
                <p className="text-xs text-muted-foreground mt-1">Check back later for deals!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

/* ── Coupon Card Sub-component ── */
const CouponCard = ({
  coupon, subtotal, onApply, loading, formatExpiry, isPersonal
}: {
  coupon: Coupon; subtotal: number; onApply: (code: string) => void; loading: boolean;
  formatExpiry: (d: string | null) => string | null; isPersonal?: boolean;
}) => {
  const isEligible = subtotal >= coupon.minimum_order_amount;
  const savings = coupon.discount_type === 'percentage'
    ? Math.min(subtotal * (coupon.discount_value / 100), subtotal)
    : Math.min(coupon.discount_value, subtotal);

  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${
      isEligible ? 'border-border hover:border-foreground/30' : 'border-border opacity-60'
    }`}>
      <div className={`px-4 py-2.5 flex items-center justify-between ${isPersonal ? 'bg-primary/5' : 'bg-muted/30'}`}>
        <div className="flex items-center gap-2">
          <code className="font-mono font-bold text-sm text-foreground tracking-wider">{coupon.code}</code>
          {isPersonal && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">For You</span>
          )}
        </div>
        <span className="text-sm font-bold text-foreground">
          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        {coupon.description && <p className="text-xs text-muted-foreground">{coupon.description}</p>}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {coupon.minimum_order_amount > 0 && <span>Min order: ₹{coupon.minimum_order_amount}</span>}
          {coupon.expires_at && (
            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {formatExpiry(coupon.expires_at)}</span>
          )}
        </div>
        {isEligible && <p className="text-[11px] font-medium text-green-600">You'll save ₹{savings.toFixed(0)}</p>}
        {!isEligible && <p className="text-[11px] text-destructive">Add ₹{(coupon.minimum_order_amount - subtotal).toFixed(0)} more</p>}
        <Button size="sm" className="w-full h-8 text-xs mt-1 bg-foreground text-white hover:bg-foreground/90" disabled={!isEligible || loading} onClick={() => onApply(coupon.code)}>
          {loading ? '...' : 'Apply Coupon'}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
