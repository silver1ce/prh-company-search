import type { SearchParams, SearchResponse } from "../types/company";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function searchCompanies(
  params: SearchParams,
): Promise<SearchResponse> {
  const query = new URLSearchParams();

  if (params.name) {
    query.set("name", params.name);
  }
  if (params.businessId) {
    query.set("business_id", params.businessId);
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  const response = await fetch(`${API_BASE}/api/companies?${query.toString()}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<SearchResponse>;
}
