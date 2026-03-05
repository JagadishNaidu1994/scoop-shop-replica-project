
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Plus, RefreshCw, Tag, Check, X, ShieldCheck, Truck, ChevronRight, Percent, ChevronDown, Gift, Clock, Lock } from 'lucide-react';
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
    firstName: '', lastName: '', address: '', addressLine2: '', landmark: '',
    city: '', state: '', postalCode: '', phone: '', country: 'India'
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showCouponPopup, setShowCouponPopup] = useState(false);

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
    if (!user) { navigate('/auth'); return; }
    if (items.length === 0) { navigate('/shop'); return; }
    fetchSavedAddresses();
    fetchAvailableCoupons();
  }, [user, items, navigate]);

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
    setShippingAddress({
      firstName: firstName || '', lastName: lastNameParts.join(' ') || '',
      address: address.address_line1, addressLine2: address.address_line2 || '',
      landmark: address.landmark || '', city: address.city, state: address.state,
      postalCode: address.pincode, phone: address.phone, country: 'India'
    });
    if (address.state && indianStatesAndCities[address.state]) setAvailableCities(indianStatesAndCities[address.state]);
  };

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setShippingAddress({ firstName: '', lastName: '', address: '', addressLine2: '', landmark: '', city: '', state: '', postalCode: '', phone: '', country: 'India' });
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

  return (
    <>
      <HeaderNavBar />

      <div className="min-h-screen bg-muted/20">
        {/* Minimal Progress Bar */}
        <div className="bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">✓</span>
                <span className="hidden sm:inline">Cart</span>
              </span>
              <div className="w-8 h-px bg-primary" />
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">2</span>
                Checkout
              </span>
              <div className="w-8 h-px bg-border" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold">3</span>
                <span className="hidden sm:inline">Done</span>
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ═══════════ LEFT: Address ═══════════ */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-background rounded-xl border border-border overflow-hidden">
                {/* Section Header */}
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h2 className="font-semibold text-foreground">Delivery Address</h2>
                  </div>
                </div>

                <div className="p-5">
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-5">
                      <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelection} className="space-y-2.5">
                        {savedAddresses.map((address) => (
                          <label
                            key={address.id}
                            htmlFor={address.id}
                            className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedAddressId === address.id
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                : 'border-border hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={address.id} id={address.id} className="mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-medium text-sm text-foreground">{address.full_name}</span>
                                  {address.is_default && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">DEFAULT</span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {address.address_line1}
                                  {address.address_line2 && `, ${address.address_line2}`}
                                  {address.landmark && ` • ${address.landmark}`}
                                  <br />
                                  {address.city}, {address.state} – {address.pincode}
                                  <br />
                                  📞 {address.phone}
                                </p>
                              </div>
                            </div>
                          </label>
                        ))}

                        <label
                          htmlFor="new"
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedAddressId === 'new'
                              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                              : 'border-dashed border-muted-foreground/30 hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value="new" id="new" />
                          <Plus className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Add new address</span>
                        </label>
                      </RadioGroup>
                    </div>
                  )}

                  {/* New Address Form */}
                  {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">First Name *</Label>
                          <Input value={shippingAddress.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="mt-1 h-9 text-sm" placeholder="John" />
                        </div>
                        <div>
                          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Last Name *</Label>
                          <Input value={shippingAddress.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="mt-1 h-9 text-sm" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Phone *</Label>
                        <Input type="tel" value={shippingAddress.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="mt-1 h-9 text-sm" placeholder="+91 98765 43210" />
                      </div>
                      <div>
                        <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Address Line 1 *</Label>
                        <Input value={shippingAddress.address} onChange={(e) => handleInputChange('address', e.target.value)} className="mt-1 h-9 text-sm" placeholder="House / Flat no., Building" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Address Line 2</Label>
                          <Input value={shippingAddress.addressLine2} onChange={(e) => handleInputChange('addressLine2', e.target.value)} className="mt-1 h-9 text-sm" placeholder="Street, Area" />
                        </div>
                        <div>
                          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Landmark</Label>
                          <Input value={shippingAddress.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} className="mt-1 h-9 text-sm" placeholder="Near Metro Station" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">State *</Label>
                          <Select value={shippingAddress.state} onValueChange={handleStateChange}>
                            <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="State" /></SelectTrigger>
                            <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">City *</Label>
                          <Select value={shippingAddress.city} onValueChange={(v) => handleInputChange('city', v)} disabled={!shippingAddress.state}>
                            <SelectTrigger className="mt-1 h-9 text-sm"><SelectValue placeholder="City" /></SelectTrigger>
                            <SelectContent>{availableCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Pincode *</Label>
                          <Input value={shippingAddress.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className="mt-1 h-9 text-sm" placeholder="500001" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ═══════════ RIGHT: Order Summary ═══════════ */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-xl border border-border overflow-hidden sticky top-28">
                {/* Summary Header */}
                <div className="px-5 py-4 border-b border-border bg-muted/30">
                  <h2 className="font-semibold text-foreground">Order Summary</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>
                </div>

                <div className="p-5">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-52 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.product_id}-co`} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.product_image || '/placeholder.svg'} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">{item.product_name}</h4>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                            {item.is_subscription && (
                              <span className="text-[9px] font-medium px-1 py-0.5 rounded bg-accent text-accent-foreground flex items-center gap-0.5">
                                <RefreshCw className="h-2 w-2" /> SUB
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground">₹{(item.product_price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* ── Coupon Section ── */}
                  <div className="mb-4">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <code className="font-mono font-bold text-xs text-green-800">{appliedCoupon.code}</code>
                            <p className="text-[10px] text-green-600">−₹{discount.toFixed(0)} saved</p>
                          </div>
                        </div>
                        <button onClick={removeCoupon} className="text-destructive hover:text-destructive/80 p-1">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex gap-1.5">
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Coupon code"
                            className="h-9 text-xs font-mono uppercase tracking-wider"
                            onKeyDown={(e) => e.key === 'Enter' && applyCoupon(couponCode)}
                          />
                          <Button
                            onClick={() => applyCoupon(couponCode)}
                            disabled={couponLoading || !couponCode.trim()}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-xs whitespace-nowrap"
                          >
                            {couponLoading ? '...' : 'Apply'}
                          </Button>
                        </div>

                        {availableCoupons.length > 0 && (
                          <button
                            onClick={() => setShowCouponPopup(true)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-primary" />
                              <span className="text-xs font-medium text-primary">
                                {availableCoupons.length} coupon{availableCoupons.length > 1 ? 's' : ''} available
                              </span>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-primary" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator className="mb-4" />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(0)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount</span>
                        <span>−₹{discount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Delivery</span>
                      <span className="text-green-600 font-medium">{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">₹{totalAmount.toFixed(0)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="mt-2 text-center">
                      <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        🎉 You're saving ₹{discount.toFixed(0)} on this order
                      </span>
                    </div>
                  )}

                  <Button
                    onClick={handleRazorpayPayment}
                    disabled={loading || !isFormValid}
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-5 text-sm font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Processing…</span>
                    ) : (
                      `Pay ₹${totalAmount.toFixed(0)}`
                    )}
                  </Button>

                  {/* Trust */}
                  <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Lock className="h-3 w-3" /> Secure</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><ShieldCheck className="h-3 w-3" /> Verified</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Truck className="h-3 w-3" /> Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ Coupon Popup Dialog ═══════════ */}
      <Dialog open={showCouponPopup} onOpenChange={setShowCouponPopup}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-3 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Gift className="h-5 w-5 text-primary" />
              Available Coupons
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {availableCoupons.map((coupon) => {
              const isEligible = subtotal >= coupon.minimum_order_amount;
              const savings = coupon.discount_type === 'percentage'
                ? Math.min(subtotal * (coupon.discount_value / 100), subtotal)
                : Math.min(coupon.discount_value, subtotal);

              return (
                <div
                  key={coupon.id}
                  className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                    isEligible
                      ? 'border-primary/20 hover:border-primary/50'
                      : 'border-border opacity-60'
                  }`}
                >
                  {/* Coupon ticket top band */}
                  <div className="bg-primary/5 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <code className="font-mono font-bold text-sm text-foreground tracking-wider">{coupon.code}</code>
                      {coupon.assigned_users && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">FOR YOU</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
                    </span>
                  </div>

                  <div className="px-4 py-3 space-y-2">
                    {coupon.description && (
                      <p className="text-xs text-muted-foreground">{coupon.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      {coupon.minimum_order_amount > 0 && (
                        <span>Min order: ₹{coupon.minimum_order_amount}</span>
                      )}
                      {coupon.expires_at && (
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" /> {formatExpiry(coupon.expires_at)}
                        </span>
                      )}
                    </div>

                    {isEligible && (
                      <p className="text-[11px] font-medium text-green-600">You'll save ₹{savings.toFixed(0)} on this order</p>
                    )}
                    {!isEligible && (
                      <p className="text-[11px] text-destructive">Add ₹{(coupon.minimum_order_amount - subtotal).toFixed(0)} more to use this coupon</p>
                    )}

                    <Button
                      size="sm"
                      className="w-full h-8 text-xs mt-1"
                      disabled={!isEligible || couponLoading}
                      onClick={() => applyCoupon(coupon.code)}
                    >
                      {couponLoading ? '...' : 'Apply Coupon'}
                    </Button>
                  </div>
                </div>
              );
            })}

            {availableCoupons.length === 0 && (
              <div className="text-center py-8">
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

export default Checkout;
