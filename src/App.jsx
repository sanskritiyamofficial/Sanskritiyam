import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Pujas from "./pages/Pujas";
import MaalaJaap from "./pages/MaalaJaap";
import TemplePage from "./pages/TemplePage";
import TempleOfferingsPage from "./pages/TemplePage/TempleOfferingsPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminRegister from "./pages/Admin/AdminRegister";
import OrderDashboard from "./pages/Admin/OrderDashboard";
import Chadhawa from "./pages/Chadhawa";
import TempleDetail from "./pages/Chadhawa/TempleDetail";
import BlogPage from "./pages/Blog";
import BlogDetailPage from "./pages/Blog/BlogDetailPage";
import { useEffect } from "react";

// Placeholder components for other routes
const PrivacyPolicy = () => (
  <div className="pt-20">
    <h1>Privacy Policy Page</h1>
  </div>
);
const TermsAndConditions = () => (
  <div className="pt-20">
    <h1>Terms and Conditions Page</h1>
  </div>
);
const ReturnPolicy = () => (
  <div className="pt-20">
    <h1>Return Policy Page</h1>
  </div>
);
const ShippingPolicy = () => (
  <div className="pt-20">
    <h1>Shipping Policy Page</h1>
  </div>
);

// Helper to determine if Navbar should be shown
const useShowNavbar = () => {
  const location = useLocation();
  // Hide Navbar for admin login, register, and orders
  const hideNavbarRoutes = ["/admin/login", "/admin/register", "/admin/orders"];
  // Also hide for /admin/orders subroutes (if any in future)
  if (hideNavbarRoutes.some((path) => location.pathname.startsWith(path))) {
    return false;
  }
  return true;
};

// ScrollToTop component: scrolls to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  const showNavbar = useShowNavbar();
  return (
    <div className="min-h-screen bg-[#faf5eb]">
      {showNavbar && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pooja-booking" element={<Pujas />} />
        <Route path="/mala-jaap" element={<MaalaJaap />} />
        <Route path="/temple/:templeId" element={<TemplePage />} />
        <Route
          path="/temple/:templeId/offerings"
          element={<TempleOfferingsPage />}
        />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireAdmin={true}>
              <OrderDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/chadhawa" element={<Chadhawa />} />
        <Route path="/chadhawa/:templeId" element={<TempleDetail />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
