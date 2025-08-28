import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import AddUnit from './pages/AddUnit';
import AddTenant from './pages/AddTenant';
import AddLease from './pages/AddLease';
import TenantListPage from './pages/TenantListPage';
import LeaseListPage from './pages/LeaseListPage';
import FinanceDashboard from './pages/FinanceDashboard';
import PropertyDetail from './pages/PropertyDetail';
import UnitDetail from './pages/UnitDetail';
import StyleTest from './components/StyleTest';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import MaintenanceListPage from './pages/MaintenanceListPage';
import RentLogPage from './pages/RentLogPage';
import ExpenseTracker from './pages/ExpenseTracker';
import Login from './pages/Login';
import DashboardTenant from './pages/DashboardTenant';
import './App.css';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<StyleTest />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-property" element={<AddProperty />} />
          <Route path="maintenance" element={<MaintenanceListPage />} />
          <Route path="rent-log" element={<RentLogPage />} />
          <Route path="expense-tracker" element={<ExpenseTracker />} />
          <Route path="add-unit" element={<AddUnit />} />
                  <Route path="add-tenant" element={<AddTenant />} />
        <Route path="add-lease" element={<AddLease />} />
        <Route path="tenants" element={<TenantListPage />} />
        <Route path="leases" element={<LeaseListPage />} />
        <Route path="finance" element={<FinanceDashboard />} />
          <Route path="property/:propertyId" element={<PropertyDetail />} />
          <Route path="unit/:unitId" element={<UnitDetail />} />
        </Route>

        {/* new route for tenant dashboard */}
        <Route path="/dashboard-tenant" element={<DashboardTenant />} />
      </Routes>
      
    </div>
  );
}

export default App;
