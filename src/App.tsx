import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { useTrackingCodes } from "@/hooks/use-tracking-codes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import OrbitLanding from "./pages/OrbitLanding";
import OrbitThankYou from "./pages/OrbitThankYou";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrackingCodes from "./pages/admin/TrackingCodes";
import LinkedInPosts from "./pages/admin/LinkedInPosts";
import LeadsCRM from "./pages/admin/LeadsCRM";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import CommunityDashboard from "./pages/community/CommunityDashboard";
import CommunityMembers from "./pages/community/CommunityMembers";
import Notifications from "./pages/community/Notifications";

const queryClient = new QueryClient();

// Component to load tracking codes
function TrackingCodesLoader() {
  useTrackingCodes();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingCodesLoader />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/orbit-landing" element={<OrbitLanding />} />
            <Route path="/orbit-thank-you" element={<OrbitThankYou />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tracking-codes"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <TrackingCodes />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <LeadsCRM />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/linkedin-posts"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <LinkedInPosts />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Community Platform Routes */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community/:slug"
              element={
                <ProtectedRoute>
                  <CommunityMembers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;