"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoginModal = ({ isVisible, onClose }: LoginModalProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isVisible) return null;

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful");

      onClose();

      router.push("/dashboard");
    }
  }

  return (
  
  <>
    <Toaster position="top-right" />

    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-blue-100">
            Login to manage deliveries and track shipments
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white text-xl font-bold hover:scale-110 transition"
        >
          ✕
        </button>

        {/* Form */}
        <div className="p-8">
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5"
          >
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Logistics Delivery Tracking System
          </div>
        </div>
      </div>
    </div>
  </>
);
 
};

export default LoginModal;
