import React from 'react';
import { FiX, FiEdit, FiTrash2, FiDollarSign, FiPackage, FiFileText, FiTrendingUp } from 'react-icons/fi';

const ProductDetails = ({ product, onClose, onEdit, onDelete }) => {
  const stockValue = (product.price * product.stock).toFixed(2);
  
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'badge-danger', color: 'red' };
    if (stock < 10) return { label: 'Low Stock', style: 'badge-warning', color: 'yellow' };
    return { label: 'In Stock', style: 'badge-success', color: 'green' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Price and Stock */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {product.stock} units
                </div>
                <div className="text-sm text-gray-600">Stock</div>
              </div>
            </div>
          </div>

          {/* Product ID */}
          <div className="text-xs text-gray-500">
            Product ID: #{product.id}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onEdit}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <FiEdit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
