<<<<<<< HEAD
"use client"

import type React from "react"
import { useState } from "react"
import { X, Mail, Lock, User, Eye, EyeOff, Smartphone } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import OTPVerification from "./OTPVerification"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "signin" | "register" | "otp"
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = "signin" }) => {
  const [mode, setMode] = useState<"signin" | "register" | "otp" | "otp-verify">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { login, register, loginWithOTP, state } = useAuth()

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (mode === "signin" || mode === "register") {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
    }

    if (mode === "register") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      let result

      if (mode === "register") {
        result = await register({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
        })
      } else if (mode === "signin") {
        result = await login(formData.email, formData.password)
      } else if (mode === "otp") {
        result = await loginWithOTP(formData.email)
        if (result.success) {
          setMode("otp-verify")
          setIsLoading(false)
          return
        }
      }

      if (result?.success) {
        onClose()
        resetForm()
      } else {
        setErrors({ general: result?.error || "An error occurred" })
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setErrors({})
  }

  const switchMode = (newMode: "signin" | "register" | "otp") => {
    setMode(newMode)
    setErrors({})
    resetForm()
  }

  const handleOTPSuccess = () => {
    onClose()
    resetForm()
  }

  const handleOTPBack = () => {
    setMode("otp")
  }

  if (mode === "otp-verify") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative p-6">
          <OTPVerification onBack={handleOTPBack} onSuccess={handleOTPSuccess} />
        </div>
      </div>
    )
  }
=======
import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      let result;
      
      if (mode === 'register') {
        result = await register({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await login(formData.email, formData.password);
      }
      
      if (result.success) {
        onClose();
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setErrors({});
      } else {
        setErrors({ general: result.error || 'An error occurred' });
      }
      
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'register' : 'signin');
    setErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-100">
          <h2 className="text-2xl font-bold text-sage-800">
<<<<<<< HEAD
            {mode === "signin" ? "Welcome Back" : mode === "register" ? "Create Account" : "Sign In with OTP"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-sage-50 rounded-full transition-colors">
=======
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-sage-50 rounded-full transition-colors"
          >
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
            <X className="h-5 w-5 text-sage-600" />
          </button>
        </div>

<<<<<<< HEAD
        {(mode === "signin" || mode === "otp") && (
          <div className="px-6 pt-4">
            <div className="flex bg-sage-50 rounded-lg p-1">
              <button
                onClick={() => switchMode("signin")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "signin" ? "bg-white text-sage-800 shadow-sm" : "text-sage-600 hover:text-sage-800"
                }`}
              >
                <Lock className="h-4 w-4 inline mr-1" />
                Password
              </button>
              <button
                onClick={() => switchMode("otp")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === "otp" ? "bg-white text-sage-800 shadow-sm" : "text-sage-600 hover:text-sage-800"
                }`}
              >
                <Smartphone className="h-4 w-4 inline mr-1" />
                OTP
              </button>
            </div>
          </div>
        )}

=======
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}
<<<<<<< HEAD

          {mode === "register" && (
=======
          
          {mode === 'register' && (
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
<<<<<<< HEAD
                    errors.firstName ? "border-red-300" : "border-sage-200"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Last Name</label>
=======
                    errors.firstName ? 'border-red-300' : 'border-sage-200'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Last Name
                </label>
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
<<<<<<< HEAD
                    errors.lastName ? "border-red-300" : "border-sage-200"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
=======
                    errors.lastName ? 'border-red-300' : 'border-sage-200'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                )}
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
<<<<<<< HEAD
                errors.email ? "border-red-300" : "border-sage-200"
              }`}
              placeholder={mode === "otp" ? "Enter email to receive OTP" : "Enter your email"}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {(mode === "signin" || mode === "register") && (
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors pr-10 ${
                    errors.password ? "border-red-300" : "border-sage-200"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>
          )}

          {mode === "register" && (
=======
                errors.email ? 'border-red-300' : 'border-sage-200'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              <Lock className="h-4 w-4 inline mr-1" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors pr-10 ${
                  errors.password ? 'border-red-300' : 'border-sage-200'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-400 hover:text-sage-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {mode === 'register' && (
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                <Lock className="h-4 w-4 inline mr-1" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors ${
<<<<<<< HEAD
                  errors.confirmPassword ? "border-red-300" : "border-sage-200"
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {mode === "signin" && (
            <div className="text-right">
              <button type="button" className="text-sm text-sage-600 hover:text-sage-800 transition-colors">
=======
                  errors.confirmPassword ? 'border-red-300' : 'border-sage-200'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {mode === 'signin' && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-sage-600 hover:text-sage-800 transition-colors"
              >
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
                Forgot Password?
              </button>
            </div>
          )}

<<<<<<< HEAD
          {mode === "otp" && (
            <div className="bg-sage-50 p-4 rounded-md">
              <p className="text-sm text-sage-700">
                We'll send a 6-digit verification code to your email address. No password required!
              </p>
            </div>
          )}

=======
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sage-600 text-white py-3 rounded-md font-medium hover:bg-sage-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
<<<<<<< HEAD
                <span>
                  {mode === "signin" ? "Signing In..." : mode === "register" ? "Creating Account..." : "Sending OTP..."}
                </span>
              </div>
            ) : mode === "signin" ? (
              "Sign In"
            ) : mode === "register" ? (
              "Create Account"
            ) : (
              "Send OTP"
=======
                <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
              </div>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
<<<<<<< HEAD
          {mode !== "register" && (
            <p className="text-sage-600 mb-2">
              Don't have an account?{" "}
              <button onClick={() => switchMode("register")} className="text-sage-800 font-medium hover:underline">
                Sign Up
              </button>
            </p>
          )}
          {mode === "register" && (
            <p className="text-sage-600 mb-2">
              Already have an account?{" "}
              <button onClick={() => switchMode("signin")} className="text-sage-800 font-medium hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>

        {mode === "register" && (
          <div className="px-6 pb-6">
            <p className="text-xs text-sage-500 text-center">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-sage-700">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-sage-700">
                Privacy Policy
              </a>
=======
          <p className="text-sage-600">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={switchMode}
              className="text-sage-800 font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {mode === 'register' && (
          <div className="px-6 pb-6">
            <p className="text-xs text-sage-500 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline hover:text-sage-700">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-sage-700">Privacy Policy</a>
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
            </p>
          </div>
        )}
      </div>
    </div>
<<<<<<< HEAD
  )
}

export default AuthModal
=======
  );
};

export default AuthModal;
>>>>>>> 03c7a7604bb214e4d0f1d3102e34f6504e4c0671
