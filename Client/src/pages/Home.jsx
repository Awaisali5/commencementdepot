import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
//import CategorySection from '../components/CategorySection';
import Footer from "../components/Footer";

const Home = ({ loggedInUser }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const categoryRef = useRef(null);

  return (
    <div>
      <Navbar loggedInUser={loggedInUser} onMenuToggle={setMenuOpen} />
      {/* Apply a margin-top to push down content when the menu is open */}
      <div
        className={`transition-all duration-300 ${isMenuOpen ? "mt-64" : ""}`}
      >
        <HeroSection categoryRef={categoryRef} />
        {/*      <CategorySection ref={categoryRef} />   */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
