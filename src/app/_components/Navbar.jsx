"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaHome,
  FaUtensils,
  FaPhoneAlt,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const route = useRouter();

  useEffect(() => {
    // Check if user is logged in (check localStorage or token)
    const checkAuth = () => {
      const user = localStorage.getItem("restaurantUser");
      if (user) {
        // If user is logged in and on the homepage
        if (pathname === "/") {
          route.push("../restaurant/dashbored"); // Fixed typo in "dashboard"
        }
        // Add other redirect conditions as needed
      }

      setIsLoggedIn(!!user);
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    checkAuth();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("restaurantUser");
    setIsLoggedIn(false);
    // Optional: redirect to home page
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Menu", href: "/menu", icon: <FaUtensils /> },
    { name: "About", href: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", href: "/contact", icon: <FaPhoneAlt /> },
  ];

  const mobileNavVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all  mb-[50%] duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-2xl font-bold text-orange-600 flex items-center"
            >
              <span className="mr-2">🍔</span>
              <span className="hidden sm:inline">FoodExpress</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={link.href}
                  className="flex items-center text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.1 }}>
              <button className="text-gray-700 hover:text-orange-600">
                <FaSearch className="text-xl" />
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }}>
              <button className="text-gray-700 hover:text-orange-600 relative">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </motion.div>

            {isLoggedIn ? (
              <>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-orange-600"
                  >
                    <FaUser className="text-xl" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center"
                >
                  <FaUser className="mr-2" />
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="text-gray-700">
              <FaShoppingCart className="text-xl" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileNavVariants}
            className="md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="text-xl font-bold text-orange-600">
                  FoodExpress
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center text-gray-700 hover:text-orange-600 text-lg"
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-12 pt-6 border-t border-gray-200">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block w-full mb-4 text-center py-2 text-gray-700 hover:text-orange-600"
                    >
                      <div className="flex items-center justify-center">
                        <FaUser className="mr-2" />
                        My Profile
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 rounded-full"
                    >
                      <div className="flex items-center justify-center">
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 rounded-full"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
