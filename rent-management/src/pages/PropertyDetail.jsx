import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById, getUnits, deleteProperty } from '../services/propertyManagementService.js';
import { getLeases } from '../services/leaseService.js';
import { formatCurrency, formatDate, formatPropertyType, formatPhoneNumber } from '../utils/formatters';

function PropertyDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      const [propertyResult, unitsResult, leasesResult] = await Promise.all([
        getPropertyById(propertyId),
        getUnits({ propertyId }),
        getLeases({ propertyId })
      ]);

      if (propertyResult.error) throw new Error(propertyResult.error);
      if (unitsResult.error) throw new Error(unitsResult.error);
      if (leasesResult.error) {
        console.error('Error loading leases:', leasesResult.error);
        // Don't throw error for leases, just log it
      }

      setProperty(propertyResult.data);
      setUnits(unitsResult.data || []);
      setLeases(leasesResult.data || []);
    } catch (err) {
      console.error('Error loading property details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!window.confirm(`Are you sure you want to delete "${property.name}"? This action cannot be undone and will also delete all associated units.`)) {
      return;
    }

    try {
      const result = await deleteProperty(propertyId);
      if (result.error) throw new Error(result.error);
      
      alert('Property deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting property:', err);
      alert(`Error deleting property: ${err.message}`);
    }
  };

  const getPropertyTypeColor = (type) => {
    switch (type) {
      case 'residential':
        return 'bg-blue-100 text-blue-800';
      case 'commercial':
        return 'bg-green-100 text-green-800';
      case 'mixed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUnitStatusColor = (isAvailable) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading property</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate property statistics
  const totalUnits = units.length;
  const availableUnits = units.filter(unit => unit.is_available).length;
  const totalRent = units.reduce((sum, unit) => sum + (unit.rent_amount || 0), 0);
  const averageRent = totalUnits > 0 ? totalRent / totalUnits : 0;
  const occupancyRate = totalUnits > 0 ? ((totalUnits - availableUnits) / totalUnits) * 100 : 0;

  // Calculate lease statistics
  const activeLeases = leases.filter(lease => lease.status === 'active');
  const totalActiveLeases = activeLeases.length;
  const totalMonthlyRentFromLeases = activeLeases.reduce((sum, lease) => sum + (lease.rent_amount || 0), 0);
  const averageLeaseRent = totalActiveLeases > 0 ? totalMonthlyRentFromLeases / totalActiveLeases : 0;
  const leaseOccupancyRate = totalUnits > 0 ? (totalActiveLeases / totalUnits) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-600 mt-2">{property.address}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/dashboard/add-unit?propertyId=${property.id}`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Unit
            </Link>
            <Link
              to={`/dashboard/edit-property/${property.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Property
            </Link>
            <button
              onClick={handleDeleteProperty}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Property
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Property Type</span>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPropertyTypeColor(property.property_type)}`}>
                    {formatPropertyType(property.property_type)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Address</span>
                <p className="mt-1 text-sm text-gray-900">{property.address}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Location</span>
                <p className="mt-1 text-sm text-gray-900">{property.city}, {property.county}</p>
              </div>

              {property.postal_code && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Postal Code</span>
                  <p className="mt-1 text-sm text-gray-900">{property.postal_code}</p>
                </div>
              )}

              {property.phone_number && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone Number</span>
                  <p className="mt-1 text-sm text-gray-900">{formatPhoneNumber(property.phone_number)}</p>
                </div>
              )}

              {property.description && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Description</span>
                  <p className="mt-1 text-sm text-gray-900">{property.description}</p>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-500">Created</span>
                <p className="mt-1 text-sm text-gray-900">{formatDate(property.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Property Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
                <p className="text-xs text-gray-500">Total Units</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{availableUnits}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRent)}</p>
                <p className="text-xs text-gray-500">Potential Rent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(averageRent)}</p>
                <p className="text-xs text-gray-500">Avg. Rent</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Occupancy Rate</span>
                <span className="text-sm font-semibold text-gray-900">{Math.round(occupancyRate)}%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Lease Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{totalActiveLeases}</p>
                <p className="text-xs text-gray-500">Active Leases</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{leases.length}</p>
                <p className="text-xs text-gray-500">Total Leases</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalMonthlyRentFromLeases)}</p>
                <p className="text-xs text-gray-500">Monthly Income</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(averageLeaseRent)}</p>
                <p className="text-xs text-gray-500">Avg. Lease Rent</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Lease Occupancy</span>
                <span className="text-sm font-semibold text-gray-900">{Math.round(leaseOccupancyRate)}%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${leaseOccupancyRate}%` }}
                ></div>
              </div>
            </div>

            {totalActiveLeases > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Income vs Potential</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalRent > 0 ? Math.round((totalMonthlyRentFromLeases / totalRent) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${totalRent > 0 ? (totalMonthlyRentFromLeases / totalRent) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          </div>
          
          {/* Units List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Units ({totalUnits})</h2>
              <Link
                to={`/dashboard/add-unit?propertyId=${property.id}`}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Add Unit
              </Link>
            </div>

            {totalUnits === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No units yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first unit.</p>
                <div className="mt-6">
                  <Link
                    to={`/dashboard/add-unit?propertyId=${property.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Add Unit
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {units.map((unit) => (
                  <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{unit.unit_number}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUnitStatusColor(unit.is_available)}`}>
                            {unit.is_available ? 'Available' : 'Occupied'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <p className="font-medium capitalize">{unit.unit_type.replace('_', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Bedrooms:</span>
                            <p className="font-medium">{unit.bedrooms}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Bathrooms:</span>
                            <p className="font-medium">{unit.bathrooms}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rent:</span>
                            <p className="font-medium">{formatCurrency(unit.rent_amount)}</p>
                          </div>
                        </div>

                        {/* Show current tenant if unit is leased */}
                        {!unit.is_available && (
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Current Tenant: </span>
                            <span className="text-sm font-medium text-green-600">
                              {activeLeases.find(lease => lease.unit_id === unit.id)?.tenants?.name || 'Unknown'}
                            </span>
                          </div>
                        )}

                        {unit.square_feet && (
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Size: </span>
                            <span className="text-sm font-medium">{unit.square_feet} sq ft</span>
                          </div>
                        )}

                        {unit.description && (
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Description: </span>
                            <span className="text-sm">{unit.description}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Link
                          to={`/dashboard/unit/${unit.id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                        {unit.is_available && (
                          <Link
                            to={`/dashboard/add-lease?unitId=${unit.id}`}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Add Lease
                          </Link>
                        )}
                        <Link
                          to={`/dashboard/edit-unit/${unit.id}`}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail; 