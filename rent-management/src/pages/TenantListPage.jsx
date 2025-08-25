import React from 'react';
import { Link } from 'react-router-dom';
import TenantList from '../components/TenantList';

// Tenant list page
const TenantListPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
              <p className="text-gray-600 mt-2">Manage your tenants and their information</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/dashboard/add-tenant"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Tenant
              </Link>
            </div>
          </div>
        </div>

        {/* Tenant List Component */}
        <TenantList />
      </div>
    </div>
  );
};

export default TenantListPage; 