import React from "react";

const CashOnDelivery = () => {
  const handleCashOnDelivery = () => {
    alert("Cash on Delivery selected.");
  };

  return (
    <div>
      <h3>Cash on Delivery</h3>
      <p>Pay upon delivery.</p>
      <button onClick={handleCashOnDelivery}>Confirm Order</button>
    </div>
  );
};

export default CashOnDelivery;
