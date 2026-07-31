import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Inbox from '@/pages/Inbox';
import ChangeDetail from '@/pages/ChangeDetail';
import DecisionTimeline from '@/pages/DecisionTimeline';
import TeamPortal from '@/pages/TeamPortal';
import ClarityLayout from '@/components/clarity/ClarityLayout';
import ClarityDashboard from '@/pages/ClarityDashboard';
import ChangesListPage from '@/pages/ChangesListPage';
import ChangeIssuePage from '@/pages/ChangeIssuePage';
import AnalysisPage from '@/pages/AnalysisPage';
import EvidencePage from '@/pages/EvidencePage';
import ResolvePage from '@/pages/ResolvePage';
import VerificationPage from '@/pages/VerificationPage';
import RfiListPage from '@/pages/RfiListPage';
import RfiPage from '@/pages/RfiPage';
import DrawingsListPage from '@/pages/DrawingsListPage';
import DrawingUpdatePage from '@/pages/DrawingUpdatePage';
import ClaritySettingsPage from '@/pages/ClaritySettingsPage';
import UpdatesPage from '@/pages/UpdatesPage';
import DesignChangeIssuePage from '@/pages/DesignChangeIssuePage';
import GuidePage from '@/pages/GuidePage';
import { Navigate } from 'react-router-dom';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Inbox />} />
          <Route path="/change/:id" element={<ChangeDetail />} />
          <Route path="/timeline" element={<DecisionTimeline />} />
          <Route path="/portal" element={<TeamPortal />} />
        </Route>
        <Route element={<ClarityLayout />}>
          <Route path="/dashboard" element={<ClarityDashboard />} />
          <Route path="/changes" element={<ChangesListPage />} />
          <Route path="/collisions" element={<ChangesListPage collisionsOnly />} />
          <Route path="/changes/:issueId" element={<ChangeIssuePage />} />
          <Route path="/changes/:issueId/analysis" element={<AnalysisPage />} />
          <Route path="/changes/:issueId/evidence" element={<EvidencePage />} />
          <Route path="/changes/:issueId/resolve" element={<ResolvePage />} />
          <Route path="/changes/:issueId/verification" element={<VerificationPage />} />
          <Route path="/rfis" element={<RfiListPage />} />
          <Route path="/rfis/:rfiId" element={<RfiPage />} />
          <Route path="/drawings" element={<DrawingsListPage />} />
          <Route path="/drawings/:drawingId/update" element={<DrawingUpdatePage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/design-change" element={<DesignChangeIssuePage />} />
          <Route path="/design-change/:issueId" element={<DesignChangeIssuePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/settings" element={<ClaritySettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App