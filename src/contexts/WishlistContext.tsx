
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  product_image: string | null;
  created_at: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (product: Omit<WishlistItem, 'id' | 'created_at'>) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  getTotalItems: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Omit<WishlistItem, 'id' | 'created_at'>) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if item already exists in wishlist
      const existingItem = items.find(item => item.product_id === product.product_id);

      if (existingItem) {
        toast({
          title: "Already in wishlist",
          description: `${product.product_name} is already in your wishlist`
        });
        return;
      }

      const { data, error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          ...product
        })
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [data, ...prev]);

      toast({
        title: "Added to wishlist",
        description: `${product.product_name} has been added to your wishlist`
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive"
      });
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', user.id);

      if (error) throw error;

      const removedItem = items.find(item => item.product_id === productId);
      setItems(prev => prev.filter(item => item.product_id !== productId));

      toast({
        title: "Removed from wishlist",
        description: `${removedItem?.product_name || 'Item'} has been removed from your wishlist`
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      });
    }
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.product_id === productId);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const value = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getTotalItems
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
