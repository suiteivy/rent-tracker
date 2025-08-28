import React from 'react';
import UnitForm from '../components/UnitForm';

function AddUnit() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-airbnb-red-100 rounded-airbnb-lg flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-airbnb-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-airbnb-900">Add New Unit</h1>
            <p className="text-airbnb-600">Add a new unit to your property portfolio</p>
          </div>
        </div>
      </div>
      
      <div className="card-airbnb p-8">
        <UnitForm />
      </div>
    </div>
  );
}

export default AddUnit; 