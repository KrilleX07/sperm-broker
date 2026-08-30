import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import NFTModal from './components/NFTModal';
import StakingCalculator from './components/StakingCalculator';
import LoreSection from './components/LoreSection';
import TraitMatrix from './components/TraitMatrix';
import Roadmap from './components/Roadmap';
import FAQ from './components/FAQ';
import WalletModal from './components/WalletModal';
import Footer from './components/Footer';

export default function App() {
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

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-hood-green selection:text-black">
      {/* Scanline CRT overlay effect for authentic 16-bit terminal aesthetic */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-30"></div>

      {/* Top Navbar & Ticker */}
      <Navbar
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        wallet={wallet}
        onOpenWallet={() => setIsWalletModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero
          onSelectNFT={(nft) => setActiveNFTModal(nft)}
        />

        {/* Interactive NFT Collection Gallery */}
        <Gallery
          onSelectNFT={(nft) => setActiveNFTModal(nft)}
        />

        {/* DeFi $SPRM Staking Vault (Coming Soon) */}
        <StakingCalculator />

        {/* The Lore & Backstory */}
        <LoreSection />

        {/* Trait Matrix Breakdown */}
        <TraitMatrix />

        {/* 2026-2027 Roadmap */}
        <Roadmap />

        {/* Frequently Asked Questions */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />

      {/* NFT Dossier Detail Modal */}
      {activeNFTModal && (
        <NFTModal
          nft={activeNFTModal}
          onClose={() => setActiveNFTModal(null)}
        />
      )}

      {/* Web3 Wallet Connect Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
      />
    </div>
  );
}
