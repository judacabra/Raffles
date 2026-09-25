import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeToast } from "../store/slices/uiSlice";

const icons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const colors = {
  success: { bg: "#F0FFF4", border: "#48BB78", text: "#276749", icon: "#48BB78" },
  error:   { bg: "#FFF5F5", border: "#FC8181", text: "#9B2C2C", icon: "#FC8181" },
  warning: { bg: "#FFFFF0", border: "#ECC94B", text: "#7B6B00", icon: "#ECC94B" },
  info:    { bg: "#EBF8FF", border: "#63B3ED", text: "#2C5282", icon: "#63B3ED" },
};

export default function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((s) => s.ui.toasts);

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => dispatch(removeToast(toast.id))} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: { id: string; type: "success" | "error" | "warning" | "info"; message: string }; onRemove: () => void }) {
  const c = colors[toast.type];

  useEffect(() => {
    const t = setTimeout(onRemove, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="animate-toast-in"
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 8, padding: "12px 16px",
        boxShadow: "0 4px 12px #0000001A",
        fontFamily: "var(--font-sans)", fontSize: 14, color: c.text,
        cursor: "pointer",
      }}
      onClick={onRemove}
    >
      <span style={{ width: 24, height: 24, borderRadius: "50%", background: c.icon, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 700 }}>
        {icons[toast.type]}
      </span>
      <span style={{ flex: 1, fontWeight: 500 }}>{toast.message}</span>
      <span style={{ opacity: 0.5, fontSize: 18, lineHeight: 1 }}>×</span>
    </div>
  );
}
