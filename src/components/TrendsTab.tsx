import React from "react";
import { StudentProfile } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  Activity, 
  Moon, 
  Zap, 
  Sparkles,
  Award,
  Layers,
  ChevronRight
} from "lucide-react";

interface TrendsTabProps {
  profile: StudentProfile;
}

export default function TrendsTab({ profile }: TrendsTabProps) {
  // Extract latest journal's triggers and patterns to display on the trend tab
  const latestJournal = profile.journals.length > 0 ? profile.journals[0] : null;
  const analysis = latestJournal?.analysis;

  // Formatting date for the chart labels (e.g., "24 Jun")
  const chartData = profile.moodLogs.map((log) => {
    const d = new Date(log.date);
    const formattedDate = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return {
      ...log,
      formattedDate,
      // Scale mood and focus to 1-100 for a consistent combined view if needed,
      // or keep primitive and let Recharts handle dual axis.
      // Let's use dual axis or display them alongside.
    };
  });

  // Calculate some quick stats for the user
  const averageMood = (profile.moodLogs.reduce((sum, log) => sum + log.mood, 0) / profile.moodLogs.length).toFixed(1);
  const averageStress = (profile.moodLogs.reduce((sum, log) => sum + log.stress, 0) / profile.moodLogs.length).toFixed(0);
  const averageSleep = (profile.moodLogs.reduce((sum, log) => sum + log.sleep, 0) / profile.moodLogs.length).toFixed(1);
  const averageFocus = (profile.moodLogs.reduce((sum, log) => sum + log.focus, 0) / profile.moodLogs.length).toFixed(1);

  // Identify physical/sleep correlation trigger
  const lowSleepLogs = profile.moodLogs.filter(l => l.sleep < 5.5);
  const lowSleepStressAvg = lowSleepLogs.length > 0 
    ? (lowSleepLogs.reduce((s, l) => s + l.stress, 0) / lowSleepLogs.length).toFixed(0)
    : "0";

  return (
    <div className="space-y-8" id="trends-dashboard">
      {/* Quick Status Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center space-x-4 hover:border-slate-200 transition-all">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Well-being</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">{averageMood} <span className="text-xs text-slate-400 font-normal">/10</span></h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center space-x-4 hover:border-slate-200 transition-all">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Stress Level</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">{averageStress}%</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center space-x-4 hover:border-slate-200 transition-all">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Moon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Sleep Duration</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">{averageSleep} <span className="text-xs text-slate-400 font-normal">hrs</span></h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center space-x-4 hover:border-slate-200 transition-all">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Focus Score</p>
            <h3 className="text-2xl font-bold font-display text-slate-800">{averageFocus} <span className="text-xs text-slate-400 font-normal">/10</span></h3>
          </div>
        </div>
      </div>

      {/* Main Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="charts-container">
        {/* Mood & Stress Trend Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-800">Mood vs. Stress Correlation</h3>
              <p className="text-xs text-slate-400">Tracking daily emotional triggers and recovery indicators</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span>Mood</span>
              <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-rose-500 mr-1.5"></span>Stress</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#3b82f6" domain={[1, 10]} fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" domain={[0, 100]} fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                  labelStyle={{ fontWeight: "bold", color: "#334155" }}
                />
                <Line yAxisId="left" type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep vs Focus Correlation Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-800">Sleep Hours vs. Daytime Focus</h3>
              <p className="text-xs text-slate-400">Verifying how physiological rest directly shields study quality</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></span>Focus</span>
              <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></span>Sleep</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#10b981" domain={[1, 10]} fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" domain={[0, 12]} fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}
                />
                <Bar yAxisId="left" dataKey="focus" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="sleep" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                <ReferenceLine yAxisId="right" y={6} label={{ value: "Min Sleep Buffer (6h)", fill: "#d97706", fontSize: 10, position: "top" }} stroke="#f59e0b" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hidden Stress Triggers & Traditional Tracker Blindspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="pattern-insights">
        {/* Stress Triggers Section */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <h3 className="text-lg font-bold font-display text-slate-800">GenAI-Detected Stress Triggers</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Analyzing natural text logs helps pinpoint specific exam-related triggers that normal numeric trackers completely miss.
            </p>

            {analysis && analysis.detectedTriggers && analysis.detectedTriggers.length > 0 ? (
              <div className="space-y-4">
                {analysis.detectedTriggers.map((t, i) => (
                  <div key={i} className="border border-slate-50 bg-slate-50/50 rounded-xl p-4 transition-all hover:bg-slate-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-slate-800">{t.trigger}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        t.type === "Academic" ? "bg-blue-100 text-blue-700" :
                        t.type === "Physical" ? "bg-amber-100 text-amber-700" :
                        t.type === "Social" ? "bg-rose-100 text-rose-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {t.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-100 bg-slate-50/50 rounded-xl text-center">
                <Brain className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">No current triggers detected</p>
                <p className="text-xs text-slate-400 mt-1">Submit a detailed journal entry in the Daily Diary tab to let Serene dissect underlying stressors.</p>
              </div>
            )}
          </div>

          {analysis && analysis.detectedTriggers && (
            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
              <span>Analysis active from: <strong>{latestJournal?.date}</strong></span>
              <span className="flex items-center text-emerald-600 font-medium">
                <Sparkles className="h-3 w-3 mr-1" /> Custom Exam Grounding Active
              </span>
            </div>
          )}
        </div>

        {/* Traditional Tracker Blindspots (Patterns) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <Brain className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-bold font-display text-slate-800">Unconscious Emotional Patterns</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              These are subtle neurological feedback loops, behaviors, or displacements discovered in your journal narratives.
            </p>

            {analysis && analysis.hiddenPatterns && analysis.hiddenPatterns.length > 0 ? (
              <div className="space-y-4">
                {analysis.hiddenPatterns.map((pat, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-blue-50/30 border border-blue-50/50 rounded-xl">
                    <div className="mt-0.5 p-1 bg-blue-50 text-blue-600 rounded-md">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">Pattern #{i+1}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{pat}</p>
                    </div>
                  </div>
                ))}

                {/* Direct Correlation Alert */}
                {lowSleepLogs.length > 0 && (
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start space-x-3 mt-4">
                    <div className="mt-0.5 p-1 bg-amber-100 text-amber-700 rounded-md">
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Cross-Metric Alarm</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        When sleep drops below 5.5 hours, your stress levels spike to an average of <strong className="text-rose-600">{lowSleepStressAvg}%</strong>. The data shows sleep restriction is acting as a major anxiety amplifier for your {profile.exam} prep.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-100 bg-slate-50/50 rounded-xl text-center">
                <Brain className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-500">No unconscious patterns logged yet</p>
                <p className="text-xs text-slate-400 mt-1">Traditional numeric parameters miss psychological habits. Write about your thoughts to reveal them.</p>
              </div>
            )}
          </div>

          <div className="mt-5 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Award className="h-4 w-4 text-amber-500" />
              <span>Target exam: <strong className="text-slate-800">{profile.exam} ({profile.targetYear})</strong></span>
            </div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">Active Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
