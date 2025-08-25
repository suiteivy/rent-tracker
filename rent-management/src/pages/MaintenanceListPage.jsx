import React, { useState, useEffect } from 'react';
import MaintenanceList from '../components/MaintenanceList';
import MaintenanceFilters from '../components/MaintenanceFilters';

function MaintenanceListPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all', 
    category: 'all'
  });

  // Mock data for Sprint 1 - will be replaced with real Supabase calls in Sprint 3
  const mockRequests = [];

  useEffect(() => {
    // Simulate loading for Sprint 1
    const timer = setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredRequests = requests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.priority !== 'all' && request.request?.priority !== filters.priority) return false;
    if (filters.category !== 'all' && request.request?.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-airbnb-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-airbnb-blue-500 to-airbnb-blue-600 rounded-airbnb-lg flex items-center justify-center mr-8 shadow-airbnb">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-airbnb-900 mb-4">Maintenance Requests</h1>
              <p className="text-xl text-airbnb-600 font-medium">Manage tenant maintenance requests from WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-airbnb p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-airbnb-lg flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-airbnb-500">Pending</p>
                <p className="text-3xl font-bold text-airbnb-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="card-airbnb p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-airbnb-lg flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-airbnb-500">In Progress</p>
                <p className="text-3xl font-bold text-airbnb-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="card-airbnb p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-airbnb-lg flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-airbnb-500">Completed</p>
                <p className="text-3xl font-bold text-airbnb-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="card-airbnb p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-airbnb-lg flex items-center justify-center mr-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-airbnb-500">Emergency</p>
                <p className="text-3xl font-bold text-airbnb-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <MaintenanceFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Maintenance Requests List */}
        <MaintenanceList 
          requests={filteredRequests}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default MaintenanceListPage;