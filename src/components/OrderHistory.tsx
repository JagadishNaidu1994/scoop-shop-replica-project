
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Package, Eye, RotateCcw, ShoppingCart, CheckCircle, Download } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  delivered_at?: string;
  order_items: OrderItem[];
}

interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  primary_image: string;
  benefits: string[];
  description: string;
}

interface OrderHistoryProps {
  onViewOrder?: (order: Order) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ onViewOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<{ [key: number]: Product }>({});
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
          delivered_at,
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
      
      // Fetch product details for all unique product IDs
      const productIds = [...new Set(data?.flatMap(order => 
        order.order_items?.map(item => item.product_id) || []
      ) || [])];
      
      if (productIds.length > 0) {
        await fetchProductDetails(productIds);
      }
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

  const fetchProductDetails = async (productIds: number[]) => {
    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('id, name, primary_image, benefits, description')
        .in('id', productIds);

      if (error) {
        console.error('Error fetching product details:', error);
        return;
      }

      const productsMap = productsData?.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as { [key: number]: Product }) || {};

      setProducts(productsMap);
    } catch (error) {
      console.error('Error fetching product details:', error);
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
    const product = products[productId];
    if (product && product.primary_image) {
      return product.primary_image;
    }
    // Fallback images
    const imageMap: { [key: number]: string } = {
      1: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop",
      2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
      3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    };
    return imageMap[productId] || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";
  };

  const getProductName = (item: OrderItem) => {
    const product = products[item.product_id];
    return product ? product.name : item.product_name;
  };

  const getProductDescription = (productId: number) => {
    const product = products[productId];
    if (product) {
      // Use benefits if available, otherwise use description
      if (product.benefits && product.benefits.length > 0) {
        return product.benefits.join(', ');
      }
      return product.description || "Premium quality product designed for your everyday needs with excellent durability and style.";
    }
    
    // Fallback descriptions
    const descriptions: { [key: string]: string } = {
      "Micro Backpack": "Are you a minimalist looking for a compact carry option? The Micro Backpack is the perfect size for your essential everyday carry items. Wear it like a backpack or carry it like a satchel for all-day use.",
      "Nomad Shopping Tote": "This durable shopping tote is perfect for the world traveler. Its yellow canvas construction is water, fray, tear resistant. The matching handle, backpack straps, and shoulder loops provide multiple carry options for a day out on your next adventure.",
      "Double Stack Clothing Bag": "Save space and protect your favorite clothes in this double-layer garment bag. Each compartment easily holds multiple pairs of jeans or tops, while keeping your items neatly folded throughout your trip."
    };
    return descriptions[productId] || "Premium quality product designed for your everyday needs with excellent durability and style.";
  };

  const handleViewOrder = (order: Order) => {
    if (onViewOrder) {
      onViewOrder(order);
    } else {
      navigate(`/orders/${order.id}`);
    }
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleViewInvoice = (order: Order) => {
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
          .footer { margin-top: 50px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-nameNASTEA RITUALS</div>
          <div class="invoice-title">INVOICE</div>
        </div>
        
        <div class="order-info">
          <div>
            <strong>Invoice #:</strong> ${formatOrderNumber(order.order_number)}<br>
            <strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}<br>
            <strong>Status:</strong> ${order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
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
                  <td>${getProductName(item)}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.product_price}</td>
                  <td>₹${(item.product_price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('') || ''}
              <tr class="total-row">
                <td colspan="3">Total Amount</td>
                <td>₹${order.total_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

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
          product_name: getProductName(item),
          product_price: item.product_price,
          product_image: getProductImage(item.product_id),
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
      {orders.length === 0 ? (
        <Card className="border-gray-200 bg-white rounded-2xl shadow-sm">
          <CardContent className="p-8">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No orders found</p>
              <Link to="/shop">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border border-gray-200 bg-white shadow-sm rounded-2xl">
              {/* Order Header - Clickable */}
              <div 
                className="border-b border-gray-200 p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-2xl"
                onClick={() => handleViewOrder(order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order number</p>
                      <p className="font-medium text-gray-900">WU{formatOrderNumber(order.order_number)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date placed</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total amount</p>
                      <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Order
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
                      onClick={() => handleViewInvoice(order)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      View Invoice
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Items - Clickable */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-b-2xl"
                onClick={() => handleViewOrder(order)}
              >
                <div className="space-y-6">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img 
                            src={getProductImage(item.product_id)}
                            alt={getProductName(item)}
                            className="w-full h-full object-cover rounded-xl border border-gray-200"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900 text-lg">{getProductName(item)}</h3>
                            <p className="font-semibold text-gray-900 text-lg">₹{item.product_price}</p>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {getProductDescription(item.product_id)}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">Qty: {item.quantity}</p>
                          
                          {/* Delivery Status */}
                          {order.status === 'delivered' && (
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">
                                Delivered on {order.delivered_at ? 
                                  new Date(order.delivered_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  }) : 
                                  new Date(order.created_at).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                }
                              </span>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
                              onClick={() => handleViewProduct(item.product_id)}
                            >
                              View product
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReorder(order)}
                              className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full"
                            >
                              Buy again
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No items found for this order</p>
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

export default OrderHistory;
