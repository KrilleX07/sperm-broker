import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { getLeaderboardEntries } from '../utils/supabase';
import { sound } from '../utils/sound';

export default function Leaderboard({ onGoToIntake }) {
  const [supabaseUsers, setSupabaseUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default seed leaderboard data matching user screenshot
  const initialBrokers = [
    { rank: '01', broker: 'swimfast.eth', referrals: 47, status: 'GTD', color: 'text-[#00F58C]' },
    { rank: '02', broker: 'alpha_donor', referrals: 32, status: 'GTD', color: 'text-[#8B5CF6]' },
    { rank: '03', broker: 'diamond_swimmers', referrals: 28, status: 'GTD', color: 'text-[#F59E0B]' },
    { rank: '04', broker: 'chart_chaser', referrals: 15, status: 'GTD', color: 'text-slate-300' },
    { rank: '05', broker: 'liquidity_lars', referrals: 11, status: 'GTD', color: 'text-slate-300' },
    { rank: '06', broker: 'candlestick_carl', referrals: 9, status: 'FCFS', color: 'text-slate-400' },
    { rank: '07', broker: 'robinhood_sniper', referrals: 7, status: 'FCFS', color: 'text-slate-400' },
    { rank: '08', broker: 'degen_dan', referrals: 5, status: 'FCFS', color: 'text-slate-400' },
  ];

  useEffect(() => {
    async function loadData() {
      const live = await getLeaderboardEntries();
      setSupabaseUsers(live || []);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Title Header Matching Screenshot 2 */}
      <div className="text-center space-y-3">
        <h1 className="font-pixel text-2xl sm:text-4xl text-[#00F58C] tracking-wide uppercase text-neon-green">
          TOP SPERM BROKERS
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400">
          Bring more brokers. Climb the desk.
        </p>
      </div>

      {/* Leaderboard Table Container */}
      <div className="rounded-2xl overflow-hidden bg-[#090D16] border border-[#1E293B] shadow-2xl">
        
        {/* Table Head */}
        <div className="grid grid-cols-12 gap-2 p-4 sm:p-5 border-b border-[#1E293B] bg-[#05070B] font-pixel text-[9px] sm:text-[11px] text-slate-400 tracking-wider">
          <div className="col-span-2">RANK</div>
          <div className="col-span-5">BROKER</div>
          <div className="col-span-3 text-center">REFERRALS</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#1E293B]/60 font-mono text-xs sm:text-sm">
          {initialBrokers.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-2 p-4 sm:p-5 items-center transition-colors hover:bg-white/5 ${
                idx === 0 ? 'bg-[#00F58C]/5' : ''
              }`}
            >
              {/* Rank */}
              <div className="col-span-2 font-pixel text-xs sm:text-sm font-bold">
                <span className={row.color}>{row.rank}</span>
              </div>

              {/* Broker Name */}
              <div className="col-span-5 text-white font-bold truncate flex items-center gap-2">
                <span>{row.broker}</span>
                {idx === 0 && <span className="text-xs">👑</span>}
              </div>

              {/* Referrals Count */}
              <div className="col-span-3 text-center font-bold text-slate-200">
                {row.referrals}
              </div>

              {/* Status Badge */}
              <div className="col-span-2 text-right font-pixel text-[9px] sm:text-[10px]">
                {row.status === 'GTD' ? (
                  <span className="inline-block px-2.5 py-1 rounded-md border border-[#00F58C] text-[#00F58C] bg-[#00F58C]/10">
                    [ GTD ]
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-1 rounded-md border border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10">
                    [ FCFS ]
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Any newly registered live users from Supabase */}
          {supabaseUsers.map((u, i) => (
            <div
              key={`live-${i}`}
              className="grid grid-cols-12 gap-2 p-4 sm:p-5 items-center bg-[#00F58C]/5 border-l-2 border-[#00F58C] font-mono text-xs sm:text-sm"
            >
              <div className="col-span-2 font-pixel text-xs text-slate-400">
                #{String(initialBrokers.length + i + 1).padStart(2, '0')}
              </div>
              <div className="col-span-5 text-[#00E5FF] font-bold truncate">
                {u.twitter_handle} <span className="text-[10px] text-slate-500 font-normal">(New)</span>
              </div>
              <div className="col-span-3 text-center text-slate-400 font-bold">
                1
              </div>
              <div className="col-span-2 text-right font-pixel text-[9px]">
                <span className="inline-block px-2.5 py-1 rounded-md border border-slate-500 text-slate-400">
                  [ FCFS ]
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* CTA Bottom Box */}
      <div className="p-6 rounded-2xl bg-[#090D16] border border-[#1E293B] text-center space-y-4">
        <p className="font-mono text-xs text-slate-300">
          Want to climb the desk? Register your identity, get your custom invite link, and rally your traders.
        </p>

        <button
          onClick={() => {
            sound.playClick();
            onGoToIntake();
          }}
          className="py-3.5 px-6 rounded-xl bg-[#00F58C] hover:bg-[#25FF9C] text-black font-pixel text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-[#00F58C]/20 hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          <span>[ GET YOUR INVITE CODE & JOIN ]</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
