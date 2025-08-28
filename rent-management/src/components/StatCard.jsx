import React from 'react';

/**
 * Reusable stat card component for dashboard
 */
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue',
  className = '' 
}) => {
  const colorClasses = {
    blue: 'bg-airbnb-blue-100 text-airbnb-blue-600',
    green: 'bg-airbnb-green-100 text-airbnb-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-airbnb-red-100 text-airbnb-red-600',
    'airbnb-blue': 'bg-airbnb-blue-100 text-airbnb-blue-600',
    'airbnb-green': 'bg-airbnb-green-100 text-airbnb-green-600',
    'airbnb-red': 'bg-airbnb-red-100 text-airbnb-red-600',
    'airbnb': 'bg-airbnb-100 text-airbnb-600'
  };

  return (
    <div className={`bg-white rounded-airbnb-lg shadow-airbnb p-4 sm:p-6 hover:shadow-airbnb-lg transition-all duration-300 border border-airbnb-100 overflow-hidden ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses[color]} rounded-airbnb-lg flex items-center justify-center shadow-airbnb`}>
            {icon}
          </div>
        </div>
        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
          <p className="text-xs font-semibold text-airbnb-600 uppercase tracking-wide mb-1 truncate">{title}</p>
          <p className="text-lg sm:text-xl font-bold text-airbnb-900 mb-1 break-words leading-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-airbnb-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 