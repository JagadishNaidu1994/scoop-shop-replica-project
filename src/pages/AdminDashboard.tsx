import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Users, FileText, TrendingUp, Eye, Edit, Trash2, Plus, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const { toast } = useToast();

  // State for different sections
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders with order items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (!ordersError && ordersData) {
        console.log('Fetched orders with items:', ordersData);
        setOrders(ordersData);
        
        // Calculate stats - ensure we're working with numbers
        const totalRevenue = ordersData.reduce((sum, order) => {
          const amount = typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount;
          return sum + (amount || 0);
        }, 0);
        const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.length,
          totalRevenue,
          pendingOrders
        }));
      }

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersCount) {
        setStats(prev => ({ ...prev, totalUsers: usersCount }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      toast({
        title: "Success",
        description: "Order status updated successfully"
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">Order #{formatOrderNumber(order.order_number)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()} • £{typeof order.total_amount === 'string' ? parseFloat(order.total_amount).toFixed(2) : order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Items: {order.order_items?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage all customer orders and subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Order #</th>
                    <th className="text-left p-2">Customer</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Items</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-2">#{formatOrderNumber(order.order_number)}</td>
                      <td className="p-2">
                        {order.shipping_address?.name || order.billing_address?.name || 'N/A'}
                      </td>
                      <td className="p-2">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-2">{order.order_items?.length || 0} items</td>
                      <td className="p-2">£{typeof order.total_amount === 'string' ? parseFloat(order.total_amount).toFixed(2) : order.total_amount.toFixed(2)}</td>
                      <td className="p-2">
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and their permissions</CardDescription>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Permission Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Products Admin</h4>
                  <p className="text-sm text-gray-600">Manage product catalog, inventory, and pricing</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recipe Admin</h4>
                  <p className="text-sm text-gray-600">Create and edit recipes, nutritional content</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Journal Admin</h4>
                  <p className="text-sm text-gray-600">Publish and manage journal articles</p>
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">User management interface coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports & Analytics</CardTitle>
          <CardDescription>View detailed business analytics and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Sales Reports</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Daily Revenue</span>
                  <span className="font-medium">£{(stats.totalRevenue / 30).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Weekly Revenue</span>
                  <span className="font-medium">£{(stats.totalRevenue / 4).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Monthly Revenue</span>
                  <span className="font-medium">£{stats.totalRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Order Analytics</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Average Order Value</span>
                  <span className="font-medium">£{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Pending Orders</span>
                  <span className="font-medium">{stats.pendingOrders}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Completed Orders</span>
                  <span className="font-medium">{stats.totalOrders - stats.pendingOrders}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Manage application settings and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Store Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store Name</label>
                  <input 
                    type="text" 
                    value="NASTEA" 
                    className="w-full p-2 border rounded-md" 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Currency</label>
                  <input 
                    type="text" 
                    value="GBP (£)" 
                    className="w-full p-2 border rounded-md" 
                    disabled 
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Order Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span>Auto-confirm orders</span>
                  <button className="bg-black text-white px-4 py-1 rounded text-sm">Enabled</button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Email notifications</span>
                  <button className="bg-black text-white px-4 py-1 rounded text-sm">Enabled</button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Inventory tracking</span>
                  <button className="bg-black text-white px-4 py-1 rounded text-sm">Enabled</button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'reports' && 'Reports & Analytics'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>

          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Order #{formatOrderNumber(selectedOrder.order_number)}</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Update Order Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Processed', 'Shipped', 'Arriving', 'Out For Delivery', 'Delivered'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status?.toLowerCase() === status.toLowerCase() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, status.toLowerCase())}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Shipping Partner Integration */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Shipping Partner Integration
                </h3>
                <div className="flex gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Send to Shiprocket
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Send to Delivery
                  </Button>
                </div>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</div>
                    <div><strong>Payment Method:</strong> {selectedOrder.payment_method || 'card'}</div>
                    <div><strong>Total Amount:</strong> £{typeof selectedOrder.total_amount === 'string' ? parseFloat(selectedOrder.total_amount).toFixed(2) : selectedOrder.total_amount.toFixed(2)}</div>
                    <div><strong>Status:</strong> <Badge className={getStatusBadgeColor(selectedOrder.status)}>{selectedOrder.status}</Badge></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedOrder.shipping_address?.name || selectedOrder.billing_address?.name}</div>
                    <div><strong>Phone:</strong> {selectedOrder.shipping_address?.phone || selectedOrder.billing_address?.phone || 'N/A'}</div>
                    <div><strong>Email:</strong> {selectedOrder.billing_address?.email || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="border rounded-lg">
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                    <div className="divide-y">
                      {selectedOrder.order_items.map((item: any) => (
                        <div key={item.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img 
                              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop"
                              alt={item.product_name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">£{(typeof item.product_price === 'string' ? parseFloat(item.product_price) : item.product_price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-600">£{typeof item.product_price === 'string' ? parseFloat(item.product_price).toFixed(2) : item.product_price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p>No items found for this order</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedOrder.shipping_address && (
                  <div>
                    <h3 className="font-medium mb-3">Shipping Address</h3>
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.shipping_address.name}</p>
                      <p>{selectedOrder.shipping_address.address_line_1}</p>
                      {selectedOrder.shipping_address.address_line_2 && <p>{selectedOrder.shipping_address.address_line_2}</p>}
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postal_code}</p>
                      <p>{selectedOrder.shipping_address.country}</p>
                    </div>
                  </div>
                )}

                {selectedOrder.billing_address && (
                  <div>
                    <h3 className="font-medium mb-3">Billing Address</h3>
                    <div className="text-sm space-y-1">
                      <p>{selectedOrder.billing_address.name}</p>
                      <p>{selectedOrder.billing_address.address_line_1}</p>
                      {selectedOrder.billing_address.address_line_2 && <p>{selectedOrder.billing_address.address_line_2}</p>}
                      <p>{selectedOrder.billing_address.city}, {selectedOrder.billing_address.postal_code}</p>
                      <p>{selectedOrder.billing_address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
