import { useCallback, useEffect, useRef, useState } from "react";
import { decidePermission, startTask, tick } from "./api";
import type { TaskState } from "./types";

const POLL_INTERVAL_MS = 1500;

interface AgentSessionState {
  task: TaskState | null;
  busy: boolean;
  error: string | null;
}

const initialState: AgentSessionState = { task: null, busy: false, error: null };

/** Drives one KISU agent task against the Vercel/serverless backend: starts
 * it, polls /tick on an interval to advance one step at a time, and stops
 * polling once the task reports done=true. No open connection required. */
export function useAgentSession(sessionId: string) {
  const [state, setState] = useState<AgentSessionState>(initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pollOnce = useCallback(async (taskId: string) => {
    try {
      const fresh = await tick(taskId);
      setState((s) => ({ ...s, task: fresh, busy: !fresh.done }));
      if (fresh.done) stopPolling();
    } catch (err) {
      setState((s) => ({ ...s, error: (err as Error).message }));
    }
  }, [stopPolling]);

  useEffect(() => stopPolling, [stopPolling]); // cleanup on unmount

  const send = useCallback(
    async (message: string) => {
      stopPolling();
      setState({ task: null, busy: true, error: null });
      try {
        const { task_id } = await startTask(sessionId, message);
        await pollOnce(task_id);
        timerRef.current = setInterval(() => pollOnce(task_id), POLL_INTERVAL_MS);
      } catch (err) {
        setState((s) => ({ ...s, error: (err as Error).message, busy: false }));
      }
    },
    [sessionId, pollOnce, stopPolling]
  );

  const resolvePermission = useCallback(
    async (granted: boolean) => {
      const requestId = state.task?.pending_permission_request_id;
      if (!requestId) return;
      await decidePermission(requestId, granted);
      // Next scheduled tick will pick up the decision; no need to force one.
    },
    [state.task]
  );

  return { ...state, send, resolvePermission };
}
