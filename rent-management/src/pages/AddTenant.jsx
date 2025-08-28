import React from 'react';
import TenantForm from '../components/TenantForm';

function AddTenant() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <TenantForm />
        </div>
      </div>
    </div>
  );
}

export default AddTenant; 