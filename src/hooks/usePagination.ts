import { useState, useMemo } from "react";

export const usePagination = <T>(items: T[], perPage = 8) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, safePage, perPage]);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return { page: safePage, setPage: goTo, totalPages, paged, total: items.length };
};
