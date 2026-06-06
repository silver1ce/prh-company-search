interface PaginationProps {
  page: number;
  limit: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  limit,
  totalResults,
  onPageChange,
}: PaginationProps) {
  if (totalResults === 0) {
    return null;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalResults);
  const totalPages = Math.ceil(totalResults / limit);

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
      <p className="text-sm text-slate-600" aria-live="polite">
        Näytetään {start}–{end} / {totalResults} tuloksesta
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Edellinen sivu"
        >
          Edellinen
        </button>
        <span className="text-sm text-slate-600">
          Sivu {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Seuraava sivu"
        >
          Seuraava
        </button>
      </div>
    </div>
  );
}
