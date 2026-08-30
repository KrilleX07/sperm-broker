import React, { useState, useEffect } from 'react';
import { Check, Copy, Share2, ExternalLink, ArrowRight, Loader2, Sparkles, AlertCircle, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerWhitelistUser, validateInviteCode, checkTwitterExists, checkWalletExists } from '../utils/supabase';
import { fetchTwitterAvatar } from '../utils/avatar';
import { sound } from '../utils/sound';
import AllowlistPass from './AllowlistPass';

export default function AllowlistIntake() {
  const [currentStep, setCurrentStep] = useState(1);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [inviteCodeStatus, setInviteCodeStatus] = useState(null); // { valid: true/false, message }

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // 3 Missions state tracking
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

  // Debounced real Twitter avatar lookup
  useEffect(() => {
    const clean = twitterUsername.replace('@', '').trim();
    if (clean.length >= 2) {
      setAvatarLoading(true);
      const timer = setTimeout(() => {
        fetchTwitterAvatar(clean).then((url) => {
          setAvatarUrl(url);
          setAvatarLoading(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAvatarUrl(null);
      setAvatarLoading(false);
    }
  }, [twitterUsername]);

  // Restore completed state from localStorage on page reload
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sperm_broker_registered_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.wallet && parsed?.twitter && parsed?.myRefCode) {
          setCompletedData(parsed);
          setTwitterUsername(parsed.twitter);
          setWalletAddress(parsed.wallet);
          setMissions({
            follow: { completed: true, countdown: 0 },
            repost: { completed: true, countdown: 0 },
            tag: { completed: true, countdown: 0 },
          });
          setCurrentStep(4);
        }
      }
    } catch (e) {
      console.warn('LocalStorage restore notice:', e);
    }
  }, []);

  // Auto-read ?ref=XYZ parameter from URL on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setInviteCode(refParam.toUpperCase());
        validateInviteCode(refParam.toUpperCase()).then((res) => {
          setInviteCodeStatus(res);
        });
      }
    } catch (e) {
      console.warn('URL param parse notice:', e);
    }
  }, []);

  // Handle mission click with 5-second countdown timer
  const handleMissionClick = (missionKey, url) => {
    sound.playClick();
    window.open(url, '_blank', 'noopener,noreferrer');

    if (missions[missionKey].completed) return;

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

  const completedMissionsCount = Object.values(missions).filter((m) => m.completed).length;
  const allMissionsDone = completedMissionsCount === 3;

  // Step 1: Validate identity, check Twitter duplicate and referral code
  const handleStep1Submit = async (e) => {
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

    const handleBody = cleanTwitter.slice(1);
    // Strict Latin-only alphanumeric + underscore check (no Cyrillic, no special chars)
    if (!/^[a-zA-Z0-9_]{1,30}$/.test(handleBody)) {
      setErrorMsg('X (Twitter) handle must only contain Latin letters (a-z, A-Z), numbers, and underscores (_). Cyrillic is not allowed.');
      return;
    }

    setValidatingCode(true);

    // Check if X handle is already registered in Supabase
    const isTwitterTaken = await checkTwitterExists(cleanTwitter);
    if (isTwitterTaken) {
      setValidatingCode(false);
      setErrorMsg(`The X account ${cleanTwitter} is already registered on the Allowlist!`);
      return;
    }

    // Validate invite code if entered
    if (inviteCode && inviteCode.trim()) {
      const codeCheck = await validateInviteCode(inviteCode.trim());
      setInviteCodeStatus(codeCheck);

      if (!codeCheck.valid) {
        setValidatingCode(false);
        setErrorMsg(codeCheck.message || 'Invalid Invite Code. Leave blank or enter a valid code.');
        return;
      }
    }

    setValidatingCode(false);
    setCurrentStep(2);
  };

  // Step 2: Validate missions before moving to wallet
  const handleStep2Submit = () => {
    if (!allMissionsDone) {
      sound.playClick();
      setErrorMsg('Please complete all 3 missions before proceeding to wallet submission.');
      return;
    }
    sound.playClick();
    setErrorMsg('');
    setCurrentStep(3);
  };

  // Step 3: Wallet submission to Supabase with duplication check
  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    sound.playClick();

    if (!allMissionsDone) {
      setErrorMsg('You must complete all 3 missions to unlock wallet clearance.');
      setCurrentStep(2);
      return;
    }

    const cleanWallet = walletAddress.trim();
    if (!cleanWallet) {
      setErrorMsg('Please enter your wallet address.');
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanWallet)) {
      setErrorMsg('Invalid EVM wallet address format. Must start with 0x and contain 42 characters.');
      return;
    }

    setSubmitting(true);

    // Check if wallet is already registered in Supabase
    const isWalletTaken = await checkWalletExists(cleanWallet);
    if (isWalletTaken) {
      setSubmitting(false);
      setErrorMsg(`The wallet ${cleanWallet.slice(0, 6)}...${cleanWallet.slice(-4)} is already registered on the Allowlist!`);
      return;
    }

    // Generate unique referral code for this user
    const usernameSlug = twitterUsername.replace('@', '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'BROKER';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const myRefCode = `${usernameSlug}-${randomSuffix}`;

    try {
      const res = await registerWhitelistUser({
        wallet: cleanWallet,
        twitter: twitterUsername,
        inviteCode: inviteCode || null,
        myRefCode,
      });

      if (!res.success) {
        setSubmitting(false);
        setErrorMsg(res.message || 'Registration failed.');
        return;
      }

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
        avatarUrl: avatarUrl || `https://unavatar.io/x/${twitterUsername.replace('@', '')}`,
        spotNumber: res.spotNumber || '0001',
        inviteUsed: inviteCode || 'NONE',
        refLink: `${window.location.origin}/?ref=${myRefCode}`,
      };

      try {
        localStorage.setItem('sperm_broker_registered_user', JSON.stringify(savedData));
      } catch (e) {
        console.warn('LocalStorage save notice:', e);
      }

      setCompletedData(savedData);
      setCurrentStep(4);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    sound.playClick();
    try {
      localStorage.removeItem('sperm_broker_registered_user');
    } catch (e) {}
    setCompletedData(null);
    setTwitterUsername('');
    setWalletAddress('');
    setInviteCode('');
    setInviteCodeStatus(null);
    setMissions({
      follow: { completed: false, countdown: 0 },
      repost: { completed: false, countdown: 0 },
      tag: { completed: false, countdown: 0 },
    });
    setCurrentStep(1);
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
        `Just cleared all intake missions for the @SpermBrokers Genesis Allowlist on Robinhood Chain! 🧬\n\nUse my invite code to get on the desk: ${completedData.myRefCode}\n\nRegister: ${completedData.refLink}`
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

      {/* Step Tabs Pills Container with strict progression */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-xl bg-[#05070B] border border-[#1E293B] font-pixel text-[9px] sm:text-xs text-center select-none">
        
        {/* Tab 1 */}
        <button
          type="button"
          onClick={() => {
            if (completedData) return;
            sound.playClick();
            setCurrentStep(1);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            completedData || currentStep === 1
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : currentStep > 1
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent cursor-pointer'
              : 'border-transparent text-slate-500'
          }`}
        >
          {completedData ? '01 IDENTITY ✓' : '01 IDENTITY'}
        </button>

        {/* Tab 2 */}
        <button
          type="button"
          disabled={!twitterUsername && !completedData}
          onClick={() => {
            if (completedData || !twitterUsername) return;
            sound.playClick();
            setCurrentStep(2);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            completedData || currentStep === 2
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : allMissionsDone || currentStep > 2
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent cursor-pointer'
              : 'border-transparent text-slate-600 cursor-not-allowed'
          }`}
        >
          {completedData ? '02 MISSIONS ✓' : '02 MISSIONS'}
        </button>

        {/* Tab 3 */}
        <button
          type="button"
          disabled={!allMissionsDone && !completedData}
          onClick={() => {
            if (completedData || !allMissionsDone) return;
            sound.playClick();
            setCurrentStep(3);
          }}
          className={`py-3 px-2 rounded-lg border transition-all ${
            completedData || currentStep === 3
              ? 'border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10 shadow-sm shadow-[#00F58C]/20'
              : currentStep > 3
              ? 'border-[#00F58C]/40 text-[#00F58C] bg-transparent'
              : allMissionsDone && currentStep > 1
              ? 'border-transparent text-slate-400 hover:text-white cursor-pointer'
              : 'border-transparent text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          {completedData ? '03 WALLET ✓' : '03 WALLET'}
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
                onChange={(e) => {
                  // Only allow Latin characters, digits, underscore and @
                  const latinOnly = e.target.value.replace(/[^a-zA-Z0-9_@]/g, '');
                  setTwitterUsername(latinOnly);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="@username"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-white font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600"
              />
            </div>

            {/* Live Twitter Avatar Preview Card (matching originalbrokers.art) */}
            {twitterUsername.replace('@', '').length >= 2 && (
              <div className="p-3 rounded-xl bg-[#04060A] border border-[#1E293B] flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#00F58C]/40 flex-shrink-0 bg-[#0e1626] flex items-center justify-center">
                  {avatarLoading ? (
                    <Loader2 size={16} className="text-[#00F58C] animate-spin" />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={twitterUsername}
                      onError={() => setAvatarUrl(null)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-slate-400" />
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="font-mono text-xs text-white font-bold truncate flex items-center gap-1.5">
                    <span>{twitterUsername.startsWith('@') ? twitterUsername : `@${twitterUsername}`}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F58C]"></span>
                  </div>
                  <div className="font-pixel text-[8px] text-slate-500 tracking-wider uppercase">
                    X ACCOUNT
                  </div>
                </div>
              </div>
            )}

            {/* Invite Code Field with Existence Check */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-pixel text-[10px] text-slate-300 uppercase tracking-wider">
                  INVITE CODE
                </label>
                {inviteCodeStatus?.valid && inviteCode.trim() && (
                  <span className="font-pixel text-[9px] text-[#00F58C] flex items-center gap-1">
                    <Check size={11} /> VALID CODE
                  </span>
                )}
              </div>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  // Only allow Latin characters, digits and dashes
                  const latinCode = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
                  setInviteCode(latinCode);
                  setInviteCodeStatus(null);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="optional (e.g. GENESIS, SPERM)"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-[#00E5FF] font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600 uppercase tracking-wider"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={validatingCode}
              className="w-full py-4 px-6 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-xs uppercase tracking-widest shadow-lg shadow-[#00F58C]/20 hover:shadow-[#00F58C]/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {validatingCode ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>[ VERIFYING CODE... ]</span>
                </>
              ) : (
                <span>[ ENTER THE FLOOR ]</span>
              )}
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
              <span className={`font-pixel text-[10px] font-bold ${allMissionsDone ? 'text-[#00F58C]' : 'text-amber-400'}`}>
                {completedMissionsCount} / 3 COMPLETED
              </span>
            </div>

            {/* Mission 1: Follow on X (Direct Follow Intent) */}
            <div
              onClick={() => handleMissionClick('follow', 'https://twitter.com/intent/follow?screen_name=SpermBrokers')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.follow.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-400'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="font-pixel text-[11px] text-white">
                  1. Follow @SpermBrokers on X
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Stay synced with official Robinhood Chain drops & alpha
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.follow.completed ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center justify-center gap-1 shadow-sm whitespace-nowrap">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.follow.countdown > 0 ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/50 flex items-center justify-center gap-1 whitespace-nowrap animate-pulse">
                    VERIFYING {missions.follow.countdown}S...
                  </span>
                ) : (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15 flex items-center justify-center whitespace-nowrap">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {/* Mission 2: Like & Repost Genesis Tweet */}
            <div
              onClick={() => handleMissionClick('repost', 'https://x.com/SpermBrokers')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.repost.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-400'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="font-pixel text-[11px] text-white">
                  2. Like & Repost Announcement
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Broadcast the 16-bit Wall Street Degen Dynasty
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.repost.completed ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center justify-center gap-1 shadow-sm whitespace-nowrap">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.repost.countdown > 0 ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/50 flex items-center justify-center gap-1 whitespace-nowrap animate-pulse">
                    VERIFYING {missions.repost.countdown}S...
                  </span>
                ) : (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15 flex items-center justify-center whitespace-nowrap">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {/* Mission 3: Tag 3 Friends / Quote Tweet */}
            <div
              onClick={() => handleMissionClick('tag', `https://twitter.com/intent/tweet?text=${encodeURIComponent('Securing my desk on the @SpermBrokers Genesis Allowlist on Robinhood Chain! 🧬\n\nTagging 3 brokers: @ @ @\n\nApply: https://sperm-broker.vercel.app')}`)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                missions.tag.completed
                  ? 'bg-[#00F58C]/10 border-[#00F58C]'
                  : 'bg-[#04060A] border-[#1E293B] hover:border-slate-400'
              }`}
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="font-pixel text-[11px] text-white">
                  3. Tag 3 Degen Friends on X
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  Summon fellow brokers to qualify for priority tier
                </div>
              </div>

              <div className="flex-shrink-0">
                {missions.tag.completed ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-[#00F58C] text-black font-pixel text-[9px] flex items-center justify-center gap-1 shadow-sm whitespace-nowrap">
                    <Check size={12} className="stroke-[3]" /> VERIFIED
                  </span>
                ) : missions.tag.countdown > 0 ? (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-amber-400/20 text-amber-300 font-pixel text-[9px] border border-amber-400/50 flex items-center justify-center gap-1 whitespace-nowrap animate-pulse">
                    VERIFYING {missions.tag.countdown}S...
                  </span>
                ) : (
                  <span className="min-w-[130px] px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-pixel text-[9px] border border-white/15 flex items-center justify-center whitespace-nowrap">
                    [ START ]
                  </span>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Proceed to Step 3 Button - STRICTLY LOCKED UNTIL 3/3 MISSIONS */}
            <button
              type="button"
              onClick={handleStep2Submit}
              disabled={!allMissionsDone}
              className={`w-full py-4 px-6 rounded-xl font-pixel text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                allMissionsDone
                  ? 'bg-[#00F58C] hover:bg-[#25FF9C] text-black shadow-lg shadow-[#00F58C]/25 hover:scale-[1.01] cursor-pointer'
                  : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {allMissionsDone ? (
                <>
                  <span>[ PROCEED TO WALLET ]</span>
                  <ArrowRight size={14} />
                </>
              ) : (
                <span>[ COMPLETE ALL 3 MISSIONS ({completedMissionsCount}/3) ]</span>
              )}
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
                onChange={(e) => {
                  setWalletAddress(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="0x71C...3921"
                className="w-full px-4 py-4 rounded-xl bg-[#04060A] border border-[#1E293B] text-white font-mono text-sm focus:outline-none focus:border-[#00F58C] transition placeholder:text-slate-600"
              />
              <p className="font-mono text-[11px] text-slate-500">
                This wallet will receive the official guaranteed Whitelist / Airdrop mint rights.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
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

        {/* ===================== STEP 4: ACCESS GRANTED & DIGITAL PASS ===================== */}
        {currentStep === 4 && completedData && (
          <AllowlistPass data={completedData} onReset={handleReset} />
        )}

      </div>

    </div>
  );
}
