import React from 'react';
import FormField from './FormField';

/**
 * Property filters component
 */
const PropertyFilters = ({ filters, onFilterChange, counties, cities }) => {
  const propertyTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const countyOptions = [
    { value: '', label: 'All Counties' },
    ...counties.map(county => ({ value: county, label: county }))
  ];

  const cityOptions = [
    { value: '', label: 'All Cities' },
    ...cities.map(city => ({ value: city, label: city }))
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="card-airbnb p-10">
      <div className="flex items-center mb-8">
        <div className="w-14 h-14 bg-airbnb-red-100 rounded-airbnb-lg flex items-center justify-center mr-5">
          <svg className="w-7 h-7 text-airbnb-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-airbnb-900">Filter Properties</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FormField
          label="Search"
          name="search"
          type="text"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search properties..."
        />
        
        <FormField
          label="County"
          name="county"
          type="select"
          value={filters.county}
          onChange={handleChange}
          options={countyOptions}
        />
        
        <FormField
          label="City"
          name="city"
          type="select"
          value={filters.city}
          onChange={handleChange}
          options={cityOptions}
        />
        
        <FormField
          label="Property Type"
          name="propertyType"
          type="select"
          value={filters.propertyType}
          onChange={handleChange}
          options={propertyTypeOptions}
        />
      </div>
    </div>
  );
};

export default PropertyFilters; 