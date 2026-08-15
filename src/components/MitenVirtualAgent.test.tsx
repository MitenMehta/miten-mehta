import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MitenVirtualAgent } from "./MitenVirtualAgent";

describe("MitenVirtualAgent", () => {
  it("labels the experience as a preview and does not claim live service", () => {
    render(<MitenVirtualAgent />);
    expect(screen.getByText(/Virtual AI Agent preview/i)).toBeInTheDocument();
    expect(screen.getByText(/Integration verification in progress/i)).toBeInTheDocument();
  });

  it("fails closed instead of fabricating a response", async () => {
    vi.stubEnv("VITE_AGENT_API_URL", "");
    const user = userEvent.setup();
    render(<MitenVirtualAgent />);

    await user.type(screen.getByLabelText(/Ask Miten's virtual AI agent/i), "Are you online?");
    await user.click(screen.getByRole("button", { name: /Send message/i }));

    expect(await screen.findByText(/service is not available yet/i)).toBeInTheDocument();
  });
});
