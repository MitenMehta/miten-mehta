import { FormEvent, useRef, useState } from "react";
import { BookOpen, BriefcaseBusiness, ExternalLink, FileText, Github, Loader2, Send, ShieldCheck } from "lucide-react";
import mitenPhoto from "@/assets/miten-mehta-photo.jpeg";
import { AgentMode, sendAgentMessage } from "@/lib/agent-client";
import { getErrorMessage } from "@/lib/errors";

type ChatMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    sender: "agent",
    text: "Welcome. This preview will connect you with Miten's governed AI service when its independent integration checks are complete. You can explore the public resources while the service is unavailable.",
  },
];

const resources = [
  { title: "CAIO Executive Playbook", href: "/caio-executive-playbook.html", icon: FileText },
  { title: "Download the playbook", href: "/caio-executive-playbook.pdf", icon: BookOpen },
  { title: "LinkedIn profile", href: "https://www.linkedin.com/in/mitenmehta", icon: BriefcaseBusiness },
  { title: "GitHub profile", href: "https://github.com/MitenMehta", icon: Github },
];

export function MitenVirtualAgent() {
  const [mode, setMode] = useState<AgentMode>("aria");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const sessionId = useRef(crypto.randomUUID());

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || pending) return;

    setMessages((current) => [...current, { id: crypto.randomUUID(), sender: "user", text: message }]);
    setInput("");
    setPending(true);

    try {
      const response = await sendAgentMessage({ message, mode, sessionId: sessionId.current });
      setMessages((current) => [
        ...current,
        { id: response.request_id, sender: "agent", text: response.message },
      ]);
    } catch (error: unknown) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          sender: "agent",
          text: getErrorMessage(error, "The Virtual Miten service is not available yet."),
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={mitenPhoto} alt="Miten Mehta" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <h1 className="text-sm font-semibold">Miten Mehta</h1>
              <p className="text-xs text-zinc-500">Virtual AI Agent preview · Powered by Ewaya</p>
            </div>
          </div>
          <div className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
            Integration verification in progress
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="border-b border-zinc-200 bg-white p-5 lg:border-b-0 lg:border-r">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Expertise</p>
          <nav aria-label="Expertise" className="space-y-2 text-sm">
            {[
              "Open-source AI systems",
              "Agentic AI solutions",
              "Growth and go-to-market",
              "Strategic partnerships",
              "AI governance",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                {item}
              </div>
            ))}
          </nav>
          <div className="mt-6 rounded-xl border border-zinc-200 p-4 text-xs leading-5 text-zinc-600">
            <ShieldCheck className="mb-2 h-5 w-5 text-zinc-800" />
            Responses will be generated only through the governed service. This interface does not simulate answers when that service is unavailable.
          </div>
        </aside>

        <section className="flex min-h-[620px] flex-col bg-white" aria-label="Virtual Miten conversation">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold">Conversation</h2>
              <p className="text-xs text-zinc-500">No customer prompt is stored by this preview.</p>
            </div>
            <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1" aria-label="Conversation mode">
              {(["aria", "orion"] as AgentMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  aria-pressed={mode === item}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                    mode === item ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.sender === "user"
                      ? "rounded-br-sm bg-zinc-900 text-white"
                      : "rounded-bl-sm border border-zinc-200 bg-zinc-50 text-zinc-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Connecting to the governed service…
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-200 p-4">
            <label htmlFor="agent-message" className="sr-only">Ask Miten's virtual AI agent</label>
            <div className="flex gap-2 rounded-xl border border-zinc-300 bg-white p-2 focus-within:ring-2 focus-within:ring-zinc-800">
              <input
                id="agent-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={2_000}
                autoComplete="off"
                placeholder="Ask about open AI systems, growth, partnerships, or GTM"
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="rounded-lg bg-zinc-900 p-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>

        <aside className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-l lg:border-t-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Public resources</p>
          <div className="space-y-2">
            {resources.map(({ title, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm hover:border-zinc-400"
              >
                <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {title}</span>
                <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
              </a>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
            <h2 className="text-sm font-semibold">Service status</h2>
            <p className="mt-2 text-xs leading-5 text-zinc-600">
              The AI connection remains disabled until the OrchestrAIOS track supplies an authenticated endpoint and independent integration evidence passes.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
