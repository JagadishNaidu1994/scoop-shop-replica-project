import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ShippingForm from '@/components/checkout/ShippingForm';
import ShippingMethods from '@/components/checkout/ShippingMethods';
import CartItem from '@/components/checkout/CartItem';
import CouponAccordion from '@/components/checkout/CouponAccordion';
import PriceSummary from '@/components/checkout/PriceSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronRight, RefreshCw, Check, X, Ticket } from 'lucide-react';
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

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

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

  return (
    <>
      <HeaderNavBar />

      <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">

          {/* Breadcrumb — outside grid so columns align */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/shop" className="text-[#6B7280] hover:text-foreground transition-colors">Cart</Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#6B7280]" />
            <span className="font-semibold text-foreground">Shipping</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#6B7280]" />
            <span className="text-[#6B7280]">Payment</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-10">

            {/* LEFT COLUMN */}
            <div className="space-y-6 order-2 lg:order-1">

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E5E7EB]">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Saved Addresses</h2>
                  <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelection} className="space-y-3">
                    {savedAddresses.map((address) => (
                      <label
                        key={address.id}
                        htmlFor={`addr-${address.id}`}
                        className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? 'border-2 border-foreground bg-[#F9FAFB]'
                            : 'border border-[#E5E7EB] hover:border-[#9CA3AF]'
                        }`}
                      >
                        <RadioGroupItem value={address.id} id={`addr-${address.id}`} className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm text-foreground">{address.full_name}</span>
                            {address.is_default && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-foreground text-white uppercase tracking-wide">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-[#6B7280] leading-relaxed">
                            {address.address_line1}{address.address_line2 && `, ${address.address_line2}`}, {address.city}, {address.state} – {address.pincode} · {address.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                    <label
                      htmlFor="addr-new"
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border border-dashed ${
                        selectedAddressId === 'new'
                          ? 'border-foreground bg-[#F9FAFB]'
                          : 'border-[#D1D5DB] hover:border-foreground'
                      }`}
                    >
                      <RadioGroupItem value="new" id="addr-new" />
                      <span className="text-sm font-medium text-foreground">+ Add new address</span>
                    </label>
                  </RadioGroup>
                </div>
              )}

              {/* Shipping Form */}
              {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                <ShippingForm
                  shippingAddress={shippingAddress}
                  onInputChange={handleInputChange}
                  onStateChange={handleStateChange}
                  states={states}
                  availableCities={availableCities}
                />
              )}

              {/* Shipping Methods */}
              <ShippingMethods
                selectedShipping={selectedShipping}
                onSelect={setSelectedShipping}
              />
            </div>

            {/* RIGHT COLUMN — Cart Summary */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-xl border border-[#E5E7EB] sticky top-10">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Your Cart</h2>

                  {/* Cart Items */}
                  <div className="max-h-[280px] overflow-y-auto">
                    {items.map((item) => (
                      <CartItem
                        key={`${item.product_id}-co`}
                        productName={item.product_name}
                        productImage={item.product_image}
                        productPrice={item.product_price}
                        quantity={item.quantity}
                        isSubscription={item.is_subscription}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E5E7EB] my-4" />

                  {/* Coupon Section */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 mb-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Check className="h-4 w-4 text-green-600 shrink-0" />
                        <div className="min-w-0">
                          <code className="font-mono font-bold text-xs text-green-800">{appliedCoupon.code}</code>
                          <p className="text-[11px] text-green-600">−₹{discount.toFixed(0)} saved</p>
                        </div>
                      </div>
                      <button onClick={removeCoupon} className="text-[#9CA3AF] hover:text-destructive p-1 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Coupon Input */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Discount code"
                            className="h-12 pl-10 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg text-sm font-mono uppercase tracking-wider placeholder:tracking-normal placeholder:font-sans placeholder:normal-case placeholder:text-[#9CA3AF] focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            onKeyDown={(e) => e.key === 'Enter' && applyCoupon(couponCode)}
                          />
                        </div>
                        <Button
                          onClick={() => applyCoupon(couponCode)}
                          disabled={couponLoading || !couponCode.trim()}
                          className="h-12 px-5 text-sm font-medium bg-foreground text-white hover:bg-foreground/90 rounded-lg"
                        >
                          {couponLoading ? '...' : 'Apply'}
                        </Button>
                      </div>

                      {/* Expandable Available Coupons */}
                      <CouponAccordion
                        availableCoupons={availableCoupons}
                        subtotal={subtotal}
                        onApply={applyCoupon}
                        loading={couponLoading}
                        userEmail={user?.email || undefined}
                      />
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-[#E5E7EB] my-4" />

                  {/* Price Summary */}
                  <PriceSummary
                    subtotal={subtotal}
                    discount={discount}
                    shippingCost={shippingCost}
                    estimatedTax={estimatedTax}
                    total={totalAmount}
                  />

                  {/* CTA */}
                  <Button
                    onClick={handleRazorpayPayment}
                    disabled={loading || !isFormValid}
                    className="w-full mt-4 bg-foreground text-white hover:bg-[#111] rounded-[10px] h-[52px] text-sm font-semibold"
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

      <Footer />
    </>
  );
};

export default Checkout;
