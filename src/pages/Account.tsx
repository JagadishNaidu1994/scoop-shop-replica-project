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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Package, Heart, MapPin, CreditCard, Gift, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import HeaderNavBar from '@/components/HeaderNavBar';
import OrderHistory from '@/components/OrderHistory';

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

const Account = () => {
  const { user, signOut } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
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
    city: '',
    state: '',
    pincode: ''
  });

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
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
        setProfileForm({
          full_name: profileData.full_name || '',
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
          gender: profileData.gender || ''
        });
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
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
    // Address functionality - placeholder for now
    toast({
      title: "Feature Coming Soon",
      description: "Address management will be available soon"
    });
    setIsAddressDialogOpen(false);
  };

  const handleAddPaymentMethod = async () => {
    // Payment method functionality - placeholder for now
    toast({
      title: "Feature Coming Soon", 
      description: "Payment method management will be available soon"
    });
    setIsPaymentDialogOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
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
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Card className="border border-gray-200 bg-white">
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
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
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'preferences' 
                        ? 'bg-gray-100 text-gray-900 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Preferences
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <Card className="border border-gray-200 bg-white">
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
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleUpdateProfile} className="bg-black text-white hover:bg-gray-800">
                      Update Profile
                    </Button>
                    <Button onClick={handleSignOut} variant="outline" className="border-gray-300">
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'orders' && <OrderHistory />}

            {activeTab === 'addresses' && (
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">Saved Addresses</CardTitle>
                  <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200 shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Add New Address</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address_full_name">Full Name</Label>
                          <Input
                            id="address_full_name"
                            value={addressForm.full_name}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, full_name: e.target.value }))}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_phone">Phone Number</Label>
                          <Input
                            id="address_phone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_line1">Address Line 1</Label>
                          <Input
                            id="address_line1"
                            value={addressForm.address_line1}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, address_line1: e.target.value }))}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                          <Input
                            id="address_line2"
                            value={addressForm.address_line2}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, address_line2: e.target.value }))}
                            className="border-gray-300"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                              className="border-gray-300"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                              className="border-gray-300"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                            className="border-gray-300"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddAddress} className="bg-black text-white hover:bg-gray-800">
                            Save Address
                          </Button>
                          <Button 
                            onClick={() => setIsAddressDialogOpen(false)} 
                            variant="outline"
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No saved addresses yet.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">Payment Methods</CardTitle>
                  <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-black text-white hover:bg-gray-800">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200 shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Add Payment Method</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardholder_name">Name on Card</Label>
                          <Input
                            id="cardholder_name"
                            value={paymentForm.cardholder_name}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholder_name: e.target.value }))}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card_number">Card Number</Label>
                          <Input
                            id="card_number"
                            value={paymentForm.card_number}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, card_number: e.target.value }))}
                            className="border-gray-300"
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
                              className="border-gray-300"
                            />
                          </div>
                          <div>
                            <Label htmlFor="expiry_year">YYYY</Label>
                            <Input
                              id="expiry_year"
                              placeholder="YYYY"
                              value={paymentForm.expiry_year}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, expiry_year: e.target.value }))}
                              className="border-gray-300"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={paymentForm.cvv}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                              className="border-gray-300"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddPaymentMethod} className="bg-black text-white hover:bg-gray-800">
                            Save Payment Method
                          </Button>
                          <Button 
                            onClick={() => setIsPaymentDialogOpen(false)} 
                            variant="outline"
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No payment methods saved yet.</p>
                </CardContent>
              </Card>
            )}

            {/* Other tabs with placeholder content */}
            {activeTab === 'subscriptions' && (
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No active subscriptions.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'wishlist' && (
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Your wishlist is empty.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'rewards' && (
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No rewards available.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <Card className="border border-gray-200 bg-white">
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
    </div>
  );
};

export default Account;
