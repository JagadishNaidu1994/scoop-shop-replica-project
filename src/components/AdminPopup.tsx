
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, ShoppingCart, BookOpen, FileText } from 'lucide-react';

const AdminPopup = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      // Use RPC call to check admin status
      const { data, error } = await supabase.rpc('check_user_admin' as any, {
        user_id: user?.id
      });

      if (data && !error) {
        setIsAdmin(data);
        if (data) {
          // Show popup for 5 seconds when admin logs in
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 5000);
        }
      }
    } catch (error) {
      console.log('User is not an admin');
    }
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Access Detected
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Welcome, Admin! You have access to management features.
          </p>
          <div className="grid grid-cols-1 gap-2">
            <Link to="/admin/recipes">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Recipes
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/journals">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Manage Journals
              </Button>
            </Link>
          </div>
          <Button onClick={() => setShowPopup(false)} className="w-full">
            Continue to Site
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPopup;
