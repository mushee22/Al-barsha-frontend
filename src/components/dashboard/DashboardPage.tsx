import React, { useEffect, useState } from "react";
import FilterBar from "../dashboard/FilterBar";
import InvoiceTable from "../dashboard/InvoiceTable";
import { useApp } from "../../context/AppContext";
import { useInvoiceFilter } from "../../hooks/useInvoiceFilter";
import BulkExportModal from "../invoice/BulkExportModal";
import { FileDown } from "lucide-react";

interface DashboardPageProps {
  onDelete: (id: number) => Promise<void>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onDelete }) => {
  const { invoices, invoicesMeta, fetchInvoices, fetching } = useApp();
  const { filters, setFilters, clearFilters } = useInvoiceFilter();
  const [page, setPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = {
      ...filters,
      page: page.toString(),
    };
    fetchInvoices(params);
  }, [filters, page, fetchInvoices]);

  const totalPages = invoicesMeta?.last_page || 1;
  const total = invoicesMeta?.total || 0;
  const perPage = invoicesMeta?.per_page || 10;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-xl font-bold text-slate-800">Invoices List</h1>
        <button 
          onClick={() => setShowExportModal(true)}
          className="btn-base bg-white border border-slate-200 text-slate-600 hover:text-accent hover:border-slate-300 shadow-sm px-4 h-10 transition-all font-bold text-[13px] group"
        >
          <FileDown size={14} className="group-hover:scale-110 transition-transform" />
          Bulk Export
        </button>
      </div>

      <FilterBar
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
      <InvoiceTable
        loading={fetching}
        invoices={invoices}
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={perPage}
        onPageChange={setPage}
        onDelete={onDelete}
      />

      <BulkExportModal 
        open={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
};

export default DashboardPage;
