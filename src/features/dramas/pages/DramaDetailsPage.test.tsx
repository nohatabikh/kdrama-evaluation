import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import authReducer from "../../auth/store/authSlice";
import dramaReducer from "../store/dramaSlice";
import type { Drama } from "../types/drama.types";
import DramaDetailsPage from "./DramaDetailsPage";

function renderDramaDetails(drama: Drama) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      dramas: dramaReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: "user-1",
          name: "Noha",
          email: "noha@example.com",
        },
        isAuthenticated: true,
      },
      dramas: {
        items: [drama],
        userId: "user-1",
        hydrationStatus: "loaded" as const,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/dramas/${drama.id}`]}>
        <Routes>
          <Route path="/dramas/:id" element={<DramaDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe("DramaDetailsPage", () => {
  it("shows a missing-date fallback for completed dramas without a finished date", () => {
    renderDramaDetails({
      id: "drama-1",
      title: "Signal",
      genres: ["Thriller"],
      status: "completed",
      rating: 5,
      totalEpisodes: 16,
      currentEpisode: 16,
      createdAt: "2026-06-12T00:00:00.000Z",
    });

    expect(screen.getByText("Date not provided")).toBeInTheDocument();
    expect(screen.queryByText("Not finished")).not.toBeInTheDocument();
  });
});
