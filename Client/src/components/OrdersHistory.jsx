import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BachelorsProducts } from "../data/productsData"; // Import product data
import { MastersProducts } from "../data/productsData"; // Import product data
import "../styles/OrderHistory.css"; // Import styles

const OrderHistory = ({ orders, user }) => {
  const [showTable, setShowTable] = useState(false); // State to control the slide-in
  const navigate = useNavigate();
  const products = [...BachelorsProducts, ...MastersProducts];
  useEffect(() => {
    // Once the component mounts, show the table
    setShowTable(true);
  }, []);

  const getProductDetails = (productId) => {
    return products.find((product) => product.id === productId);
  };

  const handleOrderClick = (orderId) => {
    console.log("user", user);
    navigate(`/order/${orderId}`, { state: { user } }); // Navigate to order details page
  };

  return (
    <div className={`order-history-container ${showTable ? "show" : ""}`}>
      {orders?.length > 0 ? (
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className="order-row"
                onClick={() => handleOrderClick(order.id)}
              >
                <td>{order.id}</td>
                <td>
                  {order.items.map((item, i) => {
                    const product = getProductDetails(item.productId);
                    return <div key={i}>{product?.name}</div>;
                  })}
                </td>
                <td>
                  {order.items.map((item, i) => (
                    <div key={i}>{item.quantity}</div>
                  ))}
                </td>
                <td>
                  <span className={`status-tag ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-orders-message">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
