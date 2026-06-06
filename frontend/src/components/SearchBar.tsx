import { FormEvent, useState } from "react";

export interface SearchFormValues {
  name: string;
  businessId: string;
}

interface SearchBarProps {
  initialValues: SearchFormValues;
  onSearch: (values: SearchFormValues) => void;
  onClear: () => void;
}

export function SearchBar({ initialValues, onSearch, onClear }: SearchBarProps) {
  const [name, setName] = useState(initialValues.name);
  const [businessId, setBusinessId] = useState(initialValues.businessId);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedBusinessId = businessId.trim();

    if (!trimmedName && !trimmedBusinessId) {
      setError("Anna yrityksen nimi tai Y-tunnus");
      return;
    }

    setError(null);
    onSearch({ name: trimmedName, businessId: trimmedBusinessId });
  };

  const handleClear = () => {
    setName("");
    setBusinessId("");
    setError(null);
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto_auto]"
      aria-label="Yrityshakulomake"
    >
      <div>
        <label htmlFor="company-name" className="mb-1 block text-sm font-medium">
          Yrityksen nimi
        </label>
        <input
          id="company-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Yrityksen nimi"
        />
      </div>

      <div>
        <label htmlFor="business-id" className="mb-1 block text-sm font-medium">
          Y-tunnus
        </label>
        <input
          id="business-id"
          type="text"
          value={businessId}
          onChange={(event) => setBusinessId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Y-tunnus"
        />
      </div>

      <button
        type="submit"
        className="self-end rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        aria-label="Hae yrityksiä"
      >
        Hae
      </button>

      <button
        type="button"
        onClick={handleClear}
        className="self-end rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
        aria-label="Tyhjennä haku"
      >
        Tyhjennä
      </button>

      {error && (
        <p className="text-sm text-red-600 md:col-span-4" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
