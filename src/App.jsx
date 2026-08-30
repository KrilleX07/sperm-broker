import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AllowlistIntake from './components/AllowlistIntake';
import Footer from './components/Footer';

export default function App() {
  const [isAudioOn, setIsAudioOn] = useState(true);

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 selection:bg-[#00F58C] selection:text-black flex flex-col justify-between font-mono">
      {/* Scanline CRT overlay effect for authentic 16-bit terminal aesthetic */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-20"></div>

      {/* Top Navbar */}
      <Navbar
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
      />

      {/* Main Content: Allowlist Intake Form */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <AllowlistIntake />
      </main>

      {/* Minimalist Footer */}
      <Footer />
    </div>
  );
}
