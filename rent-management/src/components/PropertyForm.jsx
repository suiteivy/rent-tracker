import React, { useState } from 'react';
import { createProperty } from '../services/propertyManagementService.js';
import FormField from './FormField.jsx';

function PropertyForm() {
  // form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    county: '',
    postalCode: '',
    phoneNumber: '',
    propertyType: 'residential',
    description: ''
  });

  // form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // form validation
  const validateForm = () => {
    const newErrors = {};

    // property name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Property name must be at least 3 characters';
    }

    // address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required';
    }

    // city validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // county validation
    if (!formData.county.trim()) {
      newErrors.county = 'County is required';
    }

    // phone number validation (optional but if provided, should be valid)
    if (formData.phoneNumber.trim() && !/^(\+254|0)[17]\d{8}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)';
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
      // call the service function to create property
      const { data, error } = await createProperty(formData);
      
      if (error) {
        alert(`Error adding property: ${error}`);
        return;
      }
      
      alert('Property added successfully!');
      
      // reset form
      setFormData({
        name: '',
        address: '',
        city: '',
        county: '',
        postalCode: '',
        phoneNumber: '',
        propertyType: 'residential',
        description: ''
      });
      
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Error adding property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Property Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required={true}
          placeholder="Enter property name"
        />

        <FormField
          label="Street Address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          required={true}
          placeholder="Enter street address"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="City"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required={true}
            placeholder="e.g., Nairobi, Mombasa"
          />

          <FormField
            label="County"
            name="county"
            type="text"
            value={formData.county}
            onChange={handleChange}
            error={errors.county}
            required={true}
            placeholder="e.g., Nairobi, Mombasa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Postal Code"
            name="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="e.g., 00100 (optional)"
          />

          <FormField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            placeholder="e.g., +254712345678"
          />
        </div>

        <FormField
          label="Property Type"
          name="propertyType"
          type="select"
          value={formData.propertyType}
          onChange={handleChange}
          options={[
            { value: 'residential', label: 'Residential' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'mixed', label: 'Mixed Use' }
          ]}
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter property description (optional)"
        />

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                address: '',
                city: '',
                county: '',
                postalCode: '',
                phoneNumber: '',
                propertyType: 'residential',
                description: ''
              });
              setErrors({});
            }}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 text-white rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PropertyForm;