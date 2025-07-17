import React from 'react';
import { AuthProvider } from './components/auth/AuthContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <LandingPage />
        </main>
        <Footer />
      </div>
    </AuthProvider>

  );
}

export default App;
