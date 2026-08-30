import React, { useState, useEffect } from 'react';
import { Check, Copy, Share2, ExternalLink, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerWhitelistUser } from '../utils/supabase';
import { sound } from '../utils/sound';

export default function AllowlistIntake({ onGoToLeaderboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  // Mission state tracking
  const [missions, setMissions] = useState({
    follow: { completed: false, countdown: 0 },
    repost: { completed: false, countdown: 0 },
    tag: { completed: false, countdown: 0 },
  });

  const [walletAddress, setWalletAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedData, setCompletedData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-read ?ref=XYZ parameter from URL on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setInviteCode(refParam.toUpperCase());
      }
    } catch (e) {
      console.warn('URL param parse notice:', e);
    }
  }, []);

  // Handle mission click with 5-second verification timer
  const handleMissionClick = (missionKey, url) => {
    sound.playClick();
    window.open(url, '_blank', 'noopener,noreferrer');

    if (missions[missionKey].completed) return;

    // Start 5-second countdown timer
    let count = 5;
    setMissions((prev) => ({
      ...prev,
      [missionKey]: { ...prev[missionKey], countdown: count },
    }));

    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(interval);
        sound.playCash();
        setMissions((prev) => ({
          ...prev,
          [missionKey]: { completed: true, countdown: 0 },
        }));
      } else {
        setMissions((prev) => ({
          ...prev,
          [missionKey]: { ...prev[missionKey], countdown: count },
        }));
      }
    }, 1000);
  };

  // Step 1: Identity validation
  const handleStep1Submit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    sound.playClick();

    let cleanTwitter = twitterUsername.trim();
    if (!cleanTwitter) {
      setErrorMsg('Please enter your X username.');
      return;
    }
    if (!cleanTwitter.startsWith('@')) {
      cleanTwitter = `@${cleanTwitter}`;
      setTwitterUsername(cleanTwitter);
    }

    setCurrentStep(2);
  };

  // Step 2: Missions next step
  const handleStep2Submit = () => {
    sound.playClick();
    setCurrentStep(3);
  };

  // Step 3: Wallet submission to Supabase
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    sound.playClick();

    const cleanWallet = walletAddress.trim();
    if (!cleanWallet) {
      setErrorMsg('Please enter your wallet address.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanWallet)) {
      setErrorMsg('Invalid EVM wallet address. Must start with 0x and be 42 characters.');
      return;
    }

    setSubmitting(true);

    // Generate unique referral code for this user
    const usernameSlug = twitterUsername.replace('@', '').toUpperCase().slice(0, 8);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const myRefCode = `${usernameSlug}-${randomSuffix}`;

    try {
      const res = await registerWhitelistUser({
        wallet: cleanWallet,
        twitter: twitterUsername,
        inviteCode: inviteCode || null,
        myRefCode,
      });

      sound.playMythicReveal();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00F58C', '#00E5FF', '#A855F7', '#FFD700', '#FFFFFF'],
      });

      const savedData = {
        twitter: twitterUsername,
        wallet: cleanWallet,
        myRefCode,
        inviteUsed: inviteCode || 'NONE',
        refLink: `${window.location.origin}/?ref=${myRefCode}`,
      };

      setCompletedData(savedData);
      setCurrentStep(4);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
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

  const tweetShareText = completedData
    ? encodeURIComponent(
        `Just submitted my desk intake for the @SpermBrokers Genesis Allowlist on Robinhood Chain! 🧬\n\nUse my invite code to get on the floor: ${completedData.myRefCode}\n\nApply here: ${completedData.refLink}`
      )
    : '';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-10">
      
      {/* Title Header Matching Screenshot */}
      <div className="text-center space-y-3">
        <div className="font-pixel text-[10px] sm:text-xs text-[#00E5FF] tracking-widest uppercase">
          SPERM BROKERS
        </div>
        <h1 className="font-pixel text-2xl sm:text-4xl text-[#00F58C] tracking-wide uppercase text-neon-green">
          ALLOWLIST INTAKE
        </h1>
      </div>

      {/* Step Tabs Pills Container */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-xl bg-[#05070B] border border-[#1E293B] font-pixel text-[9px] sm:text-xs text-center select-none">
        
        {/* Tab 1 */}
        <button
          onClick={() => {
            if (completedData) return;
            sound.playClick();
            setCurrentStep(1);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            currentStep === 1
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : currentStep > 1
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          01 IDENTITY
        </button>

        {/* Tab 2 */}
        <button
          onClick={() => {
            if (completedData || !twitterUsername) return;
            sound.playClick();
            setCurrentStep(2);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            currentStep === 2
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : currentStep > 2
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent'
              : 'border-transparent text-slate-500'
          }`}
        >
          02 MISSIONS
        </button>

        {/* Tab 3 */}
        <button
          onClick={() => {
            if (completedData || !twitterUsername) return;
            sound.playClick();
            setCurrentStep(3);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            currentStep === 3
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : currentStep > 3
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent'
              : 'border-transparent text-slate-500'
          }`}
        >
          03 WALLET
        </button>

      </div>

      {/* Main Terminal Box Container */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#090D16] border border-[#1E293B] shadow-2xl space-y-6">
        
        {/* ===================== STEP 1: 01 IDENTITY ===================== */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6 animate-in fade-in duration-200">
            <div className="font-pixel text-[10px] text-slate-400 tracking-wider uppercase">
              DESK ACCESS REQUEST
            </div>

            {/* X Username Field */}
            <div className="space-y-2">
              <label className="block font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                X USERNAME
              </label>
              <input
                type="text"
                required
                value={twitterUsername}
                onChange={(e) => setTwitterUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-white font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600"
              />
            </div>

            {/* Invite Code Field */}
            <div className="space-y-2">
              <label className="block font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                INVITE CODE
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="optional"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-[#00E5FF] font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600 uppercase"
              />
            </div>

            {errorMsg && (
              <div className="font-mono text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-xs uppercase tracking-widest shadow-lg shadow-[#00F58C]/20 hover:shadow-[#00F58C]/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              [ ENTER THE FLOOR ]
            </button>
          </form>
        )}

        {/* ===================== STEP 2: 02 MISSIONS ===================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[10px] text-slate-400 tracking-wider uppercase">
                DESK CLEARANCE PROTOCOL
              </span>
              <span className="font-mono text-xs text-[#00F58C] font-bold">
                {Object.values(missions).filter((m) => m.completed).length} / 3 COMPLETED
              </span>
            </div>

            {/* Mission 1: Follow on X */}
            <div
              onClick={() => handleMissionClick('follow', 'https://x.com/SpermBrokers')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                missions.follow.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-500'
              }`}
            >
              <div className="space-y-1">
                <div className="font-pixel text-[11px] text-white">
                  1. Follow @SpermBrokers on X
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Stay synced with official Robinhood Chain drops & alpha
                </div>
              </div>

              <div>
                {missions.follow.completed ? (
                  <span className="px-3 py-1.5 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center gap-1">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.follow.countdown > 0 ? (
                  <span className="px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/40 animate-pulse">
                    VERIFYING {missions.follow.countdown}S...
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {/* Mission 2: Like & Repost Genesis Tweet */}
            <div
              onClick={() => handleMissionClick('repost', 'https://x.com/SpermBrokers')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                missions.repost.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-500'
              }`}
            >
              <div className="space-y-1">
                <div className="font-pixel text-[11px] text-white">
                  2. Like & Repost Announcement
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Broadcast the 16-bit Wall Street Degen Dynasty
                </div>
              </div>

              <div>
                {missions.repost.completed ? (
                  <span className="px-3 py-1.5 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center gap-1">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.repost.countdown > 0 ? (
                  <span className="px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/40 animate-pulse">
                    VERIFYING {missions.repost.countdown}S...
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {/* Mission 3: Tag 3 Friends / Quote Tweet */}
            <div
              onClick={() => handleMissionClick('tag', 'https://x.com/SpermBrokers')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                missions.tag.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-500'
              }`}
            >
              <div className="space-y-1">
                <div className="font-pixel text-[11px] text-white">
                  3. Tag 3 Degen Friends on X
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Summon fellow brokers to qualify for priority tier
                </div>
              </div>

              <div>
                {missions.tag.completed ? (
                  <span className="px-3 py-1.5 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center gap-1">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.tag.countdown > 0 ? (
                  <span className="px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/40 animate-pulse">
                    VERIFYING {missions.tag.countdown}S...
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {/* Proceed to Step 3 Button */}
            <button
              onClick={handleStep2Submit}
              className="w-full py-4 px-6 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-xs uppercase tracking-widest shadow-lg shadow-[#00F58C]/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              [ PROCEED TO WALLET ]
            </button>
          </div>
        )}

        {/* ===================== STEP 3: 03 WALLET ===================== */}
        {currentStep === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-6 animate-in fade-in duration-200">
            <div className="font-pixel text-[10px] text-slate-400 tracking-wider uppercase">
              FINAL CLEARANCE: WALLET SUBMISSION
            </div>

            {/* Target Wallet Input */}
            <div className="space-y-2">
              <label className="block font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                EVM / ROBINHOOD WALLET ADDRESS
              </label>
              <input
                type="text"
                required
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x71C...3921"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-white font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600"
              />
              <p className="font-mono text-[11px] text-slate-500">
                This wallet will receive the official guaranteed Whitelist / Airdrop mint rights.
              </p>
            </div>

            {errorMsg && (
              <div className="font-mono text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-xs uppercase tracking-widest shadow-lg shadow-[#00F58C]/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>[ SECURING SPOT IN VAULT... ]</span>
                </>
              ) : (
                <span>[ SUBMIT APPLICATION ]</span>
              )}
            </button>
          </form>
        )}

        {/* ===================== STEP 4: ACCESS GRANTED & REFERRAL BOX ===================== */}
        {currentStep === 4 && completedData && (
          <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-300">
            
            {/* Top Confirmed Stamp */}
            <div className="inline-block p-3 rounded-2xl bg-[#00F58C]/15 border-2 border-[#00F58C] text-[#00F58C]">
              <Check size={32} className="stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-pixel text-xl sm:text-2xl text-[#00F58C] uppercase tracking-wide">
                DESK ACCESS GRANTED!
              </h2>
              <p className="font-mono text-xs text-slate-300">
                Welcome to the floor, <span className="text-white font-bold">{completedData.twitter}</span>.
              </p>
            </div>

            {/* User Credentials Card */}
            <div className="p-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Broker Identity:</span>
                <span className="text-[#00E5FF] font-bold">{completedData.twitter}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Wallet:</span>
                <span className="text-white font-bold">{completedData.wallet.slice(0, 6)}...{completedData.wallet.slice(-4)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Desk Status:</span>
                <span className="text-[#00F58C] font-bold">[ GTD ] REGISTERED</span>
              </div>
            </div>

            {/* YOUR REFERRAL LINK BOX */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0e1626] to-[#04060A] border border-[#00F58C]/40 text-left space-y-4 shadow-lg shadow-[#00F58C]/10">
              
              <div className="flex justify-between items-center">
                <span className="font-pixel text-[10px] text-[#00F58C] uppercase">
                  YOUR INVITE CODE:
                </span>
                <button
                  onClick={() => copyToClipboard(completedData.myRefCode, 'code')}
                  className="font-pixel text-[9px] text-[#00E5FF] hover:underline flex items-center gap-1"
                >
                  {copiedCode ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black border border-white/10 font-mono text-sm text-[#00F58C] font-bold text-center tracking-widest">
                {completedData.myRefCode}
              </div>

              <div className="space-y-1.5">
                <span className="font-pixel text-[9px] text-slate-400 uppercase">
                  YOUR REFERRAL LINK:
                </span>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={completedData.refLink}
                    className="w-full px-3 py-2.5 rounded-lg bg-black border border-white/10 text-slate-300 font-mono text-xs truncate focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(completedData.refLink, 'link')}
                    className="px-4 py-2.5 rounded-lg bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-[9px] uppercase whitespace-nowrap flex items-center gap-1 transition"
                  >
                    <Copy size={12} />
                    <span>{copiedLink ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              <p className="font-mono text-[11px] text-slate-400 leading-relaxed">
                ⚡ Share your invite code with friends to climb the <span className="text-[#00F58C] font-bold">Top Sperm Brokers Leaderboard</span> for guaranteed allocation boosts.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${tweetShareText}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playCash()}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#00F58C]/20 transition"
              >
                <Share2 size={14} />
                <span>SHARE ON X (+10 PTS)</span>
              </a>

              <button
                onClick={() => {
                  sound.playClick();
                  onGoToLeaderboard();
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-pixel text-[10px] uppercase flex items-center justify-center gap-2 border border-white/15 transition"
              >
                <span>VIEW LEADERBOARD</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
