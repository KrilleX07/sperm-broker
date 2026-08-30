import React, { useState } from 'react';
import { Copy, Check, Send, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  const handleCopyContract = () => {
    sound.playCash();
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="border-t border-white/10 bg-[#04060A] text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hood-green to-cyber-cyan p-[2px]">
                <div className="w-full h-full bg-[#07090E] rounded-[10px] flex items-center justify-center text-xl">
                  🧬
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white font-display">
                SPERM <span className="text-hood-green">BROKERS</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Official generative 16-bit retro NFT collection of 1,000 unique Wall Street brokers engineered for the Robinhood Chain ecosystem.
            </p>

            {/* Contract copy bar */}
            <div className="pt-2">
              <div className="text-[11px] font-mono text-slate-500 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-hood-green" />
                <span>Robinhood Verified Contract:</span>
              </div>
              <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-[#0D111A] border border-white/10 font-mono text-xs text-slate-300">
                <span>0x742d...f44e</span>
                <button
                  onClick={handleCopyContract}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-hood-green transition"
                  title="Copy contract"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#gallery" onClick={() => sound.playClick()} className="hover:text-hood-green transition">
                  Character Gallery (11 Archetypes)
                </a>
              </li>
              <li>
                <a href="#staking" onClick={() => sound.playClick()} className="hover:text-hood-green transition">
                  $SPRM Staking Vault (Soon)
                </a>
              </li>
              <li>
                <a href="#lore" onClick={() => sound.playClick()} className="hover:text-hood-green transition">
                  Lore & Philosophy
                </a>
              </li>
              <li>
                <a href="#traits" onClick={() => sound.playClick()} className="hover:text-hood-green transition">
                  Trait Matrix
                </a>
              </li>
              <li>
                <a href="#roadmap" onClick={() => sound.playClick()} className="hover:text-hood-green transition">
                  Roadmap (2026-2027)
                </a>
              </li>
              <li>
                <a href="#faq" onClick={() => sound.playClick()} className="hover:text-hood-green transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Socials & Marketplaces */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Community & Markets
            </h4>

            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D111A] border border-white/10 hover:border-hood-green/50 text-slate-200 text-xs font-mono transition"
              >
                <span>𝕏 Twitter</span>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D111A] border border-white/10 hover:border-hood-green/50 text-slate-200 text-xs font-mono transition"
              >
                <span>Discord</span>
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D111A] border border-white/10 hover:border-hood-green/50 text-slate-200 text-xs font-mono transition"
              >
                <span>Telegram</span>
              </a>
              <a
                href="https://opensea.io"
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D111A] border border-white/10 hover:border-hood-green/50 text-slate-200 text-xs font-mono transition"
              >
                <span>OpenSea</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Disclaimer: Sperm Brokers is a digital art meme collection and Web3 cultural experiment on Robinhood Chain. Not financial advice. DYOR.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© 2026 Sperm Brokers NFT. All rights reserved.</div>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span>Built with pure Degen Energy on</span>
            <span className="text-hood-green font-bold">Robinhood Chain</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
