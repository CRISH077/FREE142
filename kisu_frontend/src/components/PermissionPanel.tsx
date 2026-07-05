import type { PermissionClass, TaskState } from "../lib/types";

interface PermissionPanelProps {
  task: TaskState;
  onDecide: (granted: boolean) => void;
}

const CLASS_COPY: Record<PermissionClass, string> = {
  web_search: "search the web",
  file_read: "read your uploaded file",
  camera: "use your camera",
  microphone: "use your microphone",
  location: "use your location",
  external_tool: "connect to an external tool",
  download: "download a resource",
};

export function PermissionPanel({ task, onDecide }: PermissionPanelProps) {
  if (!task.pending_permission_class) return null;
  const action = CLASS_COPY[task.pending_permission_class] ?? "access this";

  return (
    <div className="kisu-panel kisu-permission">
      <p className="kisu-panel__title" style={{ textAlign: "left" }}>
        Permission
      </p>
      <div className="kisu-permission__icon" aria-hidden="true">
        🔒
      </div>
      <p className="kisu-permission__text">
        KISU wants to {action}
        {task.pending_permission_reason ? ` — ${task.pending_permission_reason}` : ""}
      </p>
      <div className="kisu-permission__actions">
        <button className="kisu-btn kisu-btn--deny" onClick={() => onDecide(false)}>
          Deny
        </button>
        <button className="kisu-btn kisu-btn--allow" onClick={() => onDecide(true)}>
          Allow
        </button>
      </div>
    </div>
  );
}
