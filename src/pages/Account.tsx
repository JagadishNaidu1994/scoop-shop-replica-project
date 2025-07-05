
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import OrderHistory from '@/components/OrderHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  Bell
} from 'lucide-react';

const Account = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    first_name: '',
    email: ''
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
          email: data.email || user.email || ''
        });
      } else {
        setFormData({
          full_name: '',
          first_name: '',
          email: user.email || ''
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
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-black font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    className="mt-2 bg-gray-50 border-gray-200"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="first_name" className="text-black font-medium">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="mt-2 border-gray-200"
                  />
                </div>

                <div>
                  <Label htmlFor="full_name" className="text-black font-medium">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="mt-2 border-gray-200"
                  />
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
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-black">
                <Bell className="h-5 w-5" />
                Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black">Monthly Tea Subscription</h3>
                  <p className="text-gray-600 text-sm">Premium matcha blend delivered monthly</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-black font-medium">₹2,499/month</span>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Manage
                    </Button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-black">Newsletter</h3>
                  <p className="text-gray-600 text-sm">Weekly updates on new products and recipes</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-600 font-medium">Active</span>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Unsubscribe
                    </Button>
                  </div>
                </div>
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
                <Button className="bg-black text-white hover:bg-gray-800">
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
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-black">Home</h3>
                      <p className="text-gray-600">123 Tea Street, Mumbai, Maharashtra 400001</p>
                      <p className="text-gray-600">India</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-black">Office</h3>
                      <p className="text-gray-600">456 Business Park, Bangalore, Karnataka 560001</p>
                      <p className="text-gray-600">India</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Edit
                    </Button>
                  </div>
                </div>
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
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-black rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">•••• •••• •••• 1234</p>
                        <p className="text-gray-600 text-sm">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">MC</span>
                      </div>
                      <div>
                        <p className="font-semibold text-black">•••• •••• •••• 5678</p>
                        <p className="text-gray-600 text-sm">Expires 08/26</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Remove
                    </Button>
                  </div>
                </div>
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
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span>Home</span>
          <span>/</span>
          <span className="text-black">Account</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-black mb-2">My Account</h1>
              </div>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black mb-2">
                  Welcome back, {formData.email}!
                </h2>
                <p className="text-gray-600">
                  Manage your account settings, view your orders, and update your preferences.
                </p>
              </div>

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
