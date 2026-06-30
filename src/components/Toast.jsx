import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

// ─── Config por tipo ─────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    bar: "bg-[#00D4AA]",
    iconColor: "text-[#00D4AA]",
    border: "border-[#00D4AA]/30",
    glow: "shadow-[0_0_20px_rgba(0,212,170,0.15)]",
    label: "Éxito",
  },
  error: {
    icon: XCircle,
    bar: "bg-red-500",
    iconColor: "text-red-400",
    border: "border-red-500/30",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    label: "Error",
  },
  info: {
    icon: Info,
    bar: "bg-[#6C63FF]",
    iconColor: "text-[#6C63FF]",
    border: "border-[#6C63FF]/30",
    glow: "shadow-[0_0_20px_rgba(108,99,255,0.15)]",
    label: "Info",
  },
  warning: {
    icon: AlertTriangle,
    bar: "bg-amber-400",
    iconColor: "text-amber-400",
    border: "border-amber-400/30",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    label: "Aviso",
  },
};

const AUTO_DISMISS_MS = 4000;
const MAX_TOASTS = 3;

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(null);
  const remainingRef = useRef(AUTO_DISMISS_MS);

  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  const startDismiss = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.max(0, 100 - (elapsed / remainingRef.current) * 100);
      setProgress(pct);
      if (pct <= 0) {
        clearInterval(intervalRef.current);
        setLeaving(true);
        setTimeout(() => onRemove(toast.id), 350);
      }
    }, 16);
  }, [onRemove, toast.id]);

  const pauseDismiss = () => {
    clearInterval(intervalRef.current);
    pausedAtRef.current = Date.now();
  };

  const resumeDismiss = () => {
    if (pausedAtRef.current) {
      remainingRef.current -= Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    startTimeRef.current = Date.now();
    startDismiss();
  };

  const handleClose = () => {
    clearInterval(intervalRef.current);
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 350);
  };

  useEffect(() => {
    // mount → trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    startDismiss();
    return () => {
      clearTimeout(t);
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateClass = leaving
    ? "translate-x-full opacity-0"
    : visible
    ? "translate-x-0 opacity-100"
    : "translate-x-full opacity-0";

  return (
    <div
      className={`
        relative w-full max-w-sm overflow-hidden
        bg-[#1A1A2E] border ${config.border} ${config.glow}
        rounded-xl pointer-events-auto
        transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${translateClass}
      `}
      onMouseEnter={pauseDismiss}
      onMouseLeave={resumeDismiss}
      role="alert"
      aria-live="assertive"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-white/5">
        <div
          className={`h-full ${config.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3 p-4 pt-5">
        {/* Icon */}
        <div className={`shrink-0 mt-0.5 ${config.iconColor}`}>
          <Icon size={20} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-white leading-tight mb-0.5">
              {toast.title}
            </p>
          )}
          {toast.message && (
            <p className="text-xs text-white/60 leading-relaxed break-words">
              {toast.message}
            </p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="shrink-0 p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", title = "", message = "" }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const next = [...prev, { id, type, title, message }];
        // Limit to MAX_TOASTS — remove oldest
        return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
      });
      return id;
    },
    []
  );

  // Convenience methods
  const toast = {
    success: (title, message) => addToast({ type: "success", title, message }),
    error: (title, message) => addToast({ type: "error", title, message }),
    info: (title, message) => addToast({ type: "info", title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
    custom: addToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal-like container */}
      <div
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
        aria-label="Notificaciones"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;