import {
  Cancel01Icon,
  Clock01Icon,
  PlayIcon,
  StarIcon,
  Tick01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DEFAULT_POSTER_URL,
  DRAMA_STATUS_LABELS,
  handlePosterError,
} from "../constants/drama.constants";
import type { Drama } from "../types/drama.types";

type DramaCardProps = {
  drama: Drama;
};

const statusIcons = {
  watching: PlayIcon,
  completed: Tick01Icon,
  "plan-to-watch": Clock01Icon,
  dropped: Cancel01Icon,
} as const;

function DramaCard({ drama }: DramaCardProps) {
  const StatusIcon = statusIcons[drama.status];
  const showsRating =
    drama.status === "completed" || drama.status === "dropped";

  return (
    <Link to={`/dramas/${drama.id}`} className="group block h-full">
      <Card className="h-full cursor-pointer gap-0 overflow-hidden border border-border/50 bg-card/50 pb-0 ring-0 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card/70 hover:shadow-xl hover:shadow-accent/10">
        <div className="relative aspect-2/3 overflow-hidden">
          <img
            src={drama.posterUrl || DEFAULT_POSTER_URL}
            onError={handlePosterError}
            alt={`${drama.title} poster`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-60" />

          <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2 sm:inset-x-3 sm:top-3">
            <Badge
              variant="outline"
              className="min-w-0 border-accent/40 bg-background/70 text-xs font-medium text-accent backdrop-blur-md"
            >
              <HugeiconsIcon
                icon={StatusIcon}
                size={12}
                color="currentColor"
                strokeWidth={2}
                className="shrink-0"
              />
              <span className="truncate leading-none">
                {DRAMA_STATUS_LABELS[drama.status]}
              </span>
            </Badge>

            {showsRating && drama.rating && (
              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-md">
                <HugeiconsIcon
                  icon={StarIcon}
                  size={12}
                  color="currentColor"
                  strokeWidth={2}
                  className="text-accent"
                />
                {drama.rating}/5
              </div>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-background/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="p-4 text-center">
              <HugeiconsIcon
                icon={ViewIcon}
                size={32}
                color="currentColor"
                strokeWidth={1.5}
                className="mx-auto mb-2 text-accent"
              />
              <p className="text-sm font-medium text-foreground sm:text-base">
                View Details
              </p>
            </div>
          </div>
        </div>

        <CardContent className="flex min-h-36 flex-col p-3 sm:p-4">
          <h3 className="truncate font-serif text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
            {drama.title}
          </h3>

          <div className="mt-2 flex min-h-5 flex-wrap gap-1.5">
            {drama.genres.length > 0 &&
              drama.genres.slice(0, 2).map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="border-0 bg-secondary/50 text-xs text-secondary-foreground/80"
                >
                  {genre}
                </Badge>
              ))}
          </div>

          <p className="mt-3 min-h-4 text-xs leading-5 text-muted-foreground">
            {drama.totalEpisodes
              ? drama.status === "watching" && drama.currentEpisode
                ? `Episode ${drama.currentEpisode} of ${drama.totalEpisodes}`
                : drama.status === "completed"
                  ? `Completed ${drama.currentEpisode ?? drama.totalEpisodes} of ${drama.totalEpisodes} episodes`
                  : drama.status === "dropped" && drama.currentEpisode
                    ? `Stopped at episode ${drama.currentEpisode} of ${drama.totalEpisodes}`
                    : `${drama.totalEpisodes} episodes`
              : "\u00A0"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default DramaCard;
