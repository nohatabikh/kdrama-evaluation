import { describe, expect, it } from "vitest";

import type { Drama } from "../types/drama.types";
import dramaReducer, {
  addDrama,
  clearUserDramas,
  deleteDrama,
  loadUserDramas,
  updateDrama,
} from "./dramaSlice";

const drama: Drama = {
  id: "drama-1",
  title: "Signal",
  genres: ["Thriller"],
  status: "watching",
  totalEpisodes: 16,
  currentEpisode: 4,
  createdAt: "2026-06-12T00:00:00.000Z",
};

describe("dramaSlice", () => {
  it("loads the active user's saved collection", () => {
    const state = dramaReducer(
      undefined,
      loadUserDramas({
        userId: "user-a",
        dramas: [drama],
      }),
    );

    expect(state.userId).toBe("user-a");
    expect(state.items).toEqual([drama]);
  });

  it("adds, updates, and deletes dramas", () => {
    let state = dramaReducer(
      undefined,
      loadUserDramas({
        userId: "user-a",
        dramas: [],
      }),
    );

    state = dramaReducer(state, addDrama(drama));
    expect(state.items).toEqual([drama]);

    const updatedDrama = {
      ...drama,
      status: "completed" as const,
      currentEpisode: undefined,
      rating: 5,
    };

    state = dramaReducer(state, updateDrama(updatedDrama));
    expect(state.items).toEqual([updatedDrama]);

    state = dramaReducer(state, deleteDrama(drama.id));
    expect(state.items).toEqual([]);
  });

  it("clears the active user's in-memory data", () => {
    const loadedState = dramaReducer(
      undefined,
      loadUserDramas({
        userId: "user-a",
        dramas: [drama],
      }),
    );

    const clearedState = dramaReducer(loadedState, clearUserDramas());

    expect(clearedState).toEqual({ items: [], userId: null });
  });
});
