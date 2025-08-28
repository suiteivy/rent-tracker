import React from 'react';
import MaintenanceCard from './MaintenanceCard';

function MaintenanceList({ requests, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-airbnb p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-airbnb-200 rounded-airbnb-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-airbnb-200 rounded w-1/3"></div>
                <div className="h-3 bg-airbnb-200 rounded w-2/3"></div>
                <div className="h-3 bg-airbnb-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-airbnb-200 rounded-airbnb-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="card-airbnb p-16 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-airbnb-100 to-airbnb-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-airbnb-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-airbnb-900 mb-3">No maintenance requests yet</h3>
        <p className="text-airbnb-600 text-lg mb-8 max-w-md mx-auto">
          WhatsApp maintenance requests from tenants will appear here when the integration is completed in Sprint 3.
        </p>
        <div className="bg-airbnb-blue-50 border border-airbnb-blue-200 rounded-airbnb-lg p-6 max-w-lg mx-auto">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-airbnb-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-semibold text-airbnb-blue-900">Coming in Sprint 3</h4>
          </div>
          <p className="text-airbnb-blue-700 text-sm">
            Tenants will be able to send maintenance requests via WhatsApp, and they'll automatically appear here for you to manage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-airbnb-900">
          Maintenance Requests ({requests.length})
        </h2>
      </div>
      
      {requests.map((request) => (
        <MaintenanceCard 
          key={request.id} 
          request={request}
        />
      ))}
    </div>
  );
}

export default MaintenanceList;