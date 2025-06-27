
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

const Account = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    full_name: '',
    email: ''
  });
  const [updating, setUpdating] = useState(false);

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
        email: data.email || user.email || ''
      });
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
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

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">My Account</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                <div className="bg-gray-50 px-4 py-3 rounded-lg">
                  <h3 className="font-medium text-black">Account Details</h3>
                </div>
                <div className="px-4 py-2 text-gray-600">
                  Order History
                </div>
                <div className="px-4 py-2 text-gray-600">
                  Addresses
                </div>
                <div className="px-4 py-2 text-gray-600">
                  Payment Methods
                </div>
                <div className="px-4 py-2 text-gray-600">
                  Subscription
                </div>
                <div className="px-4 py-2 text-gray-600">
                  Preferences
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 text-black">Personal Information</h2>
                
                <form onSubmit={updateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-black mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-black">0</div>
                      <div className="text-sm text-gray-600">Orders</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-black">0</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-black">£0</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-black">0</div>
                      <div className="text-sm text-gray-600">Rewards Points</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
