import React, { useState, useEffect } from "react";
import { Search, X, Hash, User, Loader2 } from "lucide-react";
import { QuotationFilterState } from "../../hooks/useQuotationFilter";

interface QuotationFilterBarProps {
  filters: QuotationFilterState;
  loading?: boolean;
  onChange: (f: Partial<QuotationFilterState>) => void;
  onClear: () => void;
}

const isFilledNumber = (value?: string) => Boolean(value && value !== "QT-");

const QuotationFilterBar: React.FC<QuotationFilterBarProps> = ({ filters, loading, onChange, onClear }) => {
  const [localNumber, setLocalNumber] = useState(filters.quotation_number || "QT-");
  const [localName, setLocalName] = useState(filters.customer_name || "");

  useEffect(() => {
    setLocalNumber(filters.quotation_number || "QT-");
    setLocalName(filters.customer_name || "");
  }, [filters.quotation_number, filters.customer_name]);

  useEffect(() => {
    if (localName === filters.customer_name) return;
    const handler = setTimeout(() => {
      onChange({ customer_name: localName });
    }, 500);
    return () => clearTimeout(handler);
  }, [localName, filters.customer_name, onChange]);

  const handleNumberSearch = () => {
    onChange({ quotation_number: isFilledNumber(localNumber) ? localNumber : "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNumberSearch();
  };

  const hasActive = isFilledNumber(filters.quotation_number) || filters.customer_name || filters.date;

  return (
    <div className="card mb-4">
      <div className="p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] flex gap-2">
          <div className="relative flex-1">
            <Hash
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              className="input-base pl-9 text-xs"
              type="text"
              placeholder="Quotation No."
              value={localNumber}
              onKeyDown={handleKeyDown}
              onChange={(e) => setLocalNumber(e.target.value)}
            />
          </div>
          <button
            onClick={handleNumberSearch}
            className="btn-base bg-accent text-white px-3 hover:bg-accent-hover transition-colors"
            title="Search by quotation number"
          >
            <Search size={14} />
          </button>
        </div>

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
            name="customer_name"
            autoComplete="do-not-autofill"
            placeholder="Customer Name"
            value={localName}
            tabIndex={-1}
            onChange={(e) => setLocalName(e.target.value)}
          />
        </div>

        <input
          className="input-base w-auto text-xs h-[38px]"
          type="date"
          value={filters.date}
          onChange={(e) => onChange({ date: e.target.value })}
          title="Filter by date"
        />

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

export default QuotationFilterBar;
