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
import SmartDevices from '../pages/app/SmartDevices.jsx';
import LifestyleInsights from '../pages/app/LifestyleInsights.jsx';
import BudgetPlanner from '../pages/app/BudgetPlanner.jsx';
import LoadManagement from '../pages/app/LoadManagement.jsx';
import ReportsInsights from '../pages/app/ReportsInsights.jsx';
import ApplianceHealth from '../pages/app/ApplianceHealth.jsx';
import EnergyAnomalies from '../pages/app/EnergyAnomalies.jsx';
import SmartScheduling from '../pages/app/SmartScheduling.jsx';
import SustainabilityCenter from '../pages/app/SustainabilityCenter.jsx';
import RuleBuilder from '../pages/app/RuleBuilder.jsx';
import AutomationHistory from '../pages/app/AutomationHistory.jsx';
import SettingsView from '../pages/app/Settings.jsx';
import ProfileView from '../pages/app/Profile.jsx';

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

            {/* Core Modules */}
            <Route path="lifestyle" element={<LifestyleInsights />} />
            <Route path="devices" element={<SmartDevices />} />
            <Route path="health" element={<ApplianceHealth />} />
            <Route path="anomalies" element={<EnergyAnomalies />} />
            <Route path="rule-builder" element={<RuleBuilder />} />
            <Route path="scheduling" element={<SmartScheduling />} />
            <Route path="automation-history" element={<AutomationHistory />} />
            <Route path="coach" element={<EnergyCoach />} />
            <Route path="budget" element={<BudgetPlanner />} />
            <Route path="load" element={<LoadManagement />} />
            <Route path="sustainability" element={<SustainabilityCenter />} />
            <Route path="reports" element={<ReportsInsights />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="profile" element={<ProfileView />} />
          </Route>

          {/* Fallback & Aliases */}
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
          <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
          <Route path="/automation-history" element={<Navigate to="/app/automation-history" replace />} />
          <Route path="/rule-builder" element={<Navigate to="/app/rule-builder" replace />} />
          <Route path="/sustainability" element={<Navigate to="/app/sustainability" replace />} />
          <Route path="/scheduling" element={<Navigate to="/app/scheduling" replace />} />
          <Route path="/health" element={<Navigate to="/app/health" replace />} />
          <Route path="/anomalies" element={<Navigate to="/app/anomalies" replace />} />
          <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
          <Route path="/budget" element={<Navigate to="/app/budget" replace />} />
          <Route path="/load" element={<Navigate to="/app/load" replace />} />
          <Route path="/lifestyle" element={<Navigate to="/app/lifestyle" replace />} />
          <Route path="/devices" element={<Navigate to="/app/devices" replace />} />
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

