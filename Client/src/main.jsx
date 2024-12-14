// index.js (or main.jsx)
import React, { useState, useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './output.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';

const rootElement = document.getElementById('root');

const Main = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Retrieve logged-in user from localStorage
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <StrictMode>
      <CartProvider loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}>
        <App loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
      </CartProvider>
    </StrictMode>
  );
};

createRoot(rootElement).render(<Main />);
