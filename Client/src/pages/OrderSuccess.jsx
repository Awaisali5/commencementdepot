import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderSuccess = ({ loggedInUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    orderId,
    totalAmount,
    shippingAddress,
    items,
    paymentStatus: initialPaymentStatus,
  } = location.state || {};

  // States
  const [showContent, setShowContent] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ sent: false, error: null });
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(
    initialPaymentStatus || "Pending"
  );

  // Helper functions
  const formatPrice = (price) => Number(price).toFixed(2);

  const getPaymentStatusStyles = (status) => {
    const styles = {
      Paid: "bg-green-100 text-green-800 border border-green-300",
      "Cash on Delivery": "bg-blue-100 text-blue-800 border border-blue-300",
      Failed: "bg-red-100 text-red-800 border border-red-300",
    };
    return styles[status] || styles["Cash on Delivery"];
  };

  const getPaymentIcon = (status) => {
    switch (status) {
      case "Paid":
        return "✓";
      case "Failed":
        return "✕";
      case "Cash on Delivery":
        return "💵";
      default:
        return "💵";
    }
  };

  const getPaymentIconStyles = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-600";
      case "Failed":
        return "bg-red-100 text-red-600";
      case "Cash on Delivery":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  useEffect(() => {
    // Redirect if no order data or user not logged in
    if (!orderId || !loggedInUser) {
      navigate("/");
      return;
    }

    // Send confirmation email
    const sendConfirmationEmail = async () => {
      try {
        const response = await fetch("http://localhost:5000/confirm-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderDetails: {
              orderId,
              totalAmount,
              items,
              shippingAddress,
              paymentStatus,
              orderDate: new Date().toISOString(),
            },
            customerEmail: loggedInUser.email,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setEmailStatus({ sent: true, error: null });
          // Update payment status if returned from server
          if (data.paymentStatus) {
            setPaymentStatus(data.paymentStatus);
          }
          console.log("Order confirmation email sent successfully");
        } else {
          throw new Error(data.error || "Failed to send email");
        }
      } catch (error) {
        console.error("Error sending confirmation email:", error);
        setEmailStatus({ sent: false, error: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    // Send email only if not already sent
    if (!emailStatus.sent && orderId) {
      sendConfirmationEmail();
    }

    // Show content with animation delay
    setTimeout(() => setShowContent(true), 300);
  }, [
    orderId,
    loggedInUser,
    totalAmount,
    items,
    shippingAddress,
    paymentStatus,
    navigate,
    emailStatus.sent,
  ]);

  // Loading state
  if (!orderId || !loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar loggedInUser={loggedInUser} />

      <div className="flex-grow container mx-auto px-4 py-8">
        <div
          className={`
            max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden
            transform transition-all duration-500
            ${
              showContent
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
        >
          {/* Order Success Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
            <div className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getPaymentIconStyles(
                  paymentStatus
                )}`}
              >
                <span className="text-2xl">
                  {getPaymentIcon(paymentStatus)}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Order Successfully Placed!
              </h1>
              <p className="mt-2 text-gray-600">Thank you for your purchase!</p>
              {isLoading ? (
                <p className="mt-2 text-sm text-gray-500">
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Sending confirmation email...
                </p>
              ) : emailStatus.sent ? (
                <p className="mt-2 text-sm text-green-600">
                  <span className="mr-2">✉️</span>A confirmation email has been
                  sent to your email address.
                </p>
              ) : (
                emailStatus.error && (
                  <p className="mt-2 text-sm text-red-600">
                    <span className="mr-2">⚠️</span>
                    {emailStatus.error}
                  </p>
                )
              )}
            </div>
          </div>

          {/* Order Information */}
          <div className="p-8">
            {/* Order Summary Box */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-medium text-gray-900">
                    {orderId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-green-600">
                    ${formatPrice(totalAmount)}
                  </p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusStyles(
                      paymentStatus
                    )}`}
                  >
                    {paymentStatus}
                  </span>
                </div>
                {paymentStatus === "Pending" && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      Your order is pending payment. Please complete the payment
                      to process your order.
                    </p>
                  </div>
                )}
                {paymentStatus === "Failed" && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800">
                      Payment failed. Please try again or contact support for
                      assistance.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            {items && items.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-20 h-20 flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Quantity: {item.quantity}</p>
                          {item.selectedSize && (
                            <p>Size: {item.selectedSize}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {shippingAddress && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 font-medium">
                        {shippingAddress.fullName}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {shippingAddress.addressLine1}
                      </p>
                      <p className="text-gray-600">
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.zip}
                      </p>
                      <p className="text-gray-600">{shippingAddress.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">
                        <span className="font-medium">Contact: </span>
                        {shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to={`/profile/${loggedInUser?.email}`}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition-colors"
              >
                View Orders
              </Link>
            </div>

            {/* Additional Information */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-start text-sm text-gray-500">
                <div>
                  <p>Estimated delivery time:</p>
                  <p className="font-medium text-gray-900">3-5 business days</p>
                </div>
                <div className="text-right">
                  <p>Need help?</p>
                  <a
                    href="mailto:support@example.com"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    support@commencementdepot.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
