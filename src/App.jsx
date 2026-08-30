import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MintSection from './components/MintSection';
import Gallery from './components/Gallery';
import NFTModal from './components/NFTModal';
import StakingCalculator from './components/StakingCalculator';
import LoreSection from './components/LoreSection';
import TraitMatrix from './components/TraitMatrix';
import Roadmap from './components/Roadmap';
import FAQ from './components/FAQ';
import WalletModal from './components/WalletModal';
import Footer from './components/Footer';
import { translations } from './data/translations';

export default function App() {
  const [lang, setLang] = useState('ru');
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [activeNFTModal, setActiveNFTModal] = useState(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [wallet, setWallet] = useState({
    connected: false,
    address: '',
    balanceEth: '0',
    walletType: '',
    network: '',
  });

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-hood-green selection:text-black">
      {/* Scanline CRT overlay effect for authentic 16-bit terminal aesthetic */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-30"></div>

      {/* Top Navbar & Ticker */}
      <Navbar
        lang={lang}
        setLang={setLang}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        wallet={wallet}
        onOpenWallet={() => setIsWalletModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero
          lang={lang}
          t={t}
          onSelectNFT={(nft) => setActiveNFTModal(nft)}
        />

        {/* Live Web3 Minting Terminal */}
        <MintSection
          lang={lang}
          t={t}
          wallet={wallet}
          onOpenWallet={() => setIsWalletModalOpen(true)}
          onSelectNFT={(nft) => setActiveNFTModal(nft)}
        />

        {/* Interactive NFT Collection Gallery */}
        <Gallery
          lang={lang}
          t={t}
          onSelectNFT={(nft) => setActiveNFTModal(nft)}
        />

        {/* DeFi $SPRM Staking Yield Simulator */}
        <StakingCalculator
          lang={lang}
          t={t}
        />

        {/* The Lore & Backstory */}
        <LoreSection
          lang={lang}
          t={t}
        />

        {/* Trait Matrix Breakdown */}
        <TraitMatrix
          lang={lang}
        />

        {/* 2026-2027 Roadmap */}
        <Roadmap
          lang={lang}
          t={t}
        />

        {/* Frequently Asked Questions */}
        <FAQ
          lang={lang}
          t={t}
        />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        t={t}
      />

      {/* NFT Dossier Detail Modal */}
      {activeNFTModal && (
        <NFTModal
          nft={activeNFTModal}
          lang={lang}
          t={t}
          onClose={() => setActiveNFTModal(null)}
        />
      )}

      {/* Web3 Wallet Connect Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
        lang={lang}
        t={t}
      />
    </div>
  );
}
