// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import LoginPage from "../pages/LoginPage";
// import { SignUpPage } from "../pages/SignUpPage";
// import users from "../data/userData";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import ProfilePage from "./Profile";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const Auth = () => {
//     const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
//     const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user
//     const navigate = useNavigate();

//     const toggleMode = () => setIsSignUp(!isSignUp);

//     const handleLogin = (user) => {
//       setLoggedInUser(user);
//       navigate(`/profile/${user.email}`);  // Redirect to the profile page using the user's email in the route

//     };

//     const handleSignUp = (newUser) => {
//       users.push(newUser); // Add new user to the users data
//       setLoggedInUser(newUser);
//       navigate(`/profile/${newUser.email}`);  // Redirect to the profile page using the user's email in the route
//     };

//     return (
//       <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
//         <div className="bg-gray-50">
//         <Navbar />
//         <div className={`auth-container ${isSignUp ? "signup-mode" : "login-mode"} flex justify-center items-center min-h-screen`}>
//           <div className="form-container relative flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
//             {/* Main Form Content */}
//             {loggedInUser ? (
//               <ProfilePage user={loggedInUser} />
//             ) : (
//               <>
//                 {isSignUp ? (
//                   <SignUpPage onSignUp={handleSignUp} />
//                 ) : (
//                   <LoginPage onLogin={handleLogin} toggleMode={toggleMode} />
//                 )}
//               </>
//             )}

//             {/* Sidebar */}
//             <div className="auth-sidebar bg-teal-500 text-white w-1/3 flex flex-col justify-center items-center p-6 absolute top-0 left-0 h-full z-10 transform transition-all duration-500 ease-in-out">
//               {isSignUp ? (
//                 <p className="text-center">
//                   Already have an account?{" "}
//                   <button className="btn_auth text-teal-900 mt-4" onClick={toggleMode}>
//                     Sign In
//                   </button>
//                 </p>
//               ) : (
//                 <p className="text-center">
//                   Don't have an account?{" "}
//                   <button className="btn_auth text-teal-900 mt-4" onClick={toggleMode}>
//                     Sign Up
//                   </button>
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//         <Footer />
//         </div>
//       </GoogleOAuthProvider>
//     );
//   };

// export default Auth;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"; // Import Firebase signOut method
import { auth } from "../firebase"; // Import your Firebase config
import LoginPage from "./LoginPage";
import { SignUpPage } from "./SignUpPage";
import users from "../data/userData";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProfilePage from "./Profile";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Auth = ({ loggedInUser, setLoggedInUser }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMode = () => setIsSignUp(!isSignUp);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    navigate(`/profile/${user.email}`); // Redirect to the profile page using the user's email in the route
  };

  const handleSignUp = (newUser) => {
    users.push(newUser); // Add new user to the users data
    setLoggedInUser(newUser);
    navigate(`/profile/${newUser.email}`); // Redirect to the profile page using the user's email in the route
  };

  // Sign-Out function
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      localStorage.removeItem("loggedInUser"); // Remove user from localStorage
      setLoggedInUser(null); // Clear loggedInUser state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error); // Handle any errors
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="bg-gray-50">
        {/* Pass loggedInUser and setLoggedInUser to Navbar */}
        <Navbar loggedInUser={loggedInUser} onMenuToggle={() => {}} />
        <div
          className={`auth-container ${
            isSignUp ? "signup-mode" : "login-mode"
          } flex justify-center items-center min-h-screen`}
        >
          <div className="form-container relative flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Main Form Content */}
            {loggedInUser ? (
              <ProfilePage user={loggedInUser} handleSignOut={handleSignOut} />
            ) : (
              <>
                {isSignUp ? (
                  <SignUpPage onSignUp={handleSignUp} />
                ) : (
                  <LoginPage onLogin={handleLogin} toggleMode={toggleMode} />
                )}
              </>
            )}
            <div className="auth-sidebar bg-teal-500 text-white w-1/3 flex flex-col justify-center items-center p-6 absolute top-0 left-0 h-full z-10 transform transition-all duration-500 ease-in-out">
              {isSignUp ? (
                <p className="text-center">
                  Already have an account?{" "}
                  <button
                    className="btn_auth text-teal-900 mt-4"
                    onClick={toggleMode}
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-center">
                  Don't have an account?{" "}
                  <button
                    className="btn_auth text-teal-900 mt-4"
                    onClick={toggleMode}
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
