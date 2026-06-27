import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// JSON schema for journal analysis
const journalSchema = {
  type: Type.OBJECT,
  properties: {
    moodScore: { type: Type.INTEGER, description: "A scale of 1 to 10 of the student's mood, where 10 is very serene/focused and 1 is severe distress/burnout" },
    stressLevel: { type: Type.STRING, description: "Stress level: Low, Moderate, High, or Severe" },
    stressScore: { type: Type.INTEGER, description: "Stress level out of 100, where 100 is maximum panic/stress and 0 is complete peace" },
    emotions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 2-4 emotions felt by the student (e.g., anxious, overwhelmed, determined, hopeful, isolated, burnt-out)"
    },
    detectedTriggers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trigger: { type: Type.STRING, description: "Specific trigger identified (e.g., Organic Chemistry Backlogs, GS Paper essay writing, Time Management, Parent expectations, Peer comparison, Sleep deprivation)" },
          type: { type: Type.STRING, description: "Category of trigger (Academic, Social, Physical, Environmental)" },
          description: { type: Type.STRING, description: "Empathetic explanation of why this was identified as a trigger based on the journal text" }
        },
        required: ["trigger", "type", "description"]
      }
    },
    hiddenPatterns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Emotional patterns traditional trackers might miss. E.g., 'Anxiety peaking after mock test reviews', 'Sacrificing basic sleep to compensate for perceived backlog guilt', 'Anxiety manifested as physical tension or academic perfectionism'"
    },
    copingStrategies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.STRING, description: "Title of the tailored coping strategy" },
          actionableStep: { type: Type.STRING, description: "Clear, simple, actionable cognitive or physical exercise (e.g. 2-minute physical shakeout, Pomodoro adjustments, backlog-triage formula)" },
          category: { type: Type.STRING, description: "Category: e.g., Study Modification, Physical Release, Cognitive Reframing, Boundary Setting" }
        },
        required: ["strategy", "actionableStep", "category"]
      }
    },
    mindfulnessRecommendation: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Title of the recommended breathing or grounding exercise" },
        type: { type: Type.STRING, description: "Type: Breathing, Sensory Grounding, Guided Visual, Focus Anchor" },
        durationMinutes: { type: Type.INTEGER, description: "Duration in minutes (e.g., 2 to 5)" },
        instructions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Step-by-step easy directions to perform the recommended exercise"
        }
      },
      required: ["title", "type", "durationMinutes", "instructions"]
    },
    encouragement: {
      type: Type.STRING,
      description: "A highly compassionate, supportive paragraph tailored to their target exam. Speak directly to their soul, validating their enormous effort while assuring them their health is paramount."
    }
  },
  required: [
    "moodScore",
    "stressLevel",
    "stressScore",
    "emotions",
    "detectedTriggers",
    "hiddenPatterns",
    "copingStrategies",
    "mindfulnessRecommendation",
    "encouragement"
  ]
};

// API Route: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// API Route: Analyze Journal Entry
app.post("/api/analyze-journal", async (req, res) => {
  try {
    const { journalText, exam, studentName } = req.body;

    if (!journalText || journalText.trim().length < 5) {
      return res.status(400).json({ error: "Journal entry is too short to analyze." });
    }

    if (!ai) {
      // Return beautiful simulated analysis if no API key is set, preventing crashes
      return res.json(getMockAnalysis(journalText, exam, studentName));
    }

    const systemPrompt = `You are an expert student psychologist and empathetic counselor specializing in competitive Indian exams (NEET, JEE, CUET, CAT, GATE, UPSC). 
    Your role is to deeply analyze a student's daily journal entry. 
    Look beyond surface-level complaints to detect hidden emotional patterns and physiological indicators (like sleep debt or isolation) that simple trackers miss. 
    Keep your encouragement deeply compassionate, and provide extremely actionable, customized coping mechanisms.
    The student's name is ${studentName || "Student"} and they are preparing for the ${exam || "competitive"} exam.`;

    const userPrompt = `Analyze this journal entry:
    """
    ${journalText}
    """`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: journalSchema,
        temperature: 0.7,
      },
    });

    const analysisText = response.text;
    if (!analysisText) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedAnalysis = JSON.parse(analysisText.trim());
    res.json(parsedAnalysis);
  } catch (error: any) {
    console.error("Error analyzing journal entry:", error);
    res.status(500).json({ 
      error: "Failed to analyze journal entry using GenAI.",
      details: error.message,
      mockFallback: true,
      data: getMockAnalysis(req.body.journalText || "", req.body.exam || "JEE", req.body.studentName || "Student")
    });
  }
});

// API Route: Empathetic Companion Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory, studentName, exam, currentMood, recentTriggers } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!ai) {
      return res.json({ response: getMockChatResponse(message, exam, studentName, currentMood) });
    }

    const systemPrompt = `You are "Serene", an empathetic, supportive, always-available AI mental wellness companion for students preparing for highly competitive exams (JEE, NEET, UPSC, GATE, CAT, CUET).
    
    Student Context:
    - Name: ${studentName || "Student"}
    - Target Exam: ${exam || "Competitive Exam"}
    - Current Mood Level: ${currentMood || "Not logged"} / 10
    - Recent triggers: ${recentTriggers && recentTriggers.length ? recentTriggers.join(", ") : "None identified yet"}

    Your sole purpose is to listen actively, offer validated emotional support, and act as a safe, completely non-judgmental space.
    
    Guidelines:
    1. Acknowledge and validate the specific pressure of preparing for ${exam} (e.g., competitive peer pressure, syllabus overwhelm, mock test performance anxiety, rote-learning fatigue, backlogs).
    2. Speak with deep warmth, empathy, and absolute sincerity. Use simple, direct, comforting language.
    3. Avoid toxic positivity. Do NOT make unrealistic promises like "you will definitely top the list!" or offer clinical-sounding generic advice. Acknowledge their effort, tell them it's normal to feel this way, and stress that their life and health is always bigger than any single exam.
    4. Suggest tiny, actionable grounding techniques if they are currently anxious (e.g., "let's take 3 slow breaths together", "feel your feet on the floor").
    5. Be extremely concise. Keep answers under 150 words to prevent cognitive overload. Use simple formatting with bullet points or paragraphs.`;

    // Convert history format to Gemini SDK standard structure if needed
    // standard Gemini chat format or contents
    const contents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      // Take only the last 8 messages to prevent token bloat
      const recentHistory = chatHistory.slice(-8);
      recentHistory.forEach((msg: any) => {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 250,
      }
    });

    res.json({ response: response.text || "I am here with you. Can you tell me more about how you are feeling?" });
  } catch (error: any) {
    console.error("Error in companion chat:", error);
    res.status(500).json({ 
      error: "Companion chat failed.",
      details: error.message,
      fallbackResponse: getMockChatResponse(req.body.message, req.body.exam, req.body.studentName, req.body.currentMood)
    });
  }
});

// Mock/Fallback Analysis Generator (when API key is missing or fails)
function getMockAnalysis(text: string, exam: string = "JEE", name: string = "Student") {
  const textLower = text.toLowerCase();
  let mood = 5;
  let stress = 60;
  let triggers = [{ trigger: "Syllabus Size", type: "Academic", description: "Perceived vastness of exam topics causing paralysis." }];
  let patterns = ["High stress correlation with self-imposed high targets."];
  let emotions = ["anxious", "determined"];

  if (textLower.includes("mock") || textLower.includes("test") || textLower.includes("score")) {
    mood = 4;
    stress = 75;
    triggers = [
      { trigger: "Mock Test Performance", type: "Academic", description: "Fear of not matching preparation targets on practice sets." },
      { trigger: "Self-Worth tied to Scores", type: "Social", description: "Feeling that a single test score evaluates your overall capability." }
    ];
    patterns = ["Score anxiety triggering a cycle of intense self-criticism", "Subconscious fear of exam day failure."];
    emotions = ["discouraged", "overwhelmed", "determined"];
  } else if (textLower.includes("sleep") || textLower.includes("tired") || textLower.includes("exhausted") || textLower.includes("night")) {
    mood = 3;
    stress = 80;
    triggers = [
      { trigger: "Sleep Deprivation", type: "Physical", description: "Late-night studying resulting in continuous REM-stage disruption." },
      { trigger: "Syllabus Backlog Overwhelm", type: "Academic", description: "Attempting to compensate for backlogs by skipping critical physiological recovery." }
    ];
    patterns = ["Compensating for backlog guilt with late-night exhaustion", "Physical fatigue intensifying regular cognitive anxiety."];
    emotions = ["exhausted", "restless", "drained"];
  } else if (textLower.includes("family") || textLower.includes("parents") || textLower.includes("peer") || textLower.includes("friend")) {
    mood = 4;
    stress = 70;
    triggers = [
      { trigger: "Parental/Social Expectations", type: "Social", description: "Unconscious burden of returning family pride or justifying their investment." },
      { trigger: "Coaching Center Comparison", type: "Social", description: "Constantly matching your chapter-by-chapter progress with peer percentiles." }
    ];
    patterns = ["Social isolation from peers disguised as focus", "Fear of letting down your family system."];
    emotions = ["lonely", "anxious", "guilty"];
  }

  return {
    moodScore: mood,
    stressLevel: stress > 75 ? "Severe" : stress > 55 ? "High" : stress > 35 ? "Moderate" : "Low",
    stressScore: stress,
    emotions: emotions,
    detectedTriggers: triggers,
    hiddenPatterns: patterns,
    copingStrategies: [
      {
        strategy: "The 'Backlog Triage' Strategy",
        actionableStep: "Divide your backlogs into three columns: 'Critical for Mock', 'High-weightage but can wait', and 'Ignore for now'. Focus ONLY on the first column for 45 minutes, then force a 10-minute mental shutoff.",
        category: "Study Modification"
      },
      {
        strategy: "Cognitive Offloading",
        actionableStep: "Write down your worst-case exam scenario on a physical piece of paper, crumple it up, and throw it away to signal your brain that these thoughts are not active threats.",
        category: "Cognitive Reframing"
      }
    ],
    mindfulnessRecommendation: {
      title: "Tactical 4-7-8 Breathing",
      type: "Breathing",
      durationMinutes: 3,
      instructions: [
        "Inhale quietly through your nose for 4 seconds.",
        "Hold your breath completely for 7 seconds.",
        "Exhale slowly and completely through your mouth with a 'whoosh' sound for 8 seconds.",
        "Repeat this cycle for 4 iterations to chemically down-regulate your nervous system."
      ]
    },
    encouragement: `Hi ${name}, taking a breath here. It is completely normal to feel like the weight of the entire ${exam} syllabus is on your shoulders. You are preparing for one of the most grueling academic journeys, and the fact that you are sitting here, analyzing your feelings and trying your best, is proof of your massive courage. Remember, this exam is a small chapter in a very long, beautiful book of your life. It does not measure your intelligence, nor does it measure your capacity to love, create, and succeed in a million other ways. Rest is a part of preparation, not an escape. Be kind to yourself today.`
  };
}

// Mock/Fallback Chat Response Generator
function getMockChatResponse(message: string, exam: string = "JEE", name: string = "Student", currentMood?: number) {
  const msg = message.toLowerCase();
  
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return `Hello ${name}! I am Serene, your personal companion. I know preparing for ${exam} can feel extremely lonely and demanding. How are you holding up today? I am right here to listen to anything—academic stress, fatigue, or just feelings you can't share elsewhere.`;
  }
  
  if (msg.includes("score") || msg.includes("mock") || msg.includes("test") || msg.includes("marks")) {
    return `Mock tests are meant to show you gaps in preparation, *never* your ultimate potential. When we get a low score, our brain treats it as a survival threat, which spikes cortisol and makes us freeze or panic. Try to review only 5 mistakes today, and then step away. Your worth is not a rank on a scoreboard. Let's do a quick breathing pause.`;
  }
  
  if (msg.includes("sleep") || msg.includes("tired") || msg.includes("exhausted") || msg.includes("burnout") || msg.includes("physics") || msg.includes("chemistry") || msg.includes("syllabus")) {
    return `Syllabus anxiety is incredibly real. We try to study more by cutting down on sleep, but a sleep-deprived brain retains 40% less information. If you're feeling burnt out, that is your body desperately asking for a pause. Can we agree to stop studying at 11 PM tonight, drink some warm water, and just let your mind recharge? You've worked so hard.`;
  }

  return `I hear you completely. Preparing for an exam like ${exam} takes an immense emotional toll. What you are describing is a completely valid reaction to high pressure. Remember, you don't have to carry this all alone. I am here. Tell me, what is one small thing we can do right now to make you feel slightly lighter?`;
}

// Vite integration for development and production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
