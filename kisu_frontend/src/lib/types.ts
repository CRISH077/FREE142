export type PermissionClass =
  | "web_search"
  | "file_read"
  | "camera"
  | "microphone"
  | "location"
  | "external_tool"
  | "download";

export type StepStatus = "pending" | "active" | "done" | "failed" | "skipped";

export interface PlanStep {
  id: string;
  label: string;
  tool: string | null;
  permission: PermissionClass | null;
  status: StepStatus;
  error?: string | null;
  retries: number;
}

/** Matches api/_lib/models.py TaskState exactly - this whole object is
 * returned by both /agent/chat's poll target and every /agent/tick call. */
export interface TaskState {
  task_id: string;
  session_id: string;
  goal: string;
  steps: PlanStep[];
  pending_permission_request_id: string | null;
  pending_permission_class: PermissionClass | null;
  pending_permission_reason: string | null;
  result_message: string | null;
  done: boolean;
}
