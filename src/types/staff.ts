export interface Staff {
  id: number;
  name: string;
  phone: string;
  signature: string | null;
  signature_url: string | null;
  created_at?: string;
  updated_at?: string;
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

export interface StaffResponse {
  data: Staff[];
  links: PaginationLinks;
  meta: PaginationMeta;
}
