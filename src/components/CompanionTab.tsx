import React, { useState, useEffect, useRef } from "react";
import { StudentProfile, ChatMessage } from "../types";
import { Send, Sparkles, MessageSquare, Heart, RefreshCw, Smile } from "lucide-react";

interface CompanionTabProps {
  profile: StudentProfile;
  onMessageSent: (newMessage: ChatMessage) => void;
}

const CONTEXT_SUGGESTIONS: Record<string, string[]> = {
  JEE: [
    "I scored low on my Physics mock test...",
    "I am overwhelmed by math backlogs.",
    "I studied till 3 AM and feel so foggy.",
    "My family expects so much from me."
  ],
  UPSC: [
    "Syllabus feels like an endless ocean...",
    "I feel deeply isolated studying in Rajinder Nagar.",
    "UPSC feels like an absolute gamble.",
    "I can't seem to retain what I read today."
  ],
  NEET: [
    "Biology memorization is burning me out.",
    "Organic Chemistry reactions are slipping my mind.",
    "I feel like my friends are miles ahead of me.",
    "The competition numbers make me freeze."
  ],
  DEFAULT: [
    "I feel like giving up today.",
    "I scored extremely low on my test.",
    "The backlog is keeping me awake.",
    "How do I manage this pressure?"
  ]
};

export default function CompanionTab({ profile, onMessageSent }: CompanionTabProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [profile.chatHistory, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Create and dispatch User Message
    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    
    onMessageSent(userMsg);
    setInputText("");
    setIsTyping(true);

    try {
      // 2. Query Serene API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: profile.chatHistory, // includes the newly appended one
          studentName: profile.name,
          exam: profile.exam,
          currentMood: profile.moodLogs.length > 0 ? profile.moodLogs[profile.moodLogs.length - 1].mood : 5,
          recentTriggers: profile.journals.length > 0 && profile.journals[0].analysis
            ? profile.journals[0].analysis.detectedTriggers.map(t => t.trigger)
            : []
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Companion API failed");
      }

      // 3. Create and dispatch Bot Message
      const botMsg: ChatMessage = {
        id: "b-" + Date.now(),
        sender: "bot",
        text: data.response || data.fallbackResponse,
        timestamp: new Date().toISOString()
      };
      
      onMessageSent(botMsg);
    } catch (err) {
      console.error(err);
      // Fallback response if offline/error
      const errorMsg: ChatMessage = {
        id: "b-err-" + Date.now(),
        sender: "bot",
        text: `I am right here with you, ${profile.name}. It seems my neural connection is slightly busy right now, but please take a deep breath. You are carrying a massive load with ${profile.exam}, and I want you to know your hard work is incredibly valid. Can we take a 2-minute break and drink some water?`,
        timestamp: new Date().toISOString()
      };
      onMessageSent(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = CONTEXT_SUGGESTIONS[profile.exam] || CONTEXT_SUGGESTIONS.DEFAULT;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]" id="companion-workspace">
      {/* Sidebar Info/Status */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between" id="companion-meta">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <Heart className="h-5 w-5 text-rose-500" />
            <h3 className="text-base font-bold font-display text-slate-800">My Compassionate Listener</h3>
          </div>
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 mb-5">
            <p className="text-xs text-slate-600 leading-relaxed">
              Meet <strong>Serene</strong>, your non-judgmental mental wellness ally. Serene is programmed specifically to understand competitive pressure. 
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your conversations are private, secure, and focused entirely on helping you navigate high anxiety, isolation, or study backlogs safely.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Currently Grounded In:</p>
            <div className="text-xs text-slate-600 space-y-1 bg-slate-50/50 p-3 rounded-lg">
              <div>Exam Target: <strong>{profile.exam}</strong></div>
              <div>Current Well-being Status: <strong>{profile.moodLogs.length > 0 ? `${profile.moodLogs[profile.moodLogs.length-1].mood}/10` : "Not logged"}</strong></div>
              <div>Stress Triggers Loaded: <strong>{profile.journals.length > 0 && profile.journals[0].analysis ? "Yes" : "None"}</strong></div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50/20 border border-blue-50 rounded-xl flex items-center space-x-2 text-xs text-blue-800">
          <Smile className="h-4 w-4 shrink-0 text-blue-500" />
          <span>Need a fast pause? Ask Serene: <strong>'Help me ground myself'</strong></span>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col h-full overflow-hidden" id="chat-box">
        {/* Chat Header */}
        <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold font-display shadow-xs text-sm">
              S
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 font-display">Serene Companion</h4>
              <p className="text-[10px] text-slate-400 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>Empathetic Listener Online
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider font-mono">GenAI v3.5-Flash</span>
        </div>

        {/* Scrollable Conversation area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20" id="conversation-scroller">
          {profile.chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-blue-600 text-white rounded-br-none shadow-sm" 
                    : "bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[9px] mt-2 font-mono ${msg.sender === "user" ? "text-blue-200 text-right" : "text-slate-400 text-left"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-4 max-w-[80%] shadow-xs flex items-center space-x-2 text-slate-400 text-xs">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500" />
                <span>Serene is listening and framing your thoughts...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input & Suggestion Chips */}
        <div className="border-t border-slate-100 p-4 space-y-3 bg-white">
          {/* Quick Suggestion Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0 mr-1">Press to Send:</span>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-xs bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-100 whitespace-nowrap cursor-pointer transition-all shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Talk to Serene about your ${profile.exam} anxieties...`}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-blue-400 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-xs ${
                !inputText.trim() || isTyping
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer"
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
