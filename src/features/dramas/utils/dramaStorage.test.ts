import { describe, expect, it } from "vitest";

import type { Drama } from "../types/drama.types";
import { loadDramasForUser, saveDramasForUser } from "./dramaStorage";

const drama: Drama = {
  id: "drama-1",
  title: "Signal",
  genres: ["Thriller"],
  status: "completed",
  rating: 5,
  createdAt: "2026-06-12T00:00:00.000Z",
};

describe("dramaStorage", () => {
  it("keeps each user's collection isolated", () => {
    saveDramasForUser("user-a", [drama]);
    saveDramasForUser("user-b", [
      {
        ...drama,
        id: "drama-2",
        title: "Reply 1988",
      },
    ]);

    expect(loadDramasForUser("user-a")).toEqual([drama]);
    expect(loadDramasForUser("user-b")).toEqual([
      expect.objectContaining({ id: "drama-2", title: "Reply 1988" }),
    ]);
  });

  it("returns an empty collection for corrupted JSON", () => {
    localStorage.setItem("kdrama-tracker-dramas-user-a", "{invalid");

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it("rejects arrays containing malformed drama records", () => {
    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([{ id: "broken" }]),
    );

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it("rejects unsupported drama statuses", () => {
    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([
        {
          ...drama,
          status: "paused",
        },
      ]),
    );

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it("rejects genres containing non-string values", () => {
    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([
        {
          ...drama,
          genres: ["Thriller", 123],
        },
      ]),
    );

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it.each([
    ["posterUrl", 123],
    ["startedAt", false],
    ["finishedAt", {}],
    ["review", ["not", "text"]],
    ["notes", 123],
    ["updatedAt", null],
  ])("rejects a non-string %s value", (field, value) => {
    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([
        {
          ...drama,
          [field]: value,
        },
      ]),
    );

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it.each([
    ["rating below the minimum", { rating: 0 }],
    ["rating above the maximum", { rating: 6 }],
    ["non-numeric rating", { rating: "5" }],
    ["negative total episodes", { totalEpisodes: -1 }],
    ["fractional total episodes", { totalEpisodes: 16.5 }],
    ["zero current episode", { currentEpisode: 0 }],
    ["fractional current episode", { currentEpisode: 2.5 }],
    [
      "current episode greater than total episodes",
      { currentEpisode: 17, totalEpisodes: 16 },
    ],
  ])("rejects %s", (_, invalidFields) => {
    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([
        {
          ...drama,
          ...invalidFields,
        },
      ]),
    );

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it.each([
    ["invalid started date format", { startedAt: "June 1, 2026" }],
    ["impossible started date", { startedAt: "2026-02-30" }],
    ["invalid finished date format", { finishedAt: "2026/06/12" }],
    ["impossible finished date", { finishedAt: "2026-13-01" }],
    ["invalid created timestamp", { createdAt: "not-a-date" }],
    ["invalid updated timestamp", { updatedAt: "not-a-date" }],
  ])("rejects %s", (_, invalidFields) => {
    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([
        {
          ...drama,
          ...invalidFields,
        },
      ]),
    );

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it.each([
    ["blank id", { id: "   " }],
    ["blank title", { title: "" }],
    ["malformed poster URL", { posterUrl: "not-a-url" }],
    ["unsafe poster protocol", { posterUrl: "javascript:alert(1)" }],
    ["unsupported poster protocol", { posterUrl: "ftp://example.com/a.jpg" }],
  ])("rejects %s", (_, invalidFields) => {
    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([
        {
          ...drama,
          ...invalidFields,
        },
      ]),
    );

    expect(loadDramasForUser("user-a")).toEqual([]);
  });

  it.each([
    "",
    "   ",
    "/assets/default-drama-poster.png",
    "https://example.com/poster.jpg",
    "http://example.com/poster.jpg",
  ])("accepts the poster URL %s", (posterUrl) => {
    const dramaWithPoster = {
      ...drama,
      posterUrl,
    };

    localStorage.setItem(
      "kdrama-tracker-dramas-user-a",
      JSON.stringify([dramaWithPoster]),
    );

    expect(loadDramasForUser("user-a")).toEqual([dramaWithPoster]);
  });
});
