import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import Index from "./pages/Index";
const Auth = lazy(() => import("./pages/Auth"));
const Articles = lazy(() => import("./pages/Articles"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const OrbitLanding = lazy(() => import("./pages/OrbitLanding"));
const OrbitThankYou = lazy(() => import("./pages/OrbitThankYou"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const TrackingCodes = lazy(() => import("./pages/admin/TrackingCodes"));
const LinkedInPosts = lazy(() => import("./pages/admin/LinkedInPosts"));
const LeadsCRM = lazy(() => import("./pages/admin/LeadsCRM"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const CommunityDashboard = lazy(() => import("./pages/community/CommunityDashboard"));
const CommunityMembers = lazy(() => import("./pages/community/CommunityMembers"));
const Notifications = lazy(() => import("./pages/community/Notifications"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="min-h-screen bg-white p-8 text-sm text-zinc-600">Loading…</div>}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
