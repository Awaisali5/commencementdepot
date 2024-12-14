import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { MastersProducts as products } from "../data/productsData";

const categories = [
  { id: "all", label: "View All" },
  { id: "gown", label: "Graduation Gowns" },
  { id: "cap", label: "Academic Caps" },
  { id: "hood", label: "Academic Hoods" },
  { id: "tassel", label: "Classic Tassels" },
];

const MastersPage = ({ loggedInUser }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const navigate = useNavigate();

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory;
    const matchesPrice = product.price <= priceRange;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return 0;
  });

  const handleViewProduct = (e, productId) => {
    e.preventDefault();
    navigate(`/product/${productId}`);
  };

  const ProductCard = ({ product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-sm group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className="relative overflow-hidden cursor-pointer"
        onClick={(e) => handleViewProduct(e, product.id)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-52 object-cover rounded-t-lg transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-sm font-medium mb-1">View Details</p>
              <div className="h-0.5 w-6 bg-white/70"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
          </div>
          <span className="text-sm font-semibold text-blue-600">
            ${product.price}
          </span>
        </div>
        <button
          className="w-full py-2 px-4 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 text-sm rounded-md transition-colors duration-300"
          onClick={(e) => handleViewProduct(e, product.id)}
        >
          View Product
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar loggedInUser={loggedInUser} onMenuToggle={setMenuOpen} />

      {/* Banner Section */}
      <div className="relative h-[28vh] mb-8 overflow-hidden">
        <img
          src="/MastersBg.jpg"
          alt="Masters Graduation ceremony"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/75 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-light text-white mb-4"
              >
                Master's <span className="font-medium">Collection</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative max-w-md"
              >
                <input
                  type="text"
                  placeholder="Search our collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 rounded-lg bg-white/95 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 pr-12"
                />
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mb-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-4 min-w-[220px]">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Price Range: ${priceRange}
                </span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="flex-grow accent-blue-600"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-sm text-gray-600">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MastersPage;
