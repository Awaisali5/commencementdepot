// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import BachelorPage from "./pages/BachelorPage";
import MastersPage from "./pages/MastersPage";
import PhdPage from "./pages/PhdPage";
import ProductDetail from "./components/ProductDetail";
import AuthPage from "./components/auth";
import Profile from "./components/Profile";
import OrderDetails from "./pages/Cart_OrderDetailsPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import "./App.css";

const App = ({ loggedInUser, setLoggedInUser }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage loggedInUser={loggedInUser} />} />
        <Route
          path="/bachelors"
          element={<BachelorPage loggedInUser={loggedInUser} />}
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
          path="/auth"
          element={
            <AuthPage
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          }
        />
        <Route
          path="/profile/:email"
          element={
            <Profile
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          }
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
                // Update user data in state and localStorage
                setLoggedInUser(updatedData);
                localStorage.setItem(
                  "loggedInUser",
                  JSON.stringify(updatedData)
                );
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
