import React, { useContext, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Cart = ({ loggedInUser }) => {
  const { products, cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleCheckboxChange = (cartId, productId) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some(
        (item) => item.cartId === cartId && item.productId === productId
      );
      if (isSelected) {
        return prevSelected.filter(
          (item) => !(item.cartId === cartId && item.productId === productId)
        );
      } else {
        return [...prevSelected, { cartId, productId }];
      }
    });
  };

  const selectedTotalPrice = selectedItems.reduce((total, selectedItem) => {
    const cart = cartItems.find((c) => c.id === selectedItem.cartId);
    if (!cart) return total;

    const item = cart.items.find((i) => i.productId === selectedItem.productId);
    const product = products.find((prod) => prod.id === selectedItem.productId);

    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleRemoveItem = (cartId, productId) => {
    setItemToDelete({ cartId, productId });
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.cartId, itemToDelete.productId);
      setShowConfirmDelete(false);
      setItemToDelete(null);
    }
  };

  const checkout = () => {
    // Map selected items to the format expected by Payment
    const paymentItems = selectedItems.map((selectedItem) => {
      const cart = cartItems.find((cart) => cart.id === selectedItem.cartId);
      const cartItem = cart.items.find(
        (item) => item.productId === selectedItem.productId
      );
      const product = products.find((p) => p.id === selectedItem.productId);

      return {
        productId: selectedItem.productId,
        quantity: cartItem.quantity || 1, // Ensure default quantity of 1
        selectedSize: cartItem.selectedSize || "Standard", // Ensure default size
        price: product?.price || 0,
        name: product?.name || "Unknown Product",
        image: product?.images[0] || null,
      };
    });

    navigate("/payment", {
      state: {
        selectedItems: paymentItems,
        totalPrice: selectedTotalPrice,
      },
    });
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar loggedInUser={loggedInUser} />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Empty Cart Component
  const EmptyCart = () => (
    <div className="text-center py-16 animate-fadeIn">
      <div className="relative inline-block">
        <div className="text-8xl mb-4">🛒</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
          0
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-4">
        Your cart is empty
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Start shopping
        and add some awesome items!
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar loggedInUser={loggedInUser} />

      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Shopping Cart
              </h2>
              <p className="text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedItems([])}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </button>
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-6">
              {/* Products List */}
              <div className="overflow-x-auto">
                <TransitionGroup component="div" className="space-y-4">
                  {cartItems.map((cart) =>
                    cart.items.map((item) => {
                      const product = products.find(
                        (prod) => prod.id === item.productId
                      );
                      const isSelected = selectedItems.some(
                        (selected) =>
                          selected.cartId === cart.id &&
                          selected.productId === item.productId
                      );

                      return (
                        <CSSTransition
                          key={`${cart.id}-${item.productId}`}
                          timeout={300}
                          classNames="item"
                        >
                          <div
                            className={`
                            flex items-center p-6 border rounded-xl transition-all duration-200
                            ${
                              isSelected
                                ? "bg-indigo-50 border-indigo-200"
                                : "bg-white hover:shadow-md"
                            }
                          `}
                          >
                            <div className="flex items-center space-x-6 flex-grow">
                              {/* Checkbox */}
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      cart.id,
                                      item.productId
                                    )
                                  }
                                  className="w-6 h-6 text-indigo-600 rounded-lg border-gray-300 focus:ring-indigo-500 transition-all duration-200"
                                />
                              </div>

                              {/* Product Image */}
                              <Link
                                to={`/cartProduct/${product?.id}`}
                                state={{
                                  selectedSize: item.selectedSize,
                                  quantity: item.quantity,
                                }}
                                className="relative group"
                              >
                                <div className="w-32 h-32 rounded-xl overflow-hidden">
                                  <img
                                    src={
                                      product?.images[0] || "/default-image.jpg"
                                    }
                                    alt={product?.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl" />
                              </Link>

                              {/* Product Details */}
                              <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                  {product?.name || "Product not found"}
                                </h3>
                                <div className="flex items-center space-x-4 text-gray-600">
                                  <span>Size: {item.selectedSize}</span>
                                  <span>•</span>
                                  <span>Quantity: {item.quantity}</span>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    In Stock
                                  </span>
                                </div>
                              </div>

                              {/* Price and Actions */}
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800 mb-2">
                                  $
                                  {(
                                    product?.price * item.quantity || 0
                                  ).toFixed(2)}
                                </p>
                                <button
                                  onClick={() =>
                                    handleRemoveItem(cart.id, item.productId)
                                  }
                                  className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </CSSTransition>
                      );
                    })
                  )}
                </TransitionGroup>
              </div>

              {/* Cart Summary */}
              <div className="mt-8 border-t pt-8">
                <div className="max-w-md ml-auto">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Selected Items Subtotal:
                      </span>
                      <span className="font-medium">
                        ${selectedTotalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Estimate:</span>
                      <span className="font-medium">$10.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${(selectedTotalPrice + 10).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={checkout}
                    disabled={selectedItems.length === 0}
                    className={`
                      w-full py-4 rounded-xl text-white text-lg font-semibold transition-all duration-300
                      ${
                        selectedItems.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1"
                      }
                      shadow-lg hover:shadow-xl
                    `}
                  >
                    {selectedItems.length === 0
                      ? "Select items to checkout"
                      : `Checkout (${selectedItems.length} items)`}
                  </button>

                  <p className="mt-4 text-center text-sm text-gray-600">
                    Free shipping on orders over $100!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Remove Item
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
