"use client";
import { useState } from "react";
import LoginPagee from "../_components/restaurantLogin";
import SignupPagee from "../_components/restaurantSignup";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import { AnimatePresence, motion } from "framer-motion";

const Restaurant = () => {
  const [login, setlogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
   

      <main className="flex-grow mt-[10%] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-0 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={login ? "login" : "signup"}
                initial={{ opacity: 0, x: login ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: login ? -20 : 20 }}
                transition={{ duration: 0.2 }}
              >
                {login ? <LoginPagee /> : <SignupPagee />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex border-b border-gray-200">
            <motion.button
              onClick={() => setlogin(true)}
              className={`flex-1 py-4 font-medium text-center transition-colors relative ${
                login
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Login
              {login && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"
                  layoutId="underline"
                />
              )}
            </motion.button>

            <motion.button
              onClick={() => setlogin(false)}
              className={`flex-1 py-4 font-medium text-center transition-colors relative ${
                !login
                  ? "text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
              {!login && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"
                  layoutId="underline"
                />
              )}
            </motion.button>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default Restaurant;
