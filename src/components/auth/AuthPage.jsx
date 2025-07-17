import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const AuthPage = ({ defaultMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const { register, confirmRegistration, resendConfirmationCode, login } = useAuth();

  const LoginForm = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        await login(formData.email, formData.password);
        setSuccess('Login successful!');
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white py-2 px-4 rounded-md hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    );
  };

  const RegisterForm = () => {
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      campus: '',
      program: '',
      yearOfStudy: '',
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      try {
        const { confirmPassword, ...registrationData } = formData;
        await register(registrationData);
        setPendingEmail(formData.email);
        setMode('confirm');
        setSuccess('Registration successful! Please check your email for confirmation code.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-1">
              Campus
            </label>
            <select
              id="campus"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              value={formData.campus}
              onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
            >
              <option value="">Select Campus</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Mauritius">Mauritius</option>
            </select>
          </div>
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
              Program
            </label>
            <select
              id="program"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
            >
              <option value="">Select Program</option>
              <option value="BSE">Bachelor of Software Engineering</option>
              <option value="BEL">Bachelor of Entrepreneurial Leadership</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
            Year of Study
          </label>
          <select
            id="yearOfStudy"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            value={formData.yearOfStudy}
            onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
          >
            <option value="">Select Year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white py-2 px-4 rounded-md hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    );
  };

  const ConfirmationForm = () => {
    const [confirmationCode, setConfirmationCode] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        await confirmRegistration(pendingEmail, confirmationCode);
        setSuccess('Email confirmed successfully! You can now sign in.');
        setTimeout(() => {
          setMode('login');
          setSuccess('');
        }, 2000);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleResendCode = async () => {
      setLoading(true);
      setError('');

      try {
        await resendConfirmationCode(pendingEmail);
        setSuccess('Confirmation code resent! Please check your email.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Your Email</h3>
          <p className="text-sm text-gray-600">
            We've sent a confirmation code to <strong>{pendingEmail}</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation Code
            </label>
            <input
              type="text"
              id="confirmationCode"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent text-center text-lg tracking-widest"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Enter 6-digit code"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-2 px-4 rounded-md hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Confirming...' : 'Confirm Email'}
          </button>
        </form>
        <div className="text-center">
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="text-sm text-navy hover:text-navy-light disabled:opacity-50"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <img src="/alu-logo.png" alt="ALU Logo" className="w-8 h-8" />
          <h2 className="text-2xl font-bold text-navy">StudyBuddy</h2>
        </div>
        <p className="text-gray-600">
          {mode === 'login' && 'Welcome back! Sign in to your account'}
          {mode === 'register' && 'Create your StudyBuddy account'}
          {mode === 'confirm' && 'Almost there! Confirm your email'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {mode === 'login' && <LoginForm />}
      {mode === 'register' && <RegisterForm />}
      {mode === 'confirm' && <ConfirmationForm />}

      {mode !== 'confirm' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setSuccess('');
              }}
              className="text-navy hover:text-navy-light font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;