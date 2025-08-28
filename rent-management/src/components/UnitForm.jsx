import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createUnit, getProperties } from '../services/propertyManagementService.js';

function UnitForm() {
  const [searchParams] = useSearchParams();
  const preSelectedPropertyId = searchParams.get('propertyId');

  // form state
  const [formData, setFormData] = useState({
    propertyId: preSelectedPropertyId || '',
    unitNumber: '',
    unitType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: '',
    rentAmount: '',
    rentCurrency: 'KES',
    depositAmount: '',
    depositCurrency: 'KES',
    isAvailable: true,
    description: '',
    amenities: []
  });

  // form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // available amenities 
  const availableAmenities = [
    'Parking Space',
    'Security Guard',
    'Water Supply',
    'Electricity',
    'Internet/WiFi',
    'Kitchen',
    'Balcony',
    'Garden',
    'Swimming Pool',
    'Gym',
    'CCTV',
    'Generator Backup',
    'Servant Quarters',
    'Storage Room'
  ];

  // fetch properties for dropdown
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const { data, error } = await getProperties();

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoadingProperties(false);
    }
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // handle amenities selection
  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // form validation
  const validateForm = () => {
    const newErrors = {};

    // property selection validation
    if (!formData.propertyId) {
      newErrors.propertyId = 'Please select a property';
    }

    // unit number validation
    if (!formData.unitNumber.trim()) {
      newErrors.unitNumber = 'Unit number is required';
    }

    // rent amount validation
    if (!formData.rentAmount || formData.rentAmount <= 0) {
      newErrors.rentAmount = 'Rent amount must be greater than 0';
    } else if (formData.rentAmount > 1000000) {
      newErrors.rentAmount = 'Rent amount seems too high. Please verify.';
    }

    // deposit amount validation 
    if (formData.depositAmount && formData.depositAmount <= 0) {
      newErrors.depositAmount = 'Deposit amount must be greater than 0';
    }

    // square feet validation 
    if (formData.squareFeet && formData.squareFeet <= 0) {
      newErrors.squareFeet = 'Square feet must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the service function to create unit
      const { data, error } = await createUnit(formData);
      
      if (error) {
        alert(`Error adding unit: ${error}`);
        return;
      }
      
      alert('Unit added successfully!');
      
      // reset form
      setFormData({
        propertyId: '',
        unitNumber: '',
        unitType: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: '',
        rentAmount: '',
        rentCurrency: 'KES',
        depositAmount: '',
        depositCurrency: 'KES',
        isAvailable: true,
        description: '',
        amenities: []
      });
      
    } catch (error) {
      console.error('Error adding unit:', error);
      alert('Error adding unit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* property selection */}
        <div>
          <label htmlFor="propertyId" className="block text-sm font-medium text-airbnb-700 mb-2">
            Select Property *
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-airbnb-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red-500 focus:border-transparent transition-all duration-200 bg-white ${
              errors.propertyId ? 'border-airbnb-red-500' : 'border-airbnb-200'
            }`}
            disabled={loadingProperties}
          >
            <option value="">Select a property...</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name} - {property.address}, {property.city}, {property.county}
              </option>
            ))}
          </select>
          {errors.propertyId && (
            <p className="mt-1 text-sm text-airbnb-red-600">{errors.propertyId}</p>
          )}
          {loadingProperties && (
            <p className="mt-1 text-sm text-airbnb-500">Loading properties...</p>
          )}
        </div>

        {/* unit details row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label htmlFor="unitNumber" className="block text-sm font-medium text-airbnb-700 mb-2">
              Unit Number *
            </label>
            <input
              type="text"
              id="unitNumber"
              name="unitNumber"
              value={formData.unitNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-airbnb-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red-500 focus:border-transparent transition-all duration-200 bg-white ${
                errors.unitNumber ? 'border-airbnb-red-500' : 'border-airbnb-200'
              }`}
              placeholder="e.g., A1, 101"
            />
            {errors.unitNumber && (
              <p className="mt-1 text-sm text-airbnb-red-600">{errors.unitNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="unitType" className="block text-sm font-medium text-airbnb-700 mb-2">
              Unit Type
            </label>
            <select
              id="unitType"
              name="unitType"
              value={formData.unitType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-airbnb-200 rounded-airbnb-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
              <option value="bedsitter">Bedsitter</option>
              <option value="one_bedroom">One Bedroom</option>
              <option value="two_bedroom">Two Bedroom</option>
              <option value="three_bedroom">Three Bedroom</option>
              <option value="maisonette">Maisonette</option>
              <option value="penthouse">Penthouse</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-airbnb-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
              max="10"
              className="w-full px-4 py-3 border border-airbnb-200 rounded-airbnb-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-airbnb-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.5"
              className="w-full px-4 py-3 border border-airbnb-200 rounded-airbnb-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>
        </div>

        {/* rent and deposit row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="rentAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent (KES) *
            </label>
            <input
              type="number"
              id="rentAmount"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              min="0"
              step="100"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.rentAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 25000"
            />
            {errors.rentAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.rentAmount}</p>
            )}
          </div>

          <div>
            <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount (KES)
            </label>
            <input
              type="number"
              id="depositAmount"
              name="depositAmount"
              value={formData.depositAmount}
              onChange={handleChange}
              min="0"
              step="100"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.depositAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 50000"
            />
            {errors.depositAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.depositAmount}</p>
            )}
          </div>

          <div>
            <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-2">
              Square Feet
            </label>
            <input
              type="number"
              id="squareFeet"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.squareFeet ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 800"
            />
            {errors.squareFeet && (
              <p className="mt-1 text-sm text-red-600">{errors.squareFeet}</p>
            )}
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="rounded border-airbnb-200 text-airbnb-red-500 focus:ring-airbnb-red-500"
              />
              <span className="text-sm font-medium text-airbnb-700">Available for Rent</span>
            </label>
          </div>
        </div>

        {/* amenities section */}
        <div>
          <label className="block text-sm font-medium text-airbnb-700 mb-3">
            Available Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableAmenities.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded border-airbnb-200 text-airbnb-red-500 focus:ring-airbnb-red-500"
                />
                <span className="text-sm text-airbnb-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-airbnb-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-airbnb-200 rounded-airbnb-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red-500 focus:border-transparent transition-all duration-200 bg-white"
            placeholder="Describe the unit, its features, and any special notes..."
          />
        </div>

        {/* submit buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-airbnb-200">
          <button
            type="button"
            onClick={() => {
              setFormData({
                propertyId: '',
                unitNumber: '',
                unitType: 'apartment',
                bedrooms: 1,
                bathrooms: 1,
                squareFeet: '',
                rentAmount: '',
                rentCurrency: 'KES',
                depositAmount: '',
                depositCurrency: 'KES',
                isAvailable: true,
                description: '',
                amenities: []
              });
              setErrors({});
            }}
            className="px-6 py-3 text-airbnb-700 bg-airbnb-100 rounded-airbnb-lg hover:bg-airbnb-200 transition-all duration-200 font-semibold"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 text-white rounded-airbnb-lg transition-all duration-200 font-semibold ${
              isSubmitting 
                ? 'bg-airbnb-400 cursor-not-allowed' 
                : 'bg-airbnb-red-500 hover:bg-airbnb-red-600 shadow-airbnb hover:shadow-airbnb-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? 'Adding Unit...' : 'Add Unit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UnitForm; 