import React from 'react';
import { ExternalLink } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Footer() {
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D111A] border border-white/10 hover:border-hood-green/50 text-white text-xs font-mono font-bold transition hover:scale-105"
              >
                <span className="text-base leading-none">𝕏</span>
                <span>X</span>
              </a>
              <a
                href="https://opensea.io"
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D111A] border border-white/10 hover:border-hood-green/50 text-slate-200 text-xs font-mono font-bold transition hover:scale-105"
              >
                <span>OpenSea</span>
                <ExternalLink size={13} className="text-slate-400" />
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
