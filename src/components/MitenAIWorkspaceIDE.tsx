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
  Share2
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
  // Navigation & Workspace State
  const [activeView, setActiveView] = useState<string>("chat"); // "chat" | "orchestrai" | "fastmcp" | "books" | "linkedin" | "events"
  const [selectedFile, setSelectedFile] = useState<string>("Overview.md");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [artifactOpen, setArtifactOpen] = useState<boolean>(true);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  // Active Artifact on Right Panel (Claude Artifact style)
  const [activeArtifact, setActiveArtifact] = useState<Artifact>({
    id: "orchestrai_spec",
    title: "OrchestrAI OS Architecture Spec",
    type: "architecture",
    content: (
      <div className="space-y-4 text-xs font-mono">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-emerald-400 font-bold flex items-center justify-between">
          <span>STATUS: 99.999% SLA (FDIR WATCHDOG ACTIVE)</span>
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
        <div className="space-y-2 text-zinc-400">
          <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px]">Subsystem Verification</h4>
          <ul className="space-y-1 list-disc pl-4">
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
        
        // Open Right Artifact View with OS Architecture Diagram
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
        
        setActiveArtifact({
          id: "capital_ledger",
          title: "Capital Formation & M&A Track Record",
          type: "markdown",
          content: (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-emerald-400 font-mono font-bold">
                $760M+ INSTITUTIONAL CAPITAL RAISED
              </div>
              <ul className="space-y-2 text-zinc-300 list-disc pl-4 font-sans">
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
        
        setActiveArtifact({
          id: "books_artifact",
          title: "Published Executive Books & Research",
          type: "book",
          content: (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-lg text-purple-300 font-mono font-bold">
                TRUST IN THE AGE OF AGENTIC AI ECONOMY (2026)
              </div>
              <p className="text-zinc-300 leading-relaxed">
                Co-authored with industry leaders. 24 Chapters covering Digital Trust Stack, Industry Language Models, and a 90-day enterprise implementation roadmap.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition"
                >
                  <BookOpen className="w-3.5 h-3.5" /> View Publication
                </a>
              </div>
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
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-100 font-sans overflow-hidden select-none">
      
      {/* 1. AGY MONOCHROME HEADER BAR */}
      <header className="h-13 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-base tracking-tight">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-100 font-semibold">Miten Mehta</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
              AI STUDIO v2.0
            </span>
          </div>
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
              👔 Aria (Executive)
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
                  className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-zinc-800/80 rounded text-left text-zinc-200 font-semibold"
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
                  className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-zinc-800/80 rounded text-left text-zinc-300 font-semibold"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FastMCP Trust Engine</span>
                </button>
              </div>

              {/* SECTION: KNOWLEDGE & ARTIFACTS */}
              <div className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Knowledge & Media
                </div>
                <button
                  onClick={() => setActiveView("books")}
                  className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-zinc-800/80 rounded text-left text-zinc-300"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Books & Publications</span>
                </button>
                <button
                  onClick={() => setActiveView("linkedin")}
                  className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-zinc-800/80 rounded text-left text-zinc-300"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn Feed & Articles</span>
                </button>
                <button
                  onClick={() => setActiveView("events")}
                  className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-zinc-800/80 rounded text-left text-zinc-300"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Davos Keynotes & KIIT</span>
                </button>
              </div>

            </div>
          )}

          {/* BOTTOM PROFILE TRIGGER CARD (ChatGPT / CODEX STYLE) */}
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

        {/* CENTER STAGE: AI CHAT & INTERACTIVE WORKBENCH (CLAUDE STYLE) */}
        <main className="flex-1 bg-zinc-950 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* MAIN CHAT STREAM CONTAINER */}
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

          {/* MAIN CHAT INPUT FORM */}
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
            <div className="text-[10px] text-center text-zinc-500 font-mono mt-2">
              Powered by Ewaya OS Feedback Kernel • Synchronized with 237 OS Layers
            </div>
          </div>

        </main>

        {/* RIGHT PANEL: CLAUDE STYLE ARTIFACT VIEWER */}
        {artifactOpen && (
          <aside className="w-80 lg:w-96 bg-zinc-900/90 border-l border-zinc-800 flex flex-col shrink-0">
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

      {/* 3. PROFILE MODAL (ABOUT MITEN - ACCESSIBLE FROM FOOTER / HEADER) */}
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
                  <div className="text-zinc-500">Capital Formation</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">$760M+ Raised</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500">Hyperscaler Co-Sell</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">$107M+ (GCP/AWS)</div>
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
