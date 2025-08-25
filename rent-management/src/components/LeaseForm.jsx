import React, { useState, useEffect } from 'react';
import { createLease } from '../services/leaseService.js';
import { getTenants } from '../services/tenantService.js';
import { getUnits } from '../services/propertyManagementService.js';
import FormField from './FormField.jsx';

function LeaseForm() {
  // form state
  const [formData, setFormData] = useState({
    unitId: '',
    tenantId: '',
    rentAmount: '',
    rentCurrency: 'KES',
    rentFrequency: 'monthly',
    dueDate: 1,
    startDate: '',
    endDate: '',
    depositAmount: '',
    depositCurrency: 'KES',
    status: 'active',
    notes: ''
  });

  // form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // loading state
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    setLoadingData(true);
    setDataError('');

    try {
      // load data
      const [tenantsResult, unitsResult] = await Promise.all([
        getTenants(),
        getUnits()
      ]);

      if (tenantsResult.error) {
        throw new Error(`Failed to load tenants: ${tenantsResult.error}`);
      }

      if (unitsResult.error) {
        throw new Error(`Failed to load units: ${unitsResult.error}`);
      }

      setTenants(tenantsResult.data || []);
      setUnits(unitsResult.data || []);
    } catch (error) {
      console.error('Error loading form data:', error);
      setDataError(error.message);
    } finally {
      setLoadingData(false);
    }
  };

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

    // unit validation
    if (!formData.unitId) {
      newErrors.unitId = 'Please select a unit';
    }

    // tenant validation
    if (!formData.tenantId) {
      newErrors.tenantId = 'Please select a tenant';
    }

    // rent amount validation
    if (!formData.rentAmount) {
      newErrors.rentAmount = 'Rent amount is required';
    } else if (parseFloat(formData.rentAmount) <= 0) {
      newErrors.rentAmount = 'Rent amount must be greater than 0';
    }

    // date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // due date validation
    if (formData.dueDate < 1 || formData.dueDate > 31) {
      newErrors.dueDate = 'Due date must be between 1 and 31';
    }

    // deposit amount validation (optional but if provided, should be valid)
    if (formData.depositAmount && parseFloat(formData.depositAmount) < 0) {
      newErrors.depositAmount = 'Deposit amount cannot be negative';
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
      // prepare data for submission
      const leaseData = {
        ...formData,
        rentAmount: parseFloat(formData.rentAmount),
        dueDate: parseInt(formData.dueDate),
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : null
      };

      // call the service function to create lease
      const { data, error } = await createLease(leaseData);
      
      if (error) {
        alert(`Error adding lease: ${error}`);
        return;
      }
      
      alert('Lease added successfully!');
      
      // reset form
      setFormData({
        unitId: '',
        tenantId: '',
        rentAmount: '',
        rentCurrency: 'KES',
        rentFrequency: 'monthly',
        dueDate: 1,
        startDate: '',
        endDate: '',
        depositAmount: '',
        depositCurrency: 'KES',
        status: 'active',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error adding lease:', error);
      alert('Error adding lease. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // get available units (not currently leased)
  const getAvailableUnits = () => {
    return units.filter(unit => unit.is_available);
  };

  // loading state
  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Lease</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }

  // error state
  if (dataError) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Lease</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading form data</h3>
              <div className="mt-2 text-sm text-red-700">{dataError}</div>
              <button
                onClick={loadFormData}
                className="mt-3 text-sm text-red-800 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Lease</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit and Tenant Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Select Unit"
            name="unitId"
            type="select"
            value={formData.unitId}
            onChange={handleChange}
            error={errors.unitId}
            required={true}
            options={[
              { value: '', label: 'Choose a unit...' },
              ...getAvailableUnits().map(unit => ({
                value: unit.id,
                label: `${unit.unit_number} - ${unit.properties?.name || 'Unknown Property'}`
              }))
            ]}
          />

          <FormField
            label="Select Tenant"
            name="tenantId"
            type="select"
            value={formData.tenantId}
            onChange={handleChange}
            error={errors.tenantId}
            required={true}
            options={[
              { value: '', label: 'Choose a tenant...' },
              ...tenants.map(tenant => ({
                value: tenant.id,
                label: `${tenant.name} (${tenant.email})`
              }))
            ]}
          />
        </div>

        {/* Rent Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Rent Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Rent Amount"
              name="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={handleChange}
              error={errors.rentAmount}
              required={true}
              placeholder="0.00"
              min="0"
              step="0.01"
            />

            <FormField
              label="Currency"
              name="rentCurrency"
              type="select"
              value={formData.rentCurrency}
              onChange={handleChange}
              options={[
                { value: 'KES', label: 'KES' },
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' }
              ]}
            />

            <FormField
              label="Frequency"
              name="rentFrequency"
              type="select"
              value={formData.rentFrequency}
              onChange={handleChange}
              options={[
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' }
              ]}
            />
          </div>

          <div className="mt-4">
            <FormField
              label="Due Date (Day of Month)"
              name="dueDate"
              type="number"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
              min="1"
              max="31"
              placeholder="1"
            />
          </div>
        </div>

        {/* Lease Dates */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Lease Period</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required={true}
            />

            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              required={true}
            />
          </div>
        </div>

        {/* Deposit Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Deposit Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Deposit Amount"
              name="depositAmount"
              type="number"
              value={formData.depositAmount}
              onChange={handleChange}
              error={errors.depositAmount}
              placeholder="0.00 (optional)"
              min="0"
              step="0.01"
            />

            <FormField
              label="Deposit Currency"
              name="depositCurrency"
              type="select"
              value={formData.depositCurrency}
              onChange={handleChange}
              options={[
                { value: 'KES', label: 'KES' },
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' }
              ]}
            />
          </div>
        </div>

        {/* Lease Status and Notes */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Lease Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'expired', label: 'Expired' },
                { value: 'terminated', label: 'Terminated' }
              ]}
            />
          </div>

          <div className="mt-4">
            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the lease (optional)"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setFormData({
                unitId: '',
                tenantId: '',
                rentAmount: '',
                rentCurrency: 'KES',
                rentFrequency: 'monthly',
                dueDate: 1,
                startDate: '',
                endDate: '',
                depositAmount: '',
                depositCurrency: 'KES',
                status: 'active',
                notes: ''
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
            {isSubmitting ? 'Adding Lease...' : 'Add Lease'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeaseForm; 