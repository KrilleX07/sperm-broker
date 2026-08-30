import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WhitelistForm from './components/WhitelistForm';
import WalletModal from './components/WalletModal';
import Footer from './components/Footer';

export default function App() {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [wallet, setWallet] = useState({
    connected: false,
    address: '',
    balanceEth: '0',
    walletType: '',
    network: '',
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-hood-green selection:text-black flex flex-col justify-between">
      {/* Scanline CRT overlay effect for authentic 16-bit terminal aesthetic */}
      <div className="fixed inset-0 scanlines pointer-events-none z-40 opacity-25"></div>

      {/* Top Navbar */}
      <Navbar
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        wallet={wallet}
        onOpenWallet={() => setIsWalletModalOpen(true)}
      />

      {/* Main Content: Dedicated Whitelist Form */}
      <main className="relative z-10 flex-1">
        <WhitelistForm
          wallet={wallet}
          onOpenWallet={() => setIsWalletModalOpen(true)}
        />
      </main>

      {/* Minimalist Footer */}
      <Footer />

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
