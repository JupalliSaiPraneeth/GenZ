import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Survey from './pages/Survey';
import SurveyComplete from './pages/SurveyComplete';
import VerifyCertificate from './pages/VerifyCertificate';
import Analytics from './pages/Analytics';

// Admin Auth & Protected Route
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRespondents from './pages/admin/AdminRespondents';
import AdminRespondentDetail from './pages/admin/AdminRespondentDetail';
import AdminResponses from './pages/admin/AdminResponses';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminComparative from './pages/admin/AdminComparative';
import AdminDatabase from './pages/admin/AdminDatabase';
import AdminExport from './pages/admin/AdminExport';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

import { useSurveyStore } from './stores/surveyStore';
import { syncService } from './services/syncService';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F0] flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="w-full flex-1">
        <Routes>
          {/* Public Student Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/categories" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/survey-complete" element={<SurveyComplete />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/privacy" element={<Survey />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/respondents"
            element={
              <AdminProtectedRoute>
                <AdminRespondents />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/respondents/:id"
            element={
              <AdminProtectedRoute>
                <AdminRespondentDetail />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/responses"
            element={
              <AdminProtectedRoute>
                <AdminResponses />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <AdminProtectedRoute>
                <AdminQuestions />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <AdminAnalytics />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/comparative-analysis"
            element={
              <AdminProtectedRoute>
                <AdminComparative />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/segments" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/data-quality" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/database"
            element={
              <AdminProtectedRoute>
                <AdminDatabase />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/reports" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/export"
            element={
              <AdminProtectedRoute>
                <AdminExport />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <AdminProtectedRoute>
                <AdminAuditLogs />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/settings" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  const initSession = useSurveyStore((state) => state.initSession);

  useEffect(() => {
    initSession();
    syncService.startAutoSync();
  }, [initSession]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout />
    </Router>
  );
}
