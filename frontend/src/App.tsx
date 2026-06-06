import { useCallback, useMemo, useState } from "react";

import { Pagination } from "./components/Pagination";
import { ResultsTable } from "./components/ResultsTable";
import { SearchBar, type SearchFormValues } from "./components/SearchBar";
import { useCompanySearch } from "./hooks/useCompanySearch";

const PAGE_LIMIT = 20;

function readSearchParams(): SearchFormValues & { page: number } {
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get("name") ?? "",
    businessId: params.get("business_id") ?? "",
    page: Number(params.get("page") ?? "1") || 1,
  };
}

function updateUrl(values: SearchFormValues, page: number) {
  const params = new URLSearchParams();
  if (values.name) {
    params.set("name", values.name);
  }
  if (values.businessId) {
    params.set("business_id", values.businessId);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  const nextUrl = query ? `?${query}` : window.location.pathname;
  window.history.replaceState(null, "", nextUrl);
}

export default function App() {
  const initial = useMemo(() => readSearchParams(), []);
  const [searchValues, setSearchValues] = useState<SearchFormValues>({
    name: initial.name,
    businessId: initial.businessId,
  });
  const [page, setPage] = useState(initial.page);
  const [hasSearched, setHasSearched] = useState(
    Boolean(initial.name || initial.businessId),
  );

  const queryParams = useMemo(
    () => ({
      name: searchValues.name || undefined,
      businessId: searchValues.businessId || undefined,
      page,
      limit: PAGE_LIMIT,
    }),
    [page, searchValues.businessId, searchValues.name],
  );

  const { data, isLoading, isError, error } = useCompanySearch(
    queryParams,
    hasSearched,
  );

  const handleSearch = useCallback((values: SearchFormValues) => {
    setSearchValues(values);
    setPage(1);
    setHasSearched(true);
    updateUrl(values, 1);
  }, []);

  const handleClear = useCallback(() => {
    setSearchValues({ name: "", businessId: "" });
    setPage(1);
    setHasSearched(false);
    updateUrl({ name: "", businessId: "" }, 1);
  }, []);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
      updateUrl(searchValues, nextPage);
    },
    [searchValues],
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">PRH Yrityshaku</h1>
        <p className="mt-2 text-slate-600">
          Hae suomalaisia yrityksiä Patentti- ja rekisterihallituksen avoimesta
          datasta.
        </p>
      </header>

      <SearchBar
        initialValues={searchValues}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {isError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Haku epäonnistui: {error instanceof Error ? error.message : "Tuntematon virhe"}
        </p>
      )}

      <ResultsTable companies={data?.results ?? []} isLoading={isLoading} />

      {data && (
        <Pagination
          page={data.page}
          limit={PAGE_LIMIT}
          totalResults={data.total_results}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
