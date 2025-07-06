import React from 'react';

const LandingPage = () => {
    const handleGetStarted = () => {
        // onbarding flow - registration page
    };

    const handleLearnMore = () => {
        console.log("Learn More action triggered");
        // Scroll to features section
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFindBuddy = () => {
        // for buddy search page
    };



    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative text-white">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-navy">
                            Connect. Learn. <span className="text-yellow-300">Succeed.</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Join ALU StudyBuddy, the peer-to-peer academic support platform connecting
                            African Leadership University students for collaborative learning and success.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleGetStarted}
                                className="btn-primary text-lg px-8 py-4 bg-yellow-400 text-alu-blue"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={handleLearnMore}
                                className="btn-secondary text-lg px-8 py-4 border-white text-red hover:bg-white hover:text-alu-blue"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
