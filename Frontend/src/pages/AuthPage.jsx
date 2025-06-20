import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import axios from 'axios'; // <-- Add this import

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [authInfo, setAuthInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeSwitch = () => {
    setIsLogin((prev) => !prev);
    setAuthInfo({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = authInfo;
    console.log(`name ${name}, email ${email}`);

    if (!email || !password || (!isLogin && !name)) {
      return handleError('All fields are required');
    }

    try {
      const url = isLogin
        ? 'http://localhost:8000/auth/login'
        : 'http://localhost:8000/auth/signup';

      // Only send required fields
      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const { data: result } = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      const { success, message, jwtToken, name: userName, error } = result;

      if (success) {
        handleSuccess(message);
        if (isLogin) {
          if (jwtToken && userName) {
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('loggedInUser', userName);
            setTimeout(() => navigate('/problem'), 1000);
          } else {
            handleError('Invalid login response');
          }
        } else {
          setTimeout(() => setIsLogin(true), 1000);
        }
      } else if (error) {
        const details = error?.details?.[0]?.message || error;
        handleError(details);
      } else {
        handleError(message || 'Authentication failed');
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Code<span className="text-gray-400">X</span>
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Welcome back to CodeX' : 'Join the CodeX community'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your details to get started'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={authInfo.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={authInfo.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={authInfo.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200 hover:border-gray-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={handleModeSwitch}
                className="text-white hover:text-gray-300 font-medium underline underline-offset-2 transition-colors duration-200"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By continuing, you agree to CodeX's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;