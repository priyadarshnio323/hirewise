"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  PROCESSING = "PROCESSING",
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  type: "generate" | "interview" | "interview-live";
  questions?: string[];
  role?: string;
  level?: string;
  techstack?: string[];
  interviewMode : "technical"| "behavioural" | "mixed";
}

const Agent = ({
  userName,
  userId,
  interviewId,
  type,
  questions = [],
  role,
  level,
  techstack = [],
  interviewMode = "technical"
}: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [setupStage, setSetupStage] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // ✅ ALL refs — fixes every stale closure problem
  const callStatusRef = useRef<CallStatus>(CallStatus.INACTIVE);
  const setupStageRef = useRef(0);
  const collectedRoleRef = useRef("");
  const collectedTechRef = useRef<string[]>([]);
  const isSetupComplete = useRef(false);
  const isProcessingRef = useRef(false);
  const indexRef = useRef(0);
  const startTimeRef = useRef<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const collectedTypeRef = useRef("technical");
  const isListeningRef = useRef(false);
  const conversationCountRef = useRef(0);


  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
      initSpeechRecognition();
    }
    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const initSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported. Please use Chrome.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => {
  isListeningRef.current = false;  // ✅
  setIsListening(false);
  const transcript = event.results[0][0].transcript;
  console.log("🎤 You said:", transcript);
  handleUserSpeech(transcript);
};

recognitionRef.current.onerror = () => {
  isListeningRef.current = false;  // ✅
  setIsListening(false);
};

recognitionRef.current.onend = () => {
  isListeningRef.current = false;  // ✅
  setIsListening(false);
};
  };

  const updateCallStatus = (status: CallStatus) => {
    callStatusRef.current = status;
    setCallStatus(status);
  };

  const startListening = () => {
  if (isListeningRef.current) return; //  always fresh
  if (isSetupComplete.current) return;
  if (isProcessingRef.current) return;
  if (!recognitionRef.current) return;
  
  try {
    isListeningRef.current = true;  // set before start
    recognitionRef.current.start();
    setIsListening(true);
    console.log("🎤 Started listening...");
  } catch (error) {
    isListeningRef.current = false; //  reset on error
    console.error("Failed to start listening:", error);
  }
};

  const stopListening = () => {
  isListeningRef.current = false;  //  reset ref
  setIsListening(false);
  if (recognitionRef.current) {
    try { recognitionRef.current.stop(); } catch (e) {}
  }
};

  const speakText = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!synthesisRef.current || !text?.trim()) {
      resolve();
      return;
    }

    // stop any previous speech and listening
    synthesisRef.current.cancel();
    stopListening();

    const cleanedText = text
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      console.log("🔊 AI speaking:", cleanedText);
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);

      if (
        callStatusRef.current === CallStatus.ACTIVE &&
        !isProcessingRef.current &&
        type !== "generate" &&
        !isSetupComplete.current
      ) {
        setTimeout(() => startListening(), 500);
      }

      resolve();
    };

    utterance.onerror = (event: any) => {
  console.warn("Speech synthesis warning:", event?.error || event);
  setIsSpeaking(false);
  resolve();
};
    synthesisRef.current.speak(utterance);
  });
};

  const handleSetupMode = async (transcript: string) => {
    console.log("🔧 SETUP MODE - Stage:", setupStageRef.current);

    if (setupStageRef.current > 3) return; //  block re-entry

    switch (setupStageRef.current) {
      case 0:
        setupStageRef.current = 1; //ref first
        setSetupStage(1);
        collectedRoleRef.current = transcript; // store in ref
        const roleMsg = `Great! You're applying for ${transcript}. What technologies do you work with? For example React, Python, Node.js`;
        setMessages(prev => [...prev, { role: "assistant" as const, content: roleMsg }]);
        await speakText(roleMsg);
        break;

      case 1:
        setupStageRef.current = 2;
        setSetupStage(2);
        const techs = transcript.split(/[ ,]+/).filter((t: string) => t.length > 0);
        collectedTechRef.current = techs;
        const techMsg = `Got it: ${techs.join(", ")}. What type of interview do you want? Technical, Behavioural, or Mixed?`;
        setMessages(prev => [...prev, { role: "assistant" as const, content: techMsg }]);
        await speakText(techMsg);
        break;

      case 2:
  setupStageRef.current = 3;
  setSetupStage(3);
  const interviewType = transcript.toLowerCase().includes("behav") ? "behavioural"
    : transcript.toLowerCase().includes("mix") ? "mixed"
    : "technical";
  collectedTypeRef.current = interviewType;
  const typeMsg = `Got it, ${interviewType} interview. What is your experience level? Junior, Mid, or Senior?`;
  setMessages(prev => [...prev, { role: "assistant" as const, content: typeMsg }]);
  await speakText(typeMsg);
  break;

      case 3:
  isSetupComplete.current = true;  //  absolute first line
  stopListening();                  // absolute second line
  if (synthesisRef.current) synthesisRef.current.cancel(); //  stop any speech
  setupStageRef.current = 4;
  setSetupStage(4);

  const lvl = transcript.toLowerCase().includes("senior") ? "Senior"
    : transcript.toLowerCase().includes("mid") ? "Mid"
    : "Junior";

  const setupMsg = `Perfect! Creating your ${lvl} ${collectedRoleRef.current} interview now...`;
  setMessages(prev => [...prev, { role: "assistant" as const, content: setupMsg }]);
  speakText(setupMsg);

        console.log("🚀 SENDING TO API");
        try {
          const response = await fetch("/api/interview/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: collectedRoleRef.current,       //  from ref
              techstack: collectedTechRef.current,  //  from ref
              level: lvl,
              type: collectedTypeRef.current,
              userId: userId || "anonymous",
            }),
          });

          const data = await response.json();
          console.log("📥 API RESPONSE:", data);

          if (data.success && data.interviewId) {
            console.log("Interview ID:", data.interviewId);
            const successMsg = "Interview created! Redirecting now...";
            setMessages(prev => [...prev, { role: "assistant" as const, content: successMsg }]);
            await speakText(successMsg);
            setTimeout(() => router.push(`/interview/${data.interviewId}`), 1500);
          } else {
            throw new Error(data.error || "Unknown error");
          }
        } catch (error) {
          console.error("❌ Error:", error);
          const errorMsg = "Sorry, there was an error. Please try again.";
          setMessages(prev => [...prev, { role: "assistant" as const, content: errorMsg }]);
          await speakText(errorMsg);
          // ✅ reset so user can retry
          isSetupComplete.current = false;
          setupStageRef.current = 0;
          setSetupStage(0);
        }
        break;

      default:
        break;
    }
  };

  const handleLiveInterview = async (transcript: string) => {
    const updatedMessages = [
  ...messages,
  { role: "user" as const, content: transcript }
];

setMessages(updatedMessages);
 

  try {
    // ✅ check time BEFORE calling Gemini
    const elapsed = startTimeRef.current
      ? (new Date().getTime() - startTimeRef.current.getTime()) / 60000
      : 0;

      if (elapsed >= 3 || conversationCountRef.current >= 2) {
    const endMsg = "That wraps up our interview! Generating your feedback now...";
    setMessages(prev => [...prev, { role: "assistant" as const, content: endMsg }]);
    await speakText(endMsg);

    // ✅ save feedback before redirecting
    try {
      await fetch("/api/feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          userId,
          transcript: updatedMessages,  // ✅ full conversation
        }),
      });
    } catch (e) {
      console.error("Feedback error:", e);
    }

    setTimeout(() => updateCallStatus(CallStatus.FINISHED), 2000);
    return;
  }


    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: transcript,
        type: "interview-live",
        interviewMode,
        role: role || "Developer",
        level: level || "Mid",
        techstack: techstack || ["general"],
        messageHistory: messages.slice(-8),
      }),
    });

    const data = await response.json();
    console.log("🤖 Gemini reply:", data);

    if (data.success && data.reply) {
      setMessages(prev => [...prev, { role: "assistant" as const, content: data.reply }]);
      await speakText(data.reply);
conversationCountRef.current += 1;
setConversationCount(conversationCountRef.current);
      // ✅ auto listen after AI speaks
      if (
        callStatusRef.current === CallStatus.ACTIVE &&
        !isSetupComplete.current
      ) {
        setTimeout(() => {
          isProcessingRef.current = false;
          setIsProcessing(false);
          startListening();
        }, 500);
        return; // ✅ return early so finally doesn't reset processing before startListening
      }
    }
  } catch (error) {
    console.error("Error in live interview:", error);
    const errorMsg = "I apologize, could you please repeat that?";
    setMessages(prev => [...prev, { role: "assistant" as const, content: errorMsg }]);
    await speakText(errorMsg);
  } finally {
    isProcessingRef.current = false;
    setIsProcessing(false);
  }
};

  const handleTraditionalInterview = async (transcript: string) => {
    setMessages(prev => [...prev, { role: "user" as const, content: transcript }]);
    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      if (indexRef.current >= questions.length - 1) {
        const endMsg = "Thank you for completing the interview!";
        setMessages(prev => [...prev, { role: "assistant" as const, content: endMsg }]);
        await speakText(endMsg);
        setTimeout(() => updateCallStatus(CallStatus.FINISHED), 2000);
      } else {
        const nextIndex = indexRef.current + 1;
        indexRef.current = nextIndex;
        setCurrentQuestionIndex(nextIndex);
        const nextQuestion = questions[nextIndex];
        setMessages(prev => [...prev, { role: "assistant" as const, content: nextQuestion }]);
        await speakText(nextQuestion);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const handleUserSpeech = async (transcript: string) => {
    if (type === "generate") await handleSetupMode(transcript);
    else if (type === "interview-live") await handleLiveInterview(transcript);
    else await handleTraditionalInterview(transcript);
  };

  const startInterview = async () => {
    updateCallStatus(CallStatus.CONNECTING);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Please allow microphone access to continue.");
      updateCallStatus(CallStatus.INACTIVE);
      return;
    }

    let initialMessage = "";

    if (type === "generate") {
      initialMessage = `Hello ${userName}! I will help you set up a custom interview. What role are you applying for?`;
      setupStageRef.current = 0;
      setSetupStage(0);
      isSetupComplete.current = false;
    } else if (type === "interview-live") {
      initialMessage = `Welcome to your ${level || ""} ${role || "Developer"} interview. I will ask you a few technical questions. Let's begin!`;
      startTimeRef.current = new Date(); // ✅ timer starts here
      setConversationCount(0);           // ✅ reset count
    }else {
      initialMessage = questions.length > 0 ? questions[0] : "No questions available.";
      setCurrentQuestionIndex(0);
      indexRef.current = 0;
    }

    setMessages([{ role: "assistant", content: initialMessage }]);
    updateCallStatus(CallStatus.ACTIVE);

    setTimeout(async () => {
      await speakText(initialMessage);

      // ✅ auto-fetch and ask first question for live interview
      if (type === "interview-live") {
        isProcessingRef.current = true;
        setIsProcessing(true);
        try {
          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
  message: "FIRST_QUESTION", // ✅
  type: "interview-live",
  interviewMode,
  role: role || "Developer",
  level: level || "Mid",
  techstack: techstack || ["general"],
  messageHistory: [],
}),
          });
          const data = await response.json();
          if (data.reply) {
            setMessages(prev => [...prev, { role: "assistant" as const, content: data.reply }]);
            await speakText(data.reply);
          }
        } catch (e) {
          console.error("Error fetching first question:", e);
        } finally {
          isProcessingRef.current = false;
          setIsProcessing(false);
        }
      }
    }, 100);
  };

const endInterview = async () => {
  stopListening();
  if (synthesisRef.current) synthesisRef.current.cancel();

  try {
    console.log("📤 Sending transcript:", messages);

    await fetch("/api/feedback/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interviewId,
        userId,
        transcript: messages, // ✅ THIS IS THE FIX
      }),
    });
  } catch (error) {
    console.error("❌ Feedback error:", error);
  }

  updateCallStatus(CallStatus.FINISHED);
};

  useEffect(() => {
    if (messages.length > 0) setLastMessage(messages[messages.length - 1].content);
  }, [messages]);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) router.push("/");
  }, [callStatus, router]);

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.png" alt="profile-image" width={65} height={54} className="object-cover" />
            {(isSpeaking || isListening || isProcessing) && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
          <div className="status-indicator mt-2">
            {isProcessing ? <p className="text-yellow-500">🤔 Thinking...</p>
              : isSpeaking ? <p className="text-green-500">🔊 Speaking...</p>
              : isListening ? <p className="text-blue-500">🎤 Listening...</p>
              : callStatus === CallStatus.ACTIVE ? <p className="text-purple-500">Ready</p>
              : <p className="text-gray-500">Not started</p>}
          </div>
          {type === "generate" && callStatus === CallStatus.ACTIVE && setupStage < 4 && (
            <p className="text-sm mt-2">Step {setupStage + 1} of 4</p>
          )}
          {type === "interview-live" && callStatus === CallStatus.ACTIVE && (
            <p className="text-sm mt-2">Live Interview • {conversationCount} exchanges</p>
          )}
          {type === "interview" && questions.length > 0 && (
            <p className="text-sm mt-2">Question {currentQuestionIndex + 1} of {questions.length}</p>
          )}
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image src="/user-avatar.png" alt="profile-image" width={120} height={120} className="rounded-full object-cover size-[120px]" />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
<div className="transcript-border mt-6 mb-4">
  <div className="transcript">
    {messages.filter(m => m.role === "assistant").slice(-1).map((msg, i) => (
      <p key={i} className="text-lg font-medium text-center leading-relaxed">
        {msg.content}
      </p>
    ))}
  </div>
</div>

)}

      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex justify-center gap-4">
          {callStatus !== "ACTIVE" ? (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg" onClick={startInterview}>
              {type === "generate" ? "Start Setup" : "Start Interview"}
            </button>
          ) : (
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg" onClick={endInterview}>
              End
            </button>
          )}
        </div>
        {callStatus === CallStatus.ACTIVE && (
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
            onClick={startListening}
            disabled={isListening || isSpeaking || isProcessing}
          >
            {isListening ? "Listening..." : "🎤 Speak"}
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;