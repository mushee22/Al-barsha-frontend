import React, { createContext, useContext, useState, useCallback } from "react";
import { Quotation, QuotationPayload, QuotationResponse, PaginationMeta } from "../types";
import { apiFetch } from "../utils/api";

interface QuotationContextValue {
  quotations: Quotation[];
  quotationsMeta: PaginationMeta | null;
  fetching: boolean;
  addQuotation: (quotation: QuotationPayload) => Promise<any>;
  updateQuotation: (id: number, quotation: QuotationPayload) => Promise<any>;
  deleteQuotation: (id: number) => Promise<void>;
  getQuotation: (id: number) => Promise<Quotation | undefined>;
  fetchQuotations: (params?: Record<string, string>) => Promise<void>;
}

const QuotationContext = createContext<QuotationContextValue | null>(null);

const filledParams = (params: Record<string, string> = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== "" && value != null));

export const QuotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [quotationsMeta, setQuotationsMeta] = useState<PaginationMeta | null>(null);
  const [fetching, setFetching] = useState(false);

  const fetchQuotations = useCallback(async (params: Record<string, string> = {}) => {
    setFetching(true);
    try {
      const query = new URLSearchParams(filledParams(params)).toString();
      const endpoint = query ? `/quotations?${query}` : "/quotations";
      const response: QuotationResponse = await apiFetch(endpoint);
      setQuotations(response.data || []);
      setQuotationsMeta(response.meta || null);
    } catch (err) {
      console.error("Failed to fetch quotations:", err);
    } finally {
      setFetching(false);
    }
  }, []);

  const addQuotation = useCallback(async (quotation: QuotationPayload) => {
    try {
      return await apiFetch("/quotations", {
        method: "POST",
        body: JSON.stringify(quotation),
      });
    } catch (err) {
      console.error("Failed to add quotation:", err);
      throw err;
    }
  }, []);

  const updateQuotation = useCallback(async (id: number, quotation: QuotationPayload) => {
    try {
      return await apiFetch(`/quotations/${id}`, {
        method: "PUT",
        body: JSON.stringify(quotation),
      });
    } catch (err) {
      console.error("Failed to update quotation:", err);
      throw err;
    }
  }, []);

  const deleteQuotation = useCallback(async (id: number) => {
    try {
      await apiFetch(`/quotations/${id}`, { method: "DELETE" });
      setQuotations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete quotation:", err);
      throw err;
    }
  }, []);

  const getQuotation = useCallback(async (id: number) => {
    try {
      const response = await apiFetch(`/quotations/${id}`);
      return response.data;
    } catch (err) {
      console.error("Failed to get quotation:", err);
      return undefined;
    }
  }, []);

  return (
    <QuotationContext.Provider
      value={{
        quotations,
        quotationsMeta,
        fetching,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        getQuotation,
        fetchQuotations,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotations = (): QuotationContextValue => {
  const ctx = useContext(QuotationContext);
  if (!ctx) throw new Error("useQuotations must be used within QuotationProvider");
  return ctx;
};
