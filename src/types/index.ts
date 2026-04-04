import { Staff } from "./staff";

export interface LineItem {
  id: string; // Used for frontend key identification
  product_name: string;
  quantity: number | string;
  unit_price: number | string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  date: string;
  staff_id: number;
  pdf_url: string;
  staff?: Staff;
  items: LineItem[];
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface InvoiceResponse {
  data: Invoice[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

export interface Settings {
  invoice_company_name: string;
  invoice_footer_line1: string;
  invoice_footer_line2: string;
  company_stamp_url?: string | null;
}
