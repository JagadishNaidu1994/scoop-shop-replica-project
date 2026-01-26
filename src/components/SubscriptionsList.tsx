import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Package, Eye, Calendar, RefreshCw } from 'lucide-react';

interface SubscriptionOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  subscription_frequency: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface SubscriptionsListProps {
  preloadedOrders?: SubscriptionOrder[];
  preloadedProducts?: { [key: number]: any };
}

const SubscriptionsList: React.FC<SubscriptionsListProps> = ({
  preloadedOrders,
  preloadedProducts
}) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionOrder[]>(preloadedOrders || []);
  const [loading, setLoading] = useState(!preloadedOrders);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Update state when preloaded data changes
    if (preloadedOrders) {
      setSubscriptions(preloadedOrders);
      setLoading(false);
    }
  }, [preloadedOrders]);

  useEffect(() => {
    // Only fetch if we don't have preloaded data
    if (user && !preloadedOrders) {
      fetchSubscriptions();
    }
  }, [user, preloadedOrders]);

  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      console.log('Fetching subscriptions for user:', user.id);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          subscription_frequency,
          order_items (
            id,
            product_id,
            product_name,
            product_price,
            quantity
          )
        `)
        .eq('user_id', user.id)
        .eq('is_subscription', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }

      console.log('Fetched subscriptions:', data);
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatOrderNumber = (orderNumber: string) => {
    const match = orderNumber.match(/order_(\d+)/);
    if (match) {
      const timestamp = parseInt(match[1]);
      const incrementalId = (timestamp % 10000) + 1;
      return String(incrementalId).padStart(4, '0');
    }
    return orderNumber.slice(-4).padStart(4, '0');
  };

  const getProductImage = (productId: number) => {
    if (preloadedProducts && preloadedProducts[productId]?.primary_image) {
      return preloadedProducts[productId].primary_image;
    }
    const imageMap: { [key: number]: string } = {
      1: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop",
      2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
      3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    };
    return imageMap[productId] || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: { [key: string]: string } = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      biweekly: 'Bi-weekly',
      quarterly: 'Quarterly'
    };
    return labels[frequency] || frequency;
  };

  const handleViewOrder = (subscription: SubscriptionOrder) => {
    navigate(`/orders/${subscription.id}`);
  };

  if (loading) {
    return (
      <Card className="border-gray-200 bg-white rounded-2xl shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 bg-gray-200 rounded-xl w-32"></div>
                  <div className="h-6 bg-gray-200 rounded-xl w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded-xl w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-xl w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {subscriptions.length === 0 ? (
        <Card className="border-gray-200 bg-white rounded-2xl shadow-sm">
          <CardContent className="p-8">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No active subscriptions</p>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to products and save 20% on every order
              </p>
              <Button
                onClick={() => navigate('/shop')}
                className="bg-black text-white hover:bg-gray-800 rounded-full"
              >
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="border border-gray-200 bg-white shadow-sm rounded-2xl">
              {/* Subscription Header - Clickable */}
              <div
                className="border-b border-gray-200 p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-2xl"
                onClick={() => handleViewOrder(subscription)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-purple-100 text-purple-800 rounded-full">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Subscription
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 rounded-full">
                          {getFrequencyLabel(subscription.subscription_frequency)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Order number</p>
                      <p className="font-medium text-gray-900">SUB{formatOrderNumber(subscription.order_number)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date started</p>
                      <p className="font-medium text-gray-900">
                        {new Date(subscription.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total amount</p>
                      <p className="font-medium text-gray-900">₹{subscription.total_amount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
                      onClick={() => handleViewOrder(subscription)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Subscription Items */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-b-2xl"
                onClick={() => handleViewOrder(subscription)}
              >
                <div className="space-y-6">
                  {subscription.order_items && subscription.order_items.length > 0 ? (
                    subscription.order_items.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={getProductImage(item.product_id)}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-xl border border-gray-200"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900 text-lg">{item.product_name}</h3>
                            <p className="font-semibold text-gray-900 text-lg">₹{item.product_price}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Calendar className="h-4 w-4" />
                            <span>Next delivery: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No items found for this subscription</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsList;
