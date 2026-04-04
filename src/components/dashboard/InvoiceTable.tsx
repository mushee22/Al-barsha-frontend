import React, { useState } from "react";
import { Eye, Pencil, Trash2, FileText, ChevronLeft, ChevronRight, Loader2, FileDown } from "lucide-react";
import { Invoice } from "../../types";
import { calcTotal, fmtAED } from "../../utils";
import ConfirmModal from "../ui/ConfirmModal";
import { useNavigate } from "react-router-dom";

interface InvoiceTableProps {
  invoices: Invoice[];
  loading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
  onDelete: (id: number) => Promise<void>;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  loading,
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const handleDelete = async () => {
    if (deleteTarget) {
      setIsDeleting(true);
      try {
        await onDelete(deleteTarget.id);
        setDeleteTarget(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (total === 0) {
    return (
      <div className="card relative min-h-[200px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
            <Loader2 size={32} className="text-accent animate-spin" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading...</span>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center text-slate-400">
            <FileText size={44} strokeWidth={1.2} className="mb-3 opacity-25" />
            <p className="font-semibold text-sm mb-1 text-slate-500">No invoices found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="card relative overflow-hidden transition-all duration-300">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-accent animate-spin" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating...</span>
            </div>
          </div>
        )}
        {/* Table header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm text-slate-800">Invoices</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {start}–{end} of {total} invoice{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Invoice No.</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Items</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Amount (AED)</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-bold text-accent text-xs tracking-wide">
                      {inv.invoice_number}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-sm text-slate-800">{inv.customer_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 md:hidden">{inv.date}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500 hidden md:table-cell whitespace-nowrap">
                    {inv.date}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-400 hidden lg:table-cell">
                    {inv.items.length} item{inv.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="font-bold text-sm text-slate-800">
                      {fmtAED(calcTotal(inv.items))}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <button
                        title="View Details"
                        onClick={() => navigate(`/invoices/${inv.id}`)}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-all hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        title="Download PDF"
                        onClick={() => window.open(`${inv.pdf_url}?download=1`, "_blank")}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-all hover:border-amber-200 hover:text-amber-600 hover:bg-amber-50"
                      >
                        <FileDown size={13} />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => navigate(`/invoices/${inv.id}/edit`)}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-all hover:border-blue-200 hover:text-accent hover:bg-blue-50"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setDeleteTarget(inv)}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-all hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-accent text-xs tracking-wide">
                  {inv.invoice_number}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {inv.date}
                </span>
              </div>
              
              <div>
                <p className="font-bold text-slate-800 line-clamp-1">{inv.customer_name}</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Amount</p>
                  <p className="font-bold text-navy">
                    {fmtAED(calcTotal(inv.items))}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                  className="flex-1 h-9 rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Eye size={14} className="text-slate-400" />
                  View
                </button>
                <button
                  onClick={() => window.open(`${inv.pdf_url}?download=1`, "_blank")}
                  className="flex-1 h-9 rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <FileDown size={14} className="text-slate-400" />
                  PDF
                </button>
                <button
                  onClick={() => navigate(`/invoices/${inv.id}/edit`)}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(inv)}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:border-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400 whitespace-nowrap">
              Page {page} of {totalPages}
            </p>
            
            {/* Desktop Pagination */}
            <div className="hidden sm:flex gap-1.5">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Logic to show limited number of pages (e.g. current, first, last, and neighbours)
                if (totalPages > 7) {
                   if (p !== 1 && p !== totalPages && Math.abs(p - page) > 1) {
                      if (p === 2 || p === totalPages - 1) return <span key={p} className="w-8 h-8 flex items-center justify-center text-slate-300">...</span>;
                      return null;
                   }
                }
                return (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-all ${p === page
                        ? "bg-navy border-navy text-white"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Mobile Pagination */}
            <div className="flex sm:hidden gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 disabled:opacity-40 transition-all"
              >
                Prev
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        open={!!deleteTarget}
        loading={isDeleting}
        message={`Invoice ${deleteTarget?.invoice_number} for "${deleteTarget?.customer_name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default InvoiceTable;
