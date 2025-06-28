
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartProvider";
import AdminPopup from "@/components/AdminPopup";
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
import Science from "./pages/Science";
import Wholesale from "./pages/Wholesale";
import OurStory from "./pages/OurStory";
import ReferFriend from "./pages/ReferFriend";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AdminPopup />
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
              <Route path="/science" element={<Science />} />
              <Route path="/story" element={<OurStory />} />
              <Route path="/refer" element={<ReferFriend />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
