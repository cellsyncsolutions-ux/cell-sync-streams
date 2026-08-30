import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Account from "./pages/Account.tsx";
import Checkout from "./pages/Checkout.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import Refund from "./pages/Refund.tsx";
import Admin from "./pages/Admin.tsx";
import AdminQRCodes from "./pages/AdminQRCodes.tsx";
import AdminCustomers from "./pages/AdminCustomers.tsx";
import AdminInventory from "./pages/AdminInventory.tsx";
import AdminAffiliates from "./pages/AdminAffiliates.tsx";
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
import Product from "./pages/Product.tsx";
import ResearchLibrary from "./pages/ResearchLibrary.tsx";
import Compliance from "./pages/Compliance.tsx";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AgeGate from "./components/AgeGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AgeGate />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/account" element={<Account />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund-policy" element={<Refund />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/qr-codes" element={<AdminQRCodes />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/affiliates" element={<AdminAffiliates />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/research-library" element={<ResearchLibrary />} />
                <Route path="/compliance" element={<Compliance />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
