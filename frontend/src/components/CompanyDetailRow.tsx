import type { Company } from "../types/company";

interface CompanyDetailRowProps {
  company: Company;
}

export function CompanyDetailRow({ company }: CompanyDetailRowProps) {
  return (
    <tr>
      <td colSpan={7} className="bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <div className="grid gap-2 md:grid-cols-2">
          <p>
            <span className="font-medium">Verkkosivu:</span>{" "}
            {company.website ? (
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            ) : (
              "—"
            )}
          </p>
          <p>
            <span className="font-medium">Puhelin:</span> {company.phone ?? "—"}
          </p>
          <p>
            <span className="font-medium">Osoite:</span>{" "}
            {formatAddress(company)}
          </p>
          <p>
            <span className="font-medium">Rekisteröintipäivä:</span>{" "}
            {company.registration_date ?? "—"}
          </p>
        </div>
      </td>
    </tr>
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
