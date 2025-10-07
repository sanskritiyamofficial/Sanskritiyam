import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import UpsellCrosssell from "./components/UpsellCrosssell";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home/Home"));
const Pujas = lazy(() => import("./pages/Pujas"));
const MaalaJaap = lazy(() => import("./pages/MaalaJaap"));
const TemplePage = lazy(() => import("./pages/TemplePage"));
const TempleOfferingsPage = lazy(() =>
  import("./pages/TemplePage/TempleOfferingsPage")
);
const PaymentPage = lazy(() => import("./pages/Payment/PaymentPage"));
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const AdminRegister = lazy(() => import("./pages/Admin/AdminRegister"));
const OrderDashboard = lazy(() => import("./pages/Admin/OrderDashboard"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const BlogManagement = lazy(() => import("./pages/Admin/BlogManagement"));
const Chadhawa = lazy(() => import("./pages/Chadhawa"));
const TempleDetail = lazy(() => import("./pages/Chadhawa/TempleDetail"));
const BlogPage = lazy(() => import("./pages/Blog"));
const BlogListPage = lazy(() => import("./pages/Blog/BlogListPage"));
const BlogDetailPage = lazy(() => import("./pages/Blog/BlogDetailPage"));
const Calendar = lazy(() => import("./pages/Calendar/Calendar"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-amber-50 pt-20 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

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
  // Hide Navbar for all admin pages
  const hideNavbarRoutes = ["/admin"];
  // Also hide for /admin subroutes
  if (hideNavbarRoutes.some((path) => location.pathname.startsWith(path))) {
    return false;
  }
  return true;
};

// Helper to determine if Footer should be shown
const useShowFooter = () => {
  const location = useLocation();
  // Hide Footer for all admin pages
  const hideFooterRoutes = ["/admin"];
  // Also hide for /admin subroutes
  if (hideFooterRoutes.some((path) => location.pathname.startsWith(path))) {
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
  const showFooter = useShowFooter();
  return (
    <div className="min-h-screen bg-[#faf5eb]">
      {showNavbar && <Navbar />}
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/pooja-booking" element={<Pujas />} />
          <Route path="/mala-jaap" element={<MaalaJaap />} />
          <Route path="/temple/:templeId" element={<TemplePage />} />
          <Route
            path="/temple/:templeId/offerings"
            element={<TempleOfferingsPage />}
          />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/chadhawa" element={<Chadhawa />} />
          <Route path="/chadhawa/:templeId" element={<TempleDetail />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailPage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/related-pujas" element={<UpsellCrosssell/>} />

          {/* User Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requireAdmin={true}>
                <OrderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute requireAdmin={true}>
                <BlogManagement />
              </ProtectedRoute>
            }
          />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
        </Routes>
      </Suspense>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
