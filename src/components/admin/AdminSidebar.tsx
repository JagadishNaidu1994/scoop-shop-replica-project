
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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors">
            <Home className="h-5 w-5" />
            <span className="font-medium text-sm">Back to Home</span>
          </NavLink>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 text-sm",
                  activeTab === item.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={cn("h-4 w-4", activeTab === item.id ? "text-purple-600" : "")} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
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
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(true)}
          className="bg-white/90 backdrop-blur-sm border-gray-200 rounded-xl shadow-sm"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out rounded-r-2xl shadow-2xl",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent isMobile={true} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 bg-white h-screen border-r border-gray-100 flex-col shadow-sm">
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
