import React, { useState } from 'react';
import { Volume2, VolumeX, Globe, Wallet, ShieldCheck, Menu, X, Sparkles, TrendingUp } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({ lang, setLang, isAudioOn, setIsAudioOn, wallet, onOpenWallet }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    sound.enabled = !isAudioOn;
    setIsAudioOn(!isAudioOn);
    if (!isAudioOn) sound.playToggle();
  };

  const toggleLanguage = () => {
    sound.playClick();
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  const navLinks = [
    { href: '#gallery', labelRu: 'Галерея', labelEn: 'Gallery' },
    { href: '#mint', labelRu: 'Минт', labelEn: 'Mint' },
    { href: '#staking', labelRu: 'Стейкинг $SPRM', labelEn: 'Staking $SPRM' },
    { href: '#lore', labelRu: 'Лор', labelEn: 'Lore' },
    { href: '#traits', labelRu: 'Трейты', labelEn: 'Traits' },
    { href: '#roadmap', labelRu: 'Roadmap', labelEn: 'Roadmap' },
    { href: '#faq', labelRu: 'FAQ', labelEn: 'FAQ' },
  ];

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
          <span className="text-emerald-400 flex items-center gap-1">
            <TrendingUp size={12} /> SPRM $0.420 (+69.42%)
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-400">FLOOR: 0.088 ETH</span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-400">TOTAL VOLUME: 420.69 ETH</span>
          <span className="text-slate-400">|</span>
          <span className="text-purple-400">MINTED: 742 / 1,000</span>
          <span className="text-slate-400">|</span>
          <span className="text-rose-400">GAS: 0.0001 GWEI</span>
          <span className="text-slate-400">|</span>
          <span className="text-hood-green font-semibold">1/1 GOLDEN GOD AVAILABLE IN POOL</span>
          {/* Repeat for seamless loop */}
          <span className="text-slate-400">|</span>
          <span className="flex items-center gap-1.5 text-hood-green font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-hood-green animate-ping"></span>
            ROBINHOOD CHAIN MAINNET: LIVE
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <TrendingUp size={12} /> SPRM $0.420 (+69.42%)
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-400">FLOOR: 0.088 ETH</span>
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

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => sound.playClick()}
                className="text-sm font-medium text-slate-300 hover:text-hood-green transition-colors py-1 relative group"
              >
                {lang === 'ru' ? link.labelRu : link.labelEn}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-hood-green group-hover:w-full transition-all duration-300 rounded-full"></span>
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isAudioOn ? (lang === 'ru' ? 'Выключить звук' : 'Mute sound') : (lang === 'ru' ? 'Включить звук' : 'Enable sound')}
              className={`p-2.5 rounded-xl border transition-all ${
                isAudioOn 
                  ? 'border-hood-green/40 text-hood-green bg-hood-green/10 shadow-sm shadow-hood-green/30' 
                  : 'border-white/10 text-slate-500 bg-white/5 hover:text-slate-300'
              }`}
            >
              {isAudioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-white/25 text-slate-300 text-xs font-mono font-bold transition-all"
            >
              <Globe size={15} className="text-hood-green" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Connect Wallet CTA */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenWallet();
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
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
                  <span>{lang === 'ru' ? 'Кошелек' : 'Connect'}</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0d14]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="p-3 rounded-lg bg-white/5 text-slate-200 font-medium text-sm hover:bg-hood-green/10 hover:text-hood-green transition"
              >
                {lang === 'ru' ? link.labelRu : link.labelEn}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={toggleSound}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300"
              >
                {isAudioOn ? <Volume2 size={18} className="text-hood-green" /> : <VolumeX size={18} />}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-xs font-mono font-bold"
              >
                <Globe size={15} className="text-hood-green" />
                <span>{lang.toUpperCase()}</span>
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onOpenWallet();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-hood-green text-black font-extrabold text-xs tracking-wider flex items-center justify-center gap-2"
            >
              <Wallet size={16} />
              {wallet.connected ? `${wallet.address.slice(0, 6)}...` : (lang === 'ru' ? 'Подключить' : 'Connect')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
