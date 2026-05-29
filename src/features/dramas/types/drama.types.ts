export type DramaStatus =
  | "plan-to-watch"
  | "watching"
  | "completed"
  | "dropped";

export type StatusFilter = DramaStatus | "all";

export type Drama = {
  id: string;

  // Drama identity
  title: string;
  posterUrl?: string;
  genres: string[];

  // Watching progress
  status: DramaStatus;
  startedAt?: string;
  finishedAt?: string;
  totalEpisodes?: number;
  currentEpisode?: number;

  // Personal evaluation
  rating?: number;
  review?: string;
  notes?: string;

  // System fields
  createdAt: string;
  updatedAt?: string;
};