import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DramaFilters from "./DramaFilters";

describe("DramaFilters accessibility", () => {
  it("labels search and exposes the active status filter", async () => {
    const user = userEvent.setup();
    const onSearchTermChange = vi.fn();
    const onStatusChange = vi.fn();

    render(
      <DramaFilters
        searchTerm=""
        statusFilter="watching"
        onSearchTermChange={onSearchTermChange}
        onStatusChange={onStatusChange}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: /search dramas/i }), "s");

    expect(onSearchTermChange).toHaveBeenCalledWith("s");
    expect(
      screen.getByRole("group", { name: /filter dramas by status/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Watching" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
