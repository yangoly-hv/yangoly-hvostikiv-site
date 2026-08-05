"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getPageNumber } from "@/shared/lib/pagination";

export function useQueryPagination<T>(items: readonly T[], pageSize: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(items.length / pageSize);
  const currentPage = getPageNumber(searchParams.get("page"), totalPages);

  const currentItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, items, pageSize],
  );

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return { currentItems, currentPage, totalPages, setPage };
}
