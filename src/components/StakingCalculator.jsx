import React, { useState } from 'react';
import { Coins, Check, Zap, Shield, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import { NFT_COLLECTION } from '../data/nfts';
import { sound } from '../utils/sound';

export default function StakingCalculator({ lang, t }) {
  // Pre-select 3 brokers by default for interactive showcase
  const [selectedIds, setSelectedIds] = useState(['001', '003', '011']);
  const [isStaked, setIsStaked] = useState(false);

  const toggleBroker = (id) => {
    sound.playClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setIsStaked(false);
  };

  const handleSelectAll = () => {
    sound.playClick();
    if (selectedIds.length === NFT_COLLECTION.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(NFT_COLLECTION.map((n) => n.id));
    }
    setIsStaked(false);
  };

  // Compute metrics
  const selectedNFTs = NFT_COLLECTION.filter((n) => selectedIds.includes(n.id));
  const dailyYield = selectedNFTs.reduce((sum, n) => sum + n.stakingYield, 0);
  const monthlyYield = dailyYield * 30;
  const tokenPriceUsd = 0.42;
  const monthlyValueUsd = (monthlyYield * tokenPriceUsd).toFixed(2);

  const handleStake = () => {
    sound.playCash();
    setIsStaked(true);
  };

  return (
    <section id="staking" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-gold/10 border border-cyber-gold/30 text-cyber-gold text-xs font-mono font-bold tracking-wider">
            <Coins size={14} />
            <span>{t.staking.badge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            {t.staking.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            {t.staking.subtitle}
          </p>
        </div>

        {/* Interactive Staking Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col: Broker Selector Grid */}
          <div className="lg:col-span-7 bg-[#0D111A]/90 rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {t.staking.selectBrokers}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {selectedIds.length} / {NFT_COLLECTION.length} selected
                </p>
              </div>

              <button
                onClick={handleSelectAll}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold transition"
              >
                {selectedIds.length === NFT_COLLECTION.length ? 'Deselect All' : 'Select All 11'}
              </button>
            </div>

            {/* Selector Grid of 11 NFTs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {NFT_COLLECTION.map((nft) => {
                const isSelected = selectedIds.includes(nft.id);
                return (
                  <div
                    key={nft.id}
                    onClick={() => toggleBroker(nft.id)}
                    className={`relative rounded-2xl p-2.5 border cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-hood-green/10 border-hood-green shadow-md shadow-hood-green/10'
                        : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-hood-green/30 flex items-center justify-center">
                          <Check size={16} className="text-black font-extrabold" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{nft.name}</div>
                      <div className="text-[10px] font-mono text-hood-green">+{nft.stakingYield} $SPRM/d</div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Col: Yield Calculations & Unlocked Perks */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Real-time Earnings Card */}
            <div className="rounded-3xl p-6 sm:p-8 glass-panel-glow border border-hood-green/30 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Real-Time Yield Meter
                </span>
                <span className="px-2.5 py-1 rounded-full bg-hood-green/20 text-hood-green font-mono text-xs font-bold">
                  Robinhood Vault
                </span>
              </div>

              {/* Big Daily Metric */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-slate-400">{t.staking.dailyYield}</div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-hood-green flex items-baseline gap-2">
                  <span>+{dailyYield}</span>
                  <span className="text-sm text-slate-400 font-sans">$SPRM / day</span>
                </div>
              </div>

              {/* Monthly & USD Value */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono">
                <div>
                  <div className="text-[11px] text-slate-400">{t.staking.monthlyYield}</div>
                  <div className="text-lg font-bold text-white">+{monthlyYield} $SPRM</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Est. USD Value</div>
                  <div className="text-lg font-bold text-cyber-gold">${monthlyValueUsd}</div>
                </div>
              </div>

              {/* Stake Button */}
              <button
                onClick={handleStake}
                disabled={selectedIds.length === 0}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-hood-green to-emerald-400 hover:from-emerald-400 hover:to-hood-green text-black font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-hood-green/30 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Zap size={18} className="fill-black" />
                <span>{t.staking.stakeAction}</span>
              </button>

              {isStaked && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>{t.staking.stakedSuccess}</span>
                </div>
              )}

            </div>

            {/* Unlocked Perks List */}
            <div className="rounded-3xl p-6 bg-[#0D111A]/90 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-cyber-gold" />
                <span>{t.staking.perksTitle}</span>
              </h4>

              <div className="space-y-2.5 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-hood-green"></span>
                  <span>{t.staking.perk1}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan"></span>
                  <span>{t.staking.perk2}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-cyber-gold"></span>
                  <span>{t.staking.perk3}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-cyber-pink"></span>
                  <span>{t.staking.perk4}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
