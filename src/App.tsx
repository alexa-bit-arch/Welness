import React, { useState } from "react";
import { dummyProfiles } from "./dummyData";
import { StudentProfile, ChatMessage, JournalAnalysis, MoodLog } from "./types";
import TrendsTab from "./components/TrendsTab";
import JournalTab from "./components/JournalTab";
import CompanionTab from "./components/CompanionTab";
import ProfileModal from "./components/ProfileModal";
import { 
  Plus, 
  Sparkles, 
  Brain, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Activity,
  Heart,
  Calendar,
  Moon,
  Zap,
  Smile,
  ChevronDown,
  LogOut,
  Sliders,
  AlertCircle
} from "lucide-react";

export default function App() {
  const [profiles, setProfiles] = useState<StudentProfile[]>(dummyProfiles);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("aarav-jee");
  const [activeTab, setActiveTab] = useState<"trends" | "journal" | "chat">("journal");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Manual Mood Log panel states
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [moodVal, setMoodVal] = useState(6);
  const [stressVal, setStressVal] = useState(50);
  const [sleepVal, setSleepVal] = useState(7);
  const [focusVal, setFocusVal] = useState(7);
  const [logSuccessMsg, setLogSuccessMsg] = useState("");

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  const handleProfileCreated = (newProfile: StudentProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setSelectedProfileId(newProfile.id);
    setIsProfileModalOpen(false);
    setActiveTab("journal"); // Open diary immediately for new user
  };

  const handleJournalAnalyzed = (analysis: JournalAnalysis, content: string) => {
    const todayStr = new Date().toISOString().split("T")[0];

    // Create a new Journal Entry
    const newJournal = {
      id: "j-" + Date.now(),
      date: todayStr,
      content,
      analysis
    };

    // Create a new matching Mood Log based on analyzed values
    const newMoodLog: MoodLog = {
      date: todayStr,
      mood: analysis.moodScore,
      stress: analysis.stressScore,
      sleep: selectedProfile.moodLogs.length > 0 ? selectedProfile.moodLogs[selectedProfile.moodLogs.length - 1].sleep : 6.5,
      focus: selectedProfile.moodLogs.length > 0 ? selectedProfile.moodLogs[selectedProfile.moodLogs.length - 1].focus : 6
    };

    setProfiles((prev) =>
      prev.map((prof) => {
        if (prof.id === selectedProfile.id) {
          // Check if there's already a log for today. If so, replace it; otherwise, append.
          const existingLogIndex = prof.moodLogs.findIndex((l) => l.date === todayStr);
          let updatedMoodLogs = [...prof.moodLogs];
          if (existingLogIndex !== -1) {
            updatedMoodLogs[existingLogIndex] = {
              ...updatedMoodLogs[existingLogIndex],
              mood: analysis.moodScore,
              stress: analysis.stressScore
            };
          } else {
            updatedMoodLogs.push(newMoodLog);
          }

          return {
            ...prof,
            journals: [newJournal, ...prof.journals],
            moodLogs: updatedMoodLogs
          };
        }
        return prof;
      })
    );
  };

  const handleMessageSent = (newMessage: ChatMessage) => {
    setProfiles((prev) =>
      prev.map((prof) => {
        if (prof.id === selectedProfile.id) {
          return {
            ...prof,
            chatHistory: [...prof.chatHistory, newMessage]
          };
        }
        return prof;
      })
    );
  };

  const handleManualMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split("T")[0];

    const newLog: MoodLog = {
      date: todayStr,
      mood: moodVal,
      stress: stressVal,
      sleep: sleepVal,
      focus: focusVal
    };

    setProfiles((prev) =>
      prev.map((prof) => {
        if (prof.id === selectedProfile.id) {
          const existingLogIndex = prof.moodLogs.findIndex((l) => l.date === todayStr);
          let updatedLogs = [...prof.moodLogs];
          if (existingLogIndex !== -1) {
            updatedLogs[existingLogIndex] = newLog;
          } else {
            updatedLogs.push(newLog);
          }
          return {
            ...prof,
            moodLogs: updatedLogs
          };
        }
        return prof;
      })
    );

    setLogSuccessMsg("Metrics logged for today!");
    setTimeout(() => {
      setLogSuccessMsg("");
      setShowQuickLog(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900" id="app-root">
      
      {/* Navigation Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between" id="header-nav">
        
        {/* Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-xs">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold font-display tracking-tight text-slate-800">Serene</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center">
              <Sparkles className="h-3 w-3 mr-1 text-amber-500 fill-amber-500" />
              <span>Exam Wellness Tracker</span>
            </p>
          </div>
        </div>

        {/* Dynamic Student Selector & Profile Adder */}
        <div className="flex items-center space-x-4">
          
          {/* Active Profile Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
              id="profile-dropdown-toggle"
            >
              <img
                src={selectedProfile.avatar}
                alt={selectedProfile.name}
                className="w-7 h-7 rounded-full object-cover border border-white"
                referrerPolicy="no-referrer"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{selectedProfile.name}</p>
                <p className="text-[9px] text-slate-400 leading-none mt-1 uppercase font-semibold">Target: {selectedProfile.exam} ({selectedProfile.targetYear})</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-150">
                <p className="text-[10px] uppercase font-bold text-slate-400 px-4 py-1.5 tracking-wider">Switch Student Profile:</p>
                
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProfileId(p.id);
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-all cursor-pointer ${
                      p.id === selectedProfileId ? "bg-blue-50/50 text-blue-900 border-l-4 border-blue-600" : "text-slate-600"
                    }`}
                  >
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="text-xs font-bold">{p.name}</h4>
                      <p className="text-[9px] text-slate-400 uppercase">Exam: {p.exam} ({p.targetYear})</p>
                    </div>
                  </button>
                ))}

                <div className="border-t border-slate-50 mt-2 pt-2 px-2">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100/80 text-blue-700 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Custom Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Log metrics trigger button */}
          <button
            onClick={() => setShowQuickLog(!showQuickLog)}
            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
            title="Log today's parameters"
          >
            <Sliders className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 grid grid-cols-1 gap-6">
        
        {/* Quick Log Metrics Drawer/Card */}
        {showQuickLog && (
          <div className="bg-linear-to-r from-blue-50/60 to-indigo-50/40 border border-blue-100 rounded-3xl p-6 shadow-xs animate-in fade-in duration-150 relative">
            <h3 className="text-base font-bold font-display text-slate-800 mb-2">Log Today's Parameters</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Manually register metrics to visualize trends immediately. You can also submit written text in the Daily Diary tab for automatic cognitive mapping.
            </p>

            <form onSubmit={handleManualMoodSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Mood Val */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mood Score (1-10)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodVal}
                    onChange={(e) => setMoodVal(parseInt(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <span className="text-sm font-black text-blue-600 font-mono w-5 text-right">{moodVal}</span>
                </div>
              </div>

              {/* Stress Val */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Stress Level (0-100%)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stressVal}
                    onChange={(e) => setStressVal(parseInt(e.target.value))}
                    className="flex-1 accent-rose-500 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <span className="text-sm font-black text-rose-600 font-mono w-8 text-right">{stressVal}%</span>
                </div>
              </div>

              {/* Sleep Val */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sleep Duration (Hours)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepVal}
                    onChange={(e) => setSleepVal(parseFloat(e.target.value))}
                    className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-mono font-bold focus:outline-hidden focus:border-blue-400"
                  />
                  <span className="text-xs text-slate-400">hours</span>
                </div>
              </div>

              {/* Focus Val */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Daytime Focus (1-10)</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={focusVal}
                    onChange={(e) => setFocusVal(parseInt(e.target.value))}
                    className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                  />
                  <span className="text-sm font-black text-emerald-600 font-mono w-5 text-right">{focusVal}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between mt-2 pt-4 border-t border-blue-100/50">
                <span className="text-xs text-emerald-600 font-medium h-4">
                  {logSuccessMsg}
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowQuickLog(false)}
                    className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-500 hover:bg-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    Save Metrics
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Primary Workspace Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3" id="tab-nav">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("journal")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "journal" 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Daily Diary Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab("trends")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "trends" 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trends & Triggers Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "chat" 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Empathetic Companion Chat</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
            <Calendar className="h-4 w-4" />
            <span>Targeting {selectedProfile.exam} ({selectedProfile.targetYear})</span>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[500px]" id="tab-content">
          {activeTab === "journal" && (
            <JournalTab 
              profile={selectedProfile}
              onJournalAnalyzed={handleJournalAnalyzed}
            />
          )}

          {activeTab === "trends" && (
            <TrendsTab 
              profile={selectedProfile}
            />
          )}

          {activeTab === "chat" && (
            <CompanionTab 
              profile={selectedProfile}
              onMessageSent={handleMessageSent}
            />
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-100 py-6 px-8 text-center text-xs text-slate-400 mt-auto flex flex-col sm:flex-row items-center justify-between" id="footer">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-blue-500" />
          <span>Serene © 2026. Empowering student psychological resilience.</span>
        </div>
        <div className="mt-2 sm:mt-0 font-medium text-slate-400">
          Tailored specifically for <strong className="text-slate-500">NEET, JEE, CUET, CAT, GATE & UPSC</strong> candidates.
        </div>
      </footer>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          onClose={() => setIsProfileModalOpen(false)}
          onProfileCreated={handleProfileCreated}
        />
      )}
    </div>
  );
}
