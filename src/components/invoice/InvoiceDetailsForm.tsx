import React, { useEffect, useState } from "react";
import { FileText, UserCheck, Hash } from "lucide-react";
import { apiFetch } from "../../utils/api";
import { Staff } from "../../types/staff";

interface InvoiceDetailsFormProps {
  invoice_number: string;
  date: string;
  customer_name: string;
  staff_id: number;
  onChange: (field: string, value: any) => void;
}

const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  invoice_number,
  date,
  customer_name,
  staff_id,
  onChange,
}) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const response = await apiFetch("/staff");
        setStaffList(response.data || []);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="card mb-5">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <FileText size={14} />
          </div>
          <span className="font-bold text-sm">Invoice Details</span>
        </div>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Row 1: Invoice No (Full Width if exists) or Customer Name */}
          {invoice_number ? (
            <>
              {/* If Edit Mode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Hash size={10} /> Invoice No.
                </label>
                <div className="input-base bg-slate-50 font-mono text-slate-500 cursor-not-allowed">
                  {invoice_number}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  className="input-base"
                  type="date"
                  value={date}
                  onChange={(e) => onChange("date", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="input-base"
                  placeholder="Full customer name"
                  value={customer_name}
                  onChange={(e) => onChange("customer_name", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              {/* If Creation Mode */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Customer Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="input-base"
                  placeholder="Full customer name"
                  value={customer_name}
                  onChange={(e) => onChange("customer_name", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Row 2 (Creation) or Row 3 (Edit): Staff and Date (if creation) / Staff (if edit) */}
          <div className={!invoice_number ? "flex flex-col gap-1.5" : "flex flex-col gap-1.5 sm:col-span-2"}>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              Assigned Staff <span className="text-red-400">*</span>
              {loadingStaff && <span className="text-[10px] lowercase text-slate-400 animate-pulse">(Loading...)</span>}
            </label>
            <div className="relative">
              <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                className="input-base pl-9 appearance-none"
                value={staff_id || ""}
                onChange={(e) => onChange("staff_id", Number(e.target.value))}
                required
              >
                <option value="" disabled>Select a staff member</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!invoice_number && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                className="input-base"
                type="date"
                value={date}
                onChange={(e) => onChange("date", e.target.value)}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
