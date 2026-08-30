import React, { useRef, useState } from 'react';
import { Download, Share2, Check, Loader2, Copy } from 'lucide-react';
import { toPng } from 'html-to-image';
import { sound } from '../utils/sound';

export default function AllowlistPass({ data, onReset }) {
  const passRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cleanTwitter = data.twitter.startsWith('@') ? data.twitter : `@${data.twitter}`;
  const firstLetter = cleanTwitter.replace('@', '').charAt(0).toUpperCase() || 'B';
  const shortenedWallet = `${data.wallet.slice(0, 6)}...${data.wallet.slice(-4)}`;
  
  // Deterministic spot number based on referral code or hash
  const spotNumber = data.spotNumber || Math.floor(1000 + Math.random() * 8999);
  const formattedDate = new Date().toISOString().split('T')[0];

  const handleDownload = async () => {
    if (!passRef.current) return;
    sound.playCash();
    setDownloading(true);

    try {
      // Small timeout to ensure fonts/images are ready
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      const dataUrl = await toPng(passRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution retina output
        backgroundColor: '#05070B',
      });

      const link = document.createElement('a');
      link.download = `sperm-broker-pass-${cleanTwitter.replace('@', '')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download pass:', err);
    } finally {
      setDownloading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    sound.playCash();
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const tweetShareText = encodeURIComponent(
    `Just secured my official Allowlist Pass #${spotNumber} for @SpermBrokers on Robinhood Chain! 🧬\n\nApply with my code: ${data.myRefCode}\n\nRegister: ${data.refLink}`
  );

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-300 max-w-md mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="font-pixel text-[9px] text-[#00F58C] uppercase tracking-widest">
          YOU'RE IN
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome, {cleanTwitter}
        </h2>
        <p className="font-mono text-xs text-slate-400">
          Keep the pass — it’s your proof of entry.
        </p>
      </div>

      {/* ===================== DIGITAL CYBER PASS CARD ===================== */}
      <div
        ref={passRef}
        className="rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#090E17] to-[#04060A] border-2 border-[#1E293B] shadow-2xl relative space-y-6 text-slate-100 select-none overflow-hidden"
      >
        {/* Subtle glowing ambient gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#00F58C]/10 blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-4">
          <span className="font-pixel text-[10px] text-[#00F58C] uppercase tracking-wider">
            SPERM BROKERS
          </span>
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            ALLOWLIST PASS
          </span>
        </div>

        {/* Avatar + Badge Section */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#00F58C] bg-black shadow-lg shadow-[#00F58C]/20 flex items-center justify-center">
              <img
                src={data.avatarUrl || `/favicon.png`}
                alt={cleanTwitter}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/favicon.png';
                }}
              />
            </div>
            {/* Round initial badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#0D1522] border-2 border-[#00F58C] flex items-center justify-center font-bold text-white text-xs shadow-md">
              {firstLetter}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {cleanTwitter}
            </div>
            <div className="font-pixel text-[8px] text-slate-400 uppercase tracking-widest">
              VERIFIED BROKER
            </div>
          </div>
        </div>

        {/* Middle Highlight Box: Spot # + Date */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#04060A] border border-[#00F58C]/30 flex justify-between items-center shadow-inner">
          <div className="space-y-1">
            <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">
              ALLOWLIST SPOT
            </span>
            <span className="font-mono text-2xl sm:text-3xl text-[#00F58C] font-extrabold tracking-tight">
              #{spotNumber}
            </span>
          </div>

          <div className="space-y-1 text-right">
            <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">
              ISSUED
            </span>
            <span className="font-mono text-xs sm:text-sm text-slate-200 font-semibold">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Wallet Details */}
        <div className="space-y-1.5">
          <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-wider">
            WALLET
          </span>
          <span className="font-mono text-sm text-white font-bold tracking-wider">
            {shortenedWallet}
          </span>
        </div>

        {/* Glowing Cyber Barcode Pattern */}
        <div className="py-1">
          <div className="flex items-center gap-[3px] h-8 overflow-hidden opacity-85">
            {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 6, 2, 5, 1, 4, 3, 7, 2, 4, 1, 6, 3, 5, 2, 7, 4, 1, 3, 5].map((height, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm ${
                  i % 4 === 0
                    ? 'bg-[#00F58C]'
                    : i % 7 === 0
                    ? 'bg-[#00E5FF]'
                    : 'bg-slate-700'
                }`}
                style={{ height: `${height * 14}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-center border-t border-[#1E293B] pt-4 font-mono text-[9px] text-slate-500">
          <span className="uppercase tracking-widest">
            SPERMBROKERS • PHASE 1
          </span>
          <span className="text-[#00F58C] uppercase tracking-wider font-semibold">
            X.COM/SPERMBROKERS
          </span>
        </div>

      </div>

      {/* ===================== ACTION BUTTONS ===================== */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Download Pass Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="py-3.5 px-4 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-[10px] uppercase tracking-wider shadow-lg shadow-[#00F58C]/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>SAVING...</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>DOWNLOAD PASS</span>
            </>
          )}
        </button>

        {/* Share on X Button */}
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetShareText}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => sound.playCash()}
          className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-pixel text-[10px] uppercase tracking-wider border border-white/15 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Share2 size={14} />
          <span>SHARE ON X</span>
        </a>

      </div>

      {/* ===================== REFERRAL LINK BOX ===================== */}
      <div className="p-5 rounded-2xl bg-[#090D16] border border-[#1E293B] text-left space-y-3 shadow-lg">
        <div className="flex justify-between items-center">
          <span className="font-pixel text-[9px] text-slate-400 uppercase tracking-wider">
            YOUR INVITE LINK
          </span>
          <button
            type="button"
            onClick={() => copyToClipboard(data.myRefCode, 'code')}
            className="font-pixel text-[9px] text-[#00E5FF] hover:underline flex items-center gap-1"
          >
            {copiedCode ? 'COPIED CODE!' : `CODE: ${data.myRefCode}`}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            readOnly
            value={data.refLink}
            className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-slate-300 font-mono text-xs truncate focus:outline-none"
          />
          <button
            type="button"
            onClick={() => copyToClipboard(data.refLink, 'link')}
            className="px-4 py-2.5 rounded-lg bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-[9px] uppercase whitespace-nowrap flex items-center gap-1 transition"
          >
            <Copy size={12} />
            <span>{copiedLink ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>

        <p className="font-mono text-[11px] text-slate-500 leading-relaxed">
          Every wallet that registers through your link secures your priority tier.
        </p>
      </div>

      {/* Reset Button */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onReset}
          className="font-pixel text-[9px] text-slate-600 hover:text-slate-400 uppercase tracking-widest transition hover:underline"
        >
          [ REGISTER ANOTHER WALLET ]
        </button>
      </div>

    </div>
  );
}
