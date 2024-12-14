import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { BachelorsProducts, MastersProducts } from "../data/productsData";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Ruler,
  Heart,
  Check,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/Alert";

const ProductDetail = ({ loggedInUser }) => {
  const { cartItems, addToCart } = useContext(CartContext);
  const products = [...BachelorsProducts, ...MastersProducts];
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg">
          <ShoppingBag className="w-20 h-20 mx-auto text-purple-400" />
          <p className="text-2xl text-gray-700 font-medium">
            Product not found
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const isSizeInCart = (size) => {
    return cartItems.some(
      (item) => item.productId === product.id && item.selectedSize === size
    );
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!value || parseInt(value) < 1) {
      setQuantity("");
    } else {
      setQuantity(parseInt(value));
    }
  };

  const handleQuantityBlur = () => {
    if (!quantity || quantity < 1) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError("Please select a size before adding to the cart.");
      return;
    }
    setSizeError("");
    addToCart(product, quantity, selectedSize);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Navbar loggedInUser={loggedInUser} onMenuToggle={setMenuOpen} />

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <Alert className="bg-green-50 border-green-200 text-green-800 w-96">
            <Check className="w-4 h-4 text-green-500" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              {product.name} has been added to your cart.
            </AlertDescription>
            <button
              onClick={() => setShowNotification(false)}
              className="absolute top-3 right-3 text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </Alert>
        </div>
      )}

      <main
        className={`container mx-auto px-4 py-8 transition-all duration-300 max-w-8xl ${
          isMenuOpen ? "mt-72" : "mt-8"
        }`}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-3 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-500 hover:text-purple-600 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <a
                  href="/collections"
                  className="text-gray-500 hover:text-purple-600 transition-colors"
                >
                  Collections
                </a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-purple-600 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
            <div className="flex flex-col lg:flex-row">
              {/* Left Column - Images */}
              <div className="w-full lg:w-[65%] p-8 bg-white">
                {/* Main Image Container */}
                <div className="relative w-full group">
                  <div
                    className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-white"
                    onMouseEnter={() => setIsImageZoomed(true)}
                    onMouseLeave={() => setIsImageZoomed(false)}
                  >
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className={`w-full h-full object-contain transition-all duration-300 ${
                        isImageZoomed ? "scale-110" : "scale-100"
                      }`}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (prev) =>
                            (prev - 1 + product.images.length) %
                            product.images.length
                        )
                      }
                      className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-purple-700" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (prev) => (prev + 1) % product.images.length
                        )
                      }
                      className="bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-purple-700" />
                    </button>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="mt-10">
                  <div className="grid grid-cols-8 gap-4">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden 
                          ${
                            selectedImage === index
                              ? "ring-2 ring-purple-500"
                              : "hover:ring-2 hover:ring-purple-300"
                          }
                          transition-all duration-200 transform hover:scale-105`}
                      >
                        <img
                          src={img}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-purple-500/10" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Product Info & Form */}
              <div className="lg:w-[35%] p-8 bg-white border-l border-gray-100">
                <div className="max-w-xxl">
                  {/* Product Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {product.name}
                      </h1>
                      <p className="mt-2 text-2xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsWishlist(!isWishlist)}
                      className="p-3 hover:bg-purple-50 rounded-full transition-colors group"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isWishlist
                            ? "fill-purple-500 text-purple-500"
                            : "text-gray-400 group-hover:text-purple-500"
                        } transition-colors`}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="mt-6 text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Form Section */}
                  <div className="mt-8 space-y-6">
                    {/* Quantity */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <div className="flex items-center w-36 space-x-3">
                        <button
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          className="p-2.5 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          onBlur={handleQuantityBlur}
                          className="w-full text-center border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                          min="1"
                        />
                        <button
                          onClick={() => setQuantity((prev) => prev + 1)}
                          className="p-2.5 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">
                          Size
                        </label>
                        <button
                          onClick={() => setShowSizeGuide(!showSizeGuide)}
                          className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                        >
                          <Ruler className="w-4 h-4 mr-1" />
                          Size Guide
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {product.sizeOptions.map((size, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedSize(size);
                              setSizeError("");
                            }}
                            disabled={isSizeInCart(size)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium transition-all
                              ${
                                selectedSize === size
                                  ? "bg-purple-100 border-2 border-purple-500 text-purple-700 shadow-sm"
                                  : "border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                              }
                              ${
                                isSizeInCart(size)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {sizeError && (
                        <p className="text-red-500 text-sm mt-2">{sizeError}</p>
                      )}
                    </div>

                    {showSizeGuide && (
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                        <h3 className="font-semibold text-purple-900 mb-4">
                          Size Guide
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-purple-800">
                          <div className="space-y-2">
                            <p>5'0" = 5'0" - 5'2", under 160lbs</p>
                            <p>4'9" = 4'9" - 4'11", under 160lbs</p>
                            <p>5'3" = 5'3" - 5'5", under 190lbs</p>
                            <p>5'6" = 5'6" - 5'8", under 220lbs</p>
                          </div>
                          <div className="space-y-2">
                            <p>5'9" = 5'9" - 5'11", under 250lbs</p>
                            <p>6'0" = 6'0" - 6'2", under 290lbs</p>
                            <p>6'3" = 6'3" - 6'6", under 310lbs</p>
                            <p>PS1 = Plus Size for 4'9" - 5'5"</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rental Notice */}
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <p className="text-sm text-purple-900 font-medium">
                        This graduation regalia is available for rent only and
                        must be returned after use.
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-500 
                        text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                        transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] 
                        shadow-lg hover:shadow-xl"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick and reliable shipping to ensure your graduation attire
                arrives on time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">
                Premium materials and craftsmanship for a professional
                graduation appearance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                Simple return process after your graduation ceremony.
              </p>
            </div>
          </div>

          {/* Additional Product Information */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Additional Information
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Care Instructions
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Handle with care to maintain appearance
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Store in provided garment bag
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Return in original condition
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Important Notes
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Return within 5 days of graduation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Alterations not permitted
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Photo ID required for pickup
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add to cart success animation keyframes */}
      <style jsx>{`
        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
