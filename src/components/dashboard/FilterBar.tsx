import React, { useState, useEffect } from "react";
import { Search, X, Hash, User, Loader2 } from "lucide-react";
import { FilterState } from "../../hooks/useInvoiceFilter";

interface FilterBarProps {
  filters: FilterState;
  loading?: boolean;
  onChange: (f: Partial<FilterState>) => void;
  onClear: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, loading, onChange, onClear }) => {
  const [localInv, setLocalInv] = useState(filters.invoice_number || "INV-");
  const [localName, setLocalName] = useState(filters.customer_name || "");

  // Sync internal states when filters are cleared or changed from parent
  useEffect(() => {
    setLocalInv(filters.invoice_number || "INV-");
    setLocalName(filters.customer_name || "");
  }, [filters.invoice_number, filters.customer_name]);

  // Debounce customer name search
  useEffect(() => {
    if (localName === filters.customer_name) return;
    const handler = setTimeout(() => {
      onChange({ customer_name: localName });
    }, 500);
    return () => clearTimeout(handler);
  }, [localName, filters.customer_name, onChange]);

  const handleInvSearch = () => {
    onChange({ invoice_number: localInv });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleInvSearch();
  };

  const hasActive = filters.invoice_number || filters.customer_name || filters.date;

  return (
    <div className="card mb-4">
      <div className="p-4 flex flex-wrap gap-3 items-center">
        {/* Invoice Number */}
        <div className="relative flex-1 min-w-[200px] flex gap-2">
          <div className="relative flex-1">
            <Hash
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              className="input-base pl-9 text-xs"
              type="text"
              placeholder="Invoice No."
              value={localInv}
              onKeyDown={handleKeyDown}
              onChange={(e) => setLocalInv(e.target.value)}
            />
          </div>
          <button
            onClick={handleInvSearch}
            className="btn-base bg-accent text-white px-3 hover:bg-accent-hover transition-colors"
            title="Search by invoice number"
          >
            <Search size={14} />
          </button>
        </div>

        {/* Customer Name */}
        <div className="relative flex-[2] min-w-[240px]">
          {loading ? (
            <Loader2
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-accent animate-spin pointer-events-none"
            />
          ) : (
            <User
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          )}
          <input
            className="input-base pl-9 text-xs"
            type="text"
            placeholder="Customer Name"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
          />
        </div>

        {/* Date */}
        <input
          className="input-base w-auto text-xs h-[38px]"
          type="date"
          value={filters.date}
          onChange={(e) => onChange({ date: e.target.value })}
          title="Filter by date"
        />

        {/* Clear */}
        {hasActive && (
          <button
            className="btn-base bg-transparent text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700 text-[11px] px-3 py-2 h-[38px]"
            onClick={onClear}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
