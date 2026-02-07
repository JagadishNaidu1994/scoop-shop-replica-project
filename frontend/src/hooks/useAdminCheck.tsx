
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setLoading(false);
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
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.log('User is not an admin');
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, loading };
};
