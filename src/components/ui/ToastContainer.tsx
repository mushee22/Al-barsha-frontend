import React from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { ToastType } from "../../hooks/useToast";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  danger: <XCircle size={16} />,
  info: <Info size={16} />,
};

const styles: Record<ToastType, string> = {
  success: "bg-emerald-800 text-white",
  danger: "bg-red-800 text-white",
  info: "bg-navy text-white",
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 max-w-xs">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-slide-up ${styles[t.type]}`}
        >
          {icons[t.type]}
          <span className="flex-1">{t.message}</span>
          <button
            className="opacity-60 hover:opacity-100 transition-opacity"
            onClick={() => onRemove(t.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
