import type { Drama, DramaStatus } from "../types/drama.types";
import { safeParseJson } from "../../../lib/storage";

const validStatuses: DramaStatus[] = [
  "plan-to-watch",
  "watching",
  "completed",
  "dropped",
];

const isDramaStatus = (value: unknown): value is DramaStatus =>
  typeof value === "string" &&
  validStatuses.includes(value as DramaStatus);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === "string");

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isOptionalPosterUrl = (
  value: unknown,
): value is string | undefined => {
  if (value === undefined) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  if (value.trim().length === 0) {
    return true;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isOptionalPositiveInteger = (
  value: unknown,
): value is number | undefined =>
  value === undefined ||
  (typeof value === "number" && Number.isInteger(value) && value >= 1);

const isOptionalRating = (value: unknown): value is number | undefined =>
  value === undefined ||
  (typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 1 &&
    value <= 5);

const isValidDateOnly = (value: unknown): value is string => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

const isOptionalDateOnly = (
  value: unknown,
): value is string | undefined =>
  value === undefined || isValidDateOnly(value);

const isValidIsoDate = (value: unknown): value is string =>
  typeof value === "string" &&
  !Number.isNaN(Date.parse(value));

const isOptionalIsoDate = (
  value: unknown,
): value is string | undefined =>
  value === undefined || isValidIsoDate(value);

const isDrama = (drama: unknown): drama is Drama => {
  if (typeof drama !== "object" || drama === null) {
    return false;
  }

  const record = drama as Record<string, unknown>;
  const totalEpisodes = record.totalEpisodes;
  const currentEpisode = record.currentEpisode;

  return (
    isNonEmptyString(record.id) &&
    isNonEmptyString(record.title) &&
    isStringArray(record.genres) &&
    isDramaStatus(record.status) &&
    isOptionalPositiveInteger(totalEpisodes) &&
    isOptionalPositiveInteger(currentEpisode) &&
    isOptionalRating(record.rating) &&
    !(
      currentEpisode !== undefined &&
      totalEpisodes !== undefined &&
      currentEpisode > totalEpisodes
    ) &&
    isOptionalPosterUrl(record.posterUrl) &&
    isOptionalDateOnly(record.finishedAt) &&
    isOptionalString(record.review) &&
    isOptionalIsoDate(record.updatedAt) &&
    isValidIsoDate(record.createdAt)
  );
};

const normalizeDrama = (drama: Drama): Drama => ({
  id: drama.id,
  title: drama.title,
  genres: drama.genres,
  status: drama.status,
  createdAt: drama.createdAt,
  ...(drama.posterUrl !== undefined && { posterUrl: drama.posterUrl }),
  ...(drama.finishedAt !== undefined && { finishedAt: drama.finishedAt }),
  ...(drama.totalEpisodes !== undefined && {
    totalEpisodes: drama.totalEpisodes,
  }),
  ...(drama.currentEpisode !== undefined && {
    currentEpisode: drama.currentEpisode,
  }),
  ...(drama.rating !== undefined && { rating: drama.rating }),
  ...(drama.review !== undefined && { review: drama.review }),
  ...(drama.updatedAt !== undefined && { updatedAt: drama.updatedAt }),
});

const parseDramaArray = (value: unknown): Drama[] | null => {
  return Array.isArray(value) && value.every(isDrama)
    ? value.map(normalizeDrama)
    : null;
};

const getDramasStorageKey = (userId: string) =>
  `kdrama-tracker-dramas-${userId}`;

export const loadDramasForUser = (userId: string): Drama[] => {
  const storedDramas = localStorage.getItem(getDramasStorageKey(userId));
  const parsedDramas = safeParseJson<unknown>(storedDramas, []);
  const dramas = parseDramaArray(parsedDramas);

  return dramas ?? [];
};

export const saveDramasForUser = (
  userId: string,
  dramas: Drama[],
): void => {
  localStorage.setItem(
    getDramasStorageKey(userId),
    JSON.stringify(dramas),
  );
};
