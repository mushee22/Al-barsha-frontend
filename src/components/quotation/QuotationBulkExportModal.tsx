import React, { useState } from "react";
import { FileDown, X, Loader2, Calendar } from "lucide-react";
import { apiDownloadFile, triggerBlobDownload } from "../../utils/api";
import { useToast } from "../../hooks/useToast";

interface QuotationBulkExportModalProps {
  open: boolean;
  onClose: () => void;
}

const QuotationBulkExportModal: React.FC<QuotationBulkExportModalProps> = ({ open, onClose }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!open) return null;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string> = {};
    if (startDate) payload.start_date = startDate;
    if (endDate) payload.end_date = endDate;

    try {
      setLoading(true);
      const { blob, filename } = await apiDownloadFile("/quotations/bulk-export", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const fallback = [
        "quotations_export",
        startDate || "all",
        "to",
        endDate || "all",
      ].join("_") + ".zip";

      triggerBlobDownload(blob, filename || fallback);

      showToast("Export successful! Your download should start shortly.", "success");
      onClose();
    } catch (err: any) {
      console.error("Export failed:", err);
      showToast(err.message || "Failed to export quotations", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <FileDown size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">Bulk Export</h2>
              <p className="text-xs text-slate-400 font-medium">Optional date range for quotations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleExport} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Start Date</label>
              <div className="relative group">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-accent transition-colors" />
                <input
                  type="date"
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-xl text-sm font-semibold outline-none transition-all"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">End Date</label>
              <div className="relative group">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-accent transition-colors" />
                <input
                  type="date"
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5 rounded-xl text-sm font-semibold outline-none transition-all"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent hover:bg-accent-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating Export...
                </>
              ) : (
                <>
                  <FileDown size={18} />
                  Initiate Bulk Export
                </>
              )}
            </button>
          </div>
        </form>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl">
          <p className="text-[11px] text-slate-400 text-center leading-relaxed italic">
            Note: Dates are optional. Leave them empty to export all quotations as a ZIP file.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotationBulkExportModal;
