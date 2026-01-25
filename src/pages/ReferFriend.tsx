
import React, { useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Copy, Share2, Gift, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ReferFriend = () => {
  const [referralLink, setReferralLink] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const generateReferralLink = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to generate a referral link",
        variant: "destructive"
      });
      return;
    }
    
    const link = `${window.location.origin}?ref=${user.id}`;
    setReferralLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard"
    });
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join DIRTEA with my referral link',
        text: 'Get amazing functional mushroom products with my referral link!',
        url: referralLink
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Refer a Friend & Get Rewarded
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Share the wellness journey with your friends and both of you get amazing rewards!
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Share Your Link</h3>
              <p className="text-gray-600">Generate your unique referral link and share it with friends and family.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. Friend Signs Up</h3>
              <p className="text-gray-600">Your friend creates an account using your referral link.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Both Get Rewards</h3>
              <p className="text-gray-600">When they place their first order, you both receive amazing rewards!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Referral Rewards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-600 mb-4">For Your Friend</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">₹150 OFF</div>
              <p className="text-gray-600">Coupon on their first order</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">For You</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">100 Points</div>
              <p className="text-gray-600">Added to your reward points</p>
            </div>
          </div>
        </div>
      </section>

      {/* Generate Link Section */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Generate Your Referral Link</h2>
          
          {!referralLink ? (
            <button
              onClick={generateReferralLink}
              className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Generate My Referral Link
            </button>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <p className="text-sm text-gray-600 mb-2">Your Referral Link:</p>
                <p className="font-mono text-sm break-all text-gray-800">{referralLink}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors"
                >
                  <Copy size={20} />
                  <span>Copy Link</span>
                </button>
                
                <button
                  onClick={shareLink}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  <Share2 size={20} />
                  <span>Share Link</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReferFriend;
