import React from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <LandingPage />
      </main>
    </div>

  );
}

export default App;
