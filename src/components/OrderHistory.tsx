
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Package, Eye, RotateCcw, ShoppingCart } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      console.log('Fetching orders for user:', user.id);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          order_items (
            id,
            product_id,
            product_name,
            product_price,
            quantity
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Fetched orders with items:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load order history",
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      if (!order.order_items || order.order_items.length === 0) {
        toast({
          title: "Error",
          description: "No items found in this order to reorder",
          variant: "destructive"
        });
        return;
      }

      await clearCart();
      
      for (const item of order.order_items) {
        await addToCart({
          product_id: item.product_id,
          product_name: item.product_name,
          product_price: item.product_price,
          product_image: null,
          quantity: item.quantity
        });
      }
      
      toast({
        title: "Items added to cart",
        description: `${order.order_items.length} items from order #${formatOrderNumber(order.order_number)} added to cart`
      });

      navigate('/checkout');
    } catch (error) {
      console.error('Error reordering:', error);
      toast({
        title: "Error",
        description: "Failed to add items to cart",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-black text-lg sm:text-xl">
          <Package className="h-5 w-5" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No orders found</p>
            <Link to="/shop">
              <Button className="bg-black text-white hover:bg-gray-800">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = order.order_items?.length || 0;
              console.log(`Order ${order.id} has ${itemCount} items:`, order.order_items);
              
              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-sm sm:text-base">Order #{formatOrderNumber(order.order_number)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge className={`${getStatusColor(order.status)} border text-xs`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Images Section */}
                  {itemCount > 0 && (
                    <div className="mb-3">
                      <div className="flex gap-2 mb-2 overflow-x-auto">
                        {order.order_items.slice(0, 3).map((item, index) => (
                          <div key={`${item.id}-${index}`} className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <img 
                              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop"
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {itemCount > 3 && (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600 border border-gray-200 flex-shrink-0">
                            +{itemCount - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </p>
                    <p className="font-semibold text-black text-sm sm:text-base">₹{order.total_amount}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link to={`/orders/${order.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto border-black text-black hover:bg-gray-100 bg-white text-xs sm:text-sm">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReorder(order)}
                      className="w-full sm:w-auto border-black text-black hover:bg-gray-100 bg-white text-xs sm:text-sm"
                      disabled={itemCount === 0}
                    >
                      <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Reorder
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
