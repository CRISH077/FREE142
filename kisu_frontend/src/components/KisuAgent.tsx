import { useState } from "react";
import { useAgentSession } from "../lib/useAgentSession";
import { ProgressPanel } from "./ProgressPanel";
import { PermissionPanel } from "./PermissionPanel";
import "../styles/kisu.css";

interface KisuAgentProps {
  sessionId: string;
}

export function KisuAgent({ sessionId }: KisuAgentProps) {
  const { task, busy, error, send, resolvePermission } = useAgentSession(sessionId);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || busy) return;
    await send(message.trim());
    setMessage("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message KISU..."
          disabled={busy}
          style={{
            flex: 1,
            background: "var(--kisu-surface-raised)",
            border: "1px solid var(--kisu-border)",
            borderRadius: 12,
            padding: "12px 16px",
            color: "var(--kisu-text)",
            fontFamily: "var(--kisu-font-body)",
          }}
        />
        <button
          className="kisu-btn kisu-btn--allow"
          type="submit"
          disabled={busy || !message.trim()}
          style={{ flex: "0 0 72px" }}
        >
          Send
        </button>
      </form>

      {task?.pending_permission_class && (
        <PermissionPanel task={task} onDecide={resolvePermission} />
      )}

      <ProgressPanel task={task} />

      {error && (
        <div className="kisu-panel" style={{ borderColor: "var(--kisu-danger)", fontSize: 13 }}>
          {error}
        </div>
      )}

      {task?.done && task.result_message && (
        <div className="kisu-panel">
          <p className="kisu-panel__title">Result</p>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{task.result_message}</p>
        </div>
      )}
    </div>
  );
}
