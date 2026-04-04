import { useState, useCallback } from "react";

export interface FilterState {
  invoice_number: string;
  customer_name: string;
  date: string;
}

export const useInvoiceFilter = () => {
  const [filters, setFilters] = useState<FilterState>({
    invoice_number: "",
    customer_name: "",
    date: "",
  });

  const clearFilters = useCallback(() => {
    setFilters({ invoice_number: "", customer_name: "", date: "" });
  }, []);

  return { filters, setFilters, clearFilters };
};
