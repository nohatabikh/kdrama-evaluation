import type { Drama, DramaStatus } from "../types/drama.types";

export type BuildDramaInput = {
  initialDrama?: Drama;
  id: string;
  title: string;
  posterUrl: string;
  genres: string[];
  status: DramaStatus;
  totalEpisodes?: number;
  currentEpisode?: number;
  rating?: number;
  review: string;
  finishedAt: string;
  updatedAt: string;
};

export function buildDrama({
  initialDrama,
  id,
  title,
  posterUrl,
  genres,
  status,
  totalEpisodes,
  currentEpisode,
  rating,
  review,
  finishedAt,
  updatedAt,
}: BuildDramaInput): Drama {
  const keepsCurrentEpisode = status === "watching" || status === "dropped";
  const keepsEvaluation = status === "completed" || status === "dropped";

  const savedCurrentEpisode =
    status === "completed" && totalEpisodes !== undefined
      ? totalEpisodes
      : keepsCurrentEpisode
        ? currentEpisode
        : undefined;

  return {
    id,
    title: title.trim(),
    posterUrl: posterUrl.trim() || undefined,
    genres,
    status,
    totalEpisodes,
    currentEpisode: savedCurrentEpisode,
    rating: keepsEvaluation ? rating : undefined,
    review: keepsEvaluation ? review.trim() || undefined : undefined,
    finishedAt:
      status === "completed" ? finishedAt || undefined : undefined,
    createdAt: initialDrama?.createdAt ?? updatedAt,
    updatedAt,
  };
}
