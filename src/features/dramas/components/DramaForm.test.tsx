import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import authReducer from "../../auth/store/authSlice";
import dramaReducer from "../store/dramaSlice";
import type { Drama } from "../types/drama.types";
import DramaForm from "./DramaForm";

function renderDramaForm(initialDrama?: Drama) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      dramas: dramaReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <DramaForm initialDrama={initialDrama} />
      </MemoryRouter>
    </Provider>,
  );
}

describe("DramaForm validation", () => {
  it("exposes genre and rating selection state", () => {
    const initialDrama: Drama = {
      id: "drama-1",
      title: "Signal",
      genres: ["Thriller"],
      status: "completed",
      totalEpisodes: 16,
      currentEpisode: 16,
      rating: 3,
      createdAt: "2026-06-12T00:00:00.000Z",
    };

    renderDramaForm(initialDrama);

    expect(screen.getByRole("group", { name: "Genres" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thriller" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Romance" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      screen.getByRole("group", { name: /current rating 3 out of 5/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rate 3 stars/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /rate 4 stars/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows an inline title error instead of using alert", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const user = userEvent.setup();

    renderDramaForm();

    await user.click(screen.getByRole("button", { name: /add drama/i }));

    const titleInput = screen.getByLabelText(/drama title/i);
    const titleError = screen.getByText("Drama title is required.");

    expect(alertSpy).not.toHaveBeenCalled();
    expect(titleInput).toHaveAttribute("aria-invalid", "true");
    expect(titleInput).toHaveAttribute("aria-describedby", titleError.id);
    expect(titleError).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please fix the highlighted fields before saving this drama.",
    );

    alertSpy.mockRestore();
  });

  it("shows an inline current episode range error", async () => {
    const user = userEvent.setup();
    const initialDrama: Drama = {
      id: "drama-1",
      title: "Signal",
      genres: ["Thriller"],
      status: "watching",
      totalEpisodes: 16,
      currentEpisode: 4,
      createdAt: "2026-06-12T00:00:00.000Z",
    };

    renderDramaForm(initialDrama);

    const currentEpisodeInput = screen.getByLabelText(/current episode/i);

    await user.clear(currentEpisodeInput);
    await user.type(currentEpisodeInput, "17");
    await user.click(screen.getByRole("button", { name: /update drama/i }));

    const currentEpisodeError = screen.getByText(
      "Current episode cannot be greater than total episodes.",
    );

    expect(currentEpisodeInput).toHaveAttribute("aria-invalid", "true");
    expect(currentEpisodeInput).toHaveAttribute(
      "aria-describedby",
      currentEpisodeError.id,
    );
    expect(currentEpisodeError).toBeInTheDocument();
  });
});
