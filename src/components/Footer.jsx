import React from 'react';
import { ExternalLink } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#05070B] text-slate-500 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
        
        {/* Left: Brand Pixel Text */}
        <div className="flex items-center gap-4">
          <span className="font-pixel text-[#00F58C] text-[11px] uppercase tracking-wider">
            SPERM BROKERS
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">© 2026 Robinhood Chain Edition</span>
        </div>

        {/* Right: X Link & OpenSea */}
        <div className="flex items-center gap-4 font-pixel text-[10px]">
          <a
            href="https://x.com/SpermBrokers"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-[#8B5CF6] hover:text-[#A78BFA] transition"
          >
            𝕏 @SpermBrokers
          </a>

          <span className="text-slate-700">•</span>

          <a
            href="https://opensea.io"
            target="_blank"
            rel="noreferrer"
            onClick={() => sound.playClick()}
            className="text-slate-400 hover:text-white transition"
          >
            OpenSea
          </a>
        </div>

      </div>
    </footer>
  );
}
