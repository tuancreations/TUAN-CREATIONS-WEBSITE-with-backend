import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./public/home/HomePage";
import AboutPage from "./public/about/AboutPage";
import DivisionsPage from "./public/divisions/DivisionsPage";
import BlogPage from "./public/blog/BlogPage";
import ContactPage from "./public/contact/ContactPage";
import AuthPage from "./modules/auth/AuthPage";
import AdminLoginPage from "./modules/auth/AdminLoginPage";
import DashboardPage from "./modules/dashboard/DashboardPage";
import AcademyPage from "./modules/academy/AcademyPage";
import MarketplacePage from "./modules/marketplace/MarketplacePage";
import MediaPage from "./modules/media/MediaPage";
import CollaborationPage from "./modules/collaboration/CollaborationPage";
import IotPage from "./modules/iot/IotPage";
import AdminPage from "./modules/admin/AdminPage";
import LiveSessionPage from "./pages/LiveSessionPage";
import { useAuth } from "./store/auth";

function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/divisions" element={<DivisionsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/live-session" element={<LiveSessionPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/collaboration" element={<CollaborationPage />} />
        <Route path="/iot" element={<IotPage />} />
        <Route
          path="/admin"
          element={(
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          )}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
