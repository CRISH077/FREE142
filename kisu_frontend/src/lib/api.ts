import type { TaskState } from "./types";

const BASE_URL = import.meta.env.VITE_KISU_API_URL ?? "";

export async function startTask(sessionId: string, message: string): Promise<{ task_id: string }> {
  const res = await fetch(`${BASE_URL}/api/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok) throw new Error(`Failed to start task (${res.status})`);
  return res.json();
}

/** Advances the task by one unit of work and returns the fresh state.
 * Call this on an interval - it's a no-op (state unchanged) while blocked
 * on a permission decision, and safe to keep calling after done=true. */
export async function tick(taskId: string): Promise<TaskState> {
  const res = await fetch(`${BASE_URL}/api/agent/tick/${taskId}`, { method: "POST" });
  if (!res.ok) throw new Error(`Tick failed (${res.status})`);
  return res.json();
}

export async function decidePermission(requestId: string, granted: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/agent/permission/decide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request_id: requestId, granted }),
  });
  if (!res.ok) throw new Error(`Failed to record permission decision (${res.status})`);
}
