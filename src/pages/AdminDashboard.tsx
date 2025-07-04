
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Users, FileText, Settings, Eye, Truck, Edit } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (!loading && !adminLoading) {
      if (!user || !isAdmin) {
        navigate('/');
        return;
      }
      fetchOrders();
    }
  }, [user, isAdmin, loading, adminLoading, navigate]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive"
        });
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setOrdersLoading(false);
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
      case 'processed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';  
      case 'arriving':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'out for delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Order status updated successfully"
        });
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const integrateWithShiprocket = (order: any) => {
    // Shiprocket integration placeholder
    const shiprocketData = {
      order_id: order.order_number,
      order_date: order.created_at,
      pickup_location: "Primary",
      billing_customer_name: order.billing_address?.firstName || '',
      billing_last_name: order.billing_address?.lastName || '',
      billing_address: order.billing_address?.address || '',
      billing_city: order.billing_address?.city || '',
      billing_pincode: order.billing_address?.postalCode || '',
      billing_state: order.billing_address?.state || '',
      billing_country: order.billing_address?.country || '',
      billing_email: order.billing_address?.email || '',
      billing_phone: order.billing_address?.phone || '',
      shipping_is_billing: true,
      order_items: order.order_items?.map((item: any) => ({
        name: item.product_name,
        sku: `product_${item.product_id}`,
        units: item.quantity,
        selling_price: item.product_price
      })) || [],
      payment_method: "Prepaid",
      sub_total: order.total_amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    console.log('Shiprocket Integration Data:', shiprocketData);
    toast({
      title: "Shiprocket Integration",
      description: "Order data prepared for Shiprocket. Check console for details."
    });
  };

  const integrateWithDelhivery = (order: any) => {
    // Delhivery integration placeholder
    const delhiveryData = {
      shipments: [{
        name: `${order.shipping_address?.firstName || ''} ${order.shipping_address?.lastName || ''}`,
        add: order.shipping_address?.address || '',
        pin: order.shipping_address?.postalCode || '',
        city: order.shipping_address?.city || '',
        state: order.shipping_address?.state || '',
        country: order.shipping_address?.country || '',
        phone: order.shipping_address?.phone || '',
        order: order.order_number,
        payment_mode: order.payment_method === 'card' ? 'Prepaid' : 'COD',
        return_pin: '',
        return_city: '',
        return_phone: '',
        return_add: '',
        return_state: '',
        return_country: '',
        products_desc: order.order_items?.map((item: any) => item.product_name).join(', ') || '',
        hsn_code: '',
        cod_amount: order.payment_method === 'cod' ? order.total_amount : 0,
        order_date: order.created_at,
        total_amount: order.total_amount,
        seller_add: '',
        seller_name: 'DIRTEA',
        seller_inv: '',
        quantity: order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 1,
        waybill: '',
        shipment_width: 10,
        shipment_height: 10,
        weight: 500,
        seller_gst_tin: '',
        shipping_mode: 'Surface',
        address_type: 'home'
      }]
    };

    console.log('Delhivery Integration Data:', delhiveryData);
    toast({
      title: "Delhivery Integration",
      description: "Order data prepared for Delhivery. Check console for details."
    });
  };

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNavBar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage orders, users, and system settings</p>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  View and manage all customer orders and subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow 
                          key={order.id} 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleOrderClick(order)}
                        >
                          <TableCell className="font-mono">
                            #{formatOrderNumber(order.order_number)}
                          </TableCell>
                          <TableCell>
                            {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {order.order_items?.length || 0} items
                          </TableCell>
                          <TableCell className="font-semibold">
                            £{order.total_amount}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} border`}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderClick(order);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">User management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>
                  View sales reports and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Reports coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Settings coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Order #{formatOrderNumber(selectedOrder.order_number)}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Status Update */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'processed', 'shipped', 'arriving', 'out for delivery', 'delivered'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Shipping Integration */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Partner Integration
                </h3>
                <div className="flex gap-3">
                  <Button
                    onClick={() => integrateWithShiprocket(selectedOrder)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Send to Shiprocket
                  </Button>
                  <Button
                    onClick={() => integrateWithDelhivery(selectedOrder)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Send to Delhivery
                  </Button>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
                    <p><strong>Total Amount:</strong> £{selectedOrder.total_amount}</p>
                    <p><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)} border`}>
                        {selectedOrder.status}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shipping_address?.phone}</p>
                    <p><strong>Email:</strong> {selectedOrder.billing_address?.email}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.order_items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>£{item.product_price}</TableCell>
                          <TableCell>£{(item.product_price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{selectedOrder.shipping_address?.firstName} {selectedOrder.shipping_address?.lastName}</p>
                    <p>{selectedOrder.shipping_address?.phone}</p>
                    <p>{selectedOrder.shipping_address?.address}</p>
                    <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.postalCode}</p>
                    <p>{selectedOrder.shipping_address?.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Billing Address</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>{selectedOrder.billing_address?.firstName} {selectedOrder.billing_address?.lastName}</p>
                    <p>{selectedOrder.billing_address?.phone}</p>
                    <p>{selectedOrder.billing_address?.address}</p>
                    <p>{selectedOrder.billing_address?.city}, {selectedOrder.billing_address?.postalCode}</p>
                    <p>{selectedOrder.billing_address?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
