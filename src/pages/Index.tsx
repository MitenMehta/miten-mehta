import { useState } from "react";
import { MitenAIWorkspaceIDE } from "@/components/MitenAIWorkspaceIDE";

const Index = () => {
  const [mode, setMode] = useState<"aria" | "orion">("aria");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <MitenAIWorkspaceIDE mode={mode} setMode={setMode} />
    </div>
  );
};

export default Index;