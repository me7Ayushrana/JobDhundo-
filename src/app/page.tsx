"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, Users, Code, Sparkles, Terminal, ArrowRight, TrendingUp } from "lucide-react";
import Hero3D from "@/components/ui/3d/hero-3d";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  const handleChipClick = (type: "skill" | "location" | "remote" | "experience", val: string) => {
    if (type === "remote") {
      router.push("/jobs?remote=true");
    } else if (type === "skill") {
      router.push(`/jobs?skills=${encodeURIComponent(val)}`);
    } else if (type === "location") {
      router.push(`/jobs?location=${encodeURIComponent(val)}`);
    } else if (type === "experience") {
      router.push(`/jobs?experience=${encodeURIComponent(val.toLowerCase())}`);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-stone-950 text-white selection:bg-primary/20 overflow-hidden flex flex-col justify-center">
      
      {/* 3D Background */}
      <Hero3D />

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-[1]" />
      
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/70 to-stone-950 z-[1] pointer-events-none" />

      {/* Main Content Area */}
      <section className="relative pt-36 pb-20 container mx-auto px-6 max-w-7xl flex flex-col items-center text-center z-10">
        
        {/* Editorial Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] rounded-full border border-primary/30 bg-primary/10 text-primary shadow-glow">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Job Discovery
          </span>
        </motion.div>

        {/* Premium Bold Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white"
        >
          Find Your DNA Match.<br />
          <span className="text-primary drop-shadow-[0_0_20px_rgba(99,102,241,0.2)]">Build Your Career.</span>
        </motion.h1>

        {/* Clean Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-stone-300 mb-12 leading-relaxed font-medium"
        >
          Aggregating software engineering opportunities from global indexes. Scan your GitHub repositories to map your technical DNA and auto-match with high-synergy open roles.
        </motion.p>

        {/* Premium Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-2xl mx-auto mb-6"
        >
          <form onSubmit={handleSearchSubmit} className="p-2 bg-stone-900/85 backdrop-blur-md border border-stone-800 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xl focus-within:border-primary transition-all duration-300">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title, company, or skill..."
                className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-stone-500 h-12 text-base font-medium"
              />
            </div>
            <Button
              type="submit"
              className="rounded-2xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg shadow-primary/25"
            >
              Search Opportunities <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </motion.div>

        {/* Quick Filter Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-2xl"
        >
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mr-1">Quick Filters:</span>
          
          <Badge
            onClick={() => handleChipClick("remote", "Remote")}
            className="cursor-pointer bg-stone-900 border border-stone-800 hover:border-primary/50 text-stone-300 font-semibold px-3 py-1 rounded-full text-xs transition-colors"
          >
            🏠 Remote
          </Badge>
          
          <Badge
            onClick={() => handleChipClick("skill", "React")}
            className="cursor-pointer bg-stone-900 border border-stone-800 hover:border-primary/50 text-stone-300 font-semibold px-3 py-1 rounded-full text-xs transition-colors"
          >
            ⚛️ React
          </Badge>
          
          <Badge
            onClick={() => handleChipClick("skill", "Java")}
            className="cursor-pointer bg-stone-900 border border-stone-800 hover:border-primary/50 text-stone-300 font-semibold px-3 py-1 rounded-full text-xs transition-colors"
          >
            ☕ Java
          </Badge>
          
          <Badge
            onClick={() => handleChipClick("location", "Bangalore")}
            className="cursor-pointer bg-stone-900 border border-stone-800 hover:border-primary/50 text-stone-300 font-semibold px-3 py-1 rounded-full text-xs transition-colors"
          >
            📍 Bangalore
          </Badge>

          <Badge
            onClick={() => handleChipClick("experience", "Entry")}
            className="cursor-pointer bg-stone-900 border border-stone-800 hover:border-primary/50 text-stone-300 font-semibold px-3 py-1 rounded-full text-xs transition-colors"
          >
            🎓 Entry Level
          </Badge>
        </motion.div>

        {/* Dynamic Stats Counter & Trending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl border-t border-stone-800/80 pt-10"
        >
          {/* Live stats */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left justify-center space-y-2">
            <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Global Aggregator Index</span>
            <div className="text-4xl font-black text-white tracking-tight flex items-baseline gap-1.5">
              <span>12,847</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Jobs indexed today</span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Consolidated, normalized, and cached from Adzuna, LoopCV, and JSearch API systems.
            </p>
          </div>

          {/* Trending Searches */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left justify-center space-y-3">
            <span className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending Searches
            </span>
            <div className="flex flex-col gap-2 w-full">
              {[
                { term: "Full Stack Developer", link: "/jobs?q=Full Stack" },
                { term: "Data Scientist", link: "/jobs?q=Data Scientist" },
                { term: "DevOps Engineer", link: "/jobs?q=DevOps" }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/60 hover:border-primary/40 transition-colors text-xs font-bold text-stone-200"
                >
                  <span>{item.term}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

      </section>

      {/* Feature Section Grid */}
      <section className="py-24 border-t border-stone-900 bg-stone-950/60 z-10 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Briefcase, title: "Aggregated Quotas", desc: "Access three disparate job aggregators globally through a single API normalizer, optimized to stay 100% within free usage tiers." },
              { icon: Code, title: "GitHub Skill DNA", desc: "No more manually filling out skill tags. Paste your username to compile library dependencies and README keywords into a functional resume footprint." },
              { icon: Users, title: "Company Connections", desc: "Identify connections working at your targeted companies, request professional referrals, and message industry mentors in real-time." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-stone-900/40 border border-stone-800/60 p-8 rounded-3xl flex flex-col items-start gap-5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white mb-2">{feature.title}</h3>
                  <p className="text-stone-400 leading-relaxed text-sm font-medium">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
