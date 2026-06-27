import React, { useState } from "react";
import { StudentProfile } from "../types";
import { UserPlus, Sparkles, X, ChevronRight, Award } from "lucide-react";

interface ProfileModalProps {
  onClose: () => void;
  onProfileCreated: (newProfile: StudentProfile) => void;
}

const EXAM_OPTIONS = ["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC"] as const;

export default function ProfileModal({ onClose, onProfileCreated }: ProfileModalProps) {
  const [name, setName] = useState("");
  const [exam, setExam] = useState<typeof EXAM_OPTIONS[number]>("NEET");
  const [targetYear, setTargetYear] = useState("2026");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Create a new customized student profile
    const newProfile: StudentProfile = {
      id: "custom-" + Date.now(),
      name: name,
      exam: exam,
      avatar: avatarUrl,
      targetYear: targetYear,
      // Provide some initial mock logs for the chart to not look empty immediately
      moodLogs: [
        { date: "2026-06-21", mood: 7, stress: 45, sleep: 7.0, focus: 7 },
        { date: "2026-06-22", mood: 6, stress: 55, sleep: 6.5, focus: 6 },
        { date: "2026-06-23", mood: 5, stress: 65, sleep: 6.0, focus: 5 },
        { date: "2026-06-24", mood: 6, stress: 50, sleep: 7.2, focus: 8 },
        { date: "2026-06-25", mood: 6, stress: 55, sleep: 6.8, focus: 7 },
        { date: "2026-06-26", mood: 7, stress: 40, sleep: 7.5, focus: 8 }
      ],
      journals: [
        {
          id: "j-initial",
          date: "2026-06-26",
          content: `Hi diary, I am starting my mental wellness logging today for ${exam} preparation. The pressure is building up, but I am determined to stay mindful and take care of my mental health.`,
          analysis: {
            moodScore: 7,
            stressLevel: "Moderate",
            stressScore: 40,
            emotions: ["hopeful", "determined", "purposeful"],
            detectedTriggers: [
              {
                trigger: "Initial Setup",
                type: "Environmental",
                description: "Starting a new mindfulness routine to address long-term competitive academic pressure."
              }
            ],
            hiddenPatterns: [
              "Proactive self-awareness signals positive emotional resilience."
            ],
            copingStrategies: [
              {
                strategy: "Daily Wellness Audit",
                actionableStep: "Set a repeating alarm for 9 PM every evening. Pour your unfiltered thoughts here for just 3 minutes to offload cognitive strain.",
                category: "Boundary Setting"
              }
            ],
            mindfulnessRecommendation: {
              title: "Calming Breath Anchor",
              type: "Breathing",
              durationMinutes: 3,
              instructions: [
                "Sit upright with your spine comfortably straight.",
                "Inhale through the nose, feeling the cool air.",
                "Exhale, feeling warm air. Do this for 10 counts."
              ]
            },
            encouragement: `Welcome ${name}! Preparing for ${exam} is a sprint and a marathon rolled into one. By prioritizing your mental well-being today, you have taken the single most important step toward sustainable success. Rest when you need to—you are worthy of peace.`
          }
        }
      ],
      chatHistory: [
        {
          id: "ch-init",
          sender: "bot",
          text: `Hello ${name}! I am Serene, your mental wellness companion. I see you are preparing for ${exam} ${targetYear}. I know this is an immensely demanding journey, and I am right here to help you de-stress, analyze your diary entries, and listen to anything you need to share. How can I support you today?`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    onProfileCreated(newProfile);
  };

  const AVATARS = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120", // Female
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120", // Male
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120", // Male 2
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"  // Female 2
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" id="profile-modal">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-slate-800">Add Student Profile</h3>
            <p className="text-xs text-slate-400">Initialize a custom high-stakes exam tracking profile</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Rohan Mehra"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          {/* Exam Target & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Exam</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-hidden focus:border-blue-400 focus:bg-white transition-all"
              >
                {EXAM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Year</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-hidden focus:border-blue-400 focus:bg-white transition-all"
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          {/* Avatar Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select Avatar</label>
            <div className="flex items-center space-x-3">
              {AVATARS.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    avatarUrl === url ? "border-blue-500 scale-110 shadow-sm" : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Alert explaining what initial status is provided */}
          <div className="p-4 bg-blue-50/20 border border-blue-50 rounded-xl flex items-start space-x-2.5 text-xs text-blue-800 leading-relaxed">
            <Sparkles className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <span>Adding a custom profile pre-loads 6 days of emotional calibration logs to immediate visualizations and activates full GenAI analysis endpoints.</span>
          </div>

          {/* Submit Action */}
          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center space-x-1"
            >
              <Award className="h-4 w-4" />
              <span>Create Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
