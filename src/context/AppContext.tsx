import React, { createContext, useContext, useState, useCallback } from "react";
import { Invoice, InvoiceResponse, PaginationMeta } from "../types";
import { apiFetch } from "../utils/api";

interface AppContextValue {
  invoices: Invoice[];
  invoicesMeta: PaginationMeta | null;
  fetching: boolean;
  addInvoice: (inv: Partial<Invoice>) => Promise<void>;
  updateInvoice: (id: number, inv: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: number) => Promise<void>;
  getInvoice: (id: number) => Promise<Invoice | undefined>;
  fetchInvoices: (params?: Record<string, string>) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesMeta, setInvoicesMeta] = useState<PaginationMeta | null>(null);
  const [fetching, setFetching] = useState(false);

  const fetchInvoices = useCallback(async (params: Record<string, string> = {}) => {
    setFetching(true);
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = query ? `/invoices?${query}` : "/invoices";
      const response: InvoiceResponse = await apiFetch(endpoint);
      setInvoices(response.data || []);
      setInvoicesMeta(response.meta || null);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    } finally {
      setFetching(false);
    }
  }, []);

  const addInvoice = useCallback(async (inv: Partial<Invoice>) => {
    try {
      const response = await apiFetch("/invoices", {
        method: "POST",
        body: JSON.stringify(inv),
      });
      // fetchInvoices will be handled by the page's useEffect or subsequent navigation
      return response;
    } catch (err) {
      console.error("Failed to add invoice:", err);
      throw err;
    }
  }, []);

  const updateInvoice = useCallback(async (id: number, inv: Partial<Invoice>) => {
    try {
      const response = await apiFetch(`/invoices/${id}`, {
        method: "POST",
        body: JSON.stringify({ ...inv, _method: "PUT" }),
      });
      // fetchInvoices will be handled by the page's useEffect or subsequent navigation
      return response;
    } catch (err) {
      console.error("Failed to update invoice:", err);
      throw err;
    }
  }, []);

  const deleteInvoice = useCallback(async (id: number) => {
    try {
      await apiFetch(`/invoices/${id}`, { method: "DELETE" });
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      throw err;
    }
  }, []);

  const getInvoice = useCallback(
    async (id: number) => {
      try {
        const response = await apiFetch(`/invoices/${id}`);
        // Endpoint returns a single invoice directly in data item
        return response.data;
      } catch (err) {
        console.error("Failed to get invoice:", err);
        return undefined;
      }
    },
    []
  );

  // We remove the auto-fetch useEffect here.
  //DashboardPage's useEffect will handle the initial fetch with default filters.

  return (
    <AppContext.Provider
      value={{ invoices, invoicesMeta, fetching, addInvoice, updateInvoice, deleteInvoice, getInvoice, fetchInvoices }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
