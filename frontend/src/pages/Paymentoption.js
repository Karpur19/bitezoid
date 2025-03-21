import React from "react";
import { useHistory } from "react-router-dom";

const PaymentOptions = () => {
  const history = useHistory();

  // Function to handle different payment methods
  const handlePaymentMethod = (method) => {
    // For now, simply navigate to an order confirmation page with the selected method
    history.push(`/order-confirmation/${method}`);
  };

  return (
    <div className="payment-options">
      <h2>Select Payment Method</h2>
      <div className="payment-option">
        <button onClick={() => handlePaymentMethod("upi")}>
          Pay with UPI
        </button>
      </div>
      <div className="payment-option">
        <button onClick={() => handlePaymentMethod("credit-card")}>
          Pay with Credit/Debit Card
        </button>
      </div>
      <div className="payment-option">
        <button onClick={() => handlePaymentMethod("cod")}>
          Cash on Delivery
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
