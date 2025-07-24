"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedWrapper, ScaleWrapper } from "./AnimatedWrapper";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function LoginPagee() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/restaurant/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Server did not return valid JSON");
      }

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("restaurantUser", JSON.stringify(data.data));

      toast.success("Login successful!", {
        position: "top-center",
      });

      router.push("/restaurant/dashbored");
      window.location.href = "/";

    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <ScaleWrapper>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
          <motion.div
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="h-3 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500"
          />

          <div className="p-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-gray-800 mb-8"
            >
              Welcome Back!
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatedWrapper delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </AnimatedWrapper>

              <AnimatedWrapper delay={0.3}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Password"
                    required
                  />
                </div>
              </AnimatedWrapper>

              <AnimatedWrapper delay={0.4}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    "Logging in..."
                  ) : (
                    <>
                      <FaSignInAlt />
                      <span>Login</span>
                    </>
                  )}
                </button>
              </AnimatedWrapper>
            </form>
          </div>
        </div>
      </ScaleWrapper>
      <ToastContainer />
    </div>
  );
}
