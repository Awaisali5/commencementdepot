import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi"; // React Icons
import { FaCreditCard, FaUser } from "react-icons/fa"; // Font Awesome Icons
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineGlobeAlt, HiOutlineIdentification } from "react-icons/hi"; // React Icons
import { HiOutlineCreditCard, HiOutlineCalendar, HiOutlineLockClosed } from "react-icons/hi"; // React Icons
import "../styles/completeProfile.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const validateField = (field, type) => {
  switch (type) {
    case "email":
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field);
    case "phone":
      return /^[0-9]+$/.test(field) && field.length >= 10 && field.length <= 15;
    case "zipCode":
      return /^[0-9]+$/.test(field);
    case "billingCardNumber":
      return /^[0-9 ]{19}$/.test(field); // Validates formatted card number (16 digits + 3 spaces)
    case "state":
      return /^[a-zA-Z]{0,}$/.test(field);
    case "city":
      return /^[a-zA-Z]{2,}$/.test(field);
    case "country":
      return /^[a-zA-Z]{2,}$/.test(field);
    case "billingExpiration":
      // Validate MM/YY and ensure it's not expired
      const [month, year] = field.split("/");
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(field)) return false;
      const currentDate = new Date();
      const inputDate = new Date(`20${year}`, month - 1);
      return inputDate >= currentDate;
    case "billingCVC":
      return /^[0-9]{3}$/.test(field);
    default:
      return field.trim() !== ""; // Non-empty field check for other fields
  }
};

const CompleteProfilePage = ({ loggedInUser, setLoggedInUser }) => {
  const [formData, setFormData] = useState({
    name: loggedInUser?.name || "",
    email: loggedInUser?.email || "",
    password: loggedInUser?.password || "",
    address1: "",
    address2: "",
    state: "",
    city: "",
    zipCode: "",
    phone: "",
    country: "",
    countryCode: "+1",
    billingName: "",
    billingAddress: "",
    billingCardNumber: "",
    billingExpiration: "",
    billingCVC: "",
    universityName: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedFormData) {
      setFormData(savedFormData);
    } else if (loggedInUser) {
      setFormData((prevData) => ({
        ...prevData,
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
      }));
    }
  }, [loggedInUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Format card number to include spaces every 4 digits
    if (name === "billingCardNumber") {
      updatedValue = value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    setFormData({ ...formData, [name]: updatedValue });
    localStorage.setItem("loggedInUser", JSON.stringify({ ...formData, [name]: updatedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit triggered"); // Debugging line

    const errors = {};
    // Required field validation
    const requiredFields = ["address1", "zipCode", "phone", "universityName", "billingAddress", "billingName"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        errors[field] = `${field} is required.`;
      }
    }

    // Field format validation
    if (!validateField(formData.email, "email")) {
      errors.email = "Please enter a valid email address.";
    }
    if (!validateField(formData.phone, "phone")) {
      errors.phone = "Phone number should only contain numbers and be between 10-15 digits.";
    }
    if (!validateField(formData.zipCode, "zipCode")) {
      errors.zipCode = "Zip code should only contain numbers.";
    }
    if (!validateField(formData.billingCardNumber, "billingCardNumber")) {
      errors.billingCardNumber = "Card number should have 16 digits, grouped in 4.";
    }
    if (!validateField(formData.billingExpiration, "billingExpiration")) {
      errors.billingExpiration = "Please enter a valid expiration date (MM/YY) that is not expired.";
    }
    if (!validateField(formData.billingCVC, "billingCVC")) {
      errors.billingCVC = "CVC should be exactly 3 digits.";
    }
    if (!validateField(formData.country, "country")) {
      errors.country = "Country should contain only alphabets.";
    }
    if (!validateField(formData.city, "city")) {
      errors.city = "City should contain only alphabets.";
    }
    if (!validateField(formData.state, "state")) {
      errors.state = "State should contain only alphabets.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    console.log("Form data is valid", formData); // Debugging line

    const updatedFormData = { ...formData };

    // Preserve 'orders' during profile updates
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser && savedUser.orders) {
      updatedFormData.orders = savedUser.orders;
    }

    console.log("Updated form data:", updatedFormData); // Debugging line

    localStorage.setItem("loggedInUser", JSON.stringify(updatedFormData));
    if (setLoggedInUser) setLoggedInUser(updatedFormData);

    alert("Profile updated successfully!");
    navigate(`/profile/${updatedFormData.email}`);

  };
  return (
    // <div className="bg-gray-50 min-h-screen flex justify-center items-center">
    <div>
      <Navbar loggedInUser={loggedInUser} />
      <div className="full-body bg-gray-50 min-h-screen flex justify-center items-center ">

        <form onSubmit={handleSubmit} className="w-full max-w-6xl bg-gray-200 shadow-lg rounded-lg p-8 pb-10">
          <h1 className="text-2xl font-bold text-center mt-8 mb-6" style={{ color: "rgb(146, 73, 146)", fontWeight: "700", fontSize: "30px" }}>Complete Your Profile</h1>


          {/* Personal Info */} {/* User  Info */}

          <div className="user-info mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <FaUser style={{ color: "#313869", fontSize: "22px" }} /> {/* Font Awesome User Icon */}
              <span>User Info</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
              <div className="relative">
                <label htmlFor="name" className="block text-base font-medium text-gray-700">Name</label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlineUser className="text-gray-500 text-xl mr-2 " />
                  <div className="border-r-2 pr-2">
                    {/* Vertical line after the icon */}
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none" // Added pl-4 for left padding
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="email" className="block text-base font-medium text-gray-700">Email</label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlineMail className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2">
                    {/* Vertical line after the icon */}
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none" // Added pl-4 for left padding
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="relative">
                <label htmlFor="phone" className="block text-base font-medium text-gray-700">Phone Number</label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlinePhone className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2"></div>
                  <select
                    name="countryCode"
                    value={formData.countryCode || "+1"}
                    onChange={handleInputChange}
                    className="mr-2 px-4 py-2 border-none rounded-md focus:outline-none"
                    required
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none"
                    aria-describedby="phone-error"
                    required
                  />

                </div>
                {validationErrors.phone && (
                  <span id="phone-error" className="text-red-500 text-sm">
                    {validationErrors.phone}
                  </span>
                )}
              </div>

              {/* University Name */}
              <div className="relative">
                <label htmlFor="universityName" className="block text-base font-medium text-gray-700">University/College Name</label>
                <div className="flex items-center border-b-2 mt-2 pl-4">
                  <HiOutlineIdentification className="text-gray-500 text-xl mr-2" />
                  <div className="border-r-2 pr-2"></div>
                  <input
                    type="text"
                    id="universityName"
                    name="universityName"
                    value={formData.universityName || ""}
                    onChange={handleInputChange}
                    className="w-full pl-4 py-2 border-none focus:outline-none"
                    required
                  />
                </div>
                {validationErrors.universityName && (
                  <span className="text-red-500 text-sm">
                    {validationErrors.universityName}
                  </span>
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
                  <label htmlFor="billingName" className="block text-base font-medium text-gray-700">Billing Name</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineUser className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingName"
                      name="billingName"
                      value={formData.billingName || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                      required
                    />
                  </div>
                  {validationErrors.billingName && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.billingName}
                    </span>
                  )}
                </div>

                {/* Billing Address */}
                <div className="relative">
                  <label htmlFor="billingAddress" className="block text-base font-medium text-gray-700">Billing Address</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingAddress"
                      name="billingAddress"
                      value={formData.billingAddress || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                      required
                    />
                  </div>
                  {validationErrors.billingAddress && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.billingAddress}
                    </span>
                  )}
                </div>

                {/* Card Number */}
                <div className="relative">
                  <label htmlFor="billingCardNumber" className="block text-base font-medium text-gray-700">Card Number</label>
                  <div className="flex items-center border-b-2 mt-2   pl-4">
                    <HiOutlineCreditCard className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingCardNumber"
                      name="billingCardNumber"
                      value={formData.billingCardNumber}
                      onChange={(e) => {
                        // Format card number with spaces
                        const formattedValue = e.target.value
                          .replace(/\D/g, "")
                          .replace(/(\d{4})(?=\d)/g, "$1 ");
                        handleInputChange({ target: { name: "billingCardNumber", value: formattedValue } });
                      }}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.billingCardNumber && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.billingCardNumber}
                    </span>
                  )}
                </div>

                {/* Expiration Date */}
                <div className="relative">
                  <label htmlFor="billingExpiration" className="block text-base font-medium text-gray-700">Expiration Date (MM/YY)</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineCalendar className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingExpiration"
                      name="billingExpiration"
                      value={formData.billingExpiration}
                      onChange={(e) => {
                        const formattedValue = e.target.value
                          .replace(/\D/g, "")
                          .replace(/(\d{2})(\d{0,2})/, (match, p1, p2) => `${p1}${p2 ? `/${p2}` : ""}`);
                        handleInputChange({ target: { name: "billingExpiration", value: formattedValue } });
                      }}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.billingExpiration && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.billingExpiration}
                    </span>
                  )}
                </div>

                {/* CVC */}
                <div className="relative">
                  <label htmlFor="billingCVC" className="block text-base font-medium text-gray-700">CVC</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLockClosed className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="billingCVC"
                      name="billingCVC"
                      value={formData.billingCVC}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.billingCVC && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.billingCVC}
                    </span>
                  )}
                </div>
              </div>

            </div>
            {/* Personal Info */}
            <div className="personal-info mb-6 pt-12">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <HiOutlineLocationMarker style={{ color: "#313869", fontSize: "25px" }} />
                <span>Personal Info</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-10">
                {/* Address */}
                <div className="relative">
                  <label htmlFor="address1" className="block text-base font-medium text-gray-700">Address Line 1</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      value={formData.address1 || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                      required
                    />
                  </div>
                  {validationErrors.address1 && <span className="text-red-500 text-base">{validationErrors.address1}</span>}
                </div>
                <div className="relative">
                  <label htmlFor="address2" className="block text-base font-medium text-gray-700">Address Line 2</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      value={formData.address2 || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                </div>

                {/* State */}
                <div className="relative">
                  <label htmlFor="state" className="block text-base font-medium text-gray-700">State</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                    />
                  </div>
                  {validationErrors.state && <span className="text-red-500 text-base">{validationErrors.state}</span>}
                </div>

                {/* City */}
                <div className="relative">
                  <label htmlFor="city" className="block text-base font-medium text-gray-700">City</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineLocationMarker className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                      required
                    />
                  </div>
                  {validationErrors.city && <span className="text-red-500 text-base">{validationErrors.city}</span>}
                </div>

                {/* Country */}
                <div className="relative">
                  <label htmlFor="country" className="block text-base font-medium text-gray-700">Country</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineGlobeAlt className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                      required
                    />
                  </div>
                  {validationErrors.country && <span className="text-red-500 text-base">{validationErrors.country}</span>}
                </div>

                {/* Zip Code */}
                <div className="relative">
                  <label htmlFor="zipCode" className="block text-base font-medium text-gray-700">Zip Code</label>
                  <div className="flex items-center border-b-2 mt-2 pl-4">
                    <HiOutlineIdentification className="text-gray-500 text-xl mr-2" />
                    <div className="border-r-2 pr-2"></div>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 py-2 border-none focus:outline-none"
                      required
                    />
                  </div>
                  {validationErrors.zipCode && <span className="text-red-500 text-base">{validationErrors.zipCode}</span>}
                </div>



              </div>

            </div>
          </div>



          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="profile-btn text-white shadow-md focus:outline-none transition-all">
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

export default CompleteProfilePage;