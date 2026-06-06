import { useQuery } from "@tanstack/react-query";

import { searchCompanies } from "../api/companiesApi";
import type { SearchParams } from "../types/company";

export function useCompanySearch(params: SearchParams, enabled: boolean) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => searchCompanies(params),
    enabled,
  });
}
