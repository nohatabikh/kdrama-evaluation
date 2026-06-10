import type { Drama } from "../types/drama.types";
import { safeParseJson } from "../../../lib/storage";

 const isDramaArray = (value: unknown): value is Drama[] => {
    return (
      Array.isArray(value) &&
      value.every(
        (drama) =>
          typeof drama === "object" &&
          drama !== null &&
          typeof drama.id === "string" &&
          typeof drama.title === "string" &&
          Array.isArray(drama.genres) &&
          typeof drama.status === "string" &&
          typeof drama.createdAt === "string",
      )
    );
  };

 const getDramasStorageKey = (userId: string) =>
    `kdrama-tracker-dramas-${userId}`;

 export const loadDramasForUser = (userId: string): Drama[] => {
    const storedDramas = localStorage.getItem(getDramasStorageKey(userId));
    const parsedDramas = safeParseJson<unknown>(storedDramas, []);

    return isDramaArray(parsedDramas) ? parsedDramas : [];
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