import { StudentProfile } from "./types";

export const dummyProfiles: StudentProfile[] = [
  {
    id: "aarav-jee",
    name: "Aarav Patel",
    exam: "JEE",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    targetYear: "2027",
    moodLogs: [
      { date: "2026-06-20", mood: 6, stress: 55, sleep: 6.5, focus: 7 },
      { date: "2026-06-21", mood: 5, stress: 65, sleep: 5.5, focus: 6 },
      { date: "2026-06-22", mood: 4, stress: 70, sleep: 5.0, focus: 5 },
      { date: "2026-06-23", mood: 3, stress: 80, sleep: 4.5, focus: 4 },
      { date: "2026-06-24", mood: 4, stress: 75, sleep: 4.0, focus: 5 },
      { date: "2026-06-25", mood: 5, stress: 70, sleep: 5.5, focus: 6 },
      { date: "2026-06-26", mood: 6, stress: 60, sleep: 6.0, focus: 8 }
    ],
    journals: [
      {
        id: "aarav-j1",
        date: "2026-06-23",
        content: "Scored 112/300 on the physics-heavy mock exam today. I am absolutely devastated. Mechanics feels impossible, and calculus backlogs are just staring at me. I feel like everyone at the coaching center is miles ahead of me. Parents are spending so much on my classes, I can't let them down, but I am terrified I won't even clear the cutoff.",
        analysis: {
          moodScore: 3,
          stressLevel: "Severe",
          stressScore: 80,
          emotions: ["Devastated", "Insecure", "Overwhelmed", "Guilty"],
          detectedTriggers: [
            {
              trigger: "Mock Exam Score Drop",
              type: "Academic",
              description: "A sudden score dip leading to panic about overall competence and exam-day preparedness."
            },
            {
              trigger: "Financial & Parental Expectations",
              type: "Social",
              description: "Heavy internal pressure to justify the parental investment in high-cost coaching centers."
            },
            {
              trigger: "Peer Comparison",
              type: "Social",
              description: "Subconsciously comparing learning rates with peer percentiles, triggering imposter syndrome."
            }
          ],
          hiddenPatterns: [
            "Score anxiety triggering a defense mechanism of intense isolation and self-doubt.",
            "Backlog overload paralyzing decision-making (Analysis Paralysis)."
          ],
          copingStrategies: [
            {
              strategy: "Mock Exam Triage Protocol",
              actionableStep: "Hide the final score. Focus ONLY on selecting exactly 3 physics questions you got wrong due to simple mistakes. Correct only those, and close the notebook for the day.",
              category: "Study Modification"
            },
            {
              strategy: "The 'Parent Dialogue' Reframe",
              actionableStep: "Realize your parents invested in your potential, not a single mock exam. Send a simple text: 'Studying hard today, taking it step by step' to release tension.",
              category: "Cognitive Reframing"
            }
          ],
          mindfulnessRecommendation: {
            title: "Grounding Box Breathing",
            type: "Breathing",
            durationMinutes: 4,
            instructions: [
              "Inhale slowly for 4 seconds.",
              "Hold your lungs full for 4 seconds.",
              "Exhale smoothly over 4 seconds.",
              "Hold your lungs empty for 4 seconds.",
              "Repeat this loop 5 times to re-activate the vagus nerve and slow your rapid heart rate."
            ]
          },
          encouragement: "Aarav, mechanics is historically one of the hardest parts of the JEE syllabus. Your brain is dealing with a heavy load. A single mock test is just a tool to highlight what to review next—it is NOT a reflection of your destiny. You have the grit. Take a breath; you are doing enough."
        }
      },
      {
        id: "aarav-j2",
        date: "2026-06-24",
        content: "Stayed up until 3:30 AM trying to complete the organic chemistry worksheets I skipped last week. Woke up at 7:00 AM with a pounding headache. Couldn't understand a word during the coordinate geometry lecture today. Brain felt like solid cement. I'm so tired but I feel like if I sleep, I'll fall even further behind.",
        analysis: {
          moodScore: 4,
          stressLevel: "Severe",
          stressScore: 75,
          emotions: ["Exhausted", "Anxious", "Cognitively Foggy"],
          detectedTriggers: [
            {
              trigger: "Sleep Deprivation",
              type: "Physical",
              description: "Restricting sleep to less than 4 hours, severely damaging cognitive consolidation and memory retention."
            },
            {
              trigger: "Backlog-Induced Guilt",
              type: "Academic",
              description: "Anxiety over past uncompleted tasks resulting in erratic, late-night cram sessions."
            }
          ],
          hiddenPatterns: [
            "Compensating for academic guilt by sacrificing physiological recovery (sleep), leading to a toxic feedback loop of low focus and increased guilt.",
            "Underestimating the direct correlation between physical exhaustion and emotional vulnerability."
          ],
          copingStrategies: [
            {
              strategy: "Strict Sleep Ingress Boundary",
              actionableStep: "Establish a hard stop at 11:30 PM. No screens, books, or notes beyond this hour. Trade 1 hour of cramming for 2 hours of enhanced daytime focus.",
              category: "Boundary Setting"
            },
            {
              strategy: "Micro-Nap Triage",
              actionableStep: "Take a quiet, 20-minute restorative lie-down at 3 PM. No phone, just eyes closed to allow the prefrontal cortex to clear metabolic waste.",
              category: "Physical Release"
            }
          ],
          mindfulnessRecommendation: {
            title: "Body Scan Relaxation",
            type: "Sensory Grounding",
            durationMinutes: 5,
            instructions: [
              "Lie flat or sit comfortably with hands resting on your thighs.",
              "Close your eyes and direct attention to your feet. Feel them release tension.",
              "Move attention slowly up to your calves, knees, chest, and jaw.",
              "Consciously unclench your jaw and drop your shoulders away from your ears."
            ]
          },
          encouragement: "Aarav, sleep is not a reward for studying; it is an active, non-negotiable part of studying. A foggy brain cannot parse coordinate geometry. Let's reset the clock tonight. Sleep is your superpower for JEE."
        }
      }
    ],
    chatHistory: [
      {
        id: "ac1",
        sender: "user",
        text: "I am feeling so overwhelmed about the upcoming Sunday test. I can't seem to remember any formulas for calculus.",
        timestamp: "2026-06-25T16:00:00Z"
      },
      {
        id: "ac2",
        sender: "bot",
        text: "I completely hear you, Aarav. Calculus formulas can feel like a blur when stress levels are peaking. Our brains block memory retrieval when they detect panic. Let's do a micro-reset right now: take one slow inhale, hold for 3 seconds, and let it go. You don't need to master the entire chapter tonight. Can we focus on practicing just 5 basic applications together?",
        timestamp: "2026-06-25T16:01:00Z"
      }
    ]
  },
  {
    id: "ananya-upsc",
    name: "Ananya Sharma",
    exam: "UPSC",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    targetYear: "2026",
    moodLogs: [
      { date: "2026-06-20", mood: 7, stress: 45, sleep: 7.5, focus: 7 },
      { date: "2026-06-21", mood: 6, stress: 50, sleep: 7.0, focus: 8 },
      { date: "2026-06-22", mood: 5, stress: 55, sleep: 6.8, focus: 6 },
      { date: "2026-06-23", mood: 5, stress: 60, sleep: 6.5, focus: 5 },
      { date: "2026-06-24", mood: 6, stress: 55, sleep: 7.0, focus: 7 },
      { date: "2026-06-25", mood: 4, stress: 70, sleep: 6.0, focus: 5 },
      { date: "2026-06-26", mood: 5, stress: 65, sleep: 6.8, focus: 6 }
    ],
    journals: [
      {
        id: "ananya-j1",
        date: "2026-06-23",
        content: "GS Paper 3 current affairs feels like an infinite, endless ocean. I spent 9 hours straight reading economic reviews and standard notes today, but when I closed the register, I felt like I retained absolutely nothing. The sheer volume of material is paralyzing me. I'm constantly asking myself: how can anyone possibly memorize all of this? I feel like my preparation is a leaking bucket.",
        analysis: {
          moodScore: 5,
          stressLevel: "High",
          stressScore: 60,
          emotions: ["Paralyzed", "Inadequate", "Mentally Fatigued"],
          detectedTriggers: [
            {
              trigger: "Vastness of Current Affairs",
              type: "Academic",
              description: "The infinite boundary of the UPSC syllabus causing severe cognitive fatigue and information overload."
            },
            {
              trigger: "Perceived Retention Failure",
              type: "Academic",
              description: "The normal neurological delay in consolidating dense facts interpreted as failure or memory deficit."
            }
          ],
          hiddenPatterns: [
            "The 'Leaking Bucket' metaphor indicates a perfectionist retention standard (believing one must recall 100% of facts on first reading).",
            "Continuous 9-hour study blocks without structured cognitive breaks leading to sensory saturation."
          ],
          copingStrategies: [
            {
              strategy: "Passive Recall Reframe",
              actionableStep: "Accept that your brain stores information in layers. Instead of memorizing, write three bullet-point summaries from memory on a blank index card after each study unit.",
              category: "Cognitive Reframing"
            },
            {
              strategy: "The '30-Minute Boundary' Break",
              actionableStep: "Implement a 50-10 Pomodoro system. Walk outside the room for 10 minutes every hour to allow the brain's default mode network to consolidate information.",
              category: "Study Modification"
            }
          ],
          mindfulnessRecommendation: {
            title: "5-4-3-2-1 Sensory Grounding",
            type: "Sensory Grounding",
            durationMinutes: 3,
            instructions: [
              "Look around your room and name 5 objects you can see.",
              "Close your eyes and identify 4 things you can physically feel (e.g., chair support, keyboard keys).",
              "Listen closely and name 3 distinct sounds you can hear.",
              "Acknowledge 2 things you can smell.",
              "Acknowledge 1 positive thing you can taste or the feeling of fresh air entering your chest."
            ]
          },
          encouragement: "Ananya, UPSC does not require you to be a walking encyclopedia; it requires you to synthesize concepts. Your brain is indeed consolidating this massive amount of data, even if it feels chaotic right now. Trust the process. Rest is not wasted time."
        }
      },
      {
        id: "ananya-j2",
        date: "2026-06-25",
        content: "Felt so incredibly lonely and isolated today. I didn't leave my study desk or talk to a single human being besides the maid. I happened to open Instagram and saw a post of my college roommate celebrating her promotion and buying a car in Bangalore. Here I am, 24 years old, sitting in a rented 10x10 room in Rajinder Nagar, completely dependent on my parents' allowance, mugging up history archives. I feel like my youth is slipping away for a gamble.",
        analysis: {
          moodScore: 4,
          stressLevel: "High",
          stressScore: 70,
          emotions: ["Lonely", "Envious", "Regretful", "Stagnant"],
          detectedTriggers: [
            {
              trigger: "Extreme Social Isolation",
              type: "Environmental",
              description: "Spending multiple days without physical, meaningful human contact."
            },
            {
              trigger: "Peer Career Milestones",
              type: "Social",
              description: "Comparing personal delayed-gratification academic timelines with corporate instant-reward timelines."
            },
            {
              trigger: "Financial Dependency",
              type: "Social",
              description: "Feeling guilty or infantalized by relying on parents' monthly support at 24."
            }
          ],
          hiddenPatterns: [
            "Delayed gratification guilt masquerading as stagnation.",
            "Using social media as a metric of personal success, triggering immediate comparative despair."
          ],
          copingStrategies: [
            {
              strategy: "Social Connection Ingress",
              actionableStep: "Commit to one physical walk or a 15-minute voice call with a non-UPSC friend or family member every single day at 6 PM. Physical voice connection is a psychological necessity.",
              category: "Boundary Setting"
            },
            {
              strategy: "The 'Delayed Gratification' Journaling",
              actionableStep: "Write down the specific public policy reason you chose UPSC over a corporate desk. Remind yourself that you are building capacity for public service, which follows a different timeline.",
              category: "Cognitive Reframing"
            }
          ],
          mindfulnessRecommendation: {
            title: "Mindful Walking Break",
            type: "Sensory Grounding",
            durationMinutes: 5,
            instructions: [
              "Step outside your room or walk slowly back and forth inside.",
              "Sync your breathing with your steps: Inhale for 3 steps, exhale for 3 steps.",
              "Focus on the physical sensation of your feet touching the floor, releasing pressure into the ground."
            ]
          },
          encouragement: "Ananya, you are on a path of immense purpose. Corporate promotions are beautiful, but your decision to dedicate your youth to serving your country through the Civil Services is incredibly noble. Your timeline is unique, not delayed. You are exactly where you need to be."
        }
      }
    ],
    chatHistory: [
      {
        id: "anc1",
        sender: "user",
        text: "I am feeling like giving up. The Prelims are approaching and I don't think my history prep is even 50% complete.",
        timestamp: "2026-06-25T18:00:00Z"
      },
      {
        id: "anc2",
        sender: "bot",
        text: "Ananya, it is completely valid to feel exhausted by the sheer scale of the syllabus. Remember, nobody goes into Prelims feeling '100% prepared'—not even the toppers. History is massive, but Prelims is about elimination and conceptual clarity, not absolute rote learning. Let's list just 3 high-yield modern history chapters to look at today, and let the rest of the syllabus rest. You are a resilient candidate.",
        timestamp: "2026-06-25T18:01:00Z"
      }
    ]
  }
];
