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
import { supabase } from '@/integrations/supabase/client';
import { Home, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "products", label: "Products", icon: "🛍️" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "journals", label: "Journals", icon: "📝" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "content", label: "Coupons", icon: "🎫" },
    { id: "shipping", label: "Shipping", icon: "🚚" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

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

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      if (profilesError) throw profilesError;

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-purple-600 shadow-lg"></div>
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
      default:
        return <DashboardOverview />;
    }
  };

  const activeItem = sidebarItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {/* Mobile Header with Dropdown */}
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center text-purple-600 hover:text-purple-700 transition-colors p-2 rounded-xl hover:bg-purple-50"
              >
                <Home className="w-5 h-5" />
              </button>
              
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="flex-1 border-gray-200/50 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activeItem?.icon}</span>
                      <span className="font-medium">{activeItem?.label}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-gray-200/50 rounded-xl shadow-xl z-50">
                  {sidebarItems.map((item) => (
                    <SelectItem 
                      key={item.id} 
                      value={item.id}
                      className="cursor-pointer hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full min-h-screen">
            {/* Desktop Header */}
            <div className="hidden lg:block p-8 pb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Manage your store and content with ease</p>
            </div>

            {/* Content Container */}
            <div className="p-4 lg:p-8">
              <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 p-4 lg:p-8 transition-all duration-300 hover:shadow-2xl">
                {renderActiveTab()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
