import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';

// Auth Pages
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

// Core App Pages
import Dashboard from '../pages/app/Dashboard.jsx';
import AutomationCenter from '../pages/app/AutomationCenter.jsx';
import Alerts from '../pages/app/Alerts.jsx';
import Simulator from '../pages/app/Simulator.jsx';
import EnergyCoach from '../pages/app/EnergyCoach.jsx';

// Placeholder view for upcoming modules (Phase 5 & 6)
import PageHeader from '../components/layout/PageHeader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Badge from '../components/ui/Badge.jsx';
import { Layers } from 'lucide-react';

function ModulePlaceholder({ title, phase = 'Phase 6' }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle="Intelligent energy management module"
        badge={<Badge variant="Assumption" label={phase} />}
      />
      <EmptyState
        icon={Layers}
        title={`${title} Ready for Activation`}
        description={`This module is scheduled for implementation during ${phase} according to PRD specification.`}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="automations" element={<AutomationCenter />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="simulator" element={<Simulator />} />

            {/* Upcoming Phase 5 & 6 Module Stubs */}
            <Route path="lifestyle" element={<ModulePlaceholder title="Lifestyle Insights" phase="Phase 6 (P1)" />} />
            <Route path="devices" element={<ModulePlaceholder title="Smart Devices" phase="Phase 6 (P1)" />} />
            <Route path="health" element={<ModulePlaceholder title="Appliance Health" phase="Phase 6 (P2)" />} />
            <Route path="anomalies" element={<ModulePlaceholder title="Energy Anomalies" phase="Phase 6 (P2)" />} />
            <Route path="rule-builder" element={<ModulePlaceholder title="Rule Builder" phase="Phase 6 (P2)" />} />
            <Route path="scheduling" element={<ModulePlaceholder title="Smart Scheduling" phase="Phase 6 (P2)" />} />
            <Route path="automation-history" element={<ModulePlaceholder title="Automation History" phase="Phase 6 (P2)" />} />
            <Route path="coach" element={<EnergyCoach />} />
            <Route path="budget" element={<ModulePlaceholder title="Budget Planner" phase="Phase 6 (P1)" />} />
            <Route path="load" element={<ModulePlaceholder title="Load Management" phase="Phase 6 (P1)" />} />
            <Route path="sustainability" element={<ModulePlaceholder title="Sustainability Center" phase="Phase 6 (P2)" />} />
            <Route path="reports" element={<ModulePlaceholder title="Reports & Insights" phase="Phase 6 (P1)" />} />
            <Route path="settings" element={<ModulePlaceholder title="Settings" phase="Phase 6 (P2)" />} />
            <Route path="profile" element={<ModulePlaceholder title="Profile" phase="Phase 6 (P2)" />} />
          </Route>

          {/* Fallback & Aliases */}
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="/automations" element={<Navigate to="/app/automations" replace />} />
          <Route path="/alerts" element={<Navigate to="/app/alerts" replace />} />
          <Route path="/simulator" element={<Navigate to="/app/simulator" replace />} />
          <Route path="/coach" element={<Navigate to="/app/coach" replace />} />
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

