"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Users, ShieldCheck, Sparkles, HelpCircle, Briefcase, RefreshCw, Key } from "lucide-react";
import { useSocial } from "@/components/providers/social-context";
import { calculateMatch, UserProfile } from "@/lib/utils/matching";
import { ConnectionCard } from "@/components/network/connection-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function NetworkPage() {
  const { currentUser, openDirectChat, isAuthenticated, setAuthModalOpen } = useSocial();
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyReferrers, setOnlyReferrers] = useState(false);
  
  // Real registered users list
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRegisteredUsers() {
      setIsLoading(true);
      try {
        if (db) {
          const querySnapshot = await getDocs(collection(db, "users"));
          const usersList: UserProfile[] = [];
          
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // Do not show the current user in the network directory to keep it focused on finding others
            if (data.id !== currentUser?.id && data.name) {
              usersList.push({
                id: data.id,
                name: data.name,
                github: data.github || "",
                role: data.role || "Fullstack",
                skills: data.skills || [],
                style: data.style || "Builder",
                company: data.company || "",
                canRefer: data.canRefer || false,
                avatar: data.avatar || data.name.charAt(0)
              });
            }
          });
          
          setRegisteredUsers(usersList);
        } else {
          // Fallback if Firebase is not connected (local development/guest mode)
          setRegisteredUsers([]);
        }
      } catch (err) {
        console.error("Error loading network directory:", err);
        setRegisteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRegisteredUsers();
  }, [currentUser]);

  // Compute matches for all registered users compared to current user
  const matches = useMemo(() => {
    const curProfile: UserProfile = {
      name: currentUser?.name || "Guest Developer",
      github: currentUser?.github || "devmatch_guest",
      role: (currentUser?.role || "Frontend") as any,
      skills: currentUser?.skills || ["React", "TypeScript", "TailwindCSS"],
      style: (currentUser?.style || "Builder") as any
    };

    return registeredUsers.map(user => {
      const matchResult = calculateMatch(curProfile, user);
      return matchResult;
    });
  }, [currentUser, registeredUsers]);

  // Filter connections by search term and referrer toggles
  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const { user } = match;
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesReferrer = !onlyReferrers || user.canRefer;

      return matchesSearch && matchesReferrer;
    });
  }, [matches, searchTerm, onlyReferrers]);

  const handleChat = (user: UserProfile) => {
    if (user.id) {
      openDirectChat(user.id);
    }
  };

  const handleQuickSearch = (company: string) => {
    setSearchTerm(company);
  };

  return (
    <div className="relative min-h-screen bg-stone-50 pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            Professional Network <Users className="w-5 h-5 text-primary" />
          </h1>
          <p className="text-xs text-stone-500 font-semibold mt-1">
            Connect and chat with verified professionals registered on the Job Dhundo! platform
          </p>
        </div>

        {/* Dashboard Bar: Searches, Filters, Quick Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Search Inputs */}
          <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-stone-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company, role, or skills..."
                className="pl-10 h-12 bg-stone-50 border-stone-205 text-xs rounded-xl"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-black uppercase tracking-wider text-stone-700 shrink-0 px-2 py-3 border border-transparent hover:bg-stone-55 rounded-xl transition-all">
              <input
                type="checkbox"
                checked={onlyReferrers}
                onChange={(e) => setOnlyReferrers(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
              />
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Only Referrers</span>
            </label>
          </div>

          {/* Quick company links */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center space-y-2">
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Target Employers</span>
            <div className="flex flex-wrap gap-1.5">
              {["Google", "Meta", "TCS", "Infosys", "Wipro"].map(company => (
                <button
                  key={company}
                  onClick={() => handleQuickSearch(company)}
                  className={`text-[10px] font-bold py-1 px-3 rounded-full border transition-all ${
                    searchTerm === company
                      ? "bg-primary text-white border-primary"
                      : "bg-stone-50 border-stone-200 hover:border-primary/45 text-stone-650"
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-16 text-center bg-white border border-stone-200 rounded-3xl space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Querying builder directory...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <ConnectionCard
                key={match.user.id}
                match={match}
                onChat={handleChat}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-white border border-stone-200 rounded-3xl space-y-5">
            <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center mx-auto text-stone-400">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide">No Connections Registered Yet</h3>
              <p className="text-xs text-stone-500 font-semibold max-w-sm mx-auto leading-relaxed">
                Connect your account to register your professional details, skills, and target company in Job Dhundo!'s network directory.
              </p>
            </div>
            {!isAuthenticated && (
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="bg-primary text-white font-black uppercase text-[10px] tracking-widest py-3 px-8 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <Key className="w-4 h-4" /> Sign In to Connect
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
