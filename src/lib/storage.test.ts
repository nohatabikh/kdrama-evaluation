import { describe, expect, it } from "vitest";

import { safeParseJson } from "./storage";

describe("safeParseJson", () => {
  it("parses valid JSON", () => {
    expect(safeParseJson('{"title":"Signal"}', {})).toEqual({
      title: "Signal",
    });
  });

  it("returns the fallback for missing or invalid JSON", () => {
    const fallback = { items: [] };

    expect(safeParseJson(null, fallback)).toBe(fallback);
    expect(safeParseJson("{invalid", fallback)).toBe(fallback);
  });
});
