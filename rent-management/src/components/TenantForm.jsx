import React, { useState } from 'react';
import { createTenant } from '../services/tenantService.js';
import FormField from './FormField.jsx';

function TenantForm() {
  // form state
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phoneNumber: '',
    idNumber: '',
    emergencyContact: '',
    emergencyPhone: ''
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

    // tenant name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tenant name must be at least 2 characters';
    }

    // contact validation
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    } else if (formData.contact.trim().length < 5) {
      newErrors.contact = 'Contact information must be at least 5 characters';
    }

    // email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // phone number validation (optional but if provided, should be valid)
    if (formData.phoneNumber.trim() && !/^(\+254|0)[17]\d{8}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)';
    }

    // emergency phone validation (optional but if provided, should be valid)
    if (formData.emergencyPhone.trim() && !/^(\+254|0)[17]\d{8}$/.test(formData.emergencyPhone.trim())) {
      newErrors.emergencyPhone = 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)';
    }

    // ID number validation (optional but if provided, should be valid format)
    if (formData.idNumber.trim() && formData.idNumber.trim().length < 6) {
      newErrors.idNumber = 'ID number must be at least 6 characters';
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
      // call the service function to create tenant
      const { data, error } = await createTenant(formData);
      
      if (error) {
        alert(`Error adding tenant: ${error}`);
        return;
      }
      
      alert('Tenant added successfully!');
      
      // reset form
      setFormData({
        name: '',
        contact: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
      
    } catch (error) {
      console.error('Error adding tenant:', error);
      alert('Error adding tenant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Tenant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required={true}
          placeholder="Enter tenant's full name"
        />

        <FormField
          label="Contact Information"
          name="contact"
          type="text"
          value={formData.contact}
          onChange={handleChange}
          error={errors.contact}
          required={true}
          placeholder="Phone number or email address"
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required={true}
          placeholder="Enter email address"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            placeholder="e.g., +254712345678"
          />

          <FormField
            label="ID Number"
            name="idNumber"
            type="text"
            value={formData.idNumber}
            onChange={handleChange}
            error={errors.idNumber}
            placeholder="National ID or passport number"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Emergency Contact Name"
              name="emergencyContact"
              type="text"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Name of emergency contact person"
            />

            <FormField
              label="Emergency Contact Phone"
              name="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={handleChange}
              error={errors.emergencyPhone}
              placeholder="e.g., +254798765432"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                contact: '',
                email: '',
                phoneNumber: '',
                idNumber: '',
                emergencyContact: '',
                emergencyPhone: ''
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
            {isSubmitting ? 'Adding Tenant...' : 'Add Tenant'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TenantForm; 