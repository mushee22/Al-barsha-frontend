import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Invoice } from "../../types";
import { fmtAED, calcTotal, numberToWords } from "../../utils";
import { ArrowLeft, Pencil, FileDown, Receipt, User, Calendar, Briefcase, Info } from "lucide-react";

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice } = useApp();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const loadInvoice = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getInvoice(Number(id));
      setInvoice(data || null);
    } catch (err) {
      console.error("Failed to load invoice", err);
    } finally {
      setLoading(false);
    }
  }, [id, getInvoice]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="card p-10 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Info size={32} />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">Invoice Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate("/invoices")}
          className="btn-base bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const total = calcTotal(invoice.items);

  return (
    <div className="max-w-5xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/invoices")}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex flex-wrap items-center gap-x-2">
              <span className="text-accent">Invoice</span> {invoice.invoice_number}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">Internal Reference Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.open(`${invoice.pdf_url}?download=1`, "_blank")}
            className="flex-1 sm:flex-none btn-base bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm justify-center"
          >
            <FileDown size={16} />
            <span className="sm:inline">PDF</span>
          </button>
          <button 
            onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
            className="flex-[2] sm:flex-none btn-base bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 justify-center"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Grid */}
          <div className="card p-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Customer</p>
                  <p className="font-bold text-slate-800">{invoice.customer_name}</p>
                </div>
              </div>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Staff In-Charge</p>
                  <p className="font-bold text-slate-800 leading-tight">{invoice.staff?.name || "Unassigned"}</p>
                  {invoice.staff?.phone && (
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{invoice.staff.phone}</p>
                  )}
                </div>
              </div>
              <div className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Invoice Date</p>
                  <p className="font-bold text-slate-800">{invoice.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-accent" />
                <h3 className="font-bold text-sm text-slate-800">Billed Items</h3>
              </div>
            </div>
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3 w-12 text-center">#</th>
                    <th className="px-5 py-3 text-left">Description</th>
                    <th className="px-5 py-3 text-center w-24">Qty</th>
                    <th className="px-5 py-3 text-right w-32">Unit Price</th>
                    <th className="px-5 py-3 text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-5 py-4 text-xs font-bold text-slate-300 text-center">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">{item.product_name}</p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-sm text-slate-500 font-medium">{fmtAED(Number(item.unit_price))}</td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-800">{fmtAED(Number(item.quantity) * Number(item.unit_price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card List */}
            <div className="md:hidden divide-y divide-slate-100">
              {invoice.items.map((item, idx) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Item #{idx + 1}</span>
                    <span className="text-xs font-bold text-slate-800">{fmtAED(Number(item.quantity) * Number(item.unit_price))}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 line-clamp-2 leading-snug">{item.product_name}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty:</span>
                       <span className="text-xs font-bold text-slate-800">{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price:</span>
                       <span className="text-xs font-semibold text-slate-500">{fmtAED(Number(item.unit_price))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="card bg-navy text-white overflow-hidden p-0">
            <div className="p-6 border-b border-white/10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Total Amount Due</p>
              <h2 className="text-4xl font-bold mb-1 tracking-tight">{fmtAED(total)}</h2>
              <p className="text-[11px] font-medium text-white/40 italic leading-relaxed">
                {numberToWords(total)}
              </p>
            </div>
            <div className="p-6 bg-white/5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="font-semibold text-white/90">{fmtAED(total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Service Tax (0%)</span>
                <span className="font-semibold text-white/90">{fmtAED(0)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-base font-bold text-white/80">Grand Total</span>
                <span className="text-xl font-bold text-white">{fmtAED(total)}</span>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-slate-50 border-none shadow-inner">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button 
                onClick={() => window.open(invoice.pdf_url, "_blank")}
                className="w-full btn-base bg-white border border-slate-200 text-slate-600 hover:text-accent justify-start px-4"
              >
                <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center mr-1">
                  <Receipt size={12} />
                </div>
                View PDF File
              </button>
              <button 
                onClick={() => window.location.href = `tel:${invoice.staff?.phone || ""}`}
                className="w-full btn-base bg-white border border-slate-200 text-slate-600 hover:text-accent justify-start px-4"
                disabled={!invoice.staff?.phone}
              >
                <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center mr-1">
                  <User size={12} />
                </div>
                Contact Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
