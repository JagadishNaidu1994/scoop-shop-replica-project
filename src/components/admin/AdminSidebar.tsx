
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  Tag,
  Truck,
  Star,
  Settings,
  Home,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const [counts, setCounts] = useState({
    orders: 0,
    products: 0,
    messages: 0,
    coupons: 0,
    users: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const messagesCount = 0;
      const couponsCount = 0;

      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setCounts({
        orders: ordersCount || 0,
        products: productsCount || 0,
        messages: messagesCount || 0,
        coupons: couponsCount || 0,
        users: usersCount || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "orders", label: "Orders", icon: ShoppingCart, count: counts.orders },
    { id: "products", label: "Products", icon: Package, count: counts.products },
    { id: "users", label: "Users", icon: Users, count: counts.users },
    { id: "journals", label: "Journals", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare, count: counts.messages },
    { id: "content", label: "Coupons", icon: Tag, count: counts.coupons },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-72 bg-white/80 backdrop-blur-md h-screen border-r border-gray-200/50 flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <NavLink to="/" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors">
          <Home className="h-5 w-5" />
          <span className="font-medium text-sm">Back to Home</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all duration-200 text-sm",
                  activeTab === item.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200/50 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-purple-600" : "")} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    activeTab === item.id
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
