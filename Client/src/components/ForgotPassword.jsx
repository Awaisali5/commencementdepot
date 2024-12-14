// src/components/ForgotPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase"; // Import auth from firebase.js
import Menu from "./Navbar.jsx"; // Import Menu component
import Footer from "./Footer.jsx"; // Import Footer component

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter your email address.");
      setSuccessMessage(""); // Clear any previous success messages
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent successfully!");
      setErrorMessage(""); // Clear any previous error messages
      setEmail(""); // Optionally clear the email field after success
    } catch (error) {
      setSuccessMessage(""); // Clear any previous success messages
      if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("No user found with this email.");
      } else {
        setErrorMessage("Error sending password reset email.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Menu Section */}
      <Menu />

      <div className="flex justify-center items-center flex-grow pt-10">
        <div className="w-half sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 p-6 pt-4 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold text-center mb-4">
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-1">{successMessage}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Password Reset Email
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/auth")} // Navigate back to login page
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default ForgotPassword;
