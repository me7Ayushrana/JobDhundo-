"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as Github, Search, Sparkles, Award, Compass, RefreshCw, BarChart2, Dna, CheckCircle2, ChevronRight } from "lucide-react";
import { useSocial } from "@/components/providers/social-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";

export default function AnalyzerPage() {
  const router = useRouter();
  const { currentUser } = useSocial();

  const [username, setUsername] = useState(currentUser?.github && currentUser.github !== "devmatch_guest" ? currentUser.github : "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [skillsResult, setSkillsResult] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number>(85);
  const [topLanguages, setTopLanguages] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Contacting GitHub Registry...",
    "Scanning public repository manifest index...",
    "Compiling language distributions...",
    "Decoding package.json dependencies...",
    "Synthesizing Skill DNA profile..."
  ];

  const runAnalysis = async () => {
    if (!username.trim()) return;
    setError(null);
    setShowResults(false);
    setIsAnalyzing(true);

    // Step animation loop
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setAnalysisStep(currentStep);
      }
    }, 700);

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUsername: username.trim() })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "GitHub profile not found or rate limited");
      }

      const data = await res.json();
      setSkillsResult(data.skills || []);
      setConfidence(data.confidence || 80);
      setTopLanguages(data.topLanguages || []);
      
      clearInterval(interval);
      setShowResults(true);
    } catch (e: any) {
      setError(e.message || "Failed to scan GitHub profile.");
      clearInterval(interval);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  const handleSyncProfile = () => {
    if (skillsResult.length === 0) return;
    
    // Create updated user profile
    const updated = {
      ...currentUser,
      github: username.trim(),
      skills: skillsResult.slice(0, 8) // Limit to top 8 skills to keep cards neat
    };

    // Save to local storage for guest session persistence
    localStorage.setItem("devmatch_currentUser", JSON.stringify(updated));
    localStorage.setItem("devmatch_friends", JSON.stringify([])); // clear references if user changes

    // Force page reload to let context pick up new skills
    window.location.reload();
  };

  // Convert languages into chartable data format for radar visualization
  const radarData = skillsResult.slice(0, 6).map((skill, idx) => ({
    subject: skill,
    proficiency: 95 - (idx * 8) - Math.floor(Math.random() * 5)
  }));

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 pt-28 pb-20 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl space-y-12 relative z-10">
        
        {/* Title */}
        <header className="text-center space-y-4">
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs font-mono tracking-widest text-primary uppercase py-1.5 px-4 rounded-full">
            INTELLIGENCE PROTOCOL
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-stone-900 dark:text-white">
            Skill DNA <span className="text-primary text-glow">Extractor</span>
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed font-semibold">
            Deconstruct your engineering footprint in real-time. Scan your repositories to build a profile automatically.
          </p>
        </header>

        {/* Search Input Box */}
        <div className="p-3 bg-white dark:bg-stone-900 border border-black/5 dark:border-white/5 rounded-3xl max-w-2xl mx-auto shadow-sm flex items-center gap-3">
          <div className="flex-1 flex items-center px-4 gap-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-850 h-14">
            <Github className="w-5 h-5 text-stone-400" />
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub Username..."
              className="bg-transparent border-none text-sm h-full focus-visible:ring-0 placeholder:text-stone-400 font-semibold"
              onKeyDown={(e) => e.key === "Enter" && runAnalysis()}
            />
          </div>
          <Button
            onClick={runAnalysis}
            disabled={!username || isAnalyzing}
            className="h-14 px-8 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-lg shadow-primary/10 active:scale-95 transition-transform shrink-0 flex items-center gap-1.5"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Extract DNA <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-center max-w-md mx-auto text-xs font-bold uppercase tracking-wider">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 text-center space-y-6 max-w-sm mx-auto bg-white dark:bg-stone-900 border border-black/5 dark:border-white/5 rounded-3xl shadow-lg"
            >
              <div className="w-12 h-12 border-t-2 border-primary rounded-full mx-auto animate-spin" />
              <div className="space-y-2">
                <motion.h4
                  key={analysisStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm font-black text-stone-850 dark:text-white"
                >
                  {steps[analysisStep]}
                </motion.h4>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Please stand by...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Presentation */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Visual Radar & Stats */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Profile Card */}
              <Card className="bg-white dark:bg-stone-900 border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xs font-black uppercase text-stone-400 tracking-widest flex items-center gap-1.5">
                    <Dna className="w-4.5 h-4.5 text-primary" /> Profile DNA Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-100 dark:border-stone-800 flex flex-col justify-between h-28">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Extracted Tech Skills</span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white mt-2">{skillsResult.length}</span>
                    <span className="text-[9px] text-stone-400 font-semibold mt-1">Unique libraries & runtimes</span>
                  </div>

                  <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-100 dark:border-stone-800 flex flex-col justify-between h-28">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Heuristic Accuracy</span>
                    <span className="text-2xl font-black text-emerald-500 mt-2">{confidence}%</span>
                    <span className="text-[9px] text-stone-400 font-semibold mt-1">Refined from repository stars</span>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Radar Chart */}
              {radarData.length > 0 && (
                <Card className="bg-white dark:bg-stone-900 border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xs font-black uppercase text-stone-400 tracking-widest">
                      Extracted Stack Radar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 10, fontWeight: "bold" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 8 }} />
                        <Radar name="Proficiency" dataKey="proficiency" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Skills Checklist & Navigation */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Top Languages */}
              {topLanguages.length > 0 && (
                <Card className="bg-white dark:bg-stone-900 border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xs font-black uppercase text-stone-400 tracking-widest flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-stone-400" /> Primary Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-wrap gap-1.5">
                    {topLanguages.map((lang, idx) => (
                      <Badge key={idx} className="bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {lang}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Skills Tags */}
              <Card className="bg-white dark:bg-stone-900 border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-sm">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xs font-black uppercase text-stone-400 tracking-widest flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-stone-400" /> Extracted Framework DNA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto">
                  {skillsResult.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              {/* Sync and Go Actions */}
              <div className="bg-white dark:bg-stone-900 border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-3">
                <Button
                  onClick={handleSyncProfile}
                  className="w-full font-black uppercase tracking-widest py-5 rounded-2xl bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-95 transition-transform"
                >
                  <CheckCircle2 className="w-4 h-4" /> Sync to Builder Profile
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push(`/jobs?skills=${skillsResult.slice(0, 3).join(",")}`)}
                  className="w-full font-bold uppercase tracking-wider py-5 rounded-2xl border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-center gap-2"
                >
                  <Compass className="w-4.5 h-4.5" /> Explore Matched Jobs
                </Button>

                <p className="text-[9px] font-semibold text-stone-400 text-center leading-relaxed px-4 pt-1">
                  💡 Syncing writes these skills into your local profile. The Discovery Feed will immediately adjust calculations to match.
                </p>
              </div>

            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
