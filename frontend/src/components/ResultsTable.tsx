import { Fragment, useMemo, useState } from "react";

import type { Company } from "../types/company";
import { CompanyDetailRow } from "./CompanyDetailRow";

type SortKey =
  | "name"
  | "business_id"
  | "company_form"
  | "registration_date"
  | "status";

interface ResultsTableProps {
  companies: Company[];
  isLoading: boolean;
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Nimi" },
  { key: "business_id", label: "Y-tunnus" },
  { key: "company_form", label: "Yritysmuoto" },
  { key: "registration_date", label: "Rekisteröintipäivä" },
  { key: "status", label: "Tila" },
];

export function ResultsTable({ companies, isLoading }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedCompanies = useMemo(() => {
    const copy = [...companies];
    copy.sort((left, right) => {
      const leftValue = left[sortKey] ?? "";
      const rightValue = right[sortKey] ?? "";
      const comparison = String(leftValue).localeCompare(String(rightValue), "fi");
      return sortAsc ? comparison : -comparison;
    });
    return copy;
  }, [companies, sortAsc, sortKey]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((current) => !current);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
  };

  if (isLoading) {
    return (
      <div
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        aria-label="Ladataan tuloksia"
      >
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 animate-pulse rounded bg-slate-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        Ei hakutuloksia
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm" aria-label="Hakutulokset">
        <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                <button
                  type="button"
                  onClick={() => handleSort(column.key)}
                  className="inline-flex items-center gap-1 hover:text-blue-700"
                  aria-label={`Järjestä ${column.label}`}
                >
                  {column.label}
                  {sortKey === column.key ? (sortAsc ? " ↑" : " ↓") : ""}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-semibold">Osoite</th>
            <th className="px-4 py-3 font-semibold">Yhteystiedot</th>
          </tr>
        </thead>
        <tbody>
          {sortedCompanies.map((company) => {
            const isExpanded = expandedId === company.business_id;
            return (
              <Fragment key={company.business_id}>
                <tr
                  onClick={() =>
                    setExpandedId(isExpanded ? null : company.business_id)
                  }
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                  aria-expanded={isExpanded}
                >
                  <td className="px-4 py-3 font-medium">{company.name}</td>
                  <td className="px-4 py-3">{company.business_id}</td>
                  <td className="px-4 py-3">{company.company_form ?? "—"}</td>
                  <td className="px-4 py-3">
                    {company.registration_date ?? "—"}
                  </td>
                  <td className="px-4 py-3">{company.status ?? "—"}</td>
                  <td className="px-4 py-3">{formatAddress(company)}</td>
                  <td className="px-4 py-3">
                    {company.website ?? company.phone ?? "—"}
                  </td>
                </tr>
                {isExpanded && <CompanyDetailRow company={company} />}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatAddress(company: Company): string {
  if (!company.address) {
    return "—";
  }

  const parts = [
    company.address.street,
    company.address.post_code,
    company.address.city,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "—";
}
