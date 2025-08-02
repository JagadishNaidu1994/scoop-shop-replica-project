import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import AdminSidebar from '@/components/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import UsersTab from '@/components/admin/UsersTab';
import ExpensesTab from '@/components/admin/ExpensesTab';
import ProductsAdmin from '@/components/admin/ProductsAdmin';
import RecipesAdmin from '@/components/admin/RecipesAdmin';
import JournalsAdmin from '@/components/admin/JournalsAdmin';
import ReviewsTab from '@/components/admin/ReviewsTab';
import ContentTab from '@/components/admin/ContentTab';
import ContactSubmissionsTab from '@/components/admin/ContactSubmissionsTab';
import OrderDetailsDialog from '@/components/admin/OrderDetailsDialog';
import MessagesSection from '@/components/admin/MessagesSection';
import NotificationDropdown from '@/components/admin/NotificationDropdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Plus, Edit, Trash2, Package, Users, ShoppingCart, DollarSign, TrendingUp, Calendar, Settings, Bell } from 'lucide-react';
import Papa from 'papaparse';

// Updated interfaces to match database schema with all required properties
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  in_stock: boolean | null;
  is_active: boolean | null;
  primary_image: string | null;
  hover_image: string | null;
  benefits: string[] | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  shipping_address: any;
  billing_address: any;
  created_at: string;
  updated_at: string;
  shipping_method_id: string | null;
  shipping_cost: number | null;
  shipped_at: string | null;
  delivered_at: string | null;
  estimated_delivery_date: string | null;
  payment_method: string | null;
  tracking_number: string | null;
  order_number: string;
  status: string | null;
}

interface Journal {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string | null;
  category: string | null;
  read_time: string | null;
  image_url: string | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  published: boolean;
}

interface CouponCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string | null;
  base_rate: number;
  estimated_days: string | null;
  is_active: boolean | null;
  created_at: string;
  price: number;
}

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdminCheck();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get current tab from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'dashboard';

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Stats for dashboard overview
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(), 
        fetchJournals(),
        fetchUsers(),
        fetchShippingMethods()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          category,
          in_stock,
          is_active,
          primary_image,
          hover_image,
          benefits,
          created_at,
          updated_at,
          created_by
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      setStats(prev => ({ ...prev, totalProducts: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      
      const totalRevenue = (data || []).reduce((sum, order) => sum + Number(order.total_amount), 0);
      setStats(prev => ({ 
        ...prev, 
        totalOrders: data?.length || 0,
        totalRevenue
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch from profiles table since we can't access auth.users directly
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setStats(prev => ({ ...prev, totalUsers: data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const journalsWithPublished = (data || []).map(journal => ({
        ...journal,
        published: journal.is_published || false
      }));

      setJournals(journalsWithPublished);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  const fetchShippingMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const methodsWithPrice = (data || []).map(method => ({
        ...method,
        price: method.base_rate || 0
      }));

      setShippingMethods(methodsWithPrice);
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
    }
  };

  // CSV Export functions
  const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportProducts = () => {
    exportToCSV(products, 'products.csv');
  };

  const handleExportOrders = () => {
    exportToCSV(orders, 'orders.csv');
  };

  const handleExportUsers = () => {
    exportToCSV(users, 'users.csv');
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  // Order status update functions
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Order status updated successfully"
      });
      
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'users':
        return <UsersTab />;
      case 'expenses':
        return <ExpensesTab />;
      case 'products':
        return <ProductsAdmin />;
      case 'recipes':
        return <RecipesAdmin />;
      case 'journals':
        return <JournalsAdmin />;
      case 'reviews':
        return <ReviewsTab />;
      case 'content':
        return <ContentTab />;
      case 'contact':
        return <ContactSubmissionsTab />;
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
                <p className="text-gray-600">View and manage customer orders</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleExportOrders}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Orders
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.order_number}</TableCell>
                        <TableCell>{order.user_id}</TableCell>
                        <TableCell>£{Number(order.total_amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOrderClick(order)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleExportOrders} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Sales Data
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleExportProducts} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Product Data
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleExportUsers} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export User Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Site Name</Label>
                  <Input defaultValue="Dirtea" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input defaultValue="admin@dirtea.com" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="maintenance-mode" />
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex gap-6">
              <div className="flex-1">
                {renderTabContent()}
              </div>
              
              {currentTab === 'dashboard' && (
                <div className="w-80">
                  <MessagesSection />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
      />
    </div>
  );
};

export default AdminDashboard;
