import React from 'react';

function MaintenanceFilters({ filters, onFilterChange }) {
  const handleFilterUpdate = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const getFilterButtonClass = (isActive) => {
    return `px-4 py-2 rounded-airbnb-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-airbnb-red-500 text-white shadow-airbnb'
        : 'bg-white text-airbnb-600 hover:bg-airbnb-50 hover:text-airbnb-900 border border-airbnb-200'
    }`;
  };

  return (
    <div className="card-airbnb p-6">
      <h3 className="text-lg font-semibold text-airbnb-900 mb-6">Filter Requests</h3>
      
      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-airbnb-700 mb-3">Status</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Requests' },
              { value: 'pending', label: 'Pending' },
              { value: 'acknowledged', label: 'Acknowledged' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => handleFilterUpdate('status', status.value)}
                className={getFilterButtonClass(filters.status === status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-airbnb-700 mb-3">Priority</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'emergency', label: 'Emergency' }
            ].map((priority) => (
              <button
                key={priority.value}
                onClick={() => handleFilterUpdate('priority', priority.value)}
                className={getFilterButtonClass(filters.priority === priority.value)}
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-airbnb-700 mb-3">Category</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Categories' },
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'electrical', label: 'Electrical' },
              { value: 'hvac', label: 'HVAC' },
              { value: 'appliance', label: 'Appliance' },
              { value: 'structural', label: 'Structural' },
              { value: 'other', label: 'Other' }
            ].map((category) => (
              <button
                key={category.value}
                onClick={() => handleFilterUpdate('category', category.value)}
                className={getFilterButtonClass(filters.category === category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sprint 3 Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-airbnb-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Sprint 1 Note:</strong> Filters are ready for WhatsApp integration in Sprint 3. 
            Currently showing placeholder structure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceFilters;