import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AwarenessTicker from './components/AwarenessTicker';
import OfflineSentinelBar from './components/OfflineSentinelBar';
import Home from './pages/Home';

import SafeRouteAIPage from './pages/SafeRouteAIPage';


import RouteDeviationPage from './pages/RouteDeviationPage';
import BystanderRelayPage from './pages/BystanderRelayPage';
import AcousticSignalPage from './pages/AcousticSignalPage';
import DeepfakeForensicsPage from './pages/DeepfakeForensicsPage';
import AIGuardianCallPage from './pages/AIGuardianCallPage';
import StreetHarassmentShieldPage from './pages/StreetHarassmentShieldPage';


import CyberFIRDossierPage from './pages/CyberFIRDossierPage';
import IncidentTimelinePage from './pages/IncidentTimelinePage';

import SafetyHubDirectoryPage from './pages/SafetyHubDirectoryPage';
import SoloTripPlannerPage from './pages/SoloTripPlannerPage';
import AwarenessWallPage from './pages/AwarenessWallPage';
import RouteIntelligencePage from './pages/RouteIntelligencePage';
import SignInPage from './pages/SignInPage';
import AboutPage from './pages/AboutPage';
import Dashboard from './pages/Dashboard';
import SafeHubs from './pages/SafeHubs';
import Community from './pages/Community';
import ReportIncident from './pages/ReportIncident';
import EmergencyContacts from './pages/EmergencyContacts';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            {/* 🔴 Top Awareness Sliding Headline Marquee (Live across entire website) */}
            <OfflineSentinelBar />
            <AwarenessTicker />
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/"                  element={<Home />} />

                <Route path="/saferoute-ai"      element={<SafeRouteAIPage />} />
                <Route path="/route-intelligence" element={<RouteIntelligencePage />} />
                <Route path="/route-reviews"     element={<RouteIntelligencePage />} />

                <Route path="/awareness-hub"     element={<AwarenessWallPage />} />
                <Route path="/community-voice"   element={<AwarenessWallPage />} />
                <Route path="/voices"            element={<AwarenessWallPage />} />

                <Route path="/route-deviation"   element={<RouteDeviationPage />} />
                <Route path="/smart-defense"     element={<RouteDeviationPage />} />
                <Route path="/defense-suite"     element={<RouteDeviationPage />} />
                <Route path="/bystander-relay"   element={<BystanderRelayPage />} />
                <Route path="/emergency-relay"   element={<BystanderRelayPage />} />
                <Route path="/offline-relay"     element={<BystanderRelayPage />} />
                <Route path="/solo-trip-planner" element={<SoloTripPlannerPage />} />
                <Route path="/solo-travel"       element={<SoloTripPlannerPage />} />
                <Route path="/acoustic-signal"   element={<AcousticSignalPage />} />
                <Route path="/deepfake-forensics" element={<DeepfakeForensicsPage />} />
                <Route path="/guardian-call"     element={<AIGuardianCallPage />} />
                <Route path="/live-location"     element={<StreetHarassmentShieldPage />} />
                <Route path="/anti-harassment"  element={<StreetHarassmentShieldPage />} />
                <Route path="/street-harassment-shield" element={<StreetHarassmentShieldPage />} />
                <Route path="/harassment-shield" element={<StreetHarassmentShieldPage />} />


                

                <Route path="/cyber-fir-dossier" element={<CyberFIRDossierPage />} />
                <Route path="/cyber-fir"         element={<CyberFIRDossierPage />} />
                <Route path="/incident-timeline" element={<IncidentTimelinePage />} />
                <Route path="/timeline"          element={<IncidentTimelinePage />} />


                <Route path="/safety-hub"        element={<SafetyHubDirectoryPage />} />
                <Route path="/tools"             element={<SafetyHubDirectoryPage />} />
                <Route path="/dashboard"         element={<Dashboard />} />
                <Route path="/safe-hubs"         element={<SafeHubs />} />
                <Route path="/community"         element={<Community />} />
                <Route path="/report"            element={<ReportIncident />} />
                <Route path="/emergency-contacts" element={<EmergencyContacts />} />
                <Route path="/about"             element={<AboutPage />} />
                <Route path="/signin"            element={<SignInPage />} />
                <Route path="/login"             element={<SignInPage />} />
                {/* Hidden Admin Route — not linked anywhere in UI */}
                <Route path="/herhub-admin"       element={<AdminDashboardPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
