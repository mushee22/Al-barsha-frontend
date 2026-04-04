import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { Staff, StaffResponse, PaginationMeta } from "../../types/staff";
import ConfirmModal from "../ui/ConfirmModal";
import { useToast } from "../../hooks/useToast";

const StaffPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStaff(currentPage);
  }, [currentPage]);

  const fetchStaff = async (page: number) => {
    try {
      setLoading(true);
      const response: StaffResponse = await apiFetch(`/staff?page=${page}`);
      setStaffList(response.data || []);
      setPagination(response.meta || null);
    } catch (err) {
      console.error("Failed to load staff:", err);
      showToast("Failed to load staff", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await apiFetch(`/staff/${deleteTarget.id}`, { method: "DELETE" });
      showToast("Staff deleted successfully", "success");
      fetchStaff(currentPage);
    } catch (err) {
      console.error("Failed to delete staff:", err);
      showToast("Failed to delete staff", "danger");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };
  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.last_page) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">Staff Management</h1>
        <button
          onClick={() => navigate("/staff/create")}
          className="btn-base bg-accent hover:bg-accent-hover text-white flex items-center gap-2"
        >
          <Plus size={16} />
          Add Staff
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading staff...</div>
        ) : staffList.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No staff members found. Click "Add Staff" to create one.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Signature
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr
                      key={staff.id}
                      className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold text-sm text-slate-800">
                        {staff.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {staff.phone}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          {staff.signature_url ? (
                            <div className="w-20 h-10 border border-slate-200 rounded flex items-center justify-center bg-white overflow-hidden p-1 shadow-sm">
                              <img
                                src={staff.signature_url}
                                alt={`${staff.name}'s Signature`}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 italic">
                              No signature
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            title="Edit"
                            onClick={() => navigate(`/staff/${staff.id}/edit`)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 transition-all hover:border-blue-200 hover:text-accent hover:bg-blue-50"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setDeleteTarget(staff)}
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
              {staffList.map((staff) => (
                <div key={staff.id} className="p-4 bg-white animate-slide-up">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                          {staff.name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <p className="font-bold text-slate-800 leading-tight">{staff.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{staff.phone || "No phone"}</p>
                       </div>
                    </div>
                    <div className="flex gap-1.5">
                       <button
                         onClick={() => navigate(`/staff/${staff.id}/edit`)}
                         className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400"
                       >
                         <Pencil size={13} />
                       </button>
                       <button
                         onClick={() => setDeleteTarget(staff)}
                         className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-red-300"
                       >
                         <Trash2 size={13} />
                       </button>
                    </div>
                  </div>

                  {staff.signature_url && (
                    <div className="mt-4 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Signature</span>
                       <div className="h-10 w-24 bg-white rounded border border-slate-100 p-1">
                          <img src={staff.signature_url} className="w-full h-full object-contain" alt="Signature" />
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.last_page > 1 && (
              <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-3">
                <div className="text-xs text-slate-500">
                  Showing <span className="font-semibold">{pagination.from}</span> to{" "}
                  <span className="font-semibold">{pagination.to}</span> of{" "}
                  <span className="font-semibold">{pagination.total}</span> staff
                </div>
                
                {/* Desktop Version */}
                <div className="hidden sm:flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:bg-slate-50"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
                    (p) => {
                       if (pagination.last_page > 7) {
                          if (p !== 1 && p !== pagination.last_page && Math.abs(p - currentPage) > 1) {
                             if (p === 2 || p === pagination.last_page - 1) return <span key={p} className="w-8 h-8 flex items-center justify-center text-slate-300">...</span>;
                             return null;
                          }
                       }
                       return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 flex items-center justify-center rounded border text-xs font-medium transition-colors ${
                            currentPage === p
                              ? "bg-accent border-accent text-white"
                              : "bg-white border-slate-200 text-slate-600 hover:border-accent hover:text-accent"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:bg-slate-50"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Mobile Version */}
                <div className="flex sm:hidden gap-2">
                   <button
                     onClick={() => handlePageChange(currentPage - 1)}
                     disabled={currentPage === 1}
                     className="px-4 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-50"
                   >
                     Prev
                   </button>
                   <button
                     onClick={() => handlePageChange(currentPage + 1)}
                     disabled={currentPage === pagination.last_page}
                     className="px-4 h-8 flex items-center justify-center rounded border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-50"
                   >
                     Next
                   </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        loading={isDeleting}
        message={`Staff member "${deleteTarget?.name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default StaffPage;
