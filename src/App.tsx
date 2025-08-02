
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import { AdminImageProvider } from "@/contexts/AdminImageContext";
import { AdminEditProvider } from "@/contexts/AdminEditContext";
import AdminFloatingControls from "@/components/AdminFloatingControls";
import AdminEditToggle from "@/components/admin/AdminEditToggle";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Journal from "./pages/Journal";
import JournalDetail from "./pages/JournalDetail";
import Blog from "./pages/Blog";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
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
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import StoreLocator from "./pages/StoreLocator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminImageProvider>
        <AdminEditProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AdminFloatingControls />
                <AdminEditToggle />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/recipes" element={<Recipes />} />
                  <Route path="/recipes/:id" element={<RecipeDetail />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/journal/:id" element={<JournalDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
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
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/stores" element={<StoreLocator />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AdminEditProvider>
      </AdminImageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
