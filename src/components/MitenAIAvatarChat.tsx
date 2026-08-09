import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, BookOpen, ShieldCheck, Cpu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: "architecture" | "capital" | "books" | "advisory";
}

const QUICK_QUESTIONS = [
  "Tell me about OrchestrAI OS architecture",
  "How did you scale $760M+ in capital formation?",
  "What is your book 'Trust in Agentic AI' about?",
  "How do you advise PE/VC firms on AI governance?",
];

const KNOWLEDGE_BASE: Record<string, string> = {
  orchestrai: `OrchestrAI OS is a federated, sovereign Enterprise AI Operating System designed for Zero-Trust security and regulatory compliance (DORA Art. 28, NIST, GDPR). 

Key Architecture Highlights (Verified SSOT in K8s Postgres):
• 5-Tier Master Architecture & 237 Verified OS Layers
• FastMCP Gateway & Mycelial NATS Event Kernel
• Local k3d Kubernetes Cluster with OPA Gatekeeper & Tetragon eBPF Kernel
• 174 Multi-Agent Swarms with 99.999% SLA FDIR Watchdog
• Master Canonical Ledger (MCL) trajectory recovery

It eliminates the "AI Silo Crisis" by giving enterprises complete ownership over their AI weights, execution pipelines, and data exfiltration defenses.`,

  capital: `Over my 30+ year career as a Chief AI Officer and GTM Executive:
• Raised $760M+ in capital from institutional VCs, PE funds, and sovereign wealth funds.
• Led 3 successful IPOs valued at $1B+ each.
• Executed 10+ M&A exits with transaction values reaching up to $1.2B.
• Built 4 tech ventures from inception to exit (eComLive acquired by Infospace, MoConDi by MobileMedia, Spinta, KloudData).`,

  book: `My latest 2026 book, "Trust in the Age of Agentic AI Economy", is co-authored with Nisharg Nargund and Prof. Suresh Chandra Satapathy.

It serves as a 24-chapter executive blueprint covering:
1. The Digital Trust Stack & Zero-Trust Agent Frameworks
2. Industry Language Models (ILMs) for Healthcare, Fintech & Supply Chain
3. A 90-Day Enterprise AI Implementation Roadmap

My previous book, "Rama in the Startup Exile" (published by Notion Press / Amazon), covers navigating startup adversity, resilience, and growth.`,

  advisory: `As an Operating Partner and AI Board Advisor for PE/VC firms:
• I evaluate portfolio AI readiness, data moats, and automation scalability.
• I guide C-Suite leaders on replacing fragile copilots with auditable multi-agent workflows (3M+ autonomous decisions/mo).
• I establish regulatory guardrails (EU AI Act, DORA Art. 28) to protect enterprise valuations prior to liquidity events.`,

  kiit: `As an Honorary Professor at KIIT University (Kalinga Institute of Industrial Technology), I focus on bridging bleeding-edge AI research with industrial enterprise execution, mentoring next-generation AI engineers and startup founders.`,

  default: `I am Miten Mehta's Interactive AI Assistant (powered by the OrchestrAI OS knowledge engine). 

I can answer questions about:
1. **Sovereign AI Architecture & OrchestrAI OS**
2. **Capital Formation ($760M+ raised, 3 IPOs, $2B+ Exits)**
3. **Published Books & Thought Leadership**
4. **Board Advisory & PE/VC Portfolio Strategy**

Feel free to pick one of the quick topics below or type your question!`
};

export const MitenAIAvatarChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am Miten Mehta's AI Knowledge Avatar. How can I assist you today regarding enterprise AI architecture, capital markets, or board advisory?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = KNOWLEDGE_BASE.default;
      const lower = textToSend.toLowerCase();

      if (lower.includes("orchestrai") || lower.includes("architecture") || lower.includes("os") || lower.includes("tech")) {
        reply = KNOWLEDGE_BASE.orchestrai;
      } else if (lower.includes("capital") || lower.includes("760m") || lower.includes("ipo") || lower.includes("exit") || lower.includes("fund")) {
        reply = KNOWLEDGE_BASE.capital;
      } else if (lower.includes("book") || lower.includes("trust") || lower.includes("rama") || lower.includes("publish")) {
        reply = KNOWLEDGE_BASE.book;
      } else if (lower.includes("board") || lower.includes("advisory") || lower.includes("pe") || lower.includes("vc") || lower.includes("pe/vc")) {
        reply = KNOWLEDGE_BASE.advisory;
      } else if (lower.includes("kiit") || lower.includes("professor") || lower.includes("academic")) {
        reply = KNOWLEDGE_BASE.kiit;
      }

      const aiMsg: Message = {
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 px-5 rounded-full bg-gradient-to-r from-accent to-primary text-primary-foreground shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 border border-primary-foreground/20 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-accent-foreground group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-foreground/80">Interactive AI</div>
            <div className="text-sm font-extrabold text-accent-foreground">Ask Miten AI</div>
          </div>
        </Button>
      )}

      {/* Chat Dialog Window */}
      {isOpen && (
        <Card className="w-[92vw] sm:w-[420px] h-[580px] flex flex-col shadow-2xl border-primary/20 bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary to-accent/90 text-primary-foreground flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/15 rounded-xl border border-primary-foreground/20">
                <Bot className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  Miten Mehta AI Avatar <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </h3>
                <p className="text-xs opacity-90">OrchestrAI OS Knowledge Core • Live</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Topics Pills */}
          <div className="px-3 py-2 bg-muted/60 border-b border-border flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend("Tell me about OrchestrAI OS architecture")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-background hover:bg-accent hover:text-accent-foreground border border-border whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Cpu className="w-3 h-3 text-accent" /> OrchestrAI OS
            </button>
            <button
              onClick={() => handleSend("How did you scale $760M+ in capital formation?")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-background hover:bg-accent hover:text-accent-foreground border border-border whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Rocket className="w-3 h-3 text-emerald-500" /> $760M+ Capital
            </button>
            <button
              onClick={() => handleSend("What is your book 'Trust in Agentic AI' about?")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-background hover:bg-accent hover:text-accent-foreground border border-border whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-blue-500" /> Published Books
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent text-accent-foreground rounded-tr-none font-medium shadow-sm"
                      : "bg-muted/80 text-foreground border border-border rounded-tl-none whitespace-pre-line shadow-sm"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[9px] mt-1.5 opacity-70 text-right ${
                      msg.sender === "user" ? "text-accent-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-muted-foreground">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="flex gap-1 items-center bg-muted px-3 py-2 rounded-xl border border-border">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions if early messages */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">Suggested Questions:</div>
              <div className="space-y-1">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="w-full text-left text-xs py-1 px-2.5 rounded-md hover:bg-accent/10 hover:text-accent font-medium text-foreground/80 flex items-center justify-between transition-colors"
                  >
                    <span className="truncate">{q}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-background flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my career, AI OS, or books..."
              className="flex-1 bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl flex-shrink-0"
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};
