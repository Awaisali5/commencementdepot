import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { saveOrderToFirebase } from "../firebase";
import { loadStripe } from "@stripe/stripe-js";

// const API_URL = import.meta.evn.API_URL || "http://localhost:5000";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51MR7j0EUXFOGFtjwa8jLD2tRyQ977rMv2uBZ5NLtHpOE0tyL6rTuW86YhgKLizN6AVDkG4niiqzdnj2JLvNpIAO800yLi0JRzL"
);

// Order Summary Item Component
const OrderSummaryItem = ({ item, product }) => {
  if (!item || !product) return null;

  return (
    <div className="flex gap-4 border-b pb-4">
      <img
        src={product?.images[0] || "/placeholder.svg?height=80&width=80"}
        alt={product?.name || "Unknown Product"}
        className="h-20 w-20 rounded-md object-cover"
      />
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">
              {product?.name || "Product Not Found"}
            </h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 font-medium mr-2">
                  Size:
                </span>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                  {item.selectedSize || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 font-medium mr-2">
                  Quantity:
                </span>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                  {item.quantity || 0}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">
              ${((product?.price || 0) * (item.quantity || 1)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              ${product?.price?.toFixed(2) || "0.00"} × {item.quantity || 1}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// PaymentForm Component
const PaymentForm = ({
  loggedInUser,
  selectedItems,
  totalPrice,
  shippingFee,
  discount,
  shippingAddress,
  selectedPaymentMethod,
  handlePaymentSuccess,
  setError,
  discountCode,
  setDiscountCode,
  handleApplyDiscount,
  handleAddressChange,
  setSelectedPaymentMethod,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        `http://46.202.178.147/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [
              {
                amount:
                  Number(totalPrice) + Number(shippingFee) - Number(discount),
                description: `Order for ${loggedInUser.email}`,
              },
            ],
          }),
        }
      );

      

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      console.log(clientSecret)
      alert(clientSecret)

      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shippingAddress.fullName,
              email: loggedInUser.email,
              address: {
                line1: shippingAddress.addressLine1,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.zip,
                country: shippingAddress.country,
              },
            },
          },
        });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent.status === "succeeded") {
        await handlePaymentSuccess("Paid");
      } else {
        await handlePaymentSuccess("Pending");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setError(error.message);
      await handlePaymentSuccess("Pending");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedPaymentMethod === "Stripe") {
      await handleStripePayment();
    } else {
      await handlePaymentSuccess("Pending");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {/* Shipping Address Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="block font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleAddressChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block font-medium">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={shippingAddress.phone}
            onChange={handleAddressChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="addressLine1" className="block font-medium">
            Address
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            value={shippingAddress.addressLine1}
            onChange={handleAddressChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="city" className="block font-medium">
              City
            </label>
            <input
              id="city"
              name="city"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="state" className="block font-medium">
              State
            </label>
            <input
              id="state"
              name="state"
              value={shippingAddress.state}
              onChange={handleAddressChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="zip" className="block font-medium">
              ZIP Code
            </label>
            <input
              id="zip"
              name="zip"
              value={shippingAddress.zip}
              onChange={handleAddressChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="country" className="block font-medium">
              Country
            </label>
            <input
              id="country"
              name="country"
              value={shippingAddress.country}
              onChange={handleAddressChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Payment Method</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={selectedPaymentMethod === "Cash on Delivery"}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600"
              required
            />
            <label htmlFor="cod" className="ml-2">
              Cash on Delivery
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="stripe"
              name="paymentMethod"
              value="Stripe"
              checked={selectedPaymentMethod === "Stripe"}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600"
              required
            />
            <label htmlFor="stripe" className="ml-2">
              Credit Card (Stripe)
            </label>
          </div>
        </div>
      </div>

      {/* Stripe Card Element */}
      {selectedPaymentMethod === "Stripe" && (
        <div className="space-y-2">
          <label htmlFor="card-element" className="block font-medium">
            Credit Card Details
          </label>
          <div className="rounded-md border p-3 shadow-sm">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1f2937",
                    "::placeholder": {
                      color: "#6b7280",
                    },
                  },
                  invalid: {
                    color: "#ef4444",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Discount Code */}
      <div className="flex gap-2">
        <input
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          type="button"
          onClick={handleApplyDiscount}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Apply
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        disabled={
          isProcessing || (selectedPaymentMethod === "Stripe" && !stripe)
        }
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
};

// Main Payment Component
const Payment = ({ loggedInUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, clearCart } = useContext(CartContext);

  // Get selected items and total from location state
  const { selectedItems = [], totalPrice = 0 } = location.state || {};

  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [shippingFee] = useState(10.0);
  const [discount, setDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Cash on Delivery");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  // Debug logs
  useEffect(() => {
    console.log("Location State:", location.state);
    console.log("Selected Items:", selectedItems);
    console.log("Products:", products);
  }, [location.state, selectedItems, products]);

  useEffect(() => {
    if (loggedInUser) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: loggedInUser.name || loggedInUser.displayName || "",
        phone: loggedInUser.phone || "",
        addressLine1: loggedInUser.address1 || "",
        city: loggedInUser.city || "",
        state: loggedInUser.state || "",
        zip: loggedInUser.zipCode || "",
        country: loggedInUser.country || "",
      }));
    }
  }, [loggedInUser]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "SAVE10") {
      setDiscount(10);
      setError(null);
      alert("Discount applied successfully!");
    } else {
      setDiscount(0);
      setError("Invalid discount code.");
    }
  };

  const validateFields = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "zip",
      "country",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !shippingAddress[field]?.trim()
    );

    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(", ")}`);
      return false;
    }

    if (!selectedPaymentMethod) {
      setError("Please select a payment method!");
      return false;
    }

    return true;
  };

  const handlePaymentSuccess = async (paymentStatus = "Pending") => {
    try {
      if (!validateFields()) {
        return;
      }

      const finalPrice =
        Number(totalPrice) + Number(shippingFee) - Number(discount);

      const orderItems = selectedItems.map((selected) => {
        const product = products.find((p) => p.id === selected.productId);
        return {
          productId: selected.productId,
          quantity: selected.quantity,
          selectedSize: selected.selectedSize,
          price: product ? product.price : 0,
          name: product ? product.name : "Unknown Product",
          image: product ? product.images[0] : null,
        };
      });

      // Create the order data object
      const orderData = {
        userId: loggedInUser.email,
        userEmail: loggedInUser.email,
        userName: loggedInUser.name || loggedInUser.displayName,
        shippingAddress,
        items: orderItems,
        totalAmount: finalPrice.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        discount: discount.toFixed(2),
        subtotal: totalPrice.toFixed(2),
        status: paymentStatus === "Paid" ? "Processing" : "Pending",
        paymentMethod: selectedPaymentMethod,
        paymentStatus: paymentStatus,
        orderDate: new Date().toISOString(),
        createdAt: new Date(),
      };

      // Save order to Firebase
      const orderId = await saveOrderToFirebase(orderData);

      if (orderId) {
        clearCart();
        navigate("/order-success", {
          state: {
            orderId,
            totalAmount: finalPrice.toFixed(2),
            shippingAddress,
            items: orderItems,
            paymentStatus: paymentStatus,
          },
        });
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setError(error.message);
    }
  };

  const finalPrice = (
    Number(totalPrice) +
    Number(shippingFee) -
    Number(discount)
  ).toFixed(2);

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar loggedInUser={loggedInUser} />
        <div className="flex-grow p-6 mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Order Summary */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, index) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <OrderSummaryItem
                        key={index}
                        item={item}
                        product={product}
                      />
                    );
                  })
                ) : (
                  <p>No items in the order.</p>
                )}

                {/* Price Summary */}
                <div className="space-y-2 pt-4 mt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${Number(totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span>${shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-red-600">
                      - ${discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total:</span>
                    <span>${finalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* Payment Form */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-bold mb-4">Shipping & Payment</h2>
              <PaymentForm
                loggedInUser={loggedInUser}
                selectedItems={selectedItems}
                totalPrice={totalPrice}
                shippingFee={shippingFee}
                discount={discount}
                shippingAddress={shippingAddress}
                selectedPaymentMethod={selectedPaymentMethod}
                handlePaymentSuccess={handlePaymentSuccess}
                setError={setError}
                discountCode={discountCode}
                setDiscountCode={setDiscountCode}
                handleApplyDiscount={handleApplyDiscount}
                handleAddressChange={handleAddressChange}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Elements>
  );
};

export default Payment;
