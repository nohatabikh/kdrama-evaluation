import type { SyntheticEvent } from "react";

import type { DramaStatus } from "../types/drama.types";

export const DEFAULT_POSTER_URL = "/assets/default-drama-poster.png";

export const DRAMA_STATUS_LABELS: Record<DramaStatus, string> = {
  "plan-to-watch": "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  dropped: "Dropped",
};

export const DRAMA_STATUS_OPTIONS = [
  { value: "plan-to-watch", label: DRAMA_STATUS_LABELS["plan-to-watch"] },
  { value: "watching", label: DRAMA_STATUS_LABELS.watching },
  { value: "completed", label: DRAMA_STATUS_LABELS.completed },
  { value: "dropped", label: DRAMA_STATUS_LABELS.dropped },
] as const satisfies ReadonlyArray<{
  value: DramaStatus;
  label: string;
}>;

export const handlePosterError = (
  event: SyntheticEvent<HTMLImageElement>,
) => {
  const image = event.currentTarget;

  if (image.src.endsWith(DEFAULT_POSTER_URL)) {
    return;
  }

  image.src = DEFAULT_POSTER_URL;
};
