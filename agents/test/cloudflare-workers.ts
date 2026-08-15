export class WorkflowEntrypoint<Env, Params> {
  protected env: Env;
  constructor(_ctx: unknown, env: Env) { this.env = env; }
}
export type WorkflowEvent<T> = { payload: T };
export type WorkflowStep = {
  do<T>(name: string, callback: () => Promise<T>): Promise<T>;
  do<T>(name: string, config: unknown, callback: () => Promise<T>): Promise<T>;
};
