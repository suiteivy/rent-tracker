import React from 'react';
import LeaseForm from '../components/LeaseForm';

function AddLease() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <LeaseForm />
        </div>
      </div>
    </div>
  );
}

export default AddLease; 