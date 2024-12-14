import React, { forwardRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Award, BookOpen } from "lucide-react";

// ForwardRef allows passing the ref to the parent component for DOM manipulation
const CategorySection = forwardRef((props, ref) => {
  // Controls animation using Framer Motion
  const controls = useAnimation();
  // Tracks when the section comes into the viewport
  const [inViewRef, inView] = useInView({
    triggerOnce: false, // Animation will trigger every time the section is in view
    threshold: 0.2, // Trigger animation when 20% of the section is visible
  });

  // Hook to start/stop animation based on visibility
  useEffect(() => {
    if (inView) {
      controls.start("visible"); // Start animation when in view
    } else {
      controls.start("hidden"); // Reset animation when out of view
    }
  }, [inView, controls]);

  // Variants for the section animation
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 }, // Initial state
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8, // Duration of the animation
        staggerChildren: 0.3, // Delay between children animations
        ease: "easeOut", // Animation easing
      },
    },
  };

  // Variants for the individual items in the grid
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Data for the categories displayed in the grid
  const categories = [
    {
      title: "Graduation Suits For Bachelors",
      path: "/bachelors",
      icon: BookOpen,
      image: "/bachelors.png",
      color: "from-blue-500 to-cyan-500",
      hoverColor: "group-hover:from-blue-600 group-hover:to-cyan-600",
    },
    {
      title: "Graduation Suits For Masters",
      path: "/masters",
      icon: Award,
      image: "/Masters.png",
      color: "from-purple-500 to-pink-500",
      hoverColor: "group-hover:from-purple-600 group-hover:to-pink-600",
    },
    {
      title: "Graduation Suits For PhD",
      path: "/phd",
      icon: GraduationCap,
      image: "/phd.png",
      color: "from-red-500 to-orange-500",
      hoverColor: "group-hover:from-red-600 group-hover:to-orange-600",
    },
  ];

  return (
    <motion.section
      // Assigns the ref and inView observer to the section
      ref={(node) => {
        ref && (ref.current = node);
        inViewRef(node);
      }}
      initial="hidden" // Initial animation state
      animate={controls} // Controls animation state
      variants={sectionVariants} // Section animation variants
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      {/* Section Title */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16"
        style={{ fontFamily: "kanit" }} // Custom font style
        variants={itemVariants} // Title animation
      >
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Explore Categories
        </span>
      </motion.h1>

      {/* Grid of Categories */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        variants={sectionVariants} // Grid animation
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.path} // Unique key for each category
            variants={itemVariants} // Individual item animation
            className="group"
          >
            {/* Link to the category page */}
            <Link
              to={category.path}
              className="block relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-10"></div>
                <img
                  src={category.image} // Category image
                  alt={category.title} // Accessible image description
                  className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color} ${category.hoverColor} opacity-20 transition-opacity duration-300`}
                ></div>
              </div>

              {/* Content Container */}
              <div className="p-6 bg-white">
                {/* Icon and Divider */}
                <div className="flex items-center justify-between mb-4">
                  <category.icon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform origin-left transition-all duration-300 group-hover:scale-x-150"></div>
                </div>
                {/* Category Title */}
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {category.title}
                </h2>
                {/* Explore Link */}
                <div className="mt-4 flex items-center text-gray-600 group-hover:text-indigo-600 transition-colors">
                  <span className="text-sm">Explore Collection</span>
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
});

// Set display name for debugging purposes
CategorySection.displayName = "CategorySection";

export default CategorySection;
