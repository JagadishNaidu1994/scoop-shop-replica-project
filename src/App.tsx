
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AdminEditProvider } from "@/contexts/AdminEditContext";
import { AdminImageProvider } from "@/contexts/AdminImageContext";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminRecipes from "./pages/AdminRecipes";
import AdminJournals from "./pages/AdminJournals";
import Journal from "./pages/Journal";
import JournalDetail from "./pages/JournalDetail";
import Science from "./pages/Science";
import OurStory from "./pages/OurStory";
import Wholesale from "./pages/Wholesale";
import ReferFriend from "./pages/ReferFriend";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import StoreLocator from "./pages/StoreLocator";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AdminEditProvider>
              <AdminImageProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/:id" element={<OrderDetail />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/recipes" element={<AdminRecipes />} />
                    <Route path="/admin/journals" element={<AdminJournals />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/journal/:id" element={<JournalDetail />} />
                    <Route path="/science" element={<Science />} />
                    <Route path="/story" element={<OurStory />} />
                    <Route path="/wholesale" element={<Wholesale />} />
                    <Route path="/refer" element={<ReferFriend />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/store-locator" element={<StoreLocator />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </AdminImageProvider>
            </AdminEditProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
