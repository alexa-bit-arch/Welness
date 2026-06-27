export interface MoodLog {
  date: string; // YYYY-MM-DD
  mood: number; // 1-10
  stress: number; // 0-100
  sleep: number; // hours
  focus: number; // 1-10
}

export interface JournalTrigger {
  trigger: string;
  type: string;
  description: string;
}

export interface CopingStrategy {
  strategy: string;
  actionableStep: string;
  category: string;
}

export interface MindfulnessRecommendation {
  title: string;
  type: string;
  durationMinutes: number;
  instructions: string[];
}

export interface JournalAnalysis {
  moodScore: number;
  stressLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  stressScore: number;
  emotions: string[];
  detectedTriggers: JournalTrigger[];
  hiddenPatterns: string[];
  copingStrategies: CopingStrategy[];
  mindfulnessRecommendation: MindfulnessRecommendation;
  encouragement: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  analysis?: JournalAnalysis;
  isAnalyzing?: boolean;
  error?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  exam: 'NEET' | 'JEE' | 'CUET' | 'CAT' | 'GATE' | 'UPSC';
  avatar: string;
  targetYear: string;
  moodLogs: MoodLog[];
  journals: JournalEntry[];
  chatHistory: ChatMessage[];
}
