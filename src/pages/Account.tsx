import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight } from 'lucide-react';

const Account = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    full_name: '',
    first_name: '',
    email: ''
  });
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile({
        full_name: data.full_name || '',
        first_name: data.first_name || '',
        email: data.email || user.email || ''
      });
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
  };

  const formatOrderNumber = (orderNumber: string) => {
    // Extract timestamp from order number and convert to incremental format
    const match = orderNumber.match(/order_(\d+)/);
    if (match) {
      const timestamp = parseInt(match[1]);
      // Convert timestamp to simple incremental number starting from 0001
      const incrementalId = (timestamp % 10000) + 1;
      return String(incrementalId).padStart(4, '0');
    }
    // Fallback: use last 4 characters of order number
    return orderNumber.slice(-4).padStart(4, '0');
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        first_name: profile.first_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    }
    setUpdating(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const tabContent = {
    profile: (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-black">Personal Information</h2>
        
        <form onSubmit={updateProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first_name" className="text-black font-medium">
                First Name
              </Label>
              <Input
                id="first_name"
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="full_name" className="text-black font-medium">
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-black font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="mt-1 bg-gray-50"
            />
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed from this page
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Button
                type="submit"
                disabled={updating}
                className="bg-black text-white hover:bg-gray-800"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
              
              <Button
                type="button"
                variant="destructive"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </form>
      </div>
    ),
    orders: (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-black">Order History</h2>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No orders found</p>
            <Button onClick={() => navigate('/shop')} className="bg-black text-white hover:bg-gray-800">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div 
                key={order.id} 
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                onClick={() => handleOrderClick(order.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold group-hover:text-gray-700">Order #{formatOrderNumber(order.order_number)}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex items-center">
                    <div>
                      <p className="font-semibold">£{order.total_amount}</p>
                      <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-2 group-hover:text-gray-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  {order.order_items?.slice(0, 2).map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span>£{(item.product_price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.order_items?.length > 2 && (
                    <p className="text-sm text-gray-500">+{order.order_items.length - 2} more items</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    addresses: (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-black">Addresses</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Address management coming soon</p>
          <Button className="bg-black text-white hover:bg-gray-800">
            Add Address
          </Button>
        </div>
      </div>
    ),
    subscription: (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-black">Subscription</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No active subscriptions</p>
          <Button className="bg-black text-white hover:bg-gray-800">
            Start Subscription
          </Button>
        </div>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'profile' ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'
                }`}
              >
                Account Details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'orders' ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'
                }`}
              >
                Order History
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'addresses' ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'
                }`}
              >
                Addresses
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'subscription' ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'
                }`}
              >
                Subscription
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {tabContent[activeTab as keyof typeof tabContent]}
            
            {activeTab === 'profile' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-black mb-4">Account Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-black">{orders.length}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-black">0</div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-black">
                      £{orders.reduce((total: number, order: any) => total + order.total_amount, 0).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-black">0</div>
                    <div className="text-sm text-gray-600">Rewards Points</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
