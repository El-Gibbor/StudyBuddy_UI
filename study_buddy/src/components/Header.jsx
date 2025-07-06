import React from 'react';

const Header = () => {
    const handleLogin = () => {
        // login implementation
    };

    const handleSignUp = () => {
        //    signup implementation
    };

    return (
        <header className="bg-navy text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo & project name */}
                    <div className="flex items-center space-x-3">
                        <div className="w-20 h-10 bg-gradient-to-br flex items-center justify-center">
                            <img
                                src="/alu-logo.png"
                                alt="ALU Logo"
                                className="w-100 h-100 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">StudyBuddy</h1>
                        </div>
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center text-white space-x-8">
                        <a href="#features" className="text-gray-700 text-white">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-gray-700 text-white">
                            How It Works
                        </a>
                        <a href="#about" className="text-gray-700 text-white">
                            About
                        </a>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogin}
                            className="px-4 py-2 text-sm font-medium border border-alu-blue rounded-md"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleSignUp}
                            className="px-4 py-2 text-sm font-medium text-white bg-alu-blue rounded-lg"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
