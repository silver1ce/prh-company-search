import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as companiesApi from "../api/companiesApi";
import { useCompanySearch } from "../hooks/useCompanySearch";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe("useCompanySearch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches companies when enabled", async () => {
    const mockResponse = {
      results: [
        {
          business_id: "0112038-9",
          name: "Nokia Oyj",
          company_form: null,
          registration_date: null,
          status: null,
          address: null,
          website: null,
          phone: null,
        },
      ],
      total_results: 1,
      page: 1,
    };

    vi.spyOn(companiesApi, "searchCompanies").mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useCompanySearch({ name: "Nokia", page: 1, limit: 20 }, true),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(companiesApi.searchCompanies).toHaveBeenCalledWith({
      name: "Nokia",
      page: 1,
      limit: 20,
    });
  });
});
