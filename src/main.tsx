import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global handler to safely absorb benign ResizeObserver loop limit notifications
if (typeof window !== "undefined") {
  const resizeObserverErrorTexts = [
    "ResizeObserver loop completed with undelivered notifications",
    "ResizeObserver loop limit exceeded",
    "undelivered notifications",
  ];

  const isResizeObserverMsg = (msg: unknown): boolean => {
    if (!msg) return false;
    const str = typeof msg === "string" ? msg : String((msg as { message?: string }).message || msg);
    return resizeObserverErrorTexts.some((text) => str.includes(text));
  };

  window.addEventListener(
    "error",
    (event) => {
      if (isResizeObserverMsg(event.message) || isResizeObserverMsg(event.error)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      if (isResizeObserverMsg(event.reason)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );

  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (args.length > 0 && args.some((arg) => isResizeObserverMsg(arg))) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById("root")!).render(<App />);

