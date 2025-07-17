import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Eye, EyeOff, Mail, Lock, UserPlus, LogIn, Check, X, Star, Clock, DollarSign } from 'lucide-react';

const AuthPage = ({ defaultMode = 'signin' }) => {
  const [isSignUp, setIsSignUp] = useState(defaultMode === 'signup');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    university: 'African Leadership University',
    yearOfStudy: '',
    major: '',
    bio: '',
    modules: [],
    hourlyRate: '',
    availableTimeSlots: [],
    helpExperience: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [moduleInput, setModuleInput] = useState('');

  // Available options
  const yearOptions = [
    'Year 1, Trimester 1', 'Year 1, Trimester 2', 'Year 1, Trimester 3',
    'Year 2, Trimester 1', 'Year 2, Trimester 2', 'Year 2, Trimester 3',
    'Year 3, Trimester 1', 'Year 3, Trimester 2', 'Year 3, Trimester 3',
    'Graduated'

  ];

  const timeSlots = [
    {
      day: 'Monday',
      slots: [
        { time: '6:00 - 12:00', value: 'Monday_6:00-12:00' },
        { time: '12:00 - 17:00', value: 'Monday_12:00-17:00' },
        { time: '17:00 - 23:59', value: 'Monday_17:00-23:59' }
      ]
    },
    {
      day: 'Tuesday',
      slots: [
        { time: '6:00 - 12:00', value: 'Tuesday_6:00-12:00' },
        { time: '12:00 - 17:00', value: 'Tuesday_12:00-17:00' },
        { time: '17:00 - 23:59', value: 'Tuesday_17:00-23:59' }
      ]
    },
    {
      day: 'Wednesday',
      slots: [
        { time: '6:00 - 12:00', value: 'Wednesday_6:00-12:00' },
        { time: '12:00 - 17:00', value: 'Wednesday_12:00-17:00' },
        { time: '17:00 - 23:59', value: 'Wednesday_17:00-23:59' }
      ]
    },
    {
      day: 'Thursday',
      slots: [
        { time: '6:00 - 12:00', value: 'Thursday_6:00-12:00' },
        { time: '12:00 - 17:00', value: 'Thursday_12:00-17:00' },
        { time: '17:00 - 23:59', value: 'Thursday_17:00-23:59' }
      ]
    },
    {
      day: 'Friday',
      slots: [
        { time: '6:00 - 12:00', value: 'Friday_6:00-12:00' },
        { time: '12:00 - 17:00', value: 'Friday_12:00-17:00' },
        { time: '17:00 - 23:59', value: 'Friday_17:00-23:59' }
      ]
    },
    {
      day: 'Saturday',
      slots: [
        { time: '6:00 - 12:00', value: 'Saturday_6:00-12:00' },
        { time: '12:00 - 17:00', value: 'Saturday_12:00-17:00' },
        { time: '17:00 - 23:59', value: 'Saturday_17:00-23:59' }
      ]
    },
    {
      day: 'Sunday',
      slots: [
        { time: '6:00 - 12:00', value: 'Sunday_6:00-12:00' },
        { time: '12:00 - 17:00', value: 'Sunday_12:00-17:00' },
        { time: '17:00 - 23:59', value: 'Sunday_17:00-23:59' }
      ]
    }
  ];

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      return strength;
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isSignUp && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  }, [formData.email, formData.password, formData.confirmPassword, isSignUp]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addModule = () => {
    if (moduleInput.trim() && !formData.modules.includes(moduleInput.trim())) {
      setFormData(prev => ({
        ...prev,
        modules: [...prev.modules, moduleInput.trim()]
      }));
      setModuleInput('');
    }
  };

  const removeModule = (moduleToRemove) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module !== moduleToRemove)
    }));
  };

  const toggleTimeSlot = (slot) => {
    setFormData(prev => ({
      ...prev,
      availableTimeSlots: prev.availableTimeSlots.includes(slot)
        ? prev.availableTimeSlots.filter(s => s !== slot)
        : [...prev.availableTimeSlots, slot]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Form submitted:', { ...formData, isSignUp });
      // Handle success/error here
    }, 2000);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-full max-w-4xl bg-white shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 p-8 lg:p-12 text-white">
            <div className="flex items-center space-x-2 mb-5">
              <img
                src="/alu-logo.png"
                alt="ALU Logo"
                className="w-12 object-contain"
              />
              <h1 className="text-xl font-bold">StudyBuddy</h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                {isSignUp ? 'Join Our Community' : 'Welcome Back'}
              </h2>
              <p className="text-blue-100 text-lg">
                {isSignUp
                  ? 'Connect with fellow ALU students and build a supportive learning network.'
                  : 'Continue your journey of collaborative learning and academic excellence.'
                }
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-900" />
                  </div>
                  <span>Peer-to-peer learning support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-900" />
                  </div>
                  <span>Cross-module collaboration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-900" />
                  </div>
                  <span>Academic excellence together</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${!isSignUp
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-600 hover:text-blue-900'
                  }`}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${isSignUp
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-gray-600 hover:text-blue-900'
                  }`}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Sign Up
              </button>
            </div>

            {/* Role Selection */}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sign Up Fields */}
              {isSignUp && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      } text-gray-900`}
                    placeholder="d.duru@alustudent.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'
                      } text-gray-900`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {isSignUp && formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Password Strength</span>
                      <span className={passwordStrength >= 75 ? 'text-green-600' : passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } text-gray-900`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                  {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Passwords match
                    </p>
                  )}
                </div>
              )}

              {/* Additional Sign Up Fields */}
              {isSignUp && (
                <div className="space-y-4">
                  {/* University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      University *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder="African Leadership University"
                    />
                  </div>

                  {/* Year of Study: Intake */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Study *
                    </label>
                    <select
                      required
                      value={formData.yearOfStudy}
                      onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    >
                      <option value="">Select your academic level</option>
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Major */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Major/Field of Study *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.major}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder="e.g., AI/ML, Full Stack & Devops, etc."
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio/About Me
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>

                  {/* Study Buddy Specific Fields */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Helper Information (Optional)
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Fill it if you want to offer help to other students. You can always update this later.
                    </p>

                    {/* Modules */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modules/Subjects You Can Help With
                      </label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={moduleInput}
                          onChange={(e) => setModuleInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addModule())}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                          placeholder="e.g., Web Infrastructure, Linux etc."
                        />
                        <button
                          type="button"
                          onClick={addModule}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.modules.map((module, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {module}
                            <button
                              type="button"
                              onClick={() => removeModule(module)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Available Time Slots */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Available Time Slots
                      </label>
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {timeSlots.map((daySlot) => (
                          <div key={daySlot.day} className="border rounded-lg p-3 bg-gray-50">
                            <h4 className="font-medium text-gray-900 mb-2">{daySlot.day}</h4>
                            <div className="flex space-x-4">
                              {daySlot.slots.map((slot) => (
                                <label key={slot.value} className="flex flex-col items-center space-y-1 text-xs cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.availableTimeSlots.includes(slot.value)}
                                    onChange={() => toggleTimeSlot(slot.value)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-gray-700 text-center whitespace-nowrap">{slot.time}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Teaching Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Help/Tutoring Experience
                      </label>
                      <textarea
                        value={formData.helpExperience}
                        onChange={(e) => handleInputChange('helpExperience', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                        placeholder="Describe any experience you have helping other students..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Remember Me / Forgot Password */}
              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms and Conditions */}
              {isSignUp && (
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-800 underline">
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-800 underline">
                      Privacy Policy
                    </button>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (isSignUp && !acceptTerms)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-md font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isSignUp ? <UserPlus className="w-5 h-5 mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>

              {/* Social Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
