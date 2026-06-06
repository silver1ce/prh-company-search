import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchBar } from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders inputs and buttons", () => {
    render(
      <SearchBar
        initialValues={{ name: "", businessId: "" }}
        onSearch={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Yrityksen nimi")).toBeInTheDocument();
    expect(screen.getByLabelText("Y-tunnus")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Hae yrityksiä" }),
    ).toBeInTheDocument();
  });

  it("submits search with name", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <SearchBar
        initialValues={{ name: "", businessId: "" }}
        onSearch={onSearch}
        onClear={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Yrityksen nimi"), "Nokia");
    await user.click(screen.getByRole("button", { name: "Hae yrityksiä" }));

    expect(onSearch).toHaveBeenCalledWith({ name: "Nokia", businessId: "" });
  });

  it("shows validation error when both fields are empty", async () => {
    const user = userEvent.setup();

    render(
      <SearchBar
        initialValues={{ name: "", businessId: "" }}
        onSearch={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Hae yrityksiä" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Anna yrityksen nimi tai Y-tunnus",
    );
  });
});
