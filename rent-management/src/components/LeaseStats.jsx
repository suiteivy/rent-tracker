import React from 'react';
import { formatCurrency } from '../utils/formatters';

// Lease and tenant statistics
const LeaseStats = ({ stats }) => {
  if (!stats) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'terminated': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Lease & Tenant Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tenant Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Tenants</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tenants</span>
              <span className="text-lg font-semibold text-gray-900">{stats.totalTenants || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Tenants</span>
              <span className="text-lg font-semibold text-green-600">{stats.activeTenants || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New (30 days)</span>
              <span className="text-lg font-semibold text-blue-600">{stats.recentTenants || 0}</span>
            </div>
          </div>
        </div>

        {/* Lease Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Leases</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Leases</span>
              <span className="text-lg font-semibold text-gray-900">{stats.totalLeases || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Leases</span>
              <span className="text-lg font-semibold text-green-600">{stats.totalActiveLeases || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New (30 days)</span>
              <span className="text-lg font-semibold text-blue-600">{stats.recentLeases || 0}</span>
            </div>
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Financial</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Income</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(stats.totalMonthlyRentFromLeases || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Lease Rent</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(stats.averageLeaseRent || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Income Efficiency</span>
              <span className="text-lg font-semibold text-orange-600">
                {stats.incomeEfficiency || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Occupancy Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Occupancy</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lease Occupancy</span>
              <span className="text-lg font-semibold text-purple-600">
                {stats.leaseOccupancyRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unit Occupancy</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats.occupancyRate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available Units</span>
              <span className="text-lg font-semibold text-blue-600">
                {stats.availableUnits || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lease Status Distribution */}
      {stats.leaseStatusDistribution && Object.keys(stats.leaseStatusDistribution).length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lease Status Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.leaseStatusDistribution).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseStats; 