
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AdminImageProvider } from "@/contexts/AdminImageContext";
import AdminFloatingControls from "@/components/AdminFloatingControls";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Journal from "./pages/Journal";
import JournalDetail from "./pages/JournalDetail";
import AdminRecipes from "./pages/AdminRecipes";
import AdminProducts from "./pages/AdminProducts";
import AdminJournals from "./pages/AdminJournals";
import AdminDashboard from "./pages/AdminDashboard";
import Science from "./pages/Science";
import Wholesale from "./pages/Wholesale";
import OurStory from "./pages/OurStory";
import ReferFriend from "./pages/ReferFriend";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import OrderDetail from "./pages/OrderDetail";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminImageProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AdminFloatingControls />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/:id" element={<JournalDetail />} />
                <Route path="/admin/recipes" element={<AdminRecipes />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/journals" element={<AdminJournals />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/science" element={<Science />} />
                <Route path="/story" element={<OurStory />} />
                <Route path="/refer" element={<ReferFriend />} />
                <Route path="/wholesale" element={<Wholesale />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<Contact />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AdminImageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
