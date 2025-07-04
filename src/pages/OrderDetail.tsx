
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && id) {
      fetchOrderDetails();
    }
  }, [user, id]);

  const fetchOrderDetails = async () => {
    if (!user || !id) return;

    setOrderLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive"
      });
      navigate('/account');
    } else {
      setOrder(data);
    }
    setOrderLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
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

  if (loading || orderLoading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/account')} className="bg-black text-white hover:bg-gray-800">
              Back to Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/account')}
            className="text-black hover:bg-gray-100 px-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Button>
        </div>

        {/* Order Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black">Order #{order.order_number}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-lg">£{order.total_amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium capitalize">{order.payment_method || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-medium text-black">{item.product_name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Unit Price: £{item.product_price}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">£{(item.product_price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Total */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-black">Total</span>
              <span className="text-xl font-bold text-black">£{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p>{order.shipping_address.name}</p>
              <p>{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
              <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>
        )}

        {/* Billing Address */}
        {order.billing_address && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Billing Address</h2>
            <div className="text-gray-700">
              <p>{order.billing_address.name}</p>
              <p>{order.billing_address.address_line_1}</p>
              {order.billing_address.address_line_2 && <p>{order.billing_address.address_line_2}</p>}
              <p>{order.billing_address.city}, {order.billing_address.postal_code}</p>
              <p>{order.billing_address.country}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-black text-white hover:bg-gray-800">
            Download Invoice
          </Button>
          <Button variant="outline" className="border-black text-black hover:bg-gray-100">
            Contact Support
          </Button>
          <Link to="/shop">
            <Button variant="outline" className="w-full sm:w-auto border-black text-black hover:bg-gray-100">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetail;
