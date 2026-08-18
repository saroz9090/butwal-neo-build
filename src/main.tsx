import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global handler to safely absorb benign ResizeObserver loop limit notifications
if (typeof window !== "undefined") {
  const resizeObserverErrorTexts = [
    "ResizeObserver loop completed with undelivered notifications.",
    "ResizeObserver loop limit exceeded",
  ];

  window.addEventListener("error", (event) => {
    if (
      event.message &&
      resizeObserverErrorTexts.some((text) => event.message.includes(text))
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      args.length > 0 &&
      typeof args[0] === "string" &&
      resizeObserverErrorTexts.some((text) => (args[0] as string).includes(text))
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);

