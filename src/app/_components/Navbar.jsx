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
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const route = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("restaurantUser");
      setIsLoggedIn(!!user);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const updateCartCount = () => {
      const cartData = localStorage.getItem("cart");
      setCartCount(cartData ? JSON.parse(cartData).length : 0);
    };

    checkAuth();
    updateCartCount();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("restaurantUser");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "Menu", href: "/menu", icon: <FaUtensils /> },
    { name: "About", href: "/about", icon: <FaInfoCircle /> },
    { name: "Contact", href: "/contact", icon: <FaPhoneAlt /> },
  ];

  const mobileNavVariants = {
    open: { x: 0 },
    closed: { x: "100%" },
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
            {navLinks.map((link) => (
              <motion.div key={link.name} whileHover={{ scale: 1.05 }}>
                <Link
                  href={link.href}
                  className="flex items-center text-gray-700 hover:text-orange-600"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.1 }}>
              <button className="text-gray-700 hover:text-orange-600">
                <FaSearch className="text-xl" />
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }}>
              <Link href="../restaurant/Card">
                <button className="text-gray-700 hover:text-orange-600 relative">
                  <FaShoppingCart className="text-xl" />
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              </Link>
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
                <motion.button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="../restaurant"
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
            <Link href="../restaurant/Card">
              <button className="text-gray-700 relative">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
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
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileNavVariants}
              className="md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50"
            >
              <div className="p-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>

                <div className="mt-12 space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.name}
                    </Link>
                  ))}

                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUser className="mr-3" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="../restaurant"
                      className="flex items-center p-2 text-orange-600 hover:bg-orange-50 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="mr-3" />
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
