// src/components/StripePayment.js
import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"; // Correct import

// Load Stripe with your public key (make sure to use the public key here, not the secret key)
const stripePromise = loadStripe(
  "pk_test_51MR7j0EUXFOGFtjwa8jLD2tRyQ977rMv2uBZ5NLtHpOE0tyL6rTuW86YhgKLizN6AVDkG4niiqzdnj2JLvNpIAO800yLi0JRzL"
); // Replace with your public key

const StripePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    // Ensure Stripe and Elements are loaded
    if (!stripe || !elements) {
      alert("Stripe.js has not loaded yet.");
      return;
    }

    // Get CardElement details
    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Send payment details to the backend
    setIsProcessing(true);

    const paymentData = {
      paymentMethodId: paymentMethod.id,
      amount: 10000, // Example amount in cents ($100.00)
      currency: "usd",
      description: "Payment for Order",
    };

    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const paymentResult = await response.json();

    if (paymentResult.success) {
      alert("Payment successful!");
    } else {
      alert("Payment failed, please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-card-details">
      <h3>Payment for Order</h3>
      <form onSubmit={handlePaymentSubmit}>
        <CardElement />
        <button type="submit" disabled={isProcessing || !stripe}>
          {isProcessing ? "Processing..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

// Wrapper component that includes Stripe context via `Elements`
const StripeWrapper = () => (
  <Elements stripe={stripePromise}>
    <StripePayment />
  </Elements>
);

export default StripeWrapper;
