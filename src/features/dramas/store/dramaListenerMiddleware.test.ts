import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";

import type { Drama } from "../types/drama.types";
import { loadDramasForUser } from "../utils/dramaStorage";
import { dramaListenerMiddleware } from "./dramaListenerMiddleware";
import dramaReducer, {
  addDrama,
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

function createTestStore() {
  return configureStore({
    reducer: {
      dramas: dramaReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(dramaListenerMiddleware.middleware),
  });
}

describe("dramaListenerMiddleware", () => {
  it("persists the latest collection after add, update, and delete actions", () => {
    const store = createTestStore();

    store.dispatch(
      loadUserDramas({
        userId: "user-a",
        dramas: [],
      }),
    );

    store.dispatch(addDrama(drama));
    expect(loadDramasForUser("user-a")).toEqual([drama]);

    const updatedDrama: Drama = {
      ...drama,
      status: "completed",
      currentEpisode: 16,
      rating: 5,
    };

    store.dispatch(updateDrama(updatedDrama));
    expect(loadDramasForUser("user-a")).toEqual([updatedDrama]);

    store.dispatch(deleteDrama(drama.id));
    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it("does not persist when no user collection is active", () => {
    const store = createTestStore();

    store.dispatch(addDrama(drama));

    expect(localStorage.length).toBe(0);
  });
});
    