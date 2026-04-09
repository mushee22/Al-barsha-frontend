import React, { useState } from "react";
import { Menu, Plus, LogOut, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GlobalSearchModal from "../ui/GlobalSearchModal";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isCreate = location.pathname === "/invoices/create";
  const isEdit = location.pathname.match(/^\/invoices\/\d+\/edit$/);
  const isForm = isCreate || isEdit;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center px-5 gap-3 h-[60px]">
      <button
        className="lg:hidden p-1 text-slate-500 hover:text-slate-800"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </button>

      {/* Title / Breadcrumb */}
      <div className="flex-1 flex items-center gap-2 text-sm">
        {/* {isForm ? (
          <>
            <button
              className="text-slate-400 hover:text-accent font-medium transition-colors"
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-bold text-slate-800">
              {isEdit ? `Edit Invoice` : "Create Invoice"}
            </span>
          </>
        ) : (
          <>
            <span className="font-bold text-base text-slate-800">Dashboard</span>
            <span className="text-slate-400 font-normal text-sm ml-1">Billing Overview</span>
          </>
        )} */}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {isForm ? (
          <button
            className="btn-base bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs px-3 py-1.5"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-accent transition-all"
              onClick={() => setIsSearchOpen(true)}
              title="Search Invoice globally"
            >
              <Search size={18} />
            </button>
            <button
              className="btn-base bg-accent hover:bg-accent-hover text-white"
              onClick={() => navigate("/invoices/create")}
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Invoice</span>
            </button>
            <button
              className="btn-base bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-1.5"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      <GlobalSearchModal
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};

export default Topbar;
