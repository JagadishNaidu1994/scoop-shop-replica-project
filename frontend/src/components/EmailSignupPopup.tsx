
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailSignupPopupProps {
  onClose: () => void;
}

const EmailSignupPopup = ({ onClose }: EmailSignupPopupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('email_signups')
        .insert([{ email: email.trim() }]);

      if (error) {
        // If email already exists, show a friendly message
        if (error.code === '23505') {
          toast({
            title: "Already subscribed!",
            description: "You're already on our list. Thanks for your interest!",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've been subscribed! Check your email for your free shipping offer.",
        });
      }
      onClose();
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">
            Get FREE Shipping! 🚚
          </h2>
          <p className="text-gray-600">
            Join thousands of wellness enthusiasts and get free shipping on your first order, plus exclusive recipes and wellness tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {isSubmitting ? 'Signing up...' : 'Get My Free Shipping'}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          By signing up, you agree to receive marketing emails. You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default EmailSignupPopup;
