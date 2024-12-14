import React, { useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { BachelorsProducts } from "../data/productsData";
import { MastersProducts } from "../data/productsData";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const OrderDetails = () => {
  const { productId, orderId } = useParams(); // Extract productId and orderId
  const location = useLocation();
  const { user } = location.state || {}; // Safely retrieve user
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [loading, setLoading] = useState(false);
  const products = [...BachelorsProducts, ...MastersProducts];
  // Handle product display if productId is provided
  if (productId) {
    const product = products.find((prod) => prod.id === Number(productId));
    if (!product) {
      return (
        <div className="flex justify-center items-center h-screen text-xl text-red-500 font-semibold">
          Product not found.
        </div>
      );
    }

    const handleMouseMove = (e) => {
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = ((e.pageX - left) / width) * 100;
      const y = ((e.pageY - top) / height) * 100;
      setZoomOrigin({ x, y });
    };

    const handleNextImage = () => {
      setSelectedImage((prevIndex) => (prevIndex + 1) % product.images.length);
    };

    const handlePreviousImage = () => {
      setSelectedImage(
        (prevIndex) =>
          (prevIndex - 1 + product.images.length) % product.images.length
      );
    };

    return (
      <div>
        <Navbar />
        <div
          className="product_show_box max-w-7xl mx-auto  rounded-lg shadow-lg mt-10 animate-fadeIn flex justify-center items-center flex-col gap-3"
          style={{ height: "90vh" }}
        >
          <div
            className="flex flex-col lg:flex-row gap-10 items-center justify-center "
            style={{ width: "95%" }}
          >
            {/* Image Section */}
            <div
              className="relative w-full lg:w-1/2 animate-slideInLeft"
              style={{ cursor: "zoom-in" }}
            >
              <div className="relative bg-white rounded-lg shadow-md overflow-hidden group">
                <button
                  onClick={handlePreviousImage}
                  aria-label="Previous Image"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-300 p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 z-10"
                >
                  &lt;
                </button>
                <div
                  className="relative w-full p-10 py-16 h-96 overflow-hidden rounded-lg transition-all duration-500"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setZoomOrigin({ x: 50, y: 50 })}
                >
                  <img
                    src={product.images[selectedImage]}
                    alt={`${product.name} view ${selectedImage + 1}`}
                    className="w-full h-full object-contain rounded-lg transition-transform duration-500 ease-in-out transform"
                    style={{
                      transform: "scale(1.2)",
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }}
                  />
                </div>
                <button
                  onClick={handleNextImage}
                  aria-label="Next Image"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-300 p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 z-10"
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-white px-6 py-10 rounded-lg shadow-md w-full lg:w-2/3 animate-popUp">
              <h2
                className="text-4xl font-bold mb-6 animate-slideInRight"
                style={{ color: "rgb(146, 73, 146)" }}
              >
                {product.name}
              </h2>
              <p className="text-gray-700 text-lg mb-3">
                <strong>Description:</strong> {product.description}
              </p>
              <p className="text-gray-700 text-lg mb-3">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="text-gray-700 text-lg mb-3">
                <strong>Price:</strong> ${product.price}
              </p>
              <p className="text-gray-700 text-lg mb-3">
                <strong>Selected Size:</strong>{" "}
                {location.state?.selectedSize || "Not specified"}
              </p>
              <p className="text-gray-700 text-lg mb-3">
                <strong>Quantity:</strong> {location.state?.quantity || 1}
              </p>
              <p className="text-gray-700 text-lg mt-3">
                <strong>Total Price:</strong>{" "}
                {(product.price * location.state?.quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex justify-center gap-4 mt-6 animate-popUp">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-300 transform ${
                  index === selectedImage
                    ? "border-blue-500 shadow-md scale-110"
                    : "border-gray-200 hover:scale-110 hover:shadow-xl"
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle order details if orderId is provided
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500 font-semibold">
        Please log in to view the order details.
      </div>
    );
  }

  const order = user.orders.find((order) => order.id === orderId);
  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500 font-semibold">
        Order not found.
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div
        className="max-w-6xl mx-auto px-8 bg-white rounded-lg shadow-xl mt-10 flex flex-col justify-center "
        style={{
          animation: "scaleAndFade 0.8s ease-out",
          transformOrigin: "center",
          height: "90vh",
        }}
      >
        <h2
          className="text-3xl font-bold  mb-6 -mt-14"
          style={{
            animation: "fadeDown 0.8s ease-out",
            color: "rgb(146, 73, 146)",
          }}
        >
          Order ID: {order.id}
        </h2>
        <p
          className="text-gray-700 text-lg mb-2"
          style={{
            animation: "fadeDown 0.8s ease-out 0.2s",
            color: "rgb(146, 73, 146)",
          }}
        >
          <strong>Status:</strong> {order.status}
        </p>
        <p
          className="text-gray-700 text-lg mb-6"
          style={{
            animation: "fadeDown 0.8s ease-out 0.4s",
            color: "rgb(146, 73, 146)",
          }}
        >
          <strong>Date:</strong> {order.date}
        </p>

        <h3
          className="text-2xl font-semibold mt-8 text-gray-800 mb-4"
          style={{
            animation: "fadeDown 0.8s ease-out 0.6s",
          }}
        >
          Items:
        </h3>

        <div
          className="flex justify-center items-center bg-gray-100"
          style={{
            animation: "scaleAndFade 0.8s ease-out",
          }}
        >
          <table
            className="w-full max-w-6xl border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white"
            style={{
              animation: "popup 1s ease-out",
            }}
          >
            <thead>
              <tr style={{ background: "#d98780" }}>
                <th className="p-4 text-left font-semibold text-gray-800">
                  Product
                </th>
                <th className="p-4 text-left font-semibold text-gray-800">
                  Size
                </th>
                <th className="p-4 text-left font-semibold text-gray-800">
                  Quantity
                </th>
                <th className="p-4 text-left font-semibold text-gray-800">
                  Price
                </th>
                <th className="p-4 text-left font-semibold text-gray-800">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => {
                const product = products.find(
                  (prod) => prod.id === item.productId
                );
                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-200 hover:shadow-md transition-all duration-300"
                    style={{
                      animation: `fadeDown 0.8s ease-out ${index * 0.2}s`,
                    }}
                  >
                    <td className="p-4 flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <Link
                        to={`/order-details/product/${product.id}`}
                        state={{
                          selectedSize: item.selectedSize,
                          quantity: item.quantity,
                        }}
                        className="font-medium transition-all duration-300"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="p-4">{item.selectedSize}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">
                      ${(product.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;
