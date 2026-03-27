import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Mic, MicOff, BookOpen, LayoutDashboard } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useDashboardContext } from "@/hooks/useDashboardContext";
import { AIDashboardRenderer } from "@/components/AIDashboardRenderer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cyber-chat`;

async function streamChat({
  messages, dashboardContext, onDelta, onDone, onError,
}: {
  messages: Message[]; dashboardContext: any;
  onDelta: (text: string) => void; onDone: () => void; onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, dashboardContext }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    onError(err.error || "Request failed");
    return;
  }
  if (!resp.body) { onError("No response stream"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

/** Parse message content for embedded dashboard JSON blocks */
function renderMessageContent(content: string) {
  const dashboardRegex = /```cybernexus-dashboard\n([\s\S]*?)```/g;
  const parts: { type: "text" | "dashboard"; content: string }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = dashboardRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "dashboard", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  }

  return (
    <>
      {parts.map((part, i) =>
        part.type === "dashboard" ? (
          <AIDashboardRenderer key={i} jsonStr={part.content} />
        ) : (
          <ReactMarkdown key={i}>{part.content}</ReactMarkdown>
        )
      )}
    </>
  );
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "**CyberNexus AI** online.\n\nI can analyze threats, explain dashboard data, and **generate custom dashboards** based on your needs.\n\n💡 Try: *\"Generate a ransomware dashboard\"* or *\"Create a report on critical threats\"*" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const dashboardContext = useDashboardContext();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleVoice = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  const handleStorytelling = () => {
    const prompt = "Give me a storytelling summary of today's cybersecurity status. Cover total threats, top attack origins, trending attack types, severity distribution, and overall risk assessment.";
    setInput(prompt);
    setTimeout(() => handleSend(prompt), 100);
  };

  const handleGenerateDashboard = () => {
    const prompt = "Generate a comprehensive threat intelligence dashboard showing severity breakdown, top attack types, geographic distribution, and key recommendations.";
    setInput(prompt);
    setTimeout(() => handleSend(prompt), 100);
  };

  const handleSend = async (override?: string) => {
    const text = override || input.trim();
    if (!text || isLoading) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMessages.length + 1) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      dashboardContext,
      onDelta: upsertAssistant,
      onDone: () => setIsLoading(false),
      onError: (msg) => {
        setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Error: ${msg}` }]);
        setIsLoading(false);
      },
    });
  };

  const quickQuestions = [
    "Which country has highest attacks?",
    "How many critical alerts?",
    "What is trending threat type?",
    "Generate a ransomware dashboard",
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground">AI Assistant</h2>
          <p className="text-xs font-mono text-muted-foreground">Context-aware analyst — generates dashboards on demand</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerateDashboard} disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-colors disabled:opacity-50">
            <LayoutDashboard className="w-4 h-4" /> Generate Dashboard
          </button>
          <button onClick={handleStorytelling} disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-colors disabled:opacity-50">
            <BookOpen className="w-4 h-4" /> Explain Dashboard
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {quickQuestions.map(q => (
          <button key={q} onClick={() => { setInput(q); setTimeout(() => handleSend(q), 50); }}
            disabled={isLoading}
            className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-black border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>

      <div className="flex-1 glass-panel-solid rounded-xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-mono text-muted-foreground">
            &gt; CYBERNEXUS_AI <span className="text-white">v4.0 — DASHBOARD GENERATOR</span>
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "bg-primary/10 border border-primary/30" : "bg-black border border-border"
              }`}>
                {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5 text-foreground" />}
              </div>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "assistant" ? "bg-secondary/50 border border-border" : "bg-primary/10 border border-primary/20"
              }`}>
                <div className="font-mono text-xs text-foreground leading-relaxed prose prose-invert prose-xs max-w-none">
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-secondary/50 border border-border rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-border">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <button type="button" onClick={toggleVoice}
              className={`p-2.5 rounded-lg border transition-all ${
                isListening ? "bg-threat-high/20 border-threat-high/30 text-threat-high animate-pulse" : "bg-black border-border text-muted-foreground hover:text-foreground"
              }`}>
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
              placeholder={isListening ? "Listening..." : "Ask anything or 'Generate a dashboard for...'"}
            />
            <button type="submit" disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground p-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
