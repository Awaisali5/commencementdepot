import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home"; // Correct path
import BachelorPage from "./pages/BachelorPage"; // Correct path
import MastersPage from "./pages/MastersPage"; // Correct path
import PhdPage from "./pages/PhdPage"; // Correct path
import ProductDetail from "./components/ProductDetail"; // Correct path
import AuthPage from "./components/auth"; // Correct path
import OrderDetails from "./pages/Cart_OrderDetailsPage"; // Correct path
import CompleteProfilePage from "./pages/CompleteProfilePage"; // Correct path
import EditProfilePage from "./pages/EditProfilePage"; // Correct path
import Cart from "./components/Cart"; // Correct path
import ForgotPassword from "./components/ForgotPassword"; // Correct path
import ProfilePage from "./components/Profile"; // Correct path
import Payment from "./components/Payment"; // Correct path
import StripePayment from "./components/StripePayment"; // Correct path
import LoginPage from "./components/LoginPage"; // Correct path
import OrderSuccess from "./pages/OrderSuccess"; // Correct path
import "./App.css"; // Correct path for CSS

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("loggedInUser"));
      setLoggedInUser(userData || null);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }
  }, [loggedInUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your application...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage loggedInUser={loggedInUser} />} />
        <Route
          path="/bachelors"
          element={<BachelorPage loggedInUser={loggedInUser} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profile/:email"
          element={
            <ProfilePage
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          }
        />
        <Route
          path="/masters"
          element={<MastersPage loggedInUser={loggedInUser} />}
        />
        <Route path="/phd" element={<PhdPage loggedInUser={loggedInUser} />} />
        <Route
          path="/product/:id"
          element={<ProductDetail loggedInUser={loggedInUser} />}
        />
        <Route path="/cart" element={<Cart loggedInUser={loggedInUser} />} />
        <Route
          path="/payment"
          element={<Payment loggedInUser={loggedInUser} />}
        />
        <Route
          path="/order-success"
          element={<OrderSuccess loggedInUser={loggedInUser} />}
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          }
        />
        <Route
          path="/login"
          element={<LoginPage setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="/edit-profile/:email"
          element={<EditProfilePage loggedInUser={loggedInUser} />}
        />
        <Route
          path="/order/:orderId"
          element={<OrderDetails loggedInUser={loggedInUser} />}
        />
        <Route
          path="/cartProduct/:productId"
          element={<OrderDetails loggedInUser={loggedInUser} />}
        />
        <Route
          path="/order-details/product/:productId"
          element={<OrderDetails />}
        />
        <Route
          path="/complete-profile"
          element={
            <CompleteProfilePage
              loggedInUser={loggedInUser}
              updateUser={(updatedData) => {
                setLoggedInUser(updatedData);
                localStorage.setItem(
                  "loggedInUser",
                  JSON.stringify(updatedData)
                );
              }}
            />
          }
        />
        <Route
          path="*"
          element={
            <div className="text-center">
              Page Not Found. <a href="/">Go to Home</a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
