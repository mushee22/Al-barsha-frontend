import { useState, useCallback } from "react";

export interface QuotationFilterState {
  quotation_number: string;
  customer_name: string;
  date: string;
}

const emptyFilters = (): QuotationFilterState => ({
  quotation_number: "",
  customer_name: "",
  date: "",
});

export const useQuotationFilter = () => {
  const [filters, setFilters] = useState<QuotationFilterState>(emptyFilters);

  const clearFilters = useCallback(() => {
    setFilters(emptyFilters());
  }, []);

  return { filters, setFilters, clearFilters };
};
