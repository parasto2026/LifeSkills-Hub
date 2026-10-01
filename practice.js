/*
  LifeSkills Hub — Practice Page
  Complete practice-page controller.

  Works with the current practice.html structure:
  - Choose a skill
  - Choose challenge time
  - Today's Challenge
  - Surprise Me
  - Level 1: 60-second mini practice
  - Level 2: What Would You Do?
  - Level 3: Spot Problem
  - Level 4: Decision Lab
  - Level 5: Real-Life Mission
  - Level 6: 7-Day Challenge
  - Reflection
  - Local progress / XP / achievements

  Note: progress is stored locally in this browser via localStorage.
*/

(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "lifeskillsHubPracticeProgress";

    const defaults = {
      xp: 0,
      completedCount: 0,
      achievements: [],
      selectedSkill: "communication",
      selectedTime: "60",
      sevenDay: {
        started: false,
        completedDays: []
      },
      reflections: {
        noticed: "",
        next: ""
      }
    };

    const skills = {
      communication: {
        name: "Communication",
        colorClass: "skill-communication",
        challengeTags: ["LISTEN", "SPEAK", "CONNECT"],
        mini: [
          {
            prompt: "Someone is telling you about a problem. Before giving advice, what is the first useful move?",
            answer: "Pause, listen fully, then ask one clear question."
          },
          {
            prompt: "You disagree with someone. Which opening keeps the conversation productive?",
            answer: "Explain your view without attacking the person."
          },
          {
            prompt: "What is one simple way to show that you were listening?",
            answer: "Reflect back the important point in your own words."
          }
        ],
        scenarios: [
          {
            question: "A friend starts telling you something important while you are checking your phone. What do you do?",
            options: [
              "Keep looking at the phone but say 'I'm listening.'",
              "Put the phone away and give them your attention.",
              "Interrupt with your own similar story.",
              "Tell them to message you later."
            ],
            correct: "B",
            explanation: "Attention is part of listening. Reducing distractions makes it easier to understand what the other person means."
          },
          {
            question: "You do not understand what someone meant. What is the clearest response?",
            options: [
              "Pretend you understood.",
              "Change the topic.",
              "Ask them to explain or give an example.",
              "Assume they meant the worst."
            ],
            correct: "C",
            explanation: "A short clarifying question can prevent unnecessary misunderstandings."
          },
          {
            question: "Someone says something you disagree with. What is a useful first response?",
            options: [
              "'That's completely stupid.'",
              "'You're wrong.'",
              "'I see it differently. Can you explain how you reached that view?'",
              "Say nothing and leave immediately."
            ],
            correct: "C",
            explanation: "You can disagree while still making room to understand the other person's reasoning."
          }
        ],
        spot: [
          {
            text: "A person replies to a message with only 'Fine.' You immediately decide they are angry.",
            answer: "The problem is assuming a meaning without enough information. Ask or wait for more context instead of treating your guess as a fact."
          },
          {
            text: "Someone is speaking, but you are planning your reply before they finish.",
            answer: "The problem is listening to respond instead of listening to understand. Stay with their point first, then formulate your response."
          },
          {
            text: "You disagree with a friend, so you start describing the friend as a bad person.",
            answer: "The problem is attacking the person instead of addressing the idea or behavior. Focus on the specific issue."
          }
        ],
        lab: [
          {
            title: "A conversation suddenly becomes tense.",
            question: "What would you do first?",
            steps: [
              "Slow the conversation down.",
              "Listen for the actual point of disagreement.",
              "Respond to the issue rather than the person's character."
            ],
            reveal: "A pause can create enough space to understand the real issue before reacting."
          },
          {
            title: "Two people disagree about what happened.",
            question: "How could you reduce the chance of a bigger argument?",
            steps: [
              "Ask each person what they remember.",
              "Separate facts from interpretations.",
              "Look for the specific point that needs clarification."
            ],
            reveal: "Good communication does not require instant agreement; it starts by making the situation clearer."
          }
        ],
        mission: [
          {
            title: "Have one conversation where you truly listen.",
            description: "Choose one person today. Put your phone away, listen until they finish, and ask one question that shows you were paying attention.",
            checks: [
              "I chose someone.",
              "I listened without interrupting.",
              "I asked a thoughtful question."
            ]
          },
          {
            title: "Ask one better question today.",
            description: "During one conversation, replace a quick reaction with a question such as 'What made you think that?' or 'What happened next?'",
            checks: [
              "I noticed a chance to ask instead of react.",
              "I asked the question calmly.",
              "I listened to the answer."
            ]
          }
        ],
        week: [
          "Listen without interrupting for one full conversation.",
          "Ask one clarifying question before giving advice.",
          "Summarize someone's main point in your own words.",
          "Practice saying 'I see it differently because…' instead of attacking.",
          "Notice one conversation habit you want to change.",
          "Have a five-minute phone-free conversation.",
          "Reflect: What made communication easier this week?"
        ]
      },

      "critical-thinking": {
        name: "Critical Thinking",
        colorClass: "skill-critical-thinking",
        challengeTags: ["CHECK", "QUESTION", "EVIDENCE"],
        mini: [
          {
            prompt: "You see a claim online: 'Everyone knows this is true.' What should you ask?",
            answer: "Ask what evidence supports the claim and where the information came from."
          },
          {
            prompt: "A confident person gives you an answer without evidence. Does confidence prove the claim?",
            answer: "No. Confidence and evidence are different things."
          },
          {
            prompt: "You find one source supporting your opinion. What is a useful next step?",
            answer: "Check other credible sources and look for missing information or counterevidence."
          }
        ],
        scenarios: [
          {
            question: "A viral post says a product 'works for everyone' because thousands of people liked it. What do you do?",
            options: [
              "Believe it because many people liked it.",
              "Ignore all online information.",
              "Check the evidence, source, and what the claim actually proves.",
              "Share it before it disappears."
            ],
            correct: "C",
            explanation: "Popularity is not the same as evidence. A strong check asks who made the claim and what data supports it."
          },
          {
            question: "Someone gives two examples that support an idea. What should you remember?",
            options: [
              "Two examples prove the idea in every case.",
              "Examples can support an idea without proving it universally.",
              "Examples are never useful.",
              "Examples automatically remove bias."
            ],
            correct: "B",
            explanation: "Examples can be informative, but they may not represent the whole situation."
          },
          {
            question: "You strongly agree with a claim. Which question is especially useful?",
            options: [
              "How can I defend it no matter what?",
              "Who else agrees with me?",
              "What evidence would make me reconsider it?",
              "How quickly can I share it?"
            ],
            correct: "C",
            explanation: "Looking for disconfirming evidence helps test a belief instead of protecting it automatically."
          }
        ],
        spot: [
          {
            text: "A message says: 'Everyone knows this is true, so you should believe it too.'",
            answer: "The problem is using popularity as if it were proof. The number of believers does not by itself establish whether a claim is true."
          },
          {
            text: "A person says, 'It happened to me once, so this always happens.'",
            answer: "The problem is generalizing from a single example. One experience may matter, but it cannot automatically describe every case."
          },
          {
            text: "Someone only searches for information that agrees with what they already believe.",
            answer: "The problem is confirmation bias. A stronger approach is to deliberately check credible evidence that could challenge the original belief."
          }
        ],
        lab: [
          {
            title: "You see a claim that sounds convincing.",
            question: "How would you test it?",
            steps: [
              "State the claim clearly.",
              "Ask what evidence supports it.",
              "Check whether the source and evidence actually justify the conclusion."
            ],
            reveal: "Critical thinking slows down the jump from 'this sounds right' to 'this is true.'"
          },
          {
            title: "Two sources give different answers.",
            question: "What should you compare?",
            steps: [
              "Check the quality and independence of the sources.",
              "Compare the evidence they use.",
              "Look for information that could explain the difference."
            ],
            reveal: "When sources disagree, comparing their evidence and methods is more useful than simply counting how many sources agree."
          }
        ],
        mission: [
          {
            title: "Question one claim before sharing it.",
            description: "Find one claim today. Ask: What is the evidence? Who is the source? What information might be missing?",
            checks: [
              "I selected one claim.",
              "I checked the source.",
              "I looked for supporting evidence."
            ]
          },
          {
            title: "Find one piece of counterevidence.",
            description: "Choose an opinion you hold and search for one credible source or fact that challenges part of it.",
            checks: [
              "I chose a belief or opinion.",
              "I looked for credible counterevidence.",
              "I considered what it changes or does not change."
            ]
          }
        ],
        week: [
          "Ask 'How do I know this?' once today.",
          "Check the source of one claim.",
          "Find one missing piece of information.",
          "Look for evidence that could challenge one belief.",
          "Separate a fact from an interpretation.",
          "Compare two credible sources on the same topic.",
          "Reflect: Which question improved your thinking most?"
        ]
      },

      "decision-making": {
        name: "Decision-Making",
        colorClass: "skill-decision-making",
        challengeTags: ["CHOOSE", "PRIORITIZE", "DECIDE"],
        mini: [
          {
            prompt: "You have three useful options and limited time. What is a helpful first move?",
            answer: "Compare the options against the same important criteria."
          },
          {
            prompt: "A decision feels urgent. What question can create space?",
            answer: "Ask what truly has to be decided now and what can wait."
          },
          {
            prompt: "You are stuck choosing between options. What can reduce confusion?",
            answer: "Write down the key trade-off and what outcome matters most."
          }
        ],
        scenarios: [
          {
            question: "You have one hour and three tasks: an important deadline tomorrow, an easy task due next week, and a low-value distraction. What do you do?",
            options: [
              "Choose the easiest task first.",
              "Do the distraction because it feels relaxing.",
              "Start with the important deadline because it has high importance and nearer urgency.",
              "Try to do all three at the same time."
            ],
            correct: "C",
            explanation: "Prioritization considers both importance and urgency rather than choosing only what feels easiest."
          },
          {
            question: "Two options are both reasonable, but one is easy to reverse later. What can that tell you?",
            options: [
              "Reversible choices never matter.",
              "The reversible option may allow you to learn before making a harder commitment.",
              "Always choose the reversible option.",
              "The choice is already made for you."
            ],
            correct: "B",
            explanation: "Reversibility can be useful information, especially when uncertainty is high."
          },
          {
            question: "You keep delaying a decision because every option has a downside. What is a useful next step?",
            options: [
              "Wait until every uncertainty disappears.",
              "Choose randomly.",
              "Identify the most important trade-off and decide using your key criteria.",
              "Ask five people to decide for you."
            ],
            correct: "C",
            explanation: "Many real decisions involve trade-offs. Making the key criteria explicit can make the choice clearer."
          }
        ],
        spot: [
          {
            text: "You choose an option only because you already spent a lot of money on it.",
            answer: "The problem may be the sunk-cost fallacy: past costs have already happened, so the decision should focus on future costs and benefits."
          },
          {
            text: "You have two good options but keep changing your mind without defining what matters most.",
            answer: "The problem is unclear criteria. A decision becomes easier when you decide what factors actually matter before comparing options."
          },
          {
            text: "A choice feels urgent, so you make it immediately without checking whether it really has to be decided now.",
            answer: "The problem is treating pressure as proof of urgency. First separate a true deadline from a feeling of urgency."
          }
        ],
        lab: [
          {
            title: "You have three important things to do, but only enough time for one.",
            question: "How would you decide which one deserves your attention first?",
            steps: [
              "Consider what is most important.",
              "Consider what is most urgent.",
              "Choose the option with the strongest reason."
            ],
            reveal: "Good decisions often become clearer when you compare options using explicit criteria instead of relying only on the strongest emotion in the moment."
          },
          {
            title: "Two choices have different risks and benefits.",
            question: "How could you compare them?",
            steps: [
              "Write the most important benefit of each.",
              "Write the biggest downside of each.",
              "Ask which trade-off fits your current goal."
            ],
            reveal: "A visible trade-off can be easier to evaluate than a vague feeling that one option simply 'seems better.'"
          }
        ],
        mission: [
          {
            title: "Use the 3-option rule once today.",
            description: "For one decision, write three possible choices. Then compare them using one or two criteria that matter most.",
            checks: [
              "I wrote three options.",
              "I chose criteria that matter.",
              "I made a decision for a clear reason."
            ]
          },
          {
            title: "Separate urgency from importance.",
            description: "Find one thing that feels urgent. Ask whether it is actually important, actually time-sensitive, both, or neither.",
            checks: [
              "I identified one 'urgent' task.",
              "I checked its real deadline.",
              "I chose my next action deliberately."
            ]
          }
        ],
        week: [
          "Use three options for one small decision.",
          "Write down one decision criterion.",
          "Separate importance from urgency.",
          "Notice one sunk-cost thought.",
          "Make one reversible decision quickly instead of overthinking it.",
          "Review one decision and ask what information mattered.",
          "Reflect: What makes your decisions clearer?"
        ]
      },

      "time-management": {
        name: "Time Management",
        colorClass: "skill-time-management",
        challengeTags: ["PLAN", "FOCUS", "ACT"],
        mini: [
          {
            prompt: "Your task list feels huge. What is a useful next move?",
            answer: "Choose the next important action instead of thinking about the entire list at once."
          },
          {
            prompt: "You keep delaying a task because it feels too big. What can help?",
            answer: "Shrink it to a specific action you can start in a few minutes."
          },
          {
            prompt: "You have ten free minutes. How can you use them intentionally?",
            answer: "Choose one small useful task and work on it without switching."
          }
        ],
        scenarios: [
          {
            question: "You have a large assignment due later and only 20 minutes now. What is a productive use of the time?",
            options: [
              "Spend 20 minutes deciding whether to start.",
              "Break the assignment into steps and complete the smallest useful next step.",
              "Wait for a perfect two-hour block.",
              "Do unrelated easy tasks instead."
            ],
            correct: "B",
            explanation: "A large task becomes easier to start when you convert it into a concrete next action."
          },
          {
            question: "You are working but keep switching between messages, videos, and homework. What is one useful experiment?",
            options: [
              "Add more apps.",
              "Try one short uninterrupted focus block.",
              "Work on everything simultaneously.",
              "Keep switching so nothing feels boring."
            ],
            correct: "B",
            explanation: "A short period of single-tasking gives you a practical way to test whether fewer interruptions help."
          },
          {
            question: "A task has no clear first step. What can you do?",
            options: [
              "Wait until motivation appears.",
              "Define the smallest visible action, such as opening the document and writing a heading.",
              "Add five more tasks.",
              "Skip the task permanently."
            ],
            correct: "B",
            explanation: "Specific next actions reduce the friction of starting."
          }
        ],
        spot: [
          {
            text: "You write 'study biology' on your list and then wonder why you never start.",
            answer: "The problem is that the task is too vague. Turn it into a specific next action, such as 'review pages 12–15 and write three key points.'"
          },
          {
            text: "You have an important task to finish, but you keep doing tiny easy tasks because they feel productive.",
            answer: "The problem is confusing activity with priority. Easy tasks can create progress without moving the most important work forward."
          },
          {
            text: "You wait for a free afternoon before starting a task that could be advanced in ten minutes.",
            answer: "The problem is treating available time as all-or-nothing. A small focused block can still create useful progress."
          }
        ],
        lab: [
          {
            title: "You have a long list and only 25 minutes.",
            question: "How would you choose what to do?",
            steps: [
              "Identify the most important task.",
              "Define the smallest useful next action.",
              "Work on it without switching until the time is up."
            ],
            reveal: "Time management is often less about filling every minute and more about choosing where your attention goes next."
          },
          {
            title: "You keep procrastinating on a difficult task.",
            question: "How could you lower the starting barrier?",
            steps: [
              "Shrink the task.",
              "Set a short timer.",
              "Begin before deciding whether to continue."
            ],
            reveal: "Starting can be easier when the commitment is small and specific rather than 'finish everything now.'"
          }
        ],
        mission: [
          {
            title: "Do 'The Next One' for ten minutes.",
            description: "Choose the next important task, put away distractions, and work on it for ten minutes without switching.",
            checks: [
              "I chose one important task.",
              "I worked for ten focused minutes.",
              "I noticed what made starting easier or harder."
            ]
          },
          {
            title: "Turn one vague task into an action.",
            description: "Take one item from your task list and rewrite it as a concrete action that could be started immediately.",
            checks: [
              "I chose a vague task.",
              "I rewrote it as a visible action.",
              "I started the action."
            ]
          }
        ],
        week: [
          "Define one clear next action.",
          "Use a ten-minute focus block.",
          "Remove one distraction before starting.",
          "Do the most important task before a low-value task.",
          "Break one large task into three steps.",
          "Notice when you are switching tasks unnecessarily.",
          "Reflect: Which small change helped your focus?"
        ]
      },

      "emotional-intelligence": {
        name: "Emotional Intelligence",
        colorClass: "skill-emotional-intelligence",
        challengeTags: ["NOTICE", "NAME", "RESPOND"],
        mini: [
          {
            prompt: "You feel irritated and want to reply immediately. What can help before acting?",
            answer: "Name the emotion and create a short pause before responding."
          },
          {
            prompt: "Are emotions always a reliable instruction for what you should do?",
            answer: "No. Emotions contain information, but you still choose how to respond."
          },
          {
            prompt: "What can make an emotional reaction easier to understand?",
            answer: "Notice the situation, your interpretation, the emotion, and the action urge."
          }
        ],
        scenarios: [
          {
            question: "You receive a message that annoys you. What is a useful first move?",
            options: [
              "Reply immediately while angry.",
              "Send a harsher message so they understand.",
              "Pause, notice the emotion, and decide what response matches your goal.",
              "Assume the sender intended to upset you."
            ],
            correct: "C",
            explanation: "A pause creates space between the emotion and the action, which can help you choose a response deliberately."
          },
          {
            question: "You feel nervous before an important conversation. What can you do?",
            options: [
              "Pretend the feeling does not exist.",
              "Name the nervousness and identify what you are concerned about.",
              "Decide that nervousness means you will fail.",
              "Avoid every difficult conversation."
            ],
            correct: "B",
            explanation: "Naming an emotion can make the experience more specific and easier to work with."
          },
          {
            question: "A friend looks upset but says they are fine. What is a respectful response?",
            options: [
              "'You are obviously lying.'",
              "Ignore them completely.",
              "Give them space while letting them know you are available to listen.",
              "Tell everyone else what you think is wrong."
            ],
            correct: "C",
            explanation: "You can acknowledge what you notice without claiming certainty about another person's internal state."
          }
        ],
        spot: [
          {
            text: "You feel angry, so you conclude that the other person must have intended to disrespect you.",
            answer: "The problem is treating an emotion and an interpretation as proof of another person's intention. The feeling is real; the explanation still needs checking."
          },
          {
            text: "You are stressed and tell yourself, 'I feel overwhelmed, so I have to quit.'",
            answer: "The problem is turning an emotional state into an automatic instruction. You can notice the stress and then consider your options."
          },
          {
            text: "You hide every uncomfortable emotion because you think emotional control means never feeling anything.",
            answer: "The problem is confusing emotional regulation with emotional suppression. Regulation involves noticing emotions and choosing how to respond."
          }
        ],
        lab: [
          {
            title: "You are angry after reading a message.",
            question: "What could you do before replying?",
            steps: [
              "Name the emotion.",
              "Notice the story your mind is telling you about the message.",
              "Choose a response that fits what you actually want to achieve."
            ],
            reveal: "The goal is not to eliminate the emotion. It is to create a gap between feeling and action."
          },
          {
            title: "You are nervous about making a mistake.",
            question: "How could you work with the feeling instead of fighting it?",
            steps: [
              "Name what you are feeling.",
              "Identify the specific concern underneath it.",
              "Choose one small action that moves you forward despite the feeling."
            ],
            reveal: "Emotional awareness can help turn a vague feeling into a specific problem that you can respond to."
          }
        ],
        mission: [
          {
            title: "Name it before you act.",
            description: "The next time you notice a strong emotion, pause and name it as specifically as you can before choosing your response.",
            checks: [
              "I noticed a strong emotion.",
              "I named it.",
              "I chose my response deliberately."
            ]
          },
          {
            title: "Notice the feeling, story, and action urge.",
            description: "During one emotional moment, write down what you felt, what you told yourself about it, and what you wanted to do.",
            checks: [
              "I named the feeling.",
              "I noticed my interpretation.",
              "I noticed my action urge."
            ]
          }
        ],
        week: [
          "Name one emotion accurately.",
          "Pause before one irritated response.",
          "Notice the story you tell yourself about a feeling.",
          "Ask someone how they are without assuming how they feel.",
          "Use one calming pause before acting.",
          "Write one short emotion → thought → action chain.",
          "Reflect: What helped you respond rather than react?"
        ]
      }
    };

    let state = loadState();

    const challengeState = {
      todaysIndex: 0,
      miniIndex: 0,
      scenarioIndex: 0,
      spotIndex: 0,
      labIndex: 0,
      missionIndex: 0,
      scenarioAnswered: false,
      miniStarted: false,
      miniFinished: false,
      spotRevealed: false,
      labRevealed: false,
      missionCompleted: false
    };

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    function loadState() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!saved || typeof saved !== "object") {
          return structuredCloneSafe(defaults);
        }

        return mergeState(structuredCloneSafe(defaults), saved);
      } catch {
        return structuredCloneSafe(defaults);
      }
    }

    function structuredCloneSafe(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function mergeState(base, saved) {
      if (Number.isFinite(saved.xp)) {
        base.xp = Math.max(0, saved.xp);
      }

      if (Number.isFinite(saved.completedCount)) {
        base.completedCount = Math.max(0, saved.completedCount);
      }

      if (Array.isArray(saved.achievements)) {
        base.achievements = [...new Set(saved.achievements)];
      }

      if (
        typeof saved.selectedSkill === "string" &&
        skills[saved.selectedSkill]
      ) {
        base.selectedSkill = saved.selectedSkill;
      }

      if (typeof saved.selectedTime === "string") {
        base.selectedTime = saved.selectedTime;
      }

      if (saved.sevenDay && typeof saved.sevenDay === "object") {
        base.sevenDay.started = Boolean(saved.sevenDay.started);

        base.sevenDay.completedDays = Array.isArray(
          saved.sevenDay.completedDays
        )
          ? saved.sevenDay.completedDays.filter(
              (n) =>
                Number.isInteger(n) &&
                n >= 1 &&
                n <= 7
            )
          : [];
      }

      if (
        saved.reflections &&
        typeof saved.reflections === "object"
      ) {
        base.reflections.noticed =
          typeof saved.reflections.noticed === "string"
            ? saved.reflections.noticed
            : "";

        base.reflections.next =
          typeof saved.reflections.next === "string"
            ? saved.reflections.next
            : "";
      }

      return base;
    }

    function saveState() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(state)
        );
      } catch {
        // Storage may be disabled.
        // The page should still work for the current session.
      }
    }

    function currentSkill() {
      return (
        skills[state.selectedSkill] ||
        skills.communication
      );
    }

    function addProgress({
      xp = 0,
      completion = false,
      achievement = null,
      message = ""
    } = {}) {
      state.xp += Math.max(0, xp);

      if (completion) {
        state.completedCount += 1;
      }

      if (
        achievement &&
        !state.achievements.includes(achievement)
      ) {
        state.achievements.push(achievement);
      }

      saveState();
      updateProgressUI();

      if (message) {
        celebrate(message, xp);
      }
    }

    function updateProgressUI() {
      const xp = $("#xp-count");
      const completed = $("#completed-count");
      const achievements = $("#achievement-count");

      if (xp) {
        xp.textContent = String(state.xp);
      }

      if (completed) {
        completed.textContent = String(
          state.completedCount
        );
      }

      if (achievements) {
        achievements.textContent = String(
          state.achievements.length
        );
      }

      $$(".day").forEach((day, index) => {
        const completedDay =
          state.sevenDay.completedDays.includes(
            index + 1
          );

        day.classList.toggle(
          "completed",
          completedDay
        );
      });
    }

    function selectSkill(
      skillKey,
      shouldRefresh = true
    ) {
      if (!skills[skillKey]) return;

      state.selectedSkill = skillKey;

      challengeState.todaysIndex = 0;
      challengeState.miniIndex = 0;
      challengeState.scenarioIndex = 0;
      challengeState.spotIndex = 0;
      challengeState.labIndex = 0;
      challengeState.missionIndex = 0;

      challengeState.scenarioAnswered = false;
      challengeState.miniStarted = false;
      challengeState.miniFinished = false;
      challengeState.spotRevealed = false;
      challengeState.labRevealed = false;
      challengeState.missionCompleted = false;

      saveState();

      $$(".practice-skill-card").forEach(
        (card) => {
          const active =
            card.dataset.skill === skillKey;

          card.classList.toggle(
            "active",
            active
          );

          card.setAttribute(
            "aria-pressed",
            String(active)
          );
        }
      );

      if (shouldRefresh) {
        renderTodaysChallenge();
        renderMiniPractice();
        renderScenario();
        renderSpotProblem();
        renderDecisionLab();
        renderMission();
        updateWeekHeader();
      }
    }

    function selectTime(time) {
      if (
        ![
          "60",
          "5",
          "10",
          "real-life"
        ].includes(time)
      ) {
        return;
      }

      state.selectedTime = time;
      saveState();

      $$(".practice-setting-card").forEach(
        (card) => {
          const selected =
            card.dataset.time === time;

          // Time cards should NEVER use
          // the old red selected border.
          // Keep every time card on the same
          // neutral border.
          card.classList.remove("active");

          card.setAttribute(
            "aria-pressed",
            String(selected)
          );

          card.style.setProperty(
            "border",
            "2px solid #d8d0c5",
            "important"
          );

          card.style.setProperty(
            "border-color",
            "#d8d0c5",
            "important"
          );

          card.style.setProperty(
            "box-shadow",
            selected
              ? "0 10px 24px rgba(23, 41, 67, 0.12)"
              : "none",
            "important"
          );

          card.style.setProperty(
            "transform",
            selected
              ? "translateY(-4px)"
              : "none",
            "important"
          );
        }
      );

      renderTodaysChallenge();
    }

    function renderTodaysChallenge() {
      const skill = currentSkill();

      const challenge =
        buildTodayChallenge(
          skill,
          state.selectedTime,
          challengeState.todaysIndex
        );

      const tag =
        $(".challenge-skill-tag");

      const time =
        $(".challenge-time");

      const number =
        $(".challenge-number");

      const question =
        $(".challenge-question");

      const think =
        $(".think-step");

      const tryStep =
        $(".try-step");

      const apply =
        $(".apply-step");

      if (tag) {
        tag.textContent =
          skill.name.toUpperCase();
      }

      if (time) {
        time.textContent =
          challenge.timeLabel;
      }

      if (number) {
        number.textContent =
          String(challenge.number)
            .padStart(2, "0");
      }

      if (question) {
        question.textContent =
          challenge.question;
      }

      if (think) {
        setStepText(
          think,
          challenge.think
        );
      }

      if (tryStep) {
        setStepText(
          tryStep,
          challenge.try
        );
      }

      if (apply) {
        setStepText(
          apply,
          challenge.apply
        );
      }

      const done =
        $("#challenge-done");

      if (done) {
        done.disabled = false;
        done.textContent =
          "Done — +10 XP";
      }
    }

    function setStepText(
      element,
      text
    ) {
      if (!element) return;

      const p =
        $("p", element);

      if (p) {
        p.textContent = text;
      } else {
        element.textContent = text;
      }
    }

    /*
      IMPORTANT FIX:
      Every skill now has 3 different
      Today's Challenges for every time option.

      This means:
      Challenge 1 → Challenge 2
      → Challenge 3 → Challenge 1...
    */
    function buildTodayChallenge(
      skill,
      time,
      index
    ) {
      const pools = {
        communication: {
          "60": [
            [
              "For one minute, listen without planning your reply. Ask one clarifying question afterward.",
              "Slow down your response urge.",
              "Listen until the person finishes, then ask one question.",
              "Notice whether you understood more than usual."
            ],
            [
              "For one minute, give someone your full attention without checking your phone or preparing your answer.",
              "Notice the urge to interrupt or look away.",
              "Let the person finish, then briefly repeat their main point.",
              "Notice whether full attention changed the conversation."
            ],
            [
              "For one minute, practice asking before assuming: ask one simple question when something is unclear.",
              "Notice the moment you feel tempted to guess.",
              "Ask a calm clarifying question and listen to the answer.",
              "Notice whether the question prevented a misunderstanding."
            ]
          ],

          "5": [
            [
              "Have a five-minute phone-free conversation and use Pause → Listen → Ask.",
              "Put away the biggest distraction.",
              "Listen, then ask one thoughtful question.",
              "Notice which part changed the conversation most."
            ],
            [
              "Spend five minutes in a conversation where you ask two follow-up questions instead of quickly changing the topic.",
              "Choose one person and stay curious.",
              "Ask questions such as 'What happened next?' or 'Why?'.",
              "Notice what extra information you learned."
            ],
            [
              "Use five minutes to practice disagreeing respectfully with one person.",
              "Focus on the idea, not the person.",
              "Start with 'I see it differently because…' and explain one reason.",
              "Notice whether you can disagree without making the conversation personal."
            ]
          ],

          "10": [
            [
              "Choose one conversation today where your only goal is to understand the other person's point before giving your view.",
              "Decide what you want to understand.",
              "Ask for an example or reason if needed.",
              "Notice what you learned that you would have missed by interrupting."
            ],
            [
              "Spend ten minutes practicing active listening with someone: listen, summarize, then ask one useful question.",
              "Choose a conversation worth understanding.",
              "Summarize their main point before sharing yours.",
              "Notice whether the summary made the conversation clearer."
            ],
            [
              "Use ten minutes to improve one difficult conversation by separating facts, feelings, and requests.",
              "Think about what actually happened.",
              "Describe the situation clearly, then say what you need or want.",
              "Notice whether being specific reduced tension."
            ]
          ],

          "real-life": [
            [
              "Use one real conversation today to practice listening, clarifying, and responding without rushing.",
              "Choose the conversation intentionally.",
              "Stay present and ask one useful question.",
              "Notice the effect on the interaction."
            ],
            [
              "In one real conversation today, replace one quick assumption with a question.",
              "Notice when you start guessing what the other person means.",
              "Ask for clarification before reacting.",
              "Notice whether the conversation became easier."
            ],
            [
              "Have one real conversation today where you summarize the other person's main point before giving your opinion.",
              "Listen for the main idea.",
              "Say the point back in your own words.",
              "Notice whether the person feels more understood."
            ]
          ]
        },

        "critical-thinking": {
          "60": [
            [
              "Take one claim you see today and ask: How do I know this is true?",
              "State the claim clearly.",
              "Identify the source or evidence.",
              "Notice what is still unknown."
            ],
            [
              "For one minute, separate a claim from the evidence supporting it.",
              "Write the claim in one sentence.",
              "Ask what evidence actually supports that exact claim.",
              "Notice whether the evidence is stronger or weaker than it first seemed."
            ],
            [
              "Take one confident statement and ask what information could prove it wrong.",
              "Do not protect the claim automatically.",
              "Name one piece of possible counterevidence.",
              "Notice whether you can imagine evidence that would change your mind."
            ]
          ],

          "5": [
            [
              "Spend five minutes checking one claim instead of immediately believing or rejecting it.",
              "Write down the exact claim.",
              "Check source, evidence, and missing information.",
              "Notice whether your confidence changed."
            ],
            [
              "Spend five minutes comparing two sources that discuss the same claim.",
              "Check who published each source.",
              "Compare the evidence and whether they agree on the important facts.",
              "Notice what explains any difference between them."
            ],
            [
              "Choose one opinion you hold and spend five minutes looking for a credible fact that could challenge it.",
              "Name the belief honestly.",
              "Search for evidence that does not simply agree with you.",
              "Notice whether the new information changes anything."
            ]
          ],

          "10": [
            [
              "Choose one strong opinion and spend ten minutes looking for credible evidence that could challenge it.",
              "Name the belief.",
              "Search for counterevidence from a reliable source.",
              "Notice what the counterevidence actually changes."
            ],
            [
              "Spend ten minutes investigating a claim by checking the source, evidence, and conclusion separately.",
              "Break the claim into parts.",
              "Ask whether the evidence really justifies the conclusion.",
              "Notice which part is strongest and which is weakest."
            ],
            [
              "Use ten minutes to find one example where an apparent fact depends on context.",
              "Choose a simple claim.",
              "Look for a situation where the claim changes or needs qualification.",
              "Notice why context matters to the conclusion."
            ]
          ],

          "real-life": [
            [
              "Before sharing or repeating one claim today, verify the source and evidence.",
              "Pause before passing it on.",
              "Check what the evidence really supports.",
              "Notice one assumption you avoided making."
            ],
            [
              "Use one real-life decision today to ask: What evidence am I relying on?",
              "Identify the decision or belief.",
              "Check whether your evidence is direct, reliable, and relevant.",
              "Notice what information you still need."
            ],
            [
              "When you hear a strong claim today, ask one question instead of instantly agreeing or disagreeing.",
              "Notice your first reaction.",
              "Ask how the person knows or what evidence supports it.",
              "Notice what the answer adds to your understanding."
            ]
          ]
        },

        "decision-making": {
          "60": [
            [
              "Pick one small decision and list three reasonable options before choosing.",
              "Do not choose the first option automatically.",
              "Compare the three using one important criterion.",
              "Notice whether the choice became clearer."
            ],
            [
              "Take one minute to name the single most important factor in a decision you need to make.",
              "Ask what outcome matters most.",
              "Use that factor to compare your options.",
              "Notice whether the decision feels less confusing."
            ],
            [
              "Think of one choice you are delaying and identify whether it truly must be decided now.",
              "Separate real urgency from pressure.",
              "Decide whether to act, wait, or gather more information.",
              "Notice whether creating space changed your thinking."
            ]
          ],

          "5": [
            [
              "Use five minutes to separate importance, urgency, and reversibility for one decision.",
              "Name the decision.",
              "Write the strongest reason for each option.",
              "Choose deliberately rather than endlessly comparing."
            ],
            [
              "Spend five minutes comparing two options using the same two criteria.",
              "Choose criteria that match your goal.",
              "Give each option a simple comparison on those criteria.",
              "Notice which trade-off matters most to you."
            ],
            [
              "Use five minutes to identify the biggest downside of your preferred option and how you could reduce it.",
              "Do not only search for reasons to agree with yourself.",
              "Name one risk and one way to manage it.",
              "Notice whether the risk changes your decision."
            ]
          ],

          "10": [
            [
              "For one meaningful decision, define what matters most and identify the key trade-off.",
              "Write your goal.",
              "Compare options against your goal and trade-off.",
              "Record the reason for your choice."
            ],
            [
              "Take ten minutes to compare three options with a simple pros, cons, and next-step check.",
              "Keep the criteria the same for each option.",
              "Write one important benefit, cost, and next action for each.",
              "Notice which information actually drove the decision."
            ],
            [
              "Use ten minutes to review a decision you already made and identify what information mattered most.",
              "Focus on the decision process, not self-criticism.",
              "Write what you knew, what you did not know, and what you chose.",
              "Notice one lesson you can use next time."
            ]
          ],

          "real-life": [
            [
              "Use an actual decision today to practice choosing from clear criteria rather than pressure alone.",
              "Define the real decision.",
              "Compare options against what matters.",
              "Notice what information made the decision easier."
            ],
            [
              "For one real-life choice today, write the decision, the main goal, and the next action before acting.",
              "Be specific about the outcome you want.",
              "Choose the next action that moves you toward it.",
              "Notice whether clarity reduced hesitation."
            ],
            [
              "When facing a real choice today, pause long enough to ask what you might regret not considering.",
              "Look for a missing factor, not a perfect answer.",
              "Add the missing information to your comparison.",
              "Notice whether the extra check changed or confirmed your plan."
            ]
          ]
        },

        "time-management": {
          "60": [
            [
              "Choose the next important task and work on it for one uninterrupted minute right now.",
              "Pick one task only.",
              "Start before making a bigger plan.",
              "Notice what helped you begin."
            ],
            [
              "For one minute, remove one distraction and start the exact task you have been avoiding.",
              "Make the first step tiny.",
              "Begin without waiting to feel ready.",
              "Notice how difficult starting actually was."
            ],
            [
              "Take one minute to turn a vague task into one visible action.",
              "Ask what you could physically do next.",
              "Write and start that action.",
              "Notice whether the task feels more manageable."
            ]
          ],

          "5": [
            [
              "Set five minutes and work on the next important action without switching tasks.",
              "Define the exact next action.",
              "Remove one distraction and begin.",
              "Notice what you completed."
            ],
            [
              "Use five minutes to clear one small task that has been creating mental clutter.",
              "Choose something genuinely useful, not just easy.",
              "Finish it without opening unrelated apps.",
              "Notice how finishing one task affects your attention."
            ],
            [
              "Spend five minutes planning only the next three actions for your most important task.",
              "Keep the plan concrete.",
              "Write three steps and begin the first one.",
              "Notice whether the plan makes starting easier."
            ]
          ],

          "10": [
            [
              "Turn one vague task into a concrete next action and work on it for ten minutes.",
              "Write the smallest useful step.",
              "Work without switching until ten minutes pass.",
              "Notice whether the task feels more manageable."
            ],
            [
              "Use a ten-minute focus block to make visible progress on one important task.",
              "Choose one outcome for the block.",
              "Silence unnecessary notifications and stay with the task.",
              "Notice what you accomplished in ten focused minutes."
            ],
            [
              "Spend ten minutes identifying where your time disappears today.",
              "Look at your recent activities honestly.",
              "Identify one low-value distraction to reduce.",
              "Notice what time you could reclaim tomorrow."
            ]
          ],

          "real-life": [
            [
              "Use the next available block of time to advance one important real-life task instead of waiting for perfect conditions.",
              "Identify what matters most.",
              "Use the time you actually have.",
              "Notice what progress became possible."
            ],
            [
              "Choose one real-life task today and protect a short block of time for it before doing lower-priority activities.",
              "Decide when you will do it.",
              "Start at the planned time and avoid switching.",
              "Notice whether scheduling changed your follow-through."
            ],
            [
              "When you catch yourself saying 'I don't have enough time' today, look for a smaller version of the task you can still complete.",
              "Identify the smallest useful result.",
              "Use the time available instead of abandoning the task.",
              "Notice what progress was possible with limited time."
            ]
          ]
        },

        "emotional-intelligence": {
          "60": [
            [
              "The next time a strong feeling appears, pause and name it before you act.",
              "Notice the body and emotion.",
              "Put the feeling into a specific word.",
              "Notice how the pause changes your response."
            ],
            [
              "Take one minute to notice what emotion you are feeling right now without judging it.",
              "Observe before trying to fix it.",
              "Name the emotion as specifically as you can.",
              "Notice what changed once you named it."
            ],
            [
              "For one minute, separate what happened from the story you are telling yourself about it.",
              "Notice the interpretation your mind added.",
              "Write the event and your interpretation as two separate statements.",
              "Notice whether the emotion feels easier to understand."
            ]
          ],

          "5": [
            [
              "Spend five minutes reflecting on one recent emotional reaction: feeling → interpretation → action urge.",
              "Choose one real moment.",
              "Write each part separately.",
              "Notice where you had a choice."
            ],
            [
              "Use five minutes to identify one situation that reliably triggers a strong emotion in you.",
              "Describe the situation without blaming yourself or someone else.",
              "Name the emotion and the action you usually want to take.",
              "Notice one alternative response you could try."
            ],
            [
              "Spend five minutes practicing a pause before responding to a mildly irritating message or situation.",
              "Notice your first reaction.",
              "Wait, breathe, and choose your response deliberately.",
              "Notice whether the pause changed what you wanted to say."
            ]
          ],

          "10": [
            [
              "Use ten minutes to understand one emotion you have been experiencing rather than judging yourself for it.",
              "Name the emotion precisely.",
              "Ask what triggered it and what story accompanied it.",
              "Choose one response that supports your goal."
            ],
            [
              "Spend ten minutes mapping one emotional moment: situation → thought → feeling → action.",
              "Choose a recent situation.",
              "Write each part in order.",
              "Notice where a different interpretation could change your action."
            ],
            [
              "Use ten minutes to think about a recent conflict and separate what you felt from what you assumed about the other person.",
              "Treat assumptions as possibilities, not facts.",
              "Write the feeling and the assumption separately.",
              "Notice what you actually know versus what you inferred."
            ]
          ],

          "real-life": [
            [
              "Use one real emotional moment today to practice noticing the feeling without letting it automatically choose your action.",
              "Pause.",
              "Name the feeling and interpretation.",
              "Choose a deliberate response."
            ],
            [
              "When you feel a strong emotion today, give yourself a short pause before deciding what to say or do.",
              "Notice the urge to act immediately.",
              "Create a small gap and choose your response.",
              "Notice whether the pause gave you more choices."
            ],
            [
              "In one real interaction today, notice your own emotion and also stay curious about what the other person may actually mean.",
              "Separate your feeling from your assumption.",
              "Ask or listen before deciding their intention.",
              "Notice whether curiosity changed the interaction."
            ]
          ]
        }
      };

      const set =
        pools[state.selectedSkill]?.[time] ||
        pools.communication["60"];

      const raw =
        set[index % set.length];

      return {
        number:
          (index % set.length) + 1,

        timeLabel:
          time === "real-life"
            ? "REAL LIFE"
            : `${time} SEC/MIN`,

        question: raw[0],
        think: raw[1],
        try: raw[2],
        apply: raw[3]
      };
    }

    function markChallengeDone() {
      const button =
        $("#challenge-done");

      if (button?.disabled) {
        return;
      }

      if (button) {
        button.disabled = true;
      }

      addProgress({
        xp: 10,
        completion: true,
        achievement: "first-challenge",
        message: "🎉 Nice work! +10 XP"
      });

      const next =
        $("#change-challenge");

      if (next) {
        next.textContent =
          "Try Another Challenge →";
      }
    }

    function changeChallenge() {
      challengeState.todaysIndex += 1;

      renderTodaysChallenge();

      const challenge =
        $("#todays-challenge");

      challenge?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    function surpriseMe() {
      const keys =
        Object.keys(skills);

      const current =
        state.selectedSkill;

      const choices =
        keys.filter(
          (key) => key !== current
        );

      const newSkill =
        choices[
          Math.floor(
            Math.random() *
              choices.length
          )
        ] || current;

      selectSkill(newSkill);

      const times = [
        "60",
        "5",
        "10",
        "real-life"
      ];

      selectTime(
        times[
          Math.floor(
            Math.random() *
              times.length
          )
        ]
      );

      const title =
        $("#surprise-button") ||
        $("#hero-surprise-button");

      if (title) {
        title.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      celebrate(
        `🎲 Try a surprise: ${skills[newSkill].name}`,
        0,
        false
      );
    }

    function renderMiniPractice() {
      const skill =
        currentSkill();

      const mini =
        skill.mini[
          challengeState.miniIndex %
            skill.mini.length
        ];

      const card =
        $$(".mini-practice-card").find(
          (item) =>
            item.dataset.skill ===
            state.selectedSkill
        );

      const allCards =
        $$(".mini-practice-card");

      allCards.forEach(
        (item) => {
          item.classList.toggle(
            "active",
            item === card
          );
        }
      );

      if (!card) {
        return;
      }

      const prompt =
        $(".mini-practice-prompt", card) ||
        $("p", card);

      const start =
        $(".mini-practice-start", card);

      const answer =
        $(".mini-practice-answer", card);

      if (prompt) {
        prompt.textContent =
          mini.prompt;
      }

      if (start) {
        if (
          challengeState.miniFinished
        ) {
          start.textContent =
            "Completed ✓";

          start.disabled = true;
        } else if (
          challengeState.miniStarted
        ) {
          // This button appears after
          // the learner starts.
          // They use it only after they
          // actually apply the challenge.
          start.textContent =
            "I Did It ✓";

          start.disabled = false;
        } else {
          start.textContent =
            "Try It →";

          start.disabled = false;
        }
      }

      if (answer) {
        if (
          challengeState.miniFinished
        ) {
          answer.textContent =
            `Good job — you applied it. Answer idea: ${mini.answer}`;
        } else if (
          challengeState.miniStarted
        ) {
          answer.textContent =
            "Now apply this challenge in real life. When you actually do it, click “I Did It ✓”.";
        } else {
          answer.textContent =
            "";
        }
      }
    }

    function startMiniPractice(
      skillKey
    ) {
      if (
        skillKey &&
        skills[skillKey]
      ) {
        selectSkill(
          skillKey,
          false
        );
      }

      const card =
        $$(".mini-practice-card").find(
          (item) =>
            item.dataset.skill ===
            state.selectedSkill
        );

      if (
        !card ||
        challengeState.miniFinished
      ) {
        return;
      }

      // First click:
      // start the challenge.
      // No XP is awarded yet.
      if (
        !challengeState.miniStarted
      ) {
        challengeState.miniStarted =
          true;

        saveState();
        renderMiniPractice();
        return;
      }

      // Second click:
      // learner confirms they actually
      // applied it.
      challengeState.miniFinished =
        true;

      saveState();
      renderMiniPractice();

      addProgress({
        xp: 5,
        completion: true,
        achievement:
          "quick-thinker",
        message:
          "✅ 60-second practice complete! +5 XP"
      });
    }

    function renderScenario() {
      const skill =
        currentSkill();

      const scenario =
        skill.scenarios[
          challengeState.scenarioIndex %
            skill.scenarios.length
        ];

      const skillLabel =
        $(".scenario-skill");

      const progress =
        $(".scenario-progress");

      const heading =
        $(".scenario-card h3");

      const question =
        $(".scenario-card p");

      const options =
        $$(".scenario-options button");

      const feedback =
        $("#scenario-feedback");

      if (skillLabel) {
        skillLabel.textContent =
          skill.name.toUpperCase();
      }

      if (progress) {
        progress.textContent =
          `${(challengeState.scenarioIndex % skill.scenarios.length) + 1} / ${skill.scenarios.length}`;
      }

      if (heading) {
        heading.textContent =
          "What Would You Do?";
      }

      if (question) {
        question.textContent =
          scenario.question;
      }

      options.forEach(
        (button, index) => {
          const text =
            $(".scenario-option-text", button);

          if (text) {
            text.textContent =
              scenario.options[index] ||
              "";
          }

          button.disabled = false;

          button.classList.remove(
            "correct",
            "incorrect",
            "selected"
          );

          button.setAttribute(
            "aria-pressed",
            "false"
          );
        }
      );

      if (feedback) {
        feedback.textContent =
          "";
      }

      challengeState.scenarioAnswered =
        false;
    }

    function answerScenario(
      optionButton
    ) {
      if (
        challengeState.scenarioAnswered
      ) {
        return;
      }

      const skill =
        currentSkill();

      const scenario =
        skill.scenarios[
          challengeState.scenarioIndex %
            skill.scenarios.length
        ];

      const chosen =
        optionButton.dataset.option;

      const correct =
        chosen === scenario.correct;

      challengeState.scenarioAnswered =
        true;

      $$(".scenario-options button")
        .forEach((button) => {
          button.disabled = true;

          const isCorrect =
            button.dataset.option ===
            scenario.correct;

          if (isCorrect) {
            button.classList.add(
              "correct"
            );
          }
        });

      optionButton.classList.add(
        correct
          ? "correct"
          : "incorrect",
        "selected"
      );

      optionButton.setAttribute(
        "aria-pressed",
        "true"
      );

      const feedback =
        $("#scenario-feedback");

      if (feedback) {
        feedback.textContent =
          `${correct ? "✅ Good reasoning." : "💡 Think again."} ${scenario.explanation}`;
      }

      addProgress({
        xp: correct ? 10 : 4,
        completion: true,
        achievement:
          correct
            ? "scenario-solver"
            : null,
        message:
          correct
            ? "🧠 Great reasoning! +10 XP"
            : "💡 You learned from the choice. +4 XP"
      });
    }

    function nextScenario() {
      challengeState.scenarioIndex += 1;
      renderScenario();
    }

    function renderSpotProblem() {
      const skill =
        currentSkill();

      const problem =
        skill.spot[
          challengeState.spotIndex %
            skill.spot.length
        ];

      const title =
        $("#spot-problem-title");

      const text =
        $("#spot-problem-text");

      const feedback =
        $("#spot-problem-feedback");

      const answerButton =
        $("#spot-problem-answer");

      if (title) {
        title.textContent =
          "What's wrong with this situation?";
      }

      if (text) {
        text.textContent =
          problem.text;
      }

      if (feedback) {
        feedback.textContent =
          challengeState.spotRevealed
            ? problem.answer
            : "";
      }

      if (answerButton) {
        answerButton.textContent =
          challengeState.spotRevealed
            ? "Problem Revealed ✓"
            : "Reveal the Problem";
      }

      challengeState.spotRevealed =
        false;
    }

    function revealSpotProblem() {
      const skill =
        currentSkill();

      const problem =
        skill.spot[
          challengeState.spotIndex %
            skill.spot.length
        ];

      const feedback =
        $("#spot-problem-feedback");

      const answerButton =
        $("#spot-problem-answer");

      if (
        challengeState.spotRevealed
      ) {
        return;
      }

      challengeState.spotRevealed =
        true;

      if (feedback) {
        feedback.textContent =
          problem.answer;
      }

      if (answerButton) {
        answerButton.textContent =
          "Problem Revealed ✓";
      }

      addProgress({
        xp: 6,
        completion: true,
        achievement:
          "pattern-spotter",
        message:
          "🔍 Problem spotted! +6 XP"
      });
    }

    function nextSpotProblem() {
      challengeState.spotIndex += 1;
      challengeState.spotRevealed =
        false;

      renderSpotProblem();
    }

    function renderDecisionLab() {
      const skill =
        currentSkill();

      const lab =
        skill.lab[
          challengeState.labIndex %
            skill.lab.length
        ];

      const title =
        $("#decision-lab-title");

      const question =
        $("#decision-lab-question");

      const step1 =
        $("#decision-lab-step-1");

      const step2 =
        $("#decision-lab-step-2");

      const step3 =
        $("#decision-lab-step-3");

      const feedback =
        $("#decision-lab-feedback");

      const button =
        $("#decision-lab-button");

      if (title) {
        title.textContent =
          lab.title;
      }

      if (question) {
        question.textContent =
          lab.question;
      }

      if (step1) {
        step1.textContent =
          lab.steps[0];
      }

      if (step2) {
        step2.textContent =
          lab.steps[1];
      }

      if (step3) {
        step3.textContent =
          lab.steps[2];
      }

      if (feedback) {
        feedback.textContent =
          challengeState.labRevealed
            ? lab.reveal
            : "";
      }

      if (button) {
        button.textContent =
          challengeState.labRevealed
            ? "Approach Revealed ✓"
            : "Reveal My Approach →";
      }

      challengeState.labRevealed =
        false;
    }

    function revealDecisionLab() {
      if (
        challengeState.labRevealed
      ) {
        return;
      }

      const skill =
        currentSkill();

      const lab =
        skill.lab[
          challengeState.labIndex %
            skill.lab.length
        ];

      const feedback =
        $("#decision-lab-feedback");

      const button =
        $("#decision-lab-button");

      challengeState.labRevealed =
        true;

      if (feedback) {
        feedback.textContent =
          lab.reveal;
      }

      if (button) {
        button.textContent =
          "Approach Revealed ✓";
      }

      addProgress({
        xp: 8,
        completion: true,
        achievement:
          "decision-lab",
        message:
          "🧪 Decision Lab complete! +8 XP"
      });
    }

    function nextDecisionLab() {
      challengeState.labIndex += 1;
      challengeState.labRevealed =
        false;

      renderDecisionLab();
    }

    function renderMission() {
      const skill =
        currentSkill();

      const mission =
        skill.mission[
          challengeState.missionIndex %
            skill.mission.length
        ];

      const title =
        $("#mission-title");

      const description =
        $("#mission-description");

      const feedback =
        $("#mission-feedback");

      const button =
        $("#mission-complete");

      const texts = [
        $("#mission-check-text-1"),
        $("#mission-check-text-2"),
        $("#mission-check-text-3")
      ];

      if (title) {
        title.textContent =
          mission.title;
      }

      if (description) {
        description.textContent =
          mission.description;
      }

      texts.forEach(
        (element, index) => {
          if (element) {
            element.textContent =
              mission.checks[index];
          }
        }
      );

      [1, 2, 3].forEach((n) => {
        const check =
          $(`#mission-check-${n}`);

        if (check) {
          check.checked = false;
        }
      });

      if (feedback) {
        feedback.textContent =
          "";
      }

      if (button) {
        button.textContent =
          "Complete Mission →";
      }

      challengeState.missionCompleted =
        false;
    }

    function completeMission() {
      if (
        challengeState.missionCompleted
      ) {
        return;
      }

      const checks =
        [1, 2, 3].map(
          (n) =>
            $(`#mission-check-${n}`)
        );

      const allDone =
        checks.every(
          (check) =>
            check &&
            check.checked
        );

      const feedback =
        $("#mission-feedback");

      if (!allDone) {
        if (feedback) {
          feedback.textContent =
            "Complete the three steps first, then finish the mission.";
        }

        return;
      }

      challengeState.missionCompleted =
        true;

      if (feedback) {
        feedback.textContent =
          "🌎 Mission complete. You turned a skill into a real action.";
      }

      const button =
        $("#mission-complete");

      if (button) {
        button.disabled = true;
        button.textContent =
          "Mission Complete ✓";
      }

      addProgress({
        xp: 15,
        completion: true,
        achievement:
          "real-life",
        message:
          "🌎 Real-life mission complete! +15 XP"
      });
    }

    function nextMission() {
      challengeState.missionIndex += 1;
      challengeState.missionCompleted =
        false;

      renderMission();
    }

    function updateWeekHeader() {
      const skill =
        currentSkill();

      const days =
        $$(".seven-day-card .day");

      days.forEach(
        (day) => {
          const label =
            day.querySelector(
              "span:last-child"
            ) || day;

          if (
            label &&
            !label.dataset.originalText
          ) {
            label.dataset.originalText =
              label.textContent.trim();
          }
        }
      );

      const mission =
        skill.week[
          (
            state.sevenDay
              .completedDays
              .length || 0
          ) %
            skill.week.length
        ];

      const title =
        $(".seven-day-card h3");

      const text =
        $(".seven-day-card p");

      if (title) {
        title.textContent =
          "Build One Skill for 7 Days";
      }

      if (text) {
        text.textContent =
          `Today's focus: ${mission}`;
      }
    }

    function startSevenDayChallenge() {
      state.sevenDay.started =
        true;

      if (
        !Array.isArray(
          state.sevenDay.completedDays
        )
      ) {
        state.sevenDay.completedDays =
          [];
      }

      const nextDay =
        getNextSevenDayIndex();

      if (
        !state.sevenDay
          .completedDays
          .includes(nextDay)
      ) {
        state.sevenDay.completedDays.push(
          nextDay
        );
      }

      state.sevenDay.completedDays =
        [
          ...new Set(
            state.sevenDay.completedDays
          )
        ].sort(
          (a, b) => a - b
        );

      saveState();
      updateProgressUI();

      const button =
        $(".seven-day-card button");

      if (button) {
        button.textContent =
          state.sevenDay.completedDays
            .length >= 7
            ? "7-Day Challenge Complete ✓"
            : `Complete Day ${nextDay} ✓`;
      }

      if (
        state.sevenDay.completedDays
          .length >= 7
      ) {
        addProgress({
          xp: 30,
          completion: true,
          achievement:
            "seven-day",
          message:
            "🏆 Seven-day challenge complete! +30 XP"
        });
      } else {
        addProgress({
          xp: 5,
          completion: true,
          message:
            `📅 Day ${nextDay} complete! +5 XP`
        });
      }

      updateWeekHeader();
    }

    function getNextSevenDayIndex() {
      for (
        let n = 1;
        n <= 7;
        n += 1
      ) {
        if (
          !state.sevenDay
            .completedDays
            .includes(n)
        ) {
          return n;
        }
      }

      return 7;
    }

    function saveReflections() {
      const noticed =
        $("#reflection-noticed");

      const next =
        $("#reflection-next");

      state.reflections.noticed =
        noticed
          ? noticed.value.trim()
          : "";

      state.reflections.next =
        next
          ? next.value.trim()
          : "";

      saveState();

      addProgress({
        xp: 5,
        completion: true,
        achievement:
          "reflective",
        message:
          "✍️ Reflection saved! +5 XP"
      });
    }

    function loadReflections() {
      const noticed =
        $("#reflection-noticed");

      const next =
        $("#reflection-next");

      if (noticed) {
        noticed.value =
          state.reflections.noticed ||
          "";
      }

      if (next) {
        next.value =
          state.reflections.next ||
          "";
      }
    }

    function continueCelebration() {
      const celebration =
        $("#practice-celebration");

      if (!celebration) {
        return;
      }

      celebration.setAttribute(
        "aria-hidden",
        "true"
      );

      celebration.classList.remove(
        "show",
        "is-visible"
      );
    }

    function celebrate(
      message,
      xp = 0,
      withModal = true
    ) {
      const celebration =
        $("#practice-celebration");

      if (
        !celebration ||
        !withModal
      ) {
        return;
      }

      const xpElement =
        $(".celebration-xp", celebration);

      const heading =
        $("h2, h3, .celebration-title", celebration);

      if (
        heading &&
        message
      ) {
        heading.textContent =
          message;
      }

      if (xpElement) {
        xpElement.textContent =
          xp
            ? `+${xp} XP`
            : "Keep going";
      }

      celebration.setAttribute(
        "aria-hidden",
        "false"
      );

      celebration.classList.add(
        "show",
        "is-visible"
      );

      spawnConfetti(
        celebration
      );

      window.setTimeout(() => {
        if (
          !$("#celebration-continue", celebration)
        ) {
          continueCelebration();
        }
      }, 1800);
    }

    function spawnConfetti(
      container
    ) {
      const wrapper =
        document.createElement(
          "div"
        );

      wrapper.className =
        "practice-confetti";

      wrapper.setAttribute(
        "aria-hidden",
        "true"
      );

      const symbols = [
        "✦",
        "✧",
        "★",
        "•",
        "✷",
        "◆"
      ];

      for (
        let i = 0;
        i < 18;
        i += 1
      ) {
        const piece =
          document.createElement(
            "span"
          );

        piece.textContent =
          symbols[
            i % symbols.length
          ];

        piece.style.left =
          `${10 + Math.random() * 80}%`;

        piece.style.top =
          `${10 + Math.random() * 35}%`;

        piece.style.animationDelay =
          `${Math.random() * 0.25}s`;

        piece.style.animationDuration =
          `${0.8 + Math.random() * 0.7}s`;

        wrapper.appendChild(
          piece
        );
      }

      container.appendChild(
        wrapper
      );

      window.setTimeout(
        () => wrapper.remove(),
        1800
      );
    }

    function addKeyboardFocusStyles() {
      document.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key !==
            "Escape"
          ) {
            return;
          }

          continueCelebration();
        }
      );
    }

    function applyPracticeVisualOverrides() {
      if (
        $("#practice-runtime-fixes")
      ) {
        return;
      }

      const style =
        document.createElement(
          "style"
        );

      style.id =
        "practice-runtime-fixes";

      style.textContent = `
        .practice-setting-card,
        .practice-setting-card.active,
        .practice-setting-card[aria-pressed="true"] {
          border: 2px solid #d8d0c5 !important;
          border-color: #d8d0c5 !important;
        }

        .practice-setting-card.active,
        .practice-setting-card[aria-pressed="true"] {
          box-shadow: 0 10px 24px rgba(23, 41, 67, 0.12) !important;
          transform: translateY(-4px) !important;
        }

        .practice-setting-card.active::after,
        .practice-setting-card[aria-pressed="true"]::after {
          content: none !important;
          display: none !important;
        }
      `;

      document.head.appendChild(
        style
      );
    }

    function bindSkillButtons() {
      $$(".practice-skill-card")
        .forEach((button) => {
          button.type =
            button.type ||
            "button";

          button.addEventListener(
            "click",
            () =>
              selectSkill(
                button.dataset.skill
              )
          );
        });
    }

    function bindTimeButtons() {
      $$(".practice-setting-card")
        .forEach((button) => {
          button.type =
            button.type ||
            "button";

          button.addEventListener(
            "click",
            () =>
              selectTime(
                button.dataset.time
              )
          );
        });
    }

    function bindMainChallenge() {
      $("#challenge-done")
        ?.addEventListener(
          "click",
          markChallengeDone
        );

      $("#change-challenge")
        ?.addEventListener(
          "click",
          changeChallenge
        );

      $("#hero-surprise-button")
        ?.addEventListener(
          "click",
          surpriseMe
        );

      const surprise =
        $("#surprise-button");

      if (surprise) {
        surprise.addEventListener(
          "click",
          surpriseMe
        );
      }
    }

    function bindMiniPractice() {
      $$(".mini-practice-start")
        .forEach((button) => {
          button.type =
            button.type ||
            "button";

          button.addEventListener(
            "click",
            () =>
              startMiniPractice(
                button.closest(
                  ".mini-practice-card"
                )?.dataset.skill
              )
          );
        });
    }

    function bindScenarios() {
      $$(".scenario-options button")
        .forEach((button) => {
          button.type =
            button.type ||
            "button";

          button.addEventListener(
            "click",
            () =>
              answerScenario(
                button
              )
          );
        });

      // Support a next button if
      // you later add one to practice.html.
      $("#scenario-next")
        ?.addEventListener(
          "click",
          nextScenario
        );
    }

    function bindSpotProblem() {
      $("#spot-problem-answer")
        ?.addEventListener(
          "click",
          revealSpotProblem
        );

      $("#spot-problem-next")
        ?.addEventListener(
          "click",
          nextSpotProblem
        );
    }

    function bindDecisionLab() {
      $("#decision-lab-button")
        ?.addEventListener(
          "click",
          revealDecisionLab
        );

      $("#decision-lab-next")
        ?.addEventListener(
          "click",
          nextDecisionLab
        );
    }

    function bindMission() {
      $("#mission-complete")
        ?.addEventListener(
          "click",
          completeMission
        );

      $("#mission-next")
        ?.addEventListener(
          "click",
          nextMission
        );
    }

    function bindSevenDay() {
      const button =
        $(".seven-day-card button");

      if (button) {
        button.type =
          button.type ||
          "button";

        button.addEventListener(
          "click",
          startSevenDayChallenge
        );
      }
    }

    function bindReflection() {
      const button =
        $(".reflection-section .button.button-primary");

      if (button) {
        button.addEventListener(
          "click",
          saveReflections
        );
      }
    }

    function bindCelebration() {
      $("#celebration-continue")
        ?.addEventListener(
          "click",
          continueCelebration
        );
    }

    function applyPracticeSelectionStyles() {
      // Keep skill cards visually active
      // without changing the time-card
      // border behavior.
      $$(".practice-skill-card")
        .forEach((card) => {
          const active =
            card.dataset.skill ===
            state.selectedSkill;

          card.classList.toggle(
            "active",
            active
          );

          card.setAttribute(
            "aria-pressed",
            String(active)
          );
        });
    }

    function init() {
      loadReflections();
      updateProgressUI();

      applyPracticeVisualOverrides();

      bindSkillButtons();
      bindTimeButtons();
      bindMainChallenge();
      bindMiniPractice();
      bindScenarios();
      bindSpotProblem();
      bindDecisionLab();
      bindMission();
      bindSevenDay();
      bindReflection();
      bindCelebration();
      addKeyboardFocusStyles();
      applyPracticeSelectionStyles();

      selectSkill(
        state.selectedSkill,
        false
      );

      selectTime(
        state.selectedTime
      );

      renderTodaysChallenge();
      renderMiniPractice();
      renderScenario();
      renderSpotProblem();
      renderDecisionLab();
      renderMission();
      updateWeekHeader();
      updateProgressUI();
    }

    init();
  });
})();