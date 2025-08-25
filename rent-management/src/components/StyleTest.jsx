import React from 'react';

const StyleTest = () => {
  return (
    <div className="p-8 bg-airbnb-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-airbnb-900 mb-8">Style Test</h1>
        
        {/* Test Airbnb Colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-airbnb-red-500 text-white p-4 rounded-airbnb-lg text-center">
            Airbnb Red
          </div>
          <div className="bg-airbnb-blue-500 text-white p-4 rounded-airbnb-lg text-center">
            Airbnb Blue
          </div>
          <div className="bg-airbnb-green-500 text-white p-4 rounded-airbnb-lg text-center">
            Airbnb Green
          </div>
          <div className="bg-airbnb-500 text-white p-4 rounded-airbnb-lg text-center">
            Airbnb Gray
          </div>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card-airbnb p-6">
            <h3 className="text-xl font-bold text-airbnb-900 mb-4">Card Test</h3>
            <p className="text-airbnb-600">This should have Airbnb styling</p>
          </div>
          <div className="card-airbnb p-6">
            <h3 className="text-xl font-bold text-airbnb-900 mb-4">Inline Test</h3>
            <p className="text-airbnb-600">This uses inline classes</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="btn-airbnb-primary">
            Primary Button
          </button>
          <button className="btn-airbnb-secondary">
            Secondary Button
          </button>
          <button className="btn-airbnb-success">
            Success Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleTest; 