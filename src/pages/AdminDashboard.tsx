
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrdersTab from "@/components/admin/OrdersTab";
import SubscriptionsTab from "@/components/admin/SubscriptionsTab";
import UsersTab from "@/components/admin/UsersTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import ContactSubmissionsTab from "@/components/admin/ContactSubmissionsTab";
import EnquiriesTab from "@/components/admin/EnquiriesTab";
import ShippingTab from "@/components/admin/ShippingTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import CLVAnalyticsTab from "@/components/admin/CLVAnalyticsTab";
import { CouponsTab } from "@/components/admin/CouponsTab";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import RecipesAdmin from "@/components/admin/RecipesAdmin";
import JournalsAdmin from "@/components/admin/JournalsAdmin";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminCheck();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "orders":
        return <OrdersTab />;
      case "subscriptions":
        return <SubscriptionsTab />;
      case "users":
        return <UsersTab />;
      case "products":
        return <ProductsAdmin />;
      case "recipes":
        return <RecipesAdmin />;
      case "journals":
        return <JournalsAdmin />;
      case "coupons":
        return <CouponsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "contact":
        return <ContactSubmissionsTab />;
      case "enquiries":
        return <EnquiriesTab />;
      case "shipping":
        return <ShippingTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "clv":
        return <CLVAnalyticsTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, slides in when open */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false); // Close sidebar on mobile after selection
          }}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg p-0"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 hidden sm:block">Manage your {activeTab} efficiently</p>
            </div>

            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white rounded-2xl shadow-lg shadow-slate-900/20 px-3 sm:px-6 py-2 sm:py-3 transition-all duration-300 hover:scale-105 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Site</span>
            </Button>
          </div>
        </header>

        {/* Main Content with padding and rounded corners */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
