import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Award,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

const HeroSection = ({ categoryRef }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isGradVisible, setIsGradVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("bachelors");
  const heroContentRef = useRef(null);
  const gradContentRef = useRef(null);

  // Education level data
  const educationLevels = {
    bachelors: {
      title: "Bachelor's Programs",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      buttonColor: "from-blue-600 to-cyan-600",
      hoverColor: "from-blue-700 to-cyan-700",
      bgPrimary: "bg-blue-100",
      bgSecondary: "bg-cyan-100",
      description:
        "Start your academic journey with our premium graduation attire",
      features: ["Classic Gown Design", "Honor Cords", "Custom Stoles"],
      path: "/bachelors",
    },
    masters: {
      title: "Master's Programs",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      buttonColor: "from-purple-600 to-pink-600",
      hoverColor: "from-purple-700 to-pink-700",
      bgPrimary: "bg-purple-100",
      bgSecondary: "bg-pink-100",
      description: "Celebrate your advanced degree with distinguished regalia",
      features: ["Premium Hood Design", "Faculty Colors", "Custom Embroidery"],
      path: "/masters",
    },
    phd: {
      title: "Doctoral Programs",
      icon: GraduationCap,
      color: "from-red-500 to-orange-500",
      buttonColor: "from-red-600 to-orange-600",
      hoverColor: "from-red-700 to-orange-700",
      bgPrimary: "bg-red-100",
      bgSecondary: "bg-orange-100",
      description:
        "Distinguished doctoral regalia for your highest achievement",
      features: ["Velvet Tam", "Doctoral Hood", "Custom Insignia"],
      path: "/phd",
    },
  };

  // Handle navigation
  const handleNavigate = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const gradObserver = new IntersectionObserver(
      ([entry]) => {
        setIsGradVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const currentHeroRef = heroContentRef.current;
    const currentGradRef = gradContentRef.current;

    if (currentHeroRef) observer.observe(currentHeroRef);
    if (currentGradRef) gradObserver.observe(currentGradRef);

    return () => {
      if (currentHeroRef) observer.unobserve(currentHeroRef);
      if (currentGradRef) gradObserver.unobserve(currentGradRef);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Dynamic Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-700">
        <div
          className={`absolute top-0 left-0 w-full h-full ${educationLevels[activeTab].bgPrimary} rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float transition-colors duration-700`}
        ></div>
        <div
          className={`absolute top-1/4 right-0 w-full h-full ${educationLevels[activeTab].bgSecondary} rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float-delayed transition-colors duration-700`}
        ></div>
      </div>

      <section className="relative z-10 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8">
              Academic Excellence
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600">
              Choose Your Academic Journey
            </p>
          </div>

          {/* Education Level Tabs */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            {Object.entries(educationLevels).map(([key, level]) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`px-8 py-6 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-opacity-50 ${
                  activeTab === key
                    ? `bg-gradient-to-r ${
                        level.color
                      } text-white shadow-2xl transform hover:scale-105 focus:ring-${
                        level.color.split("-")[2]
                      }-400`
                    : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-xl focus:ring-gray-400"
                }`}
              >
                <span className="flex items-center justify-center space-x-4">
                  <level.icon className="w-8 h-8" />
                  <span className="text-xl font-semibold">{level.title}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Featured Content */}
          <div
            ref={heroContentRef}
            className={`max-w-5xl mx-auto transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            {/* Content Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
              <div className="space-y-8">
                <h2
                  className={`text-4xl md:text-6xl font-bold bg-gradient-to-r ${educationLevels[activeTab].color} bg-clip-text text-transparent`}
                >
                  {educationLevels[activeTab].title}
                </h2>
                <p className="text-gray-600 text-xl md:text-2xl">
                  {educationLevels[activeTab].description}
                </p>
                <ul className="space-y-6">
                  {educationLevels[activeTab].features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <Lightbulb className="w-8 h-8 text-indigo-500" />
                      <span className="text-gray-700 text-xl">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  <button
                    onClick={() =>
                      handleNavigate(educationLevels[activeTab].path)
                    }
                    className={`group relative px-10 py-6 bg-gradient-to-r ${
                      educationLevels[activeTab].buttonColor
                    } hover:${
                      educationLevels[activeTab].hoverColor
                    } text-white rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 flex-1 text-xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-${
                      educationLevels[activeTab].color.split("-")[2]
                    }-400`}
                  >
                    <span className="flex items-center justify-center space-x-3">
                      <span>View Collection</span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Graduation Section */}
          <div
            ref={gradContentRef}
            className={`text-center py-24 transition-all duration-1000 ${
              isGradVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-20"
            }`}
          >
            <h2 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Get The Grads Ready In Time
              </span>
            </h2>
          </div>

          {/* Hidden content (everything after "Get The Grads Ready In Time") */}
          <div className="hidden">
            {/* Place any content here that should be hidden but preserved */}
            {categoryRef && <div ref={categoryRef}></div>}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 15s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
