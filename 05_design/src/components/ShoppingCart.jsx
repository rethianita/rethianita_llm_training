import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiX, FiTrash2, FiMinus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { cartAPI } from '../api';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getAll();
      setCartItems(response.data);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      toast.success('Item removed from cart');
      loadCartItems();
    } catch (error) {
      toast.error('Failed to remove item from cart');
      console.error('Error removing item from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      toast.success('Cart cleared');
      loadCartItems();
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Error clearing cart:', error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <>
      {/* Cart Button - Fixed position at bottom left */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center relative"
        >
          <FiShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsOpen(false)} />
            <div className="fixed inset-y-0 left-0 pr-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-6 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Cart Content */}
                  <div className="flex-1 py-6 overflow-y-auto px-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <FiShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                              >
                                <FiTrash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                            
                            {item.product.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {item.product.description}
                              </p>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Qty:</span>
                                <span className="font-medium">{item.quantity}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  ${item.product.price.toFixed(2)} each
                                </div>
                                <div className="font-bold text-gray-900">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-6 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-gray-900">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <button
                          onClick={clearCart}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Clear Cart
                        </button>
                        
                        <button
                          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                          onClick={() => toast.info('Checkout functionality not implemented yet')}
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;
