import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase"; // Import auth from firebase.js

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [loggedInUser, setLoggedInUser] = useState(null); // Local state for logged-in user
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider(); // Initialize GoogleAuthProvider

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
      navigate(`/profile/${JSON.parse(storedUser).email}`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let isValid = true;
    let errors = { email: "", password: "" };

    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password cannot be empty.";
      isValid = false;
    }

    setErrorMessages(errors);

    if (isValid) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        setLoggedInUser(user);
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        navigate(`/profile/${user.email}`);
      } catch (error) {
        console.error("Error during sign-in: ", error.message);
        if (error.code === "auth/user-not-found") {
          alert("No user found with this email.");
        } else if (error.code === "auth/wrong-password") {
          alert("Incorrect password.");
        } else {
          alert("Error: " + error.message);
        }
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setLoggedInUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      navigate(`/profile/${user.email}`);
    } catch (error) {
      console.error("Error during Google sign-in: ", error.message);
      alert("Google Sign-In failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="form-container flex justify-center items-center bg-gray-50 p-4">
      <div className="form-content w-3/4 sm:w-3/4 md:w-3/4 lg:w-3/4 p-8 pt-5 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMessages.email && (
              <p className="text-red-500 text-sm mt-1">{errorMessages.email}</p>
            )}
          </div>

          <div className="form-group mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="password-wrapper relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="password-icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="google-signin mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-2 bg-white-600 text-black font-semibold rounded-md hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-6 h-6 mr-3"
                >
                  <path
                    fill="#fbc02d"
                    d="M44 20H24v8h12.6C34.8 32.6 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.8 0 5.3 1 7.4 2.6l6.4-6.4C34.2 6 29.3 4 24 4 11.8 4 2 13.8 2 26s9.8 22 22 22c11.3 0 20.6-8 22-18V20z"
                  />
                  <path
                    fill="#e53935"
                    d="M6.3 14.5l6.6 4.8C14.8 15.5 19.1 13 24 13c2.8 0 5.3 1 7.4 2.6l6.4-6.4C34.2 6 29.3 4 24 4 15.5 4 8.1 8.7 6.3 14.5z"
                  />
                  <path
                    fill="#4caf50"
                    d="M24 44c5.3 0 10.2-2 13.8-5.2l-6.4-6.4C29.4 33.4 26.8 34 24 34c-4.8 0-9.1-2.5-11.4-6.3l-6.6 4.8C8.1 39.3 15.5 44 24 44z"
                  />
                  <path
                    fill="#1565c0"
                    d="M44 20H24v8h12.6C35.4 32.6 30 36 24 36c-6.6 0-12-5.4-12-12 0-1.5.3-3 .8-4.3l-6.6-4.8C4.6 17.4 4 21.4 4 26c0 12.2 9.8 22 22 22 11.3 0 20.6-8 22-18V20z"
                  />
                </svg>
                Sign In with Google
              </>
            )}
          </button>
        </div>

        <div className="forgot-password mt-4 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
