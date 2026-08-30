import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({ currentView, setCurrentView, isAudioOn, setIsAudioOn }) {
  const toggleSound = () => {
    sound.enabled = !isAudioOn;
    setIsAudioOn(!isAudioOn);
    if (!isAudioOn) sound.playToggle();
  };

  return (
    <header className="w-full bg-[#05070B] border-b border-[#1E293B] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Pixel Title (No emojis, no boxes) */}
        <button
          onClick={() => {
            sound.playClick();
            setCurrentView('intake');
          }}
          className="text-left group"
        >
          <span className="font-pixel text-[#00F58C] text-xs sm:text-sm tracking-wider hover:brightness-125 transition-all text-neon-green">
            SPERM BROKERS
          </span>
        </button>

        {/* Right Navigation */}
        <nav className="flex items-center gap-4 sm:gap-8 font-pixel text-[10px] sm:text-xs">
          
          <button
            onClick={() => {
              sound.playClick();
              setCurrentView('intake');
            }}
            className={`transition-colors uppercase tracking-wider py-1 ${
              currentView === 'intake'
                ? 'text-[#00F58C] border-b-2 border-[#00F58C]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ALLOWLIST
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setCurrentView('leaderboard');
            }}
            className={`transition-colors uppercase tracking-wider py-1 ${
              currentView === 'leaderboard'
                ? 'text-[#00F58C] border-b-2 border-[#00F58C]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LEADERBOARD
          </button>

          <a
            href="https://x.com/SpermBrokers"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-[#8B5CF6] hover:text-[#A78BFA] transition-colors uppercase tracking-wider flex items-center gap-1"
          >
            <span>@SpermBrokers</span>
          </a>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isAudioOn ? 'Mute chiptune sound' : 'Enable sound'}
            className="p-2 rounded-lg text-slate-500 hover:text-[#00F58C] transition"
          >
            {isAudioOn ? <Volume2 size={16} className="text-[#00F58C]" /> : <VolumeX size={16} />}
          </button>

        </nav>

      </div>
    </header>
  );
}
