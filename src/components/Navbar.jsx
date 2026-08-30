import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({ isAudioOn, setIsAudioOn }) {
  const toggleSound = () => {
    sound.enabled = !isAudioOn;
    setIsAudioOn(!isAudioOn);
    if (!isAudioOn) sound.playToggle();
  };

  return (
    <header className="w-full bg-[#05070B] border-b border-[#1E293B] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Pixel Title (No emojis, no boxes) */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="text-left group"
        >
          <span className="font-pixel text-[#00F58C] text-xs sm:text-sm tracking-wider hover:brightness-125 transition-all text-neon-green">
            SPERM BROKERS
          </span>
        </a>

        {/* Right Navigation */}
        <nav className="flex items-center gap-5 sm:gap-8 font-pixel text-[10px] sm:text-xs">
          
          <span className="text-[#00F58C] border-b-2 border-[#00F58C] pb-1 uppercase tracking-wider">
            ALLOWLIST
          </span>

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
            title={isAudioOn ? 'Mute sound' : 'Enable sound'}
            className="p-2 rounded-lg text-slate-500 hover:text-[#00F58C] transition"
          >
            {isAudioOn ? <Volume2 size={16} className="text-[#00F58C]" /> : <VolumeX size={16} />}
          </button>

        </nav>

      </div>
    </header>
  );
}
