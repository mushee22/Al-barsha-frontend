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
import QuotationListPage from "./components/quotation/QuotationListPage";
import QuotationFormPage from "./components/quotation/QuotationFormPage";
import QuotationDetailPage from "./components/quotation/QuotationDetailPage";
import { QuotationProvider, useQuotations } from "./context/QuotationContext";
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
  const { deleteQuotation } = useQuotations();
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

  const handleDeleteQuotation = async (id: number) => {
    try {
      await deleteQuotation(id);
      showToast("Quotation deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete quotation", "danger");
      throw err;
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

                  <Route path="/quotations" element={<QuotationListPage onDelete={handleDeleteQuotation} />} />
                  <Route path="/quotations/create" element={<QuotationFormPage onToast={showToast} />} />
                  <Route path="/quotations/:id" element={<QuotationDetailPage />} />
                  <Route path="/quotations/:id/edit" element={<QuotationFormPage onToast={showToast} />} />

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
      <QuotationProvider>
        <AppShell />
      </QuotationProvider>
    </AppProvider>
  </AuthProvider>
);

export default App;

