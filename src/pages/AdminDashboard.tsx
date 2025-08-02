import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import UsersTab from '@/components/admin/UsersTab';
import ProductsAdmin from '@/components/admin/ProductsAdmin';
import JournalsAdmin from '@/components/admin/JournalsAdmin';
import ReviewsTab from '@/components/admin/ReviewsTab';
import ShippingTab from '@/components/admin/ShippingTab';
import ContactSubmissionsTab from '@/components/admin/ContactSubmissionsTab';
import { UserCouponsTab } from '@/components/admin/UserCouponsTab';
import ContentTab from '@/components/admin/ContentTab';
import CLVAnalyticsTab from '@/components/admin/CLVAnalyticsTab';
import ExpensesTab from '@/components/admin/ExpensesTab';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  primary_image: string | null;
  hover_image: string | null;
  category: string | null;
  benefits: string[] | null;
  is_active: boolean | null;
  in_stock: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
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
  updated_at: string | null;
  created_by: string | null;
}

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
      fetchProducts();
      fetchJournals();
    }
  }, [isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch orders for revenue and count
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount');

      if (ordersError) throw ordersError;

      // Fetch users count from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      if (profilesError) throw profilesError;

      // Fetch products count
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('is_active', true);

      if (productsError) throw productsError;

      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;
      const totalUsers = profiles?.length || 0;
      const totalProducts = productsData?.length || 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'users':
        return <UsersTab />;
      case 'products':
        return <ProductsAdmin />;
      case 'journals':
        return <JournalsAdmin />;
      case 'reviews':
        return <ReviewsTab />;
      case 'shipping':
        return <ShippingTab />;
      case 'contact':
        return <ContactSubmissionsTab />;
      case 'coupons':
        return <UserCouponsTab />;
      case 'content':
        return <ContentTab />;
      case 'clv':
        return <CLVAnalyticsTab />;
      case 'expenses':
        return <ExpensesTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8 ml-64">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your store and content</p>
          </div>
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
