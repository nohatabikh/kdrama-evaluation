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
    const showCurrentEpisode =
      status === "watching" || status === "dropped";

    const showRating =
      status === "completed" || status === "dropped";

    const showReview =
      status === "completed" || status === "dropped";

    const showFinishedAt = status === "completed";

    const savedCurrentEpisode =
      status === "completed" && totalEpisodes !== undefined
        ? totalEpisodes
        : showCurrentEpisode
          ? currentEpisode
          : initialDrama?.currentEpisode;

    return {
      id,
      title: title.trim(),
      posterUrl: posterUrl.trim() || undefined,
      genres,
      status,
      totalEpisodes,
      currentEpisode: savedCurrentEpisode,
      rating: showRating ? rating : initialDrama?.rating,
      review: showReview
        ? review.trim() || undefined
        : initialDrama?.review,
      finishedAt: showFinishedAt
        ? finishedAt || undefined
        : initialDrama?.finishedAt,
      createdAt: initialDrama?.createdAt ?? updatedAt,
      updatedAt,
    };
  }