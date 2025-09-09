import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiDollarSign, FiPackage, FiTrendingUp } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { productAPI } from '../api';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';
import DeleteConfirmation from './DeleteConfirmation';
import StatsCard from './StatsCard';
import LoadingSpinner from './LoadingSpinner';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleDelete = async (product) => {
    setSelectedProduct(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await productAPI.delete(selectedProduct.id);
      toast.success('Product deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadProducts();
    toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockCount = products.filter(product => product.stock < 10).length;

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'badge-danger' };
    if (stock < 10) return { label: 'Low Stock', style: 'badge-warning' };
    return { label: 'In Stock', style: 'badge-success' };
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            </div>
            <button
              onClick={handleCreate}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiPackage className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">
                  {searchTerm ? 'No products found matching your search' : 'No products available'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {!searchTerm && 'Create your first product to get started!'}
                </p>
              </div>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Stock: {product.stock}</div>
                        <span className={`text-xs ${stockStatus.style}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(product)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiSearch className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FiEdit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={selectedProduct}
            isEditing={isEditing}
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />
        )}

        {/* Product Details Modal */}
        {showDetails && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={() => setShowDetails(false)}
            onEdit={() => {
              setShowDetails(false);
              handleEdit(selectedProduct);
            }}
            onDelete={() => {
              setShowDetails(false);
              handleDelete(selectedProduct.id);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedProduct && (
          <DeleteConfirmation
            product={selectedProduct}
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setSelectedProduct(null);
            }}
          />
        )}

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default ProductList;
