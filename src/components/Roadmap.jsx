import React from 'react';
import { MapPin, CheckCircle2, CircleDashed, Rocket, Cpu, Landmark, Sparkles } from 'lucide-react';

export default function Roadmap({ lang, t }) {
  const phases = [
    {
      phase: "01",
      tag: "IN PROGRESS (74% MINTED)",
      tagColor: "bg-hood-green/20 text-hood-green border-hood-green/40",
      icon: Rocket,
      title: t.roadmap.q1Title,
      desc: t.roadmap.q1Desc,
      milestones: [
        "Smart Contract Deployment on Robinhood Chain",
        "Community Whitelist & OG Discord Role",
        "Public Mint of 1,000 Generative Brokers",
        "Secondary Marketplace Verification"
      ]
    },
    {
      phase: "02",
      tag: "UP NEXT (Q2 2026)",
      tagColor: "bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40",
      icon: Cpu,
      title: t.roadmap.q2Title,
      desc: t.roadmap.q2Desc,
      milestones: [
        "Non-Custodial Staking Contract Launch",
        "$SPRM Utility Token Airdrop",
        "100% Secondary Royalties to Stakers",
        "Discord Alpha Signal Bot Integration"
      ]
    },
    {
      phase: "03",
      tag: "DEVELOPMENT (Q3 2026)",
      tagColor: "bg-cyber-gold/20 text-cyber-gold border-cyber-gold/40",
      icon: Landmark,
      title: t.roadmap.q3Title,
      desc: t.roadmap.q3Desc,
      milestones: [
        "Robinhood Hedge DAO Vault",
        "Community MEV & Trading Arbitrage Pool",
        "Governance Voting on Strategic Acquisitions",
        "Whale Terminal Access for Top Holders"
      ]
    },
    {
      phase: "04",
      tag: "FUTURE VISION (Q4 2026+)",
      tagColor: "bg-cyber-pink/20 text-cyber-pink border-cyber-pink/40",
      icon: Sparkles,
      title: t.roadmap.q4Title,
      desc: t.roadmap.q4Desc,
      milestones: [
        "3D Rigged Metaverse Avatars",
        "Limited Luxury Streetwear Merch Drop",
        "Annual Private Yacht Summit in Miami",
        "Sperm Brokers V2 Next-Gen Expansion"
      ]
    },
  ];

  return (
    <section id="roadmap" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-hood-green/10 border border-hood-green/30 text-hood-green text-xs font-mono font-bold tracking-wider">
            <MapPin size={14} />
            <span>{t.roadmap.badge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            {t.roadmap.title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            {t.roadmap.subtitle}
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {phases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-8 bg-[#0D111A]/90 border border-white/10 hover:border-hood-green/40 transition-all duration-300 space-y-6 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-hood-green transition-colors">
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-extrabold font-mono text-slate-500 group-hover:text-hood-green transition-colors">
                      #{item.phase}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-extrabold border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Milestone Checklist */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  {item.milestones.map((ms, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
                      {idx === 0 ? (
                        <CheckCircle2 size={15} className="text-hood-green flex-shrink-0" />
                      ) : (
                        <CircleDashed size={15} className="text-slate-500 flex-shrink-0" />
                      )}
                      <span>{ms}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
