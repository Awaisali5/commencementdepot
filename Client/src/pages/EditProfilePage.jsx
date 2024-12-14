import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlinePhone,
} from "react-icons/hi"; // React Icons
import { FaCreditCard, FaUser } from "react-icons/fa"; // Font Awesome Icons
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineGlobeAlt, HiOutlineIdentification } from "react-icons/hi"; // React Icons
import {
  HiOutlineCreditCard,
  HiOutlineCalendar,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from "react-icons/hi"; // React Icons
import "../styles/completeProfile.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const validateField = (field, type) => {
  switch (type) {
    case "email":
      // Email validation regex for standard email formats
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field);

    case "phone":
      // Phone number: only digits, length between 10 and 12
      return /^[0-9]{10,12}$/.test(field);

    case "zipCode":
      // Zip code: digits only, allow spaces
      return /^[0-9 ]+$/.test(field);

    case "billingCardNumber":
      // Card number: exactly 16 digits (spaces optional)
      return /^[0-9]{16}$/.test(field.replace(/\s+/g, ""));

    case "state":
    case "city":
    case "country":
      // Alphabets only for state, city, and country
      return /^[a-zA-Z\s]+$/.test(field);

    case "billingExpiration":
      // Validate MM/YY format and check if not expired
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(field)) return false;
      const [month, year] = field.split("/");
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      const inputMonth = parseInt(month, 10);
      const inputYear = parseInt(year, 10);
      return (
        inputYear > currentYear ||
        (inputYear === currentYear && inputMonth >= currentMonth)
      );

    case "billingCVC":
      // CVC: exactly 3 digits
      return /^[0-9]{3}$/.test(field);

    case "password":
      // Password: Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        field
      );

    default:
      // Non-empty validation for unspecified fields
      return field.trim() !== "";
  }
};

const EditProfilePage = ({ loggedInUser }) => {
  const [updatedUser, setUpdatedUser] = useState({
    name: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    password: loggedInUser?.password || "",
    address1: loggedInUser?.address1 || "",
    address2: loggedInUser?.address2 || "",
    zipCode: loggedInUser?.zipCode || "",
    phone: loggedInUser?.phone || "",
    countryCode: loggedInUser?.countryCode || "+1",
    billingName: loggedInUser?.billingName || "",
    billingAddress: loggedInUser?.billingAddress || "",
    billingCardNumber: loggedInUser?.billingCardNumber || "",
    billingExpiration: loggedInUser?.billingExpiration || "",
    billingCVC: loggedInUser?.billingCVC || "",
    universityName: loggedInUser?.universityName || "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      setUpdatedUser(loggedInUser); // Initialize with loggedInUser data
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // Field format validation
    if (!validateField(updatedUser.email, "email", true)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!validateField(updatedUser.phone, "phone", true)) {
      errors.phone =
        "Phone number should only contain numbers and be between 10-15 digits.";
    }
    if (!validateField(updatedUser.zipCode, "zipCode", true)) {
      errors.zipCode = "Zip code should only contain numbers.";
    }
    if (
      !validateField(updatedUser.billingCardNumber, "billingCardNumber", true)
    ) {
      errors.billingCardNumber =
        "Card number should have 16 digits, grouped in 4.";
    }
    if (!validateField(updatedUser.billingExpiration, "billingExpiration")) {
      errors.billingExpiration =
        "Please enter a valid expiration date (MM/YY) that is not expired.";
    }
    if (!validateField(updatedUser.billingCVC, "billingCVC")) {
      errors.billingCVC = "CVC should be exactly 3 digits.";
    }
    if (!validateField(updatedUser.state, "state", true)) {
      errors.state = "State should contain only alphabets.";
    }
    if (!validateField(updatedUser.country, "country", true)) {
      errors.country = "Country should contain only alphabets.";
    }
    if (!validateField(updatedUser.city, "city", true)) {
      errors.city = "City should contain only alphabets.";
    }

    // Handle password validation (confirmPassword)
    if (password || confirmPassword) {
      if (!validateField(password, "password", true)) {
        errors.password =
          "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.";
      }
      if (!validateField(confirmPassword, "password", true)) {
        // Pass isRequired flag
        errors.confirmPassword = "Confirm password is required.";
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    // If there are validation errors, return and show them
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const updatedData = { ...updatedUser };
    if (password) {
      updatedData.password = password; // Update password only if filled
    }

    localStorage.setItem("loggedInUser", JSON.stringify(updatedData)); // Save updated user to localStorage
    navigate(`/profile/${updatedUser.email}`); // Navigate to the profile page
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    // <div className="bg-gray-50 min-h-screen flex justify-center items-center">
    <div>
      <Navbar loggedInUser={loggedInUser} />
      <div className="full-body bg-gray-50 min-h-screen flex justify-center items-center ">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl bg-gray-200 shadow-lg rounded-lg p-8 pb-10"
        >
          <h1
            className="text-2xl font-bold text-center mt-8 mb-6"
            style={{
              color: "rgb(146, 73, 146)",
              fontWeight: "700",
              fontSize: "30px",
            }}
          >
            Edit Your Profile
          </h1>
          {/* Personal Info */} {/* User  Info */}
          <div className="user-info mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-">
              <FaUser style={{ color: "#313869", fontSize: "22px" }} />{" "}
              {/* Font Awesome User Icon */}
              <span>User Info</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-base font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlineUser className="text-gray-500 text-xl mr-2 " />
                  <div className="border-r-2 pr-2">
                    {/* Vertical line after the icon */}
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updatedUser.name}
                    onChange={handleChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none" // Added pl-4 for left padding
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-base font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlineMail className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2">
                    {/* Vertical line after the icon */}
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={updatedUser.email}
                    onChange={handleChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none" // Added pl-4 for left padding
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>
              {/* Phone */}
              <div className="relative">
                <label
                  htmlFor="phone"
                  className="block text-base font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlinePhone className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2"></div>
                  <select
                    name="countryCode"
                    value={updatedUser.countryCode || "+1"}
                    onChange={handleChange}
                    className="mr-2 px-4 py-2 border-none rounded-md focus:outline-none"
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={updatedUser.phone || ""}
                    onChange={handleChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              {/* University Name */}
              <div className="relative">
                <label
                  htmlFor="universityName"
                  className="block text-base font-medium text-gray-700"
                >
                  University/College Name
                </label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlineIdentification className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2"></div>
                  <input
                    type="text"
                    id="universityName"
                    name="universityName"
                    value={updatedUser.universityName || ""}
                    onChange={handleChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-base font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="flex items-center border-b-2 mt-2 pl-4 relative">
                  <HiOutlineLockClosed className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2"></div>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-4 flex items-center"
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="w-6 h-6 text-gray-500" />
                    ) : (
                      <EyeIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-base font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="flex items-center border-b-2 mt-2 pl-4 relative">
                  <HiOutlineShieldCheck className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2"></div>
                  <input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-4 flex items-center"
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOffIcon className="w-6 h-6 text-gray-500" />
                    ) : (
                      <EyeIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="user-personal-info mb-6">
            {/* Billing Info */}
            <div className="billing-info mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <FaCreditCard style={{ color: "#313869", fontSize: "22px" }} />
                <span>Billing Info</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-10">
                {/* Billing Name */}
                <div className="relative">
                  <label
                    htmlFor="billingName"
                    className="block text-base font-medium text-gray-700"
                  >
                    Billing Name
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineUser className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingName"
                      name="billingName"
                      value={updatedUser.billingName || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="relative">
                  <label
                    htmlFor="billingAddress"
                    className="block text-base font-medium text-gray-700"
                  >
                    Billing Address
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingAddress"
                      name="billingAddress"
                      value={updatedUser.billingAddress || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* Card Number */}
                <div className="relative">
                  <label
                    htmlFor="billingCardNumber"
                    className="block text-base font-medium text-gray-700"
                  >
                    Card Number
                  </label>
                  <div className="flex items-center border-b-2 mt-2   pl-4">
                    <HiOutlineCreditCard className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingCardNumber"
                      name="billingCardNumber"
                      value={updatedUser.billingCardNumber}
                      onChange={(e) => {
                        // Format card number with spaces
                        const formattedValue = e.target.value
                          .replace(/\D/g, "")
                          .replace(/(\d{4})(?=\d)/g, "$1 ");
                        handleChange({
                          target: {
                            name: "billingCardNumber",
                            value: formattedValue,
                          },
                        });
                      }}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.billingCardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.billingCardNumber}
                    </p>
                  )}
                </div>

                {/* Expiration Date */}
                <div className="relative">
                  <label
                    htmlFor="billingExpiration"
                    className="block text-base font-medium text-gray-700"
                  >
                    Expiration Date (MM/YY)
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineCalendar className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingExpiration"
                      name="billingExpiration"
                      value={updatedUser.billingExpiration}
                      onChange={(e) => {
                        const formattedValue = e.target.value
                          .replace(/\D/g, "")
                          .replace(
                            /(\d{2})(\d{0,2})/,
                            (match, p1, p2) => `${p1}${p2 ? `/${p2}` : ""}`
                          );
                        handleChange({
                          target: {
                            name: "billingExpiration",
                            value: formattedValue,
                          },
                        });
                      }}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.billingExpiration && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.billingExpiration}
                    </p>
                  )}
                </div>

                {/* CVC */}
                <div className="relative">
                  <label
                    htmlFor="billingCVC"
                    className="block text-base font-medium text-gray-700"
                  >
                    CVC
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLockClosed className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingCVC"
                      name="billingCVC"
                      value={updatedUser.billingCVC}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.billingCVC && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.billingCVC}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Personal Info */}
            <div className="personal-info mb-6 pt-12">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <HiOutlineLocationMarker
                  style={{ color: "#313869", fontSize: "25px" }}
                />
                <span>Personal Info</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                {/* Address */}
                <div className="relative">
                  <label
                    htmlFor="address1"
                    className="block text-base font-medium text-gray-700"
                  >
                    Address Line 1
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      value={updatedUser.address1 || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                    {validationErrors.address1 && (
                      <span className="text-red-500 text-base">
                        {validationErrors.address1}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor="address2"
                    className="block text-base font-medium text-gray-700"
                  >
                    Address Line 2
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      value={updatedUser.address2 || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* State */}
                <div className="relative">
                  <label
                    htmlFor="state"
                    className="block text-base font-medium text-gray-700"
                  >
                    State
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={updatedUser.state || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="relative">
                  <label
                    htmlFor="city"
                    className="block text-base font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={updatedUser.city || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.city}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="relative">
                  <label
                    htmlFor="country"
                    className="block text-base font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineGlobeAlt className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={updatedUser.country || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.country}
                    </p>
                  )}
                </div>

                {/* Zip Code */}
                <div className="relative">
                  <label
                    htmlFor="zipCode"
                    className="block text-base font-medium text-gray-700"
                  >
                    Zip Code
                  </label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineIdentification className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={updatedUser.zipCode || ""}
                      onChange={handleChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="profile-btn   text-white  shadow-md focus:outline-none transition-all"
            >
              Save Changes
              <IoIosArrowForward className="inline-block ml-2 text-xl" />
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfilePage;
