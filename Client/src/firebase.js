// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3eOHE4WQMXOSZnZn9BpsAt7j72ONd6ow",
  authDomain: "unistore-ed96c.firebaseapp.com",
  databaseURL: "https://unistore-ed96c-default-rtdb.firebaseio.com",
  projectId: "unistore-ed96c",
  storageBucket: "unistore-ed96c.firebasestorage.app",
  messagingSenderId: "963077979105",
  appId: "1:963077979105:web:1bbe3c254dbcbfcd6bf0a0",
  measurementId: "G-LCHHBLYL6Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Clean item data
const cleanItem = (item) => ({
  productId: String(item.productId || ""),
  quantity: Number(item.quantity || 0),
  selectedSize: String(item.selectedSize || ""),
  price: Number(item.price || 0),
  name: String(item.name || "Unknown Product"),
  image: item.image || null,
});

// Clean shipping address
const cleanShippingAddress = (address) => ({
  fullName: String(address.fullName || ""),
  phone: String(address.phone || ""),
  addressLine1: String(address.addressLine1 || ""),
  city: String(address.city || ""),
  state: String(address.state || ""),
  zip: String(address.zip || ""),
  country: String(address.country || ""),
});

// Save order to Firebase Firestore
export const saveOrderToFirebase = async (orderData) => {
  try {
    // Clean and prepare the order data
    const cleanOrder = {
      // Basic order information
      userId: String(orderData.userId || ""),
      userEmail: String(orderData.userEmail || ""),
      userName: String(orderData.userName || "Guest User"),

      // Order status and payment information
      status: String(orderData.status || "Pending"),
      paymentStatus: String(orderData.paymentStatus || "Pending"), // Explicitly set payment status
      paymentMethod: String(orderData.paymentMethod || "Cash on Delivery"),
      orderDate: new Date().toISOString(),

      // Shipping information
      shippingAddress: cleanShippingAddress(orderData.shippingAddress || {}),

      // Items
      items: Array.isArray(orderData.items)
        ? orderData.items.map(cleanItem)
        : [],

      // Financial information
      totalAmount: String((Number(orderData.totalAmount) || 0).toFixed(2)),
      shippingFee: String((Number(orderData.shippingFee) || 0).toFixed(2)),
      discount: String((Number(orderData.discount) || 0).toFixed(2)),
      subtotal: String((Number(orderData.subtotal) || 0).toFixed(2)),

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(firestore, "orders"), cleanOrder);
    console.log("Order saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};

export { auth, firestore };
