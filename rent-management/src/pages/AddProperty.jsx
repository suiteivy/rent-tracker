import React from 'react';
import PropertyForm from '../components/PropertyForm';

function AddProperty() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <PropertyForm />
        </div>
      </div>
    </div>
  );
}

export default AddProperty; 