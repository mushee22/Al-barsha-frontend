import React, { useState } from "react";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import { apiFetch } from "../../utils/api";
import { useNavigate } from "react-router-dom";

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState("INV-");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!open) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query || query === "INV-") return;

    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(`/invoices?invoice_number=${query.trim()}`);
      const results = response.data || [];
      
      if (results.length > 0) {
        const invoice = results[0];
        onClose();
        navigate(`/invoices/${invoice.id}`);
      } else {
        setError("Invoice not found. Please check the number.");
      }
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Global Invoice Search</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={20} />
              </div>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Invoice Number (e.g. INV-20260329-0001)"
                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-accent focus:bg-white rounded-2xl pl-12 pr-4 py-4 text-lg font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-3 rounded-xl animate-in slide-in-from-top-2 duration-200">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !query || query === "INV-"}
                className="flex-[2] btn-base bg-accent hover:bg-accent-hover text-white justify-center py-3.5 rounded-2xl shadow-lg shadow-accent/25 disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Search size={18} />
                    <span>Quick Find</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 text-center font-medium uppercase tracking-wider">
            Tip: Press Enter to search instantly
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
