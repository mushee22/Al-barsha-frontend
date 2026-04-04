import { Check, Loader2 } from "lucide-react";
import { LineItem } from "../../types";
import { calcTotal, fmtAED, numberToWords } from "../../utils";

interface InvoiceSummaryProps {
  invoice_number: string;
  date: string;
  customer_name: string;
  items: LineItem[];
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
  isSaving?: boolean;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  invoice_number,
  date,
  customer_name,
  items,
  onSave,
  onCancel,
  isEdit,
  isSaving = false,
}) => {
  const total = calcTotal(items);
  const filledRows = items.filter((i) => i.product_name.trim()).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Total summary card */}
      <div className="rounded-2xl bg-navy text-white overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <p className="font-bold text-sm">Invoice Summary</p>
        </div>
        <div className="px-5 py-5">
          {/* Row count */}
          <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 mb-5">
            <span className="text-xs text-white/60">Descriptions</span>
            <span className="font-bold text-white text-sm">{filledRows} / {items.length}</span>
          </div>

          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-white/60">Subtotal</span>
            <span className="text-sm text-white/80">{fmtAED(total)}</span>
          </div>
          <div className="flex justify-between items-center pt-3 mt-2 border-t border-white/15">
            <span className="font-bold text-base">Total (AED)</span>
            <span className="font-bold text-xl">{fmtAED(total)}</span>
          </div>
          <p className="text-[10px] text-white/35 mt-3 leading-relaxed">{numberToWords(total)}</p>
        </div>
      </div>

      {/* Invoice info card */}
      <div className="card">
        <div className="card-header">
          <span className="font-bold text-sm">Invoice Info</span>
        </div>
        <div className="px-5 divide-y divide-slate-100">
          {[
            { label: "Invoice No.", value: invoice_number || "—" },
            { label: "Date", value: date || "—" },
            { label: "Customer", value: customer_name || "—" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-2.5 gap-4">
              <span className="text-xs text-slate-400 flex-shrink-0">{row.label}</span>
              <span className="text-xs font-semibold text-slate-700 text-right break-all">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="card">
        <div className="card-body flex flex-col gap-2.5">
          <button
            disabled={isSaving}
            className="btn-base bg-navy hover:bg-navy-light text-white w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={onSave}
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {isSaving ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Invoice" : "Save Invoice")}
          </button>
          <button
            disabled={isSaving}
            className="btn-base bg-transparent text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
