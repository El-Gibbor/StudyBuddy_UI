import React from 'react';
import { useState } from 'react';
import { useAuth } from './auth/AuthContext';
import AuthPage from './auth/AuthPage';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const { isAuthenticated, user, signOut } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogin = () => {
        setAuthMode('login');
        setShowAuthModal(true);
    };

    const handleSignUp = () => {
        setAuthMode('register');
        setShowAuthModal(true);
    };

    const handleSignOut = () => {
        signOut();
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-navy text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo & project name */}
                    <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gradient-to-br flex items-center justify-center">
                            <img
                                src="/alu-logo.png"
                                alt="ALU Logo"
                                className="w-100 h-100 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl lg:text-xl font-bold text-white">StudyBuddy</h1>
                        </div>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center text-white space-x-8">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                            How It Works
                        </a>
                        <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                            About
                        </a>
                    </nav>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-300">
                                    Welcome, {user?.fullName}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={handleLogin}
                                    className="px-4 py-2 text-sm font-medium border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-md transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleSignUp}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-600">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a
                                href="#features"
                                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                How It Works
                            </a>
                            <a
                                href="#about"
                                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </a>
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-600">
                            <div className="px-2 space-y-2">
                                {isAuthenticated ? (
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-3 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleLogin}
                                            className="w-full text-left px-3 py-2 text-base font-medium border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-md transition-colors"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={handleSignUp}
                                            className="w-full text-left px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Auth Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowAuthModal(false)}></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => setShowAuthModal(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <AuthPage
                                defaultMode={authMode}
                                onSuccess={() => setShowAuthModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
