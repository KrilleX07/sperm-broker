import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AllowlistIntake from './components/AllowlistIntake';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('intake'); // 'intake' or 'leaderboard'
  const [isAudioOn, setIsAudioOn] = useState(true);

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 selection:bg-[#00F58C] selection:text-black flex flex-col justify-between font-mono">
      {/* Scanline CRT overlay effect for authentic 16-bit terminal aesthetic */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-20"></div>

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
      />

      {/* Main View Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {currentView === 'intake' ? (
          <AllowlistIntake onGoToLeaderboard={() => setCurrentView('leaderboard')} />
        ) : (
          <Leaderboard onGoToIntake={() => setCurrentView('intake')} />
        )}
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
