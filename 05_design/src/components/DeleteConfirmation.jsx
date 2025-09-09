import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmation = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Product</h2>
          <p className="text-gray-600">
            Are you sure you want to delete "{product?.name}"? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
