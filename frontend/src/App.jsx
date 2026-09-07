import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Survey from './pages/Survey';
import SurveyComplete from './pages/SurveyComplete';
import VerifyCertificate from './pages/VerifyCertificate';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import { useSurveyStore } from './stores/surveyStore';
import { syncService } from './services/syncService';

export default function App() {
  const initSession = useSurveyStore((state) => state.initSession);

  useEffect(() => {
    initSession();
    syncService.startAutoSync();
  }, [initSession]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF7F0] flex flex-col">
        <Navbar />
        <main className="w-full flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Home />} />
            <Route path="/categories" element={<Home />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/survey-complete" element={<SurveyComplete />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/privacy" element={<Survey />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
