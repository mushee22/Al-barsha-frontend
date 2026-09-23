import React, { useEffect, useState } from "react";
import QuotationFilterBar from "./QuotationFilterBar";
import QuotationTable from "./QuotationTable";
import { useQuotations } from "../../context/QuotationContext";
import { QuotationFilterState, useQuotationFilter } from "../../hooks/useQuotationFilter";
import QuotationBulkExportModal from "./QuotationBulkExportModal";
import { FileDown } from "lucide-react";

interface QuotationListPageProps {
  onDelete: (id: number) => Promise<void>;
}

const filledFilters = (filters: QuotationFilterState) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => Boolean(value) && value !== "QT-")
  ) as Record<string, string>;

const QuotationListPage: React.FC<QuotationListPageProps> = ({ onDelete }) => {
  const { quotations, quotationsMeta, fetchQuotations, fetching } = useQuotations();
  const { filters, setFilters, clearFilters } = useQuotationFilter();
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchQuotations({
      ...filledFilters(filters),
      page: page.toString(),
    });
  }, [filters, page, fetchQuotations]);

  const totalPages = quotationsMeta?.last_page || 1;
  const total = quotationsMeta?.total || 0;
  const perPage = quotationsMeta?.per_page || 10;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-xl font-bold text-slate-800">Quotations List</h1>
        <button
          onClick={() => setShowExportModal(true)}
          className="btn-base bg-white border border-slate-200 text-slate-600 hover:text-accent hover:border-slate-300 shadow-sm px-4 h-10 transition-all font-bold text-[13px] group"
        >
          <FileDown size={14} className="group-hover:scale-110 transition-transform" />
          Bulk Export
        </button>
      </div>

      <QuotationFilterBar
        filters={filters}
        loading={fetching}
        onChange={(partial) => {
          setFilters((prev) => ({ ...prev, ...partial }));
          setPage(1);
        }}
        onClear={() => {
          clearFilters();
          setPage(1);
        }}
      />
      <QuotationTable
        loading={fetching}
        quotations={quotations}
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={perPage}
        onPageChange={setPage}
        onDelete={onDelete}
      />

      <QuotationBulkExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};

export default QuotationListPage;
