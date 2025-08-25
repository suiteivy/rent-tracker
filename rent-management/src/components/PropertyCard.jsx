import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPropertyType } from '../utils/formatters';

/**
 * Reusable property card component
 */
const PropertyCard = ({
  property,
  onDelete,
  onToggleExpansion,
  isExpanded,
  showUnits = false,
  units = []
}) => {
  // Defensive programming - ensure property exists
  if (!property) {
    return (
      <div className="card-airbnb p-6">
        <p className="text-airbnb-500">Property data not available</p>
      </div>
    );
  }
  const getPropertyTypeColor = (type) => {
    switch (type) {
      case 'residential':
        return 'bg-airbnb-blue-100 text-airbnb-blue-700 border border-airbnb-blue-200';
      case 'commercial':
        return 'bg-airbnb-green-100 text-airbnb-green-700 border border-airbnb-green-200';
      case 'mixed':
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      default:
        return 'bg-airbnb-100 text-airbnb-700 border border-airbnb-200';
    }
  };

  return (
    <div className="card-airbnb overflow-hidden hover:shadow-airbnb-lg transition-all duration-300">
      <div className="p-8">
        {/* Property Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-airbnb-900 mb-2">{property.name || 'Unnamed Property'}</h3>
            <div className="flex items-center space-x-4 text-airbnb-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.address || 'No address provided'}
              </span>
              {property.phone_number && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {property.phone_number}
                </span>
              )}
            </div>
          </div>
          <span className={`px-4 py-2 text-sm font-semibold rounded-airbnb-lg ${getPropertyTypeColor(property.property_type || 'residential')}`}>
            {formatPropertyType(property.property_type || 'residential')}
          </span>
        </div>
        
        {/* Location */}
        <div className="mb-6">
          <p className="text-airbnb-600 font-medium">{property.city || 'Unknown City'}, {property.county || 'Unknown County'}</p>
        </div>

        {/* Unit Statistics */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="text-center p-4 sm:p-6 bg-airbnb-blue-50 rounded-airbnb-lg border border-airbnb-blue-200 overflow-hidden">
            <p className="text-2xl sm:text-3xl font-bold text-airbnb-blue-700 leading-tight">{property.totalUnits || units.length || 0}</p>
            <p className="text-xs sm:text-sm text-airbnb-blue-600 font-semibold mt-1">Total Units</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-airbnb-green-50 rounded-airbnb-lg border border-airbnb-green-200 overflow-hidden">
            <p className="text-2xl sm:text-3xl font-bold text-airbnb-green-700 leading-tight">{property.availableUnits || units.filter(u => u.is_available).length || 0}</p>
            <p className="text-xs sm:text-sm text-airbnb-green-600 font-semibold mt-1">Available</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-airbnb-red-50 rounded-airbnb-lg border border-airbnb-red-200 overflow-hidden">
            <p className="text-2xl sm:text-3xl font-bold text-airbnb-red-700 leading-tight">{property.occupancyRate || (units.length > 0 ? Math.round(((units.length - units.filter(u => u.is_available).length) / units.length) * 100) : 0)}%</p>
            <p className="text-xs sm:text-sm text-airbnb-red-600 font-semibold mt-1">Occupancy</p>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-gradient-to-r from-airbnb-50 to-airbnb-100 rounded-airbnb-lg p-4 sm:p-6 mb-6 overflow-hidden">
          <h4 className="text-lg font-semibold text-airbnb-900 mb-4">Financial Overview</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-airbnb-600 font-medium">Monthly Rent:</span>
              <span className="text-base sm:text-lg font-bold text-airbnb-900 break-words text-right">{formatCurrency(property.totalRent || units.reduce((sum, u) => sum + (u.rent_amount || 0), 0) || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-airbnb-600 font-medium">Avg. Rent:</span>
              <span className="text-base sm:text-lg font-bold text-airbnb-900 break-words text-right">{formatCurrency(property.averageRent || (units.length > 0 ? units.reduce((sum, u) => sum + (u.rent_amount || 0), 0) / units.length : 0))}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => onToggleExpansion(property.id)}
            className="flex-1 bg-white hover:bg-airbnb-50 text-airbnb-700 border border-airbnb-200 font-semibold py-3 px-6 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-lg transform hover:-translate-y-0.5 text-center"
          >
            {isExpanded ? 'Hide Units' : `Show Units (${units.length})`}
          </button>
          <Link
            to={`/dashboard/property/${property.id}`}
            className="bg-airbnb-red-500 hover:bg-airbnb-red-600 text-white font-semibold py-3 px-6 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-lg text-center"
          >
            View Details
          </Link>
          <Link
            to={`/dashboard/add-unit?propertyId=${property.id}`}
            className="bg-airbnb-green-500 hover:bg-airbnb-green-600 text-white font-semibold py-3 px-6 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-lg"
          >
            Add Unit
          </Link>
          <button
            onClick={() => onDelete(property.id, property.name)}
            className="bg-airbnb-red-500 hover:bg-airbnb-red-600 text-white font-semibold py-3 px-6 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-lg"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Units Section */}
      {showUnits && isExpanded && (
        <div className="border-t border-airbnb-200 bg-gradient-to-br from-airbnb-50 to-airbnb-100">
          <div className="p-8">
            <h4 className="text-xl font-bold text-airbnb-900 mb-6">Units ({units.length})</h4>
            
            {units.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-airbnb-200 to-airbnb-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-airbnb-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h5 className="text-lg font-semibold text-airbnb-800 mb-2">No units added yet</h5>
                <p className="text-airbnb-600 mb-4">Start by adding your first unit to this property.</p>
                <Link
                  to={`/dashboard/add-unit?propertyId=${property.id}`}
                  className="bg-airbnb-red-500 hover:bg-airbnb-red-600 text-white font-semibold py-3 px-6 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-lg hover:shadow-airbnb-glow transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Your First Unit</span>
                </Link>
              </div>
                          ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {units.map((unit) => (
                    <Link
                      key={unit.id}
                      to={`/dashboard/unit/${unit.id}`}
                      className="card-airbnb p-6 hover:shadow-airbnb-lg transition-all duration-300 cursor-pointer block"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-bold text-airbnb-900">{unit.unit_number}</h5>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          unit.is_available 
                            ? 'bg-airbnb-green-100 text-airbnb-green-700 border border-airbnb-green-200' 
                            : 'bg-airbnb-red-100 text-airbnb-red-700 border border-airbnb-red-200'
                        }`}>
                          {unit.is_available ? 'Available' : 'Occupied'}
                        </span>
                      </div>
                    
                                          <div className="space-y-3 mb-4">
                        <p className="text-sm text-airbnb-600 capitalize font-semibold">{unit.unit_type ? unit.unit_type.replace('_', ' ') : 'Unknown Type'}</p>
                        <div className="flex items-center space-x-4 text-airbnb-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            </svg>
                            {unit.bedrooms || 0} bed
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0H4" />
                            </svg>
                            {unit.bathrooms || 0} bath
                          </span>
                        </div>
                        {unit.square_feet && (
                          <p className="text-sm text-airbnb-600">{unit.square_feet} sq ft</p>
                        )}
                      </div>
                    
                                          <div className="bg-gradient-to-r from-airbnb-50 to-airbnb-100 rounded-airbnb-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-airbnb-600 font-medium">Rent:</span>
                          <span className="text-lg font-bold text-airbnb-900">{formatCurrency(unit.rent_amount)}</span>
                        </div>
                        {unit.deposit_amount && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-airbnb-600 font-medium">Deposit:</span>
                            <span className="text-lg font-bold text-airbnb-900">{formatCurrency(unit.deposit_amount)}</span>
                          </div>
                        )}
                      </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyCard; 