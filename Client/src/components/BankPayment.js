import React from "react";

const BankPayment = () => {
  const handleBankTransfer = () => {
    alert("Bank transfer selected.");
  };

  return (
    <div>
      <h3>Bank Transfer</h3>
      <p>Transfer the payment to the following account:</p>
      <p>Account Name: XYZ</p>
      <button onClick={handleBankTransfer}>Confirm Bank Transfer</button>
    </div>
  );
};

export default BankPayment;
