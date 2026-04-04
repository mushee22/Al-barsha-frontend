import React from "react";
import { LayoutDashboard, FileText, PlusCircle, Users, X, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  totalInvoices: number;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, totalInvoices }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      label: "All Invoices",
      icon: <FileText size={16} />,
      path: "/invoices",
    },
    {
      label: "Create Invoice",
      icon: <PlusCircle size={16} />,
      path: "/invoices/create",
    },
    {
      label: "Staff Users",
      icon: <Users size={16} />,
      path: "/staff",
    },
    {
      label: "Settings",
      icon: <Settings size={16} />,
      path: "/settings",
    },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-navy flex flex-col z-50
          transition-transform duration-250
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center font-serif text-lg font-bold text-white flex-shrink-0">
              B
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Al Barsha</p>
              <p className="text-[10px] text-white/40 mt-0.5">Documents Typing &amp; Copying</p>
            </div>
            <button
              className="ml-auto lg:hidden text-white/50 hover:text-white p-1"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
            Main
          </p>
          {navItems.map((item) => {
            const isInvoiceEdit = location.pathname.match(/^\/invoices\/\d+\/edit$/);
            const isStaffEdit = location.pathname.match(/^\/staff\/\d+\/edit$/) || location.pathname === '/staff/create';
            const active =
              item.path === '/' ? location.pathname === '/' :
                item.path === '/invoices' ? location.pathname === '/invoices' || isInvoiceEdit :
                  item.path === '/invoices/create' ? location.pathname === '/invoices/create' :
                    item.path === '/staff' ? location.pathname === '/staff' || isStaffEdit :
                      item.path === '/settings' ? location.pathname === '/settings' : false;

            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`
                  w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                  border-l-[3px] transition-all text-left
                  ${active
                    ? "bg-accent/25 text-white border-accent"
                    : "text-white/60 border-transparent hover:bg-white/7 hover:text-white"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/8 text-[11px] text-white/30">
          Al Barsha Admin © 2025
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
