import React, { useState, useEffect, useRef } from "react";
import { StudentProfile, JournalEntry, JournalAnalysis } from "../types";
import { 
  BookOpen, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  Check, 
  HelpCircle, 
  Play, 
  Square, 
  RotateCcw, 
  Heart, 
  Brain, 
  Layers, 
  Coffee,
  ChevronRight,
  RefreshCw
} from "lucide-react";

interface JournalTabProps {
  profile: StudentProfile;
  onJournalAnalyzed: (analysis: JournalAnalysis, content: string) => void;
}

const HELPER_PROMPTS = [
  "Mock test disappointment",
  "Vast syllabus backlog",
  "Comparing progress with peers",
  "Late-night study exhaustion",
  "Family hopes & expectations",
  "Self-doubt & imposter syndrome"
];

// Alternate loading steps to keep the user engaged
const LOADING_STEPS = [
  "Reading your entry with empathy...",
  "Running emotional spectrum mapping...",
  "Sifting through text for hidden stress triggers...",
  "Deducing subconscious behavioral patterns...",
  "Formulating hyper-personalized coping strategies...",
  "Preparing your serene encouragement letter..."
];

export default function JournalTab({ profile, onJournalAnalyzed }: JournalTabProps) {
  const [journalText, setJournalText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Active breathing exercise state machine
  const [breathState, setBreathState] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathCycleCount, setBreathCycleCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate loading steps
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Breathing pacer effect
  useEffect(() => {
    if (breathState === "idle") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          // Phase complete, state transition
          if (breathState === "inhale") {
            setBreathState("hold");
            return 7; // Hold for 7 seconds
          } else if (breathState === "hold") {
            setBreathState("exhale");
            return 8; // Exhale for 8 seconds
          } else {
            setBreathState("inhale");
            setBreathCycleCount((c) => c + 1);
            return 4; // Inhale for 4 seconds
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [breathState]);

  const startBreathing = () => {
    setBreathState("inhale");
    setBreathTimer(4);
    setBreathCycleCount(0);
  };

  const stopBreathing = () => {
    setBreathState("idle");
    setBreathTimer(0);
    setBreathCycleCount(0);
  };

  const handlePromptClick = (prompt: string) => {
    const space = journalText.length > 0 ? "\n" : "";
    setJournalText((prev) => prev + space + `I am writing about: ${prompt}. `);
  };

  const handleAnalyze = async () => {
    if (journalText.trim().length < 10) {
      setError("Please write down a few more lines of your diary entry to let the GenAI parse your state properly.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journalText: journalText,
          exam: profile.exam,
          studentName: profile.name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process journal entry");
      }

      onJournalAnalyzed(data, journalText);
      setJournalText(""); // Clear box on success
    } catch (err: any) {
      console.error(err);
      setError("We encountered an issue analyzing your journal: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Retrieve the latest analyzed journal entry
  const latestJournal = profile.journals.length > 0 ? profile.journals[0] : null;
  const analysis = latestJournal?.analysis;

  return (
    <div className="space-y-8" id="journal-analyzer">
      {/* Journal Entry Writer Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-4">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold font-display text-slate-800">My Daily Diary & Mind Clearing</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Pour your raw, unfiltered thoughts here. Talk about mock tests, physical exhaustion, study backlogs, peer comparison, family expectations, or high stress levels. Our GenAI analyzes this text to provide hyper-personalized coping routines and support triggers.
        </p>

        {/* Suggestion Chips */}
        <div className="mb-4">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Unburdening Starters (Click to add):</p>
          <div className="flex flex-wrap gap-2">
            {HELPER_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-all font-medium flex items-center"
              >
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Dear Diary, today was extremely exhausting. My mock test scores didn't go well... Organic Chemistry backlog feels like a huge mountain..."
          className="w-full h-44 bg-slate-50/50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-blue-400 focus:bg-white transition-all resize-none"
        />

        {error && (
          <div className="mt-3 text-xs bg-rose-50 text-rose-600 p-3 rounded-lg border border-rose-100">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-400">
            {journalText.trim().length} characters logged
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || journalText.trim().length < 5}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs shadow-xs transition-all flex items-center space-x-2 ${
              isAnalyzing 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer"
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Processing AI Well-being Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Submit Entry for GenAI Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Loading Overlay */}
        {isAnalyzing && (
          <div className="mt-6 p-6 border border-blue-50 bg-blue-50/10 rounded-xl flex flex-col items-center justify-center text-center animate-pulse">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full animate-spin mb-3">
              <RefreshCw className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-blue-900 font-display">{LOADING_STEPS[loadingStep]}</h4>
            <p className="text-xs text-blue-600 mt-1">Calibrating physical stress anchors and emotional trend curves...</p>
          </div>
        )}
      </div>

      {/* Latest Journal Analysis Results */}
      {analysis && !isAnalyzing ? (
        <div className="space-y-8" id="analysis-results">
          
          {/* Header Sentiment Summary */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col justify-center">
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Deducted Mood Index</h4>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black font-display text-blue-600">{analysis.moodScore}</span>
                <span className="text-lg font-bold text-slate-400">/10</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ml-3">
                  {analysis.moodScore >= 8 ? "Serene" : analysis.moodScore >= 6 ? "Stable" : analysis.moodScore >= 4 ? "Anxious" : "Distressed"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Deducted organically from language structure, sentiment, and sleep references.</p>
            </div>

            <div className="flex flex-col justify-center border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0 md:px-6">
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Physiological Stress Level</h4>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-700">{analysis.stressLevel}</span>
                <span className="text-xs font-bold text-slate-400">{analysis.stressScore}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    analysis.stressLevel === "Severe" ? "bg-rose-600" :
                    analysis.stressLevel === "High" ? "bg-amber-500" :
                    analysis.stressLevel === "Moderate" ? "bg-blue-500" : "bg-emerald-500"
                  }`} 
                  style={{ width: `${analysis.stressScore}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Correlating adrenaline biomarkers with cognitive fatigue factors.</p>
            </div>

            <div className="flex flex-col justify-center">
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Detected Emotions</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.emotions.map((em, idx) => (
                  <span 
                    key={idx}
                    className="text-xs font-medium bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 rounded-full capitalize"
                  >
                    {em}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">Subconscious semantic patterns traditional numbers fail to isolate.</p>
            </div>
          </div>

          {/* Empathetic Encouragement Letter Card */}
          <div className="bg-linear-to-br from-amber-50/40 via-white to-amber-50/10 border border-amber-100/50 rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
              <Heart className="h-64 w-64 text-amber-900" />
            </div>

            <div className="flex items-center space-x-2.5 mb-4">
              <Heart className="h-5 w-5 text-rose-500" />
              <h3 className="text-lg font-bold font-display text-slate-800">Empathic Audit Reflection</h3>
            </div>

            <div className="text-slate-600 text-sm leading-relaxed space-y-3 italic font-sans" id="encouragement-letter">
              {analysis.encouragement}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-amber-100/40 pt-4 text-xs text-slate-400">
              <span className="font-mono">GenAI-Calibrated Wellness Report</span>
              <span className="font-semibold text-slate-600 italic">With care, Serene</span>
            </div>
          </div>

          {/* Actionable Coping Strategies */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center space-x-2.5 mb-5">
              <Coffee className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold font-display text-slate-800">Hyper-Personalized Coping Protocols</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.copingStrategies.map((strat, idx) => (
                <div key={idx} className="border border-slate-50 bg-slate-50/30 rounded-xl p-5 flex flex-col justify-between hover:border-slate-100 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{strat.category}</span>
                      <span className="text-xs text-slate-400 font-mono">Protocol #{idx+1}</span>
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-2">{strat.strategy}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{strat.actionableStep}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100/40 flex items-center text-xs text-emerald-600 font-medium">
                    <Check className="h-3.5 w-3.5 mr-1" /> Ready for Action
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Breathing Pacer and Mindfulness Guide */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Exercises Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2.5 mb-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold font-display text-slate-800">Adaptive Mindfulness Anchor</h3>
              </div>

              <div className="bg-blue-50/20 border border-blue-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-blue-900 text-sm">{analysis.mindfulnessRecommendation.title}</h4>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md uppercase tracking-wider">{analysis.mindfulnessRecommendation.type}</span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  A {analysis.mindfulnessRecommendation.durationMinutes}-minute exercises suggested specifically to address your currently logged anxiety levels.
                </p>

                <div className="space-y-2.5">
                  {analysis.mindfulnessRecommendation.instructions.map((inst, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-blue-600 mr-1 font-mono">{idx + 1}.</span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timed Breathing Visual Bubble Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Interactive Breathing Pacer</h4>

              {/* Breathing Bubble */}
              <div className="h-44 flex items-center justify-center w-full relative">
                {/* Bubble background pulsing */}
                <div 
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-1000 select-none ${
                    breathState === "idle" ? "bg-slate-200 text-slate-500" :
                    breathState === "inhale" ? "bg-blue-100 text-blue-700 animate-breath-inhale" :
                    breathState === "hold" ? "bg-amber-100 text-amber-700 animate-breath-hold" :
                    "bg-emerald-100 text-emerald-700 animate-breath-exhale"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {breathState === "idle" ? "Relaxed" : breathState}
                  </span>
                  {breathState !== "idle" && (
                    <span className="text-2xl font-black font-display mt-1">{breathTimer}s</span>
                  )}
                </div>
              </div>

              {/* Status and Controls */}
              <div className="text-center mt-4 w-full">
                {breathState !== "idle" ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium h-4">
                      {breathState === "inhale" && "Inhale deeply, expansion of chest... [4s]"}
                      {breathState === "hold" && "Retain breath completely, center focus... [7s]"}
                      {breathState === "exhale" && "Exhale slowly through mouth... [8s]"}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                      Completed cycles: <strong>{breathCycleCount}</strong>
                    </p>
                    <button
                      onClick={stopBreathing}
                      className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 active:scale-95 transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Square className="h-3 w-3" />
                      <span>Stop Breathing Routine</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sync your nervous system. Standard 4-7-8 loop recommended for high anxiety.
                    </p>
                    <button
                      onClick={startBreathing}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs active:scale-95 transition-all inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Begin Guided Pacer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : !isAnalyzing ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center">
          <BookOpen className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
          <h4 className="text-base font-bold font-display text-slate-700">Audit History Restored</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
            You are viewing pre-loaded exam preparation insights. Write a new entry above to run an active GenAI well-being audit.
          </p>
        </div>
      ) : null}
    </div>
  );
}
