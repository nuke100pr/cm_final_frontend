"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie"; // Make sure to install this: npm install js-cookie
import landscapeImage from '../../../public/img1.jpg';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Email and password are required" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the token in cookies
      if (data.token) {
        // Set cookie expiration based on "Remember me" option
        const cookieOptions = {
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "strict", // CSRF protection
        };

        if (rememberMe) {
          // If "Remember me" is checked, set a longer expiration (e.g., 30 days)
          cookieOptions.expires = 30;
        }

        // Store the JWT token in a cookie
        Cookies.set("auth_token", data.token, cookieOptions);

        // Store remember me preference
        if (rememberMe) {
          Cookies.set("remember_me", "true", { ...cookieOptions });
        } else {
          Cookies.remove("remember_me");
        }
      }

      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      // Redirect to dashboard or homepage after successful login
      setTimeout(() => {
        window.location.href = "/feed";
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#ffffff]">
      {/* Left Side with Image */}
      <div className="hidden md:block md:w-1/2 relative bg-[#30C1E0]">
        <div className="relative w-full h-full">
          {/* Placeholder image */}
          <div className="absolute inset-0 z-10">
            <Image
              src={landscapeImage}
              alt="Landscape image"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-30 z-20"></div>

          {/* Text content */}
          <div className="absolute bottom-16 left-16 text-white z-30">
            <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
            <h2 className="text-4xl font-bold mb-8">
              Let's Continue Your Journey
            </h2>

            {/* Dots navigation */}
            <div className="flex space-x-2">
              <div className="w-6 h-1 bg-white rounded-full"></div>
              <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-6 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side with Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="mb-8">
          </div>

          {/* Back button for mobile */}
          <div className="md:hidden mb-6">
            <Link href="/" className="text-[#002F60] flex items-center">
              <span>Back to website</span>
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>

          {/* Back button for desktop */}
          <div className="hidden md:block absolute top-6 right-8">
            <Link
              href="/"
              className="text-[#002F60] bg-[#E1F5FE] px-4 py-2 rounded-full flex items-center"
            >
              <span>Back to website</span>
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-[#002F60]">Log in</h1>
            <p className="mt-2 text-[#2A93D5]">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#002F60] underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Status Message */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-[#30C1E0] rounded-md bg-[#E1F5FE] text-[#002F60] focus:outline-none focus:ring-2 focus:ring-[#002F60]"
                disabled={loading}
              />
            </div>

            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-[#30C1E0] rounded-md bg-[#E1F5FE] text-[#002F60] pr-10 focus:outline-none focus:ring-2 focus:ring-[#002F60]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#2A93D5]"
                disabled={loading}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 h-5 w-5 border-[#30C1E0] rounded accent-[#002F60]"
                  disabled={loading}
                />
                <label htmlFor="remember" className="text-sm text-[#002F60]">
                  Remember me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm text-[#002F60] underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full font-medium py-3 px-4 rounded-md transition duration-300 flex justify-center items-center ${
                loading
                  ? "bg-[#30C1E0] cursor-not-allowed"
                  : "bg-[#2A93D5] hover:bg-[#002F60] text-white"
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>

            <div className="mt-8 mb-6 flex items-center">
              <div className="flex-grow border-t border-[#30C1E0]"></div>
              <span className="mx-4 text-sm text-[#2A93D5]">
                Or log in with
              </span>
              <div className="flex-grow border-t border-[#30C1E0]"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`flex justify-center items-center py-3 px-4 border border-[#30C1E0] rounded-md transition duration-200 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#E1F5FE]"
                }`}
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                className={`flex justify-center items-center py-3 px-4 border border-[#30C1E0] rounded-md transition duration-200 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#E1F5FE]"
                }`}
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#000"
                    d="M17.05 20.28c-.98.95-2.05.86-3.12.43-1.12-.44-2.15-.44-3.31 0-1.46.56-2.26.37-3.1-.43C2.13 15.2 3.06 7.44 8.56 7.16c1.5.06 2.45.94 3.22.94.83 0 2.37-1.16 4.01-.95 3.24.51 4.54 3.48 4.54 3.48s-2.66 1.32-2.66 4.56c0 3.74 3.44 5.01 3.44 5.01-.3.94-.85 1.87-1.78 2.67l-.01.01-.27-.1z"
                  />
                  <path
                    fill="#000"
                    d="M15.84 3.67c-1.5 0-2.73 1.12-3.17 2.52-.06.17-.09.33-.09.49 0 .07 0 .15.01.22.03-.01.06-.01.1-.01 1.46 0 2.85 1.12 3.34 2.52.06.17.09.33.09.49v.11c.09-.03.17-.07.26-.11 1.14-.51 1.94-1.69 1.94-3.05 0-1.85-1.42-3.18-2.48-3.18z"
                  />
                </svg>
                Apple
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}