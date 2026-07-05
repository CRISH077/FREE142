import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KisuAgent } from "./components/KisuAgent";

const sessionId = crypto.randomUUID();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <KisuAgent sessionId={sessionId} />
    </div>
  </StrictMode>
);
