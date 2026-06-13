import { describe, expect, it } from "vitest";

import type { Drama } from "../types/drama.types";
import { buildDrama } from "./buildDrama";

const completedDrama: Drama = {
  id: "drama-1",
  title: "Signal",
  genres: ["Thriller"],
  status: "completed",
  totalEpisodes: 16,
  currentEpisode: 16,
  rating: 5,
  review: "Excellent drama",
  finishedAt: "2026-06-01",
  createdAt: "2026-05-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

const baseInput = {
  id: completedDrama.id,
  title: completedDrama.title,
  posterUrl: "",
  genres: completedDrama.genres,
  totalEpisodes: completedDrama.totalEpisodes,
  currentEpisode: completedDrama.currentEpisode,
  rating: completedDrama.rating,
  review: completedDrama.review ?? "",
  finishedAt: completedDrama.finishedAt ?? "",
  updatedAt: "2026-06-12T00:00:00.000Z",
};

describe("buildDrama", () => {
  it("removes completed-only data when changing to plan-to-watch", () => {
    const result = buildDrama({
      ...baseInput,
      initialDrama: completedDrama,
      status: "plan-to-watch",
    });

    expect(result.status).toBe("plan-to-watch");
    expect(result.totalEpisodes).toBe(16);
    expect(result.currentEpisode).toBeUndefined();
    expect(result.rating).toBeUndefined();
    expect(result.review).toBeUndefined();
    expect(result.finishedAt).toBeUndefined();
  });

  it("removes evaluation data when changing to watching", () => {
    const result = buildDrama({
      ...baseInput,
      initialDrama: completedDrama,
      status: "watching",
      currentEpisode: 4,
    });

    expect(result.status).toBe("watching");
    expect(result.currentEpisode).toBe(4);
    expect(result.totalEpisodes).toBe(16);
    expect(result.rating).toBeUndefined();
    expect(result.review).toBeUndefined();
    expect(result.finishedAt).toBeUndefined();
  });

  it("sets progress to the total episode count when completed", () => {
    const watchingDrama: Drama = {
      ...completedDrama,
      status: "watching",
      currentEpisode: 7,
      rating: undefined,
      review: undefined,
      finishedAt: undefined,
    };

    const result = buildDrama({
      ...baseInput,
      initialDrama: watchingDrama,
      status: "completed",
      currentEpisode: 7,
      rating: 4,
      review: "A strong ending",
      finishedAt: "2026-06-12",
    });

    expect(result.status).toBe("completed");
    expect(result.totalEpisodes).toBe(16);
    expect(result.currentEpisode).toBe(16);
    expect(result.rating).toBe(4);
    expect(result.review).toBe("A strong ending");
    expect(result.finishedAt).toBe("2026-06-12");
  });

  it("keeps dropped evaluation and progress but removes the finished date", () => {
    const result = buildDrama({
      ...baseInput,
      initialDrama: completedDrama,
      status: "dropped",
      currentEpisode: 10,
    });

    expect(result.status).toBe("dropped");
    expect(result.currentEpisode).toBe(10);
    expect(result.rating).toBe(5);
    expect(result.review).toBe("Excellent drama");
    expect(result.finishedAt).toBeUndefined();
  });

  it("does not add unrelated hidden values to a new planned drama", () => {
    const result = buildDrama({
      ...baseInput,
      initialDrama: undefined,
      status: "plan-to-watch",
      currentEpisode: undefined,
      rating: undefined,
      review: "",
      finishedAt: "",
    });

    expect(result.currentEpisode).toBeUndefined();
    expect(result.rating).toBeUndefined();
    expect(result.review).toBeUndefined();
    expect(result.finishedAt).toBeUndefined();
    expect(result.createdAt).toBe(baseInput.updatedAt);
  });
});
