
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
import { ArrowLeft } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminCheck();
  const [activeTab, setActiveTab] = useState("dashboard");
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
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Manage your {activeTab} efficiently</p>
            </div>
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white rounded-2xl shadow-lg shadow-slate-900/20 px-6 py-3 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Site
            </Button>
          </div>
        </header>

        {/* Main Content with padding and rounded corners */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
