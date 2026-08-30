import React from 'react';
import { Volume2, VolumeX, Wallet, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({ isAudioOn, setIsAudioOn, wallet, onOpenWallet }) {
  const toggleSound = () => {
    sound.enabled = !isAudioOn;
    setIsAudioOn(!isAudioOn);
    if (!isAudioOn) sound.playToggle();
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Live Market Ticker */}
      <div className="bg-black/90 border-b border-white/10 text-xs py-1.5 overflow-hidden select-none">
        <div className="flex animate-ticker whitespace-nowrap gap-8 text-slate-300 font-mono items-center">
          <span className="flex items-center gap-1.5 text-hood-green font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-hood-green animate-ping"></span>
            ROBINHOOD CHAIN MAINNET: LIVE
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-400 font-bold">WHITELIST REGISTRATION: OPEN</span>
          <span className="text-slate-400">|</span>
          <span className="text-purple-400">TOTAL SUPPLY: 1,000 BROKERS</span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-400 flex items-center gap-1">
            <Lock size={12} /> STAKING VAULT: PHASE 2 COMING SOON
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-400">11 UNIQUE GENERATIVE ARCHETYPES</span>
          <span className="text-slate-400">|</span>
          <span className="text-hood-green font-semibold">1/1 GOLDEN GOD IN POOL</span>
          {/* Repeat for seamless loop */}
          <span className="text-slate-400">|</span>
          <span className="flex items-center gap-1.5 text-hood-green font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-hood-green animate-ping"></span>
            ROBINHOOD CHAIN MAINNET: LIVE
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-400 font-bold">WHITELIST REGISTRATION: OPEN</span>
          <span className="text-slate-400">|</span>
          <span className="text-purple-400">TOTAL SUPPLY: 1,000 BROKERS</span>
        </div>
      </div>

      {/* Main Glass Nav */}
      <div className="bg-[#07090E]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          
          {/* Logo */}
          <a 
            href="#" 
            onClick={() => sound.playClick()}
            className="flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-hood-green to-cyber-cyan p-[2px] shadow-lg shadow-hood-green/20 group-hover:shadow-hood-green/50 transition duration-300">
              <div className="w-full h-full bg-[#07090E] rounded-[10px] flex items-center justify-center text-2xl">
                🧬
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white group-hover:text-hood-green transition font-display flex items-center gap-1">
                SPERM <span className="text-hood-green">BROKERS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-hood-green"></span>
                Robinhood Edition
              </span>
            </div>
          </a>

          {/* Center Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-hood-green animate-pulse"></span>
            <span>Early Access Whitelist Application</span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Twitter / X Link */}
            <a
              href="https://x.com/SpermBrokers"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              title="Follow @SpermBrokers on X"
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-hood-green/40 hover:text-hood-green text-slate-300 font-bold transition flex items-center justify-center text-sm"
            >
              <span className="leading-none text-base">𝕏</span>
            </a>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isAudioOn ? 'Mute sound' : 'Enable sound'}
              className={`p-2.5 rounded-xl border transition-all ${
                isAudioOn 
                  ? 'border-hood-green/40 text-hood-green bg-hood-green/10 shadow-sm shadow-hood-green/30' 
                  : 'border-white/10 text-slate-500 bg-white/5 hover:text-slate-300'
              }`}
            >
              {isAudioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Connect Wallet CTA */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenWallet();
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                wallet.connected
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-900/40 hover:border-emerald-400'
                  : 'bg-gradient-to-r from-hood-green to-emerald-400 text-black font-extrabold shadow-lg shadow-hood-green/25 hover:shadow-hood-green/40 hover:scale-[1.02]'
              }`}
            >
              {wallet.connected ? (
                <>
                  <ShieldCheck size={17} className="text-emerald-400" />
                  <span className="font-mono text-xs">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                </>
              ) : (
                <>
                  <Wallet size={17} />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
