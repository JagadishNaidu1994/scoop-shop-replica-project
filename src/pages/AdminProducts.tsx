
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import ProductsAdmin from '@/components/admin/ProductsAdmin';
import ProductPageContentAdmin from '@/components/admin/ProductPageContentAdmin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products Administration</h1>
          <p className="text-gray-600 mt-2">Manage your products and their individual page content</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products Management</TabsTrigger>
            <TabsTrigger value="page-content">Product Page Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <ProductsAdmin />
          </TabsContent>
          
          <TabsContent value="page-content" className="mt-6">
            <ProductPageContentAdmin />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProducts;
