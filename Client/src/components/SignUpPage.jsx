// src/components/SignUpPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Import auth from firebase.js

export const SignUpPage = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    let errors = { name: "", email: "", password: "" };

    if (!formData.name) {
      errors.name = "Name is required.";
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!validatePassword(formData.password)) {
      errors.password =
        "Password must be at least 8 characters long and contain 1 uppercase letter, 1 lowercase letter, and 1 number.";
      isValid = false;
    }

    setErrorMessages(errors);

    if (isValid) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        onSignUp(user);
        navigate(`/profile/${user.email}`);
      } catch (error) {
        alert("Error during sign-up: " + error.message);
      }
    }
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  return (
    <div className="flex justify-center items-center h-full bg-gray-50 w-3/4">
      <div className="w-3/4 sm:w-3/4 md:w-3/4 lg:w-3/4 p-8 pt-5 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-sm mb-1 font-semibold text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
            {errorMessages.name && (
              <p className="text-red-500 text-sm mt-1">{errorMessages.name}</p>
            )}
          </div>

          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm mb-1 font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
            {errorMessages.email && (
              <p className="text-red-500 text-sm mt-1">{errorMessages.email}</p>
            )}
          </div>

          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm mb-1 font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </span>
            </div>
            {errorMessages.password && (
              <p className="text-red-500 text-sm mt-1">
                {errorMessages.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignUpPage;
