import React, { useState } from "react";
import {
  Folder,
  FileText,
  Code,
  Layers,
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  Cpu,
  BookOpen,
  Briefcase,
  Globe,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Terminal,
  Activity,
  Award,
  DollarSign,
  Maximize2,
  X,
  Linkedin,
  Mail,
  Phone,
  PlayCircle,
  FileCode,
  Sliders,
  Share2,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import mitenPhoto from "@/assets/miten-mehta-photo.jpeg";

interface MitenAIWorkspaceIDEProps {
  mode: "aria" | "orion";
  setMode: (m: "aria" | "orion") => void;
}

interface Artifact {
  id: string;
  title: string;
  type: "markdown" | "code" | "architecture" | "book" | "linkedin";
  content: React.ReactNode;
}

export const MitenAIWorkspaceIDE: React.FC<MitenAIWorkspaceIDEProps> = ({ mode, setMode }) => {
  // Navigation & Workspace State: "chat" | "orchestrai" | "fastmcp" | "books" | "linkedin" | "events" | "about"
  const [activeView, setActiveView] = useState<string>("chat");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [artifactOpen, setArtifactOpen] = useState<boolean>(true);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  // Active Artifact on Right Panel (Claude Artifact style)
  const [activeArtifact, setActiveArtifact] = useState<Artifact>({
    id: "orchestrai_spec",
    title: "OrchestrAI OS 5-Tier Architecture Spec",
    type: "architecture",
    content: (
      <div className="space-y-4 text-xs font-mono">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-emerald-400 font-bold flex items-center justify-between">
          <span>STATUS: 99.999% SLA ACTIVE</span>
          <span className="text-zinc-500">SSOT: 237 OS LAYERS</span>
        </div>
        <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 leading-relaxed overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 ORCHESTRAI OS 5-TIER MASTER ARCHITECTURE (237 LAYERS)       │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 5: GOVERNANCE & FORMAL VERIFICATION (Lean-4, OPA, DORA, NIST AI RMF)   │
│ TIER 4: MULTI-AGENT SWARMS (ACE Protocols, 174 Active Autonomous Swarms)    │
│ TIER 3: SOVEREIGN EVENT KERNEL (FastMCP Gateway, Mycelial NATS Bus)        │
│ TIER 2: CONTINUOUS LEARNING LOOP (Mem0 MAG, CVO Database, Postgres SSOT)   │
│ TIER 1: EBPF IMMUNE KERNEL (Tetragon, OPA Gatekeeper, k3d Kubernetes)       │
└─────────────────────────────────────────────────────────────────────────────┘`}
        </pre>
        <div className="space-y-2 text-zinc-400 font-sans">
          <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">Subsystem Verification</h4>
          <ul className="space-y-1 list-disc pl-4 text-xs">
            <li>PostgreSQL pod: <span className="text-emerald-400 font-bold">orchestrai-postgres</span> (237 OS Layers verified)</li>
            <li>Event Bus: <span className="text-cyan-400 font-bold">Mycelial NATS JetStream</span> (Zero Secret Leakage LAW-50)</li>
            <li>Memory Engine: <span className="text-purple-400 font-bold">Mem0 MAG (Memory-Augmented Generation)</span></li>
          </ul>
        </div>
      </div>
    )
  });

  // Main Chat Stream State
  const [messages, setMessages] = useState<Array<{ sender: "user" | "miten"; text: string; mode: string; timestamp: string }>>([
    {
      sender: "miten",
      text: "Welcome to Miten Mehta's Sovereign AI Workspace. I am directly synchronized with the OrchestrAI OS Master Canonical Ledger (237 OS Layers verified). Ask me anything about Sovereign Multi-Agent Architecture, $760M+ Capital Formation, published books, or PE/VC Advisory.",
      mode: "aria",
      timestamp: "Just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Handle Chat Queries
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: "user", text: userText, mode, timestamp: timeStr }]);
    setInputMessage("");

    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();

      if (lower.includes("architecture") || lower.includes("layer") || lower.includes("os") || lower.includes("orchestrai")) {
        reply = "OrchestrAI OS is a federated, sovereign Enterprise AI Operating System architected with 237 verified OS Layers running on a local k3d Kubernetes cluster. It features FastMCP gateways, Mem0 Memory-Augmented Generation (MAG), and NASA FDIR Watchdogs guaranteeing 99.999% SLA availability.";
        setActiveView("orchestrai");
        setActiveArtifact({
          id: "os_arch_live",
          title: "OrchestrAI OS 5-Tier Architecture Canvas",
          type: "architecture",
          content: (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-cyan-400 font-bold">
                Live Subsystem Inspect: 237 OS Layers Verified
              </div>
              <div className="space-y-2">
                <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded text-amber-400 font-bold">
                  Layer 5: Formal Verification (Lean-4 / OPA Gatekeeper)
                </div>
                <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded text-cyan-400 font-bold">
                  Layer 4: Multi-Agent Swarms (174 Swarms / 3M+ Dec/Mo)
                </div>
                <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded text-purple-400 font-bold">
                  Layer 3: Mycelial NATS Bus & FastMCP Gateways
                </div>
                <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded text-emerald-400 font-bold">
                  Layer 2: Mem0 MAG (Memory-Augmented Generation)
                </div>
                <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded text-slate-400 font-bold">
                  Layer 1: k3d Kubernetes & eBPF Tetragon Kernel
                </div>
              </div>
            </div>
          )
        });
        setArtifactOpen(true);

      } else if (lower.includes("capital") || lower.includes("raised") || lower.includes("ipo") || lower.includes("funding")) {
        reply = "Throughout my executive career, I have raised $760M+ in institutional capital, led 3 landmark IPOs ($1B+ valuations for MCX, IEX, and Mondee NASDAQ), and executed $2B+ in cumulative M&A exits.";
        setActiveView("about");
        setActiveArtifact({
          id: "capital_ledger",
          title: "Capital Formation & M&A Track Record",
          type: "markdown",
          content: (
            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-400 font-mono font-bold">
                $760M+ INSTITUTIONAL CAPITAL RAISED
              </div>
              <ul className="space-y-2 text-zinc-300 list-disc pl-4">
                <li><strong>Mondee (NASDAQ: MOND):</strong> Chief AI Officer & GTM Growth Leader, scaling platform GMV to ~$3B across 65k+ partners.</li>
                <li><strong>MCX IPO ($1.2B Valuation):</strong> Head of Greenfield M&A & Capital Formation.</li>
                <li><strong>IEX IPO (~$1B Valuation):</strong> International capital expansion & regulatory structuring.</li>
                <li><strong>SMX Exit to ICE ($150M):</strong> Strategic exchange acquisition.</li>
                <li><strong>MoConDi & eComLive:</strong> Co-Founder exits acquired for $100M and $250M.</li>
              </ul>
            </div>
          )
        });
        setArtifactOpen(true);

      } else if (lower.includes("book") || lower.includes("author") || lower.includes("publication")) {
        reply = "I have authored 3 books: 'Trust in the Age of Agentic AI Economy' (2026, 24 chapters), 'Product Management in the Agentic AI Era', and 'Rama in the Startup Exile' (Notion Press / Amazon).";
        setActiveView("books");
        setActiveArtifact({
          id: "books_artifact",
          title: "Published Executive Books & Research",
          type: "book",
          content: (
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-lg text-purple-300 font-mono font-bold">
                TRUST IN THE AGE OF AGENTIC AI ECONOMY (2026)
              </div>
              <p className="text-zinc-300 leading-relaxed">
                Co-authored with industry leaders. 24 Chapters covering Digital Trust Stack, Industry Language Models, and a 90-day enterprise implementation roadmap.
              </p>
            </div>
          )
        });
        setArtifactOpen(true);

      } else {
        reply = mode === "aria"
          ? `[Aria Executive Lens]: Focusing on P&L growth, $15M+ ARR scaling at Tabhi, $107M+ hyperscaler co-sell at Fractal Analytics, and board-level AI governance. How can I assist your executive team or board mandate?`
          : `[Orion Technical Lens]: Deep-tech focus on Sovereign Multi-Agent Systems, FastMCP gateways, Lean-4 formal verification, and 237 OS Layers operating at 3M+ decisions/month. What technical subsystem shall we inspect?`;
      }

      setMessages(prev => [...prev, { sender: "miten", text: reply, mode, timestamp: timeStr }]);
    }, 400);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden select-none">
      
      {/* 1. AGY MONOCHROME HEADER BAR */}
      <header className="h-13 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView("chat")}
            className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-90 transition"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-100 font-semibold">Miten Mehta</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
              AI STUDIO v3.0
            </span>
          </button>
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-zinc-400 border-l border-zinc-800 pl-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3" /> EWAYA OS FEEDBACK KERNEL ACTIVE
            </span>
          </div>
        </div>

        {/* Dual-Mode Persona Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setMode("aria")}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                mode === "aria"
                  ? "bg-zinc-100 text-zinc-950 font-black shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              👔 Aria (Executive Lens)
            </button>
            <button
              onClick={() => setMode("orion")}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                mode === "orion"
                  ? "bg-zinc-700 text-white font-black shadow"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              ⚡ Orion (Co-Work / Tech)
            </button>
          </div>

          <a
            href="/caio-executive-playbook.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 text-xs font-mono bg-cyan-950 hover:bg-cyan-900 text-cyan-200 font-bold rounded transition flex items-center gap-1.5 border border-cyan-800"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Playbook (PDF)
          </a>
          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-3 py-1 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-200 font-bold transition flex items-center gap-1.5 border border-zinc-700"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" /> About Miten
          </button>
        </div>
      </header>

      {/* 2. TRI-PANE WORKSPACE BODY */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT SIDEBAR: EXPLORER & PROJECTS */}
        <aside className={`${sidebarOpen ? "w-64" : "w-12"} bg-zinc-900/95 border-r border-zinc-800 transition-all duration-200 flex flex-col shrink-0`}>
          <div className="p-2.5 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            {sidebarOpen && <span>WORKSPACE EXPLORER</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-zinc-800 rounded text-zinc-400">
              <Folder className="w-3.5 h-3.5" />
            </button>
          </div>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-2 text-xs font-mono space-y-3">
              
              {/* MAIN NAVIGATION ITEMS */}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveView("chat")}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition ${
                    activeView === "chat" ? "bg-zinc-800 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Workspace Chat</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView("about");
                    setActiveArtifact({
                      id: "about_bio",
                      title: "Miten Mehta Executive Bio & $760M+ Record",
                      type: "markdown",
                      content: (
                        <div className="space-y-3 text-xs font-sans text-zinc-300">
                          <h3 className="font-bold text-white text-sm">Executive Overview</h3>
                          <p>30+ years leading enterprise transformation, $760M+ capital raised, 10+ M&A exits, and 3 landmark IPOs ($1B+ valuations).</p>
                        </div>
                      )
                    });
                    setArtifactOpen(true);
                  }}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition ${
                    activeView === "about" ? "bg-zinc-800 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Executive Bio & P&L</span>
                </button>
              </div>

              {/* SECTION: OS POWERED PROJECTS */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  OS Powered Projects
                </div>
                <button
                  onClick={() => {
                    setActiveView("orchestrai");
                    setActiveArtifact({
                      id: "os_project",
                      title: "OrchestrAI OS Sovereign Architecture",
                      type: "architecture",
                      content: (
                        <div className="space-y-3 text-xs font-mono text-zinc-300">
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded font-bold text-cyan-400">
                            OrchestrAI OS: Sovereign Enterprise Platform
                          </div>
                          <p className="text-zinc-400 font-sans text-xs">
                            Sovereign, federated multi-agent OS operating 237 layers across a local k3d Kubernetes cluster.
                          </p>
                        </div>
                      )
                    });
                    setArtifactOpen(true);
                  }}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition ${
                    activeView === "orchestrai" ? "bg-zinc-800 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OrchestrAI OS (237 L)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView("fastmcp");
                    setActiveArtifact({
                      id: "fastmcp_project",
                      title: "FastMCP Digital Trust Engine",
                      type: "code",
                      content: (
                        <div className="space-y-3 text-xs font-mono text-zinc-300">
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded font-bold text-emerald-400">
                            FastMCP Gateway & Governance Kernel
                          </div>
                          <p className="text-zinc-400 font-sans text-xs">
                            Zero-Trust MCP Protocol gateway delivering 828 verified IP claims and DORA Art. 28 compliance.
                          </p>
                        </div>
                      )
                    });
                    setArtifactOpen(true);
                  }}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition ${
                    activeView === "fastmcp" ? "bg-zinc-800 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FastMCP Trust Engine</span>
                </button>
              </div>

              {/* SECTION: KNOWLEDGE & MEDIA */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Knowledge & Media
                </div>
                <button
                  onClick={() => {
                    setActiveView("books");
                    setActiveArtifact({
                      id: "books_nav",
                      title: "Published Executive Books & Research",
                      type: "book",
                      content: (
                        <div className="space-y-3 text-xs font-sans text-zinc-300">
                          <h4 className="font-bold text-white text-sm">Trust in Agentic AI Economy (2026)</h4>
                          <p>24 chapters covering the Digital Trust Stack, Industry Language Models, and 90-day execution roadmaps.</p>
                        </div>
                      )
                    });
                    setArtifactOpen(true);
                  }}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition ${
                    activeView === "books" ? "bg-zinc-800 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Books & Publications</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView("linkedin");
                    setActiveArtifact({
                      id: "linkedin_nav",
                      title: "LinkedIn Executive Insights",
                      type: "linkedin",
                      content: (
                        <div className="space-y-3 text-xs font-sans text-zinc-300">
                          <h4 className="font-bold text-white text-sm">Latest LinkedIn Insights</h4>
                          <p>Analysis of enterprise AI decision-making under 30-second audit compliance.</p>
                        </div>
                      )
                    });
                    setArtifactOpen(true);
                  }}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition ${
                    activeView === "linkedin" ? "bg-zinc-800 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn Feed & Articles</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView("events");
                    setActiveArtifact({
                      id: "keynote_nav",
                      title: "WEF Davos Keynotes & KIIT Lectures",
                      type: "markdown",
                      content: (
                        <div className="space-y-3 text-xs font-sans text-zinc-300">
                          <h4 className="font-bold text-white text-sm">Davos WEF & Academic Professorship</h4>
                          <p>Keynotes on Global AI Policy, Sovereign Infrastructure, and Enterprise Governance.</p>
                        </div>
                      )
                    });
                    setArtifactOpen(true);
                  }}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-left transition ${
                    activeView === "events" ? "bg-zinc-800 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Davos Keynotes & KIIT</span>
                </button>
              </div>

            </div>
          )}

          {/* BOTTOM PROFILE TRIGGER CARD */}
          <div className="p-2 border-t border-zinc-800 bg-zinc-950">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="w-full flex items-center gap-2.5 p-2 hover:bg-zinc-850 rounded-lg transition text-left"
            >
              <img
                src={mitenPhoto}
                alt="Miten Mehta"
                className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
              />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-100 truncate">Miten Mehta</div>
                  <div className="text-[10px] text-zinc-400 truncate">Chief AI Officer • Profile</div>
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* CENTER STAGE: DYNAMIC WORKSPACE STAGE */}
        <main className="flex-1 bg-zinc-950 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* VIEW 1: CHAT WORKSPACE */}
          {activeView === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-3xl mx-auto w-full">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "miten" && (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 shrink-0 mt-1 font-bold text-xs">
                        MM
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl max-w-[85%] text-xs md:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700"
                        : "bg-zinc-900/90 text-zinc-200 rounded-tl-none border border-zinc-800 shadow-lg"
                    }`}>
                      <div className="flex items-center gap-2 mb-1 text-[10px] font-mono text-zinc-500">
                        <span>{msg.sender === "user" ? "You" : `Miten AI (${msg.mode.toUpperCase()})`}</span>
                        <span>• {msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-zinc-800/80 bg-zinc-950 max-w-3xl mx-auto w-full">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 focus-within:border-zinc-600 transition">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    placeholder={`Ask Miten AI about OS Architecture, $760M+ Capital, or AI Books (${mode.toUpperCase()} mode)...`}
                    className="flex-1 bg-transparent border-none text-xs md:text-sm text-zinc-100 focus:outline-none font-mono px-2"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg font-bold transition shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* VIEW 2: ORCHESTRAI OS DEDICATED PAGE */}
          {activeView === "orchestrai" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 text-zinc-200">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
                  <Cpu className="w-3.5 h-3.5" /> SOVEREIGN MULTI-AGENT ENTERPRISE OS
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  OrchestrAI OS — Sovereign 237-Layer Architecture
                </h1>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  OrchestrAI OS is the world's first federated, sovereign Enterprise Agentic AI Operating System. Engineered for zero-trust security and absolute regulatory compliance (ISO 42001, EU AI Act, DORA), it operates 237 verified OS layers backed by a local PostgreSQL Single Source of Truth (SSOT).
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-zinc-400">Verified OS Layers</div>
                  <div className="text-2xl font-bold text-cyan-400">237 Layers</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-zinc-400">Guaranteed SLA</div>
                  <div className="text-2xl font-bold text-emerald-400">99.999%</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="text-zinc-400">Monthly Decisions</div>
                  <div className="text-2xl font-bold text-purple-400">3M+ Autonomous</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h3 className="font-bold text-white text-base">Key Technical Innovations</h3>
                <ul className="space-y-2 text-xs text-zinc-300 list-disc pl-4">
                  <li><strong>Mem0 MAG Engine:</strong> Memory-Augmented Generation retaining long-term contextual graph across all enterprise subagents.</li>
                  <li><strong>NASA FDIR Watchdog:</strong> Fault Detection, Isolation, and Recovery automatically restoring failed pods under 500ms.</li>
                  <li><strong>Mycelial NATS Bus:</strong> Encrypted inter-agent communication bus enforcing Zero Secret Leakage (LAW-50).</li>
                </ul>
              </div>
            </div>
          )}

          {/* VIEW 3: FASTMCP TRUST ENGINE PAGE */}
          {activeView === "fastmcp" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 text-zinc-200">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                  <Layers className="w-3.5 h-3.5" /> ZERO-TRUST MCP PROTOCOL KERNEL
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  FastMCP Digital Trust Engine & Security Kernel
                </h1>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  FastMCP is an open-source, enterprise-grade Model Context Protocol (MCP) gateway that provides mathematical verification and cryptographically signed audit logs for multi-agent workflows.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 font-mono text-xs">
                <h3 className="font-bold text-white text-sm">Security & Compliance Standards</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-emerald-400 font-bold block">ISO 42001 Certified</span>
                    <span className="text-zinc-400 text-[11px]">AI Management System Controls</span>
                  </div>
                  <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-cyan-400 font-bold block">DORA Art. 28 Compliant</span>
                    <span className="text-zinc-400 text-[11px]">Digital Operational Resilience</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: BOOKS PAGE */}
          {activeView === "books" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 text-zinc-200">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono font-bold">
                  <BookOpen className="w-3.5 h-3.5" /> PUBLISHED BOOKS & RESEARCH
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  Published Books & Executive Research
                </h1>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-white text-lg">Trust in the Age of Agentic AI Economy (2026)</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    24 chapters providing an enterprise blueprint for deploying AI agents without governance risks. Details the Digital Trust Stack, Industry Language Models, and a 90-day implementation roadmap.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-white text-lg">Product Management in the Agentic AI Era</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Architectural framework for building self-healing multi-agent software products and product-led revenue velocity.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-white text-lg">Rama in the Startup Exile</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Published by{" "}
                    <a href="https://notionpress.com" target="_blank" rel="noreferrer" className="text-cyan-400 font-semibold underline hover:text-cyan-300">
                      Notion Press
                    </a>{" "}
                    /{" "}
                    <a href="https://www.amazon.com/dp/B07R1W8364" target="_blank" rel="noreferrer" className="text-cyan-400 font-semibold underline hover:text-cyan-300">
                      Amazon
                    </a>. Explores leadership resilience, ethical decision-making, and startup execution under uncertainty.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: LINKEDIN ARTICLES PAGE */}
          {activeView === "linkedin" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 text-zinc-200">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-xs font-mono font-bold">
                  <Linkedin className="w-3.5 h-3.5" /> LINKEDIN TOP VOICE ARTICLES
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  LinkedIn Publications & Strategic Insights
                </h1>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-white text-base">Your AI Agent Just Made a Wrong Decision. Can You Prove What Happened?</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    A regulator asks why your system did what it did — you have 30 seconds to answer, not 30 days. That's the standard courts and regulators are holding enterprise CAIOs to.
                  </p>
                  <a href="https://www.linkedin.com/in/mitenmehta" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400 font-bold pt-1">
                    Read Article on LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: KEYNOTES & DAVOS PAGE */}
          {activeView === "events" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 text-zinc-200">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold">
                  <Globe className="w-3.5 h-3.5" /> GLOBAL SPEAKING & PROFESSORSHIP
                </div>
                <h1 className="text-3xl font-extrabold text-white">
                  Davos WEF Keynotes & Academic Leadership
                </h1>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-white text-base">World Economic Forum (WEF) Davos Panelist</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Keynote speaker at Davos WEF on Sovereign AI Infrastructure, Global Digital Trust Stacks, and Enterprise Governance.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h3 className="font-bold text-white text-base">Honorary Professor @ KIIT University</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Delivering masterclasses on Multi-Agent Systems, FastMCP Protocol, and AI Entrepreneurship for senior graduate researchers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: ABOUT PAGE */}
          {activeView === "about" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 text-zinc-200">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center gap-6">
                <img src={mitenPhoto} alt="Miten Mehta" className="w-36 h-36 rounded-2xl object-cover border-2 border-cyan-500 shrink-0" />
                <div className="space-y-2 text-center md:text-left">
                  <h1 className="text-3xl font-extrabold text-white">Miten Narendra Mehta</h1>
                  <p className="text-xs text-zinc-400 font-mono">Chief AI Officer • Ex-Google Cloud GCP Leader</p>
                  <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                    Revenue-owning Chief AI Officer scaling multi-agent platforms to $15M+ ARR. $760M+ in capital raised across 3 landmark IPOs ($1B+ valuations for MCX, IEX, Mondee NASDAQ).
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* RIGHT PANEL: CLAUDE STYLE ARTIFACT VIEWER */}
        {artifactOpen && (
          <aside className="w-full sm:w-80 lg:w-96 bg-zinc-900/95 border-l border-zinc-800 flex flex-col shrink-0 absolute right-0 top-0 bottom-0 z-30 lg:static shadow-2xl">
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" /> {activeArtifact.title}
              </span>
              <button onClick={() => setArtifactOpen(false)} className="p-1 hover:bg-zinc-800 rounded text-zinc-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activeArtifact.content}
            </div>
          </aside>
        )}

      </div>

      {/* 3. PROFILE MODAL */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 text-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <img src={mitenPhoto} alt="Miten Mehta" className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500" />
                <div>
                  <h2 className="text-xl font-bold text-white">Miten Narendra Mehta</h2>
                  <p className="text-xs text-zinc-400 font-mono">Chief AI Officer • Sovereign Agentic Architect</p>
                </div>
              </div>
              <button onClick={() => setProfileModalOpen(false)} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs md:text-sm leading-relaxed text-zinc-300">
              <p>
                Operationalizing autonomous revenue engines via production-grade Agentic AI; architecting self-healing, high-concurrency swarms that reduce operational overhead by 65%.
              </p>
              
              <div className="grid grid-cols-2 gap-3 font-mono text-xs text-zinc-300 pt-2">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500">Capital & Exits</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">$760M+ Supported</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500">Hyperscaler Co-Sell</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">$107M+ (GCP/AWS)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Recruiter Search & Candidate Taxonomy (2026 Algorithmic Optimization)</h4>
                <div className="space-y-1.5 text-zinc-300">
                  <p><span className="text-zinc-500">Target Executive Titles:</span> Chief AI Officer (CAIO) • VP/SVP Enterprise AI • Global Head of AI Solutions • Head of AI GTM & Growth • Head of AI Partnerships • Architect of Sovereign Agentic AI • Board Advisor</p>
                  <p><span className="text-zinc-500">FOSS & Governance Clusters:</span> Sovereign AI Infrastructure • Open Source AI (FOSS) Governance • ISO 42001 & EU AI Act • Multi-Tenant AI Orchestration • FastMCP Trust Engine</p>
                  <p><span className="text-zinc-500">Recruiter Boolean String:</span> ("Chief AI Officer" OR "CAIO" OR "VP of AI" OR "Global Head of AI") AND ("Agentic AI" OR "Sovereign AI" OR "FOSS AI") AND ("ISO 42001" OR "EU AI Act" OR "Google Cloud" OR "Board Advisor")</p>
                  <p><span className="text-zinc-500">Target Retained Search Firms:</span> Spencer Stuart • Heidrick & Struggles • Egon Zehnder • Russell Reynolds • Korn Ferry</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Contact & Links</h4>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <a href="mailto:mitennmehta@gmail.com" className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-200 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email
                  </a>
                  <a href="https://linkedin.com/in/mitenmehta" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-200 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" /> LinkedIn
                  </a>
                  <a href="https://mitenmehta.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> Website
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. GLASS DOME TELEMETRY BAR */}
      <footer className="h-6 bg-zinc-950 border-t border-zinc-800 px-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            99.999% SLA
          </span>
          <span className="text-zinc-700">|</span>
          <span>SSOT: <strong>237 OS LAYERS VERIFIED</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span>SECURITY: <strong className="text-emerald-400">ZERO SECRET LEAKAGE (LAW-50)</strong></span>
          <span className="text-zinc-700">|</span>
          <span className="text-amber-400 font-bold">CVO-SIGNED-v1.0</span>
        </div>
      </footer>

    </div>
  );
};
