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
  Search,
  Maximize2,
  CheckCircle2
} from "lucide-react";
import mitenPhoto from "@/assets/miten-mehta-photo.jpeg";

interface MitenAIWorkspaceIDEProps {
  mode: "aria" | "orion";
  setMode: (m: "aria" | "orion") => void;
}

export const MitenAIWorkspaceIDE: React.FC<MitenAIWorkspaceIDEProps> = ({ mode, setMode }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [chatOpen, setChatOpen] = useState<boolean>(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    overview: true,
    profile: true,
    board: true,
    books: true,
    os_kernel: true,
    keynotes: true
  });

  // Chat state
  const [messages, setMessages] = useState<Array<{ sender: "user" | "miten"; text: string; mode: string; timestamp: string }>>([
    {
      sender: "miten",
      text: "Welcome to my Sovereign AI Workspace. I am Miten Mehta's AI Knowledge Avatar, directly synchronized with the OrchestrAI OS Master Canonical Ledger (237 OS Layers verified). Ask me anything about my $760M+ capital formation, multi-agent architecture, published books, or PE/VC advisory roles.",
      mode: "aria",
      timestamp: "Just now"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg = { sender: "user" as const, text: userText, mode, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage("");

    // Simulate AI response based on query
    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();
      if (lower.includes("capital") || lower.includes("funding") || lower.includes("ipo")) {
        reply = "Throughout my career as a revenue-owning executive, I have raised $760M+ in institutional capital, led 3 landmark IPOs ($1B+ valuations for MCX, IEX, and Mondee NASDAQ), and executed $2B+ in cumulative M&A exits.";
      } else if (lower.includes("layer") || lower.includes("architecture") || lower.includes("os") || lower.includes("orchestrai")) {
        reply = "OrchestrAI OS is a federated, sovereign Enterprise AI Operating System featuring a 5-Tier Master Architecture and 237 verified OS Layers (verified live in k3d PostgreSQL SSOT). It delivers 99.999% SLA availability backed by NASA FDIR Watchdogs.";
      } else if (lower.includes("book") || lower.includes("author") || lower.includes("publication")) {
        reply = "I have authored 3 books: 'Trust in the Age of Agentic AI Economy' (2026, 24 chapters), 'Product Management in the Agentic AI Era', and 'Rama in the Startup Exile' (Notion Press / Amazon).";
      } else {
        reply = mode === "aria" 
          ? `[Aria Executive Lens]: Focusing on P&L scaling, $15M+ ARR velocity at Tabhi, $107M+ hyperscaler co-sell at Fractal, and board-level AI governance (ISO 42001 & DORA compliance). How can I assist your executive search or board mandate?`
          : `[Orion Technical Lens]: Deep-tech focus on Multi-Agent Systems (MAG), FastMCP gateway kernels, Lean-4 formal verification, and 237 OS Layers operating at 3M+ decisions/month. What architectural subsystem would you like to inspect?`;
      }
      setMessages(prev => [...prev, { sender: "miten", text: reply, mode, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 1. TOP WORKBENCH HEADER (IDE BAR) */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Miten Mehta
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-mono">
              AI STUDIO v2.0
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> EWAYA OS FEEDBACK KERNEL ACTIVE
            </span>
          </div>
        </div>

        {/* Dual-Mode Persona Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMode("aria")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                mode === "aria"
                  ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              👔 Aria (Executive Lens)
            </button>
            <button
              onClick={() => setMode("orion")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                mode === "orion"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ⚡ Orion (Technical Lens)
            </button>
          </div>

          {/* Quick Action Links */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="https://github.com/MitenMehta/miten-mehta"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5" /> GitHub
            </a>
            <a
              href="mailto:mitennmehta@gmail.com"
              className="px-2.5 py-1 text-xs font-mono bg-indigo-600 hover:bg-indigo-500 text-white rounded transition font-bold"
            >
              Contact CAIO
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN TRI-PANE IDE BODY */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT PANEL: FILE TREE WORKSPACE EXPLORER */}
        <aside className={`${sidebarOpen ? "w-64" : "w-12"} bg-slate-900/90 border-r border-slate-800 transition-all duration-200 flex flex-col shrink-0`}>
          <div className="p-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            {sidebarOpen && <span>Workspace Explorer</span>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              <Folder className="w-4 h-4" />
            </button>
          </div>

          {sidebarOpen && (
            <div className="flex-1 overflow-y-auto p-2 text-xs font-mono space-y-1">
              
              {/* Folder 1: Executive Overview */}
              <div>
                <button
                  onClick={() => toggleFolder("overview")}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 hover:bg-slate-800/60 rounded text-slate-300 text-left font-semibold"
                >
                  {expandedFolders.overview ? <ChevronDown className="w-3.5 h-3.5 text-amber-400" /> : <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  <span>01_Executive_Overview</span>
                </button>
                {expandedFolders.overview && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-2 mt-0.5">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "overview" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <FileText className="w-3 h-3 text-cyan-400" /> Overview.md
                    </button>
                    <button
                      onClick={() => setActiveTab("capital")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "capital" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <DollarSign className="w-3 h-3 text-emerald-400" /> Capital_Formation_$760M.csv
                    </button>
                  </div>
                )}
              </div>

              {/* Folder 2: Professional Profile */}
              <div>
                <button
                  onClick={() => toggleFolder("profile")}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 hover:bg-slate-800/60 rounded text-slate-300 text-left font-semibold"
                >
                  {expandedFolders.profile ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400" /> : <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  <span>02_Professional_Profile</span>
                </button>
                {expandedFolders.profile && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-2 mt-0.5">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "profile" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <Briefcase className="w-3 h-3 text-indigo-400" /> Chief_AI_Officer.md
                    </button>
                    <button
                      onClick={() => setActiveTab("gcp")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "gcp" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <Globe className="w-3 h-3 text-blue-400" /> Ex_Google_GCP_Leader.md
                    </button>
                  </div>
                )}
              </div>

              {/* Folder 3: Board & Advisory */}
              <div>
                <button
                  onClick={() => toggleFolder("board")}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 hover:bg-slate-800/60 rounded text-slate-300 text-left font-semibold"
                >
                  {expandedFolders.board ? <ChevronDown className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                  <Folder className="w-3.5 h-3.5 text-emerald-400" />
                  <span>03_Board_&_Advisory</span>
                </button>
                {expandedFolders.board && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-2 mt-0.5">
                    <button
                      onClick={() => setActiveTab("board")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "board" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <Award className="w-3 h-3 text-emerald-400" /> Board_Portfolio.json
                    </button>
                  </div>
                )}
              </div>

              {/* Folder 4: Books & Publications */}
              <div>
                <button
                  onClick={() => toggleFolder("books")}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 hover:bg-slate-800/60 rounded text-slate-300 text-left font-semibold"
                >
                  {expandedFolders.books ? <ChevronDown className="w-3.5 h-3.5 text-purple-400" /> : <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                  <Folder className="w-3.5 h-3.5 text-purple-400" />
                  <span>04_Books_&_Publications</span>
                </button>
                {expandedFolders.books && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-2 mt-0.5">
                    <button
                      onClick={() => setActiveTab("books")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "books" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <BookOpen className="w-3 h-3 text-purple-400" /> Published_Books.md
                    </button>
                  </div>
                )}
              </div>

              {/* Folder 5: OrchestrAI OS Kernel */}
              <div>
                <button
                  onClick={() => toggleFolder("os_kernel")}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 hover:bg-slate-800/60 rounded text-slate-300 text-left font-semibold"
                >
                  {expandedFolders.os_kernel ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                  <Folder className="w-3.5 h-3.5 text-cyan-400" />
                  <span>05_OrchestrAI_OS_Kernel</span>
                </button>
                {expandedFolders.os_kernel && (
                  <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-2 mt-0.5">
                    <button
                      onClick={() => setActiveTab("architecture")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "architecture" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <Layers className="w-3 h-3 text-cyan-400" /> 237_OS_Layers_Spec.yaml
                    </button>
                    <button
                      onClick={() => setActiveTab("code")}
                      className={`w-full flex items-center gap-1.5 py-1 px-1.5 rounded text-left ${activeTab === "code" ? "bg-indigo-950 text-cyan-300 font-bold border-l-2 border-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
                    >
                      <Code className="w-3 h-3 text-emerald-400" /> FastMCP_Gateway.ts
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}
        </aside>

        {/* CENTER STAGE: MULTI-TAB WORKSPACE CANVAS */}
        <main className="flex-1 bg-slate-950 flex flex-col min-w-0 overflow-hidden">
          
          {/* TAB BAR */}
          <div className="h-9 bg-slate-900/60 border-b border-slate-800 flex items-center px-2 gap-1 overflow-x-auto shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1 rounded-t flex items-center gap-2 transition ${activeTab === "overview" ? "bg-slate-950 text-cyan-400 border-t-2 border-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Overview.md
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-3 py-1 rounded-t flex items-center gap-2 transition ${activeTab === "architecture" ? "bg-slate-950 text-cyan-400 border-t-2 border-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> 237_OS_Layers.yaml
            </button>
            <button
              onClick={() => setActiveTab("capital")}
              className={`px-3 py-1 rounded-t flex items-center gap-2 transition ${activeTab === "capital" ? "bg-slate-950 text-cyan-400 border-t-2 border-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Capital_Ledger.csv
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`px-3 py-1 rounded-t flex items-center gap-2 transition ${activeTab === "books" ? "bg-slate-950 text-cyan-400 border-t-2 border-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Books.md
            </button>
          </div>

          {/* CANVAS CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
            
            {/* OVERVIEW TAB CONTENT */}
            {activeTab === "overview" && (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* HERO EXECUTIVE CARD */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={mitenPhoto}
                    alt="Miten Mehta"
                    className="w-36 h-36 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-lg shrink-0"
                  />
                  <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> REVENUE-OWNING CHIEF AI OFFICER
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      Miten Mehta
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                      Operationalizing autonomous revenue engines via production-grade Agentic AI. Architect of <strong className="text-cyan-400">OrchestrAI OS</strong> (237 OS Layers verified in PostgreSQL SSOT). Ex-Google Cloud GCP AI Ecosystem Leader.
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <DollarSign className="w-4 h-4" /> $760M+ Capital Raised
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-purple-400 font-bold">
                        <Award className="w-4 h-4" /> 3 IPOs ($1B+ Valuations)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-cyan-400 font-bold">
                        <Globe className="w-4 h-4" /> WEF Davos Speaker
                      </span>
                    </div>
                  </div>
                </div>

                {/* EXECUTIVE METRICS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <div className="text-2xl md:text-3xl font-black text-cyan-400">$760M+</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">Capital Formation</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <div className="text-2xl md:text-3xl font-black text-emerald-400">$107M+</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">GCP Co-Sell Revenue</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <div className="text-2xl md:text-3xl font-black text-purple-400">3M+</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">Monthly AI Decisions</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <div className="text-2xl md:text-3xl font-black text-amber-400">237</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">Verified OS Layers</div>
                  </div>
                </div>

                {/* CORE COMPETENCIES CARD */}
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                    <Activity className="w-5 h-5" /> Executive Value Proposition & Core Competencies
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                      <strong className="text-white block font-semibold">Strategic GTM & P&L Leadership</strong>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Revenue Operations (RevOps), Product-Led Growth (PLG), Hyperscaler Alliances (AWS/Azure/GCP), Global M&A, and Board-level ROI reporting.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                      <strong className="text-white block font-semibold">Agentic AI & Revenue Engines</strong>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Autonomous Continuous Evolution (ACE), Multi-Agent Systems, GenAI/LLM/RAG stacks, and proprietary IP infrastructure (828 claims).
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ARCHITECTURE TAB CONTENT */}
            {activeTab === "architecture" && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                    <Layers className="w-5 h-5" /> OrchestrAI OS: 5-Tier Architecture & 237 OS Layers
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Verified Single Source of Truth (SSOT) running inside the local k3d Kubernetes cluster (`orchestrai-postgres` pod).
                  </p>
                  
                  <div className="p-4 rounded-lg bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 space-y-2">
                    <div>┌─────────────────────────────────────────────────────────────────────────────┐</div>
                    <div>│                 5-TIER MASTER ARCHITECTURE PYRAMID (237 LAYERS)            │</div>
                    <div>├─────────────────────────────────────────────────────────────────────────────┤</div>
                    <div>│ TIER 5: GOVERNANCE & FORMAL VERIFICATION (Lean-4, OPA, DORA, NIST)         │</div>
                    <div>│ TIER 4: MULTI-AGENT SWARMS (ACE, M1-M7 Protocols, 174 Active Swarms)        │</div>
                    <div>│ TIER 3: SOVEREIGN EVENT KERNEL (FastMCP Gateway, Mycelial NATS Bus)        │</div>
                    <div>│ TIER 2: CONTINUOUS LEARNING LOOP (Mem0 MAG, CVO Database, Postgres SSOT)   │</div>
                    <div>│ TIER 1: EBPF IMMUNE KERNEL (Tetragon, OPA Gatekeeper, k3d Kubernetes)       │</div>
                    <div>└─────────────────────────────────────────────────────────────────────────────┘</div>
                  </div>
                </div>
              </div>
            )}

            {/* CAPITAL TAB CONTENT */}
            {activeTab === "capital" && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> Capital Formation & M&A Benchmark Ledger
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400">Total Institutional Capital</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">$760M+ Raised</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400">Landmark IPOs Led</div>
                      <div className="text-xl font-bold text-purple-400 mt-1">3 IPOs ($1B+)</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="text-slate-400">M&A Exits Delivered</div>
                      <div className="text-xl font-bold text-cyan-400 mt-1">10+ Exits ($2B+)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKS TAB CONTENT */}
            {activeTab === "books" && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Published Books & Academic Leadership
                  </h2>
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-white text-base">Book 1: Trust in the Age of Agentic AI Economy (2026)</h4>
                      <p className="text-xs text-slate-400">24 Chapters detailing the Digital Trust Stack, Industry Language Models, and 90-day enterprise implementation roadmaps.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-white text-base">Book 2: Product Management in the Agentic AI Era</h4>
                      <p className="text-xs text-slate-400">Architectural framework for building self-healing multi-agent software products.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-white text-base">Book 3: Rama in the Startup Exile</h4>
                      <p className="text-xs text-slate-400">Published by Notion Press / Amazon exploring leadership principles and resilience in high-stakes startup building.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* RIGHT PANEL: ASK MITEN AI CO-PILOT (EWAYA OS FEEDBACK KERNEL) */}
        <aside className={`${chatOpen ? "w-80 lg:w-96" : "w-12"} bg-slate-900/95 border-l border-slate-800 flex flex-col transition-all duration-200 shrink-0`}>
          
          {/* CHAT HEADER */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              {chatOpen && <span>ASK MITEN AI (Ewaya OS)</span>}
            </div>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {chatOpen && (
            <>
              {/* CHAT MESSAGES STREAM */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/80"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 font-mono text-[10px] opacity-75">
                        {msg.sender === "user" ? (
                          <span>User</span>
                        ) : (
                          <span className="text-cyan-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Miten AI ({msg.mode.toUpperCase()})
                          </span>
                        )}
                        <span>• {msg.timestamp}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHAT INPUT FORM */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder={`Ask Miten AI in ${mode.toUpperCase()} mode...`}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="submit"
                  className="p-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg transition font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}

        </aside>

      </div>

      {/* 3. BOTTOM GLASS DOME TELEMETRY BAR (STATUS FOOTER) */}
      <footer className="h-7 bg-slate-950 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            99.999% SLA ACTIVE
          </span>
          <span className="text-slate-700">|</span>
          <span className="hidden sm:inline">
            SSOT: <strong className="text-slate-200">237 OS LAYERS VERIFIED</strong> (`orchestrai-postgres`)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline">
            SECURITY: <strong className="text-emerald-400">ZERO SECRET LEAKAGE (LAW-50)</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-amber-400 font-bold">
            EPOCH: CVO-SIGNED-v1.0
          </span>
        </div>
      </footer>

    </div>
  );
};
