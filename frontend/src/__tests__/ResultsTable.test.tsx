import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResultsTable } from "../components/ResultsTable";
import type { Company } from "../types/company";

const sampleCompany: Company = {
  business_id: "0112038-9",
  name: "Nokia Oyj",
  company_form: "Julkinen osakeyhtiö",
  registration_date: "1896-12-19",
  status: "1",
  address: {
    street: "Karakaari 7",
    post_code: "02610",
    city: "ESPOO",
  },
  website: "www.nokia.com",
  phone: null,
};

describe("ResultsTable", () => {
  it("renders company rows", () => {
    render(<ResultsTable companies={[sampleCompany]} isLoading={false} />);

    expect(screen.getByText("Nokia Oyj")).toBeInTheDocument();
    expect(screen.getByText("0112038-9")).toBeInTheDocument();
  });

  it("shows loading skeleton", () => {
    render(<ResultsTable companies={[]} isLoading={true} />);

    expect(screen.getByLabelText("Ladataan tuloksia")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<ResultsTable companies={[]} isLoading={false} />);

    expect(screen.getByText("Ei hakutuloksia")).toBeInTheDocument();
  });
});
