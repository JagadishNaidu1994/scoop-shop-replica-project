import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Package, Heart, MapPin, CreditCard, Gift, Settings, Plus, Edit, Trash2, LogOut, Trophy, Star } from 'lucide-react';
import HeaderNavBar from '@/components/HeaderNavBar';
import OrderHistory from '@/components/OrderHistory';
import OrderDetailModal from '@/components/OrderDetailModal';
import MobileSidebar from '@/components/MobileSidebar';
import { indianStatesAndCities } from '@/data/indianStatesAndCities';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  gender: string | null;
}

interface Address {
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

interface PaymentMethod {
  id: string;
  type: string;
  last_four: string;
  cardholder_name: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  delivered_at?: string;
  order_items: OrderItem[];
}

interface Product {
  id: number;
  name: string;
  primary_image: string;
  benefits: string[];
  description: string;
}

const Account = () => {
  const { user, signOut } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<{ [key: number]: Product }>({});
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    gender: ''
  });

  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [paymentForm, setPaymentForm] = useState({
    type: 'card',
    cardholder_name: '',
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
      // Load orders in background after initial render
      setTimeout(() => {
        fetchOrders();
      }, 100);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch only critical data first (profile, addresses, payments)
      const [profileResult, addressesResult, paymentResult] = await Promise.all([
        // Fetch profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single(),

        // Fetch addresses
        supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),

        // Fetch payment methods
        supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      // Handle profile
      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileResult.error);
      } else if (profileResult.data) {
        setProfile(profileResult.data);
        setProfileForm({
          full_name: profileResult.data.full_name || '',
          first_name: profileResult.data.first_name || '',
          last_name: profileResult.data.last_name || '',
          phone: profileResult.data.phone || '',
          gender: profileResult.data.gender || ''
        });
      }

      // Handle addresses
      if (addressesResult.error) {
        console.error('Error fetching addresses:', addressesResult.error);
      } else {
        setAddresses(addressesResult.data || []);
      }

      // Handle payment methods
      if (paymentResult.error) {
        console.error('Error fetching payment methods:', paymentResult.error);
      } else {
        setPaymentMethods(paymentResult.data || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Fetch orders with items in background
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          delivered_at,
          order_items (
            id,
            product_id,
            product_name,
            product_price,
            quantity
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      } else {
        const orders = ordersData || [];
        setOrders(orders);

        // Fetch product details for all unique product IDs
        const productIds = [...new Set(orders.flatMap(order =>
          order.order_items?.map((item: any) => item.product_id) || []
        ))];

        if (productIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('id, name, primary_image, benefits, description')
            .in('id', productIds);

          if (productsError) {
            console.error('Error fetching product details:', productsError);
          } else {
            const productsMap = productsData?.reduce((acc, product) => {
              acc[product.id] = product;
              return acc;
            }, {} as { [key: number]: Product }) || {};
            setProducts(productsMap);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileForm,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          ...addressForm,
          is_default: addresses.length === 0 // First address is default
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address added successfully"
      });

      setIsAddressDialogOpen(false);
      setAddressForm({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
      });
      fetchUserData();
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAddress = async () => {
    if (!user || !editingAddress) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .update(addressForm)
        .eq('id', editingAddress.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address updated successfully"
      });

      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      setAddressForm({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
      });
      fetchUserData();
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully"
      });

      fetchUserData();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          type: paymentForm.type,
          cardholder_name: paymentForm.cardholder_name,
          last_four: paymentForm.card_number.slice(-4),
          expiry_month: parseInt(paymentForm.expiry_month),
          expiry_year: parseInt(paymentForm.expiry_year),
          is_default: paymentMethods.length === 0 // First payment method is default
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment method added successfully"
      });

      setIsPaymentDialogOpen(false);
      setPaymentForm({
        type: 'card',
        cardholder_name: '',
        card_number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: ''
      });
      fetchUserData();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePaymentMethod = async () => {
    if (!user || !editingPayment) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({
          cardholder_name: paymentForm.cardholder_name,
          last_four: paymentForm.card_number.slice(-4),
          expiry_month: parseInt(paymentForm.expiry_month),
          expiry_year: parseInt(paymentForm.expiry_year),
        })
        .eq('id', editingPayment.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment method updated successfully"
      });

      setIsPaymentDialogOpen(false);
      setEditingPayment(null);
      setPaymentForm({
        type: 'card',
        cardholder_name: '',
        card_number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: ''
      });
      fetchUserData();
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast({
        title: "Error",
        description: "Failed to update payment method",
        variant: "destructive"
      });
    }
  };

  const handleDeletePaymentMethod = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment method deleted successfully"
      });

      fetchUserData();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive"
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });
    // Set available cities based on the address state
    if (address.state && indianStatesAndCities[address.state]) {
      setAvailableCities(indianStatesAndCities[address.state]);
    }
    setIsAddressDialogOpen(true);
  };

  const handleStateChange = (value: string) => {
    setAddressForm(prev => ({ ...prev, state: value, city: '' }));
    setAvailableCities(indianStatesAndCities[value] || []);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setPaymentForm({
      type: payment.type,
      cardholder_name: payment.cardholder_name,
      card_number: `****-****-****-${payment.last_four}`,
      expiry_month: payment.expiry_month.toString(),
      expiry_year: payment.expiry_year.toString(),
      cvv: ''
    });
    setIsPaymentDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account"
    });
  };

  // Order detail modal functions
  const formatOrderNumber = (orderNumber: string) => {
    const match = orderNumber.match(/order_(\d+)/);
    if (match) {
      const timestamp = parseInt(match[1]);
      const incrementalId = (timestamp % 10000) + 1;
      return String(incrementalId).padStart(4, '0');
    }
    return orderNumber.slice(-4).padStart(4, '0');
  };

  const getProductImage = (productId: number) => {
    const imageMap: { [key: number]: string } = {
      1: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop",
      2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
      3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    };
    return imageMap[productId] || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";
  };

  const getProductName = (item: any) => {
    return item.product_name;
  };

  const getProductDescription = (productId: number) => {
    const descriptions: { [key: string]: string } = {
      "1": "Are you a minimalist looking for a compact carry option? The Micro Backpack is the perfect size for your essential everyday carry items.",
      "2": "This durable shopping tote is perfect for the world traveler. Its yellow canvas construction is water, fray, tear resistant.",
      "3": "Save space and protect your favorite clothes in this double-layer garment bag. Each compartment easily holds multiple pairs of jeans or tops."
    };
    return descriptions[productId] || "Premium quality product designed for your everyday needs with excellent durability and style.";
  };

  const handleViewInvoice = (order: any) => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Order #${formatOrderNumber(order.order_number)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .company-name { font-size: 28px; font-weight: bold; color: #000; }
          .invoice-title { font-size: 24px; margin: 20px 0; }
          .order-info { display: flex; justify-content: space-between; margin: 30px 0; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-row { font-weight: bold; font-size: 16px; }
          .footer { margin-top: 50px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">DIRTEA</div>
          <div class="invoice-title">INVOICE</div>
        </div>
        
        <div class="order-info">
          <div>
            <strong>Invoice #:</strong> ${formatOrderNumber(order.order_number)}<br>
            <strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}<br>
            <strong>Status:</strong> ${order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items?.map((item: any) => `
                <tr>
                  <td>${getProductName(item)}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.product_price}</td>
                  <td>₹${(item.product_price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('') || ''}
              <tr class="total-row">
                <td colspan="3">Total Amount</td>
                <td>₹${order.total_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${formatOrderNumber(order.order_number)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Invoice downloaded successfully"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Please log in to access your account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Sidebar */}
          <MobileSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleSignOut={handleSignOut}
            profile={profile}
          />

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
              <CardContent className="p-6">
                {/* User Info */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {profile?.full_name || profile?.first_name || 'User'}
                  </h3>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'dashboard' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    Dashboard
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    Orders
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('subscriptions')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'subscriptions' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    Subscriptions
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'wishlist' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'addresses' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    Addresses
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'payments' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    Payments
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'rewards' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Gift className="h-5 w-5" />
                    Rewards
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      activeTab === 'preferences' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Preferences
                  </button>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors text-red-600 hover:bg-red-50 mt-4 border-t border-gray-200 pt-4"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className="border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleUpdateProfile} className="bg-black text-white hover:bg-gray-800 rounded-full">
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'orders' && (
              ordersLoading ? (
                <Card className="border-gray-200 bg-white rounded-2xl shadow-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-4 bg-gray-200 rounded-xl w-32"></div>
                            <div className="h-6 bg-gray-200 rounded-xl w-20"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-xl w-24 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded-xl w-16"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <OrderHistory
                  preloadedOrders={orders}
                  preloadedProducts={products}
                />
              )
            )}

            {activeTab === 'addresses' && (
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">Saved Addresses</CardTitle>
                  <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-black text-white hover:bg-gray-800 rounded-full"
                        onClick={() => {
                          setEditingAddress(null);
                          setAddressForm({
                            full_name: '',
                            phone: '',
                            address_line1: '',
                            address_line2: '',
                            landmark: '',
                            city: '',
                            state: '',
                            pincode: ''
                          });
                          setAvailableCities([]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200 shadow-lg rounded-2xl max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">
                          {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address_full_name">Full Name</Label>
                          <Input
                            id="address_full_name"
                            value={addressForm.full_name}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, full_name: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_phone">Phone Number</Label>
                          <Input
                            id="address_phone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_line1">Address Line 1</Label>
                          <Input
                            id="address_line1"
                            value={addressForm.address_line1}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, address_line1: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                          <Input
                            id="address_line2"
                            value={addressForm.address_line2}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, address_line2: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="landmark">Landmark (Optional)</Label>
                          <Input
                            id="landmark"
                            value={addressForm.landmark}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                            placeholder="e.g., Near Metro Station"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Select
                              value={addressForm.state}
                              onValueChange={handleStateChange}
                            >
                              <SelectTrigger className="border-gray-300 rounded-xl">
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
                            <Label htmlFor="city">City</Label>
                            <Select
                              value={addressForm.city}
                              onValueChange={(value) => setAddressForm(prev => ({ ...prev, city: value }))}
                              disabled={!addressForm.state}
                            >
                              <SelectTrigger className="border-gray-300 rounded-xl">
                                <SelectValue placeholder={addressForm.state ? "Select City" : "Select State First"} />
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
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={editingAddress ? handleUpdateAddress : handleAddAddress} 
                            className="bg-black text-white hover:bg-gray-800 rounded-full"
                          >
                            {editingAddress ? 'Update Address' : 'Save Address'}
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsAddressDialogOpen(false);
                              setEditingAddress(null);
                            }} 
                            variant="outline"
                            className="border-gray-300 rounded-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{address.full_name}</h4>
                              <p className="text-gray-600">{address.phone}</p>
                              <p className="text-gray-600">
                                {address.address_line1}
                                {address.address_line2 && `, ${address.address_line2}`}
                              </p>
                              {address.landmark && (
                                <p className="text-gray-600">
                                  Landmark: {address.landmark}
                                </p>
                              )}
                              <p className="text-gray-600">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              {address.is_default && (
                                <Badge className="bg-green-100 text-green-800 rounded-full mt-2">Default</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditAddress(address)}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 rounded-full"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteAddress(address.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No saved addresses yet.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">Payment Methods</CardTitle>
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-black text-white hover:bg-gray-800 rounded-full"
                        onClick={() => {
                          setEditingPayment(null);
                          setPaymentForm({
                            type: 'card',
                            cardholder_name: '',
                            card_number: '',
                            expiry_month: '',
                            expiry_year: '',
                            cvv: ''
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200 shadow-lg rounded-2xl max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">
                          {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardholder_name">Name on Card</Label>
                          <Input
                            id="cardholder_name"
                            value={paymentForm.cardholder_name}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholder_name: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_number">Card Number</Label>
                          <Input
                            id="card_number"
                            value={paymentForm.card_number}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, card_number: e.target.value }))}
                            className="border-gray-300 rounded-xl"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="expiry_month">MM</Label>
                            <Input
                              id="expiry_month"
                              placeholder="MM"
                              value={paymentForm.expiry_month}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, expiry_month: e.target.value }))}
                              className="border-gray-300 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="expiry_year">YYYY</Label>
                            <Input
                              id="expiry_year"
                              placeholder="YYYY"
                              value={paymentForm.expiry_year}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, expiry_year: e.target.value }))}
                              className="border-gray-300 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={paymentForm.cvv}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                              className="border-gray-300 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={editingPayment ? handleUpdatePaymentMethod : handleAddPaymentMethod} 
                            className="bg-black text-white hover:bg-gray-800 rounded-full"
                          >
                            {editingPayment ? 'Update Payment Method' : 'Save Payment Method'}
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsPaymentDialogOpen(false);
                              setEditingPayment(null);
                            }} 
                            variant="outline"
                            className="border-gray-300 rounded-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((payment) => (
                        <div key={payment.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{payment.cardholder_name}</h4>
                              <p className="text-gray-600">**** **** **** {payment.last_four}</p>
                              <p className="text-gray-600">
                                Expires {payment.expiry_month.toString().padStart(2, '0')}/{payment.expiry_year}
                              </p>
                              {payment.is_default && (
                                <Badge className="bg-green-100 text-green-800 rounded-full mt-2">Default</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditPayment(payment)}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 rounded-full"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeletePaymentMethod(payment.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No payment methods saved yet.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Rewards Section */}
            {activeTab === 'rewards' && (
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    Rewards Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Rewards Balance */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">150 Points</h3>
                        <p className="text-gray-600">Available to redeem</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">₹75</p>
                        <p className="text-gray-600">Cash value</p>
                      </div>
                    </div>
                  </div>

                  {/* Earning Ways */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Earn More Points</h4>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Star className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Complete Purchase</h5>
                          <p className="text-gray-600">Earn 1 point for every ₹10 spent</p>
                        </div>
                        <div className="text-green-600 font-semibold">+1 pt/₹10</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Heart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Write a Review</h5>
                          <p className="text-gray-600">Share your experience with products</p>
                        </div>
                        <div className="text-blue-600 font-semibold">+50 pts</div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Gift className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">Refer a Friend</h5>
                          <p className="text-gray-600">Both you and your friend get points</p>
                        </div>
                        <div className="text-purple-600 font-semibold">+100 pts</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Order #WU0123</p>
                          <p className="text-sm text-gray-600">2 days ago</p>
                        </div>
                        <div className="text-green-600 font-semibold">+25 pts</div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Product Review</p>
                          <p className="text-sm text-gray-600">1 week ago</p>
                        </div>
                        <div className="text-green-600 font-semibold">+50 pts</div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium text-gray-900">Welcome Bonus</p>
                          <p className="text-sm text-gray-600">2 weeks ago</p>
                        </div>
                        <div className="text-green-600 font-semibold">+75 pts</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other tabs with placeholder content */}
            {activeTab === 'subscriptions' && (
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No active subscriptions.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'wishlist' && (
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Your wishlist is empty.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <Card className="border border-gray-200 bg-white rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Manage your preferences here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
        onDownloadInvoice={handleViewInvoice}
        getProductImage={getProductImage}
        getProductName={getProductName}
        getProductDescription={getProductDescription}
        formatOrderNumber={formatOrderNumber}
      />
    </div>
  );
};

export default Account;
