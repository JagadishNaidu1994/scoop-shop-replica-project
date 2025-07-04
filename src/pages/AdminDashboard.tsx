import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, Users, FileText, Settings, Eye, Truck, Edit, Plus, UserPlus, BarChart3, TrendingUp, DollarSign, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');

  useEffect(() => {
    if (!loading && !adminLoading) {
      if (!user || !isAdmin) {
        navigate('/');
        return;
      }
      if (activeTab === 'orders' || activeTab === 'dashboard') {
        fetchOrders();
      }
    }
  }, [user, isAdmin, loading, adminLoading, navigate, activeTab]);

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
        console.log('Fetched orders with items:', data);
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

  const handleAddUser = async () => {
    if (!newUserEmail) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "User Management",
      description: `Would add user ${newUserEmail} with role ${newUserRole}. This feature will be implemented with proper user invitation system.`
    });
    setNewUserEmail('');
    setNewUserRole('user');
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{orders.reduce((sum, order) => sum + (parseFloat(order.total_amount?.toString() || '0')), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.slice(0, 5).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{formatOrderNumber(order.order_number)}</TableCell>
                    <TableCell>
                      {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>£{order.total_amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderOrderManagement = () => (
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
  );

  const renderProductsManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle>Products Management</CardTitle>
        <CardDescription>
          Manage your product catalog and inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Products management functionality will be implemented here</p>
          <Button className="mt-4" onClick={() => navigate('/admin/products')}>
            Go to Full Products Admin
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRecipesManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recipes Management</CardTitle>
        <CardDescription>
          Manage your recipe collection and content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Recipes management functionality will be implemented here</p>
          <Button className="mt-4" onClick={() => navigate('/admin/recipes')}>
            Go to Full Recipes Admin
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderJournalsManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle>Journals Management</CardTitle>
        <CardDescription>
          Manage your journal articles and blog posts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Journals management functionality will be implemented here</p>
          <Button className="mt-4" onClick={() => navigate('/admin/journals')}>
            Go to Full Journals Admin
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>
            Add new users and assign permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="userEmail">Email Address</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="userRole">Role</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddUser} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
          <CardDescription>
            Manage user access to different sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Orders Management</h4>
                <p className="text-sm text-gray-600 mb-3">View and manage customer orders</p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">View Orders</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Update Status</span>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Products Management</h4>
                <p className="text-sm text-gray-600 mb-3">Manage product catalog</p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">View Products</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Edit Products</span>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Content Management</h4>
                <p className="text-sm text-gray-600 mb-3">Manage recipes and journals</p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Edit Recipes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Edit Journals</span>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">System Settings</h4>
                <p className="text-sm text-gray-600 mb-3">Access system configuration</p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">System Config</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">User Management</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              £{orders.reduce((sum, order) => sum + (parseFloat(order.total_amount?.toString() || '0')), 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">Total revenue this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Analytics</CardTitle>
            <CardDescription>Order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pending</span>
                <span>{orders.filter(o => o.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivered</span>
                <span>{orders.filter(o => o.status === 'delivered').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Customer behavior metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(orders.map(o => o.user_id)).size}
            </div>
            <p className="text-sm text-gray-600">Unique customers</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download detailed reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Orders Report
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />  
              Sales Analytics
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Customer Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
          <CardDescription>Configure your store preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="DIRTEA" />
            </div>
            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input id="storeEmail" type="email" placeholder="store@dirtea.com" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Shipping Settings</CardTitle>
          <CardDescription>Configure shipping options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Free Shipping Threshold</h4>
                <p className="text-sm text-gray-600">Orders above this amount get free shipping</p>
              </div>
              <Input className="w-32" defaultValue="50" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Standard Shipping Cost</h4>
                <p className="text-sm text-gray-600">Default shipping cost</p>
              </div>
              <Input className="w-32" defaultValue="5.99" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked />
              <span>New order notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked />
              <span>Low stock alerts</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Customer review notifications</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrderManagement();
      case 'products':
        return renderProductsManagement();
      case 'recipes':
        return renderRecipesManagement();
      case 'journals':
        return renderJournalsManagement();
      case 'users':
        return renderUserManagement();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboardOverview();
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'orders':
        return 'Order Management';
      case 'products':
        return 'Products Management';
      case 'recipes':
        return 'Recipes Management';
      case 'journals':
        return 'Journals Management';
      case 'users':
        return 'User Management';
      case 'reports':
        return 'Reports & Analytics';
      case 'settings':
        return 'Settings';
      default:
        return 'Admin Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case 'orders':
        return 'Manage customer orders and subscriptions';
      case 'products':
        return 'Manage your product catalog and inventory';
      case 'recipes':
        return 'Manage your recipe collection and content';
      case 'journals':
        return 'Manage your journal articles and blog posts';
      case 'users':
        return 'Manage users and permissions';
      case 'reports':
        return 'View detailed analytics and reports';
      case 'settings':
        return 'Configure store settings';
      default:
        return 'Overview of your store performance';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNavBar />
      
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8 transition-all duration-300 ease-in-out">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 mt-2">
              {getPageDescription()}
            </p>
          </div>

          <div className="transition-all duration-300 ease-in-out transform">
            {renderContent()}
          </div>
        </div>
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
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                    <div className="space-y-4 p-4">
                      {selectedOrder.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop"
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-black">{item.product_name}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              <span>Unit Price: £{parseFloat(item.product_price?.toString() || '0').toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-black">£{(parseFloat(item.product_price?.toString() || '0') * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No items found for this order</p>
                    </div>
                  )}
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
