import React, { useState } from 'react';
import { Coins, Check, Zap, Lock, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { NFT_COLLECTION } from '../data/nfts';
import { sound } from '../utils/sound';

export default function StakingCalculator() {
  const [selectedIds, setSelectedIds] = useState(['001', '003', '011']);

  const toggleBroker = (id) => {
    sound.playClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    sound.playClick();
    if (selectedIds.length === NFT_COLLECTION.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(NFT_COLLECTION.map((n) => n.id));
    }
  };

  // Compute metrics
  const selectedNFTs = NFT_COLLECTION.filter((n) => selectedIds.includes(n.id));
  const dailyYield = selectedNFTs.reduce((sum, n) => sum + n.stakingYield, 0);
  const monthlyYield = dailyYield * 30;
  const tokenPriceUsd = 0.42;
  const monthlyValueUsd = (monthlyYield * tokenPriceUsd).toFixed(2);

  return (
    <section id="staking" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider animate-pulse">
            <Lock size={14} />
            <span>DEFI PROTOCOL • COMING SOON</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            $SPRM Staking Vault
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Preview your prospective daily $SPRM yield before official mainnet launch. Non-custodial staking contracts are scheduled for Phase 2 on Robinhood Chain.
          </p>
        </div>

        {/* Interactive Staking Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col: Broker Selector Grid */}
          <div className="lg:col-span-7 bg-[#0D111A]/90 rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Select Prospective Brokers:
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {selectedIds.length} / {NFT_COLLECTION.length} selected for simulation
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
            <div className="rounded-3xl p-6 sm:p-8 glass-panel-glow border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={14} className="text-amber-400" />
                  <span>Projected Yield Simulator</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  Phase 2 Launch
                </span>
              </div>

              {/* Big Daily Metric */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-slate-400">Simulated Daily Yield</div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-hood-green flex items-baseline gap-2">
                  <span>+{dailyYield}</span>
                  <span className="text-sm text-slate-400 font-sans">$SPRM / day</span>
                </div>
              </div>

              {/* Monthly & USD Value */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono">
                <div>
                  <div className="text-[11px] text-slate-400">30-Day Potential</div>
                  <div className="text-lg font-bold text-white">+{monthlyYield} $SPRM</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Est. USD Value ($0.42)</div>
                  <div className="text-lg font-bold text-cyber-gold">${monthlyValueUsd}</div>
                </div>
              </div>

              {/* Disabled Staking Button with Coming Soon indicator */}
              <div className="pt-2">
                <button
                  disabled
                  className="w-full py-4 px-6 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-300 font-extrabold text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 cursor-not-allowed shadow-lg shadow-amber-500/10"
                >
                  <Lock size={16} />
                  <span>Staking Protocol Soon...</span>
                </button>
                <p className="text-[11px] font-mono text-slate-500 text-center mt-2">
                  Contract deployment countdown in progress (Q2 2026)
                </p>
              </div>

            </div>

            {/* Unlocked Perks List */}
            <div className="rounded-3xl p-6 bg-[#0D111A]/90 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-cyber-gold" />
                <span>Upcoming Holder Perks:</span>
              </h4>

              <div className="space-y-2.5 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-hood-green"></span>
                  <span>Exclusive Whale Alpha Signals Discord Lounge</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan"></span>
                  <span>50% Secondary Market Royalty Redistribution</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-cyber-gold"></span>
                  <span>Guaranteed Whitelist for V2 Expansion Drop</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-cyber-pink"></span>
                  <span>Governance Voting Rights in Robinhood Hedge DAO</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
