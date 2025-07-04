
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
      console.log('Order data:', data);
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

  const downloadInvoice = () => {
    if (!order) return;

    // Create invoice HTML content
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - Order #${formatOrderNumber(order.order_number)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .company-name { font-size: 28px; font-weight: bold; color: #000; }
          .invoice-title { font-size: 24px; margin: 20px 0; }
          .order-info { display: flex; justify-content: space-between; margin: 30px 0; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-row { font-weight: bold; font-size: 16px; }
          .address { margin: 10px 0; }
          .footer { margin-top: 50px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">DIRTEA</div>
          <div class="invoice-title">INVOICE</div>
        </div>
        
        <div class="order-info">
          <div>
            <strong>Invoice #:</strong> ${formatOrderNumber(order.order_number)}<br>
            <strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-GB')}<br>
            <strong>Status:</strong> ${order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </div>
          <div>
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Payment Method:</strong> ${order.payment_method || 'Card'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Bill To:</div>
          <div class="address">
            ${order.billing_address ? `
              ${order.billing_address.name || ''}<br>
              ${order.billing_address.phone ? order.billing_address.phone + '<br>' : ''}
              ${order.billing_address.address_line_1 || ''}<br>
              ${order.billing_address.address_line_2 ? order.billing_address.address_line_2 + '<br>' : ''}
              ${order.billing_address.city || ''}, ${order.billing_address.postal_code || ''}<br>
              ${order.billing_address.country || ''}
            ` : 'No billing address provided'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Ship To:</div>
          <div class="address">
            ${order.shipping_address ? `
              ${order.shipping_address.name || ''}<br>
              ${order.shipping_address.phone ? order.shipping_address.phone + '<br>' : ''}
              ${order.shipping_address.address_line_1 || ''}<br>
              ${order.shipping_address.address_line_2 ? order.shipping_address.address_line_2 + '<br>' : ''}
              ${order.shipping_address.city || ''}, ${order.shipping_address.postal_code || ''}<br>
              ${order.shipping_address.country || ''}
            ` : 'No shipping address provided'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items?.map((item: any) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>£${item.product_price}</td>
                  <td>£${(item.product_price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('') || ''}
              <tr class="total-row">
                <td colspan="3">Total Amount</td>
                <td>£${order.total_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>For any questions regarding this invoice, please contact our support team.</p>
        </div>
      </body>
      </html>
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${formatOrderNumber(order.order_number)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Invoice downloaded successfully"
    });
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
              <h1 className="text-2xl font-bold text-black">Order #{formatOrderNumber(order.order_number)}</h1>
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
              <p className="font-medium capitalize">{order.payment_method || 'Card'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium text-xs text-gray-500">{order.id}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Order Items</h2>
          {order.order_items && order.order_items.length > 0 ? (
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop"
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/products/${item.product_id}`}
                      className="font-medium text-black hover:text-gray-700 transition-colors block"
                    >
                      {item.product_name}
                    </Link>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span>Unit Price: £{item.product_price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">£{(item.product_price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No items found for this order</p>
            </div>
          )}
          
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
              {order.shipping_address.name && <p className="font-medium">{order.shipping_address.name}</p>}
              {order.shipping_address.phone && <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>}
              {order.shipping_address.address_line_1 && <p>{order.shipping_address.address_line_1}</p>}
              {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
              <p>
                {order.shipping_address.city && order.shipping_address.city}
                {order.shipping_address.postal_code && `, ${order.shipping_address.postal_code}`}
              </p>
              {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
            </div>
          </div>
        )}

        {/* Billing Address */}
        {order.billing_address && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Billing Address</h2>
            <div className="text-gray-700">
              {order.billing_address.name && <p className="font-medium">{order.billing_address.name}</p>}
              {order.billing_address.phone && <p className="text-sm text-gray-600">{order.billing_address.phone}</p>}
              {order.billing_address.address_line_1 && <p>{order.billing_address.address_line_1}</p>}
              {order.billing_address.address_line_2 && <p>{order.billing_address.address_line_2}</p>}
              <p>
                {order.billing_address.city && order.billing_address.city}
                {order.billing_address.postal_code && `, ${order.billing_address.postal_code}`}
              </p>
              {order.billing_address.country && <p>{order.billing_address.country}</p>}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={downloadInvoice}
            className="bg-black text-white hover:bg-gray-800"
          >
            Download Invoice
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/contact')}
            className="border-black text-black hover:bg-gray-100"
          >
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
