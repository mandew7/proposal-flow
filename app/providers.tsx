"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { FlashMessage } from "@/lib/flash";

interface Toast extends FlashMessage {
  id: string;
}

interface ToastContextValue {
  showToast: (toast: FlashMessage) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function Providers({
  children,
  initialToast,
}: {
  children: ReactNode;
  initialToast: FlashMessage | null;
}) {
  const [toasts, setToasts] = useState<Toast[]>(
    initialToast ? [{ ...initialToast, id: `initial-${Date.now()}` }] : [],
  );
  const hasProcessedInitialToast = useRef(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (initialToast && !hasProcessedInitialToast.current) {
      hasProcessedInitialToast.current = true;
      void fetch("/api/flash", { method: "DELETE" });
      const initialId = toasts[0]?.id;

      if (initialId) {
        const timeout = window.setTimeout(() => dismissToast(initialId), 4000);
        return () => window.clearTimeout(timeout);
      }
    }
  }, [dismissToast, initialToast, toasts]);

  const showToast = useCallback((toast: FlashMessage) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            className={`pointer-events-auto rounded-lg border px-4 py-3 shadow-lg ${
              toast.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
            key={toast.id}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                className="text-xs font-semibold uppercase"
                onClick={() => dismissToast(toast.id)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within Providers");
  }

  return context;
}
