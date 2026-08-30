import React, { useState } from 'react';
import { Zap, Plus, Minus, CheckCircle, Sparkles, Shield, Flame, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NFT_COLLECTION, STATS } from '../data/nfts';
import { sound } from '../utils/sound';

export default function MintSection({ lang, t, wallet, onOpenWallet, onSelectNFT }) {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [currentSupply, setCurrentSupply] = useState(STATS.mintedSupply);

  const pricePerUnit = STATS.mintPriceEth;
  const totalPrice = (mintAmount * pricePerUnit).toFixed(2);
  const progressPercent = Math.min(100, Math.round((currentSupply / STATS.totalSupply) * 100));

  const handleIncrement = () => {
    sound.playClick();
    if (mintAmount < 10) setMintAmount(mintAmount + 1);
  };

  const handleDecrement = () => {
    sound.playClick();
    if (mintAmount > 1) setMintAmount(mintAmount - 1);
  };

  const handleMax = () => {
    sound.playClick();
    setMintAmount(10);
  };

  const executeMint = () => {
    if (!wallet.connected) {
      onOpenWallet();
      return;
    }

    sound.playCash();
    setIsMinting(true);
    setMintResult(null);

    // Simulate blockchain confirmation & random NFT reveal
    setTimeout(() => {
      // Pick random minted NFT from the pool (with bias to rare/epic or golden god)
      const randomIndex = Math.floor(Math.random() * NFT_COLLECTION.length);
      const mintedNFT = NFT_COLLECTION[randomIndex];

      setIsMinting(false);
      setMintResult(mintedNFT);
      setCurrentSupply((prev) => Math.min(STATS.totalSupply, prev + mintAmount));

      if (mintedNFT.isMythic || mintedNFT.rarity === 'Legendary') {
        sound.playMythicReveal();
      } else {
        sound.playMintSuccess();
      }

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00F58C', '#00E5FF', '#FFD700', '#FF007A']
        });
      } catch (e) {}
    }, 2200);
  };

  return (
    <section id="mint" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider">
            <Zap size={14} />
            <span>{t.mint.badge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            {t.mint.title}
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            {t.mint.subtitle}
          </p>
        </div>

        {/* Mint Card Terminal */}
        <div className="relative rounded-3xl p-8 sm:p-12 glass-panel-glow border border-white/15 shadow-2xl overflow-hidden">
          
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00F58C_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Supply Counter & Visual */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-hood-green flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-hood-green animate-ping"></span>
                  {t.mint.liveStatus}
                </span>
                <span className="text-slate-400">
                  {progressPercent}% SOLD
                </span>
              </div>

              {/* Visual Supply Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-white font-mono">
                  <span>{t.mint.progress}</span>
                  <span className="text-hood-green">{currentSupply} / {STATS.totalSupply}</span>
                </div>
                <div className="h-3.5 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-hood-green via-emerald-400 to-cyber-cyan rounded-full transition-all duration-700 shadow-sm shadow-hood-green"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-mono">Phase</div>
                  <div className="text-sm font-bold text-white">Public Mint</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-mono">Max per Wallet</div>
                  <div className="text-sm font-bold text-cyber-gold">10 NFTs</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-mono">Blockchain</div>
                  <div className="text-sm font-bold text-cyber-cyan font-mono">Robinhood L2</div>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="text-[11px] text-slate-400 font-mono">Instant Staking</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">Enabled</div>
                </div>
              </div>
            </div>

            {/* Right Col: Amount Controller & Mint Action Button */}
            <div className="md:col-span-7 bg-[#07090E]/90 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
              
              {/* Quantity Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {t.mint.selectAmount}
                </label>
                <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-black/60 border border-white/10">
                  <button
                    onClick={handleDecrement}
                    disabled={mintAmount <= 1 || isMinting}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                  >
                    <Minus size={18} />
                  </button>

                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {mintAmount}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">BROKER{mintAmount > 1 ? 'S' : ''}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleIncrement}
                      disabled={mintAmount >= 10 || isMinting}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 disabled:opacity-30 disabled:hover:bg-white/5 transition"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={handleMax}
                      disabled={isMinting}
                      className="px-3 py-2 rounded-lg bg-hood-green/20 hover:bg-hood-green/30 border border-hood-green/40 text-hood-green text-xs font-mono font-extrabold transition"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-2 border-t border-white/10 font-mono text-sm">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>{t.mint.unitPrice}</span>
                  <span className="text-slate-200 font-semibold">{pricePerUnit} ETH (~$165)</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-1">
                  <span>{t.mint.totalCost}</span>
                  <span className="text-hood-green font-extrabold text-lg">{totalPrice} ETH</span>
                </div>
                <div className="text-[11px] text-slate-500 text-right">
                  {t.mint.gasIncluded}
                </div>
              </div>

              {/* Mint Submit Button */}
              <button
                onClick={executeMint}
                disabled={isMinting}
                className={`w-full py-4 px-6 rounded-xl font-extrabold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 ${
                  isMinting
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                    : wallet.connected
                      ? 'bg-gradient-to-r from-hood-green via-emerald-400 to-emerald-500 text-black shadow-lg shadow-hood-green/30 hover:shadow-hood-green/50 hover:scale-[1.01]'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                }`}
              >
                {isMinting ? (
                  <>
                    <RefreshCw size={20} className="animate-spin text-hood-green" />
                    <span>{t.mint.minting}</span>
                  </>
                ) : !wallet.connected ? (
                  <>
                    <Zap size={20} />
                    <span>{lang === 'ru' ? 'Подключить кошелек и сминтить' : 'Connect Wallet to Mint'}</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} className="fill-black" />
                    <span>{t.mint.mintAction} ({totalPrice} ETH)</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* Mint Result Reveal Card (Pop-up after successful mint) */}
          {mintResult && (
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-black border-2 border-hood-green shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                
                {/* Minted Image Thumbnail */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-hood-green shadow-lg shadow-hood-green/30 flex-shrink-0">
                  <img
                    src={mintResult.image}
                    alt={mintResult.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white">
                    #{mintResult.id}
                  </div>
                </div>

                {/* Mint Details */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-hood-green text-black font-mono font-extrabold text-xs">
                      {t.mint.successTitle}
                    </span>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border"
                      style={{ 
                        backgroundColor: `${mintResult.rarityColor}20`,
                        borderColor: mintResult.rarityColor,
                        color: mintResult.rarityColor
                      }}
                    >
                      {mintResult.rarity}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white font-display">
                    {mintResult.name} — <span className="text-slate-400 font-mono text-sm">{mintResult.title}</span>
                  </h4>
                  
                  <p className="text-xs text-slate-300">
                    {mintResult.quote[lang]}
                  </p>
                </div>

                {/* Action in Result */}
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectNFT(mintResult);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-hood-green text-black font-bold text-xs hover:bg-emerald-400 transition"
                  >
                    {t.mint.viewInGallery}
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setMintResult(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-medium transition"
                  >
                    {t.mint.mintAnother}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
