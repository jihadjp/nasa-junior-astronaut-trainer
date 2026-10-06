// Cinematic Landing Hero & Educational Overview

import React from 'react';
import { Play, Rocket, GraduationCap, Eye, Sparkles, Wind, Droplets, Zap, Apple, Shield, Wrench } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface LandingHeroProps {
  onStartMission: () => void;
  onStartDemo: () => void;
  onOpenTeacher: () => void;
  onOpenSources: () => void;
  onToggleCommanderMode: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartMission,
  onStartDemo,
  onOpenTeacher,
  onOpenSources,
  onToggleCommanderMode
}) => {
  const handleStart = () => {
    sound.playClick();
    onStartMission();
  };

  const handleDemo = () => {
    sound.playClick();
    onStartDemo();
  };

  return (
    <div className="w-full min-h-screen text-slate-100 relative overflow-hidden bg-[#050914] flex flex-col justify-between">
      {/* Dynamic Starfield & Nebula Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#3B82F6]/15 via-[#52D6FF]/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Mission Control Bar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#52D6FF] animate-pulse"></span>
          <span className="font-display font-bold text-sm tracking-widest text-white">
            OUTPOST // NASA SPACE APPS 2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTeacher}
            className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded border border-transparent hover:border-slate-700 transition-all hidden sm:flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            TEACHER MODE
          </button>
          <button
            onClick={onOpenSources}
            className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded border border-transparent hover:border-slate-700 transition-all hidden sm:flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#52D6FF]" />
            NASA SOURCES
          </button>
        </div>
      </nav>

      {/* Hero Central Showcase */}
      <main className="max-w-5xl mx-auto px-6 py-12 text-center relative z-10 my-auto">
        {/* Challenge Callout Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101827] border border-[#52D6FF]/40 text-[#52D6FF] text-xs font-mono mb-6 shadow-lg shadow-[#52D6FF]/10 animate-in fade-in duration-700">
          <Rocket className="w-4 h-4" />
          NASA SPACE APPS CHALLENGE 2026 — JUNIOR ASTRONAUT MISSION TRAINER
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white mb-4 leading-none">
          OUTPOST
        </h1>

        <div className="text-lg sm:text-2xl font-display font-medium text-slate-300 mb-4 tracking-wide">
          JUNIOR ASTRONAUT MISSION TRAINER
        </div>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
          "Every decision shapes the mission. Build smart. Survive longer. Discover more."
          <br className="hidden sm:inline" />
          You are responsible for keeping a real lunar or Martian outpost alive under finite physical constraints.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={handleStart}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] hover:from-[#2563EB] hover:to-[#38BDF8] text-slate-950 font-display font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl hover:shadow-[#52D6FF]/25 hover:scale-105 transition-all"
          >
            <Rocket className="w-5 h-5" />
            START MISSION
          </button>

          <button
            onClick={handleDemo}
            className="py-3.5 px-6 rounded-xl bg-[#101827] hover:bg-[#152238] border border-purple-500/40 text-purple-300 font-mono font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            WATCH 60-SEC DEMO
          </button>

          <button
            onClick={onToggleCommanderMode}
            className="py-3.5 px-6 rounded-xl bg-[#101827] hover:bg-[#152238] border border-amber-500/40 text-amber-300 font-mono font-medium text-xs sm:text-sm flex items-center gap-2 transition-all hidden sm:flex"
          >
            <Eye className="w-4 h-4" />
            MISSION COMMANDER
          </button>
        </div>

        {/* "WHY THIS MATTERS" Educational Foundation (Section 51) */}
        <div className="text-left bg-[#0B1222]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md mb-12 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#52D6FF] mb-2">
            <Sparkles className="w-4 h-4" />
            THE CORE EDUCATIONAL PRINCIPLE
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
            Every Engineering Decision Has Consequences
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Space exploration is not about having unlimited resources. Every kilogram launched from Earth costs thousands of dollars. Every watt of solar electricity must be budgeted. Every liter of water must be recycled. If solar panels gather dust, batteries drain, greenhouse pumps shut down, and food reserves deplete.
          </p>

          {/* 6 Interconnected Systems Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Wind className="w-5 h-5 text-[#52D6FF] mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">OXYGEN</span>
              <span className="text-[10px] text-slate-400">Electrolysis & Plants</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">WATER</span>
              <span className="text-[10px] text-slate-400">98% Closed-Loop Recycler</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">POWER</span>
              <span className="text-[10px] text-slate-400">Photovoltaic Arrays</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Apple className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">FOOD</span>
              <span className="text-[10px] text-slate-400">Hydroponic Crops</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Shield className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">SHIELDING</span>
              <span className="text-[10px] text-slate-400">Regolith & Water Vault</span>
            </div>
            <div className="p-3 rounded-xl bg-[#060B18] border border-slate-800 text-center">
              <Wrench className="w-5 h-5 text-orange-400 mx-auto mb-1.5" />
              <span className="text-xs font-bold text-white block">SPARES</span>
              <span className="text-[10px] text-slate-400">3D In-Situ Printing</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-slate-800/80 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10 backdrop-blur-md">
        <div>
          NASA Space Apps Challenge 2026 // Junior Astronaut Mission Trainer
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onOpenSources} className="hover:text-slate-300 transition-colors">
            Citations & NASA PDS Data
          </button>
          <span>•</span>
          <button onClick={onOpenTeacher} className="hover:text-slate-300 transition-colors">
            Teacher Curriculum Standards
          </button>
        </div>
      </footer>
    </div>
  );
};
