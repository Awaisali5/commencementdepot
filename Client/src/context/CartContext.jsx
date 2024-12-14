import React, { createContext, useState, useEffect } from "react";
import { BachelorsProducts } from "../data/productsData"; // Adjust path if necessary
import { MastersProducts } from "../data/productsData"; // Adjust path if necessary

export const CartContext = createContext();
const productsData = [...BachelorsProducts, ...MastersProducts];

export const CartProvider = ({ children, loggedInUser, setLoggedInUser }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load user and cart data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setLoggedInUser(parsedUser);

      if (parsedUser.cart) {
        setCartItems(parsedUser.cart);
      }
    } else {
      const localCart = localStorage.getItem("cart");
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, [setLoggedInUser]);

  // Add product to the cart
  const addToCart = (product, quantity, selectedSize) => {
    const currentDate = new Date().toLocaleDateString();

    setCartItems((prevItems) => {
      let updatedCart = [...prevItems];
      let productFound = false;

      // Update existing product quantity if it exists in the cart
      updatedCart = updatedCart.map((cart) => {
        const updatedItems = cart.items.map((item) => {
          if (
            item.productId === product.id &&
            item.selectedSize === selectedSize
          ) {
            productFound = true;
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });

        return {
          ...cart,
          items: productFound ? updatedItems : [...cart.items],
        };
      });

      // If product is not found, create a new cart item
      if (!productFound) {
        const newCartItem = {
          id: Date.now().toString(),
          date: currentDate,
          items: [
            {
              productId: product.id,
              selectedSize: selectedSize,
              quantity: quantity,
            },
          ],
        };
        updatedCart = [...updatedCart, newCartItem];
      }

      // Save the updated cart to localStorage or logged-in user's data
      if (loggedInUser) {
        const updatedUser = { ...loggedInUser, cart: updatedCart };
        setLoggedInUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      return updatedCart;
    });
  };

  // Update the quantity of a product in the cart
  const updateCartQuantity = (cartId, productId, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((cart) =>
        cart.id === cartId
          ? {
              ...cart,
              items: cart.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            }
          : cart
      );

      // Save the updated cart to localStorage or logged-in user's data
      if (loggedInUser) {
        const updatedUser = { ...loggedInUser, cart: updatedCart };
        setLoggedInUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      }

      return updatedCart;
    });
  };

  // Remove a product from the cart
  const removeFromCart = (cartId, productId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((cart) =>
          cart.id === cartId
            ? {
                ...cart,
                items: cart.items.filter(
                  (item) => item.productId !== productId
                ),
              }
            : cart
        )
        .filter((cart) => cart.items.length > 0);

      // Save the updated cart to localStorage or logged-in user's data
      if (loggedInUser) {
        const updatedUser = { ...loggedInUser, cart: updatedCart };
        setLoggedInUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      }

      return updatedCart;
    });
  };

  // Clear the cart completely (after order completion)
  const clearCart = () => {
    setCartItems([]);

    if (loggedInUser) {
      const updatedUser = { ...loggedInUser, cart: [] };
      setLoggedInUser(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("cart");
    }
  };

  // Update user orders and clear purchased items from the cart
  const updateUserOrders = (newOrder, selectedItems) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems
        .map((cart) => ({
          ...cart,
          items: cart.items.filter(
            (item) =>
              !selectedItems.some(
                (selected) =>
                  selected.cartId === cart.id &&
                  selected.productId === item.productId
              )
          ),
        }))
        .filter((cart) => cart.items.length > 0); // Remove empty carts

      if (loggedInUser) {
        const updatedUser = {
          ...loggedInUser,
          cart: updatedCart,
          orders: [...(loggedInUser.orders || []), newOrder],
        };
        setLoggedInUser(updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      }

      return updatedCart;
    });
  };

  // Get cart details with product data
  const getCartDetails = () => {
    return cartItems.map((cart) => {
      const updatedItems = cart.items.map((item) => {
        const product = productsData.find((prod) => prod.id === item.productId);
        const totalPrice = product ? product.price * item.quantity : 0;

        return {
          ...item,
          productDetails: product,
          totalPrice: totalPrice,
        };
      });

      return { ...cart, items: updatedItems };
    });
  };

  return (
    <CartContext.Provider
      value={{
        products: productsData,
        cartItems: getCartDetails(),
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart, // Add clearCart to the context
        updateUserOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
