import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading products...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
