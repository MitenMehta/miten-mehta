import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";

export interface WorkflowParams {
  sessionId?: string;
  action?: string;
  payload?: Record<string, any>;
}

export class OrchestrAIWorkflow extends WorkflowEntrypoint<any, WorkflowParams> {
  async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
    const { sessionId, action, payload } = event.payload;

    const stepResult = await step.do("orchestrai-session-sync", async () => {
      console.log(`[Workflow] Processing action: ${action} for session: ${sessionId}`);
      return {
        status: "COMPLETED",
        action,
        sessionId,
        timestamp: new Date().toISOString(),
      };
    });

    await step.do("orchestrai-audit-log", async () => {
      console.log(`[Workflow Audit] Session ${sessionId} action ${action} executed successfully.`);
      return { audited: true };
    });

    return stepResult;
  }
}
