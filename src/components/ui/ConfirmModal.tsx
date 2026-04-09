import { useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";

const DELETE_CONFIRM_PASSWORD =
  process.env.REACT_APP_DELETE_PASSWORD ?? "password123";

interface ConfirmModalProps {
  open: boolean;
  loading?: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  /** When true (e.g. invoice list), Delete requires typing the configured password. */
  requireDeletePassword?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  loading = false,
  title = "Confirm Delete",
  message,
  confirmLabel = "Delete",
  requireDeletePassword = false,
  onConfirm,
  onCancel,
}) => {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open) {
      setPassword("");
    }
  }, [open]);

  if (!open) return null;

  const passwordOk =
    !requireDeletePassword ||
    password.trim() === DELETE_CONFIRM_PASSWORD;
  const canDelete = !loading && passwordOk;

  const handleConfirm = () => {
    if (canDelete) onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
            <Trash2 size={26} strokeWidth={1.8} />
          </div>
          <h2 className="text-base font-bold mb-2">{title}</h2>
          <p className={`text-sm text-slate-500 ${requireDeletePassword ? "mb-4" : ""}`}>
            {message}
          </p>
          {requireDeletePassword && (
            <>
              <label className="block text-left text-xs font-medium text-slate-600 mb-1.5">
                Type the delete password to continue
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                placeholder="Password"
                tabIndex={-1}
                name="confirm-password-to-delete"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canDelete) {
                    e.preventDefault();
                    handleConfirm();
                  }
                }}
              />
            </>
          )}
        </div>
        <div className="px-6 pb-6 flex gap-2 justify-end">
          <button
            disabled={loading}
            className="btn-base bg-transparent text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            disabled={!canDelete}
            className="btn-base bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
