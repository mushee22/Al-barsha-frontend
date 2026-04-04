import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import DashboardPage from "./components/dashboard/DashboardPage";
import InvoiceFormPage from "./components/invoice/InvoiceFormPage";
import LoginPage from "./components/auth/LoginPage";
import StaffPage from "./components/staff/StaffPage";
import StaffFormPage from "./components/staff/StaffFormPage";
import SettingsPage from "./components/settings/SettingsPage";
import InvoiceDetailPage from "./components/invoice/InvoiceDetailPage";
import ToastContainer from "./components/ui/ToastContainer";
import { useToast } from "./hooks/useToast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { invoices } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f0f4f9]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        totalInvoices={invoices.length}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppShell: React.FC = () => {
  const { deleteInvoice } = useApp();
  const { toasts, showToast, removeToast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id);
      showToast("Invoice deleted", "danger");
    } catch (err) {
      showToast("Failed to delete invoice", "danger");
      throw err; // Re-throw to let the caller (InvoiceTable) know it failed
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage onDelete={handleDelete} />} />
                  <Route path="/invoices" element={<DashboardPage onDelete={handleDelete} />} />
                  <Route path="/invoices/create" element={<InvoiceFormPage onToast={showToast} />} />
                  <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
                  <Route path="/invoices/:id/edit" element={<InvoiceFormPage onToast={showToast} />} />

                  {/* Staff Routes */}
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/staff/create" element={<StaffFormPage />} />
                  <Route path="/staff/:id/edit" element={<StaffFormPage />} />

                  <Route path="/settings" element={<SettingsPage />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Router>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppProvider>
      <AppShell />
    </AppProvider>
  </AuthProvider>
);

export default App;

