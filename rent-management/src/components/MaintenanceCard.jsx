import React from 'react';

function MaintenanceCard({ request }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      acknowledged: 'bg-blue-100 text-blue-800 border-blue-200', 
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600', 
      high: 'text-orange-600',
      emergency: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      electrical: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      hvac: (
        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      other: (
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    };
    return icons[category] || icons.other;
  };

  return (
    <div className="card-airbnb p-6 hover:shadow-airbnb-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getCategoryIcon(request.category)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-airbnb-900 mb-2">
                  {request.title}
                </h3>
                <p className="text-airbnb-600 mb-3 leading-relaxed">
                  {request.description}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-airbnb-lg text-sm font-medium border ${getStatusColor(request.status)}`}>
              {request.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* WhatsApp Thread Placeholder */}
          <div className="border-t border-airbnb-200 pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium text-airbnb-700">WhatsApp Thread</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Coming in Sprint 3
              </span>
            </div>
            <div className="bg-airbnb-100 p-4 rounded-airbnb-lg">
              <p className="text-sm text-airbnb-600 italic">
                WhatsApp conversation thread will appear here when integration is completed.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Placeholder */}
        <div className="lg:ml-8 lg:w-48 mt-6 lg:mt-0">
          <div className="space-y-3">
            <button disabled className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-airbnb-lg text-sm cursor-not-allowed">
              Reply via WhatsApp
            </button>
            <button disabled className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-airbnb-lg text-sm cursor-not-allowed">
              Assign Technician  
            </button>
            <button disabled className="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-airbnb-lg text-sm cursor-not-allowed">
              Update Status
            </button>
          </div>
          <p className="text-xs text-airbnb-500 mt-3 text-center">
            Actions available in Sprint 3
          </p>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceCard;