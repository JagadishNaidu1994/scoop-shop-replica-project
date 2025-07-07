import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import OrderHistory from '@/components/OrderHistory';
import ContactUsModal from '@/components/ContactUsModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  User, 
  Package, 
  Settings, 
  LogOut, 
  CreditCard,
  MapPin,
  Gift,
  Mail,
  Shield,
  Bell,
  Menu,
  X
} from 'lucide-react';

interface ProfileData {
  id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

const Account = () => {
  const { user, signOut, loading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [updating, setUpdating] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: 'Monthly Tea Subscription',
      description: 'Premium matcha blend delivered monthly',
      price: 2499,
      status: 'active',
      nextBilling: '2025-02-05'
    },
    {
      id: 2,
      name: 'Newsletter',
      description: 'Weekly updates on new products and recipes',
      price: 0,
      status: 'active',
      nextBilling: null
    }
  ]);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Tea Street, Mumbai, Maharashtra 400001',
      country: 'India',
      phone: '+91 9876543210',
      isDefault: true
    },
    {
      id: 2,
      label: 'Office',
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Business Park, Bangalore, Karnataka 560001',
      country: 'India',
      phone: '+91 9876543210',
      isDefault: false
    }
  ]);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      lastFour: '1234',
      expiryMonth: '12',
      expiryYear: '25',
      holderName: 'John Doe',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      lastFour: '5678',
      expiryMonth: '08',
      expiryYear: '26',
      holderName: 'John Doe',
      isDefault: false
    }
  ]);
  const [formData, setFormData] = useState({
    full_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          gender: data.gender || ''
        });
      } else {
        setFormData({
          full_name: '',
          first_name: '',
          last_name: '',
          email: user.email || '',
          phone: '',
          gender: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSubscriptionAction = async (subscriptionId: number, action: 'manage' | 'unsubscribe') => {
    if (action === 'manage') {
      navigate('/account');
      toast({
        title: "Subscription Management",
        description: "Opening subscription management portal..."
      });
      
      setTimeout(() => {
        toast({
          title: "Subscription Updated",
          description: "Your subscription preferences have been updated"
        });
      }, 2000);
    } else if (action === 'unsubscribe') {
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled' }
            : sub
        )
      );
      toast({
        title: "Unsubscribed",
        description: "You have been unsubscribed successfully"
      });
    }
  };

  const handleSetDefaultAddress = (addressId: number) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
    toast({
      title: "Default address updated",
      description: "Your default address has been changed"
    });
  };

  const handleSetDefaultPayment = (paymentId: number) => {
    setPaymentMethods(prev => 
      prev.map(payment => ({
        ...payment,
        isDefault: payment.id === paymentId
      }))
    );
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been changed"
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const sidebarItems = [
    { id: 'profile', title: 'Profile Settings', icon: User },
    { id: 'subscriptions', title: 'Subscriptions', icon: Bell },
    { id: 'orders', title: 'Order History', icon: Package },
    { id: 'preferences', title: 'Preferences', icon: Settings },
    { id: 'contact', title: 'Contact Us', icon: Mail },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'address', title: 'Address Book', icon: MapPin },
    { id: 'payment', title: 'Payment Methods', icon: CreditCard },
    { id: 'rewards', title: 'Rewards', icon: Gift },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading account...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card className="border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="first_name" className="text-black font-medium">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="mt-2 border-gray-200 bg-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="last_name" className="text-black font-medium">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="mt-2 border-gray-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-black font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    className="mt-2 bg-gray-50 border-gray-200 text-gray-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-black font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-2 border-gray-200 bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="gender" className="text-black font-medium">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                    <SelectTrigger className="mt-2 border-gray-200 bg-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case 'subscriptions':
        return (
          <Card className="border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <Bell className="h-5 w-5" />
                Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h3 className="font-semibold text-black">{subscription.name}</h3>
                    <p className="text-gray-600 text-sm">{subscription.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        {subscription.price > 0 ? (
                          <span className="text-black font-medium">₹{subscription.price}/month</span>
                        ) : (
                          <span className={`font-medium ${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {subscription.status === 'active' ? 'Active' : 'Cancelled'}
                          </span>
                        )}
                        {subscription.nextBilling && (
                          <p className="text-xs text-gray-500">Next billing: {subscription.nextBilling}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {subscription.status === 'active' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-300 bg-white hover:bg-gray-50"
                              onClick={() => handleSubscriptionAction(subscription.id, 'manage')}
                            >
                              Manage
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-600 hover:bg-red-50 bg-white"
                              onClick={() => handleSubscriptionAction(subscription.id, 'unsubscribe')}
                            >
                              Unsubscribe
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'orders':
        return <OrderHistory />;

      case 'preferences':
        return (
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <Settings className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-black mb-3">Communication Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-gray-700">Order updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-700">Marketing emails</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-3">Display Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="radio" name="currency" defaultChecked className="mr-2" />
                      <span className="text-gray-700">INR (₹)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="currency" className="mr-2" />
                      <span className="text-gray-700">USD ($)</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'contact':
        return (
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <Mail className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black">Customer Support</h3>
                  <p className="text-gray-600">support@nastea.com</p>
                  <p className="text-gray-600">+91 9876543210</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
                <Button 
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={() => setContactModalOpen(true)}
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'security':
        return (
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-black mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" className="border-gray-200" />
                    <Input type="password" placeholder="New password" className="border-gray-200" />
                    <Input type="password" placeholder="Confirm new password" className="border-gray-200" />
                  </div>
                  <Button className="mt-3 bg-black text-white hover:bg-gray-800">
                    Update Password
                  </Button>
                </div>
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-black mb-3">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mb-3">Add an extra layer of security to your account</p>
                  <Button variant="outline" className="border-gray-300">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'address':
        return (
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <MapPin className="h-5 w-5" />
                Address Book
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-black">{address.label}</h3>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-medium">{address.firstName} {address.lastName}</p>
                        <p className="text-gray-600 text-sm">{address.phone}</p>
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">{address.country}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="border-gray-300">
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-green-300 text-green-600 hover:bg-green-50"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="bg-black text-white hover:bg-gray-800">
                  Add New Address
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'payment':
        return (
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {paymentMethods.map((payment) => (
                  <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-8 rounded flex items-center justify-center ${
                          payment.type === 'visa' ? 'bg-black' : 'bg-gray-800'
                        }`}>
                          <span className="text-white text-xs font-bold">
                            {payment.type === 'visa' ? 'VISA' : 'MC'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-black">•••• •••• •••• {payment.lastFour}</p>
                            {payment.isDefault && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">Expires {payment.expiryMonth}/{payment.expiryYear}</p>
                          <p className="text-gray-600 text-sm">{payment.holderName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="border-gray-300">
                          Edit
                        </Button>
                        {!payment.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-green-300 text-green-600 hover:bg-green-50"
                            onClick={() => handleSetDefaultPayment(payment.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="bg-black text-white hover:bg-gray-800">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'rewards':
        return (
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <Gift className="h-5 w-5" />
                Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black">2,450</h3>
                  <p className="text-gray-600">Reward Points</p>
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-black">Free Shipping Voucher</h3>
                    <p className="text-gray-600 text-sm">Valid on orders above ₹500</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-black font-medium">500 points</span>
                      <Button variant="outline" size="sm" className="border-gray-300">
                        Redeem
                      </Button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-black">10% Discount</h3>
                    <p className="text-gray-600 text-sm">On your next purchase</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-black font-medium">1,000 points</span>
                      <Button variant="outline" size="sm" className="border-gray-300">
                        Redeem
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="w-full py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 sm:mb-6">
          <span>Home</span>
          <span>/</span>
          <span className="text-black">Account</span>
        </div>

        {/* Mobile Header */}
        {isMobile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-black">My Account</h1>
                <p className="text-sm text-gray-600">Welcome back, {formData.email?.split('@')[0]}!</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden"
                >
                  {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Sidebar Overlay */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            ${isMobile ? 'fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out' : 'w-80 flex-shrink-0'}
            ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            ${isMobile ? 'shadow-lg' : ''}
          `}>
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 h-full">
              {/* Mobile Close Button */}
              {isMobile && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-black">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {!isMobile && (
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-black mb-2">My Account</h1>
                </div>
              )}
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="font-medium text-sm sm:text-base">{item.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white">
              {!isMobile && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-black mb-2">
                    Welcome back, {formData.email?.split('@')[0]}!
                  </h2>
                  <p className="text-gray-600">
                    Manage your account settings, view your orders, and update your preferences.
                  </p>
                </div>
              )}

              <div className="overflow-hidden">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactUsModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
      />

      <Footer />
    </div>
  );
};

export default Account;
