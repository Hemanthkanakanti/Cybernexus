import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useDashboardContext } from "@/hooks/useDashboardContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cyber-chat`;

async function streamChat({
  messages,
  dashboardContext,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  dashboardContext: any;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
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

  if (!resp.body) {
    onError("No response stream");
    return;
  }

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
      if (jsonStr === "[DONE]") {
        onDone();
        return;
      }
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

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "**CyberShield AI** online.\n\nI have access to the live threat map and data panel. Ask me anything about current threats, attack analysis, or cybersecurity best practices.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dashboardContext = useDashboardContext();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMessages.length + 1) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      dashboardContext,
      onDelta: upsertAssistant,
      onDone: () => setIsLoading(false),
      onError: (msg) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ Error: ${msg}` },
        ]);
        setIsLoading(false);
      },
    });
  };

  return (
    <div
      className="bg-card border border-border rounded-lg flex flex-col"
      style={{ height: "calc(100vh - 160px)" }}
    >
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Bot className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-mono text-muted-foreground">
          &gt; AI_THREAT_ANALYST{" "}
          <span className="text-accent">v3.0 — LIVE DATA</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant"
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-secondary border border-border"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5 text-primary" />
              ) : (
                <User className="w-3.5 h-3.5 text-foreground" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "assistant"
                  ? "bg-secondary/50 border border-border"
                  : "bg-primary/10 border border-primary/20"
              }`}
            >
              <div className="font-mono text-xs text-foreground leading-relaxed prose prose-invert prose-xs max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
            placeholder="Ask about threats, data, or analysis..."
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatbot;
