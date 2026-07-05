import type { TaskState } from "../lib/types";

interface ProgressPanelProps {
  task: TaskState | null;
}

export function ProgressPanel({ task }: ProgressPanelProps) {
  if (!task) return null;

  return (
    <div className="kisu-panel" role="status" aria-live="polite">
      <p className="kisu-panel__title">Task Progress</p>
      {task.steps.map((step) => (
        <div key={step.id}>
          <div className="kisu-step">
            <span
              className={`kisu-step__dot kisu-step__dot--${step.status}`}
              aria-hidden="true"
            />
            <span
              className={
                step.status === "pending" ? "kisu-step__label kisu-step__label--pending" : "kisu-step__label"
              }
            >
              {step.label}
            </span>
          </div>
          {step.status === "failed" && step.error && (
            <p className="kisu-step__error">{step.error}</p>
          )}
        </div>
      ))}
    </div>
  );
}
